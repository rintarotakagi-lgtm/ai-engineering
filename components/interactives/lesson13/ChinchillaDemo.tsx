"use client";

import { useState, useMemo } from "react";

const SVG_W = 640;
const SVG_H = 420;
const PAD = { top: 30, right: 30, bottom: 60, left: 70 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

// C ≈ 6 * N * D
// L(N,D) = (Nc/N)^alphaN + (Dc/D)^alphaD + L_inf
const ALPHA_N = 0.076;
const ALPHA_D = 0.095;
const NC = 8.8e13;
const DC = 5.4e13;
const L_INF = 1.69;

function combinedLoss(n: number, d: number): number {
  return Math.pow(NC / n, ALPHA_N) + Math.pow(DC / d, ALPHA_D) + L_INF;
}

// For a given compute C, parametrize by fraction f allocated to model size
// C = 6*N*D => D = C/(6*N)
function lossForCompute(c: number, logN: number): number {
  const n = Math.pow(10, logN);
  const d = c / (6 * n);
  if (d < 1e6) return 100; // too little data
  return combinedLoss(n, d);
}

const LOG_N_MIN = 8;
const LOG_N_MAX = 12.5;

function toX(logN: number): number {
  return PAD.left + ((logN - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * PLOT_W;
}

function toY(l: number, lMin: number, lMax: number): number {
  const clamped = Math.max(lMin, Math.min(lMax, l));
  return PAD.top + ((lMax - clamped) / (lMax - lMin)) * PLOT_H;
}

function formatParams(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return `${n}`;
}

function formatFlops(c: number): string {
  if (c >= 1e24) return `${(c / 1e24).toFixed(1)}e24`;
  if (c >= 1e21) return `${(c / 1e21).toFixed(1)}e21`;
  if (c >= 1e18) return `${(c / 1e18).toFixed(1)}e18`;
  return c.toExponential(1);
}

function formatTokens(d: number): string {
  if (d >= 1e12) return `${(d / 1e12).toFixed(1)}T`;
  if (d >= 1e9) return `${(d / 1e9).toFixed(0)}B`;
  if (d >= 1e6) return `${(d / 1e6).toFixed(0)}M`;
  return `${d}`;
}

const COMPUTE_LEVELS = [
  { label: "1e19 FLOPs", value: 1e19 },
  { label: "1e20 FLOPs", value: 1e20 },
  { label: "1e21 FLOPs", value: 1e21 },
  { label: "1e22 FLOPs", value: 1e22 },
  { label: "1e23 FLOPs", value: 1e23 },
  { label: "1e24 FLOPs", value: 1e24 },
];

export default function ChinchillaDemo() {
  const [computeIdx, setComputeIdx] = useState(3);
  const compute = COMPUTE_LEVELS[computeIdx].value;

  const { linePath, optLogN, optLoss, lMin, lMax } = useMemo(() => {
    const points: { logN: number; l: number }[] = [];
    let bestLogN = LOG_N_MIN;
    let bestLoss = Infinity;

    for (let ln = LOG_N_MIN; ln <= LOG_N_MAX; ln += 0.02) {
      const l = lossForCompute(compute, ln);
      if (l < 50) {
        points.push({ logN: ln, l });
        if (l < bestLoss) {
          bestLoss = l;
          bestLogN = ln;
        }
      }
    }

    const validLosses = points.map((p) => p.l);
    const computedLMin = Math.min(...validLosses);
    const computedLMax = Math.min(Math.max(...validLosses), computedLMin + 1.5);

    const pathStr = points
      .filter((p) => p.l <= computedLMax)
      .map((p, i) => {
        const x = toX(p.logN);
        const y = toY(p.l, computedLMin - 0.05, computedLMax);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    return {
      linePath: pathStr,
      optLogN: bestLogN,
      optLoss: bestLoss,
      lMin: computedLMin - 0.05,
      lMax: computedLMax,
    };
  }, [compute]);

  const optN = Math.pow(10, optLogN);
  const optD = compute / (6 * optN);

  const ticks = [8, 9, 10, 11, 12];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        Chinchilla 最適配分
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        固定された計算予算で、モデルサイズとデータ量の最適バランスを探ります
      </p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        style={{ maxWidth: SVG_W }}
      >
        {/* grid */}
        {ticks.map((t) => (
          <line
            key={`gx-${t}`}
            x1={toX(t)}
            y1={PAD.top}
            x2={toX(t)}
            y2={PAD.top + PLOT_H}
            stroke="#71717a"
            strokeOpacity={0.15}
            strokeDasharray="4 4"
          />
        ))}

        {/* axes */}
        <line
          x1={PAD.left}
          y1={PAD.top + PLOT_H}
          x2={PAD.left + PLOT_W}
          y2={PAD.top + PLOT_H}
          stroke="#a1a1aa"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + PLOT_H}
          stroke="#a1a1aa"
          strokeWidth={1}
        />

        {/* x ticks */}
        {ticks.map((t) => (
          <text
            key={`xt-${t}`}
            x={toX(t)}
            y={PAD.top + PLOT_H + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#a1a1aa"
          >
            {formatParams(Math.pow(10, t))}
          </text>
        ))}

        {/* x label */}
        <text
          x={PAD.left + PLOT_W / 2}
          y={SVG_H - 8}
          textAnchor="middle"
          fontSize={13}
          fill="#71717a"
        >
          モデルサイズ（パラメータ数）
        </text>

        {/* y label */}
        <text
          x={16}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={13}
          fill="#71717a"
          transform={`rotate(-90, 16, ${PAD.top + PLOT_H / 2})`}
        >
          損失（Loss）
        </text>

        {/* loss curve */}
        <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} />

        {/* optimal point */}
        <circle
          cx={toX(optLogN)}
          cy={toY(optLoss, lMin, lMax)}
          r={8}
          fill="#f59e0b"
          fillOpacity={0.3}
          stroke="#f59e0b"
          strokeWidth={2.5}
        />
        <line
          x1={toX(optLogN)}
          y1={toY(optLoss, lMin, lMax)}
          x2={toX(optLogN)}
          y2={PAD.top + PLOT_H}
          stroke="#f59e0b"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
        />
        <text
          x={toX(optLogN)}
          y={toY(optLoss, lMin, lMax) - 14}
          textAnchor="middle"
          fontSize={11}
          fontWeight="bold"
          fill="#f59e0b"
        >
          最適点
        </text>
      </svg>

      {/* compute slider */}
      <div className="mt-4 flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
          計算予算
        </label>
        <input
          type="range"
          min={0}
          max={COMPUTE_LEVELS.length - 1}
          step={1}
          value={computeIdx}
          onChange={(e) => setComputeIdx(parseInt(e.target.value))}
          className="flex-1 accent-amber-500"
        />
        <span className="text-sm font-mono text-amber-600 whitespace-nowrap">
          {COMPUTE_LEVELS[computeIdx].label}
        </span>
      </div>

      {/* results */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-zinc-50 p-3 text-center dark:bg-zinc-800">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            計算予算
          </div>
          <div className="mt-1 text-sm font-bold text-zinc-700 dark:text-zinc-200">
            {formatFlops(compute)} FLOPs
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-900/20">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            最適モデルサイズ
          </div>
          <div className="mt-1 text-sm font-bold text-amber-600">
            {formatParams(optN)}
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-center dark:bg-amber-900/20">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            最適データ量
          </div>
          <div className="mt-1 text-sm font-bold text-amber-600">
            {formatTokens(optD)} トークン
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500 text-center">
        Chinchillaの知見: モデルを大きくしすぎるよりも、適切なサイズで十分なデータを与える方が効率的
      </p>
    </div>
  );
}
