"use client";

import { useState, useMemo } from "react";

/* 6x6 feature map input */
const INPUT: number[][] = [
  [1, 3, 2, 1, 0, 1],
  [0, 5, 3, 0, 2, 4],
  [2, 1, 6, 2, 3, 1],
  [4, 0, 1, 5, 1, 0],
  [3, 2, 0, 1, 4, 2],
  [1, 4, 3, 2, 0, 6],
];

type PoolType = "max" | "average";

const CELL = 44;
const GAP = 2;

function gridPx(n: number) {
  return n * CELL + (n - 1) * GAP;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function pool(input: number[][], type: PoolType): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < input.length; i += 2) {
    const row: number[] = [];
    for (let j = 0; j < input[0].length; j += 2) {
      const block = [
        input[i][j],
        input[i][j + 1],
        input[i + 1][j],
        input[i + 1][j + 1],
      ];
      if (type === "max") {
        row.push(Math.max(...block));
      } else {
        const avg = block.reduce((a, b) => a + b, 0) / 4;
        row.push(Math.round(avg * 10) / 10);
      }
    }
    out.push(row);
  }
  return out;
}

const BLOCK_COLORS = [
  "rgba(245,158,11,0.25)", // amber
  "rgba(59,130,246,0.25)", // blue
  "rgba(16,185,129,0.25)", // emerald
  "rgba(168,85,247,0.25)", // purple
  "rgba(239,68,68,0.25)", // red
  "rgba(236,72,153,0.25)", // pink
  "rgba(14,165,233,0.25)", // sky
  "rgba(234,179,8,0.25)", // yellow
  "rgba(34,197,94,0.25)", // green
];

const BLOCK_BORDERS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#a855f7",
  "#ef4444",
  "#ec4899",
  "#0ea5e9",
  "#eab308",
  "#22c55e",
];

function blockIdx(r: number, c: number, cols: number): number {
  const br = Math.floor(r / 2);
  const bc = Math.floor(c / 2);
  return br * (cols / 2) + bc;
}

export default function PoolingDemo() {
  const [poolType, setPoolType] = useState<PoolType>("max");
  const [hoverBlock, setHoverBlock] = useState<number | null>(null);

  const output = useMemo(() => pool(INPUT, poolType), [poolType]);
  const maxVal = useMemo(() => {
    let mx = 0;
    for (const row of INPUT) for (const v of row) mx = Math.max(mx, v);
    return mx || 1;
  }, []);

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="flex gap-2">
        {(["max", "average"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setPoolType(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              poolType === t
                ? "bg-amber-500 text-zinc-900"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {t === "max" ? "Max プーリング" : "Average プーリング"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-8 justify-center">
        {/* Input grid */}
        <div className="space-y-2">
          <div className="text-sm text-zinc-400 font-medium text-center">
            入力 (6×6)
          </div>
          <svg
            width={gridPx(6) + 4}
            height={gridPx(6) + 4}
            className="block"
          >
            <g transform="translate(2,2)">
              {INPUT.map((row, r) =>
                row.map((v, c) => {
                  const x = c * (CELL + GAP);
                  const y = r * (CELL + GAP);
                  const bi = blockIdx(r, c, 6);
                  const isHover = hoverBlock === bi;
                  const bg = isHover
                    ? BLOCK_COLORS[bi % BLOCK_COLORS.length]
                    : `rgba(245,158,11,${0.08 + (v / maxVal) * 0.55})`;
                  /* Check if this cell is the max in its 2x2 block */
                  const br = Math.floor(r / 2) * 2;
                  const bc = Math.floor(c / 2) * 2;
                  const blockVals = [
                    INPUT[br][bc],
                    INPUT[br][bc + 1],
                    INPUT[br + 1][bc],
                    INPUT[br + 1][bc + 1],
                  ];
                  const isMax = poolType === "max" && v === Math.max(...blockVals) && isHover;
                  return (
                    <g
                      key={`${r}-${c}`}
                      onMouseEnter={() => setHoverBlock(bi)}
                      onMouseLeave={() => setHoverBlock(null)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={CELL}
                        height={CELL}
                        rx={4}
                        fill={bg}
                        stroke={
                          isHover
                            ? BLOCK_BORDERS[bi % BLOCK_BORDERS.length]
                            : "transparent"
                        }
                        strokeWidth={isHover ? 2 : 0}
                      />
                      <text
                        x={x + CELL / 2}
                        y={y + CELL / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isMax ? "#f59e0b" : v / maxVal > 0.4 ? "#fff" : "#d4d4d8"}
                        fontSize={14}
                        fontWeight={isMax ? 800 : 600}
                      >
                        {v}
                      </text>
                    </g>
                  );
                })
              )}
            </g>
          </svg>
        </div>

        {/* Arrow */}
        <div className="self-center pt-6">
          <svg width={48} height={32}>
            <path
              d="M4 16 L36 16 M30 8 L38 16 L30 24"
              stroke="#71717a"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-xs text-zinc-500 text-center mt-1">2×2, s=2</div>
        </div>

        {/* Output grid */}
        <div className="space-y-2">
          <div className="text-sm text-zinc-400 font-medium text-center">
            出力 (3×3)
          </div>
          <svg
            width={gridPx(3) + 4}
            height={gridPx(3) + 4}
            className="block"
          >
            <g transform="translate(2,2)">
              {output.map((row, r) =>
                row.map((v, c) => {
                  const x = c * (CELL + GAP);
                  const y = r * (CELL + GAP);
                  const bi = r * 3 + c;
                  const isHover = hoverBlock === bi;
                  return (
                    <g
                      key={`o-${r}-${c}`}
                      onMouseEnter={() => setHoverBlock(bi)}
                      onMouseLeave={() => setHoverBlock(null)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={CELL}
                        height={CELL}
                        rx={4}
                        fill={
                          isHover
                            ? BLOCK_COLORS[bi % BLOCK_COLORS.length]
                            : `rgba(245,158,11,${0.1 + (v / maxVal) * 0.55})`
                        }
                        stroke={
                          isHover
                            ? BLOCK_BORDERS[bi % BLOCK_BORDERS.length]
                            : "transparent"
                        }
                        strokeWidth={isHover ? 2 : 0}
                      />
                      <text
                        x={x + CELL / 2}
                        y={y + CELL / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={v / maxVal > 0.4 ? "#fff" : "#d4d4d8"}
                        fontSize={14}
                        fontWeight={700}
                      >
                        {v}
                      </text>
                    </g>
                  );
                })
              )}
            </g>
          </svg>
        </div>
      </div>

      <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
        {poolType === "max" ? (
          <>
            <strong className="text-amber-400">Max プーリング</strong>：各 2×2
            ブロックの最大値を取ります。最も強い特徴の反応を残すため、CNNで最もよく使われます。
            出力セルにホバーして対応する入力領域を確認しましょう。
          </>
        ) : (
          <>
            <strong className="text-amber-400">Average プーリング</strong>：各
            2×2 ブロックの平均値を取ります。領域全体の特徴の強さを要約します。
            Global Average Pooling として最終層で使われることが多いです。
          </>
        )}
      </div>
    </div>
  );
}
