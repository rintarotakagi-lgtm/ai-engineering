"use client";

import { useState } from "react";

interface FlowStep {
  label: string;
  description: string;
  highlight: string;
}

const steps: FlowStep[] = [
  {
    label: "1. mainからブランチ作成",
    description: "mainブランチから新しいfeatureブランチを切る。mainは常にデプロイ可能な状態。",
    highlight: "branch",
  },
  {
    label: "2. 開発 & コミット",
    description: "featureブランチでコードを書いてコミット。こまめにpushしてバックアップ。",
    highlight: "develop",
  },
  {
    label: "3. Pull Request作成",
    description: "変更が完成したらPRを作成。タイトル・説明・レビュアーを設定。",
    highlight: "pr",
  },
  {
    label: "4. コードレビュー",
    description: "チームメンバーがPRをレビュー。フィードバックがあれば修正してpush。",
    highlight: "review",
  },
  {
    label: "5. mainにマージ",
    description: "レビューが承認されたらmainにマージ。不要になったブランチを削除。",
    highlight: "merge",
  },
  {
    label: "6. デプロイ",
    description: "mainにマージされたらすぐにデプロイ（本番反映）。常にmain = 最新の本番。",
    highlight: "deploy",
  },
];

export default function GitHubFlowDemo(): React.ReactElement {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const w = 500;
  const h = 180;
  const mainY = 50;
  const featY = 120;

  function getOpacity(phase: string): number {
    const idx = steps.findIndex((s) => s.highlight === phase);
    if (idx < 0) return 0.2;
    if (idx <= currentStep) return 1;
    return 0.15;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto">
          {/* Main branch */}
          <line x1="40" y1={mainY} x2="460" y2={mainY} stroke="#10b981" strokeWidth={3} opacity={0.3} />
          <text x="10" y={mainY + 4} fill="#10b981" fontSize={11} fontWeight="bold">main</text>

          {/* Feature branch line */}
          <line
            x1="120" y1={mainY} x2="150" y2={featY}
            stroke="#f59e0b" strokeWidth={2} strokeDasharray="4"
            opacity={getOpacity("branch")}
          />
          <line
            x1="150" y1={featY} x2="320" y2={featY}
            stroke="#f59e0b" strokeWidth={3}
            opacity={getOpacity("develop")}
          />
          <text x="10" y={featY + 4} fill="#f59e0b" fontSize={11} fontWeight="bold"
            opacity={getOpacity("branch")}>feature</text>

          {/* Branch point */}
          <circle cx="120" cy={mainY} r={8} fill="#10b981" stroke="white" strokeWidth={2} />

          {/* Feature commits */}
          {[180, 220, 260, 320].map((x, i) => (
            <circle key={i} cx={x} cy={featY} r={7} fill="#f59e0b" stroke="white" strokeWidth={2}
              opacity={getOpacity("develop")} />
          ))}

          {/* PR indicator */}
          <rect x="330" y={featY - 12} width="40" height="24" rx="4" fill="#f59e0b"
            opacity={getOpacity("pr")} />
          <text x="350" y={featY + 4} textAnchor="middle" fill="white" fontSize={9} fontWeight="bold"
            opacity={getOpacity("pr")}>PR</text>

          {/* Review icon */}
          <circle cx="395" cy={featY} r={10} fill="#8b5cf6" stroke="white" strokeWidth={2}
            opacity={getOpacity("review")} />
          <text x="395" y={featY + 4} textAnchor="middle" fill="white" fontSize={8}
            opacity={getOpacity("review")}>Rev</text>

          {/* Merge line */}
          <line x1="395" y1={featY - 10} x2="420" y2={mainY + 8}
            stroke="#f59e0b" strokeWidth={2} strokeDasharray="4"
            opacity={getOpacity("merge")} />

          {/* Merge commit */}
          <circle cx="420" cy={mainY} r={9} fill="#8b5cf6" stroke="white" strokeWidth={2}
            opacity={getOpacity("merge")} />
          <text x="420" y={mainY + 4} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold"
            opacity={getOpacity("merge")}>M</text>

          {/* Deploy indicator */}
          <rect x="440" y={mainY - 18} width="50" height="16" rx="3" fill="#10b981"
            opacity={getOpacity("deploy")} />
          <text x="465" y={mainY - 7} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold"
            opacity={getOpacity("deploy")}>Deploy</text>
        </svg>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="font-bold text-amber-800 mb-1">{step.label}</div>
        <div className="text-sm text-amber-700">{step.description}</div>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2 flex-1 rounded-full transition ${
              i <= currentStep ? "bg-amber-400" : "bg-zinc-200"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 disabled:opacity-40"
        >
          戻る
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600 disabled:opacity-40"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
