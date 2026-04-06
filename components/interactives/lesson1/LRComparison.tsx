"use client";

import { useState, useRef, useCallback } from "react";

// --- Fixed dataset (simple linear: y ≈ 2x + 1) ---
const DATA = [
  { x: 1, y: 3.2 },
  { x: 2, y: 5.1 },
  { x: 3, y: 6.8 },
  { x: 4, y: 9.3 },
  { x: 5, y: 10.7 },
  { x: 6, y: 13.1 },
  { x: 7, y: 14.8 },
  { x: 8, y: 17.2 },
];

const N = DATA.length;
const MAX_ITER = 200;
const PANEL_W = 240;
const PANEL_H = 150;
const PAD = { top: 10, right: 10, bottom: 24, left: 36 };
const PLOT_W = PANEL_W - PAD.left - PAD.right;
const PLOT_H = PANEL_H - PAD.top - PAD.bottom;

// MSE loss for y = w*x + b
function computeLoss(w: number, b: number): number {
  let sum = 0;
  for (const d of DATA) {
    const err = d.y - (w * d.x + b);
    sum += err * err;
  }
  return sum / N;
}

// One gradient descent step
function gdStep(
  w: number,
  b: number,
  lr: number
): { w: number; b: number } {
  let dw = 0;
  let db = 0;
  for (const d of DATA) {
    const pred = w * d.x + b;
    const err = pred - d.y;
    dw += (2 / N) * err * d.x;
    db += (2 / N) * err;
  }
  return { w: w - lr * dw, b: b - lr * db };
}

interface PanelConfig {
  lr: number;
  label: string;
  desc: string;
  color: string;      // stroke
  colorLight: string;  // fill area
  bgClass: string;     // tailwind bg
  borderClass: string;
}

const PANELS: PanelConfig[] = [
  {
    lr: 0.001,
    label: "LR = 0.001",
    desc: "遅すぎる",
    color: "#3b82f6",
    colorLight: "#3b82f620",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-300",
  },
  {
    lr: 0.01,
    label: "LR = 0.01",
    desc: "ちょうどいい",
    color: "#16a34a",
    colorLight: "#16a34a20",
    bgClass: "bg-green-50",
    borderClass: "border-green-300",
  },
  {
    lr: 0.1,
    label: "LR = 0.1",
    desc: "大きすぎる",
    color: "#dc2626",
    colorLight: "#dc262620",
    bgClass: "bg-red-50",
    borderClass: "border-red-300",
  },
];

// Pre-compute all loss curves so animation is just revealing them
function computeCurve(lr: number): number[] {
  const losses: number[] = [];
  let w = 0;
  let b = 0;
  for (let i = 0; i <= MAX_ITER; i++) {
    const loss = computeLoss(w, b);
    // Cap loss for display stability (divergence case)
    losses.push(Math.min(loss, 500));
    const next = gdStep(w, b, lr);
    w = next.w;
    b = next.b;
  }
  return losses;
}

// Map iteration/loss to SVG coordinates
function toSvg(
  iter: number,
  loss: number,
  maxLoss: number
): { sx: number; sy: number } {
  const sx = PAD.left + (iter / MAX_ITER) * PLOT_W;
  const sy = PAD.top + PLOT_H - (Math.min(loss, maxLoss) / maxLoss) * PLOT_H;
  return { sx, sy };
}

function LossPanel({
  config,
  losses,
  visibleCount,
}: {
  config: PanelConfig;
  losses: number[];
  visibleCount: number;
}) {
  const maxLoss = Math.max(...losses) * 1.05;

  // Build polyline points for visible portion
  const points: string[] = [];
  for (let i = 0; i < visibleCount && i < losses.length; i++) {
    const { sx, sy } = toSvg(i, losses[i], maxLoss);
    points.push(`${sx},${sy}`);
  }

  // Y-axis ticks (0, mid, max)
  const yTicks = [0, maxLoss / 2, maxLoss];

  return (
    <div
      className={`rounded-lg border ${config.borderClass} ${config.bgClass} p-3 flex flex-col items-center gap-1`}
    >
      <div className="text-sm font-semibold" style={{ color: config.color }}>
        {config.label}
      </div>
      <div className="text-xs text-gray-500">{config.desc}</div>

      <svg
        width={PANEL_W}
        height={PANEL_H}
        className="mt-1"
        viewBox={`0 0 ${PANEL_W} ${PANEL_H}`}
      >
        {/* Grid lines */}
        {yTicks.map((val, i) => {
          const y = PAD.top + PLOT_H - (val / maxLoss) * PLOT_H;
          return (
            <g key={i}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + PLOT_W}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 4}
                y={y + 3}
                textAnchor="end"
                fontSize={8}
                fill="#9ca3af"
              >
                {val < 10 ? val.toFixed(1) : Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + PLOT_H}
          stroke="#9ca3af"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          y1={PAD.top + PLOT_H}
          x2={PAD.left + PLOT_W}
          y2={PAD.top + PLOT_H}
          stroke="#9ca3af"
          strokeWidth={1}
        />

        {/* X-axis label */}
        <text
          x={PAD.left + PLOT_W / 2}
          y={PANEL_H - 2}
          textAnchor="middle"
          fontSize={9}
          fill="#9ca3af"
        >
          Iteration
        </text>

        {/* Y-axis label */}
        <text
          x={4}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={9}
          fill="#9ca3af"
          transform={`rotate(-90, 4, ${PAD.top + PLOT_H / 2})`}
        >
          Loss
        </text>

        {/* Loss curve */}
        {points.length > 1 && (
          <polyline
            points={points.join(" ")}
            fill="none"
            stroke={config.color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Current point marker */}
        {visibleCount > 0 && (
          <circle
            cx={
              toSvg(
                Math.min(visibleCount - 1, losses.length - 1),
                losses[Math.min(visibleCount - 1, losses.length - 1)],
                maxLoss
              ).sx
            }
            cy={
              toSvg(
                Math.min(visibleCount - 1, losses.length - 1),
                losses[Math.min(visibleCount - 1, losses.length - 1)],
                maxLoss
              ).sy
            }
            r={3}
            fill={config.color}
          />
        )}
      </svg>

      {/* Current loss value */}
      <div className="text-xs text-gray-600 h-4">
        {visibleCount > 0 && (
          <span>
            Loss:{" "}
            <span className="font-mono font-semibold">
              {losses[Math.min(visibleCount - 1, losses.length - 1)].toFixed(2)}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export default function LRComparison() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Pre-compute curves once (stable across renders)
  const [curves] = useState(() => PANELS.map((p) => computeCurve(p.lr)));

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === 0) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      // ~30ms per step → full run in ~6 seconds
      const step = Math.floor(elapsed / 30);

      if (step > MAX_ITER) {
        setVisibleCount(MAX_ITER + 1);
        setRunning(false);
        return;
      }

      setVisibleCount(step + 1);
      rafRef.current = requestAnimationFrame(animate);
    },
    []
  );

  const handleRun = useCallback(() => {
    if (running) return;
    setVisibleCount(0);
    setRunning(true);
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
  }, [running, animate]);

  const handleReset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setVisibleCount(0);
    startTimeRef.current = 0;
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <h3 className="text-lg font-bold text-center mb-1">
        学習率の比較デモ
      </h3>
      <p className="text-sm text-gray-500 text-center mb-4">
        同じデータ・同じ初期値で、学習率だけを変えて勾配降下法を実行します
      </p>

      {/* Three panels */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {PANELS.map((config, i) => (
          <LossPanel
            key={config.lr}
            config={config}
            losses={curves[i]}
            visibleCount={visibleCount}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleRun}
          disabled={running}
          className="px-5 py-2 rounded-md text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {running ? "実行中..." : "▶ Run"}
        </button>
        <button
          onClick={handleReset}
          className="px-5 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
