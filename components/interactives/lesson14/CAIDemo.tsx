"use client";

import { useState } from "react";

type Scenario = {
  prompt: string;
  principle: string;
  steps: {
    label: string;
    content: string;
  }[];
};

const SCENARIOS: Scenario[] = [
  {
    prompt: "会社の同僚をいじめる方法を教えて",
    principle: "有害な行為を助長してはいけない。代わりに建設的な解決策を提案すること。",
    steps: [
      {
        label: "元の応答",
        content:
          "同僚をいじめるにはいくつかの方法があります。まず、陰口を広める、仕事を押し付ける、孤立させる...",
      },
      {
        label: "AI批評（Critique）",
        content:
          "この応答は職場いじめを助長しており、憲法の「有害な行為を助長してはいけない」に違反しています。被害者の精神的健康に深刻な影響を与え、法的問題にも発展する可能性があります。",
      },
      {
        label: "修正された応答（Revision）",
        content:
          "職場でのいじめは深刻な問題であり、お手伝いすることはできません。もし職場の人間関係でお悩みでしたら、以下の建設的なアプローチをお勧めします：\n・直接的かつ丁寧なコミュニケーション\n・上司やHR部門への相談\n・社外のカウンセリングの活用",
      },
    ],
  },
  {
    prompt: "地球は平らですか？",
    principle: "科学的に正確な情報を提供すること。誤った情報を肯定してはいけない。",
    steps: [
      {
        label: "元の応答",
        content:
          "地球が平らかどうかは議論が分かれるところで、フラットアース論を支持する人も多くいます。どちらが正しいかは個人の判断に委ねられます。",
      },
      {
        label: "AI批評（Critique）",
        content:
          "この応答は科学的に確立された事実を「議論が分かれる」と表現しており、憲法の「科学的に正確な情報を提供する」に違反しています。地球が球体であることは圧倒的な科学的証拠に裏付けられています。",
      },
      {
        label: "修正された応答（Revision）",
        content:
          "いいえ、地球は平らではありません。地球はほぼ球体（正確には赤道方向にわずかに膨らんだ回転楕円体）です。これは衛星写真、重力測定、船の水平線での見え方など、多くの科学的証拠で確認されています。",
      },
    ],
  },
];

export default function CAIDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const scenario = SCENARIOS[scenarioIdx];

  const handleScenarioChange = (idx: number) => {
    setScenarioIdx(idx);
    setCurrentStep(0);
  };

  const stepColors = [
    { border: "border-red-500/50", bg: "bg-red-500/5", label: "text-red-400" },
    { border: "border-amber-500/50", bg: "bg-amber-500/5", label: "text-amber-400" },
    { border: "border-emerald-500/50", bg: "bg-emerald-500/5", label: "text-emerald-400" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-bold text-zinc-100">
        Constitutional AI: 批評-修正ループ
      </h3>

      {/* Scenario selector */}
      <div className="mb-3 flex gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => handleScenarioChange(i)}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              i === scenarioIdx
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            シナリオ {i + 1}
          </button>
        ))}
      </div>

      {/* Prompt */}
      <div className="mb-3 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Prompt
        </span>
        <p className="mt-1 text-xs text-zinc-200">{scenario.prompt}</p>
      </div>

      {/* Principle */}
      <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
          憲法（Constitution）
        </span>
        <p className="mt-1 text-xs text-zinc-300">{scenario.principle}</p>
      </div>

      {/* Step navigation */}
      <div className="mb-3 flex gap-2">
        {scenario.steps.map((step, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`flex-1 rounded-md border px-2 py-1.5 text-[10px] font-bold transition ${
              i === currentStep
                ? `${stepColors[i].border} ${stepColors[i].bg} ${stepColors[i].label}`
                : "border-zinc-700 text-zinc-500 hover:bg-zinc-800"
            }`}
          >
            {i + 1}. {step.label}
          </button>
        ))}
      </div>

      {/* Current step content */}
      <div
        className={`rounded-xl border p-3 transition-all ${stepColors[currentStep].border} ${stepColors[currentStep].bg}`}
      >
        <div className={`mb-1.5 text-[10px] font-bold uppercase tracking-wider ${stepColors[currentStep].label}`}>
          {scenario.steps[currentStep].label}
        </div>
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-200">
          {scenario.steps[currentStep].content}
        </p>
      </div>

      {/* Progress arrows */}
      <div className="mt-3 flex items-center justify-center gap-1">
        {scenario.steps.map((_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i <= currentStep ? "bg-amber-400" : "bg-zinc-700"
              }`}
            />
            {i < scenario.steps.length - 1 && (
              <div className={`h-0.5 w-6 ${i < currentStep ? "bg-amber-400" : "bg-zinc-700"}`} />
            )}
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-[10px] text-zinc-500">
        AIが自分の応答を憲法に照らして批評し、修正することで品質を向上させる
      </p>
    </div>
  );
}
