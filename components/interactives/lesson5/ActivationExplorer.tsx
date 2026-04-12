"use client";

import { useState, useMemo } from "react";

// --- SVG constants ---
const SVG_W = 480;
const SVG_H = 260;
const PAD = 40;

const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = -1.5;
const Y_MAX = 2.5;

function toSx(x: number) {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (SVG_W - 2 * PAD);
}
function toSy(y: number) {
  return SVG_H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (SVG_H - 2 * PAD);
}

// Activation functions
function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}
function sigmoidDeriv(z: number) {
  const s = sigmoid(z);
  return s * (1 - s);
}
function tanhFn(z: number) {
  return Math.tanh(z);
}
function tanhDeriv(z: number) {
  const t = Math.tanh(z);
  return 1 - t * t;
}
function reluFn(z: number) {
  return Math.max(0, z);
}
function reluDeriv(z: number) {
  return z > 0 ? 1 : 0;
}

type FuncName = "sigmoid" | "tanh" | "relu";

const FUNCTIONS: {
  name: FuncName;
  label: string;
  fn: (z: number) => number;
  deriv: (z: number) => number;
  color: string;
  derivColor: string;
  range: string;
}[] = [
  {
    name: "sigmoid",
    label: "Sigmoid",
    fn: sigmoid,
    deriv: sigmoidDeriv,
    color: "#f59e0b",
    derivColor: "#fbbf24",
    range: "(0, 1)",
  },
  {
    name: "tanh",
    label: "Tanh",
    fn: tanhFn,
    deriv: tanhDeriv,
    color: "#06b6d4",
    derivColor: "#67e8f9",
    range: "(-1, 1)",
  },
  {
    name: "relu",
    label: "ReLU",
    fn: reluFn,
    deriv: reluDeriv,
    color: "#22c55e",
    derivColor: "#86efac",
    range: "[0, +inf)",
  },
];

const NUM_POINTS = 200;

function buildPath(fn: (z: number) => number): string {
  const parts: string[] = [];
  for (let i = 0; i <= NUM_POINTS; i++) {
    const x = X_MIN + (i / NUM_POINTS) * (X_MAX - X_MIN);
    const y = fn(x);
    const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, y));
    parts.push(
      `${i === 0 ? "M" : "L"}${toSx(x).toFixed(1)},${toSy(clampedY).toFixed(1)}`
    );
  }
  return parts.join(" ");
}

export default function ActivationExplorer() {
  const [selected, setSelected] = useState<Set<FuncName>>(
    new Set(["sigmoid", "tanh", "relu"])
  );
  const [showDerivative, setShowDerivative] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);

  const toggle = (name: FuncName) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        if (next.size > 1) next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const paths = useMemo(() => {
    return FUNCTIONS.filter((f) => selected.has(f.name)).map((f) => ({
      ...f,
      mainPath: buildPath(f.fn),
      derivPath: buildPath(f.deriv),
    }));
  }, [selected]);

  // Grid
  const xTicks = [-4, -2, 0, 2, 4];
  const yTicks = [-1, 0, 1, 2];

  // Mouse handler for hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const svgX = (relX / rect.width) * SVG_W;
    const dataX = X_MIN + ((svgX - PAD) / (SVG_W - 2 * PAD)) * (X_MAX - X_MIN);
    if (dataX >= X_MIN && dataX <= X_MAX) {
      setHoverX(dataX);
    } else {
      setHoverX(null);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Function toggles */}
      <div className="flex gap-2 justify-center flex-wrap">
        {FUNCTIONS.map((f) => (
          <button
            key={f.name}
            onClick={() => toggle(f.name)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              selected.has(f.name)
                ? "border-current bg-opacity-20"
                : "bg-zinc-800 border-zinc-700 text-zinc-500"
            }`}
            style={
              selected.has(f.name)
                ? { color: f.color, borderColor: f.color, backgroundColor: f.color + "20" }
                : {}
            }
          >
            {f.label}
          </button>
        ))}
        <button
          onClick={() => setShowDerivative(!showDerivative)}
          className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
            showDerivative
              ? "bg-zinc-700/50 border-zinc-500 text-zinc-300"
              : "bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {showDerivative ? "導関数 ON" : "導関数 OFF"}
        </button>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverX(null)}
      >
        {/* Grid */}
        {xTicks.map((x) => (
          <line key={`gx-${x}`} x1={toSx(x)} y1={toSy(Y_MIN)} x2={toSx(x)} y2={toSy(Y_MAX)} stroke="#3f3f46" strokeWidth={x === 0 ? 1.2 : 0.5} />
        ))}
        {yTicks.map((y) => (
          <line key={`gy-${y}`} x1={toSx(X_MIN)} y1={toSy(y)} x2={toSx(X_MAX)} y2={toSy(y)} stroke="#3f3f46" strokeWidth={y === 0 ? 1.2 : 0.5} />
        ))}

        {/* Tick labels */}
        {xTicks.map((x) => (
          <text key={`lx-${x}`} x={toSx(x)} y={SVG_H - PAD + 14} textAnchor="middle" className="text-[10px] fill-zinc-500">
            {x}
          </text>
        ))}
        {yTicks.map((y) => (
          <text key={`ly-${y}`} x={PAD - 6} y={toSy(y) + 3} textAnchor="end" className="text-[10px] fill-zinc-500">
            {y}
          </text>
        ))}

        {/* Function curves */}
        {paths.map((p) => (
          <g key={p.name}>
            <path d={p.mainPath} fill="none" stroke={p.color} strokeWidth={2.5} strokeLinecap="round" />
            {showDerivative && (
              <path
                d={p.derivPath}
                fill="none"
                stroke={p.derivColor}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                opacity={0.7}
              />
            )}
          </g>
        ))}

        {/* Hover line and values */}
        {hoverX !== null && (
          <>
            <line
              x1={toSx(hoverX)}
              y1={toSy(Y_MIN)}
              x2={toSx(hoverX)}
              y2={toSy(Y_MAX)}
              stroke="#71717a"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
            {paths.map((p) => {
              const y = p.fn(hoverX);
              const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, y));
              return (
                <circle
                  key={`dot-${p.name}`}
                  cx={toSx(hoverX)}
                  cy={toSy(clampedY)}
                  r={4}
                  fill={p.color}
                  stroke="#fff"
                  strokeWidth={1}
                />
              );
            })}
          </>
        )}
      </svg>

      {/* Hover values */}
      {hoverX !== null && (
        <div className="flex justify-center gap-4 text-[11px]">
          <span className="text-zinc-500">z = {hoverX.toFixed(2)}</span>
          {paths.map((p) => (
            <span key={p.name} style={{ color: p.color }}>
              {p.label}: {p.fn(hoverX).toFixed(3)}
              {showDerivative && (
                <span className="text-zinc-500 ml-1">
                  (d: {p.deriv(hoverX).toFixed(3)})
                </span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-2">
        {FUNCTIONS.filter((f) => selected.has(f.name)).map((f) => (
          <div
            key={f.name}
            className="bg-zinc-800/60 rounded-lg p-2 text-center border"
            style={{ borderColor: f.color + "40" }}
          >
            <div className="text-xs font-medium" style={{ color: f.color }}>
              {f.label}
            </div>
            <div className="text-[10px] text-zinc-500">
              出力: {f.range}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
