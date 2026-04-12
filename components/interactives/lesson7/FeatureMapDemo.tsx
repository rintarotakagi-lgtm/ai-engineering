"use client";

import { useState, useMemo } from "react";

/* ---- 7x7 input image: an L-shape with edges ---- */
const INPUT: number[][] = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

type KernelInfo = {
  label: string;
  desc: string;
  kernel: number[][];
  color: string;
};

const KERNELS: KernelInfo[] = [
  {
    label: "横エッジ",
    desc: "水平方向の境界を検出",
    kernel: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ],
    color: "#f59e0b",
  },
  {
    label: "縦エッジ",
    desc: "垂直方向の境界を検出",
    kernel: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
    color: "#3b82f6",
  },
  {
    label: "コーナー",
    desc: "角・交差点を検出",
    kernel: [
      [-1, -1, 0],
      [-1, 0, 1],
      [0, 1, 1],
    ],
    color: "#10b981",
  },
];

const CELL = 34;
const GAP = 2;

function gridSizePx(n: number) {
  return n * CELL + (n - 1) * GAP;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function convolve(input: number[][], kernel: number[][]): number[][] {
  const rows = input.length - 2;
  const cols = input[0].length - 2;
  const out: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let m = 0; m < 3; m++) {
        for (let n = 0; n < 3; n++) {
          sum += kernel[m][n] * input[i + m][j + n];
        }
      }
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}

function valBg(v: number, maxAbs: number, hue: string): string {
  if (maxAbs === 0) return "#27272a";
  const t = clamp(v / maxAbs, 0, 1);
  if (hue === "#f59e0b") {
    return `rgba(245,158,11,${0.1 + t * 0.8})`;
  }
  if (hue === "#3b82f6") {
    return `rgba(59,130,246,${0.1 + t * 0.8})`;
  }
  return `rgba(16,185,129,${0.1 + t * 0.8})`;
}

function Grid({
  data,
  maxAbs,
  color,
  size,
}: {
  data: number[][];
  maxAbs: number;
  color: string;
  size: number;
}) {
  return (
    <svg
      width={gridSizePx(size) + 4}
      height={gridSizePx(data.length) + 4}
      className="block"
    >
      <g transform="translate(2,2)">
        {data.map((row, r) =>
          row.map((v, c) => {
            const x = c * (CELL + GAP);
            const y = r * (CELL + GAP);
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={valBg(Math.abs(v), maxAbs, color)}
                />
                <text
                  x={x + CELL / 2}
                  y={y + CELL / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={Math.abs(v) / maxAbs > 0.4 ? "#fff" : "#a1a1aa"}
                  fontSize={11}
                  fontWeight={600}
                >
                  {v}
                </text>
              </g>
            );
          })
        )}
      </g>
    </svg>
  );
}

export default function FeatureMapDemo() {
  const [selected, setSelected] = useState<number[]>([0, 1, 2]);

  const featureMaps = useMemo(
    () => KERNELS.map((k) => convolve(INPUT, k.kernel)),
    []
  );

  const maxAbsArr = useMemo(
    () =>
      featureMaps.map((fm) => {
        let mx = 0;
        for (const row of fm) for (const v of row) mx = Math.max(mx, Math.abs(v));
        return mx || 1;
      }),
    [featureMaps]
  );

  const toggle = (idx: number) => {
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-2">
        <div className="text-sm text-zinc-400 font-medium">
          入力画像 (7×7) — L字型パターン
        </div>
        <Grid data={INPUT} maxAbs={1} color="#f59e0b" size={7} />
      </div>

      {/* Kernel toggles */}
      <div className="flex flex-wrap gap-2">
        {KERNELS.map((k, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
              selected.includes(i)
                ? "border-current bg-opacity-20"
                : "border-zinc-700 bg-zinc-800 text-zinc-500"
            }`}
            style={
              selected.includes(i)
                ? { color: k.color, backgroundColor: k.color + "22" }
                : undefined
            }
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Feature maps */}
      <div className="flex flex-wrap gap-6">
        {selected.map((idx) => {
          const k = KERNELS[idx];
          const fm = featureMaps[idx];
          return (
            <div key={idx} className="space-y-2">
              <div className="text-sm font-medium" style={{ color: k.color }}>
                {k.label}
                <span className="block text-xs text-zinc-500">{k.desc}</span>
              </div>
              {/* mini kernel display */}
              <div className="grid grid-cols-3 gap-px mb-1">
                {k.kernel.flat().map((v, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 flex items-center justify-center text-[10px] font-mono rounded"
                    style={{
                      backgroundColor:
                        v > 0
                          ? k.color + "44"
                          : v < 0
                          ? "#3f3f4622"
                          : "#27272a",
                      color: v !== 0 ? "#fff" : "#71717a",
                    }}
                  >
                    {v}
                  </div>
                ))}
              </div>
              <Grid
                data={fm}
                maxAbs={maxAbsArr[idx]}
                color={k.color}
                size={fm[0].length}
              />
            </div>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="text-sm text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
          同じ入力画像に異なるカーネルを適用すると、それぞれ異なる特徴が浮かび上がります。
          L字の横線は<span style={{ color: KERNELS[0].color }}>横エッジ</span>
          フィルタで、縦線は
          <span style={{ color: KERNELS[1].color }}>縦エッジ</span>
          フィルタで強く反応します。
        </div>
      )}
    </div>
  );
}
