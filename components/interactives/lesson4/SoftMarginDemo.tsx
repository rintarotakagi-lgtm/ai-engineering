"use client";

import { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

interface Point {
  x: number;
  y: number;
  label: -1 | 1;
}

const VIEWBOX_W = 520;
const VIEWBOX_H = 400;
const PAD_L = 45;
const PAD_R = 20;
const PAD_T = 50;
const PAD_B = 40;
const PLOT_W = VIEWBOX_W - PAD_L - PAD_R;
const PLOT_H = VIEWBOX_H - PAD_T - PAD_B;

const DATA_MIN = -5;
const DATA_MAX = 5;

/** Overlapping data — not perfectly separable */
const DATASET: Point[] = [
  // Class -1 (blue)
  { x: -3.5, y: -2.0, label: -1 },
  { x: -2.5, y: -3.0, label: -1 },
  { x: -2.0, y: -1.0, label: -1 },
  { x: -3.0, y: -0.5, label: -1 },
  { x: -1.5, y: -2.5, label: -1 },
  { x: -4.0, y: -1.5, label: -1 },
  { x: -0.5, y: -0.3, label: -1 },
  // Outliers in wrong region
  { x: 1.0, y: 0.5, label: -1 },
  { x: 0.5, y: 1.5, label: -1 },
  // Class +1 (amber)
  { x: 2.0, y: 1.5, label: 1 },
  { x: 3.0, y: 2.5, label: 1 },
  { x: 1.5, y: 3.0, label: 1 },
  { x: 2.5, y: 0.5, label: 1 },
  { x: 3.5, y: 1.0, label: 1 },
  { x: 1.0, y: 2.0, label: 1 },
  // Outliers
  { x: -1.0, y: -0.5, label: 1 },
  { x: -0.5, y: 1.0, label: 1 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toSvgX(v: number): number {
  return PAD_L + ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_W;
}
function toSvgY(v: number): number {
  return PAD_T + PLOT_H - ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_H;
}

/**
 * Simple SVM-like solver: for the fixed 45-degree boundary (w1=w2=1/sqrt2),
 * find optimal offset b given C. We simulate the soft-margin effect
 * by penalising misclassifications weighted by C.
 */
function solveSimpleSVM(C: number) {
  const w1 = 1 / Math.SQRT2;
  const w2 = 1 / Math.SQRT2;

  // Search over b to minimise: (1/2)||w||^2 + C * sum(xi_i)
  // ||w||=1 so (1/2)||w||^2 = 0.5 (constant for fixed direction)
  // Hinge loss: xi_i = max(0, 1 - y_i * (w.x_i + b))
  let bestB = 0;
  let bestCost = Infinity;

  for (let bTry = -6; bTry <= 6; bTry += 0.05) {
    let hingeLoss = 0;
    for (const pt of DATASET) {
      const functional = pt.label * (w1 * pt.x + w2 * pt.y + bTry);
      hingeLoss += Math.max(0, 1 - functional);
    }
    const cost = 0.5 + C * hingeLoss;
    if (cost < bestCost) {
      bestCost = cost;
      bestB = bTry;
    }
  }

  return { w1, w2, b: bestB };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SoftMarginDemo() {
  const [logC, setLogC] = useState(0); // log10(C)
  const C = Math.pow(10, logC);

  const { w1, w2, b, marginWidth, violations, accuracy } = useMemo(() => {
    const svm = solveSimpleSVM(C);
    const norm = Math.sqrt(svm.w1 ** 2 + svm.w2 ** 2);

    let violationCount = 0;
    let correct = 0;
    for (const pt of DATASET) {
      const functional = pt.label * (svm.w1 * pt.x + svm.w2 * pt.y + svm.b);
      if (functional < 1) violationCount++;
      const pred = svm.w1 * pt.x + svm.w2 * pt.y + svm.b >= 0 ? 1 : -1;
      if (pred === pt.label) correct++;
    }
    const mw = 2 / norm;

    return {
      ...svm,
      marginWidth: mw,
      violations: violationCount,
      accuracy: Math.round((correct / DATASET.length) * 100),
    };
  }, [C]);

  // Clip line to viewport
  const clipLine = (bVal: number) => {
    const pts: { x: number; y: number }[] = [];
    for (const edge of [DATA_MIN, DATA_MAX]) {
      // w1*x + w2*y + bVal = 0
      if (w2 !== 0) {
        const ly = -(w1 * edge + bVal) / w2;
        if (ly >= DATA_MIN && ly <= DATA_MAX) pts.push({ x: edge, y: ly });
      }
      if (w1 !== 0) {
        const lx = -(w2 * edge + bVal) / w1;
        if (lx >= DATA_MIN && lx <= DATA_MAX) pts.push({ x: lx, y: edge });
      }
    }
    const unique = pts.filter(
      (p, i, arr) =>
        arr.findIndex(
          (q) => Math.abs(q.x - p.x) < 0.01 && Math.abs(q.y - p.y) < 0.01,
        ) === i,
    );
    return unique.length >= 2 ? [unique[0], unique[1]] : null;
  };

  const mainLine = clipLine(b);
  const posLine = clipLine(b - 1); // +1 margin
  const negLine = clipLine(b + 1); // -1 margin

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-800">
          Soft Margin SVM — C Parameter
        </h3>
        <p className="text-sm text-zinc-500">
          Adjust C to see how the model balances margin width vs. classification
          errors.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        className="rounded-lg border border-zinc-200 bg-white"
      >
        {/* Grid */}
        {[-4, -2, 0, 2, 4].map((v) => (
          <g key={`grid-${v}`}>
            <line
              x1={toSvgX(v)}
              y1={PAD_T}
              x2={toSvgX(v)}
              y2={PAD_T + PLOT_H}
              stroke="#e4e4e7"
              strokeWidth={v === 0 ? 1 : 0.5}
            />
            <line
              x1={PAD_L}
              y1={toSvgY(v)}
              x2={PAD_L + PLOT_W}
              y2={toSvgY(v)}
              stroke="#e4e4e7"
              strokeWidth={v === 0 ? 1 : 0.5}
            />
            <text
              x={toSvgX(v)}
              y={PAD_T + PLOT_H + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#a1a1aa"
            >
              {v}
            </text>
            <text
              x={PAD_L - 8}
              y={toSvgY(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#a1a1aa"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line
          x1={PAD_L}
          y1={PAD_T + PLOT_H}
          x2={PAD_L + PLOT_W}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1.5}
        />
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1.5}
        />

        {/* Margin band */}
        {posLine && negLine && (
          <polygon
            points={[
              `${toSvgX(posLine[0].x)},${toSvgY(posLine[0].y)}`,
              `${toSvgX(posLine[1].x)},${toSvgY(posLine[1].y)}`,
              `${toSvgX(negLine[1].x)},${toSvgY(negLine[1].y)}`,
              `${toSvgX(negLine[0].x)},${toSvgY(negLine[0].y)}`,
            ].join(" ")}
            fill="rgba(245,158,11,0.08)"
          />
        )}

        {/* Margin lines */}
        {posLine && (
          <line
            x1={toSvgX(posLine[0].x)}
            y1={toSvgY(posLine[0].y)}
            x2={toSvgX(posLine[1].x)}
            y2={toSvgY(posLine[1].y)}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            opacity={0.5}
          />
        )}
        {negLine && (
          <line
            x1={toSvgX(negLine[0].x)}
            y1={toSvgY(negLine[0].y)}
            x2={toSvgX(negLine[1].x)}
            y2={toSvgY(negLine[1].y)}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            opacity={0.5}
          />
        )}

        {/* Decision boundary */}
        {mainLine && (
          <line
            x1={toSvgX(mainLine[0].x)}
            y1={toSvgY(mainLine[0].y)}
            x2={toSvgX(mainLine[1].x)}
            y2={toSvgY(mainLine[1].y)}
            stroke="#f59e0b"
            strokeWidth={2.5}
          />
        )}

        {/* Data points */}
        {DATASET.map((pt, i) => {
          const functional = pt.label * (w1 * pt.x + w2 * pt.y + b);
          const isViolation = functional < 1;
          const isMisclassified = functional < 0;
          const fill = pt.label === -1 ? "#3b82f6" : "#f59e0b";

          return (
            <g key={i}>
              {isViolation && (
                <circle
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r={11}
                  fill="none"
                  stroke={isMisclassified ? "#ef4444" : "#a1a1aa"}
                  strokeWidth={isMisclassified ? 2.5 : 1.5}
                  opacity={0.6}
                />
              )}
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r={6}
                fill={fill}
                stroke="#fff"
                strokeWidth={1.5}
                opacity={0.9}
              />
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${PAD_L + 8}, ${PAD_T + 10})`}>
          <circle cx={0} cy={0} r={5} fill="#3b82f6" />
          <text x={10} y={4} fontSize={10} fill="#71717a">
            Class -1
          </text>
          <circle cx={0} cy={16} r={5} fill="#f59e0b" />
          <text x={10} y={20} fontSize={10} fill="#71717a">
            Class +1
          </text>
          <circle cx={80} cy={0} r={5} fill="none" stroke="#ef4444" strokeWidth={2} />
          <text x={90} y={4} fontSize={10} fill="#71717a">
            Misclassified
          </text>
          <circle cx={80} cy={16} r={5} fill="none" stroke="#a1a1aa" strokeWidth={1.5} />
          <text x={90} y={20} fontSize={10} fill="#71717a">
            In margin
          </text>
        </g>
      </svg>

      {/* Controls */}
      <div className="mt-4">
        <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
          <span className="font-medium">
            C <span className="text-zinc-400 font-normal">(regularisation)</span>
          </span>
          <span className="font-mono text-zinc-800">{C.toFixed(C < 1 ? 2 : 1)}</span>
        </label>
        <input
          type="range"
          min={-2}
          max={2}
          step={0.1}
          value={logC}
          onChange={(e) => setLogC(parseFloat(e.target.value))}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
          <span>0.01 (soft)</span>
          <span>1</span>
          <span>100 (hard)</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span
          className={`rounded px-3 py-1 font-semibold ${
            accuracy === 100
              ? "bg-emerald-100 text-emerald-700"
              : accuracy >= 80
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          Accuracy: {accuracy}%
        </span>
        <span className="rounded bg-zinc-100 px-3 py-1 font-mono text-zinc-700">
          Margin violations: {violations}
        </span>
        <span className="text-zinc-400">
          Margin width: {marginWidth.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
