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
const GRID_RES = 45;

interface Point {
  x: number;
  y: number;
  label: -1 | 1;
}

/* ------------------------------------------------------------------ */
/*  Generate two-moons dataset                                         */
/* ------------------------------------------------------------------ */

function generateMoons(): Point[] {
  const pts: Point[] = [];
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };
  const rand = rng(123);

  // Upper moon (class +1)
  for (let i = 0; i < 25; i++) {
    const angle = (Math.PI * i) / 24;
    const noise = (rand() - 0.5) * 0.5;
    const r = 2 + noise;
    pts.push({
      x: r * Math.cos(angle) - 0.5,
      y: r * Math.sin(angle) + 0.2,
      label: 1,
    });
  }
  // Lower moon (class -1)
  for (let i = 0; i < 25; i++) {
    const angle = Math.PI + (Math.PI * i) / 24;
    const noise = (rand() - 0.5) * 0.5;
    const r = 2 + noise;
    pts.push({
      x: r * Math.cos(angle) + 0.5,
      y: r * Math.sin(angle) - 0.2,
      label: -1,
    });
  }
  return pts;
}

const DATASET = generateMoons();

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toSvgX(v: number): number {
  return PAD_L + ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_W;
}
function toSvgY(v: number): number {
  return PAD_T + PLOT_H - ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_H;
}

function kernelRBF(a: Point, b: Point, gamma: number): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.exp(-gamma * (dx * dx + dy * dy));
}

/**
 * Kernel perceptron with RBF kernel
 */
function trainKernelPerceptron(
  data: Point[],
  gamma: number,
  epochs: number = 40,
) {
  const n = data.length;
  const alphas = new Float64Array(n);
  let bias = 0;

  for (let ep = 0; ep < epochs; ep++) {
    for (let i = 0; i < n; i++) {
      let sum = bias;
      for (let j = 0; j < n; j++) {
        sum += alphas[j] * data[j].label * kernelRBF(data[j], data[i], gamma);
      }
      if (sum * data[i].label <= 0) {
        alphas[i] += 1;
        bias += data[i].label;
      }
    }
  }

  return (pt: Point) => {
    let sum = bias;
    for (let j = 0; j < n; j++) {
      sum += alphas[j] * data[j].label * kernelRBF(data[j], pt, gamma);
    }
    return sum;
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function RBFGammaDemo() {
  const [logGamma, setLogGamma] = useState(-0.3); // log10(gamma)
  const gamma = Math.pow(10, logGamma);

  const { grid, trainAcc } = useMemo(() => {
    const predict = trainKernelPerceptron(DATASET, gamma, 50);

    const gridData: { x: number; y: number; val: number }[] = [];
    const step = (DATA_MAX - DATA_MIN) / GRID_RES;
    for (let gx = DATA_MIN; gx <= DATA_MAX; gx += step) {
      for (let gy = DATA_MIN; gy <= DATA_MAX; gy += step) {
        gridData.push({ x: gx, y: gy, val: predict({ x: gx, y: gy, label: 1 }) });
      }
    }

    let correct = 0;
    for (const pt of DATASET) {
      const v = predict(pt);
      if ((v >= 0 && pt.label === 1) || (v < 0 && pt.label === -1)) correct++;
    }

    return { grid: gridData, trainAcc: Math.round((correct / DATASET.length) * 100) };
  }, [gamma]);

  const cellW = PLOT_W / GRID_RES;
  const cellH = PLOT_H / GRID_RES;

  // Description of gamma effect
  const gammaDesc =
    gamma < 0.3
      ? "Smooth boundary (underfitting risk)"
      : gamma > 5
        ? "Very complex boundary (overfitting risk)"
        : "Balanced boundary";

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-800">
          RBF Kernel — Gamma Parameter
        </h3>
        <p className="text-sm text-zinc-500">
          Two-moons dataset. Adjust gamma to see how the decision boundary
          changes from smooth to wiggly.
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
          const alpha = Math.min(Math.abs(cell.val) * 0.12, 0.35);
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
          <circle cx={0} cy={0} r={5} fill="#f59e0b" />
          <text x={10} y={4} fontSize={10} fill="#71717a">
            Upper moon (+1)
          </text>
          <circle cx={0} cy={16} r={5} fill="#3b82f6" />
          <text x={10} y={20} fontSize={10} fill="#71717a">
            Lower moon (-1)
          </text>
        </g>
      </svg>

      {/* Gamma slider */}
      <div className="mt-4">
        <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
          <span className="font-medium">
            gamma ({"\u03B3"})
          </span>
          <span className="font-mono text-zinc-800">{gamma.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={-1.5}
          max={1.5}
          step={0.05}
          value={logGamma}
          onChange={(e) => setLogGamma(parseFloat(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
          <span>0.03 (smooth)</span>
          <span>1</span>
          <span>30 (complex)</span>
        </div>
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
        <span className="rounded bg-zinc-100 px-3 py-1 font-mono text-zinc-700">
          K = exp(-{gamma.toFixed(2)} ||x-y||^2)
        </span>
        <span className="text-zinc-400 text-xs">{gammaDesc}</span>
      </div>
    </div>
  );
}
