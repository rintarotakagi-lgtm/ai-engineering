"use client";

import { useState } from "react";

const SENTENCES: {
  tokens: string[];
  answers: Record<number, { word: string; prob: number }[]>;
}[] = [
  {
    tokens: ["猫", "が", "魚", "を", "食べ", "た"],
    answers: {
      0: [
        { word: "猫", prob: 0.42 },
        { word: "犬", prob: 0.28 },
        { word: "鳥", prob: 0.15 },
      ],
      2: [
        { word: "魚", prob: 0.48 },
        { word: "餌", prob: 0.22 },
        { word: "ご飯", prob: 0.14 },
      ],
      4: [
        { word: "食べ", prob: 0.55 },
        { word: "捕まえ", prob: 0.2 },
        { word: "残し", prob: 0.08 },
      ],
    },
  },
  {
    tokens: ["東京", "は", "日本", "の", "首都", "です"],
    answers: {
      0: [
        { word: "東京", prob: 0.62 },
        { word: "京都", prob: 0.12 },
        { word: "大阪", prob: 0.08 },
      ],
      2: [
        { word: "日本", prob: 0.71 },
        { word: "世界", prob: 0.09 },
        { word: "国", prob: 0.06 },
      ],
      4: [
        { word: "首都", prob: 0.58 },
        { word: "中心", prob: 0.18 },
        { word: "都市", prob: 0.12 },
      ],
    },
  },
];

const SVG_W = 560;
const SVG_H = 260;
const TOKEN_W = 60;
const TOKEN_H = 32;

export default function MLMDemo() {
  const [sentIdx, setSentIdx] = useState(0);
  const [maskIdx, setMaskIdx] = useState<number | null>(null);

  const sent = SENTENCES[sentIdx];
  const tokens = sent.tokens;
  const gap = 12;
  const totalW = tokens.length * TOKEN_W + (tokens.length - 1) * gap;
  const startX = (SVG_W - totalW) / 2;
  const tokensY = 80;

  const predictions =
    maskIdx !== null && sent.answers[maskIdx]
      ? sent.answers[maskIdx]
      : null;

  const availableMasks = Object.keys(sent.answers).map(Number);

  function cx(i: number) {
    return startX + i * (TOKEN_W + gap) + TOKEN_W / 2;
  }

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      {/* Controls */}
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <span>文を選択:</span>
        {SENTENCES.map((s, i) => (
          <button
            key={i}
            className={`rounded-md border px-3 py-1 transition ${
              sentIdx === i
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"
            }`}
            onClick={() => {
              setSentIdx(i);
              setMaskIdx(null);
            }}
          >
            {s.tokens.join("")}
          </button>
        ))}
      </div>
      <p className="mb-2 text-xs text-zinc-500">
        マスク可能なトークン（色付き）をクリックして [MASK] に変換
      </p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Title */}
        <text
          x={SVG_W / 2}
          y={28}
          textAnchor="middle"
          className="text-[13px] fill-zinc-300 font-bold"
        >
          Masked Language Model (MLM)
        </text>

        {/* Attention arrows from context to mask */}
        {maskIdx !== null &&
          tokens.map((_, i) => {
            if (i === maskIdx) return null;
            const fromX = cx(i);
            const toX = cx(maskIdx);
            const fromY = tokensY - TOKEN_H / 2 - 2;
            const midY = fromY - 14 - Math.abs(i - maskIdx) * 8;
            return (
              <path
                key={`att-${i}`}
                d={`M${fromX},${fromY} Q${(fromX + toX) / 2},${midY} ${toX},${fromY}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth={1.5}
                opacity={0.5}
                markerEnd="url(#mlmArrow)"
              />
            );
          })}

        <defs>
          <marker
            id="mlmArrow"
            markerWidth="7"
            markerHeight="5"
            refX="7"
            refY="2.5"
            orient="auto"
          >
            <path d="M0,0 L7,2.5 L0,5 Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Token row */}
        {tokens.map((t, i) => {
          const x = cx(i);
          const isMasked = maskIdx === i;
          const canMask = availableMasks.includes(i);
          return (
            <g
              key={i}
              onClick={() => canMask && setMaskIdx(i === maskIdx ? null : i)}
              className={canMask ? "cursor-pointer" : ""}
            >
              <rect
                x={x - TOKEN_W / 2}
                y={tokensY - TOKEN_H / 2}
                width={TOKEN_W}
                height={TOKEN_H}
                rx={6}
                fill={
                  isMasked
                    ? "#92400e"
                    : canMask
                    ? "#3f3f46"
                    : "#27272a"
                }
                stroke={
                  isMasked
                    ? "#f59e0b"
                    : canMask
                    ? "#71717a"
                    : "#3f3f46"
                }
                strokeWidth={isMasked ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={x}
                y={tokensY + 5}
                textAnchor="middle"
                className={`text-[12px] font-bold select-none ${
                  isMasked
                    ? "fill-amber-400"
                    : canMask
                    ? "fill-white"
                    : "fill-zinc-500"
                }`}
              >
                {isMasked ? "[MASK]" : t}
              </text>
            </g>
          );
        })}

        {/* Left context label */}
        {maskIdx !== null && maskIdx > 0 && (
          <text
            x={cx(Math.max(0, maskIdx - 1))}
            y={tokensY + TOKEN_H / 2 + 16}
            textAnchor="middle"
            className="text-[9px] fill-zinc-500"
          >
            ← 左文脈
          </text>
        )}
        {/* Right context label */}
        {maskIdx !== null && maskIdx < tokens.length - 1 && (
          <text
            x={cx(Math.min(tokens.length - 1, maskIdx + 1))}
            y={tokensY + TOKEN_H / 2 + 16}
            textAnchor="middle"
            className="text-[9px] fill-zinc-500"
          >
            右文脈 →
          </text>
        )}

        {/* Predictions */}
        {predictions && (
          <g>
            <text
              x={SVG_W / 2}
              y={160}
              textAnchor="middle"
              className="text-[11px] fill-zinc-400"
            >
              BERTの予測（両方向の文脈から）:
            </text>
            {predictions.map((p, i) => {
              const barW = p.prob * 180;
              const y = 175 + i * 26;
              return (
                <g key={i}>
                  <text
                    x={SVG_W / 2 - 100}
                    y={y + 14}
                    textAnchor="end"
                    className="text-[12px] fill-white font-bold"
                  >
                    {p.word}
                  </text>
                  <rect
                    x={SVG_W / 2 - 90}
                    y={y + 2}
                    width={barW}
                    height={16}
                    rx={3}
                    fill={i === 0 ? "#f59e0b" : "#52525b"}
                    className="transition-all duration-500"
                  />
                  <text
                    x={SVG_W / 2 - 90 + barW + 6}
                    y={y + 14}
                    className="text-[10px] fill-zinc-400"
                  >
                    {(p.prob * 100).toFixed(0)}%
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {!predictions && (
          <text
            x={SVG_W / 2}
            y={180}
            textAnchor="middle"
            className="text-[11px] fill-zinc-600"
          >
            トークンをマスクすると予測が表示されます
          </text>
        )}
      </svg>
    </div>
  );
}
