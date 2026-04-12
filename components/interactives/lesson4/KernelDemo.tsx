"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const VIEWBOX_W = 520;
const VIEWBOX_H = 420;
const PAD_L = 45;
const PAD_R = 20;
const PAD_T = 50;
const PAD_B = 40;
const PLOT_W = VIEWBOX_W - PAD_L - PAD_R;
const PLOT_H = VIEWBOX_H - PAD_T - PAD_B;

const DATA_MIN = -4;
const DATA_MAX = 4;
const GRID_RES = 40; // resolution for decision boundary grid

type KernelType = "linear" | "poly" | "rbf";

interface Point {
  x: number;
  y: number;
  label: -1 | 1;
}

/* ------------------------------------------------------------------ */
/*  Generate concentric circles data                                   */
/* ------------------------------------------------------------------ */

function generateData(): Point[] {
  const pts: Point[] = [];
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };
  const rand = rng(42);

  // Inner circle (class -1)
  for (let i = 0; i < 20; i++) {
    const angle = rand() * 2 * Math.PI;
    const r = 0.8 + rand() * 0.7;
    pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), label: -1 });
  }
  // Outer ring (class +1)
  for (let i = 0; i < 30; i++) {
    const angle = rand() * 2 * Math.PI;
    const r = 2.2 + rand() * 1.0;
    pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle), label: 1 });
  }
  return pts;
}

const DATASET = generateData();

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toSvgX(v: number): number {
  return PAD_L + ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_W;
}
function toSvgY(v: number): number {
  return PAD_T + PLOT_H - ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_H;
}

/* ------------------------------------------------------------------ */
/*  Kernel functions                                                   */
/* ------------------------------------------------------------------ */

function kernelLinear(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}
function kernelPoly(a: Point, b: Point, d: number = 3, c: number = 1): number {
  return Math.pow(a.x * b.x + a.y * b.y + c, d);
}
function kernelRBF(a: Point, b: Point, gamma: number = 0.5): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.exp(-gamma * (dx * dx + dy * dy));
}

/**
 * Simplified kernel SVM using kernel perceptron approach.
 * Returns a predict function.
 */
function trainKernelSVM(
  data: Point[],
  kernelFn: (a: Point, b: Point) => number,
  epochs: number = 30,
) {
  const n = data.length;
  const alphas = new Float64Array(n);
  let bias = 0;

  for (let ep = 0; ep < epochs; ep++) {
    for (let i = 0; i < n; i++) {
      let sum = bias;
      for (let j = 0; j < n; j++) {
        sum += alphas[j] * data[j].label * kernelFn(data[j], data[i]);
      }
      const pred = sum >= 0 ? 1 : -1;
      if (pred !== data[i].label) {
        alphas[i] += 1;
        bias += data[i].label;
      }
    }
  }

  return (pt: Point) => {
    let sum = bias;
    for (let j = 0; j < n; j++) {
      sum += alphas[j] * data[j].label * kernelFn(data[j], pt);
    }
    return sum;
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function KernelDemo() {
  const [kernel, setKernel] = useState<KernelType>("linear");

  const { grid, trainAcc } = useMemo(() => {
    const kFn =
      kernel === "linear"
        ? kernelLinear
        : kernel === "poly"
          ? (a: Point, b: Point) => kernelPoly(a, b, 3, 1)
          : (a: Point, b: Point) => kernelRBF(a, b, 0.5);

    const predict = trainKernelSVM(DATASET, kFn, 40);

    // Build grid of predictions
    const gridData: { x: number; y: number; val: number }[] = [];
    const step = (DATA_MAX - DATA_MIN) / GRID_RES;
    for (let gx = DATA_MIN; gx <= DATA_MAX; gx += step) {
      for (let gy = DATA_MIN; gy <= DATA_MAX; gy += step) {
        gridData.push({ x: gx, y: gy, val: predict({ x: gx, y: gy, label: 1 }) });
      }
    }

    // Training accuracy
    let correct = 0;
    for (const pt of DATASET) {
      const v = predict(pt);
      if ((v >= 0 && pt.label === 1) || (v < 0 && pt.label === -1)) correct++;
    }

    return { grid: gridData, trainAcc: Math.round((correct / DATASET.length) * 100) };
  }, [kernel]);

  const cellW = PLOT_W / GRID_RES;
  const cellH = PLOT_H / GRID_RES;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-800">
          Kernel SVM — Decision Boundary
        </h3>
        <p className="text-sm text-zinc-500">
          Concentric circle data that is not linearly separable. Toggle the
          kernel to see how the boundary changes.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        className="rounded-lg border border-zinc-200 bg-white"
      >
        {/* Decision region heatmap */}
        {grid.map((cell, i) => {
          const sx = toSvgX(cell.x) - cellW / 2;
          const sy = toSvgY(cell.y) - cellH / 2;
          const alpha = Math.min(Math.abs(cell.val) * 0.15, 0.35);
          const color = cell.val >= 0 ? `rgba(245,158,11,${alpha})` : `rgba(59,130,246,${alpha})`;
          return (
            <rect
              key={i}
              x={sx}
              y={sy}
              width={cellW + 0.5}
              height={cellH + 0.5}
              fill={color}
            />
          );
        })}

        {/* Grid */}
        {[-3, -1, 0, 1, 3].map((v) => (
          <g key={`grid-${v}`}>
            <line
              x1={toSvgX(v)}
              y1={PAD_T}
              x2={toSvgX(v)}
              y2={PAD_T + PLOT_H}
              stroke="#d4d4d8"
              strokeWidth={v === 0 ? 0.8 : 0.3}
            />
            <line
              x1={PAD_L}
              y1={toSvgY(v)}
              x2={PAD_L + PLOT_W}
              y2={toSvgY(v)}
              stroke="#d4d4d8"
              strokeWidth={v === 0 ? 0.8 : 0.3}
            />
          </g>
        ))}

        {/* Axes */}
        <line
          x1={PAD_L}
          y1={PAD_T + PLOT_H}
          x2={PAD_L + PLOT_W}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1.5}
        />
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1.5}
        />

        {/* Data points */}
        {DATASET.map((pt, i) => {
          const fill = pt.label === -1 ? "#3b82f6" : "#f59e0b";
          return (
            <circle
              key={i}
              cx={toSvgX(pt.x)}
              cy={toSvgY(pt.y)}
              r={5}
              fill={fill}
              stroke="#fff"
              strokeWidth={1.5}
              opacity={0.9}
            />
          );
        })}

        {/* Legend */}
        <g transform={`translate(${PAD_L + 8}, ${PAD_T + 10})`}>
          <circle cx={0} cy={0} r={5} fill="#3b82f6" />
          <text x={10} y={4} fontSize={10} fill="#71717a">
            Inner (Class -1)
          </text>
          <circle cx={0} cy={16} r={5} fill="#f59e0b" />
          <text x={10} y={20} fontSize={10} fill="#71717a">
            Outer (Class +1)
          </text>
        </g>
      </svg>

      {/* Kernel selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { key: "linear", label: "Linear" },
            { key: "poly", label: "Polynomial (d=3)" },
            { key: "rbf", label: "RBF (Gaussian)" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setKernel(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              kernel === key
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span
          className={`rounded px-3 py-1 font-semibold ${
            trainAcc === 100
              ? "bg-emerald-100 text-emerald-700"
              : trainAcc >= 80
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          Training Accuracy: {trainAcc}%
        </span>
        <span className="rounded bg-zinc-100 px-3 py-1 text-zinc-600">
          Kernel: {kernel === "linear" ? "K = x . y" : kernel === "poly" ? "K = (x . y + 1)^3" : "K = exp(-0.5 ||x-y||^2)"}
        </span>
      </div>
    </div>
  );
}
