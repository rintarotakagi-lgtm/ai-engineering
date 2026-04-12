"use client";

import { useState, useMemo } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// --- SVG constants ---
const SVG_W = 520;
const SVG_H = 280;
const PAD_L = 48;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 36;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

const BAR_W = 520;
const BAR_H = 160;
const BAR_PAD_L = 48;
const BAR_PAD_R = 20;
const BAR_PAD_T = 16;
const BAR_PAD_B = 28;

// --- Seeded RNG ---
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function trueFunc(x: number): number {
  return 0.5 * x - 0.3 * x * x + 0.1 * x * x * x;
}

function generateData(n: number, seed: number) {
  const rng = seededRandom(seed);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = -2.5 + 5 * (i / (n - 1)) + (rng() - 0.5) * 0.2;
    pts.push({ x, y: trueFunc(x) + (rng() - 0.5) * 2.0 });
  }
  return pts;
}

const DEGREE = 8;
const data = generateData(20, 55);

// --- L1 (Lasso) via coordinate descent ---
function fitLasso(
  pts: { x: number; y: number }[],
  degree: number,
  lambda: number,
  maxIter = 500
): number[] {
  const n = pts.length;
  const p = degree + 1;

  // Precompute feature matrix
  const X: number[][] = pts.map((pt) => {
    const f: number[] = [];
    for (let d = 0; d <= degree; d++) f.push(Math.pow(pt.x, d));
    return f;
  });
  const y = pts.map((pt) => pt.y);

  const w: number[] = Array(p).fill(0);
  // Initialize with small values
  const rng = seededRandom(123);
  for (let i = 0; i < p; i++) w[i] = (rng() - 0.5) * 0.01;

  for (let iter = 0; iter < maxIter; iter++) {
    for (let j = 0; j < p; j++) {
      // Compute residual without j-th feature
      let rho = 0;
      let xjSq = 0;
      for (let i = 0; i < n; i++) {
        let pred = 0;
        for (let k = 0; k < p; k++) {
          if (k !== j) pred += w[k] * X[i][k];
        }
        rho += X[i][j] * (y[i] - pred);
        xjSq += X[i][j] * X[i][j];
      }

      if (xjSq < 1e-12) {
        w[j] = 0;
        continue;
      }

      if (j === 0) {
        // Don't regularize bias
        w[j] = rho / xjSq;
      } else {
        // Soft thresholding
        const lam = lambda * n;
        if (rho > lam) {
          w[j] = (rho - lam) / xjSq;
        } else if (rho < -lam) {
          w[j] = (rho + lam) / xjSq;
        } else {
          w[j] = 0;
        }
      }
    }
  }

  return w;
}

function evalPoly(x: number, w: number[]): number {
  let y = 0;
  for (let i = 0; i < w.length; i++) y += w[i] * Math.pow(x, i);
  return y;
}

// --- Coordinate helpers ---
const X_MIN = -3;
const X_MAX = 3;
const Y_MIN = -5;
const Y_MAX = 5;

function toSvgX(x: number): number {
  return PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}
function toSvgY(y: number): number {
  return PAD_T + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;
}

export default function LassoDemo() {
  const [lambda, setLambda] = useState(0.05);

  const { weights, noRegWeights, numZero } = useMemo(() => {
    const w = fitLasso(data, DEGREE, lambda);
    const w0 = fitLasso(data, DEGREE, 0, 1000);
    const nz = w.slice(1).filter((v) => Math.abs(v) < 1e-6).length;
    return { weights: w, noRegWeights: w0, numZero: nz };
  }, [lambda]);

  const fittedPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
      const y = Math.max(Y_MIN, Math.min(Y_MAX, evalPoly(x, weights)));
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [weights]);

  const noRegPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
      const y = Math.max(Y_MIN, Math.min(Y_MAX, evalPoly(x, noRegWeights)));
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [noRegWeights]);

  // L1 norm
  const l1Norm = weights.slice(1).reduce((s, w) => s + Math.abs(w), 0);

  // Bar chart
  const maxWeight = Math.max(
    ...weights.slice(1).map(Math.abs),
    ...noRegWeights.slice(1).map(Math.abs),
    0.1
  );
  const barAreaW = BAR_W - BAR_PAD_L - BAR_PAD_R;
  const barAreaH = BAR_H - BAR_PAD_T - BAR_PAD_B;
  const barCount = DEGREE;
  const barSpacing = barAreaW / barCount;
  const barWidth = barSpacing * 0.35;
  const midY = BAR_PAD_T + barAreaH / 2;

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Info */}
      <div className="flex items-center justify-between text-xs bg-zinc-800/60 rounded-lg py-2 px-4">
        <span className="text-zinc-400">
          <InlineMath math={`\\lambda = ${lambda.toFixed(3)}`} />
        </span>
        <div className="flex gap-4">
          <span className="font-mono text-amber-400">||w||₁ = {l1Norm.toFixed(3)}</span>
          <span className="font-mono text-emerald-400">0になった重み: {numZero}/{DEGREE}</span>
        </div>
      </div>

      {/* Main plot */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <line key={`gx${x}`} x1={toSvgX(x)} y1={toSvgY(Y_MIN)} x2={toSvgX(x)} y2={toSvgY(Y_MAX)} stroke="#3f3f46" strokeWidth={x === 0 ? 1 : 0.5} />
        ))}
        {[-4, -2, 0, 2, 4].map((y) => (
          <line key={`gy${y}`} x1={toSvgX(X_MIN)} y1={toSvgY(y)} x2={toSvgX(X_MAX)} y2={toSvgY(y)} stroke="#3f3f46" strokeWidth={y === 0 ? 1 : 0.5} />
        ))}
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <text key={`lx${x}`} x={toSvgX(x)} y={SVG_H - PAD_B + 16} textAnchor="middle" className="text-[10px] fill-zinc-500">{x}</text>
        ))}
        {[-4, -2, 0, 2, 4].map((y) => (
          <text key={`ly${y}`} x={PAD_L - 6} y={toSvgY(y) + 3} textAnchor="end" className="text-[10px] fill-zinc-500">{y}</text>
        ))}

        {/* No-reg ghost */}
        <path d={noRegPath} fill="none" stroke="#71717a" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.3} />

        {/* Lasso curve */}
        <path d={fittedPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />

        {/* Data */}
        {data.map((pt, i) => (
          <circle key={`p${i}`} cx={toSvgX(pt.x)} cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, pt.y)))} r={4} fill="#f59e0b" stroke="#fbbf24" strokeWidth={1} opacity={0.8} />
        ))}

        <line x1={PAD_L + 10} y1={PAD_T + 10} x2={PAD_L + 30} y2={PAD_T + 10} stroke="#f59e0b" strokeWidth={2.5} />
        <text x={PAD_L + 36} y={PAD_T + 14} className="text-[10px] fill-zinc-400">Lasso回帰</text>
        <line x1={PAD_L + 120} y1={PAD_T + 10} x2={PAD_L + 140} y2={PAD_T + 10} stroke="#71717a" strokeWidth={1.5} strokeDasharray="4 3" opacity={0.5} />
        <text x={PAD_L + 146} y={PAD_T + 14} className="text-[10px] fill-zinc-500">正則化なし</text>
      </svg>

      {/* Weight bars */}
      <div className="text-xs text-zinc-400 text-center">
        重みの大きさ — <span className="text-emerald-400">0になった重み</span>はスパース化された特徴量
      </div>
      <svg
        viewBox={`0 0 ${BAR_W} ${BAR_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        <line x1={BAR_PAD_L} y1={midY} x2={BAR_W - BAR_PAD_R} y2={midY} stroke="#3f3f46" strokeWidth={1} />

        {weights.slice(1).map((w, i) => {
          const cx = BAR_PAD_L + (i + 0.5) * barSpacing;
          const isZero = Math.abs(w) < 1e-6;
          const noRegW = noRegWeights[i + 1];
          const noRegH = (noRegW / maxWeight) * (barAreaH / 2);
          const h = (w / maxWeight) * (barAreaH / 2);

          return (
            <g key={`bar${i}`}>
              {/* Ghost bar */}
              <rect
                x={cx - barWidth - 1}
                y={noRegH < 0 ? midY : midY - noRegH}
                width={barWidth}
                height={Math.abs(noRegH)}
                fill="#71717a" opacity={0.2} rx={2}
              />
              {/* Lasso bar */}
              <rect
                x={cx + 1}
                y={h < 0 ? midY : midY - h}
                width={barWidth}
                height={Math.max(isZero ? 0 : 1, Math.abs(h))}
                fill={isZero ? "#10b981" : "#f59e0b"}
                opacity={isZero ? 0.6 : 0.8}
                rx={2}
              />
              {/* Zero marker */}
              {isZero && (
                <text x={cx + 1 + barWidth / 2} y={midY - 4} textAnchor="middle" className="text-[8px] fill-emerald-400 font-bold">0</text>
              )}
              <text x={cx} y={BAR_H - BAR_PAD_B + 14} textAnchor="middle" className="text-[9px] fill-zinc-500">
                w{i + 1}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">
            <InlineMath math="\lambda" /> （正則化の強さ）
          </label>
          <span className="text-xs font-mono text-amber-400">{lambda.toFixed(3)}</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.005} value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>0（正則化なし）</span>
          <span>1（強いスパース化）</span>
        </div>
      </div>
    </div>
  );
}
