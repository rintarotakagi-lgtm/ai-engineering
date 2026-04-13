"use client";

import { useState } from "react";

interface FlowStep {
  label: string;
  description: string;
  icon: string;
}

const flowSteps: FlowStep[] = [
  {
    label: "1. ブランチで作業",
    description: "featureブランチを作って、コードを変更・コミットする",
    icon: "🌿",
  },
  {
    label: "2. GitHubにpush",
    description: "git push でブランチをGitHubにアップロード",
    icon: "☁️",
  },
  {
    label: "3. PR作成",
    description: "GitHub上で「Pull Request」を作成。タイトルと説明を書く",
    icon: "📝",
  },
  {
    label: "4. コードレビュー",
    description: "チームメンバーが変更内容を確認。コメントや修正依頼をする",
    icon: "👀",
  },
  {
    label: "5. 修正（必要なら）",
    description: "レビューで指摘があれば修正してpush。PRに自動的に反映される",
    icon: "🔧",
  },
  {
    label: "6. 承認 & マージ",
    description: "レビューが通ったらmainにマージ。変更が本番に反映される",
    icon: "✅",
  },
];

export default function PRConcept(): React.ReactElement {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500 mb-2">
        各ステップをクリックして詳細を見てみましょう
      </div>

      {/* Flow diagram */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {flowSteps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep(i)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition text-xs font-medium min-w-[80px] ${
                i === activeStep
                  ? "bg-amber-100 border-2 border-amber-400 text-amber-800"
                  : i < activeStep
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-500"
              }`}
            >
              <span className="text-xl mb-1">{s.icon}</span>
              <span className="text-center leading-tight">
                {s.label.replace(/^\d+\.\s/, "")}
              </span>
            </button>
            {i < flowSteps.length - 1 && (
              <svg width="20" height="20" className="text-zinc-300 flex-shrink-0">
                <path d="M4 10 L16 10 M12 6 L16 10 L12 14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Active step detail */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="font-bold text-amber-800 mb-1">
          {flowSteps[activeStep].icon} {flowSteps[activeStep].label}
        </div>
        <div className="text-sm text-amber-700">
          {flowSteps[activeStep].description}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 disabled:opacity-40"
        >
          戻る
        </button>
        <button
          onClick={() =>
            setActiveStep(Math.min(flowSteps.length - 1, activeStep + 1))
          }
          disabled={activeStep === flowSteps.length - 1}
          className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600 disabled:opacity-40"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
