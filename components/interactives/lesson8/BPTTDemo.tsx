"use client";

import { useState, useCallback } from "react";

const SVG_W = 620;
const SVG_H = 320;
const STEPS = 5;
const CELL_W = 56;
const CELL_H = 44;
const GAP = 100;
const START_X = 55;
const CENTER_Y = 140;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function BPTTDemo() {
  const [gradientFactor, setGradientFactor] = useState(0.7);
  const [activeStep, setActiveStep] = useState(-1);
  const [animating, setAnimating] = useState(false);

  const cellPositions = Array.from({ length: STEPS }, (_, i) => ({
    x: START_X + i * GAP,
    y: CENTER_Y,
  }));

  // Gradient magnitudes at each step (going backwards from loss)
  const gradients = Array.from({ length: STEPS }, (_, i) => {
    const dist = STEPS - 1 - i; // distance from loss
    return Math.pow(gradientFactor, dist);
  });

  const animate = useCallback(() => {
    setAnimating(true);
    setActiveStep(STEPS);
    let step = STEPS - 1;
    const iv = setInterval(() => {
      setActiveStep(step);
      step--;
      if (step < 0) {
        clearInterval(iv);
        setTimeout(() => setAnimating(false), 500);
      }
    }, 500);
    return () => clearInterval(iv);
  }, []);

  const gradientColor = (mag: number) => {
    const intensity = clamp(mag, 0, 1);
    if (intensity > 0.5) return `rgba(251, 191, 36, ${0.4 + intensity * 0.6})`;
    if (intensity > 0.1) return `rgba(251, 191, 36, ${0.2 + intensity * 0.5})`;
    return `rgba(113, 113, 122, ${0.3 + intensity * 0.3})`;
  };

  const barWidth = (mag: number) => clamp(mag * 80, 4, 80);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Controls */}
      <div className="flex gap-3 items-center justify-center flex-wrap">
        <button
          onClick={animate}
          disabled={animating}
          className="px-3 py-1 text-xs font-medium rounded-md border bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors disabled:opacity-50"
        >
          {animating ? "逆伝播中..." : "▶ BPTT を実行"}
        </button>
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400">勾配係数:</label>
          <input
            type="range"
            min={0.1}
            max={1.5}
            step={0.05}
            value={gradientFactor}
            onChange={(e) => {
              setGradientFactor(Number(e.target.value));
              setActiveStep(-1);
            }}
            className="w-28 accent-amber-500"
          />
          <span className="text-xs font-mono text-amber-400 w-8">
            {gradientFactor.toFixed(2)}
          </span>
        </div>
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="bpttArrow"
            viewBox="0 0 10 7"
            refX="0"
            refY="3.5"
            markerWidth={7}
            markerHeight={5}
            orient="auto"
          >
            <polygon points="10 0, 0 3.5, 10 7" fill="#fbbf24" />
          </marker>
          <marker
            id="bpttArrowGray"
            viewBox="0 0 10 7"
            refX="0"
            refY="3.5"
            markerWidth={7}
            markerHeight={5}
            orient="auto"
          >
            <polygon points="10 0, 0 3.5, 10 7" fill="#71717a" />
          </marker>
          <marker
            id="fwdArrow"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth={7}
            markerHeight={5}
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#71717a" />
          </marker>
        </defs>

        {/* Loss node */}
        <g>
          <circle
            cx={cellPositions[STEPS - 1].x + GAP - 10}
            cy={CENTER_Y}
            r={20}
            fill={activeStep === STEPS ? "#f59e0b" : "#52525b"}
            stroke={activeStep === STEPS ? "#fbbf24" : "#71717a"}
            strokeWidth={2}
            className="transition-all duration-300"
          />
          <text
            x={cellPositions[STEPS - 1].x + GAP - 10}
            y={CENTER_Y + 4}
            textAnchor="middle"
            className="text-[10px] fill-white font-bold"
          >
            Loss
          </text>
        </g>

        {/* Cells and connections */}
        {cellPositions.map((pos, i) => {
          const isActive = activeStep >= 0 && activeStep <= i;
          const gradMag = activeStep >= 0 ? gradients[i] : 0;

          return (
            <g key={i}>
              {/* Forward arrow to next */}
              {i < STEPS - 1 && (
                <line
                  x1={pos.x + CELL_W / 2 + 2}
                  y1={pos.y}
                  x2={cellPositions[i + 1].x - CELL_W / 2 - 6}
                  y2={pos.y}
                  stroke="#52525b"
                  strokeWidth={1.5}
                  markerEnd="url(#fwdArrow)"
                />
              )}
              {/* Forward arrow to loss */}
              {i === STEPS - 1 && (
                <line
                  x1={pos.x + CELL_W / 2 + 2}
                  y1={pos.y}
                  x2={pos.x + GAP - 34}
                  y2={pos.y}
                  stroke="#52525b"
                  strokeWidth={1.5}
                  markerEnd="url(#fwdArrow)"
                />
              )}

              {/* Backward gradient arrow (below) */}
              {i < STEPS - 1 && activeStep >= 0 && activeStep <= i && (
                <line
                  x1={cellPositions[i + 1].x - CELL_W / 2 - 2}
                  y1={pos.y + CELL_H / 2 + 16}
                  x2={pos.x + CELL_W / 2 + 8}
                  y2={pos.y + CELL_H / 2 + 16}
                  stroke="#fbbf24"
                  strokeWidth={clamp(gradients[i] * 3, 1, 4)}
                  opacity={clamp(gradients[i], 0.2, 1)}
                  markerStart="url(#bpttArrow)"
                  className="transition-all duration-400"
                />
              )}

              {/* Cell */}
              <rect
                x={pos.x - CELL_W / 2}
                y={pos.y - CELL_H / 2}
                width={CELL_W}
                height={CELL_H}
                rx={8}
                fill={isActive ? gradientColor(gradMag) : "#3f3f46"}
                stroke={isActive ? "#fbbf24" : "#71717a"}
                strokeWidth={isActive ? 2 : 1.5}
                className="transition-all duration-400"
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className="text-[10px] fill-white font-bold select-none"
              >
                t={i + 1}
              </text>

              {/* Input label */}
              <text
                x={pos.x}
                y={pos.y - CELL_H / 2 - 10}
                textAnchor="middle"
                className="text-[9px] fill-zinc-500"
              >
                x_{i + 1}
              </text>

              {/* Gradient magnitude bar */}
              {activeStep >= 0 && activeStep <= i && (
                <g>
                  <rect
                    x={pos.x - barWidth(gradMag) / 2}
                    y={pos.y + CELL_H / 2 + 30}
                    width={barWidth(gradMag)}
                    height={8}
                    rx={4}
                    fill={gradientColor(gradMag)}
                    className="transition-all duration-400"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + CELL_H / 2 + 52}
                    textAnchor="middle"
                    className="text-[8px] fill-zinc-400"
                  >
                    {gradMag.toFixed(3)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 12}
          textAnchor="middle"
          className="text-[10px] fill-zinc-500"
        >
          ← 勾配が各ステップで{" "}
          {gradientFactor < 1 ? "減衰" : gradientFactor > 1 ? "増幅" : "維持"}{" "}
          (×{gradientFactor.toFixed(2)})
        </text>
      </svg>

      {/* Explanation */}
      <div className="text-center text-sm text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4">
        {gradientFactor < 0.8 ? (
          <span>
            勾配係数 &lt; 1 →{" "}
            <span className="text-amber-400">勾配消失</span>
            ：遠い過去の勾配がほぼゼロに。長距離の依存関係を学習できません。
          </span>
        ) : gradientFactor > 1.1 ? (
          <span>
            勾配係数 &gt; 1 →{" "}
            <span className="text-red-400">勾配爆発</span>
            ：勾配が指数的に増大。学習が不安定になります。
          </span>
        ) : (
          <span>
            勾配係数 ≈ 1 →{" "}
            <span className="text-emerald-400">理想的</span>
            ：勾配が安定して伝播。しかし実際にはこれを維持するのが困難です。
          </span>
        )}
      </div>
    </div>
  );
}
