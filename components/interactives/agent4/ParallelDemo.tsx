"use client";

import { useState, useEffect, useRef } from "react";

type Phase = "idle" | "sending" | "processing" | "aggregating" | "done";

interface WorkerResult {
  id: number;
  label: string;
  focus: string;
  result: string;
  score?: string;
}

const TASK = "この製品レビューは安全なコンテンツですか？\n「このヘッドフォンは最高！音質が素晴らしく、ノイズキャンセリングも完璧。ただし付属ケーブルの品質はイマイチ。」";

const WORKERS: WorkerResult[] = [
  {
    id: 1,
    label: "モデル A",
    focus: "暴力・ヘイト検出",
    result: "安全: 暴力的・差別的な表現なし",
    score: "安全 (0.98)",
  },
  {
    id: 2,
    label: "モデル B",
    focus: "スパム・虚偽検出",
    result: "安全: 実体験に基づくレビュー、スパムの兆候なし",
    score: "安全 (0.95)",
  },
  {
    id: 3,
    label: "モデル C",
    focus: "個人情報・機密検出",
    result: "安全: 個人情報や機密データの記載なし",
    score: "安全 (0.99)",
  },
];

const FINAL_RESULT = "最終判定: 安全 (3/3モデルが安全と判定)";

export default function ParallelDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [workersDone, setWorkersDone] = useState<boolean[]>([false, false, false]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    setPhase("sending");
    setWorkersDone([false, false, false]);

    timerRef.current = setTimeout(() => {
      setPhase("processing");

      // Workers finish at staggered times
      const delays = [1200, 800, 1500];
      const newDone = [false, false, false];

      delays.forEach((delay, i) => {
        setTimeout(() => {
          newDone[i] = true;
          setWorkersDone([...newDone]);

          if (newDone.every(Boolean)) {
            setTimeout(() => setPhase("aggregating"), 400);
            setTimeout(() => setPhase("done"), 1200);
          }
        }, delay);
      });
    }, 600);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
    setWorkersDone([false, false, false]);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        並列化（投票パターン）: 同じタスクを3つのモデルに同時に処理させる
      </h3>

      {/* Task */}
      <div className="my-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-[10px] font-semibold text-zinc-400">タスク</span>
        <p className="mt-1 whitespace-pre-wrap text-xs text-zinc-700 dark:text-zinc-300">
          {TASK}
        </p>
      </div>

      {/* Parallel workers */}
      <div className="my-4 grid gap-3 md:grid-cols-3">
        {WORKERS.map((worker, i) => {
          const isProcessing = phase === "processing" || phase === "aggregating" || phase === "done";
          const isDone = workersDone[i];

          return (
            <div
              key={worker.id}
              className={`rounded-lg border p-3 transition-all ${
                isDone
                  ? "border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/10"
                  : isProcessing
                    ? "border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-900/10"
                    : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {worker.label}
                </span>
                {isDone && (
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400">
                    完了
                  </span>
                )}
                {isProcessing && !isDone && (
                  <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    処理中...
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                視点: {worker.focus}
              </p>
              {isDone && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-zinc-700 dark:text-zinc-300">
                    {worker.result}
                  </p>
                  <p className="text-[10px] font-semibold text-green-600 dark:text-green-400">
                    {worker.score}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aggregation arrow */}
      {(phase === "aggregating" || phase === "done") && (
        <div className="flex flex-col items-center gap-2">
          <svg
            className="h-6 w-6 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
            結果を集約（多数決）
          </div>
        </div>
      )}

      {/* Final result */}
      {phase === "done" && (
        <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-800/50 dark:bg-green-900/10">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            {FINAL_RESULT}
          </p>
          <p className="mt-1 text-[10px] text-green-600 dark:text-green-500">
            複数モデルの合意により、単一モデルより高い信頼性を実現
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        {phase === "idle" && (
          <button
            onClick={handleStart}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            並列処理を開始
          </button>
        )}
        {phase !== "idle" && (
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  );
}
