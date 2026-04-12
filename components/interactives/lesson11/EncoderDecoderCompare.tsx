"use client";

import { useState } from "react";

const TOKENS = ["今日", "の", "天気", "は", "晴れ"];
const SVG_W = 640;
const SVG_H = 320;
const TOKEN_W = 56;
const TOKEN_H = 32;
const GAP = 16;

function totalWidth(count: number) {
  return count * TOKEN_W + (count - 1) * GAP;
}

function tokenX(index: number, startX: number) {
  return startX + index * (TOKEN_W + GAP) + TOKEN_W / 2;
}

function AttentionArrows({
  tokens,
  startX,
  baseY,
  selected,
  isCausal,
}: {
  tokens: string[];
  startX: number;
  baseY: number;
  selected: number | null;
  isCausal: boolean;
}) {
  if (selected === null) return null;
  const arrows: React.ReactElement[] = [];
  const fromX = tokenX(selected, startX);
  const fromY = baseY - TOKEN_H / 2 - 2;

  for (let i = 0; i < tokens.length; i++) {
    if (i === selected) continue;
    if (isCausal && i > selected) continue;
    const toX = tokenX(i, startX);
    const toY = baseY - TOKEN_H / 2 - 2;
    const midY = fromY - 20 - Math.abs(i - selected) * 10;
    arrows.push(
      <path
        key={i}
        d={`M${fromX},${fromY} Q${(fromX + toX) / 2},${midY} ${toX},${toY}`}
        fill="none"
        stroke="#f59e0b"
        strokeWidth={2}
        opacity={0.7}
        markerEnd="url(#arrowHead11)"
      />
    );
  }
  return <>{arrows}</>;
}

function TokenRow({
  tokens,
  startX,
  baseY,
  selected,
  onSelect,
  isCausal,
}: {
  tokens: string[];
  startX: number;
  baseY: number;
  selected: number | null;
  onSelect: (i: number) => void;
  isCausal: boolean;
}) {
  return (
    <g>
      <AttentionArrows
        tokens={tokens}
        startX={startX}
        baseY={baseY}
        selected={selected}
        isCausal={isCausal}
      />
      {tokens.map((t, i) => {
        const x = tokenX(i, startX);
        const isActive = selected === i;
        const isVisible =
          selected === null || !isCausal || i <= selected;
        return (
          <g
            key={i}
            onClick={() => onSelect(i)}
            className="cursor-pointer"
          >
            <rect
              x={x - TOKEN_W / 2}
              y={baseY - TOKEN_H / 2}
              width={TOKEN_W}
              height={TOKEN_H}
              rx={6}
              fill={
                isActive
                  ? "#f59e0b"
                  : isVisible
                  ? "#3f3f46"
                  : "#27272a"
              }
              stroke={isActive ? "#fbbf24" : "#52525b"}
              strokeWidth={isActive ? 2 : 1}
              className="transition-all duration-300"
            />
            <text
              x={x}
              y={baseY + 4}
              textAnchor="middle"
              className={`text-[12px] font-bold select-none ${
                isVisible ? "fill-white" : "fill-zinc-600"
              }`}
            >
              {t}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function EncoderDecoderCompare() {
  const [selectedBert, setSelectedBert] = useState<number | null>(null);
  const [selectedGpt, setSelectedGpt] = useState<number | null>(null);

  const tw = totalWidth(TOKENS.length);
  const bertStartX = (SVG_W / 2 - tw) / 2;
  const gptStartX = SVG_W / 2 + (SVG_W / 2 - tw) / 2;
  const tokensY = 210;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center gap-4 text-xs text-zinc-400">
        <span>トークンをクリックして、参照可能な範囲を確認</span>
        <button
          className="ml-auto rounded-md border border-zinc-600 px-3 py-1 text-zinc-300 hover:bg-zinc-800 transition"
          onClick={() => {
            setSelectedBert(null);
            setSelectedGpt(null);
          }}
        >
          リセット
        </button>
      </div>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowHead11"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Divider */}
        <line
          x1={SVG_W / 2}
          y1={20}
          x2={SVG_W / 2}
          y2={SVG_H - 10}
          stroke="#3f3f46"
          strokeWidth={1}
          strokeDasharray="4,4"
        />

        {/* BERT side */}
        <text
          x={SVG_W / 4}
          y={36}
          textAnchor="middle"
          className="text-[15px] fill-amber-400 font-bold"
        >
          BERT（エンコーダ）
        </text>
        <text
          x={SVG_W / 4}
          y={56}
          textAnchor="middle"
          className="text-[11px] fill-zinc-400"
        >
          双方向 — 全トークンを参照
        </text>

        {/* BERT attention label */}
        <rect
          x={bertStartX}
          y={80}
          width={tw}
          height={70}
          rx={8}
          fill="#18181b"
          stroke="#3f3f46"
        />
        <text
          x={bertStartX + tw / 2}
          y={100}
          textAnchor="middle"
          className="text-[10px] fill-zinc-500"
        >
          Self-Attention
        </text>
        <text
          x={bertStartX + tw / 2}
          y={118}
          textAnchor="middle"
          className="text-[10px] fill-zinc-500"
        >
          ← → 全方向
        </text>
        {selectedBert !== null && (
          <text
            x={bertStartX + tw / 2}
            y={138}
            textAnchor="middle"
            className="text-[10px] fill-amber-400"
          >
            「{TOKENS[selectedBert]}」→ 全{TOKENS.length}トークン参照可能
          </text>
        )}

        <TokenRow
          tokens={TOKENS}
          startX={bertStartX}
          baseY={tokensY}
          selected={selectedBert}
          onSelect={setSelectedBert}
          isCausal={false}
        />

        {/* GPT side */}
        <text
          x={(SVG_W * 3) / 4}
          y={36}
          textAnchor="middle"
          className="text-[15px] fill-amber-400 font-bold"
        >
          GPT（デコーダ）
        </text>
        <text
          x={(SVG_W * 3) / 4}
          y={56}
          textAnchor="middle"
          className="text-[11px] fill-zinc-400"
        >
          左→右のみ — 因果マスク
        </text>

        {/* GPT attention label */}
        <rect
          x={gptStartX}
          y={80}
          width={tw}
          height={70}
          rx={8}
          fill="#18181b"
          stroke="#3f3f46"
        />
        <text
          x={gptStartX + tw / 2}
          y={100}
          textAnchor="middle"
          className="text-[10px] fill-zinc-500"
        >
          Causal Self-Attention
        </text>
        <text
          x={gptStartX + tw / 2}
          y={118}
          textAnchor="middle"
          className="text-[10px] fill-zinc-500"
        >
          → 左方向のみ
        </text>
        {selectedGpt !== null && (
          <text
            x={gptStartX + tw / 2}
            y={138}
            textAnchor="middle"
            className="text-[10px] fill-amber-400"
          >
            「{TOKENS[selectedGpt]}」→ {selectedGpt + 1}トークン参照可能
          </text>
        )}

        <TokenRow
          tokens={TOKENS}
          startX={gptStartX}
          baseY={tokensY}
          selected={selectedGpt}
          onSelect={setSelectedGpt}
          isCausal={true}
        />

        {/* Masked tokens label for GPT */}
        {selectedGpt !== null && selectedGpt < TOKENS.length - 1 && (
          <text
            x={gptStartX + tw / 2}
            y={tokensY + 40}
            textAnchor="middle"
            className="text-[10px] fill-zinc-600"
          >
            灰色 = 因果マスクで参照不可
          </text>
        )}

        {/* Legend */}
        <g transform={`translate(${SVG_W / 4 - 50}, ${SVG_H - 30})`}>
          <line x1={0} y1={0} x2={20} y2={0} stroke="#f59e0b" strokeWidth={2} />
          <text x={26} y={4} className="text-[10px] fill-zinc-400">
            Attention
          </text>
        </g>
      </svg>
    </div>
  );
}
