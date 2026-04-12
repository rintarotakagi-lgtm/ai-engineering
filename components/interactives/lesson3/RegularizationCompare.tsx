"use client";

import { useState, useMemo } from "react";
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// --- SVG constants ---
const SVG_W = 250;
const SVG_H = 220;
const PAD_L = 36;
const PAD_R = 12;
const PAD_T = 20;
const PAD_B = 28;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

const BAR_W = 250;
const BAR_H = 130;
const BAR_PAD_L = 36;
const BAR_PAD_R = 12;
const BAR_PAD_T = 12;
const BAR_PAD_B = 24;

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

// --- Ridge (L2) ---
function fitRidge(pts: { x: number; y: number }[], degree: number, lambda: number): number[] {
  const n = pts.length;
  const p = degree + 1;
  const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  const Xty: number[] = Array(p).fill(0);
  for (const pt of pts) {
    const f: number[] = [];
    for (let d = 0; d <= degree; d++) f.push(Math.pow(pt.x, d));
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) XtX[i][j] += f[i] * f[j];
      Xty[i] += f[i] * pt.y;
    }
  }
  for (let i = 1; i < p; i++) XtX[i][i] += lambda * n;
  const aug = XtX.map((row, i) => [...row, Xty[i]]);
  for (let col = 0; col < p; col++) {
    let maxRow = col;
    for (let row = col + 1; row < p; row++) {
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    }
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    if (Math.abs(aug[col][col]) < 1e-12) continue;
    const pivot = aug[col][col];
    for (let j = col; j <= p; j++) aug[col][j] /= pivot;
    for (let row = 0; row < p; row++) {
      if (row === col) continue;
      const fac = aug[row][col];
      for (let j = col; j <= p; j++) aug[row][j] -= fac * aug[col][j];
    }
  }
  return aug.map((r) => r[p]);
}

// --- Lasso (L1) via coordinate descent ---
function fitLasso(pts: { x: number; y: number }[], degree: number, lambda: number, maxIter = 500): number[] {
  const n = pts.length;
  const p = degree + 1;
  const X: number[][] = pts.map((pt) => {
    const f: number[] = [];
    for (let d = 0; d <= degree; d++) f.push(Math.pow(pt.x, d));
    return f;
  });
  const y = pts.map((pt) => pt.y);
  const w: number[] = Array(p).fill(0);
  for (let iter = 0; iter < maxIter; iter++) {
    for (let j = 0; j < p; j++) {
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
      if (xjSq < 1e-12) { w[j] = 0; continue; }
      if (j === 0) {
        w[j] = rho / xjSq;
      } else {
        const lam = lambda * n;
        if (rho > lam) w[j] = (rho - lam) / xjSq;
        else if (rho < -lam) w[j] = (rho + lam) / xjSq;
        else w[j] = 0;
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

function buildPath(w: number[]): string {
  const pts: string[] = [];
  for (let i = 0; i <= 150; i++) {
    const x = X_MIN + (i / 150) * (X_MAX - X_MIN);
    const y = Math.max(Y_MIN, Math.min(Y_MAX, evalPoly(x, w)));
    pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
  }
  return pts.join(" ");
}

export default function RegularizationCompare() {
  const [lambda, setLambda] = useState(0.1);

  const { ridgeW, lassoW } = useMemo(() => {
    return {
      ridgeW: fitRidge(data, DEGREE, lambda),
      lassoW: fitLasso(data, DEGREE, lambda),
    };
  }, [lambda]);

  const ridgePath = useMemo(() => buildPath(ridgeW), [ridgeW]);
  const lassoPath = useMemo(() => buildPath(lassoW), [lassoW]);

  const ridgeNonZero = ridgeW.slice(1).filter((w) => Math.abs(w) > 1e-6).length;
  const lassoNonZero = lassoW.slice(1).filter((w) => Math.abs(w) > 1e-6).length;

  // Bar chart scaling
  const maxWeight = Math.max(
    ...ridgeW.slice(1).map(Math.abs),
    ...lassoW.slice(1).map(Math.abs),
    0.1
  );
  const barAreaW = BAR_W - BAR_PAD_L - BAR_PAD_R;
  const barAreaH = BAR_H - BAR_PAD_T - BAR_PAD_B;
  const barCount = DEGREE;
  const barSpacing = barAreaW / barCount;
  const barWidth = barSpacing * 0.7;
  const midY = BAR_PAD_T + barAreaH / 2;

  function renderPlot(path: string, title: string, color: string) {
    return (
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {[-2, 0, 2].map((x) => (
          <line key={`gx${x}`} x1={toSvgX(x)} y1={toSvgY(Y_MIN)} x2={toSvgX(x)} y2={toSvgY(Y_MAX)} stroke="#3f3f46" strokeWidth={x === 0 ? 1 : 0.5} />
        ))}
        {[-4, -2, 0, 2, 4].map((y) => (
          <line key={`gy${y}`} x1={toSvgX(X_MIN)} y1={toSvgY(y)} x2={toSvgX(X_MAX)} y2={toSvgY(y)} stroke="#3f3f46" strokeWidth={y === 0 ? 1 : 0.5} />
        ))}
        {[-2, 0, 2].map((x) => (
          <text key={`lx${x}`} x={toSvgX(x)} y={SVG_H - PAD_B + 14} textAnchor="middle" className="text-[9px] fill-zinc-500">{x}</text>
        ))}

        <path d={path} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />

        {data.map((pt, i) => (
          <circle key={`p${i}`} cx={toSvgX(pt.x)} cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, pt.y)))} r={3} fill={color} opacity={0.6} />
        ))}

        <text x={SVG_W / 2} y={PAD_T + 12} textAnchor="middle" className="text-[11px] fill-zinc-300 font-medium">{title}</text>
      </svg>
    );
  }

  function renderBars(w: number[], color: string) {
    return (
      <svg
        viewBox={`0 0 ${BAR_W} ${BAR_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        <line x1={BAR_PAD_L} y1={midY} x2={BAR_W - BAR_PAD_R} y2={midY} stroke="#3f3f46" strokeWidth={0.5} />
        {w.slice(1).map((wv, i) => {
          const cx = BAR_PAD_L + (i + 0.5) * barSpacing;
          const isZero = Math.abs(wv) < 1e-6;
          const h = (wv / maxWeight) * (barAreaH / 2);
          return (
            <g key={`b${i}`}>
              <rect
                x={cx - barWidth / 2}
                y={h < 0 ? midY : midY - h}
                width={barWidth}
                height={Math.max(isZero ? 0 : 1, Math.abs(h))}
                fill={isZero ? "#10b981" : color}
                opacity={isZero ? 0.5 : 0.8}
                rx={2}
              />
              {isZero && (
                <text x={cx} y={midY - 4} textAnchor="middle" className="text-[7px] fill-emerald-400 font-bold">0</text>
              )}
              <text x={cx} y={BAR_H - BAR_PAD_B + 12} textAnchor="middle" className="text-[8px] fill-zinc-500">w{i + 1}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Lambda + stats */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-800/60 rounded-lg py-2 px-4">
        <div className="text-center">
          <span className="text-blue-400 font-medium">L2 (Ridge)</span>
          <span className="text-zinc-500 ml-2">非ゼロ重み: {ridgeNonZero}/{DEGREE}</span>
        </div>
        <div className="text-center">
          <span className="text-orange-400 font-medium">L1 (Lasso)</span>
          <span className="text-zinc-500 ml-2">非ゼロ重み: {lassoNonZero}/{DEGREE}</span>
        </div>
      </div>

      {/* Side-by-side fit plots */}
      <div className="grid grid-cols-2 gap-3">
        {renderPlot(ridgePath, "L2 (Ridge)", "#60a5fa")}
        {renderPlot(lassoPath, "L1 (Lasso)", "#fb923c")}
      </div>

      {/* Side-by-side weight bars */}
      <div className="grid grid-cols-2 gap-3">
        {renderBars(ridgeW, "#60a5fa")}
        {renderBars(lassoW, "#fb923c")}
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">
            <InlineMath math="\lambda" /> （両方に同じ値を適用）
          </label>
          <span className="text-xs font-mono text-amber-400">{lambda.toFixed(2)}</span>
        </div>
        <input
          type="range" min={0} max={2} step={0.01} value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>0</span>
          <span>2</span>
        </div>
      </div>

      {/* Observation prompt */}
      <div className="text-xs text-zinc-500 bg-zinc-800/40 rounded-lg p-3">
        <span className="text-zinc-400 font-medium">注目ポイント：</span> 同じ
        <InlineMath math="\lambda" /> でも、L1（Lasso）は重みが0になるのに対し、L2（Ridge）は全ての重みが小さくなるだけで0にはなりません。
      </div>
    </div>
  );
}
