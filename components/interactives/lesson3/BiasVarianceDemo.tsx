"use client";

import { useState, useMemo, useCallback } from "react";

// --- SVG constants ---
const SVG_W = 520;
const SVG_H = 300;
const PAD_L = 48;
const PAD_R = 20;
const PAD_T = 20;
const PAD_B = 36;

const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

// --- Data generation ---
const SEED = 42;
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function trueFunction(x: number): number {
  return Math.sin(1.5 * x) + 0.3 * x;
}

function generateData(n: number, seed: number) {
  const rng = seededRandom(seed);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const x = -3 + 6 * (i / (n - 1)) + (rng() - 0.5) * 0.3;
    const noise = (rng() - 0.5) * 1.2;
    points.push({ x, y: trueFunction(x) + noise });
  }
  return points;
}

const trainData = generateData(20, SEED);
const testData = generateData(15, SEED + 100);

// --- Polynomial fitting ---
function polyFeatures(x: number, degree: number): number[] {
  const f: number[] = [];
  for (let d = 0; d <= degree; d++) f.push(Math.pow(x, d));
  return f;
}

function fitPolynomial(
  data: { x: number; y: number }[],
  degree: number,
  lambda: number = 0
): number[] {
  const n = data.length;
  const p = degree + 1;
  // Build X^T X + lambda I and X^T y using normal equations
  const XtX: number[][] = Array.from({ length: p }, () =>
    Array(p).fill(0)
  );
  const Xty: number[] = Array(p).fill(0);

  for (const pt of data) {
    const f = polyFeatures(pt.x, degree);
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) {
        XtX[i][j] += f[i] * f[j];
      }
      Xty[i] += f[i] * pt.y;
    }
  }

  // Regularization (skip bias term index 0)
  for (let i = 1; i < p; i++) {
    XtX[i][i] += lambda * n;
  }

  // Solve via Gaussian elimination
  const aug: number[][] = XtX.map((row, i) => [...row, Xty[i]]);
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
      const factor = aug[row][col];
      for (let j = col; j <= p; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  return aug.map((row) => row[p]);
}

function predict(x: number, weights: number[]): number {
  let y = 0;
  for (let i = 0; i < weights.length; i++) y += weights[i] * Math.pow(x, i);
  return y;
}

function mse(data: { x: number; y: number }[], weights: number[]): number {
  let sum = 0;
  for (const pt of data) {
    const diff = pt.y - predict(pt.x, weights);
    sum += diff * diff;
  }
  return sum / data.length;
}

// --- Coordinate helpers ---
const X_MIN = -3.5;
const X_MAX = 3.5;
const Y_MIN = -3;
const Y_MAX = 4;

function toSvgX(x: number): number {
  return PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
}
function toSvgY(y: number): number {
  return PAD_T + ((Y_MAX - y) / (Y_MAX - Y_MIN)) * PLOT_H;
}

// --- Error plot constants ---
const ERR_SVG_W = 520;
const ERR_SVG_H = 180;
const ERR_PAD_L = 48;
const ERR_PAD_R = 20;
const ERR_PAD_T = 20;
const ERR_PAD_B = 36;
const ERR_PLOT_W = ERR_SVG_W - ERR_PAD_L - ERR_PAD_R;
const ERR_PLOT_H = ERR_SVG_H - ERR_PAD_T - ERR_PAD_B;

export default function BiasVarianceDemo() {
  const [degree, setDegree] = useState(3);

  const { weights, trainErr, testErr, allErrors } = useMemo(() => {
    const w = fitPolynomial(trainData, degree);
    const trnE = mse(trainData, w);
    const tstE = mse(testData, w);
    // Compute errors for all degrees for the error curve
    const errs = [];
    for (let d = 1; d <= 10; d++) {
      const ww = fitPolynomial(trainData, d);
      errs.push({ degree: d, train: mse(trainData, ww), test: mse(testData, ww) });
    }
    return { weights: w, trainErr: trnE, testErr: tstE, allErrors: errs };
  }, [degree]);

  // Build curve path
  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
      const y = predict(x, weights);
      const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, y));
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(clampedY).toFixed(1)}`);
    }
    return pts.join(" ");
  }, [weights]);

  // True function path
  const truePath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 200; i++) {
      const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
      const y = trueFunction(x);
      const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, y));
      pts.push(`${i === 0 ? "M" : "L"}${toSvgX(x).toFixed(1)},${toSvgY(clampedY).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  // Label
  const label =
    degree <= 2
      ? "Underfitting（未学習）"
      : degree <= 5
      ? "Just right（適切）"
      : "Overfitting（過学習）";
  const labelColor =
    degree <= 2
      ? "text-blue-400"
      : degree <= 5
      ? "text-emerald-400"
      : "text-red-400";

  // Error plot scaling
  const maxErr = Math.min(
    8,
    Math.max(...allErrors.map((e) => Math.max(e.train, e.test)))
  );

  function errToSvgX(d: number): number {
    return ERR_PAD_L + ((d - 1) / 9) * ERR_PLOT_W;
  }
  function errToSvgY(e: number): number {
    return ERR_PAD_T + ((maxErr - Math.min(e, maxErr)) / maxErr) * ERR_PLOT_H;
  }

  const trainErrPath = allErrors
    .map(
      (e, i) =>
        `${i === 0 ? "M" : "L"}${errToSvgX(e.degree).toFixed(1)},${errToSvgY(e.train).toFixed(1)}`
    )
    .join(" ");
  const testErrPath = allErrors
    .map(
      (e, i) =>
        `${i === 0 ? "M" : "L"}${errToSvgX(e.degree).toFixed(1)},${errToSvgY(e.test).toFixed(1)}`
    )
    .join(" ");

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Status */}
      <div className="flex items-center justify-between text-sm bg-zinc-800/60 rounded-lg py-2 px-4">
        <span className={`font-medium ${labelColor}`}>{label}</span>
        <div className="flex gap-4 text-xs font-mono">
          <span className="text-amber-400">
            訓練誤差: {trainErr.toFixed(3)}
          </span>
          <span className="text-cyan-400">
            テスト誤差: {testErr.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Main plot */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <line
            key={`gx${x}`}
            x1={toSvgX(x)} y1={toSvgY(Y_MIN)} x2={toSvgX(x)} y2={toSvgY(Y_MAX)}
            stroke="#3f3f46" strokeWidth={x === 0 ? 1 : 0.5}
          />
        ))}
        {[-2, 0, 2, 4].map((y) => (
          <line
            key={`gy${y}`}
            x1={toSvgX(X_MIN)} y1={toSvgY(y)} x2={toSvgX(X_MAX)} y2={toSvgY(y)}
            stroke="#3f3f46" strokeWidth={y === 0 ? 1 : 0.5}
          />
        ))}

        {/* Axis labels */}
        {[-3, -2, -1, 0, 1, 2, 3].map((x) => (
          <text key={`lx${x}`} x={toSvgX(x)} y={SVG_H - PAD_B + 16} textAnchor="middle" className="text-[10px] fill-zinc-500">{x}</text>
        ))}
        {[-2, 0, 2, 4].map((y) => (
          <text key={`ly${y}`} x={PAD_L - 6} y={toSvgY(y) + 3} textAnchor="end" className="text-[10px] fill-zinc-500">{y}</text>
        ))}

        {/* True function */}
        <path d={truePath} fill="none" stroke="#6ee7b7" strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6} />

        {/* Fitted curve */}
        <path d={curvePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} strokeLinecap="round" />

        {/* Train points */}
        {trainData.map((pt, i) => (
          <circle
            key={`tr${i}`}
            cx={toSvgX(pt.x)}
            cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, pt.y)))}
            r={4} fill="#f59e0b" stroke="#fbbf24" strokeWidth={1} opacity={0.8}
          />
        ))}

        {/* Test points */}
        {testData.map((pt, i) => (
          <circle
            key={`te${i}`}
            cx={toSvgX(pt.x)}
            cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, pt.y)))}
            r={3.5} fill="#22d3ee" stroke="#67e8f9" strokeWidth={1} opacity={0.6}
          />
        ))}

        {/* Legend */}
        <circle cx={PAD_L + 10} cy={PAD_T + 10} r={4} fill="#f59e0b" />
        <text x={PAD_L + 20} y={PAD_T + 14} className="text-[10px] fill-zinc-400">訓練データ</text>
        <circle cx={PAD_L + 90} cy={PAD_T + 10} r={3.5} fill="#22d3ee" />
        <text x={PAD_L + 100} y={PAD_T + 14} className="text-[10px] fill-zinc-400">テストデータ</text>
        <line x1={PAD_L + 170} y1={PAD_T + 10} x2={PAD_L + 190} y2={PAD_T + 10} stroke="#6ee7b7" strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={PAD_L + 196} y={PAD_T + 14} className="text-[10px] fill-zinc-400">真の関数</text>
      </svg>

      {/* Error curves */}
      <svg
        viewBox={`0 0 ${ERR_SVG_W} ${ERR_SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
          <line key={`egd${d}`} x1={errToSvgX(d)} y1={errToSvgY(0)} x2={errToSvgX(d)} y2={errToSvgY(maxErr)} stroke="#3f3f46" strokeWidth={0.5} />
        ))}
        {/* Axis labels */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
          <text key={`eld${d}`} x={errToSvgX(d)} y={ERR_SVG_H - ERR_PAD_B + 16} textAnchor="middle" className="text-[10px] fill-zinc-500">{d}</text>
        ))}
        <text x={ERR_SVG_W / 2} y={ERR_SVG_H - 4} textAnchor="middle" className="text-[10px] fill-zinc-400">多項式の次数</text>
        <text x={12} y={ERR_SVG_H / 2} textAnchor="middle" transform={`rotate(-90, 12, ${ERR_SVG_H / 2})`} className="text-[10px] fill-zinc-400">MSE</text>

        {/* Train error curve */}
        <path d={trainErrPath} fill="none" stroke="#f59e0b" strokeWidth={2} />
        {/* Test error curve */}
        <path d={testErrPath} fill="none" stroke="#22d3ee" strokeWidth={2} />

        {/* Current degree marker */}
        <line
          x1={errToSvgX(degree)} y1={errToSvgY(0)} x2={errToSvgX(degree)} y2={errToSvgY(maxErr)}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 3" opacity={0.5}
        />

        {/* Legend */}
        <line x1={ERR_PAD_L + 10} y1={ERR_PAD_T + 8} x2={ERR_PAD_L + 30} y2={ERR_PAD_T + 8} stroke="#f59e0b" strokeWidth={2} />
        <text x={ERR_PAD_L + 36} y={ERR_PAD_T + 12} className="text-[10px] fill-zinc-400">訓練誤差</text>
        <line x1={ERR_PAD_L + 100} y1={ERR_PAD_T + 8} x2={ERR_PAD_L + 120} y2={ERR_PAD_T + 8} stroke="#22d3ee" strokeWidth={2} />
        <text x={ERR_PAD_L + 126} y={ERR_PAD_T + 12} className="text-[10px] fill-zinc-400">テスト誤差</text>
      </svg>

      {/* Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-zinc-400">
            多項式の次数
          </label>
          <span className="text-xs font-mono text-amber-400">{degree}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={degree}
          onChange={(e) => setDegree(Number(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>1（単純）</span>
          <span>10（複雑）</span>
        </div>
      </div>
    </div>
  );
}
