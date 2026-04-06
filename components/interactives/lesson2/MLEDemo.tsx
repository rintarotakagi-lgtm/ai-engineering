"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface DataPoint {
  x: number;
  y: 0 | 1; // binary label
}

/** Fixed dataset — a mix of 0s and 1s spread across x */
const DATA: DataPoint[] = [
  { x: -3.0, y: 0 },
  { x: -2.0, y: 0 },
  { x: -0.5, y: 0 },
  { x: 0.5, y: 0 },
  { x: 1.0, y: 1 },
  { x: 2.0, y: 1 },
  { x: 3.0, y: 1 },
  { x: 4.0, y: 1 },
];

/* Sigmoid chart dimensions */
const SIG_W = 520;
const SIG_H = 300;
const SIG_PAD = 50;
const SIG_PLOT_W = SIG_W - SIG_PAD * 2;
const SIG_PLOT_H = SIG_H - SIG_PAD * 2;

const X_MIN = -5;
const X_MAX = 6;

/* Bar chart dimensions */
const BAR_W = 520;
const BAR_H = 200;
const BAR_PAD_L = 50;
const BAR_PAD_R = 20;
const BAR_PAD_T = 30;
const BAR_PAD_B = 40;
const BAR_PLOT_W = BAR_W - BAR_PAD_L - BAR_PAD_R;
const BAR_PLOT_H = BAR_H - BAR_PAD_T - BAR_PAD_B;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function sigmoid(z: number): number {
  if (z > 500) return 1;
  if (z < -500) return 0;
  return 1 / (1 + Math.exp(-z));
}

/** Map data x → SVG x in sigmoid chart */
function sigXToSvg(x: number): number {
  return SIG_PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * SIG_PLOT_W;
}

/** Map probability (0–1) → SVG y in sigmoid chart */
function sigYToSvg(p: number): number {
  return SIG_PAD + SIG_PLOT_H - p * SIG_PLOT_H;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SigmoidGrid() {
  const elements: React.ReactElement[] = [];

  // Vertical grid + labels
  for (let x = X_MIN; x <= X_MAX; x += 1) {
    const sx = sigXToSvg(x);
    elements.push(
      <line
        key={`vg-${x}`}
        x1={sx}
        y1={SIG_PAD}
        x2={sx}
        y2={SIG_PAD + SIG_PLOT_H}
        stroke="#e4e4e7"
        strokeWidth={0.5}
      />,
    );
    if (x % 2 === 0) {
      elements.push(
        <text
          key={`xl-${x}`}
          x={sx}
          y={SIG_PAD + SIG_PLOT_H + 16}
          textAnchor="middle"
          fontSize={11}
          fill="#71717a"
        >
          {x}
        </text>,
      );
    }
  }

  // Horizontal grid at 0, 0.25, 0.5, 0.75, 1
  for (const p of [0, 0.25, 0.5, 0.75, 1]) {
    const sy = sigYToSvg(p);
    elements.push(
      <line
        key={`hg-${p}`}
        x1={SIG_PAD}
        y1={sy}
        x2={SIG_PAD + SIG_PLOT_W}
        y2={sy}
        stroke={p === 0.5 ? "#d4d4d8" : "#e4e4e7"}
        strokeWidth={p === 0.5 ? 1 : 0.5}
        strokeDasharray={p === 0.5 ? "4 3" : undefined}
      />,
    );
    elements.push(
      <text
        key={`yl-${p}`}
        x={SIG_PAD - 8}
        y={sy + 4}
        textAnchor="end"
        fontSize={11}
        fill="#71717a"
      >
        {p.toFixed(2)}
      </text>,
    );
  }

  return <g>{elements}</g>;
}

function SigmoidAxes() {
  return (
    <g>
      <line
        x1={SIG_PAD}
        y1={SIG_PAD + SIG_PLOT_H}
        x2={SIG_PAD + SIG_PLOT_W}
        y2={SIG_PAD + SIG_PLOT_H}
        stroke="#52525b"
        strokeWidth={1.5}
      />
      <line
        x1={SIG_PAD}
        y1={SIG_PAD}
        x2={SIG_PAD}
        y2={SIG_PAD + SIG_PLOT_H}
        stroke="#52525b"
        strokeWidth={1.5}
      />
      <text
        x={SIG_PAD + SIG_PLOT_W / 2}
        y={SIG_H - 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill="#52525b"
      >
        x
      </text>
      <text
        x={10}
        y={SIG_PAD + SIG_PLOT_H / 2}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill="#52525b"
        transform={`rotate(-90, 10, ${SIG_PAD + SIG_PLOT_H / 2})`}
      >
        σ(wx + b)
      </text>
    </g>
  );
}

function SigmoidCurve({ w, b }: { w: number; b: number }) {
  const steps = 200;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const x = X_MIN + (i / steps) * (X_MAX - X_MIN);
    const p = sigmoid(w * x + b);
    const sx = sigXToSvg(x);
    const sy = sigYToSvg(p);
    points.push(`${sx},${sy}`);
  }

  return (
    <polyline
      points={points.join(" ")}
      fill="none"
      stroke="#6366f1"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MLEDemo() {
  const [w, setW] = useState(1.0);
  const [b, setB] = useState(0.0);

  /** Per-point likelihood and total log-likelihood */
  const { likelihoods, logLikelihood } = useMemo(() => {
    const lk = DATA.map((d) => {
      const p = sigmoid(w * d.x + b);
      return d.y === 1 ? p : 1 - p;
    });
    const ll = lk.reduce((sum, l) => sum + Math.log(Math.max(l, 1e-15)), 0);
    return { likelihoods: lk, logLikelihood: ll };
  }, [w, b]);

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Title */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-800">
          Maximum Likelihood Estimation
        </h3>
        <p className="text-sm text-zinc-500">
          Adjust <span className="font-mono">w</span> and{" "}
          <span className="font-mono">b</span> to maximize the log-likelihood.
          Make the model &quot;believe&quot; in every data point.
        </p>
      </div>

      {/* Sigmoid plot */}
      <svg
        viewBox={`0 0 ${SIG_W} ${SIG_H}`}
        width="100%"
        className="rounded-lg border border-zinc-200 bg-white"
      >
        <SigmoidGrid />
        <SigmoidAxes />
        <SigmoidCurve w={w} b={b} />

        {/* Data points */}
        {DATA.map((d, i) => {
          const sx = sigXToSvg(d.x);
          // y=1 plotted at top (p=1), y=0 at bottom (p=0)
          // But also show a faint connector to the curve
          const pHat = sigmoid(w * d.x + b);
          const syCurve = sigYToSvg(pHat);
          const syPoint = sigYToSvg(d.y);

          return (
            <g key={i}>
              {/* Vertical line from point to curve */}
              <line
                x1={sx}
                y1={syPoint}
                x2={sx}
                y2={syCurve}
                stroke={likelihoods[i] > 0.5 ? "#22c55e" : "#ef4444"}
                strokeWidth={1}
                strokeDasharray="3 2"
                opacity={0.5}
              />
              {/* Data point */}
              <circle
                cx={sx}
                cy={syPoint}
                r={6}
                fill={d.y === 1 ? "#6366f1" : "#f97316"}
                stroke="#fff"
                strokeWidth={2}
              />
              {/* Label */}
              <text
                x={sx}
                y={syPoint + (d.y === 1 ? -12 : 16)}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill={d.y === 1 ? "#6366f1" : "#f97316"}
              >
                y={d.y}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Sliders */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
            <span>
              Weight <span className="font-mono">w</span>
            </span>
            <span className="font-mono text-zinc-800 font-semibold">
              {w.toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={w}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
            <span>
              Bias <span className="font-mono">b</span>
            </span>
            <span className="font-mono text-zinc-800 font-semibold">
              {b.toFixed(2)}
            </span>
          </label>
          <input
            type="range"
            min={-10}
            max={10}
            step={0.1}
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Log-likelihood display */}
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="rounded bg-zinc-100 px-3 py-1 font-mono text-zinc-700">
          Log-Likelihood ={" "}
          <span
            className={
              logLikelihood > -3
                ? "text-green-600 font-semibold"
                : logLikelihood > -6
                  ? "text-amber-600 font-semibold"
                  : "text-red-600 font-semibold"
            }
          >
            {logLikelihood.toFixed(3)}
          </span>
        </span>
        <span className="text-zinc-400 text-xs">
          (closer to 0 = better fit)
        </span>
      </div>

      {/* Likelihood bar chart */}
      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-600 mb-1">
          Per-point likelihood
        </p>
        <svg
          viewBox={`0 0 ${BAR_W} ${BAR_H}`}
          width="100%"
          className="rounded-lg border border-zinc-200 bg-white"
        >
          {/* 0.5 threshold line */}
          <line
            x1={BAR_PAD_L}
            y1={BAR_PAD_T + BAR_PLOT_H * 0.5}
            x2={BAR_PAD_L + BAR_PLOT_W}
            y2={BAR_PAD_T + BAR_PLOT_H * 0.5}
            stroke="#d4d4d8"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          <text
            x={BAR_PAD_L - 8}
            y={BAR_PAD_T + BAR_PLOT_H * 0.5 + 4}
            textAnchor="end"
            fontSize={10}
            fill="#a1a1aa"
          >
            0.5
          </text>

          {/* Y-axis labels */}
          <text
            x={BAR_PAD_L - 8}
            y={BAR_PAD_T + 4}
            textAnchor="end"
            fontSize={10}
            fill="#71717a"
          >
            1.0
          </text>
          <text
            x={BAR_PAD_L - 8}
            y={BAR_PAD_T + BAR_PLOT_H + 4}
            textAnchor="end"
            fontSize={10}
            fill="#71717a"
          >
            0.0
          </text>

          {/* Y-axis */}
          <line
            x1={BAR_PAD_L}
            y1={BAR_PAD_T}
            x2={BAR_PAD_L}
            y2={BAR_PAD_T + BAR_PLOT_H}
            stroke="#52525b"
            strokeWidth={1.5}
          />
          {/* X-axis */}
          <line
            x1={BAR_PAD_L}
            y1={BAR_PAD_T + BAR_PLOT_H}
            x2={BAR_PAD_L + BAR_PLOT_W}
            y2={BAR_PAD_T + BAR_PLOT_H}
            stroke="#52525b"
            strokeWidth={1.5}
          />

          {/* Bars */}
          {DATA.map((d, i) => {
            const lk = likelihoods[i];
            const barCount = DATA.length;
            const gap = 8;
            const barW = (BAR_PLOT_W - gap * (barCount + 1)) / barCount;
            const bx = BAR_PAD_L + gap + i * (barW + gap);
            const barHeight = lk * BAR_PLOT_H;
            const by = BAR_PAD_T + BAR_PLOT_H - barHeight;
            const color = lk > 0.5 ? "#22c55e" : "#ef4444";

            return (
              <g key={i}>
                <rect
                  x={bx}
                  y={by}
                  width={barW}
                  height={barHeight}
                  fill={color}
                  opacity={0.8}
                  rx={2}
                />
                {/* Likelihood value on top */}
                <text
                  x={bx + barW / 2}
                  y={by - 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={color}
                >
                  {lk.toFixed(2)}
                </text>
                {/* X-axis label: x value and class */}
                <text
                  x={bx + barW / 2}
                  y={BAR_PAD_T + BAR_PLOT_H + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#71717a"
                >
                  x={d.x}
                </text>
                <text
                  x={bx + barW / 2}
                  y={BAR_PAD_T + BAR_PLOT_H + 26}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill={d.y === 1 ? "#6366f1" : "#f97316"}
                >
                  y={d.y}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
