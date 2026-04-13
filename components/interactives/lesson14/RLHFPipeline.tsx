"use client";

import { useState, useEffect, useCallback } from "react";

const STEPS = [
  { id: "prompt", label: "プロンプト", sublabel: "ユーザー入力", x: 80, y: 50 },
  { id: "llm", label: "LLM (Policy)", sublabel: "応答を生成", x: 250, y: 50 },
  { id: "response", label: "応答", sublabel: "生成テキスト", x: 420, y: 50 },
  { id: "reward", label: "報酬モデル", sublabel: "スコア計算", x: 420, y: 160 },
  { id: "ppo", label: "PPO更新", sublabel: "パラメータ改善", x: 250, y: 160 },
  { id: "kl", label: "KLペナルティ", sublabel: "SFTからの乖離を制約", x: 80, y: 160 },
];

const ARROWS: { from: number; to: number; label?: string }[] = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 4, label: "reward" },
  { from: 4, to: 1, label: "更新" },
  { from: 5, to: 4, label: "制約" },
];

export default function RLHFPipeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [iteration, setIteration] = useState(0);

  const advanceStep = useCallback(() => {
    setActiveStep((prev) => {
      if (prev >= STEPS.length - 1) {
        setIteration((it) => it + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(advanceStep, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, advanceStep]);

  const handleToggle = () => {
    if (!isPlaying && activeStep === -1) setActiveStep(0);
    setIsPlaying((p) => !p);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveStep(-1);
    setIteration(0);
  };

  const BOX_W = 120;
  const BOX_H = 50;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-100">RLHFパイプライン</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            イテレーション: {iteration}
          </span>
          <button
            onClick={handleToggle}
            className="rounded-md border border-amber-500 bg-amber-500/10 px-3 py-1 text-xs text-amber-400 transition hover:bg-amber-500/20"
          >
            {isPlaying ? "一時停止" : "再生"}
          </button>
          <button
            onClick={handleReset}
            className="rounded-md border border-zinc-600 px-3 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800"
          >
            リセット
          </button>
        </div>
      </div>

      <svg viewBox="0 0 520 220" className="w-full">
        <defs>
          <marker id="rlhfArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#71717a" />
          </marker>
          <marker id="rlhfArrowActive" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Arrows */}
        {ARROWS.map((arrow, i) => {
          const from = STEPS[arrow.from];
          const to = STEPS[arrow.to];
          const isActive =
            activeStep >= 0 &&
            (arrow.from === activeStep || arrow.to === activeStep);

          // Determine start and end points based on relative positions
          let x1 = from.x;
          let y1 = from.y;
          let x2 = to.x;
          let y2 = to.y;

          if (from.y === to.y) {
            // Horizontal
            if (from.x < to.x) {
              x1 += BOX_W / 2;
              x2 -= BOX_W / 2;
            } else {
              x1 -= BOX_W / 2;
              x2 += BOX_W / 2;
            }
          } else if (from.x === to.x) {
            // Vertical
            if (from.y < to.y) {
              y1 += BOX_H / 2;
              y2 -= BOX_H / 2;
            } else {
              y1 -= BOX_H / 2;
              y2 += BOX_H / 2;
            }
          } else {
            // Diagonal: PPO -> LLM
            if (from.y > to.y) {
              y1 -= BOX_H / 2;
              y2 += BOX_H / 2;
            } else {
              y1 += BOX_H / 2;
              y2 -= BOX_H / 2;
            }
          }

          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? "#f59e0b" : "#52525b"}
                strokeWidth={isActive ? 2 : 1}
                markerEnd={isActive ? "url(#rlhfArrowActive)" : "url(#rlhfArrow)"}
                className="transition-all duration-300"
              />
              {arrow.label && (
                <text
                  x={(x1 + x2) / 2 + 6}
                  y={(y1 + y2) / 2 - 4}
                  className={`text-[8px] select-none ${isActive ? "fill-amber-400" : "fill-zinc-500"}`}
                >
                  {arrow.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Boxes */}
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          return (
            <g key={step.id} onClick={() => { setActiveStep(i); setIsPlaying(false); }} className="cursor-pointer">
              <rect
                x={step.x - BOX_W / 2}
                y={step.y - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={10}
                fill={isActive ? "#92400e" : "#27272a"}
                stroke={isActive ? "#f59e0b" : "#52525b"}
                strokeWidth={isActive ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={step.x}
                y={step.y - 2}
                textAnchor="middle"
                className={`text-[10px] font-bold select-none ${isActive ? "fill-amber-300" : "fill-white"}`}
              >
                {step.label}
              </text>
              <text
                x={step.x}
                y={step.y + 12}
                textAnchor="middle"
                className="text-[8px] fill-zinc-400 select-none"
              >
                {step.sublabel}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Step description */}
      <div className="mt-2 min-h-[2rem] rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2">
        <p className="text-xs text-zinc-300">
          {activeStep === 0 && "ユーザーのプロンプト（指示や質問）がパイプラインに入力されます。"}
          {activeStep === 1 && "LLM（現在のポリシー）がプロンプトに対する応答テキストを生成します。"}
          {activeStep === 2 && "生成された応答テキストが報酬モデルに渡されます。"}
          {activeStep === 3 && "報酬モデルが応答の品質をスコア化します（Helpful, Harmless, Honest）。"}
          {activeStep === 4 && "PPOアルゴリズムが報酬スコアに基づいてLLMのパラメータを更新します。"}
          {activeStep === 5 && "KLペナルティがSFTモデルからの乖離を制約し、報酬ハッキングを防ぎます。"}
          {activeStep === -1 && "「再生」ボタンでRLHFループのアニメーションを開始。各ボックスをクリックして詳細を確認。"}
        </p>
      </div>
    </div>
  );
}
