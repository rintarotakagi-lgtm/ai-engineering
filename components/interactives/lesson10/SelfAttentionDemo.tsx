"use client";

import React, { useState, useMemo } from "react";

const EXAMPLE_SENTENCES = [
  "猫が魚を食べた",
  "犬は公園で走った",
  "先生が生徒に本を渡した",
];

/**
 * Simulate attention weights for demonstration.
 * In reality these come from learned Q, K, V matrices.
 */
function computeMockAttention(tokens: string[]): number[][] {
  const n = tokens.length;
  const matrix: number[][] = [];
  // Seed-like deterministic pseudo-random based on token chars
  const charSum = (s: string) =>
    Array.from(s).reduce((a, c) => a + c.charCodeAt(0), 0);

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    let sum = 0;
    for (let j = 0; j < n; j++) {
      // Create plausible attention: self-attention is usually high,
      // nearby tokens get moderate attention, some cross-attention
      const selfBoost = i === j ? 2.0 : 0;
      const distPenalty = Math.exp(-Math.abs(i - j) * 0.3);
      const crossSignal =
        Math.sin(charSum(tokens[i]) * 0.1 + charSum(tokens[j]) * 0.07) * 0.5 +
        0.5;
      const raw = selfBoost + distPenalty + crossSignal * 1.5;
      row.push(raw);
      sum += raw;
    }
    // Normalize (softmax-like)
    matrix.push(row.map((v) => v / sum));
  }
  return matrix;
}

function tokenize(sentence: string): string[] {
  // Simple character-group based tokenization for Japanese
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

function HeatmapCell({
  value,
  row,
  col,
  selectedRow,
  selectedCol,
  onHover,
  size,
}: {
  value: number;
  row: number;
  col: number;
  selectedRow: number | null;
  selectedCol: number | null;
  onHover: (r: number | null, c: number | null) => void;
  size: number;
}) {
  const isHighlighted =
    selectedRow === row || selectedCol === col;
  const opacity = Math.max(0.05, value);

  return (
    <rect
      x={col * size}
      y={row * size}
      width={size}
      height={size}
      fill="#f59e0b"
      opacity={isHighlighted ? opacity : opacity * 0.6}
      stroke={isHighlighted ? "#fbbf24" : "#3f3f46"}
      strokeWidth={isHighlighted ? 1.5 : 0.5}
      className="cursor-pointer transition-opacity duration-200"
      onMouseEnter={() => onHover(row, col)}
      onMouseLeave={() => onHover(null, null)}
    />
  );
}

export default function SelfAttentionDemo(): React.ReactElement {
  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const sentence = customInput || EXAMPLE_SENTENCES[sentenceIdx];
  const tokens = useMemo(() => tokenize(sentence), [sentence]);
  const attention = useMemo(() => computeMockAttention(tokens), [tokens]);

  const n = tokens.length;
  const CELL_SIZE = Math.min(52, 320 / Math.max(n, 1));
  const LABEL_W = 60;
  const LABEL_H = 28;
  const matrixW = n * CELL_SIZE;
  const matrixH = n * CELL_SIZE;
  const svgW = LABEL_W + matrixW + 10;
  const svgH = LABEL_H + matrixH + 10;

  const activeRow = selectedToken ?? hoverRow;

  return (
    <div className="space-y-4">
      {/* Sentence selector */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_SENTENCES.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setSentenceIdx(i);
              setCustomInput("");
              setSelectedToken(null);
            }}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              !customInput && sentenceIdx === i
                ? "bg-amber-500 text-zinc-900 font-bold"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={customInput}
          onChange={(e) => {
            setCustomInput(e.target.value);
            setSelectedToken(null);
          }}
          placeholder="自由に文を入力..."
          className="flex-1 bg-zinc-800 border border-zinc-600 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Token selector */}
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((t, i) => (
          <button
            key={i}
            onClick={() => setSelectedToken(selectedToken === i ? null : i)}
            className={`px-2.5 py-1 rounded text-sm font-mono transition-colors ${
              selectedToken === i
                ? "bg-amber-500 text-zinc-900 font-bold"
                : activeRow === i
                ? "bg-amber-500/30 text-amber-300"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="text-xs text-zinc-500 self-center ml-2">
          ← クリックで注目トークンを選択
        </span>
      </div>

      {/* Attention heatmap */}
      <div className="overflow-x-auto">
        <svg
          width={svgW}
          height={svgH}
          className="block mx-auto"
        >
          {/* Column labels */}
          {tokens.map((t, j) => (
            <text
              key={`col-${j}`}
              x={LABEL_W + j * CELL_SIZE + CELL_SIZE / 2}
              y={LABEL_H - 6}
              textAnchor="middle"
              className="text-[10px] fill-zinc-400 font-mono"
            >
              {t}
            </text>
          ))}

          {/* Row labels */}
          {tokens.map((t, i) => (
            <text
              key={`row-${i}`}
              x={LABEL_W - 6}
              y={LABEL_H + i * CELL_SIZE + CELL_SIZE / 2 + 4}
              textAnchor="end"
              className={`text-[10px] font-mono ${
                activeRow === i ? "fill-amber-400 font-bold" : "fill-zinc-400"
              }`}
            >
              {t}
            </text>
          ))}

          {/* Heatmap cells */}
          <g transform={`translate(${LABEL_W}, ${LABEL_H})`}>
            {attention.map((row, i) =>
              row.map((val, j) => (
                <HeatmapCell
                  key={`${i}-${j}`}
                  value={val}
                  row={i}
                  col={j}
                  selectedRow={activeRow}
                  selectedCol={hoverCol}
                  onHover={(r, c) => {
                    setHoverRow(r);
                    setHoverCol(c);
                  }}
                  size={CELL_SIZE}
                />
              ))
            )}
            {/* Value labels */}
            {attention.map((row, i) =>
              row.map((val, j) => (
                <text
                  key={`val-${i}-${j}`}
                  x={j * CELL_SIZE + CELL_SIZE / 2}
                  y={i * CELL_SIZE + CELL_SIZE / 2 + 4}
                  textAnchor="middle"
                  className="text-[9px] fill-white pointer-events-none select-none"
                >
                  {val.toFixed(2)}
                </text>
              ))
            )}
          </g>
        </svg>
      </div>

      {/* Attention bar for selected token */}
      {activeRow !== null && (
        <div className="bg-zinc-800/50 rounded p-3 space-y-2">
          <p className="text-xs text-zinc-400">
            <span className="text-amber-400 font-bold">{tokens[activeRow]}</span>{" "}
            のAttention分布:
          </p>
          <div className="flex items-end gap-1 h-20">
            {attention[activeRow].map((val, j) => (
              <div
                key={j}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                <div
                  className="w-full rounded-t transition-all duration-300"
                  style={{
                    height: `${val * 72}px`,
                    backgroundColor:
                      val > 0.3
                        ? "#f59e0b"
                        : val > 0.15
                        ? "#d97706"
                        : "#78716c",
                  }}
                />
                <span className="text-[8px] text-zinc-500 mt-1 truncate w-full text-center">
                  {tokens[j]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-500 text-center">
        行: Queryトークン（何を探している？） / 列: Keyトークン（どこに注目？）
        — 値が大きいほど強い注目
      </p>
    </div>
  );
}
