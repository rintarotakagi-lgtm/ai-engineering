"use client";

import { useState, useCallback, useMemo } from "react";

/* ---- Presets ---- */
const PRESETS: Record<string, { label: string; kernel: number[][] }> = {
  edge: {
    label: "エッジ検出",
    kernel: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
  },
  edgeH: {
    label: "横エッジ",
    kernel: [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ],
  },
  blur: {
    label: "ぼかし",
    kernel: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  sharpen: {
    label: "シャープ化",
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  },
  identity: {
    label: "恒等（元画像）",
    kernel: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ],
  },
};

/* ---- Default 5x5 input (a simple cross pattern) ---- */
const DEFAULT_INPUT: number[][] = [
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
  [1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0],
];

const CELL = 44;
const GAP = 3;

function gridSize(n: number) {
  return n * CELL + (n - 1) * GAP;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function valColor(v: number, maxAbs: number): string {
  if (maxAbs === 0) return "rgb(113,113,122)"; // zinc-500
  const t = clamp(v / maxAbs, -1, 1);
  if (t >= 0) {
    const r = Math.round(245 - t * (245 - 217));
    const g = Math.round(245 - t * (245 - 119));
    const b = Math.round(245 - t * (245 - 6));
    return `rgb(${r},${g},${b})`;
  } else {
    const a = -t;
    const r = Math.round(245 - a * (245 - 63));
    const g = Math.round(245 - a * (245 - 63));
    const b = Math.round(245 - a * (245 - 70));
    return `rgb(${r},${g},${b})`;
  }
}

function textColor(v: number, maxAbs: number): string {
  if (maxAbs === 0) return "#fff";
  const t = Math.abs(v / maxAbs);
  return t > 0.5 ? "#fff" : "#18181b";
}

export default function ConvolutionDemo() {
  const [input, setInput] = useState<number[][]>(
    DEFAULT_INPUT.map((r) => [...r])
  );
  const [kernel, setKernel] = useState<number[][]>(
    PRESETS.edge.kernel.map((r) => [...r])
  );
  const [activePreset, setActivePreset] = useState<string>("edge");
  const [highlightPos, setHighlightPos] = useState<{
    r: number;
    c: number;
  } | null>(null);
  const [animating, setAnimating] = useState(false);
  const [animPos, setAnimPos] = useState<{ r: number; c: number } | null>(
    null
  );

  /* Compute output */
  const output = useMemo(() => {
    const out: number[][] = [];
    for (let i = 0; i <= input.length - 3; i++) {
      const row: number[] = [];
      for (let j = 0; j <= input[0].length - 3; j++) {
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
  }, [input, kernel]);

  const outputMaxAbs = useMemo(() => {
    let mx = 0;
    for (const row of output) for (const v of row) mx = Math.max(mx, Math.abs(v));
    return mx || 1;
  }, [output]);

  const inputMaxAbs = useMemo(() => {
    let mx = 0;
    for (const row of input) for (const v of row) mx = Math.max(mx, Math.abs(v));
    return mx || 1;
  }, [input]);

  const pos = animating ? animPos : highlightPos;

  /* Toggle input cell */
  const toggleInput = useCallback((r: number, c: number) => {
    setInput((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === 0 ? 1 : 0;
      return next;
    });
  }, []);

  /* Select preset */
  const selectPreset = useCallback((key: string) => {
    setActivePreset(key);
    setKernel(PRESETS[key].kernel.map((r) => [...r]));
  }, []);

  /* Edit kernel cell */
  const editKernel = useCallback((r: number, c: number, val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) return;
    setActivePreset("");
    setKernel((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = num;
      return next;
    });
  }, []);

  /* Animate */
  const animate = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    const positions: { r: number; c: number }[] = [];
    for (let i = 0; i <= input.length - 3; i++) {
      for (let j = 0; j <= input[0].length - 3; j++) {
        positions.push({ r: i, c: j });
      }
    }
    let idx = 0;
    const step = () => {
      if (idx >= positions.length) {
        setAnimating(false);
        setAnimPos(null);
        return;
      }
      setAnimPos(positions[idx]);
      idx++;
      setTimeout(step, 400);
    };
    step();
  }, [animating, input.length]);

  const kernelMaxAbs = useMemo(() => {
    let mx = 0;
    for (const row of kernel) for (const v of row) mx = Math.max(mx, Math.abs(v));
    return mx || 1;
  }, [kernel]);

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => selectPreset(key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activePreset === key
                ? "bg-amber-500 text-zinc-900"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={animate}
          disabled={animating}
          className="px-3 py-1.5 rounded-md text-sm font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-40 transition-colors ml-auto"
        >
          {animating ? "再生中..." : "▶ アニメーション"}
        </button>
      </div>

      {/* Grids */}
      <div className="flex flex-wrap items-start gap-6 justify-center">
        {/* Input grid */}
        <div className="space-y-2">
          <div className="text-sm text-zinc-400 font-medium text-center">
            入力 (5×5)
            <span className="block text-xs text-zinc-500">クリックで0/1切替</span>
          </div>
          <svg
            width={gridSize(5) + 4}
            height={gridSize(5) + 4}
            className="block"
          >
            <g transform="translate(2,2)">
              {input.map((row, r) =>
                row.map((v, c) => {
                  const x = c * (CELL + GAP);
                  const y = r * (CELL + GAP);
                  const highlighted =
                    pos !== null &&
                    r >= pos.r &&
                    r < pos.r + 3 &&
                    c >= pos.c &&
                    c < pos.c + 3;
                  return (
                    <g
                      key={`${r}-${c}`}
                      onClick={() => toggleInput(r, c)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={x}
                        y={y}
                        width={CELL}
                        height={CELL}
                        rx={4}
                        fill={valColor(v, inputMaxAbs)}
                        stroke={highlighted ? "#f59e0b" : "transparent"}
                        strokeWidth={highlighted ? 2.5 : 0}
                      />
                      <text
                        x={x + CELL / 2}
                        y={y + CELL / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor(v, inputMaxAbs)}
                        fontSize={14}
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
        </div>

        {/* Kernel */}
        <div className="space-y-2">
          <div className="text-sm text-zinc-400 font-medium text-center">
            カーネル (3×3)
            <span className="block text-xs text-zinc-500">値を編集可能</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {kernel.map((row, r) =>
              row.map((v, c) => (
                <input
                  key={`k-${r}-${c}`}
                  type="number"
                  value={v}
                  onChange={(e) => editKernel(r, c, e.target.value)}
                  className="w-12 h-12 text-center text-sm font-mono rounded-md border border-zinc-700 bg-zinc-800 text-zinc-200 focus:border-amber-500 focus:outline-none"
                />
              ))
            )}
          </div>
        </div>

        {/* Equals */}
        <div className="text-2xl text-zinc-500 font-bold self-center pt-6">=</div>

        {/* Output grid */}
        <div className="space-y-2">
          <div className="text-sm text-zinc-400 font-medium text-center">
            出力 (3×3)
          </div>
          <svg
            width={gridSize(3) + 4}
            height={gridSize(3) + 4}
            className="block"
          >
            <g transform="translate(2,2)">
              {output.map((row, r) =>
                row.map((v, c) => {
                  const x = c * (CELL + GAP);
                  const y = r * (CELL + GAP);
                  const highlighted =
                    pos !== null && r === pos.r && c === pos.c;
                  return (
                    <g
                      key={`o-${r}-${c}`}
                      onMouseEnter={() =>
                        !animating && setHighlightPos({ r, c })
                      }
                      onMouseLeave={() => !animating && setHighlightPos(null)}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={CELL}
                        height={CELL}
                        rx={4}
                        fill={valColor(v, outputMaxAbs)}
                        stroke={highlighted ? "#f59e0b" : "transparent"}
                        strokeWidth={highlighted ? 2.5 : 0}
                      />
                      <text
                        x={x + CELL / 2}
                        y={y + CELL / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor(v, outputMaxAbs)}
                        fontSize={13}
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
        </div>
      </div>

      {/* Computation detail */}
      {pos !== null && (
        <div className="bg-zinc-800/60 rounded-lg p-3 text-sm text-zinc-300 font-mono text-center">
          出力({pos.r},{pos.c}) ={" "}
          {kernel
            .flatMap((row, m) =>
              row.map(
                (kv, n) =>
                  `${kv}×${input[pos.r + m]?.[pos.c + n] ?? 0}`
              )
            )
            .join(" + ")}{" "}
          ={" "}
          <span className="text-amber-400 font-bold">
            {output[pos.r]?.[pos.c] ?? 0}
          </span>
        </div>
      )}
    </div>
  );
}
