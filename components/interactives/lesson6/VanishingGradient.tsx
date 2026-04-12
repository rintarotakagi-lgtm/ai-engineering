"use client";

import { useState, useMemo } from "react";

// Demonstrate vanishing gradients: stack sigmoid vs ReLU layers
// Show how gradient magnitude changes as we go deeper

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}
function sigmoidDeriv(z: number) {
  const s = sigmoid(z);
  return s * (1 - s);
}
function reluDeriv(z: number) {
  return z > 0 ? 1 : 0;
}

const SVG_W = 520;
const SVG_H = 280;
const BAR_MAX_H = 180;
const BAR_W = 36;

function computeGradients(numLayers: number, activation: "sigmoid" | "relu") {
  // Simulate a forward pass with fixed weights and compute gradient magnitudes
  // For sigmoid: use z values around 0 (best case for gradient)
  // For relu: use z values > 0
  const gradients: number[] = [];
  let grad = 1.0; // start from output

  for (let i = 0; i < numLayers; i++) {
    if (activation === "sigmoid") {
      // Best case: z=0 -> σ'(0) = 0.25; typical weight ~0.5
      // Gradient scale per layer: 0.25 * 0.5 = 0.125 (but let's use just sigmoid deriv for clarity)
      grad *= sigmoidDeriv(0.5); // σ'(0.5) ≈ 0.235
    } else {
      // ReLU: deriv = 1 when z > 0
      grad *= reluDeriv(1.0); // always 1
    }
    gradients.push(grad);
  }

  return gradients.reverse(); // reverse so index 0 = first (deepest) layer
}

export default function VanishingGradient() {
  const [numLayers, setNumLayers] = useState(3);
  const [activation, setActivation] = useState<"sigmoid" | "relu">("sigmoid");

  const sigmoidGrads = useMemo(() => computeGradients(numLayers, "sigmoid"), [numLayers]);
  const reluGrads = useMemo(() => computeGradients(numLayers, "relu"), [numLayers]);

  const showBoth = true;
  const maxGrad = 1.0;

  // Bar positions
  const totalBars = numLayers;
  const groupW = showBoth ? BAR_W * 2 + 8 : BAR_W;
  const gap = Math.min(40, (SVG_W - 60) / totalBars - groupW);
  const startX = 50;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        勾配消失問題：Sigmoid vs ReLU
      </h3>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            層の数：
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={numLayers}
            onChange={(e) => setNumLayers(Number(e.target.value))}
            className="w-32 accent-amber-500"
          />
          <span className="w-6 text-center font-mono text-sm font-bold text-amber-600">
            {numLayers}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-amber-500" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Sigmoid</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-blue-500" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">ReLU</span>
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ maxWidth: 520 }}>
        {/* Y axis */}
        <line x1={40} y1={20} x2={40} y2={BAR_MAX_H + 30} stroke="#d4d4d8" strokeWidth={1} />
        <text x={14} y={30} className="text-[10px]" fill="#a1a1aa">1.0</text>
        <text x={14} y={BAR_MAX_H / 2 + 25} className="text-[10px]" fill="#a1a1aa">0.5</text>
        <text x={14} y={BAR_MAX_H + 30} className="text-[10px]" fill="#a1a1aa">0.0</text>
        {/* Grid lines */}
        <line x1={40} y1={20} x2={SVG_W - 10} y2={20} stroke="#e4e4e7" strokeWidth={0.5} strokeDasharray="4 4" />
        <line x1={40} y1={BAR_MAX_H / 2 + 20} x2={SVG_W - 10} y2={BAR_MAX_H / 2 + 20} stroke="#e4e4e7" strokeWidth={0.5} strokeDasharray="4 4" />
        <line x1={40} y1={BAR_MAX_H + 20} x2={SVG_W - 10} y2={BAR_MAX_H + 20} stroke="#e4e4e7" strokeWidth={0.5} strokeDasharray="4 4" />

        {/* Y axis label */}
        <text x={8} y={BAR_MAX_H / 2 + 20} className="text-[9px]" fill="#a1a1aa" transform={`rotate(-90, 8, ${BAR_MAX_H / 2 + 20})`} textAnchor="middle">
          勾配の大きさ
        </text>

        {/* Bars */}
        {Array.from({ length: totalBars }).map((_, i) => {
          const x = startX + i * (groupW + gap);
          const sigH = Math.max(1, (sigmoidGrads[i] / maxGrad) * BAR_MAX_H);
          const relH = Math.max(1, (reluGrads[i] / maxGrad) * BAR_MAX_H);
          const baseY = BAR_MAX_H + 20;

          return (
            <g key={i}>
              {/* Sigmoid bar */}
              <rect
                x={x}
                y={baseY - sigH}
                width={BAR_W}
                height={sigH}
                rx={4}
                fill="#f59e0b"
                opacity={0.85}
              />
              {sigmoidGrads[i] > 0.001 && (
                <text
                  x={x + BAR_W / 2}
                  y={baseY - sigH - 5}
                  textAnchor="middle"
                  className="text-[9px] font-mono"
                  fill="#d97706"
                >
                  {sigmoidGrads[i] < 0.001 ? "<0.001" : sigmoidGrads[i].toFixed(3)}
                </text>
              )}
              {sigmoidGrads[i] <= 0.001 && (
                <text
                  x={x + BAR_W / 2}
                  y={baseY - 6}
                  textAnchor="middle"
                  className="text-[8px] font-mono"
                  fill="#92400e"
                >
                  ≈0
                </text>
              )}

              {/* ReLU bar */}
              <rect
                x={x + BAR_W + 4}
                y={baseY - relH}
                width={BAR_W}
                height={relH}
                rx={4}
                fill="#3b82f6"
                opacity={0.85}
              />
              <text
                x={x + BAR_W + 4 + BAR_W / 2}
                y={baseY - relH - 5}
                textAnchor="middle"
                className="text-[9px] font-mono"
                fill="#2563eb"
              >
                {reluGrads[i].toFixed(3)}
              </text>

              {/* Layer label */}
              <text
                x={x + groupW / 2}
                y={baseY + 16}
                textAnchor="middle"
                className="text-[10px]"
                fill="#71717a"
              >
                層{i + 1}
              </text>
            </g>
          );
        })}

        {/* Direction label */}
        <text x={SVG_W / 2} y={SVG_H - 8} textAnchor="middle" className="text-[10px]" fill="#a1a1aa">
          ← 入力側（深い）　　　　出力側（浅い）→
        </text>
      </svg>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Sigmoid — 層{1}の勾配
          </p>
          <p className="font-mono text-lg font-bold text-amber-600">
            {sigmoidGrads[0] < 0.000001
              ? sigmoidGrads[0].toExponential(2)
              : sigmoidGrads[0].toFixed(6)}
          </p>
          <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
            {numLayers >= 5 ? "⚠ ほぼゼロ — 学習不能" : numLayers >= 3 ? "勾配が大幅に縮小" : "まだ学習可能"}
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">
            ReLU — 層{1}の勾配
          </p>
          <p className="font-mono text-lg font-bold text-blue-600">
            {reluGrads[0].toFixed(6)}
          </p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
            勾配が保持される
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-amber-600">ポイント：</span>
          Sigmoidの微分の最大値は約0.25です。{numLayers}層では最良でも (0.235)^{numLayers} ≈ {sigmoidGrads[0].toExponential(2)} まで縮小します。
          ReLUは z&gt;0 で微分が1なので、勾配がそのまま伝播します。
          スライダーで層数を増やして、その差を実感してください。
        </p>
      </div>
    </div>
  );
}
