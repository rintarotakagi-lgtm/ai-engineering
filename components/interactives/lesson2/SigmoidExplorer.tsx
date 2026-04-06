"use client";

import { useState, useMemo } from "react";

// --- Coordinate system constants ---
const SVG_W = 480;
const SVG_H = 300;
const PAD = 40;

// Data ranges
const X_MIN = -6;
const X_MAX = 6;
const Y_MIN = 0;
const Y_MAX = 1;

// --- Helpers ---
function toSvgX(x: number): number {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PAD);
}

function toSvgY(y: number): number {
  return SVG_H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SVG_H - 2 * PAD);
}

function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

// Number of sample points for the curve
const NUM_POINTS = 200;

// --- Component ---
export default function SigmoidExplorer() {
  const [w, setW] = useState(1);
  const [b, setB] = useState(0);

  // Build the SVG path for σ(wx + b)
  const curvePath = useMemo(() => {
    const step = (X_MAX - X_MIN) / NUM_POINTS;
    const parts: string[] = [];
    for (let i = 0; i <= NUM_POINTS; i++) {
      const x = X_MIN + i * step;
      const y = sigmoid(w * x + b);
      const sx = toSvgX(x);
      const sy = toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, y)));
      parts.push(`${i === 0 ? "M" : "L"}${sx.toFixed(2)},${sy.toFixed(2)}`);
    }
    return parts.join(" ");
  }, [w, b]);

  // Decision boundary: σ = 0.5 when wx + b = 0, i.e. x = -b/w
  const boundaryX = w !== 0 ? -b / w : null;
  const boundaryVisible =
    boundaryX !== null && boundaryX >= X_MIN && boundaryX <= X_MAX;

  // Grid lines
  const xTicks = [-6, -4, -2, 0, 2, 4, 6];
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Equation display */}
      <div className="text-center text-sm font-mono text-zinc-300 bg-zinc-800/60 rounded-lg py-2 px-4">
        σ({w >= 0 ? "" : "("}{w}{w >= 0 ? "" : ")"}x{" "}
        {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(1)}) ={" "}
        <span className="text-zinc-500">
          1 / (1 + e
          <sup>
            −({w.toFixed(1)}x {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(1)})
          </sup>
          )
        </span>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {xTicks.map((x) => (
          <line
            key={`gx-${x}`}
            x1={toSvgX(x)}
            y1={toSvgY(Y_MIN)}
            x2={toSvgX(x)}
            y2={toSvgY(Y_MAX)}
            stroke="#3f3f46"
            strokeWidth={x === 0 ? 1.2 : 0.5}
          />
        ))}
        {yTicks.map((y) => (
          <line
            key={`gy-${y}`}
            x1={toSvgX(X_MIN)}
            y1={toSvgY(y)}
            x2={toSvgX(X_MAX)}
            y2={toSvgY(y)}
            stroke="#3f3f46"
            strokeWidth={y === 0 ? 1.2 : 0.5}
          />
        ))}

        {/* Axis labels */}
        {xTicks.map((x) => (
          <text
            key={`lx-${x}`}
            x={toSvgX(x)}
            y={SVG_H - PAD + 16}
            textAnchor="middle"
            className="text-[10px] fill-zinc-500"
          >
            {x}
          </text>
        ))}
        {yTicks.map((y) => (
          <text
            key={`ly-${y}`}
            x={PAD - 6}
            y={toSvgY(y) + 3}
            textAnchor="end"
            className="text-[10px] fill-zinc-500"
          >
            {y.toFixed(2)}
          </text>
        ))}

        {/* Axis labels: x and σ(z) */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 4}
          textAnchor="middle"
          className="text-[11px] fill-zinc-400 font-medium"
        >
          x
        </text>
        <text
          x={12}
          y={SVG_H / 2}
          textAnchor="middle"
          transform={`rotate(-90, 12, ${SVG_H / 2})`}
          className="text-[11px] fill-zinc-400 font-medium"
        >
          σ(z)
        </text>

        {/* Dashed line at y = 0.5 */}
        <line
          x1={toSvgX(X_MIN)}
          y1={toSvgY(0.5)}
          x2={toSvgX(X_MAX)}
          y2={toSvgY(0.5)}
          stroke="#71717a"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        <text
          x={toSvgX(X_MAX) + 4}
          y={toSvgY(0.5) + 3}
          className="text-[9px] fill-zinc-500"
        >
          0.5
        </text>

        {/* Sigmoid curve */}
        <path
          d={curvePath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Decision boundary marker */}
        {boundaryVisible && boundaryX !== null && (
          <>
            {/* Vertical dashed line at decision boundary */}
            <line
              x1={toSvgX(boundaryX)}
              y1={toSvgY(Y_MIN)}
              x2={toSvgX(boundaryX)}
              y2={toSvgY(0.5)}
              stroke="#f59e0b"
              strokeWidth={1}
              strokeDasharray="4 3"
              opacity={0.5}
            />
            {/* Dot at (boundaryX, 0.5) */}
            <circle
              cx={toSvgX(boundaryX)}
              cy={toSvgY(0.5)}
              r={5}
              fill="#f59e0b"
              stroke="#fbbf24"
              strokeWidth={1.5}
            />
            {/* Label */}
            <text
              x={toSvgX(boundaryX)}
              y={toSvgY(0.5) - 10}
              textAnchor="middle"
              className="text-[9px] fill-amber-400 font-medium"
            >
              x={boundaryX.toFixed(1)}
            </text>
          </>
        )}

        {/* w = 0 edge case: show horizontal line at σ(b) */}
        {w === 0 && (
          <text
            x={SVG_W / 2}
            y={toSvgY(sigmoid(b)) - 10}
            textAnchor="middle"
            className="text-[9px] fill-zinc-400"
          >
            σ(b) = {sigmoid(b).toFixed(2)}
          </text>
        )}
      </svg>

      {/* Sliders */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">
              w (weight)
            </label>
            <span className="text-xs font-mono text-amber-400">
              {w.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <p className="text-[10px] text-zinc-500">
            Steepness — larger |w| = sharper transition
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">
              b (bias)
            </label>
            <span className="text-xs font-mono text-amber-400">
              {b.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <p className="text-[10px] text-zinc-500">
            Horizontal shift — boundary at x = −b/w
          </p>
        </div>
      </div>
    </div>
  );
}
