"use client";

import React, { useState } from "react";

/* ---------- Pre-computed 2D embeddings (projected from higher dim) ---------- */

interface WordPoint {
  word: string;
  wordEn: string;
  x: number;
  y: number;
  category: string;
}

const WORDS: WordPoint[] = [
  // Animals
  { word: "猫", wordEn: "cat", x: 0.15, y: 0.25, category: "動物" },
  { word: "犬", wordEn: "dog", x: 0.2, y: 0.3, category: "動物" },
  { word: "鳥", wordEn: "bird", x: 0.12, y: 0.18, category: "動物" },
  { word: "魚", wordEn: "fish", x: 0.22, y: 0.15, category: "動物" },
  // Royalty
  { word: "王", wordEn: "king", x: 0.75, y: 0.2, category: "王族" },
  { word: "女王", wordEn: "queen", x: 0.82, y: 0.25, category: "王族" },
  { word: "王子", wordEn: "prince", x: 0.72, y: 0.3, category: "王族" },
  { word: "姫", wordEn: "princess", x: 0.8, y: 0.35, category: "王族" },
  // Vehicles
  { word: "車", wordEn: "car", x: 0.45, y: 0.75, category: "乗り物" },
  { word: "バス", wordEn: "bus", x: 0.5, y: 0.8, category: "乗り物" },
  { word: "電車", wordEn: "train", x: 0.42, y: 0.85, category: "乗り物" },
  { word: "飛行機", wordEn: "airplane", x: 0.38, y: 0.7, category: "乗り物" },
  // Food
  { word: "りんご", wordEn: "apple", x: 0.8, y: 0.7, category: "食べ物" },
  { word: "バナナ", wordEn: "banana", x: 0.85, y: 0.75, category: "食べ物" },
  { word: "寿司", wordEn: "sushi", x: 0.78, y: 0.82, category: "食べ物" },
  { word: "パン", wordEn: "bread", x: 0.88, y: 0.68, category: "食べ物" },
  // Gender
  { word: "男", wordEn: "man", x: 0.3, y: 0.5, category: "人" },
  { word: "女", wordEn: "woman", x: 0.37, y: 0.55, category: "人" },
  { word: "少年", wordEn: "boy", x: 0.28, y: 0.45, category: "人" },
  { word: "少女", wordEn: "girl", x: 0.35, y: 0.48, category: "人" },
];

const CATEGORY_COLORS: Record<string, string> = {
  動物: "#f59e0b",
  王族: "#8b5cf6",
  乗り物: "#3b82f6",
  食べ物: "#10b981",
  人: "#ef4444",
};

const SVG_W = 560;
const SVG_H = 400;
const PAD = 40;

export default function EmbeddingDemo(): React.ReactElement {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );

  const categories = [...new Set(WORDS.map((w) => w.category))];

  function toSvgX(x: number) {
    return PAD + x * (SVG_W - 2 * PAD);
  }
  function toSvgY(y: number) {
    return PAD + y * (SVG_H - 2 * PAD);
  }

  const filteredWords =
    selectedCategory === null
      ? WORDS
      : WORDS.filter((w) => w.category === selectedCategory);

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 text-[13px] font-bold text-zinc-300">
        単語埋め込みベクトルの2D可視化
      </div>

      {/* Category filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`rounded-md border px-2 py-0.5 text-[11px] transition ${
            selectedCategory === null
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          すべて
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(cat === selectedCategory ? null : cat)
            }
            className="rounded-md border px-2 py-0.5 text-[11px] transition"
            style={{
              borderColor:
                selectedCategory === cat
                  ? CATEGORY_COLORS[cat]
                  : "#52525b",
              backgroundColor:
                selectedCategory === cat
                  ? CATEGORY_COLORS[cat] + "18"
                  : "transparent",
              color:
                selectedCategory === cat
                  ? CATEGORY_COLORS[cat]
                  : "#a1a1aa",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid */}
        {[0.25, 0.5, 0.75].map((v) => (
          <React.Fragment key={v}>
            <line
              x1={toSvgX(v)}
              y1={PAD}
              x2={toSvgX(v)}
              y2={SVG_H - PAD}
              stroke="#27272a"
              strokeWidth={1}
            />
            <line
              x1={PAD}
              y1={toSvgY(v)}
              x2={SVG_W - PAD}
              y2={toSvgY(v)}
              stroke="#27272a"
              strokeWidth={1}
            />
          </React.Fragment>
        ))}

        {/* Axes */}
        <line
          x1={PAD}
          y1={SVG_H - PAD}
          x2={SVG_W - PAD}
          y2={SVG_H - PAD}
          stroke="#3f3f46"
          strokeWidth={1}
        />
        <line
          x1={PAD}
          y1={PAD}
          x2={PAD}
          y2={SVG_H - PAD}
          stroke="#3f3f46"
          strokeWidth={1}
        />
        <text
          x={SVG_W / 2}
          y={SVG_H - 8}
          textAnchor="middle"
          className="text-[10px] fill-zinc-600"
        >
          次元 1
        </text>
        <text
          x={12}
          y={SVG_H / 2}
          textAnchor="middle"
          className="text-[10px] fill-zinc-600"
          transform={`rotate(-90, 12, ${SVG_H / 2})`}
        >
          次元 2
        </text>

        {/* Cluster ellipses (background) */}
        {selectedCategory === null &&
          categories.map((cat) => {
            const catWords = WORDS.filter((w) => w.category === cat);
            const avgX =
              catWords.reduce((s, w) => s + w.x, 0) / catWords.length;
            const avgY =
              catWords.reduce((s, w) => s + w.y, 0) / catWords.length;
            const rx =
              Math.max(
                ...catWords.map((w) => Math.abs(w.x - avgX))
              ) *
                (SVG_W - 2 * PAD) +
              20;
            const ry =
              Math.max(
                ...catWords.map((w) => Math.abs(w.y - avgY))
              ) *
                (SVG_H - 2 * PAD) +
              20;
            return (
              <ellipse
                key={cat}
                cx={toSvgX(avgX)}
                cy={toSvgY(avgY)}
                rx={rx}
                ry={ry}
                fill={CATEGORY_COLORS[cat] + "08"}
                stroke={CATEGORY_COLORS[cat] + "30"}
                strokeWidth={1}
                strokeDasharray="4 2"
              />
            );
          })}

        {/* Word points */}
        {filteredWords.map((w, i) => {
          const sx = toSvgX(w.x);
          const sy = toSvgY(w.y);
          const color = CATEGORY_COLORS[w.category];
          const isHovered = hovered === i;

          return (
            <g
              key={w.word}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Point */}
              <circle
                cx={sx}
                cy={sy}
                r={isHovered ? 7 : 5}
                fill={color}
                opacity={isHovered ? 1 : 0.8}
                className="transition-all duration-200"
              />
              {/* Label */}
              <text
                x={sx}
                y={sy - 10}
                textAnchor="middle"
                className={`select-none transition-all duration-200 ${
                  isHovered
                    ? "text-[12px] font-bold"
                    : "text-[10px]"
                }`}
                fill={isHovered ? color : "#d4d4d8"}
              >
                {w.word}
              </text>
              {/* English label on hover */}
              {isHovered && (
                <text
                  x={sx}
                  y={sy + 18}
                  textAnchor="middle"
                  className="text-[9px] fill-zinc-500"
                >
                  {w.wordEn}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-2 text-[10px] text-zinc-600 text-center">
        意味が近い単語が空間上で近くにクラスターを形成していることを確認してください
      </div>
    </div>
  );
}
