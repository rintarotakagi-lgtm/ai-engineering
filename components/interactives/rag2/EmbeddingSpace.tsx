"use client";

import { useState } from "react";

interface Point {
  id: number;
  text: string;
  x: number;
  y: number;
  category: string;
  color: string;
}

const POINTS: Point[] = [
  // Food cluster
  { id: 1, text: "今日のランチは何にしよう", x: 75, y: 60, category: "食事", color: "#f59e0b" },
  { id: 2, text: "おすすめのレストランは？", x: 90, y: 45, category: "食事", color: "#f59e0b" },
  { id: 3, text: "美味しいパスタの作り方", x: 65, y: 40, category: "食事", color: "#f59e0b" },
  // Weather cluster
  { id: 4, text: "明日の天気を教えて", x: 200, y: 180, category: "天気", color: "#3b82f6" },
  { id: 5, text: "週末は晴れますか？", x: 215, y: 165, category: "天気", color: "#3b82f6" },
  { id: 6, text: "降水確率はどのくらい？", x: 185, y: 195, category: "天気", color: "#3b82f6" },
  // Tech cluster
  { id: 7, text: "Pythonの学習方法を教えて", x: 310, y: 70, category: "テック", color: "#10b981" },
  { id: 8, text: "プログラミング入門におすすめの言語", x: 325, y: 55, category: "テック", color: "#10b981" },
  { id: 9, text: "AIの最新トレンドは？", x: 290, y: 85, category: "テック", color: "#10b981" },
  // Travel cluster
  { id: 10, text: "京都のおすすめ観光スポット", x: 150, y: 270, category: "旅行", color: "#a855f7" },
  { id: 11, text: "海外旅行の持ち物リスト", x: 170, y: 255, category: "旅行", color: "#a855f7" },
  { id: 12, text: "安い航空券の探し方", x: 135, y: 285, category: "旅行", color: "#a855f7" },
];

const CATEGORIES = [
  { name: "食事", color: "#f59e0b" },
  { name: "天気", color: "#3b82f6" },
  { name: "テック", color: "#10b981" },
  { name: "旅行", color: "#a855f7" },
];

export default function EmbeddingSpace() {
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);

  const svgWidth = 400;
  const svgHeight = 340;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        意味が近い文は空間上で近くに集まります — カテゴリをクリックしてハイライト
      </h3>

      {/* Category legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() =>
              setHighlightCategory(
                highlightCategory === cat.name ? null : cat.name
              )
            }
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              highlightCategory === cat.name
                ? "ring-2 ring-offset-1"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{
              backgroundColor: cat.color + "20",
              color: cat.color,
            }}
          >
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </button>
        ))}
      </div>

      {/* SVG Scatter plot */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full"
          style={{ maxHeight: 380 }}
        >
          {/* Grid */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={(i + 1) * (svgWidth / 8)}
              y1={0}
              x2={(i + 1) * (svgWidth / 8)}
              y2={svgHeight}
              className="stroke-zinc-100 dark:stroke-zinc-800"
              strokeWidth={0.5}
            />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={(i + 1) * (svgHeight / 7)}
              x2={svgWidth}
              y2={(i + 1) * (svgHeight / 7)}
              className="stroke-zinc-100 dark:stroke-zinc-800"
              strokeWidth={0.5}
            />
          ))}

          {/* Category clusters (dashed ellipses) */}
          {highlightCategory && (
            <>
              {CATEGORIES.filter((c) => c.name === highlightCategory).map(
                (cat) => {
                  const catPoints = POINTS.filter(
                    (p) => p.category === cat.name
                  );
                  const cx =
                    catPoints.reduce((s, p) => s + p.x, 0) / catPoints.length;
                  const cy =
                    catPoints.reduce((s, p) => s + p.y, 0) / catPoints.length;
                  return (
                    <ellipse
                      key={cat.name}
                      cx={cx}
                      cy={cy}
                      rx={55}
                      ry={40}
                      fill={cat.color + "10"}
                      stroke={cat.color}
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                  );
                }
              )}
            </>
          )}

          {/* Points */}
          {POINTS.map((point) => {
            const isActive =
              !highlightCategory || point.category === highlightCategory;
            const isHovered = hoveredPoint?.id === point.id;
            return (
              <g key={point.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHovered ? 8 : 6}
                  fill={point.color}
                  opacity={isActive ? 1 : 0.15}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(point)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {isHovered && (
                  <>
                    <rect
                      x={point.x + 12}
                      y={point.y - 14}
                      width={Math.min(point.text.length * 8 + 12, 200)}
                      height={22}
                      rx={4}
                      className="fill-zinc-800 dark:fill-zinc-200"
                    />
                    <text
                      x={point.x + 18}
                      y={point.y + 1}
                      className="fill-white text-[9px] dark:fill-zinc-900"
                    >
                      {point.text}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hovered text info */}
      <div className="mt-3 min-h-[36px] rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
        {hoveredPoint ? (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            <span
              className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: hoveredPoint.color }}
            />
            「{hoveredPoint.text}」 — カテゴリ: {hoveredPoint.category}
          </p>
        ) : (
          <p className="text-xs text-zinc-400">
            ドットにマウスを合わせると文を表示します
          </p>
        )}
      </div>
    </div>
  );
}
