"use client";

import { useRef, useState } from "react";
import { loadPyodideSingleton, PYTHON_WRAPPER } from "@/lib/pyodide";

export default function PythonRunner({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const runningRef = useRef(false);

  async function runCode() {
    if (runningRef.current) return;
    runningRef.current = true;
    setOutput(null);
    setIsError(false);
    setLoading(true);

    try {
      const pyodide = await loadPyodideSingleton();
      setLoading(false);

      pyodide.globals.set("_user_code", code);
      await pyodide.runPythonAsync(PYTHON_WRAPPER);

      const stdout = pyodide.globals.get("_out_val") as string;
      const stderr = pyodide.globals.get("_err_val") as string;

      if (stderr) {
        setOutput(stderr);
        setIsError(true);
      } else {
        setOutput(stdout || "(出力なし)");
      }
    } catch (err: unknown) {
      setLoading(false);
      setOutput(err instanceof Error ? err.message : String(err));
      setIsError(true);
    } finally {
      runningRef.current = false;
    }
  }

  const lineCount = code.split("\n").length;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-700">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-zinc-400">Python</span>
        </div>
        <button
          onClick={runCode}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              読み込み中...
            </>
          ) : (
            "▶ 実行"
          )}
        </button>
      </div>

      {/* Code editor */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full resize-none bg-zinc-950 p-4 font-mono text-sm leading-relaxed text-zinc-100 focus:outline-none"
        rows={Math.max(4, lineCount + 1)}
      />

      {/* Output panel */}
      {output !== null ? (
        <div
          className={`border-t ${isError ? "border-red-900/60 bg-red-950/30" : "border-zinc-800 bg-zinc-900"}`}
        >
          <p className="px-4 pt-2 text-xs font-medium text-zinc-500">
            {isError ? "❌ エラー" : "▶ 出力"}
          </p>
          <pre
            className={`px-4 pb-3 pt-1 font-mono text-sm ${isError ? "text-red-400" : "text-green-400"}`}
          >
            {output}
          </pre>
        </div>
      ) : (
        <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-zinc-500">
          ▶ 実行 を押してコードを動かしてみましょう。初回は数秒かかります。
        </div>
      )}
    </div>
  );
}
