"use client";

import React, { useState, useMemo } from "react";

const SENTENCE = "猫が魚を食べた";

function tokenize(sentence: string): string[] {
  const tokens: string[] = [];
  let current = "";
  for (const ch of sentence) {
    if ("がをはにでのもへと".includes(ch)) {
      if (current) tokens.push(current);
      tokens.push(ch);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

const HEAD_NAMES = [
  "Head 1: 隣接パターン",
  "Head 2: 主語-動詞",
  "Head 3: 目的語-動詞",
  "Head 4: 自己注目",
];

const HEAD_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#a855f7"];

/**
 * Generate distinct attention patterns for each head.
 */
function generateHeadAttention(
  tokens: string[],
  headIdx: number
): number[][] {
  const n = tokens.length;
  const matrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    let sum = 0;

    for (let j = 0; j < n; j++) {
      let raw: number;

      switch (headIdx) {
        case 0:
          // Adjacent pattern: attend strongly to neighbors
          raw = Math.exp(-Math.abs(i - j) * 1.5);
          break;
        case 1:
          // Subject-verb: first content word and last word connect
          raw =
            (i === n - 1 && j === 0) || (i === 0 && j === n - 1)
              ? 3.0
              : i === j
              ? 1.0
              : 0.3;
          break;
        case 2:
          // Object-verb: middle content word and verb connect
          raw =
            (i === n - 1 && j === Math.floor(n / 2)) ||
            (i === Math.floor(n / 2) && j === n - 1)
              ? 3.0
              : i === j
              ? 0.8
              : 0.2;
          break;
        case 3:
          // Self-focused: diagonal dominant
          raw = i === j ? 5.0 : 0.3;
          break;
        default:
          raw = 1.0;
      }
      row.push(raw);
      sum += raw;
    }
    matrix.push(row.map((v) => v / sum));
  }
  return matrix;
}

function MiniHeatmap({
  tokens,
  attention,
  color,
  label,
  selected,
  onSelect,
  headIdx,
}: {
  tokens: string[];
  attention: number[][];
  color: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
  headIdx: number;
}) {
  const n = tokens.length;
  const CELL = Math.min(36, 160 / n);
  const LABEL_OFFSET = 40;
  const w = LABEL_OFFSET + n * CELL;
  const h = 20 + n * CELL;

  return (
    <button
      onClick={onSelect}
      className={`rounded-lg p-2 transition-all ${
        selected
          ? "ring-2 bg-zinc-800"
          : "bg-zinc-800/40 hover:bg-zinc-800/70"
      }`}
      style={{ outlineColor: color, outlineWidth: selected ? 2 : 0, outlineStyle: "solid" }}
    >
      <p
        className="text-[10px] font-bold mb-1 text-center"
        style={{ color }}
      >
        {label}
      </p>
      <svg width={w} height={h} className="block mx-auto">
        {/* Column labels */}
        {tokens.map((t, j) => (
          <text
            key={`c-${j}`}
            x={LABEL_OFFSET + j * CELL + CELL / 2}
            y={12}
            textAnchor="middle"
            className="text-[7px] fill-zinc-500 font-mono"
          >
            {t}
          </text>
        ))}
        {/* Row labels */}
        {tokens.map((t, i) => (
          <text
            key={`r-${i}`}
            x={LABEL_OFFSET - 4}
            y={20 + i * CELL + CELL / 2 + 3}
            textAnchor="end"
            className="text-[7px] fill-zinc-500 font-mono"
          >
            {t}
          </text>
        ))}
        {/* Cells */}
        <g transform={`translate(${LABEL_OFFSET}, 20)`}>
          {attention.map((row, i) =>
            row.map((val, j) => (
              <rect
                key={`${i}-${j}`}
                x={j * CELL}
                y={i * CELL}
                width={CELL}
                height={CELL}
                fill={color}
                opacity={Math.max(0.05, val)}
                stroke="#3f3f46"
                strokeWidth={0.3}
              />
            ))
          )}
        </g>
      </svg>
    </button>
  );
}

export default function MultiHeadDemo(): React.ReactElement {
  const tokens = useMemo(() => tokenize(SENTENCE), []);
  const [selectedHead, setSelectedHead] = useState(0);

  const allAttentions = useMemo(
    () => [0, 1, 2, 3].map((h) => generateHeadAttention(tokens, h)),
    [tokens]
  );

  // Compute concatenated output (average for visualization)
  const combined = useMemo(() => {
    const n = tokens.length;
    const result: number[][] = Array.from({ length: n }, () =>
      Array(n).fill(0)
    );
    for (let h = 0; h < 4; h++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          result[i][j] += allAttentions[h][i][j] / 4;
        }
      }
    }
    return result;
  }, [allAttentions, tokens.length]);

  const n = tokens.length;
  const DETAIL_CELL = Math.min(48, 280 / n);
  const DETAIL_LABEL = 56;
  const detailW = DETAIL_LABEL + n * DETAIL_CELL;
  const detailH = 24 + n * DETAIL_CELL;

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        文: <span className="text-amber-400 font-bold">{SENTENCE}</span>
      </p>

      {/* 4 mini heatmaps side by side */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {allAttentions.map((attn, h) => (
          <MiniHeatmap
            key={h}
            tokens={tokens}
            attention={attn}
            color={HEAD_COLORS[h]}
            label={HEAD_NAMES[h]}
            selected={selectedHead === h}
            onSelect={() => setSelectedHead(h)}
            headIdx={h}
          />
        ))}
      </div>

      {/* Detail view of selected head */}
      <div className="bg-zinc-800/50 rounded-lg p-3">
        <p className="text-xs font-bold mb-2" style={{ color: HEAD_COLORS[selectedHead] }}>
          {HEAD_NAMES[selectedHead]} — 詳細
        </p>
        <div className="overflow-x-auto">
          <svg width={detailW} height={detailH} className="block mx-auto">
            {tokens.map((t, j) => (
              <text
                key={`dc-${j}`}
                x={DETAIL_LABEL + j * DETAIL_CELL + DETAIL_CELL / 2}
                y={14}
                textAnchor="middle"
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {t}
              </text>
            ))}
            {tokens.map((t, i) => (
              <text
                key={`dr-${i}`}
                x={DETAIL_LABEL - 4}
                y={24 + i * DETAIL_CELL + DETAIL_CELL / 2 + 3}
                textAnchor="end"
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {t}
              </text>
            ))}
            <g transform={`translate(${DETAIL_LABEL}, 24)`}>
              {allAttentions[selectedHead].map((row, i) =>
                row.map((val, j) => (
                  <React.Fragment key={`${i}-${j}`}>
                    <rect
                      x={j * DETAIL_CELL}
                      y={i * DETAIL_CELL}
                      width={DETAIL_CELL}
                      height={DETAIL_CELL}
                      fill={HEAD_COLORS[selectedHead]}
                      opacity={Math.max(0.05, val)}
                      stroke="#3f3f46"
                      strokeWidth={0.5}
                    />
                    <text
                      x={j * DETAIL_CELL + DETAIL_CELL / 2}
                      y={i * DETAIL_CELL + DETAIL_CELL / 2 + 3}
                      textAnchor="middle"
                      className="text-[8px] fill-white pointer-events-none select-none"
                    >
                      {val.toFixed(2)}
                    </text>
                  </React.Fragment>
                ))
              )}
            </g>
          </svg>
        </div>
      </div>

      {/* Concat visualization */}
      <div className="bg-zinc-800/30 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          {HEAD_COLORS.map((c, h) => (
            <div key={h} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: c }} />
              <span className="text-[9px] text-zinc-500">H{h + 1}</span>
            </div>
          ))}
          <span className="text-[10px] text-zinc-400 ml-2">
            → Concat → W<sup>O</sup> → 統合出力
          </span>
        </div>
        <div className="overflow-x-auto">
          <svg width={detailW} height={detailH} className="block mx-auto">
            {tokens.map((t, j) => (
              <text
                key={`cc-${j}`}
                x={DETAIL_LABEL + j * DETAIL_CELL + DETAIL_CELL / 2}
                y={14}
                textAnchor="middle"
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {t}
              </text>
            ))}
            {tokens.map((t, i) => (
              <text
                key={`cr-${i}`}
                x={DETAIL_LABEL - 4}
                y={24 + i * DETAIL_CELL + DETAIL_CELL / 2 + 3}
                textAnchor="end"
                className="text-[9px] fill-zinc-400 font-mono"
              >
                {t}
              </text>
            ))}
            <g transform={`translate(${DETAIL_LABEL}, 24)`}>
              {combined.map((row, i) =>
                row.map((val, j) => (
                  <React.Fragment key={`${i}-${j}`}>
                    <rect
                      x={j * DETAIL_CELL}
                      y={i * DETAIL_CELL}
                      width={DETAIL_CELL}
                      height={DETAIL_CELL}
                      fill="#a1a1aa"
                      opacity={Math.max(0.08, val)}
                      stroke="#3f3f46"
                      strokeWidth={0.5}
                    />
                    <text
                      x={j * DETAIL_CELL + DETAIL_CELL / 2}
                      y={i * DETAIL_CELL + DETAIL_CELL / 2 + 3}
                      textAnchor="middle"
                      className="text-[8px] fill-white pointer-events-none select-none"
                    >
                      {val.toFixed(2)}
                    </text>
                  </React.Fragment>
                ))
              )}
            </g>
          </svg>
        </div>
        <p className="text-[10px] text-zinc-500 text-center mt-1">
          統合Attention（4ヘッドの平均）
        </p>
      </div>
    </div>
  );
}
