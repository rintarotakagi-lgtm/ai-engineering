"use client";

import React, { useState, useEffect, useCallback } from "react";

const SVG_W = 520;
const SVG_H = 520;

const BLOCKS = [
  { id: "input", label: "Input", y: 470, color: "#71717a", desc: "入力埋め込み + 位置エンコーディング" },
  { id: "mha", label: "Multi-Head\nAttention", y: 380, color: "#f59e0b", desc: "Q, K, V を生成し、複数ヘッドでAttentionを計算" },
  { id: "add-norm-1", label: "Add & Norm", y: 300, color: "#3b82f6", desc: "残差接続（入力を加算）+ Layer Normalization" },
  { id: "ffn", label: "Feed-Forward\nNetwork", y: 220, color: "#10b981", desc: "各位置ごとに独立した2層MLP: ReLU(xW₁+b₁)W₂+b₂" },
  { id: "add-norm-2", label: "Add & Norm", y: 140, color: "#3b82f6", desc: "残差接続（Attention出力を加算）+ Layer Normalization" },
  { id: "output", label: "Output", y: 60, color: "#71717a", desc: "次のTransformerブロックへ、または最終出力層へ" },
] as const;

const CENTER_X = SVG_W / 2;
const BOX_W = 160;
const BOX_H = 44;

const CONNECTIONS = [
  { from: 0, to: 1 }, // input -> mha
  { from: 1, to: 2 }, // mha -> add-norm-1
  { from: 2, to: 3 }, // add-norm-1 -> ffn
  { from: 3, to: 4 }, // ffn -> add-norm-2
  { from: 4, to: 5 }, // add-norm-2 -> output
];

// Residual connections (curved)
const RESIDUALS = [
  { from: 0, to: 2, label: "残差接続①" }, // input -> add-norm-1
  { from: 2, to: 4, label: "残差接続②" }, // add-norm-1 -> add-norm-2
];

export default function TransformerBlock(): React.ReactElement {
  const [animStep, setAnimStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  const totalSteps = BLOCKS.length;

  const advance = useCallback(() => {
    setAnimStep((prev) => {
      if (prev >= totalSteps - 1) {
        setIsPlaying(false);
        return totalSteps - 1;
      }
      return prev + 1;
    });
  }, [totalSteps]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(advance, 800);
    return () => clearInterval(timer);
  }, [isPlaying, advance]);

  const startAnimation = () => {
    setAnimStep(-1);
    setIsPlaying(true);
    // small delay so reset is visible
    setTimeout(() => setAnimStep(0), 100);
  };

  const reset = () => {
    setIsPlaying(false);
    setAnimStep(-1);
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={startAnimation}
          disabled={isPlaying}
          className={`px-4 py-1.5 rounded text-sm transition-colors ${
            isPlaying
              ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
              : "bg-amber-500 text-zinc-900 font-bold hover:bg-amber-400"
          }`}
        >
          {animStep >= totalSteps - 1 ? "もう一度" : "アニメーション開始"}
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded text-sm bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
        >
          リセット
        </button>
        {!isPlaying && animStep >= 0 && animStep < totalSteps - 1 && (
          <button
            onClick={advance}
            className="px-3 py-1.5 rounded text-sm bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
          >
            次のステップ →
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <svg width={SVG_W} height={SVG_H} className="block mx-auto">
          {/* Main connections (straight arrows) */}
          {CONNECTIONS.map(({ from, to }, idx) => {
            const fromY = BLOCKS[from].y - BOX_H / 2;
            const toY = BLOCKS[to].y + BOX_H / 2;
            const active =
              animStep >= to;
            return (
              <g key={`conn-${idx}`}>
                <line
                  x1={CENTER_X}
                  y1={fromY}
                  x2={CENTER_X}
                  y2={toY}
                  stroke={active ? "#f59e0b" : "#52525b"}
                  strokeWidth={active ? 2.5 : 1.5}
                  className="transition-all duration-500"
                />
                {/* Arrow head */}
                <polygon
                  points={`${CENTER_X},${toY} ${CENTER_X - 5},${toY + 8} ${CENTER_X + 5},${toY + 8}`}
                  fill={active ? "#f59e0b" : "#52525b"}
                  className="transition-all duration-500"
                />
              </g>
            );
          })}

          {/* Residual connections (curved) */}
          {RESIDUALS.map(({ from, to, label }, idx) => {
            const fromY = BLOCKS[from].y;
            const toY = BLOCKS[to].y;
            const curveX = CENTER_X + BOX_W / 2 + 40 + idx * 20;
            const active = animStep >= to;

            return (
              <g key={`res-${idx}`}>
                <path
                  d={`M ${CENTER_X + BOX_W / 2} ${fromY}
                      C ${curveX} ${fromY}, ${curveX} ${toY}, ${CENTER_X + BOX_W / 2} ${toY}`}
                  fill="none"
                  stroke={active ? "#60a5fa" : "#3f3f46"}
                  strokeWidth={active ? 2 : 1}
                  strokeDasharray={active ? "none" : "4 3"}
                  className="transition-all duration-500"
                />
                {/* Arrow at end */}
                <polygon
                  points={`${CENTER_X + BOX_W / 2},${toY} ${CENTER_X + BOX_W / 2 + 7},${toY - 4} ${CENTER_X + BOX_W / 2 + 7},${toY + 4}`}
                  fill={active ? "#60a5fa" : "#3f3f46"}
                  className="transition-all duration-500"
                />
                {/* Label */}
                <text
                  x={curveX + 4}
                  y={(fromY + toY) / 2 + 3}
                  className="text-[9px] fill-zinc-500"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Data flow pulse animation */}
          {isPlaying && animStep >= 0 && animStep < totalSteps - 1 && (
            <circle r={6} fill="#f59e0b" opacity={0.8}>
              <animateMotion
                dur="0.7s"
                repeatCount="indefinite"
                path={`M ${CENTER_X} ${BLOCKS[animStep].y - BOX_H / 2} L ${CENTER_X} ${BLOCKS[Math.min(animStep + 1, totalSteps - 1)].y + BOX_H / 2}`}
              />
            </circle>
          )}

          {/* Blocks */}
          {BLOCKS.map((block, idx) => {
            const isActive = animStep >= idx;
            const isCurrent = animStep === idx;
            const isHovered = hoveredBlock === idx;
            const lines = block.label.split("\n");

            return (
              <g
                key={block.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredBlock(idx)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                <rect
                  x={CENTER_X - BOX_W / 2}
                  y={block.y - BOX_H / 2}
                  width={BOX_W}
                  height={BOX_H}
                  rx={8}
                  fill={
                    isCurrent
                      ? block.color
                      : isActive
                      ? block.color + "cc"
                      : "#27272a"
                  }
                  stroke={
                    isCurrent
                      ? "#fbbf24"
                      : isHovered
                      ? "#a1a1aa"
                      : isActive
                      ? block.color
                      : "#52525b"
                  }
                  strokeWidth={isCurrent || isHovered ? 2.5 : 1.5}
                  className="transition-all duration-500"
                />
                {lines.map((line, li) => (
                  <text
                    key={li}
                    x={CENTER_X}
                    y={
                      block.y +
                      (lines.length === 1 ? 4 : -6 + li * 16)
                    }
                    textAnchor="middle"
                    className={`text-[11px] font-bold select-none transition-all duration-500 ${
                      isActive ? "fill-white" : "fill-zinc-600"
                    }`}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}

          {/* Step number indicators */}
          {BLOCKS.map((block, idx) => {
            const isActive = animStep >= idx;
            return (
              <g key={`step-${idx}`}>
                <circle
                  cx={CENTER_X - BOX_W / 2 - 20}
                  cy={block.y}
                  r={10}
                  fill={isActive ? "#f59e0b" : "#3f3f46"}
                  className="transition-all duration-500"
                />
                <text
                  x={CENTER_X - BOX_W / 2 - 20}
                  y={block.y + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-bold select-none ${
                    isActive ? "fill-zinc-900" : "fill-zinc-600"
                  }`}
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Description panel */}
      <div className="bg-zinc-800/50 rounded-lg p-3 min-h-[48px]">
        {hoveredBlock !== null ? (
          <div>
            <p className="text-xs font-bold" style={{ color: BLOCKS[hoveredBlock].color }}>
              {BLOCKS[hoveredBlock].label.replace("\n", " ")}
            </p>
            <p className="text-xs text-zinc-300 mt-1">
              {BLOCKS[hoveredBlock].desc}
            </p>
          </div>
        ) : animStep >= 0 ? (
          <div>
            <p className="text-xs font-bold" style={{ color: BLOCKS[animStep].color }}>
              Step {animStep + 1}: {BLOCKS[animStep].label.replace("\n", " ")}
            </p>
            <p className="text-xs text-zinc-300 mt-1">
              {BLOCKS[animStep].desc}
            </p>
          </div>
        ) : (
          <p className="text-xs text-zinc-500">
            「アニメーション開始」をクリックするか、各ブロックにマウスを乗せて詳細を確認してください
          </p>
        )}
      </div>

      <p className="text-xs text-zinc-500 text-center">
        1つのTransformerブロック（エンコーダ側） — 元の論文ではこれを N=6 回積み重ねる
      </p>
    </div>
  );
}
