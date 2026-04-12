"use client";

import { useState, useEffect, useCallback } from "react";

/* ---- Layer definitions (simplified LeNet-like) ---- */
type Layer = {
  label: string;
  type: "input" | "conv" | "relu" | "pool" | "flatten" | "fc" | "output";
  dims: string;
  color: string;
  w: number;
  h: number;
};

const LAYERS: Layer[] = [
  { label: "入力", type: "input", dims: "32×32×1", color: "#71717a", w: 48, h: 80 },
  { label: "Conv1", type: "conv", dims: "28×28×6", color: "#f59e0b", w: 44, h: 72 },
  { label: "ReLU", type: "relu", dims: "28×28×6", color: "#ef4444", w: 44, h: 72 },
  { label: "Pool1", type: "pool", dims: "14×14×6", color: "#3b82f6", w: 36, h: 56 },
  { label: "Conv2", type: "conv", dims: "10×10×16", color: "#f59e0b", w: 30, h: 44 },
  { label: "ReLU", type: "relu", dims: "10×10×16", color: "#ef4444", w: 30, h: 44 },
  { label: "Pool2", type: "pool", dims: "5×5×16", color: "#3b82f6", w: 22, h: 30 },
  { label: "Flatten", type: "flatten", dims: "400", color: "#a855f7", w: 14, h: 80 },
  { label: "FC", type: "fc", dims: "120", color: "#10b981", w: 14, h: 60 },
  { label: "出力", type: "output", dims: "10", color: "#10b981", w: 14, h: 36 },
];

const SVG_W = 740;
const SVG_H = 220;
const LAYER_GAP = 14;

function layerPositions() {
  const totalW =
    LAYERS.reduce((sum, l) => sum + l.w, 0) + (LAYERS.length - 1) * LAYER_GAP;
  let x = (SVG_W - totalW) / 2;
  return LAYERS.map((l) => {
    const pos = { x, cx: x + l.w / 2, y: (SVG_H - l.h) / 2 - 10 };
    x += l.w + LAYER_GAP;
    return pos;
  });
}

const POSITIONS = layerPositions();

const TYPE_DESC: Record<string, string> = {
  input: "生の画像データ。各ピクセルの値（0〜255 or 0〜1）を入力として受け取る。",
  conv: "畳み込み層。カーネルをスライドさせて局所パターンを検出する。",
  relu: "活性化関数 ReLU。負の値を0にクリップし、非線形性を導入する。",
  pool: "プーリング層。空間サイズを縮小し、計算量を減らすと同時に位置不変性を獲得する。",
  flatten: "平坦化。2D特徴マップを1Dベクトルに展開し、全結合層への入力にする。",
  fc: "全結合層。抽出された特徴の組み合わせから最終的なパターンを学習する。",
  output: "出力層。各クラスのスコアを出力する（10クラス分類なら10ノード）。",
};

export default function CNNArchitecture() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [animIdx, setAnimIdx] = useState<number>(-1);
  const [playing, setPlaying] = useState(false);

  const animate = useCallback(() => {
    setPlaying(true);
    setAnimIdx(0);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (animIdx >= LAYERS.length) {
      setPlaying(false);
      setAnimIdx(-1);
      return;
    }
    const timer = setTimeout(() => setAnimIdx((i) => i + 1), 500);
    return () => clearTimeout(timer);
  }, [animIdx, playing]);

  const highlighted = playing ? animIdx : activeIdx;

  return (
    <div className="space-y-4">
      <button
        onClick={animate}
        disabled={playing}
        className="px-3 py-1.5 rounded-md text-sm font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-40 transition-colors"
      >
        {playing ? "再生中..." : "▶ データフローアニメーション"}
      </button>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full max-w-3xl block"
        style={{ minHeight: 200 }}
      >
        {/* Connections */}
        {LAYERS.slice(1).map((_, i) => {
          const from = POSITIONS[i];
          const to = POSITIONS[i + 1];
          const fromL = LAYERS[i];
          const toL = LAYERS[i + 1];
          const lit =
            highlighted !== null && (i === highlighted || i + 1 === highlighted);
          return (
            <line
              key={`conn-${i}`}
              x1={from.cx + fromL.w / 2}
              y1={from.y + fromL.h / 2}
              x2={to.cx - toL.w / 2}
              y2={to.y + toL.h / 2}
              stroke={lit ? "#f59e0b" : "#3f3f46"}
              strokeWidth={lit ? 2 : 1}
              opacity={lit ? 1 : 0.5}
            />
          );
        })}

        {/* Data flow blob */}
        {playing && animIdx >= 0 && animIdx < LAYERS.length && (
          <circle
            cx={POSITIONS[animIdx].cx}
            cy={POSITIONS[animIdx].y + LAYERS[animIdx].h / 2}
            r={8}
            fill="#f59e0b"
            opacity={0.8}
          >
            <animate
              attributeName="r"
              values="6;10;6"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* Layer blocks */}
        {LAYERS.map((l, i) => {
          const p = POSITIONS[i];
          const isActive = highlighted === i;
          const isPast = playing && animIdx > i;
          return (
            <g
              key={i}
              onMouseEnter={() => !playing && setActiveIdx(i)}
              onMouseLeave={() => !playing && setActiveIdx(null)}
              className="cursor-pointer"
            >
              {/* stacked rectangles for conv/pool to suggest depth */}
              {(l.type === "conv" || l.type === "pool" || l.type === "input") && (
                <>
                  <rect
                    x={p.cx - l.w / 2 + 4}
                    y={p.y - 4}
                    width={l.w}
                    height={l.h}
                    rx={4}
                    fill={l.color + "22"}
                    stroke={l.color + "44"}
                    strokeWidth={1}
                  />
                  <rect
                    x={p.cx - l.w / 2 + 2}
                    y={p.y - 2}
                    width={l.w}
                    height={l.h}
                    rx={4}
                    fill={l.color + "33"}
                    stroke={l.color + "55"}
                    strokeWidth={1}
                  />
                </>
              )}
              <rect
                x={p.cx - l.w / 2}
                y={p.y}
                width={l.w}
                height={l.h}
                rx={4}
                fill={
                  isActive
                    ? l.color + "66"
                    : isPast
                    ? l.color + "55"
                    : l.color + "33"
                }
                stroke={isActive ? l.color : l.color + "88"}
                strokeWidth={isActive ? 2 : 1}
              />
              {/* Label */}
              <text
                x={p.cx}
                y={p.y + l.h + 14}
                textAnchor="middle"
                fill={isActive ? l.color : "#a1a1aa"}
                fontSize={11}
                fontWeight={600}
              >
                {l.label}
              </text>
              {/* Dims */}
              <text
                x={p.cx}
                y={p.y + l.h + 27}
                textAnchor="middle"
                fill="#71717a"
                fontSize={9}
              >
                {l.dims}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Description */}
      {highlighted !== null && highlighted >= 0 && highlighted < LAYERS.length && (
        <div className="bg-zinc-800/60 rounded-lg p-3 text-sm text-zinc-300">
          <span
            className="font-bold mr-2"
            style={{ color: LAYERS[highlighted].color }}
          >
            {LAYERS[highlighted].label}
          </span>
          <span className="text-zinc-500 mr-2">
            [{LAYERS[highlighted].dims}]
          </span>
          {TYPE_DESC[LAYERS[highlighted].type]}
        </div>
      )}

      {highlighted === null && !playing && (
        <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
          各層にホバーして詳細を表示。アニメーションボタンでデータの流れを確認できます。
          空間サイズは Conv で縮小、Pool でさらに半減し、最終的に Flatten
          で1次元に展開されて全結合層に渡されます。
        </div>
      )}
    </div>
  );
}
