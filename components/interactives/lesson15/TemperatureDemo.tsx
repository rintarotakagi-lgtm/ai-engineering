"use client";

import { useState, useMemo } from "react";

const BASE_LOGITS = [
  { token: "晴れ", logit: 2.5 },
  { token: "曇り", logit: 1.8 },
  { token: "雨", logit: 1.2 },
  { token: "良い", logit: 0.8 },
  { token: "快晴", logit: 0.4 },
  { token: "悪い", logit: -0.1 },
  { token: "最高", logit: -0.4 },
  { token: "微妙", logit: -0.8 },
];

function softmaxWithTemp(logits: number[], temperature: number): number[] {
  const scaled = logits.map((l) => l / temperature);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const BAR_MAX_W = 180;
const BAR_H = 20;
const CHART_X = 80;
const ROW_H = 26;

export default function TemperatureDemo() {
  const [temperature, setTemperature] = useState(1.0);

  const probs = useMemo(
    () => softmaxWithTemp(BASE_LOGITS.map((l) => l.logit), temperature),
    [temperature]
  );

  const maxProb = Math.max(...probs);
  const svgH = BASE_LOGITS.length * ROW_H + 20;

  const getLabel = () => {
    if (temperature <= 0.3) return "ほぼ決定的（Greedy）";
    if (temperature <= 0.7) return "安定的・確実";
    if (temperature <= 1.2) return "バランス（デフォルト付近）";
    if (temperature <= 1.6) return "創造的・多様";
    return "非常にランダム";
  };

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-bold text-zinc-100">
        Temperature: 確率分布の鋭さを制御
      </h3>

      <div className="mb-1 text-xs text-zinc-400">
        プロンプト: 「今日の天気は」→ 次のトークンは？
      </div>

      {/* Temperature slider */}
      <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300">
            Temperature: <span className="text-amber-400">{temperature.toFixed(2)}</span>
          </label>
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
            {getLabel()}
          </span>
        </div>
        <input
          type="range"
          min={0.1}
          max={2.0}
          step={0.05}
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="mt-2 w-full accent-amber-500"
        />
        <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
          <span>0.1 (決定的)</span>
          <span>1.0 (デフォルト)</span>
          <span>2.0 (ランダム)</span>
        </div>
      </div>

      {/* Bar chart */}
      <svg viewBox={`0 0 340 ${svgH}`} className="w-full">
        {BASE_LOGITS.map((item, i) => {
          const y = 5 + i * ROW_H;
          const barW = Math.max(1, (probs[i] / maxProb) * BAR_MAX_W);
          const isTop = probs[i] === maxProb;

          // Color intensity based on probability
          const opacity = 0.3 + probs[i] * 2;

          return (
            <g key={item.token}>
              <text
                x={CHART_X - 6}
                y={y + BAR_H / 2 + 4}
                textAnchor="end"
                className={`text-[11px] select-none ${isTop ? "fill-amber-300 font-bold" : "fill-zinc-300"}`}
              >
                {item.token}
              </text>
              <rect
                x={CHART_X}
                y={y}
                width={barW}
                height={BAR_H}
                rx={3}
                fill={isTop ? "#f59e0b" : "#71717a"}
                opacity={Math.min(1, opacity)}
                className="transition-all duration-200"
              />
              <text
                x={CHART_X + barW + 6}
                y={y + BAR_H / 2 + 4}
                className="text-[10px] fill-zinc-400 select-none"
              >
                {(probs[i] * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Entropy indicator */}
      <div className="mt-2 flex items-center gap-3">
        <div className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2">
          <span className="text-[10px] text-zinc-500">最大確率: </span>
          <span className="text-xs font-bold text-amber-400">
            {(Math.max(...probs) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2">
          <span className="text-[10px] text-zinc-500">エントロピー: </span>
          <span className="text-xs font-bold text-amber-400">
            {(-probs.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0)).toFixed(2)} bits
          </span>
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-zinc-500">
        低温 = 鋭い分布（確実） / 高温 = 平らな分布（多様・ランダム）
      </p>
    </div>
  );
}
