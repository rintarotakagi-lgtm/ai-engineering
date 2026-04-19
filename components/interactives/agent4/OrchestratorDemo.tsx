"use client";

import { useState } from "react";

interface StepData {
  phase: string;
  title: string;
  description: string;
  detail: string;
}

const STEPS: StepData[] = [
  {
    phase: "入力",
    title: "ユーザーのリクエスト",
    description: "「ユーザー認証機能を追加して。サインアップ、ログイン、パスワードリセットが必要。」",
    detail: "オーケストレーターがリクエストを受け取る",
  },
  {
    phase: "分析",
    title: "オーケストレーターがタスクを分析",
    description:
      "リクエストを分析し、必要なサブタスクを特定。ファイル構成、依存関係、実装順序を判断する。",
    detail:
      "判断結果:\n- 3つの機能は独立して実装可能\n- 共通のDB スキーマが必要\n- 認証ミドルウェアも必要",
  },
  {
    phase: "分配",
    title: "サブタスクをワーカーに割り振り",
    description: "特定した各サブタスクを専門のワーカーLLMに割り当てる。",
    detail:
      "ワーカー1: DBスキーマ + 認証ミドルウェア\nワーカー2: サインアップ機能\nワーカー3: ログイン機能\nワーカー4: パスワードリセット機能",
  },
  {
    phase: "実行",
    title: "ワーカーが並行して作業",
    description: "各ワーカーが担当のサブタスクを実行。オーケストレーターが進捗を監視。",
    detail:
      "ワーカー1: users テーブル定義 + JWTミドルウェア ... 完了\nワーカー2: /api/signup エンドポイント実装 ... 完了\nワーカー3: /api/login エンドポイント実装 ... 完了\nワーカー4: /api/reset-password 実装 ... 完了",
  },
  {
    phase: "統合",
    title: "オーケストレーターが結果を統合",
    description:
      "各ワーカーの出力を確認し、整合性をチェック。必要に応じて修正指示を出し、最終的な成果物を組み立てる。",
    detail:
      "統合チェック:\n- DBスキーマとAPIの整合性 ... OK\n- 認証フローの一貫性 ... OK\n- エラーハンドリング ... 一部修正指示\n→ 最終成果物を生成",
  },
];

const PHASE_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  "入力": { bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  "分析": { bg: "bg-amber-50 dark:bg-amber-900/10", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  "分配": { bg: "bg-purple-50 dark:bg-purple-900/10", border: "border-purple-200 dark:border-purple-800", text: "text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
  "実行": { bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-800", text: "text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  "統合": { bg: "bg-green-50 dark:bg-green-900/10", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-400", dot: "bg-green-500" },
};

export default function OrchestratorDemo() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const colors = PHASE_COLORS[step.phase];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        オーケストレーター-ワーカー: コーディングタスクの分解と統合
      </h3>

      {/* Progress indicator */}
      <div className="mb-6 flex items-center gap-1">
        {STEPS.map((s, i) => {
          const c = PHASE_COLORS[s.phase];
          return (
            <div key={i} className="flex flex-1 items-center gap-1">
              <button
                onClick={() => setCurrentStep(i)}
                className={`flex h-8 w-full items-center justify-center rounded-md text-[10px] font-medium transition-all ${
                  i === currentStep
                    ? `${c.bg} ${c.border} border ring-1 ring-amber-300 dark:ring-amber-600 ${c.text}`
                    : i < currentStep
                      ? `${c.bg} ${c.border} border ${c.text} opacity-70`
                      : "border border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                {s.phase}
              </button>
              {i < STEPS.length - 1 && (
                <svg
                  className={`h-3 w-3 shrink-0 ${
                    i < currentStep
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

      {/* Current step detail */}
      <div className={`rounded-lg border p-4 ${colors.bg} ${colors.border}`}>
        <div className="mb-2 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${colors.dot}`} />
          <h4 className={`text-sm font-semibold ${colors.text}`}>{step.title}</h4>
        </div>
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
          {step.description}
        </p>
        <div className="rounded-md border border-zinc-200/50 bg-white/50 p-3 dark:border-zinc-700/50 dark:bg-zinc-800/50">
          <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {step.detail}
          </pre>
        </div>
      </div>

      {/* Architecture diagram for distribute step */}
      {currentStep >= 2 && currentStep <= 3 && (
        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
              オーケストレーター
            </div>
            <div className="flex gap-1">
              {["DB/MW", "Signup", "Login", "Reset"].map((label, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <svg className="h-3 w-3 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div
                    className={`rounded border px-2 py-1 text-[10px] font-medium ${
                      currentStep >= 3
                        ? "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "border-zinc-200 bg-white text-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                    }`}
                  >
                    W{i + 1}: {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          ← 前へ
        </button>
        <span className="text-[10px] text-zinc-400">
          {currentStep + 1} / {STEPS.length}
        </span>
        <button
          onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === STEPS.length - 1}
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-30"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
