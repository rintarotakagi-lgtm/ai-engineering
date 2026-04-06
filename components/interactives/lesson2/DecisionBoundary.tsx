"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DataPoint {
  x: number;
  label: 0 | 1; // 0 = class 0 (blue), 1 = class 1 (amber)
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const VIEWBOX_W = 520;
const VIEWBOX_H = 320;
const PADDING_L = 45;
const PADDING_R = 20;
const PADDING_T = 50;
const PADDING_B = 60;
const PLOT_W = VIEWBOX_W - PADDING_L - PADDING_R;
const PLOT_H = VIEWBOX_H - PADDING_T - PADDING_B;

/** Data-space x range */
const X_MIN = -1;
const X_MAX = 11;

/** Fixed dataset: ~10 points with some overlap around x=5 */
const DATASET: DataPoint[] = [
  { x: 0.5, label: 0 },
  { x: 1.5, label: 0 },
  { x: 2.8, label: 0 },
  { x: 3.5, label: 0 },
  { x: 4.5, label: 0 },
  { x: 5.5, label: 1 },
  { x: 6.0, label: 1 },
  { x: 7.2, label: 1 },
  { x: 8.5, label: 1 },
  { x: 9.5, label: 1 },
  // overlap zone
  { x: 4.8, label: 1 },
  { x: 5.2, label: 0 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Sigmoid function */
function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

/** Convert data x → SVG x */
function toSvgX(x: number): number {
  return PADDING_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}

/** Convert sigmoid output (0–1) → SVG y (within plot area) */
function sigToSvgY(s: number): number {
  return PADDING_T + PLOT_H - s * PLOT_H;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function GridAndAxes() {
  const ticks: React.ReactElement[] = [];

  // x-axis ticks (0–10)
  for (let x = 0; x <= 10; x += 2) {
    const sx = toSvgX(x);
    ticks.push(
      <line
        key={`xg-${x}`}
        x1={sx}
        y1={PADDING_T}
        x2={sx}
        y2={PADDING_T + PLOT_H}
        stroke="#e4e4e7"
        strokeWidth={0.5}
      />,
    );
    ticks.push(
      <text
        key={`xl-${x}`}
        x={sx}
        y={PADDING_T + PLOT_H + 16}
        textAnchor="middle"
        fontSize={11}
        fill="#71717a"
      >
        {x}
      </text>,
    );
  }

  // y-axis ticks for sigmoid (0, 0.5, 1)
  for (const s of [0, 0.25, 0.5, 0.75, 1]) {
    const sy = sigToSvgY(s);
    ticks.push(
      <line
        key={`yg-${s}`}
        x1={PADDING_L}
        y1={sy}
        x2={PADDING_L + PLOT_W}
        y2={sy}
        stroke={s === 0.5 ? "#d4d4d8" : "#e4e4e7"}
        strokeWidth={s === 0.5 ? 1 : 0.5}
        strokeDasharray={s === 0.5 ? "4 3" : undefined}
      />,
    );
    ticks.push(
      <text
        key={`yl-${s}`}
        x={PADDING_L - 8}
        y={sy + 4}
        textAnchor="end"
        fontSize={11}
        fill="#71717a"
      >
        {s}
      </text>,
    );
  }

  return (
    <g>
      {ticks}
      {/* x-axis */}
      <line
        x1={PADDING_L}
        y1={PADDING_T + PLOT_H}
        x2={PADDING_L + PLOT_W}
        y2={PADDING_T + PLOT_H}
        stroke="#52525b"
        strokeWidth={1.5}
      />
      {/* y-axis */}
      <line
        x1={PADDING_L}
        y1={PADDING_T}
        x2={PADDING_L}
        y2={PADDING_T + PLOT_H}
        stroke="#52525b"
        strokeWidth={1.5}
      />
      {/* axis labels */}
      <text
        x={PADDING_L + PLOT_W / 2}
        y={VIEWBOX_H - 8}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill="#52525b"
      >
        x
      </text>
      <text
        x={12}
        y={PADDING_T + PLOT_H / 2}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill="#52525b"
        transform={`rotate(-90, 12, ${PADDING_T + PLOT_H / 2})`}
      >
        σ(wx + b)
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DecisionBoundary() {
  const [w, setW] = useState(2);
  const [b, setB] = useState(-10);

  const { sigmoidPath, boundary, accuracy, correctSet } = useMemo(() => {
    // Build sigmoid curve path
    const steps = 200;
    const pathParts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const dataX = X_MIN + (i / steps) * (X_MAX - X_MIN);
      const s = sigmoid(w * dataX + b);
      const sx = toSvgX(dataX);
      const sy = sigToSvgY(s);
      pathParts.push(`${i === 0 ? "M" : "L"}${sx.toFixed(2)},${sy.toFixed(2)}`);
    }
    const sigmoidPathStr = pathParts.join(" ");

    // Decision boundary: x = -b/w
    const boundaryX = w !== 0 ? -b / w : null;

    // Accuracy
    let correct = 0;
    const correctFlags: boolean[] = [];
    for (const pt of DATASET) {
      const predicted = sigmoid(w * pt.x + b) >= 0.5 ? 1 : 0;
      const isCorrect = predicted === pt.label;
      correctFlags.push(isCorrect);
      if (isCorrect) correct++;
    }
    const acc = Math.round((correct / DATASET.length) * 100);

    return {
      sigmoidPath: sigmoidPathStr,
      boundary: boundaryX,
      accuracy: acc,
      correctSet: correctFlags,
    };
  }, [w, b]);

  // Determine which side is class 0 vs class 1
  // If w > 0, left of boundary → low sigmoid → class 0, right → class 1
  // If w < 0, it flips
  const class0Left = w >= 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-800">
          Logistic Regression — Decision Boundary
        </h3>
        <p className="text-sm text-zinc-500">
          Adjust w and b to fit the sigmoid and separate the two classes.
        </p>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        className="rounded-lg border border-zinc-200 bg-white"
      >
        {/* Background regions */}
        {boundary !== null &&
          boundary > X_MIN &&
          boundary < X_MAX && (
            <>
              <rect
                x={PADDING_L}
                y={PADDING_T}
                width={toSvgX(boundary) - PADDING_L}
                height={PLOT_H}
                fill={class0Left ? "rgba(59,130,246,0.06)" : "rgba(245,158,11,0.06)"}
              />
              <rect
                x={toSvgX(boundary)}
                y={PADDING_T}
                width={PADDING_L + PLOT_W - toSvgX(boundary)}
                height={PLOT_H}
                fill={class0Left ? "rgba(245,158,11,0.06)" : "rgba(59,130,246,0.06)"}
              />
            </>
          )}

        <GridAndAxes />

        {/* Sigmoid curve */}
        <path
          d={sigmoidPath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Decision boundary vertical line */}
        {boundary !== null &&
          boundary > X_MIN &&
          boundary < X_MAX && (
            <>
              <line
                x1={toSvgX(boundary)}
                y1={PADDING_T}
                x2={toSvgX(boundary)}
                y2={PADDING_T + PLOT_H}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="6 4"
              />
              <text
                x={toSvgX(boundary)}
                y={PADDING_T - 6}
                textAnchor="middle"
                fontSize={10}
                fill="#ef4444"
                fontWeight={600}
              >
                x = {boundary.toFixed(1)}
              </text>
            </>
          )}

        {/* Data points */}
        {DATASET.map((pt, i) => {
          const sx = toSvgX(pt.x);
          // Place class 0 below the 0.5 line, class 1 above
          const sy =
            pt.label === 0
              ? sigToSvgY(0.5) + 18 + (i % 3) * 6
              : sigToSvgY(0.5) - 18 - (i % 3) * 6;
          const isCorrect = correctSet[i];
          const fillColor = pt.label === 0 ? "#3b82f6" : "#f59e0b";

          return (
            <g key={i}>
              <circle
                cx={sx}
                cy={sy}
                r={7}
                fill={fillColor}
                stroke={isCorrect ? "#fff" : "#ef4444"}
                strokeWidth={isCorrect ? 1.5 : 2.5}
                opacity={0.9}
              />
              {!isCorrect && (
                <circle
                  cx={sx}
                  cy={sy}
                  r={10}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${PADDING_L + 8}, ${PADDING_T + 10})`}>
          <circle cx={0} cy={0} r={5} fill="#3b82f6" />
          <text x={10} y={4} fontSize={10} fill="#71717a">
            Class 0
          </text>
          <circle cx={0} cy={16} r={5} fill="#f59e0b" />
          <text x={10} y={20} fontSize={10} fill="#71717a">
            Class 1
          </text>
        </g>
      </svg>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* w slider */}
        <div>
          <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
            <span className="font-medium">
              w <span className="text-zinc-400 font-normal">(weight)</span>
            </span>
            <span className="font-mono text-zinc-800">{w.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={w}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
            <span>-5</span>
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        {/* b slider */}
        <div>
          <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
            <span className="font-medium">
              b <span className="text-zinc-400 font-normal">(bias)</span>
            </span>
            <span className="font-mono text-zinc-800">{b.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={-20}
            max={20}
            step={0.5}
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
            <span>-20</span>
            <span>0</span>
            <span>20</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span className="rounded bg-zinc-100 px-3 py-1 font-mono text-zinc-700">
          σ(
          {w.toFixed(1)}x {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(1)})
        </span>
        <span
          className={`rounded px-3 py-1 font-semibold ${
            accuracy === 100
              ? "bg-emerald-100 text-emerald-700"
              : accuracy >= 75
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          Accuracy: {accuracy}%
        </span>
        {boundary !== null && boundary > X_MIN && boundary < X_MAX && (
          <span className="text-zinc-400">
            Boundary at x = {boundary.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
