"use client";

import { useState } from "react";

const PAIRS = [
  {
    instruction: "日本の首都はどこですか？",
    response: "日本の首都は東京です。東京は日本最大の都市で、政治・経済・文化の中心地です。",
  },
  {
    instruction: "Pythonでリストをソートするコードを書いて",
    response:
      "numbers = [3, 1, 4, 1, 5]\nnumbers.sort()  # [1, 1, 3, 4, 5]\n\n# または新しいリストを返す\nsorted_list = sorted(numbers)",
  },
  {
    instruction: "光合成を簡単に説明してください",
    response:
      "光合成は植物が太陽光のエネルギーを使って、二酸化炭素と水からブドウ糖と酸素を作るプロセスです。化学式: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
  },
];

const PIPELINE_STEPS = [
  { label: "事前学習済みLLM", sublabel: "次トークン予測で訓練済み" },
  { label: "指示-応答ペア", sublabel: "人間が作成した高品質データ" },
  { label: "ファインチューニング", sublabel: "指示に従う形式を学習" },
  { label: "SFTモデル", sublabel: "指示に応答できるモデル" },
];

export default function SFTDemo() {
  const [selectedPair, setSelectedPair] = useState(0);
  const [highlightStep, setHighlightStep] = useState(-1);

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-bold text-zinc-100">
        SFT: 教師ありファインチューニング
      </h3>

      {/* Pipeline diagram */}
      <svg viewBox="0 0 560 100" className="mb-4 w-full">
        <defs>
          <marker id="sftArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#71717a" />
          </marker>
        </defs>
        {PIPELINE_STEPS.map((step, i) => {
          const x = 70 + i * 140;
          const isActive = i === highlightStep;
          return (
            <g
              key={i}
              onMouseEnter={() => setHighlightStep(i)}
              onMouseLeave={() => setHighlightStep(-1)}
              className="cursor-pointer"
            >
              <rect
                x={x - 60}
                y={20}
                width={120}
                height={50}
                rx={10}
                fill={isActive ? "#92400e" : "#27272a"}
                stroke={isActive ? "#f59e0b" : "#52525b"}
                strokeWidth={isActive ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={x}
                y={40}
                textAnchor="middle"
                className={`text-[10px] font-bold select-none ${isActive ? "fill-amber-300" : "fill-white"}`}
              >
                {step.label}
              </text>
              <text x={x} y={55} textAnchor="middle" className="text-[8px] fill-zinc-400 select-none">
                {step.sublabel}
              </text>
              {i < PIPELINE_STEPS.length - 1 && (
                <line
                  x1={x + 60}
                  y1={45}
                  x2={x + 80}
                  y2={45}
                  stroke="#71717a"
                  strokeWidth={1.5}
                  markerEnd="url(#sftArrow)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Data pairs */}
      <div className="mb-3 flex gap-2">
        {PAIRS.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedPair(i)}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              i === selectedPair
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            ペア {i + 1}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Instruction（指示）
          </div>
          <p className="text-xs leading-relaxed text-zinc-200">
            {PAIRS[selectedPair].instruction}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            Response（応答）
          </div>
          <p className="whitespace-pre-wrap text-xs leading-relaxed text-zinc-200">
            {PAIRS[selectedPair].response}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] text-zinc-500">
        高品質な指示-応答ペアでモデルを微調整し、指示に従う形式を学習させる
      </p>
    </div>
  );
}
