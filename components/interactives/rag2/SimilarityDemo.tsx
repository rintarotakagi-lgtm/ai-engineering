"use client";

import { useState } from "react";

interface SentencePair {
  a: string;
  b: string;
  similarity: number;
  vecA: [number, number];
  vecB: [number, number];
}

const PAIRS: SentencePair[] = [
  {
    a: "東京の天気を教えて",
    b: "東京は今日晴れですか？",
    similarity: 0.92,
    vecA: [0.8, 0.6],
    vecB: [0.75, 0.65],
  },
  {
    a: "犬の飼い方を教えて",
    b: "猫のしつけ方法は？",
    similarity: 0.73,
    vecA: [0.5, 0.85],
    vecB: [0.35, 0.75],
  },
  {
    a: "東京の天気を教えて",
    b: "Pythonの使い方を教えて",
    similarity: 0.21,
    vecA: [0.8, 0.6],
    vecB: [-0.3, 0.9],
  },
  {
    a: "美味しいカレーの作り方",
    b: "スパイスカレーのレシピ",
    similarity: 0.95,
    vecA: [0.6, 0.8],
    vecB: [0.55, 0.83],
  },
  {
    a: "会議の議事録を作成して",
    b: "明日の降水確率は？",
    similarity: 0.08,
    vecA: [0.9, 0.1],
    vecB: [-0.1, 0.95],
  },
];

export default function SimilarityDemo() {
  const [selectedPair, setSelectedPair] = useState(0);
  const pair = PAIRS[selectedPair];

  // Convert vectors to SVG coordinates for the angle visualization
  const svgSize = 220;
  const center = svgSize / 2;
  const radius = 80;

  const angleA = Math.atan2(pair.vecA[1], pair.vecA[0]);
  const angleB = Math.atan2(pair.vecB[1], pair.vecB[0]);

  const endA = {
    x: center + Math.cos(angleA) * radius,
    y: center - Math.sin(angleA) * radius,
  };
  const endB = {
    x: center + Math.cos(angleB) * radius,
    y: center - Math.sin(angleB) * radius,
  };

  // Angle between vectors in degrees
  const angleDeg = Math.round(
    (Math.acos(pair.similarity) * 180) / Math.PI
  );

  // Arc for angle visualization
  const arcRadius = 30;
  const arcEndA = {
    x: center + Math.cos(angleA) * arcRadius,
    y: center - Math.sin(angleA) * arcRadius,
  };
  const arcEndB = {
    x: center + Math.cos(angleB) * arcRadius,
    y: center - Math.sin(angleB) * arcRadius,
  };

  const getSimilarityColor = (sim: number) => {
    if (sim >= 0.8) return "text-emerald-600 dark:text-emerald-400";
    if (sim >= 0.5) return "text-amber-600 dark:text-amber-400";
    return "text-red-500 dark:text-red-400";
  };

  const getSimilarityLabel = (sim: number) => {
    if (sim >= 0.8) return "とても似ている";
    if (sim >= 0.5) return "やや似ている";
    if (sim >= 0.3) return "あまり似ていない";
    return "ほとんど関係なし";
  };

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        2つの文を選んで、コサイン類似度とベクトルの角度を確認しましょう
      </h3>

      {/* Pair selector */}
      <div className="mb-6 space-y-2">
        {PAIRS.map((p, i) => (
          <button
            key={i}
            onClick={() => setSelectedPair(i)}
            className={`w-full rounded-lg border px-4 py-2.5 text-left transition-all ${
              i === selectedPair
                ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
                : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                A
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">{p.a}</span>
              <span className="mx-1 text-zinc-300">vs</span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                B
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">{p.b}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Visualization */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Vector angle diagram */}
        <div className="flex flex-col items-center">
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="w-full max-w-[220px]">
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              className="stroke-zinc-200 dark:stroke-zinc-700"
              strokeWidth={1}
              strokeDasharray="4 3"
            />

            {/* Angle arc */}
            <path
              d={`M ${arcEndA.x} ${arcEndA.y} A ${arcRadius} ${arcRadius} 0 0 1 ${arcEndB.x} ${arcEndB.y}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2}
            />

            {/* Vector A */}
            <line
              x1={center}
              y1={center}
              x2={endA.x}
              y2={endA.y}
              stroke="#3b82f6"
              strokeWidth={2.5}
              markerEnd="url(#arrowA)"
            />

            {/* Vector B */}
            <line
              x1={center}
              y1={center}
              x2={endB.x}
              y2={endB.y}
              stroke="#10b981"
              strokeWidth={2.5}
              markerEnd="url(#arrowB)"
            />

            {/* Arrow markers */}
            <defs>
              <marker
                id="arrowA"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker
                id="arrowB"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
              </marker>
            </defs>

            {/* Labels */}
            <text x={endA.x + 5} y={endA.y - 5} className="fill-blue-600 text-[10px] font-bold dark:fill-blue-400">
              A
            </text>
            <text x={endB.x + 5} y={endB.y - 5} className="fill-emerald-600 text-[10px] font-bold dark:fill-emerald-400">
              B
            </text>

            {/* Angle label */}
            <text
              x={center + 35}
              y={center - 10}
              className="fill-amber-600 text-[10px] font-bold dark:fill-amber-400"
            >
              {angleDeg}°
            </text>
          </svg>
          <p className="mt-1 text-xs text-zinc-400">
            角度が小さいほど類似度が高い
          </p>
        </div>

        {/* Score display */}
        <div className="flex flex-col justify-center space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">文A</span>
            </div>
            <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {pair.a}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">文B</span>
            </div>
            <p className="mt-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {pair.b}
            </p>
          </div>
          <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-900/20">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              コサイン類似度
            </span>
            <p className={`mt-1 text-3xl font-bold ${getSimilarityColor(pair.similarity)}`}>
              {pair.similarity.toFixed(2)}
            </p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {getSimilarityLabel(pair.similarity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
