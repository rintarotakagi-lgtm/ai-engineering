"use client";

import { useState, useEffect, useRef } from "react";

interface ChainStep {
  id: number;
  label: string;
  type: "input" | "llm" | "gate" | "output";
  input: string;
  output: string;
  gateResult?: "pass" | "fail";
}

const CHAIN_STEPS: ChainStep[] = [
  {
    id: 0,
    label: "入力",
    type: "input",
    input: "",
    output:
      "The rapid advancement of artificial intelligence has transformed numerous industries, from healthcare diagnostics to autonomous vehicles...",
  },
  {
    id: 1,
    label: "LLM Step 1: 要約",
    type: "llm",
    input:
      "以下の英語テキストを3文以内に要約してください。",
    output:
      "AI技術の急速な発展は、医療診断から自動運転車まで多くの産業を変革している。この技術は効率を大幅に向上させる一方、倫理的な課題も提起している。社会全体でAIとの共存方法を模索する必要がある。",
  },
  {
    id: 2,
    label: "ゲート: 品質チェック",
    type: "gate",
    input: "要約は3文以内か？原文の主要ポイントを含んでいるか？",
    output: "3文以内: OK / 主要ポイント: OK",
    gateResult: "pass",
  },
  {
    id: 3,
    label: "LLM Step 2: フォーマット",
    type: "llm",
    input: "要約を以下のJSON形式に変換してください。{summary, key_points[], language}",
    output: `{
  "summary": "AI技術の急速な発展は多くの産業を変革...",
  "key_points": ["産業変革", "効率向上", "倫理的課題"],
  "language": "ja"
}`,
  },
  {
    id: 4,
    label: "出力",
    type: "output",
    input: "",
    output: "構造化された要約データが完成",
  },
];

const TYPE_STYLES: Record<string, { bg: string; border: string; accent: string }> = {
  input: {
    bg: "bg-blue-50 dark:bg-blue-900/10",
    border: "border-blue-200 dark:border-blue-800",
    accent: "bg-blue-500",
  },
  llm: {
    bg: "bg-amber-50 dark:bg-amber-900/10",
    border: "border-amber-200 dark:border-amber-800",
    accent: "bg-amber-500",
  },
  gate: {
    bg: "bg-purple-50 dark:bg-purple-900/10",
    border: "border-purple-200 dark:border-purple-800",
    accent: "bg-purple-500",
  },
  output: {
    bg: "bg-green-50 dark:bg-green-900/10",
    border: "border-green-200 dark:border-green-800",
    accent: "bg-green-500",
  },
};

export default function ChainDemo() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      return;
    }

    setActiveStep(-1);
    setIsPlaying(true);
    let step = 0;

    intervalRef.current = setInterval(() => {
      if (step >= CHAIN_STEPS.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        return;
      }
      setActiveStep(step);
      step++;
    }, 1200);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPlaying(false);
    setActiveStep(-1);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        プロンプトチェーン: 英語テキスト → 要約 → 品質チェック → 構造化
      </h3>

      {/* Chain visualization */}
      <div className="my-6 flex items-center justify-between gap-1">
        {CHAIN_STEPS.map((step, i) => {
          const style = TYPE_STYLES[step.type];
          const isActive = i <= activeStep;
          const isCurrent = i === activeStep;

          return (
            <div key={step.id} className="flex items-center gap-1 flex-1">
              <button
                onClick={() => {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  setIsPlaying(false);
                  setActiveStep(i);
                }}
                className={`relative flex h-10 w-full items-center justify-center rounded-lg border text-[10px] font-medium transition-all ${
                  isCurrent
                    ? `${style.bg} ${style.border} ring-2 ring-amber-300 dark:ring-amber-600 scale-105`
                    : isActive
                      ? `${style.bg} ${style.border}`
                      : "border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                <div
                  className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                    isActive ? style.accent : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                />
                <span className={isActive ? "text-zinc-700 dark:text-zinc-300" : ""}>
                  {step.label}
                </span>
              </button>
              {i < CHAIN_STEPS.length - 1 && (
                <svg
                  className={`h-4 w-4 shrink-0 ${
                    i < activeStep
                      ? "text-amber-400"
                      : "text-zinc-300 dark:text-zinc-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail panel */}
      {activeStep >= 0 && (
        <div
          className={`rounded-lg border p-4 ${TYPE_STYLES[CHAIN_STEPS[activeStep].type].bg} ${TYPE_STYLES[CHAIN_STEPS[activeStep].type].border}`}
        >
          {CHAIN_STEPS[activeStep].input && (
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                入力 / プロンプト
              </span>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                {CHAIN_STEPS[activeStep].input}
              </p>
            </div>
          )}
          <div>
            <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
              出力
            </span>
            <pre className="mt-1 whitespace-pre-wrap font-mono text-xs text-zinc-700 dark:text-zinc-300">
              {CHAIN_STEPS[activeStep].output}
            </pre>
          </div>
          {CHAIN_STEPS[activeStep].gateResult && (
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  CHAIN_STEPS[activeStep].gateResult === "pass"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {CHAIN_STEPS[activeStep].gateResult === "pass"
                  ? "PASS — 次のステップへ"
                  : "FAIL — 再実行"}
              </span>
            </div>
          )}
        </div>
      )}

      {activeStep < 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50">
          再生ボタンでアニメーションを開始、またはステップをクリック
        </div>
      )}

      {/* Controls */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={handlePlay}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          {isPlaying ? "一時停止" : activeStep >= 0 ? "再生し直す" : "再生"}
        </button>
        {activeStep >= 0 && (
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
