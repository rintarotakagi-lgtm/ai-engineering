"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// --- Fixed 1D dataset: (x, label) roughly separable ---
const DATA: { x: number; y: number }[] = [
  { x: 1.0, y: 0 },
  { x: 1.5, y: 0 },
  { x: 2.0, y: 0 },
  { x: 2.8, y: 0 },
  { x: 3.2, y: 0 },
  { x: 4.5, y: 1 },
  { x: 5.0, y: 1 },
  { x: 5.5, y: 1 },
  { x: 6.2, y: 1 },
  { x: 6.8, y: 1 },
];

// --- SVG dimensions ---
const SVG_W = 360;
const SVG_H = 260;
const PAD = 36;

const LOSS_SVG_W = 360;
const LOSS_SVG_H = 260;

const MAX_ITER = 200;
const MIN_LOSS = 0.01;

// Data range for x axis
const X_MIN = 0;
const X_MAX = 8;

// --- Helpers ---
function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

function crossEntropyLoss(w: number, b: number): number {
  let sum = 0;
  for (const d of DATA) {
    const p = sigmoid(w * d.x + b);
    const pClamped = Math.max(1e-12, Math.min(1 - 1e-12, p));
    sum += -(d.y * Math.log(pClamped) + (1 - d.y) * Math.log(1 - pClamped));
  }
  return sum / DATA.length;
}

function computeGradients(w: number, b: number): { dw: number; db: number } {
  let dw = 0;
  let db = 0;
  for (const d of DATA) {
    const p = sigmoid(w * d.x + b);
    const err = -(d.y - p);
    dw += err * d.x;
    db += err;
  }
  return { dw: dw / DATA.length, db: db / DATA.length };
}

function computeAccuracy(w: number, b: number): number {
  let correct = 0;
  for (const d of DATA) {
    const p = sigmoid(w * d.x + b);
    const pred = p >= 0.5 ? 1 : 0;
    if (pred === d.y) correct++;
  }
  return correct / DATA.length;
}

// Coordinate transforms for classification plot
function toSvgX(x: number): number {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PAD);
}
function toSvgY(p: number): number {
  // p in [0, 1]
  return SVG_H - PAD - p * (SVG_H - 2 * PAD);
}

// --- Component ---
export default function LogisticGD() {
  const [w, setW] = useState(0);
  const [b, setB] = useState(0);
  const [lr, setLr] = useState(0.1);
  const [iteration, setIteration] = useState(0);
  const [lossHistory, setLossHistory] = useState<number[]>([
    crossEntropyLoss(0, 0),
  ]);
  const [running, setRunning] = useState(false);

  const wRef = useRef(0);
  const bRef = useRef(0);
  const iterRef = useRef(0);
  const lossHistRef = useRef<number[]>([crossEntropyLoss(0, 0)]);
  const runningRef = useRef(false);
  const lrRef = useRef(0.1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    lrRef.current = lr;
  }, [lr]);

  const step = useCallback(() => {
    if (!runningRef.current) return;

    const { dw, db } = computeGradients(wRef.current, bRef.current);
    const currentLr = lrRef.current;
    wRef.current -= currentLr * dw;
    bRef.current -= currentLr * db;
    iterRef.current += 1;

    const loss = crossEntropyLoss(wRef.current, bRef.current);
    lossHistRef.current = [...lossHistRef.current, loss];

    setW(wRef.current);
    setB(bRef.current);
    setIteration(iterRef.current);
    setLossHistory([...lossHistRef.current]);

    if (loss < MIN_LOSS || iterRef.current >= MAX_ITER) {
      runningRef.current = false;
      setRunning(false);
      return;
    }

    timerRef.current = setTimeout(step, 80);
  }, []);

  const handleStart = useCallback(() => {
    if (running) {
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
    const initLoss = crossEntropyLoss(0, 0);
    lossHistRef.current = [initLoss];
    setW(0);
    setB(0);
    setIteration(0);
    setLossHistory([initLoss]);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const loss = crossEntropyLoss(w, b);
  const accuracy = computeAccuracy(w, b);

  // Decision boundary: sigmoid(w*x + b) = 0.5 => w*x + b = 0 => x = -b/w
  const decisionX = w !== 0 ? -b / w : null;

  // --- Sigmoid curve points ---
  const sigmoidPoints: string[] = [];
  const numCurvePoints = 80;
  for (let i = 0; i <= numCurvePoints; i++) {
    const x = X_MIN + (i / numCurvePoints) * (X_MAX - X_MIN);
    const p = sigmoid(w * x + b);
    const sx = toSvgX(x);
    const sy = toSvgY(p);
    sigmoidPoints.push(`${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }
  const sigmoidPath = sigmoidPoints.join(" ");

  // --- Loss chart scaling ---
  const maxLoss = Math.max(...lossHistory, 0.1);
  const lossToSvgX = (i: number) =>
    PAD +
    (i / Math.max(lossHistory.length - 1, 1)) * (LOSS_SVG_W - 2 * PAD);
  const lossToSvgY = (l: number) =>
    LOSS_SVG_H - PAD - (l / maxLoss) * (LOSS_SVG_H - 2 * PAD);

  const lossPath =
    lossHistory.length > 1
      ? lossHistory
          .map(
            (l, i) =>
              `${i === 0 ? "M" : "L"}${lossToSvgX(i).toFixed(1)},${lossToSvgY(l).toFixed(1)}`
          )
          .join(" ")
      : "";

  // Y axis ticks for probability
  const pTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Header */}
      <h3 className="mb-1 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
        Logistic Regression &mdash; Gradient Descent
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        Watch gradient descent fit a sigmoid curve to classify two groups by
        minimizing cross-entropy loss.
      </p>

      {/* Stats row */}
      <div className="mb-4 grid grid-cols-5 gap-2 text-center text-sm">
        <Stat label="Weight (w)" value={w.toFixed(4)} />
        <Stat label="Bias (b)" value={b.toFixed(4)} />
        <Stat label="Loss (CE)" value={loss.toFixed(4)} />
        <Stat label="Accuracy" value={`${(accuracy * 100).toFixed(0)}%`} />
        <Stat label="Iteration" value={String(iteration)} />
      </div>

      {/* Charts */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left: Classification plot */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Classification &amp; Sigmoid Curve
          </span>
          <svg
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full max-w-sm rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800"
          >
            {/* Grid lines - vertical */}
            {[1, 2, 3, 4, 5, 6, 7].map((x) => (
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
            {/* Grid lines - horizontal */}
            {pTicks.map((p) => (
              <line
                key={`gp-${p}`}
                x1={PAD}
                y1={toSvgY(p)}
                x2={SVG_W - PAD}
                y2={toSvgY(p)}
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

            {/* X axis labels */}
            {[0, 2, 4, 6, 8].map((x) => (
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
            {/* Y axis labels (probability) */}
            {pTicks.map((p) => (
              <text
                key={`lp-${p}`}
                x={PAD - 6}
                y={toSvgY(p) + 3}
                textAnchor="end"
                className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
              >
                {p.toFixed(2)}
              </text>
            ))}

            {/* Axis titles */}
            <text
              x={SVG_W / 2}
              y={SVG_H - 4}
              textAnchor="middle"
              className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
            >
              x
            </text>
            <text
              x={8}
              y={SVG_H / 2}
              textAnchor="middle"
              className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
              transform={`rotate(-90, 8, ${SVG_H / 2})`}
            >
              P(y=1)
            </text>

            {/* Decision boundary (vertical dashed line) */}
            {decisionX !== null &&
              decisionX > X_MIN &&
              decisionX < X_MAX && (
                <line
                  x1={toSvgX(decisionX)}
                  y1={PAD}
                  x2={toSvgX(decisionX)}
                  y2={SVG_H - PAD}
                  stroke="#a1a1aa"
                  strokeWidth={1.5}
                  strokeDasharray="6,4"
                  opacity={0.8}
                />
              )}

            {/* Sigmoid curve */}
            <path
              d={sigmoidPath}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points on number line (y=0 at bottom, y=1 at top) */}
            {DATA.map((d, i) => (
              <circle
                key={i}
                cx={toSvgX(d.x)}
                cy={toSvgY(d.y)}
                r={5.5}
                fill={d.y === 0 ? "#3b82f6" : "#f59e0b"}
                stroke="#fff"
                strokeWidth={1.5}
              />
            ))}
          </svg>
        </div>

        {/* Right: Loss curve */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Cross-Entropy Loss Over Iterations
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

            {/* Y axis labels and grid for loss */}
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
                    {val.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Axis titles */}
            <text
              x={LOSS_SVG_W / 2}
              y={LOSS_SVG_H - 4}
              textAnchor="middle"
              className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
            >
              Iteration
            </text>
            <text
              x={8}
              y={LOSS_SVG_H / 2}
              textAnchor="middle"
              className="fill-zinc-400 text-[9px] dark:fill-zinc-500"
              transform={`rotate(-90, 8, ${LOSS_SVG_H / 2})`}
            >
              Loss
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
            min={0.01}
            max={1.0}
            step={0.01}
            value={lr}
            onChange={(e) => setLr(parseFloat(e.target.value))}
            className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-amber-500 dark:bg-zinc-700"
          />
          <span className="w-12 text-right font-mono text-sm text-zinc-600 dark:text-zinc-300">
            {lr.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
          Class 0
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
          Class 1
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 rounded bg-amber-500" />
          Sigmoid curve
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-0 border-l-[1.5px] border-dashed border-zinc-400" />
          Decision boundary
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
      <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
        {label}
      </div>
      <div className="font-mono text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        {value}
      </div>
    </div>
  );
}
