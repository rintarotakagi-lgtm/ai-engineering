"use client";

import { useState, useEffect } from "react";

interface PipelineStep {
  id: number;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const STEPS: PipelineStep[] = [
  {
    id: 0,
    label: "文書",
    icon: "DOC",
    description: "社内マニュアル、FAQ、レポートなどの元文書",
    color: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  },
  {
    id: 1,
    label: "チャンク分割",
    icon: "CUT",
    description: "文書を検索しやすいサイズの断片に分割",
    color: "bg-violet-100 text-violet-700 border-violet-300 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700",
  },
  {
    id: 2,
    label: "埋め込み",
    icon: "VEC",
    description: "テキストを意味を表すベクトル（数値の配列）に変換",
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 dark:border-fuchsia-700",
  },
  {
    id: 3,
    label: "保存",
    icon: "DB",
    description: "ベクトルデータベースにインデックスとして格納",
    color: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
  },
  {
    id: 4,
    label: "質問",
    icon: "Q",
    description: "ユーザーが質問を入力",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
  },
  {
    id: 5,
    label: "検索",
    icon: "SRC",
    description: "質問ベクトルに近いチャンクをデータベースから取得",
    color: "bg-teal-100 text-teal-700 border-teal-300 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700",
  },
  {
    id: 6,
    label: "生成",
    icon: "GEN",
    description: "検索結果をLLMに渡して回答を生成",
    color: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
  },
];

export default function RAGPipeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    if (activeStep >= STEPS.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setActiveStep((s) => s + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isPlaying, activeStep]);

  const handlePlay = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setActiveStep(-1);
    setIsPlaying(false);
  };

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        RAGの全体フロー — アニメーションで流れを確認しましょう
      </h3>

      {/* Pipeline visualization */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex items-center gap-1 py-4" style={{ minWidth: 700 }}>
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center">
              {/* Step node */}
              <button
                onClick={() => { setIsPlaying(false); setActiveStep(i); }}
                className={`flex h-16 w-20 flex-col items-center justify-center rounded-xl border-2 transition-all duration-500 ${
                  i <= activeStep
                    ? step.color + " scale-105 shadow-md"
                    : "border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                <span className="text-xs font-bold">{step.icon}</span>
                <span className="mt-0.5 text-[10px] font-medium leading-tight">
                  {step.label}
                </span>
              </button>

              {/* Arrow */}
              {i < STEPS.length - 1 && (
                <div className="flex items-center px-0.5">
                  <div
                    className={`h-0.5 w-4 transition-colors duration-500 ${
                      i < activeStep
                        ? "bg-amber-400"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  />
                  <div
                    className={`h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent transition-colors duration-500 ${
                      i < activeStep
                        ? "border-l-amber-400"
                        : "border-l-zinc-200 dark:border-l-zinc-700"
                    }`}
                  />
                </div>
              )}

              {/* Separator between prep and execution phases */}
              {i === 3 && (
                <div className="mx-2 flex flex-col items-center">
                  <div className="h-12 w-px bg-zinc-300 dark:bg-zinc-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Phase labels */}
      <div className="mb-4 flex gap-4 text-xs">
        <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          準備フェーズ（1回）
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
          実行フェーズ（毎回）
        </span>
      </div>

      {/* Description */}
      <div className="mb-4 min-h-[60px] rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        {activeStep >= 0 ? (
          <div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Step {activeStep + 1}: {STEPS[activeStep].label}
            </span>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              {STEPS[activeStep].description}
            </p>
          </div>
        ) : (
          <p className="text-sm text-zinc-400">
            「再生」ボタンを押すか、各ステップをクリックしてください
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          {isPlaying ? "再生中..." : "再生"}
        </button>
        <button
          onClick={handleReset}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
