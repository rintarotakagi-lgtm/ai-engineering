"use client";

import { useState, useEffect, useCallback } from "react";

interface LoopStep {
  id: number;
  label: string;
  description: string;
  detail: string;
  color: string;
}

const LOOP_STEPS: LoopStep[] = [
  {
    id: 0,
    label: "Assemble",
    description: "プロンプトを組み立てる",
    detail:
      "システム指示 + 会話履歴 + 前回のツール結果をまとめて、LLMに送るプロンプトを構築します。",
    color: "text-blue-500",
  },
  {
    id: 1,
    label: "Call LLM",
    description: "LLMを呼び出す",
    detail:
      "組み立てたプロンプトをClaude APIに送信し、レスポンスを待ちます。",
    color: "text-purple-500",
  },
  {
    id: 2,
    label: "Parse",
    description: "レスポンスを解析",
    detail:
      "LLMの応答を解析し、テキスト応答なのかツール呼び出しなのかを判定します。",
    color: "text-amber-500",
  },
  {
    id: 3,
    label: "Tool Call?",
    description: "ツール呼び出し？",
    detail:
      "ツール呼び出しが含まれていれば次のステップへ。なければタスク完了としてループ終了。",
    color: "text-red-500",
  },
  {
    id: 4,
    label: "Execute",
    description: "ツールを実行",
    detail:
      "指定されたツール（例: search_files）を実行し、結果を取得します。",
    color: "text-green-500",
  },
  {
    id: 5,
    label: "Add Result",
    description: "結果を追加",
    detail:
      "ツールの実行結果を会話履歴に追加し、次のループでLLMが参照できるようにします。",
    color: "text-cyan-500",
  },
];

const EXAMPLE_SCENARIO = [
  { step: 0, message: 'プロンプト: "README.mdを探して要約して"' },
  { step: 1, message: "Claude APIに送信中..." },
  { step: 2, message: 'レスポンス: tool_use "search_files"' },
  { step: 3, message: "ツール呼び出しあり → 実行へ" },
  { step: 4, message: 'search_files("README.md") → 1件ヒット' },
  { step: 5, message: "検索結果を会話履歴に追加" },
  { step: 0, message: "プロンプト: システム指示 + 履歴 + 検索結果" },
  { step: 1, message: "Claude APIに送信中..." },
  { step: 2, message: 'レスポンス: tool_use "read_file"' },
  { step: 3, message: "ツール呼び出しあり → 実行へ" },
  { step: 4, message: 'read_file("/project/README.md") → 内容取得' },
  { step: 5, message: "ファイル内容を会話履歴に追加" },
  { step: 0, message: "プロンプト: システム指示 + 履歴 + ファイル内容" },
  { step: 1, message: "Claude APIに送信中..." },
  { step: 2, message: "レスポンス: テキスト応答（要約）" },
  { step: 3, message: "ツール呼び出しなし → 完了！" },
];

export default function ReActDemo() {
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  const activeStep =
    currentIdx >= 0 ? EXAMPLE_SCENARIO[currentIdx] : null;

  const advance = useCallback(() => {
    setCurrentIdx((prev) => {
      const next = prev + 1;
      if (next >= EXAMPLE_SCENARIO.length) {
        setIsPlaying(false);
        return prev;
      }
      if (next > 0 && EXAMPLE_SCENARIO[next].step === 0 && EXAMPLE_SCENARIO[prev].step !== 0) {
        setLoopCount((c) => c + 1);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(advance, 1200);
    return () => clearInterval(timer);
  }, [isPlaying, advance]);

  function start() {
    setCurrentIdx(0);
    setLoopCount(1);
    setIsPlaying(true);
  }

  function reset() {
    setCurrentIdx(-1);
    setIsPlaying(false);
    setLoopCount(0);
  }

  const isFinished = currentIdx >= EXAMPLE_SCENARIO.length - 1;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          ReActループの動作デモ
        </h3>
        <div className="flex gap-2">
          {currentIdx < 0 && (
            <button
              onClick={start}
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
            >
              再生
            </button>
          )}
          {currentIdx >= 0 && !isFinished && (
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {isPlaying ? "一時停止" : "再開"}
            </button>
          )}
          {currentIdx >= 0 && (
            <button
              onClick={reset}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              リセット
            </button>
          )}
        </div>
      </div>

      {/* Loop counter */}
      {loopCount > 0 && (
        <div className="mb-4 text-xs text-zinc-500 dark:text-zinc-400">
          ループ回数: <span className="font-bold text-amber-500">{loopCount}</span>
          {isFinished && (
            <span className="ml-2 rounded bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              完了
            </span>
          )}
        </div>
      )}

      {/* Loop visualization */}
      <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {LOOP_STEPS.map((step) => {
          const isActive = activeStep?.step === step.id;
          return (
            <div
              key={step.id}
              className={`rounded-lg border p-3 text-center transition-all ${
                isActive
                  ? "border-amber-400 bg-amber-50 shadow-md dark:border-amber-500 dark:bg-amber-900/20"
                  : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
              }`}
            >
              <div
                className={`text-lg font-bold ${isActive ? "text-amber-500" : "text-zinc-300 dark:text-zinc-600"}`}
              >
                {step.id + 1}
              </div>
              <div
                className={`text-[10px] font-semibold ${isActive ? step.color : "text-zinc-400 dark:text-zinc-500"}`}
              >
                {step.label}
              </div>
              <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                {step.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow arrows */}
      <div className="mb-4 flex items-center justify-center">
        <svg width="280" height="40" viewBox="0 0 280 40" className="text-zinc-300 dark:text-zinc-600">
          <defs>
            <marker id="arrow-react" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="currentColor" />
            </marker>
          </defs>
          <path
            d="M10,20 L120,20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrow-react)"
          />
          <text x="65" y="14" textAnchor="middle" className="fill-zinc-400 text-[10px]">
            ツール呼び出しあり
          </text>
          <path
            d="M160,20 L270,20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrow-react)"
          />
          <text x="215" y="14" textAnchor="middle" className="fill-zinc-400 text-[10px]">
            ツール呼び出しなし → 完了
          </text>
        </svg>
      </div>

      {/* Current step detail */}
      {activeStep && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-1 text-xs font-semibold text-amber-500">
            Step {currentIdx + 1}/{EXAMPLE_SCENARIO.length}
          </div>
          <div className="text-sm text-zinc-700 dark:text-zinc-200">
            {activeStep.message}
          </div>
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            {LOOP_STEPS[activeStep.step].detail}
          </div>
        </div>
      )}

      {currentIdx < 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center text-sm text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500">
          「再生」ボタンを押して、エージェントループの動きを見てみましょう
        </div>
      )}
    </div>
  );
}
