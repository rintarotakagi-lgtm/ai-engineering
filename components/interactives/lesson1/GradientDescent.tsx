"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// --- Fixed dataset (x, y) ---
const DATA: [number, number][] = [
  [1, 2.2],
  [2, 2.8],
  [3, 4.5],
  [4, 4.9],
  [5, 6.3],
  [6, 7.1],
];

// --- Coordinate system constants ---
const SVG_W = 320;
const SVG_H = 240;
const PAD = 32;

// Data ranges
const X_MIN = 0;
const X_MAX = 7;
const Y_MIN = 0;
const Y_MAX = 9;

// Loss chart
const LOSS_SVG_W = 320;
const LOSS_SVG_H = 240;
const MAX_HISTORY = 200;

// --- Helpers ---
function toSvgX(x: number): number {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PAD);
}
function toSvgY(y: number): number {
  return SVG_H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SVG_H - 2 * PAD);
}

function computeLoss(w: number, b: number): number {
  let sum = 0;
  for (const [x, y] of DATA) {
    const diff = w * x + b - y;
    sum += diff * diff;
  }
  return sum / (2 * DATA.length);
}

function gradients(w: number, b: number): { dw: number; db: number } {
  let dw = 0;
  let db = 0;
  for (const [x, y] of DATA) {
    const err = w * x + b - y;
    dw += err * x;
    db += err;
  }
  return { dw: dw / DATA.length, db: db / DATA.length };
}

// --- Component ---
export default function GradientDescent() {
  const [w, setW] = useState(0);
  const [b, setB] = useState(0);
  const [lr, setLr] = useState(0.01);
  const [iteration, setIteration] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([computeLoss(0, 0)]);
  const [running, setRunning] = useState(false);

  const wRef = useRef(0);
  const bRef = useRef(0);
  const iterRef = useRef(0);
  const lossHistRef = useRef<number[]>([computeLoss(0, 0)]);
  const runningRef = useRef(false);
  const lrRef = useRef(0.01);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep lr ref in sync
  useEffect(() => {
    lrRef.current = lr;
  }, [lr]);

  const step = useCallback(() => {
    if (!runningRef.current) return;

    const { dw, db } = gradients(wRef.current, bRef.current);
    const currentLr = lrRef.current;
    wRef.current -= currentLr * dw;
    bRef.current -= currentLr * db;
    iterRef.current += 1;

    const loss = computeLoss(wRef.current, bRef.current);
    if (lossHistRef.current.length >= MAX_HISTORY) {
      lossHistRef.current = [...lossHistRef.current.slice(-MAX_HISTORY + 1), loss];
    } else {
      lossHistRef.current = [...lossHistRef.current, loss];
    }

    setW(wRef.current);
    setB(bRef.current);
    setIteration(iterRef.current);
    setLossHistory([...lossHistRef.current]);

    // Stop if converged
    if (loss < 0.001 || iterRef.current > 500) {
      runningRef.current = false;
      setRunning(false);
      return;
    }

    timerRef.current = setTimeout(step, 80);
  }, []);

  const handleStart = useCallback(() => {
    if (running) {
      // Pause
      runningRef.current = false;
      setRunning(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    runningRef.current = true;
    setRunning(true);
    step();
  }, [running, step]);

  const handleReset = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    wRef.current = 0;
    bRef.current = 0;
    iterRef.current = 0;
    const initLoss = computeLoss(0, 0);
    lossHistRef.current = [initLoss];
    setW(0);
    setB(0);
    setIteration(0);
    setLossHistory([initLoss]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const loss = computeLoss(w, b);

  // --- Loss chart scaling ---
  const maxLoss = Math.max(...lossHistory, 0.1);
  const lossToSvgX = (i: number) =>
    PAD +
    (i / Math.max(lossHistory.length - 1, 1)) * (LOSS_SVG_W - 2 * PAD);
  const lossToSvgY = (l: number) =>
    LOSS_SVG_H - PAD - (l / maxLoss) * (LOSS_SVG_H - 2 * PAD);

  // Build loss path
  const lossPath =
    lossHistory.length > 1
      ? lossHistory
          .map((l, i) => `${i === 0 ? "M" : "L"}${lossToSvgX(i)},${lossToSvgY(l)}`)
          .join(" ")
      : "";

  // Regression line endpoints
  const lineX1 = X_MIN;
  const lineX2 = X_MAX;
  const lineY1 = w * lineX1 + b;
  const lineY2 = w * lineX2 + b;

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <h3 className="mb-1 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
        Gradient Descent Visualization
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Watch how gradient descent adjusts the line to fit the data points by
        minimizing the loss function.
      </p>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-4 gap-2 text-center text-sm">
        <Stat label="Weight (w)" value={w.toFixed(4)} />
        <Stat label="Bias (b)" value={b.toFixed(4)} />
        <Stat label="Loss (MSE)" value={loss.toFixed(4)} />
        <Stat label="Iteration" value={String(iteration)} />
      </div>

      {/* Charts */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left: Scatter + Regression */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Data &amp; Regression Line
          </span>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full max-w-sm rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
          >
            {/* Grid lines */}
            {[1, 2, 3, 4, 5, 6].map((x) => (
              <line
                key={`gx-${x}`}
                x1={toSvgX(x)}
                y1={PAD}
                x2={toSvgX(x)}
                y2={SVG_H - PAD}
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-700"
                strokeWidth={0.5}
              />
            ))}
            {[2, 4, 6, 8].map((y) => (
              <line
                key={`gy-${y}`}
                x1={PAD}
                y1={toSvgY(y)}
                x2={SVG_W - PAD}
                y2={toSvgY(y)}
                stroke="currentColor"
                className="text-zinc-200 dark:text-zinc-700"
                strokeWidth={0.5}
              />
            ))}

            {/* Axes */}
            <line
              x1={PAD}
              y1={SVG_H - PAD}
              x2={SVG_W - PAD}
              y2={SVG_H - PAD}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-500"
              strokeWidth={1}
            />
            <line
              x1={PAD}
              y1={PAD}
              x2={PAD}
              y2={SVG_H - PAD}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-500"
              strokeWidth={1}
            />

            {/* Axis labels */}
            {[0, 2, 4, 6].map((x) => (
              <text
                key={`lx-${x}`}
                x={toSvgX(x)}
                y={SVG_H - PAD + 14}
                textAnchor="middle"
                className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
              >
                {x}
              </text>
            ))}
            {[0, 2, 4, 6, 8].map((y) => (
              <text
                key={`ly-${y}`}
                x={PAD - 6}
                y={toSvgY(y) + 3}
                textAnchor="end"
                className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
              >
                {y}
              </text>
            ))}

            {/* Residual lines (error visualization) */}
            {DATA.map(([x, y], i) => {
              const pred = w * x + b;
              return (
                <line
                  key={`res-${i}`}
                  x1={toSvgX(x)}
                  y1={toSvgY(y)}
                  x2={toSvgX(x)}
                  y2={toSvgY(pred)}
                  stroke="#f87171"
                  strokeWidth={1}
                  strokeDasharray="3,2"
                  opacity={0.6}
                />
              );
            })}

            {/* Regression line */}
            <line
              x1={toSvgX(lineX1)}
              y1={toSvgY(lineY1)}
              x2={toSvgX(lineX2)}
              y2={toSvgY(lineY2)}
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Data points */}
            {DATA.map(([x, y], i) => (
              <circle
                key={i}
                cx={toSvgX(x)}
                cy={toSvgY(y)}
                r={5}
                fill="#6366f1"
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}
          </svg>
        </div>

        {/* Right: Loss curve */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Loss Over Iterations
          </span>
          <svg
            viewBox={`0 0 ${LOSS_SVG_W} ${LOSS_SVG_H}`}
            className="w-full max-w-sm rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
          >
            {/* Axes */}
            <line
              x1={PAD}
              y1={LOSS_SVG_H - PAD}
              x2={LOSS_SVG_W - PAD}
              y2={LOSS_SVG_H - PAD}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-500"
              strokeWidth={1}
            />
            <line
              x1={PAD}
              y1={PAD}
              x2={PAD}
              y2={LOSS_SVG_H - PAD}
              stroke="currentColor"
              className="text-zinc-400 dark:text-zinc-500"
              strokeWidth={1}
            />

            {/* Y axis labels for loss */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
              const val = frac * maxLoss;
              return (
                <g key={`ll-${frac}`}>
                  <line
                    x1={PAD}
                    y1={lossToSvgY(val)}
                    x2={LOSS_SVG_W - PAD}
                    y2={lossToSvgY(val)}
                    stroke="currentColor"
                    className="text-zinc-200 dark:text-zinc-700"
                    strokeWidth={0.5}
                  />
                  <text
                    x={PAD - 4}
                    y={lossToSvgY(val) + 3}
                    textAnchor="end"
                    className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Axis titles */}
            <text
              x={LOSS_SVG_W / 2}
              y={LOSS_SVG_H - 6}
              textAnchor="middle"
              className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
            >
              Iteration
            </text>

            {/* Loss curve */}
            {lossPath && (
              <path
                d={lossPath}
                fill="none"
                stroke="#10b981"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Current loss dot */}
            {lossHistory.length > 0 && (
              <circle
                cx={lossToSvgX(lossHistory.length - 1)}
                cy={lossToSvgY(lossHistory[lossHistory.length - 1])}
                r={4}
                fill="#10b981"
                stroke="#fff"
                strokeWidth={1.5}
              />
            )}
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleStart}
          className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600 active:bg-amber-700"
        >
          {running ? "Pause" : iteration > 0 ? "Resume" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          Reset
        </button>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-300">
            Learning Rate:
          </label>
          <input
            type="range"
            min={0.001}
            max={0.1}
            step={0.001}
            value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))}
            className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-amber-500 dark:bg-zinc-700"
          />
          <span className="w-12 text-right font-mono text-sm text-zinc-600 dark:text-zinc-300">
            {lr.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
          Data points
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 rounded bg-amber-500" />
          Regression line
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 rounded bg-red-400" />
          Residuals
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 rounded bg-emerald-500" />
          Loss curve
        </span>
      </div>
    </div>
  );
}

// --- Stat display sub-component ---
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800">
      <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{label}</div>
      <div className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {value}
      </div>
    </div>
  );
}
