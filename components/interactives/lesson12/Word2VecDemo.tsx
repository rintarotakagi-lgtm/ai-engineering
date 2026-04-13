"use client";

import React, { useState, useMemo } from "react";

/* ---------- Pre-defined word vectors (simplified 2D) ---------- */

interface Vec2 {
  x: number;
  y: number;
}

const WORD_VECTORS: Record<string, Vec2> = {
  king: { x: 0.7, y: 0.2 },
  queen: { x: 0.82, y: 0.28 },
  man: { x: 0.35, y: 0.25 },
  woman: { x: 0.47, y: 0.33 },
  prince: { x: 0.65, y: 0.35 },
  princess: { x: 0.77, y: 0.43 },
  boy: { x: 0.3, y: 0.4 },
  girl: { x: 0.42, y: 0.48 },
  uncle: { x: 0.5, y: 0.2 },
  aunt: { x: 0.62, y: 0.28 },
  brother: { x: 0.38, y: 0.55 },
  sister: { x: 0.5, y: 0.63 },
  father: { x: 0.45, y: 0.15 },
  mother: { x: 0.57, y: 0.23 },
  Japan: { x: 0.2, y: 0.75 },
  Tokyo: { x: 0.28, y: 0.82 },
  France: { x: 0.35, y: 0.72 },
  Paris: { x: 0.43, y: 0.79 },
  Italy: { x: 0.5, y: 0.7 },
  Rome: { x: 0.58, y: 0.77 },
};

const PRESETS: { label: string; a: string; b: string; c: string; expected: string }[] = [
  { label: "king - man + woman", a: "king", b: "man", c: "woman", expected: "queen" },
  { label: "prince - boy + girl", a: "prince", b: "boy", c: "girl", expected: "princess" },
  { label: "father - man + woman", a: "father", b: "man", c: "woman", expected: "mother" },
  { label: "Tokyo - Japan + France", a: "Tokyo", b: "Japan", c: "France", expected: "Paris" },
  { label: "brother - man + woman", a: "brother", b: "man", c: "woman", expected: "sister" },
];

const SVG_W = 560;
const SVG_H = 400;
const PAD = 50;

function vecSub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}
function vecAdd(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}
function vecDist(a: Vec2, b: Vec2): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export default function Word2VecDemo(): React.ReactElement {
  const wordList = Object.keys(WORD_VECTORS);
  const [wordA, setWordA] = useState("king");
  const [wordB, setWordB] = useState("man");
  const [wordC, setWordC] = useState("woman");

  const result = useMemo(() => {
    const vA = WORD_VECTORS[wordA];
    const vB = WORD_VECTORS[wordB];
    const vC = WORD_VECTORS[wordC];
    if (!vA || !vB || !vC) return null;

    const target = vecAdd(vecSub(vA, vB), vC);

    // Find nearest word (excluding A, B, C)
    let bestWord = "";
    let bestDist = Infinity;
    for (const [w, v] of Object.entries(WORD_VECTORS)) {
      if (w === wordA || w === wordB || w === wordC) continue;
      const d = vecDist(target, v);
      if (d < bestDist) {
        bestDist = d;
        bestWord = w;
      }
    }

    return { target, bestWord, bestDist };
  }, [wordA, wordB, wordC]);

  function toSvgX(x: number) {
    return PAD + x * (SVG_W - 2 * PAD);
  }
  function toSvgY(y: number) {
    return PAD + y * (SVG_H - 2 * PAD);
  }

  const vA = WORD_VECTORS[wordA];
  const vB = WORD_VECTORS[wordB];
  const vC = WORD_VECTORS[wordC];

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 text-[13px] font-bold text-zinc-300">
        Word2Vec ベクトル算術デモ
      </div>

      {/* Presets */}
      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setWordA(p.a);
              setWordB(p.b);
              setWordC(p.c);
            }}
            className={`rounded-md border px-2 py-0.5 text-[11px] transition ${
              wordA === p.a && wordB === p.b && wordC === p.c
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Selectors */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-zinc-400">vec(</span>
        <select
          value={wordA}
          onChange={(e) => setWordA(e.target.value)}
          className="rounded border border-amber-500/50 bg-zinc-800 px-2 py-0.5 text-[12px] text-amber-400 focus:outline-none"
        >
          {wordList.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <span className="text-zinc-400">) -</span>
        <span className="text-zinc-400">vec(</span>
        <select
          value={wordB}
          onChange={(e) => setWordB(e.target.value)}
          className="rounded border border-blue-500/50 bg-zinc-800 px-2 py-0.5 text-[12px] text-blue-400 focus:outline-none"
        >
          {wordList.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <span className="text-zinc-400">) +</span>
        <span className="text-zinc-400">vec(</span>
        <select
          value={wordC}
          onChange={(e) => setWordC(e.target.value)}
          className="rounded border border-green-500/50 bg-zinc-800 px-2 py-0.5 text-[12px] text-green-400 focus:outline-none"
        >
          {wordList.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <span className="text-zinc-400">)</span>
        {result && (
          <>
            <span className="text-zinc-500">≈</span>
            <span className="rounded-md bg-purple-500/20 border border-purple-500/50 px-2 py-0.5 text-[12px] font-bold text-purple-400">
              {result.bestWord}
            </span>
          </>
        )}
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="w2vArrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="#f59e0b" opacity={0.6} />
          </marker>
          <marker
            id="w2vArrowBlue"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L8,3 L0,6 Z" fill="#3b82f6" opacity={0.6} />
          </marker>
        </defs>

        {/* Grid */}
        {[0.2, 0.4, 0.6, 0.8].map((v) => (
          <React.Fragment key={v}>
            <line
              x1={toSvgX(v)}
              y1={PAD}
              x2={toSvgX(v)}
              y2={SVG_H - PAD}
              stroke="#1c1c1e"
              strokeWidth={1}
            />
            <line
              x1={PAD}
              y1={toSvgY(v)}
              x2={SVG_W - PAD}
              y2={toSvgY(v)}
              stroke="#1c1c1e"
              strokeWidth={1}
            />
          </React.Fragment>
        ))}

        {/* All word points (dimmed) */}
        {Object.entries(WORD_VECTORS).map(([w, v]) => {
          const isActive =
            w === wordA ||
            w === wordB ||
            w === wordC ||
            (result && w === result.bestWord);
          if (isActive) return null;
          return (
            <g key={w}>
              <circle
                cx={toSvgX(v.x)}
                cy={toSvgY(v.y)}
                r={3}
                fill="#52525b"
                opacity={0.5}
              />
              <text
                x={toSvgX(v.x)}
                y={toSvgY(v.y) - 8}
                textAnchor="middle"
                className="text-[9px] fill-zinc-600 select-none"
              >
                {w}
              </text>
            </g>
          );
        })}

        {/* Vector arrows: A→B and C→result (parallel) */}
        {vA && vB && (
          <line
            x1={toSvgX(vB.x)}
            y1={toSvgY(vB.y)}
            x2={toSvgX(vA.x)}
            y2={toSvgY(vA.y)}
            stroke="#f59e0b"
            strokeWidth={2}
            opacity={0.4}
            strokeDasharray="6 3"
            markerEnd="url(#w2vArrow)"
          />
        )}
        {vC && result && (
          <line
            x1={toSvgX(vC.x)}
            y1={toSvgY(vC.y)}
            x2={toSvgX(result.target.x)}
            y2={toSvgY(result.target.y)}
            stroke="#3b82f6"
            strokeWidth={2}
            opacity={0.4}
            strokeDasharray="6 3"
            markerEnd="url(#w2vArrowBlue)"
          />
        )}

        {/* Active points */}
        {vA && (
          <g>
            <circle
              cx={toSvgX(vA.x)}
              cy={toSvgY(vA.y)}
              r={7}
              fill="#f59e0b"
            />
            <text
              x={toSvgX(vA.x)}
              y={toSvgY(vA.y) - 12}
              textAnchor="middle"
              className="text-[11px] fill-amber-400 font-bold select-none"
            >
              {wordA}
            </text>
          </g>
        )}
        {vB && (
          <g>
            <circle
              cx={toSvgX(vB.x)}
              cy={toSvgY(vB.y)}
              r={7}
              fill="#3b82f6"
            />
            <text
              x={toSvgX(vB.x)}
              y={toSvgY(vB.y) - 12}
              textAnchor="middle"
              className="text-[11px] fill-blue-400 font-bold select-none"
            >
              {wordB}
            </text>
          </g>
        )}
        {vC && (
          <g>
            <circle
              cx={toSvgX(vC.x)}
              cy={toSvgY(vC.y)}
              r={7}
              fill="#10b981"
            />
            <text
              x={toSvgX(vC.x)}
              y={toSvgY(vC.y) - 12}
              textAnchor="middle"
              className="text-[11px] fill-green-400 font-bold select-none"
            >
              {wordC}
            </text>
          </g>
        )}

        {/* Target point */}
        {result && (
          <g>
            <circle
              cx={toSvgX(result.target.x)}
              cy={toSvgY(result.target.y)}
              r={5}
              fill="none"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="3 2"
            />
            <text
              x={toSvgX(result.target.x)}
              y={toSvgY(result.target.y) + 18}
              textAnchor="middle"
              className="text-[9px] fill-purple-400 select-none"
            >
              計算結果
            </text>
          </g>
        )}

        {/* Nearest word highlight */}
        {result && WORD_VECTORS[result.bestWord] && (
          <g>
            <circle
              cx={toSvgX(WORD_VECTORS[result.bestWord].x)}
              cy={toSvgY(WORD_VECTORS[result.bestWord].y)}
              r={8}
              fill="#a855f7"
              opacity={0.9}
            />
            <text
              x={toSvgX(WORD_VECTORS[result.bestWord].x)}
              y={toSvgY(WORD_VECTORS[result.bestWord].y) - 13}
              textAnchor="middle"
              className="text-[12px] fill-purple-300 font-bold select-none"
            >
              {result.bestWord}
            </text>
            {/* Line from target to nearest */}
            <line
              x1={toSvgX(result.target.x)}
              y1={toSvgY(result.target.y)}
              x2={toSvgX(WORD_VECTORS[result.bestWord].x)}
              y2={toSvgY(WORD_VECTORS[result.bestWord].y)}
              stroke="#a855f7"
              strokeWidth={1}
              opacity={0.4}
              strokeDasharray="2 2"
            />
          </g>
        )}

        {/* Legend */}
        <g transform="translate(20, 15)">
          {[
            { color: "#f59e0b", label: "A (基準)" },
            { color: "#3b82f6", label: "B (引く)" },
            { color: "#10b981", label: "C (足す)" },
            { color: "#a855f7", label: "結果 (≈)" },
          ].map((item, i) => (
            <g key={item.label} transform={`translate(${i * 110}, 0)`}>
              <circle cx={0} cy={0} r={4} fill={item.color} />
              <text
                x={8}
                y={4}
                className="text-[9px] fill-zinc-400 select-none"
              >
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <div className="mt-2 text-[10px] text-zinc-600 text-center">
        セレクターで単語を変えて、ベクトル演算の結果を確認してください。破線の矢印は平行移動（関係性の転写）を表します。
      </div>
    </div>
  );
}
