"use client";

import { useState, useRef } from "react";
import type { Challenge } from "@/lib/types";
import { loadPyodideSingleton, isPyodideLoaded, PYTHON_WRAPPER } from "@/lib/pyodide";

export default function ChallengeRunner({ data }: { data: Challenge }) {
  const [code, setCode] = useState(data.starterCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.slice(0, start) + "    " + code.slice(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput(null);
    setIsError(false);
    try {
      const pyodide = await loadPyodideSingleton();
      pyodide.globals.set("_user_code", code);
      await pyodide.runPythonAsync(PYTHON_WRAPPER);
      const out = pyodide.globals.get("_out_val") as string;
      const err = pyodide.globals.get("_err_val") as string;
      if (err) {
        setOutput(err);
        setIsError(true);
      } else {
        setOutput(out || "（出力なし）");
        setIsError(false);
      }
    } catch (e) {
      setOutput(String(e));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-50/30 dark:border-amber-800/50 dark:bg-amber-950/10">
      {/* Header */}
      <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-800/50 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0 rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
            チャレンジ
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{data.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {data.description}
            </p>
          </div>
        </div>

        {/* Hint / Expected toggles */}
        <div className="mt-3 flex flex-wrap gap-2">
          {data.hint && (
            <button
              onClick={() => setShowHint((v) => !v)}
              className="rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-700 dark:bg-transparent dark:text-amber-400"
            >
              {showHint ? "ヒントを隠す" : "💡 ヒントを見る"}
            </button>
          )}
          {data.expectedOutput && (
            <button
              onClick={() => setShowExpected((v) => !v)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-transparent dark:text-zinc-400"
            >
              {showExpected ? "期待出力を隠す" : "📋 期待出力を確認"}
            </button>
          )}
        </div>

        {showHint && data.hint && (
          <div className="mt-3 rounded-xl bg-amber-100 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            💡 {data.hint}
          </div>
        )}
        {showExpected && data.expectedOutput && (
          <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-900 px-4 py-3 text-sm text-zinc-100 dark:bg-zinc-800">
            {data.expectedOutput}
          </pre>
        )}
      </div>

      {/* Editor */}
      <div className="relative bg-zinc-900 dark:bg-zinc-800">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full resize-none bg-transparent px-5 py-4 font-mono text-sm text-zinc-100 outline-none"
          style={{ minHeight: "180px", lineHeight: "1.6" }}
        />
      </div>

      {/* Run button + output */}
      <div className="border-t border-amber-200 bg-white px-5 py-4 dark:border-amber-800/50 dark:bg-zinc-900">
        <button
          onClick={runCode}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {isPyodideLoaded() ? "実行中..." : "Python を読み込み中..."}
            </>
          ) : (
            <>▶ 実行</>
          )}
        </button>

        {output !== null && (
          <pre
            className={`mt-4 overflow-x-auto rounded-xl px-4 py-3 text-sm ${
              isError
                ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            }`}
          >
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}
