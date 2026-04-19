"use client";

import { useState } from "react";

interface Iteration {
  id: number;
  generatorOutput: string;
  evaluatorFeedback: string;
  score: number;
  issues: string[];
  passed: boolean;
}

const ITERATIONS: Iteration[] = [
  {
    id: 1,
    generatorOutput: `def fizzbuzz(n):
  for i in range(1, n):
    if i % 3 == 0:
      print("Fizz")
    if i % 5 == 0:
      print("Buzz")
    if i % 15 == 0:
      print("FizzBuzz")
    else:
      print(i)`,
    evaluatorFeedback:
      "テスト実行結果: 3つのテストが失敗。\n1. range(1, n) は n を含まない。range(1, n+1) にすべき\n2. 15の倍数のチェックが最後にあるため、FizzやBuzzが先に出力される\n3. elseの位置が不正で、15の倍数以外がすべて数字として出力される",
    score: 30,
    issues: ["range不正", "条件順序が逆", "else位置不正"],
    passed: false,
  },
  {
    id: 2,
    generatorOutput: `def fizzbuzz(n):
  for i in range(1, n + 1):
    if i % 15 == 0:
      print("FizzBuzz")
    elif i % 3 == 0:
      print("Fizz")
    elif i % 5 == 0:
      print("Buzz")
    else:
      print(i)`,
    evaluatorFeedback:
      "テスト実行結果: 全テスト通過。\n- range(1, n+1): OK\n- FizzBuzz判定を最初に配置: OK\n- elif/elseチェーンで排他的に処理: OK\n- エッジケース(n=0, n=1, n=100): 全通過",
    score: 100,
    issues: [],
    passed: true,
  },
];

export default function EvalOptLoop() {
  const [currentIteration, setCurrentIteration] = useState(0);
  const [showPhase, setShowPhase] = useState<"generate" | "evaluate" | "both">(
    "generate"
  );

  const iteration = ITERATIONS[currentIteration];

  const handleNextPhase = () => {
    if (showPhase === "generate") {
      setShowPhase("evaluate");
    } else if (showPhase === "evaluate") {
      if (!iteration.passed && currentIteration < ITERATIONS.length - 1) {
        setCurrentIteration(currentIteration + 1);
        setShowPhase("generate");
      } else {
        setShowPhase("both");
      }
    }
  };

  const handleReset = () => {
    setCurrentIteration(0);
    setShowPhase("generate");
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        コード生成 + テスト検証ループ: FizzBuzz関数を書く
      </h3>

      {/* Loop indicator */}
      <div className="my-4 flex items-center gap-3">
        {ITERATIONS.map((iter, i) => (
          <div key={iter.id} className="flex items-center gap-3">
            {i > 0 && (
              <svg
                className={`h-4 w-4 ${
                  i <= currentIteration
                    ? "text-amber-400"
                    : "text-zinc-300 dark:text-zinc-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
            <div
              className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                i === currentIteration
                  ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-700"
                  : i < currentIteration
                    ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
              }`}
            >
              反復 {iter.id}
              {iter.passed && i <= currentIteration && (
                <span className="text-green-600 dark:text-green-400">OK</span>
              )}
              {!iter.passed && i < currentIteration && (
                <span className="text-red-500">NG</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Generator output */}
      <div
        className={`mb-3 rounded-lg border p-4 transition-all ${
          showPhase === "generate"
            ? "border-amber-200 bg-amber-50/50 ring-1 ring-amber-200 dark:border-amber-800/50 dark:bg-amber-900/10 dark:ring-amber-800"
            : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
        }`}
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            ジェネレーター（コード生成）
          </span>
          {currentIteration > 0 && showPhase === "generate" && (
            <span className="text-[10px] text-zinc-400">
              フィードバックを反映して改善
            </span>
          )}
        </div>
        <pre className="whitespace-pre-wrap rounded-md bg-zinc-900 p-3 font-mono text-xs text-green-400 dark:bg-zinc-950">
          {iteration.generatorOutput}
        </pre>
      </div>

      {/* Evaluator feedback */}
      {(showPhase === "evaluate" || showPhase === "both") && (
        <div
          className={`mb-3 rounded-lg border p-4 transition-all ${
            showPhase === "evaluate"
              ? "border-purple-200 bg-purple-50/50 ring-1 ring-purple-200 dark:border-purple-800/50 dark:bg-purple-900/10 dark:ring-purple-800"
              : "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              エバリュエーター（テスト実行）
            </span>
          </div>
          <pre className="mb-3 whitespace-pre-wrap font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {iteration.evaluatorFeedback}
          </pre>

          {/* Score bar */}
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  iteration.score >= 100
                    ? "bg-green-500"
                    : iteration.score >= 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${iteration.score}%` }}
              />
            </div>
            <span
              className={`text-xs font-bold ${
                iteration.score >= 100
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {iteration.score}%
            </span>
          </div>

          {/* Issues */}
          {iteration.issues.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {iteration.issues.map((issue, i) => (
                <span
                  key={i}
                  className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400"
                >
                  {issue}
                </span>
              ))}
            </div>
          )}

          {iteration.passed && (
            <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-2 text-center text-xs font-semibold text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              全テスト通過 — ループ完了
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex items-center gap-3">
        {showPhase !== "both" && (
          <button
            onClick={handleNextPhase}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            {showPhase === "generate"
              ? "テストを実行（評価）→"
              : !iteration.passed
                ? "フィードバックを反映して改善 →"
                : "完了"}
          </button>
        )}
        {(currentIteration > 0 || showPhase !== "generate") && (
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            最初から
          </button>
        )}
      </div>
    </div>
  );
}
