"use client";

import { useState, useMemo } from "react";

// --- SVG constants ---
const SVG_W = 520;
const SVG_H = 300;
const PAD_L = 48;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 36;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

// --- Seeded RNG ---
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// True function: sin(x)
function trueFunc(x: number): number {
  return Math.sin(x);
}

function generateData(n: number, seed: number) {
  const rng = seededRandom(seed);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = -3 + 6 * rng();
    pts.push({ x, y: trueFunc(x) + (rng() - 0.5) * 0.8 });
  }
  return pts.sort((a, b) => a.x - b.x);
}

const trainData = generateData(18, 77);
const testData = generateData(30, 200);

// --- Polynomial fitting (with optional regularization) ---
function fitPoly(
  data: { x: number; y: number }[],
  degree: number
): number[] {
  const p = degree + 1;
  const XtX: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  const Xty: number[] = Array(p).fill(0);

  for (const pt of data) {
    const f: number[] = [];
    for (let d = 0; d <= degree; d++) f.push(Math.pow(pt.x, d));
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) XtX[i][j] += f[i] * f[j];
      Xty[i] += f[i] * pt.y;
    }
  }

  // Small ridge for numerical stability
  for (let i = 0; i < p; i++) XtX[i][i] += 1e-8;

  // Gaussian elimination
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

function evalPoly(x: number, w: number[]): number {
  let y = 0;
  for (let i = 0; i < w.length; i++) y += w[i] * Math.pow(x, i);
  return y;
}

function mse(data: { x: number; y: number }[], w: number[]): number {
  let sum = 0;
  for (const pt of data) {
    const d = pt.y - evalPoly(pt.x, w);
    sum += d * d;
  }
  return sum / data.length;
}

// --- Coordinate helpers ---
const X_MIN = -3.5;
const X_MAX = 3.5;
const Y_MIN = -2.5;
const Y_MAX = 2.5;

function toSvgX(x: number): number {
  return PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}
function toSvgY(y: number): number {
  return PAD_T + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;
}

export default function OverfittingDemo() {
  const [complexity, setComplexity] = useState(3);

  const { weights, trainErr, testErr } = useMemo(() => {
    const w = fitPoly(trainData, complexity);
    return { weights: w, trainErr: mse(trainData, w), testErr: mse(testData, w) };
  }, [complexity]);

  // Fitted curve
  const fittedPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
      const y = Math.max(Y_MIN, Math.min(Y_MAX, evalPoly(x, weights)));
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [weights]);

  // True function
  const truePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
      const y = trueFunc(x);
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(y).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  // Gap indicator
  const gap = testErr - trainErr;
  const gapLabel =
    gap < 0.1
      ? "良好 — 汎化できている"
      : gap < 0.5
      ? "注意 — やや過学習気味"
      : "危険 — 過学習している";
  const gapColor =
    gap < 0.1
      ? "text-emerald-400"
      : gap < 0.5
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-zinc-800/60 rounded-lg py-2 px-3">
        <div>
          <span className="text-zinc-500">訓練誤差</span>
          <div className="font-mono text-amber-400">{trainErr.toFixed(4)}</div>
        </div>
        <div>
          <span className="text-zinc-500">テスト誤差</span>
          <div className="font-mono text-cyan-400">{testErr.toFixed(4)}</div>
        </div>
        <div>
          <span className="text-zinc-500">汎化ギャップ</span>
          <div className={`font-mono ${gapColor}`}>{gap.toFixed(4)}</div>
        </div>
      </div>

      <div className={`text-center text-xs font-medium ${gapColor}`}>
        {gapLabel}
      </div>

      {/* Main plot */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <line key={`gx${x}`} x1={toSvgX(x)} y1={toSvgY(Y_MIN)} x2={toSvgX(x)} y2={toSvgY(Y_MAX)} stroke="#3f3f46" strokeWidth={x === 0 ? 1 : 0.5} />
        ))}
        {[-2, -1, 0, 1, 2].map((y) => (
          <line key={`gy${y}`} x1={toSvgX(X_MIN)} y1={toSvgY(y)} x2={toSvgX(X_MAX)} y2={toSvgY(y)} stroke="#3f3f46" strokeWidth={y === 0 ? 1 : 0.5} />
        ))}
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <text key={`lx${x}`} x={toSvgX(x)} y={SVG_H - PAD_B + 16} textAnchor="middle" className="text-[10px] fill-zinc-500">{x}</text>
        ))}
        {[-2, -1, 0, 1, 2].map((y) => (
          <text key={`ly${y}`} x={PAD_L - 6} y={toSvgY(y) + 3} textAnchor="end" className="text-[10px] fill-zinc-500">{y}</text>
        ))}

        {/* True function */}
        <path d={truePath} fill="none" stroke="#6ee7b7" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.5} />

        {/* Fitted curve */}
        <path d={fittedPath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />

        {/* Train points */}
        {trainData.map((pt, i) => (
          <circle key={`tr${i}`} cx={toSvgX(pt.x)} cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, pt.y)))} r={4.5} fill="#f59e0b" stroke="#fbbf24" strokeWidth={1} opacity={0.9} />
        ))}

        {/* Test points (smaller, faded) */}
        {testData.map((pt, i) => (
          <circle key={`te${i}`} cx={toSvgX(pt.x)} cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, pt.y)))} r={3} fill="#22d3ee" stroke="#67e8f9" strokeWidth={0.8} opacity={0.4} />
        ))}

        {/* Legend */}
        <circle cx={PAD_L + 10} cy={PAD_T + 10} r={4} fill="#f59e0b" />
        <text x={PAD_L + 20} y={PAD_T + 14} className="text-[10px] fill-zinc-400">訓練</text>
        <circle cx={PAD_L + 60} cy={PAD_T + 10} r={3} fill="#22d3ee" opacity={0.5} />
        <text x={PAD_L + 70} y={PAD_T + 14} className="text-[10px] fill-zinc-400">テスト</text>
        <line x1={PAD_L + 110} y1={PAD_T + 10} x2={PAD_L + 130} y2={PAD_T + 10} stroke="#6ee7b7" strokeDasharray="4 3" strokeWidth={1.5} />
        <text x={PAD_L + 136} y={PAD_T + 14} className="text-[10px] fill-zinc-400">sin(x)</text>
      </svg>

      {/* Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">モデルの複雑さ（多項式の次数）</label>
          <span className="text-xs font-mono text-amber-400">{complexity}</span>
        </div>
        <input
          type="range" min={1} max={10} step={1} value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>1（未学習）</span>
          <span>10（過学習）</span>
        </div>
      </div>
    </div>
  );
}
