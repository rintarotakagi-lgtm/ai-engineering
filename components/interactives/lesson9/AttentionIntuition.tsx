"use client";

import { useState } from "react";

const SOURCE_WORDS = ["猫", "が", "魚", "を", "食べた"];
const TARGET_WORDS = ["The", "cat", "ate", "the", "fish"];

// Attention weights: target word index -> source word weights
const ATTENTION_MAP: Record<number, number[]> = {
  0: [0.1, 0.05, 0.05, 0.05, 0.75], // "The" -> loosely from "食べた" (article inferred)
  1: [0.85, 0.1, 0.02, 0.01, 0.02], // "cat" -> "猫"
  2: [0.02, 0.03, 0.05, 0.05, 0.85], // "ate" -> "食べた"
  3: [0.05, 0.05, 0.1, 0.05, 0.75], // "the" -> loosely from context
  4: [0.02, 0.02, 0.85, 0.08, 0.03], // "fish" -> "魚"
};

const SVG_W = 560;
const SVG_H = 300;
const SRC_Y = 60;
const TGT_Y = 240;
const START_X = 80;
const GAP_X = 100;

function wordX(i: number, total: number): number {
  const totalW = (total - 1) * GAP_X;
  const offsetX = (SVG_W - totalW) / 2;
  return offsetX + i * GAP_X;
}

export default function AttentionIntuition() {
  const [selectedTarget, setSelectedTarget] = useState(1);
  const weights = ATTENTION_MAP[selectedTarget] ?? [];

  const srcPositions = SOURCE_WORDS.map((_, i) => wordX(i, SOURCE_WORDS.length));
  const tgtPositions = TARGET_WORDS.map((_, i) => wordX(i, TARGET_WORDS.length));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="text-center text-xs text-zinc-400">
        ターゲット側の単語をクリックして、ソースのどこに注目しているか確認しましょう
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Labels */}
        <text x={20} y={SRC_Y + 5} className="text-[11px] fill-zinc-500 font-medium">
          Source
        </text>
        <text x={20} y={TGT_Y + 5} className="text-[11px] fill-zinc-500 font-medium">
          Target
        </text>

        {/* Attention lines */}
        {weights.map((w, si) => {
          if (w < 0.01) return null;
          const opacity = 0.15 + w * 0.85;
          const strokeW = 1 + w * 6;
          return (
            <line
              key={`line-${si}`}
              x1={srcPositions[si]}
              y1={SRC_Y + 20}
              x2={tgtPositions[selectedTarget]}
              y2={TGT_Y - 20}
              stroke="#fbbf24"
              strokeWidth={strokeW}
              opacity={opacity}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Source words */}
        {SOURCE_WORDS.map((word, i) => {
          const highlight = weights[i] > 0.3;
          return (
            <g key={`src-${i}`}>
              <rect
                x={srcPositions[i] - 28}
                y={SRC_Y - 16}
                width={56}
                height={32}
                rx={6}
                fill={highlight ? "rgba(251, 191, 36, 0.2)" : "#3f3f46"}
                stroke={highlight ? "#fbbf24" : "#52525b"}
                strokeWidth={highlight ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={srcPositions[i]}
                y={SRC_Y + 5}
                textAnchor="middle"
                className={`text-[13px] font-medium select-none ${
                  highlight ? "fill-amber-300" : "fill-zinc-300"
                } transition-all duration-300`}
              >
                {word}
              </text>
              {/* Weight label */}
              {weights[i] > 0.01 && (
                <text
                  x={srcPositions[i]}
                  y={SRC_Y + 28}
                  textAnchor="middle"
                  className="text-[9px] fill-amber-400/70 font-mono"
                >
                  {weights[i].toFixed(2)}
                </text>
              )}
            </g>
          );
        })}

        {/* Target words */}
        {TARGET_WORDS.map((word, i) => {
          const isSelected = i === selectedTarget;
          return (
            <g
              key={`tgt-${i}`}
              onClick={() => setSelectedTarget(i)}
              className="cursor-pointer"
            >
              <rect
                x={tgtPositions[i] - 28}
                y={TGT_Y - 16}
                width={56}
                height={32}
                rx={6}
                fill={isSelected ? "rgba(251, 191, 36, 0.3)" : "#3f3f46"}
                stroke={isSelected ? "#fbbf24" : "#52525b"}
                strokeWidth={isSelected ? 2.5 : 1}
                className="transition-all duration-200"
              />
              <text
                x={tgtPositions[i]}
                y={TGT_Y + 5}
                textAnchor="middle"
                className={`text-[13px] font-medium select-none ${
                  isSelected ? "fill-amber-300" : "fill-zinc-300"
                }`}
              >
                {word}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="text-center text-sm text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4">
        <span className="text-amber-400 font-medium">
          &quot;{TARGET_WORDS[selectedTarget]}&quot;
        </span>{" "}
        を生成するとき →{" "}
        <span className="text-amber-400 font-medium">
          &quot;{SOURCE_WORDS[weights.indexOf(Math.max(...weights))]}&quot;
        </span>{" "}
        に最も強く注目（重み: {Math.max(...weights).toFixed(2)}）
      </div>
    </div>
  );
}
