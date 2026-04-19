"use client";

import { useState, useEffect } from "react";

interface SubStep {
  subQuestion: string;
  searchResult: string;
  source: string;
}

interface MultiStepScenario {
  originalQuestion: string;
  steps: SubStep[];
  finalAnswer: string;
}

const SCENARIO: MultiStepScenario = {
  originalQuestion:
    "昨年度の売上が最も伸びた製品の、今年度の販売戦略は？",
  steps: [
    {
      subQuestion: "昨年度の売上成長率が最も高い製品は何か？",
      searchResult:
        "2024年度売上レポート: 製品別成長率 — Alpha Pro: +45%, Beta Lite: +12%, Gamma X: +28%。Alpha Proが最大の成長。",
      source: "営業部 2024年度 年次レポート",
    },
    {
      subQuestion: "Alpha Proの2025年度の販売戦略は？",
      searchResult:
        "Alpha Pro 2025年度戦略: エンタープライズ向け拡販を強化。新規パートナー10社との提携を予定。価格体系を3tier制に変更。",
      source: "事業計画書 2025年度 Alpha Pro部門",
    },
    {
      subQuestion: "Alpha Proの競合状況と市場動向は？",
      searchResult:
        "Alpha Pro市場分析: 競合製品XYZが価格攻勢。ただしAlpha Proは機能面で優位。市場全体は年15%成長の見込み。",
      source: "マーケティング部 競合分析レポート Q4",
    },
  ],
  finalAnswer: `昨年度の売上が最も伸びた製品は**Alpha Pro**で、前年比+45%の成長を達成しました。

Alpha Proの今年度の販売戦略は以下の通りです：

1. **エンタープライズ向けの拡販強化** — 新規パートナー10社との提携を予定
2. **価格体系の刷新** — 3tier制への変更で、幅広い顧客層をカバー
3. **競合対策** — 競合XYZの価格攻勢に対し、機能面の優位性を訴求

市場全体は年15%の成長が見込まれており、追い風の環境です。

（出典: 営業部年次レポート、事業計画書、競合分析レポート）`,
};

export default function MultiStepDemo() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Phases: 0=original question, 1-3=sub steps, 4=final answer
  const totalPhases = SCENARIO.steps.length + 2;

  useEffect(() => {
    if (!isPlaying) return;
    if (currentPhase >= totalPhases - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setCurrentPhase((p) => p + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentPhase, totalPhases]);

  const handlePlay = () => {
    setCurrentPhase(0);
    setIsPlaying(true);
  };

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        複雑な質問がサブ質問に分解され、段階的に検索される流れを見ましょう
      </h3>

      {/* Original question */}
      <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
          元の質問（複雑）
        </span>
        <p className="mt-1 font-medium text-zinc-800 dark:text-zinc-200">
          {SCENARIO.originalQuestion}
        </p>
      </div>

      {/* Phase indicator */}
      <div className="mb-6 flex items-center gap-1">
        {Array.from({ length: totalPhases }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setIsPlaying(false); setCurrentPhase(i); }}
            className={`h-2 flex-1 rounded-full transition-all ${
              i <= currentPhase
                ? "bg-amber-400"
                : "bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {/* Sub-steps */}
      {currentPhase >= 1 && (
        <div className="mb-4 space-y-3">
          <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            LLMがサブ質問に分解:
          </p>
          {SCENARIO.steps.map((step, i) => {
            if (i + 1 > currentPhase) return null;
            return (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    {step.subQuestion}
                  </span>
                </div>
                <div className="ml-7 mt-2 rounded border border-emerald-200 bg-emerald-50/50 p-2 dark:border-emerald-800 dark:bg-emerald-900/10">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {step.searchResult}
                  </p>
                  <span className="mt-1 inline-block text-[10px] text-zinc-400">
                    出典: {step.source}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Final answer */}
      {currentPhase >= totalPhases - 1 && (
        <div className="mb-4 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/10">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            統合された最終回答
          </span>
          <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
            {SCENARIO.finalAnswer}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          {isPlaying ? "実行中..." : "最初から再生"}
        </button>
        <button
          onClick={() => { setCurrentPhase(0); setIsPlaying(false); }}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
