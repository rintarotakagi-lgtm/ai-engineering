"use client";

import { useState, useMemo } from "react";

const SVG_W = 480;
const SVG_H = 340;
const PAD = 50;

const D_MIN = -0.5;
const D_MAX = 1.5;

function toSx(v: number) {
  return PAD + ((v - D_MIN) / (D_MAX - D_MIN)) * (SVG_W - 2 * PAD);
}
function toSy(v: number) {
  return SVG_H - PAD - ((v - D_MIN) / (D_MAX - D_MIN)) * (SVG_H - 2 * PAD);
}

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

// XOR truth table
const XOR_DATA: [number, number, number][] = [
  [0, 0, 0],
  [0, 1, 1],
  [1, 0, 1],
  [1, 1, 0],
];

type Mode = "single" | "twolayer";

// Fixed 2-layer weights that solve XOR
// Hidden neuron 1: detects (x1 OR x2) — fires when at least one is 1
// Hidden neuron 2: detects (x1 AND x2) — fires when both are 1
// Output: h1 AND NOT h2
const TWO_LAYER = {
  // Hidden layer (2 neurons)
  w11: 20,
  w12: 20,
  b1: -10, // neuron 1: OR-like
  w21: 20,
  w22: 20,
  b2: -30, // neuron 2: AND-like
  // Output layer
  wo1: 20,
  wo2: -20,
  bo: -10,
};

export default function XORDemo() {
  const [mode, setMode] = useState<Mode>("single");
  const [w1, setW1] = useState(1.0);
  const [w2, setW2] = useState(1.0);
  const [b, setB] = useState(-0.5);

  // Compute decision region heatmap
  const heatmap = useMemo(() => {
    const res = 40;
    const cells: { x: number; y: number; w: number; h: number; v: number }[] = [];
    const cellW = (D_MAX - D_MIN) / res;
    const cellH = (D_MAX - D_MIN) / res;

    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const x1 = D_MIN + (i + 0.5) * cellW;
        const x2 = D_MIN + (j + 0.5) * cellH;

        let v: number;
        if (mode === "single") {
          v = sigmoid(w1 * x1 + w2 * x2 + b);
        } else {
          const h1 = sigmoid(TWO_LAYER.w11 * x1 + TWO_LAYER.w12 * x2 + TWO_LAYER.b1);
          const h2 = sigmoid(TWO_LAYER.w21 * x1 + TWO_LAYER.w22 * x2 + TWO_LAYER.b2);
          v = sigmoid(TWO_LAYER.wo1 * h1 + TWO_LAYER.wo2 * h2 + TWO_LAYER.bo);
        }

        cells.push({
          x: toSx(D_MIN + i * cellW),
          y: toSy(D_MIN + (j + 1) * cellH),
          w: (SVG_W - 2 * PAD) / res + 1,
          h: (SVG_H - 2 * PAD) / res + 1,
          v,
        });
      }
    }
    return cells;
  }, [mode, w1, w2, b]);

  // Compute outputs for each XOR point
  const outputs = useMemo(() => {
    return XOR_DATA.map(([x1, x2]) => {
      if (mode === "single") {
        return sigmoid(w1 * x1 + w2 * x2 + b) >= 0.5 ? 1 : 0;
      } else {
        const h1 = sigmoid(TWO_LAYER.w11 * x1 + TWO_LAYER.w12 * x2 + TWO_LAYER.b1);
        const h2 = sigmoid(TWO_LAYER.w21 * x1 + TWO_LAYER.w22 * x2 + TWO_LAYER.b2);
        return sigmoid(TWO_LAYER.wo1 * h1 + TWO_LAYER.wo2 * h2 + TWO_LAYER.bo) >= 0.5 ? 1 : 0;
      }
    });
  }, [mode, w1, w2, b]);

  const allCorrect = outputs.every((o, i) => o === XOR_DATA[i][2]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2 justify-center">
        {(["single", "twolayer"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              mode === m
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {m === "single" ? "1層（パーセプトロン）" : "2層ネットワーク"}
          </button>
        ))}
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Heatmap */}
        {heatmap.map((c, i) => (
          <rect
            key={i}
            x={c.x}
            y={c.y}
            width={c.w}
            height={c.h}
            fill={c.v >= 0.5 ? "#f59e0b" : "#3f3f46"}
            opacity={0.12 + Math.abs(c.v - 0.5) * 0.3}
          />
        ))}

        {/* Grid lines */}
        {[0, 1].map((v) => (
          <g key={`g-${v}`}>
            <line x1={toSx(v)} y1={toSy(D_MIN)} x2={toSx(v)} y2={toSy(D_MAX)} stroke="#52525b" strokeWidth={0.5} strokeDasharray="4 3" />
            <line x1={toSx(D_MIN)} y1={toSy(v)} x2={toSx(D_MAX)} y2={toSy(v)} stroke="#52525b" strokeWidth={0.5} strokeDasharray="4 3" />
          </g>
        ))}

        {/* Decision boundary for single layer */}
        {mode === "single" && Math.abs(w2) > 0.01 && (() => {
          const x1a = D_MIN;
          const x2a = (-w1 * x1a - b) / w2;
          const x1b = D_MAX;
          const x2b = (-w1 * x1b - b) / w2;
          return (
            <line
              x1={toSx(x1a)}
              y1={toSy(x2a)}
              x2={toSx(x1b)}
              y2={toSy(x2b)}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          );
        })()}

        {/* Data points */}
        {XOR_DATA.map(([x1, x2, label], i) => (
          <g key={`pt-${i}`}>
            <circle
              cx={toSx(x1)}
              cy={toSy(x2)}
              r={16}
              fill={label === 1 ? "#f59e0b" : "#27272a"}
              stroke={label === 1 ? "#fbbf24" : "#71717a"}
              strokeWidth={2.5}
            />
            <text
              x={toSx(x1)}
              y={toSy(x2) + 4}
              textAnchor="middle"
              className="text-[12px] fill-white font-bold"
            >
              {label}
            </text>
            {/* Show if prediction matches */}
            {outputs[i] !== label && (
              <text
                x={toSx(x1) + 18}
                y={toSy(x2) - 12}
                className="text-[10px] fill-red-400 font-bold"
              >
                NG
              </text>
            )}
          </g>
        ))}

        {/* Labels */}
        <text x={SVG_W / 2} y={SVG_H - 8} textAnchor="middle" className="text-[11px] fill-zinc-400">
          x₁
        </text>
        <text x={14} y={SVG_H / 2} textAnchor="middle" transform={`rotate(-90, 14, ${SVG_H / 2})`} className="text-[11px] fill-zinc-400">
          x₂
        </text>
      </svg>

      {/* Status */}
      <div
        className={`text-center text-xs font-medium py-2 rounded-lg ${
          allCorrect
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
            : "bg-red-500/10 text-red-400 border border-red-500/30"
        }`}
      >
        {allCorrect
          ? "XOR を正しく分類できています!"
          : mode === "single"
          ? "1本の直線では XOR を分離できません。2層に切り替えてみましょう。"
          : "分類に失敗しています。"}
      </div>

      {/* Sliders for single mode */}
      {mode === "single" && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "w₁", value: w1, set: setW1 },
            { label: "w₂", value: w2, set: setW2 },
            { label: "b", value: b, set: setB },
          ].map(({ label, value, set }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400">{label}</label>
                <span className="text-xs font-mono text-amber-400">{value.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={-3}
                max={3}
                step={0.1}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Network diagram for 2-layer mode */}
      {mode === "twolayer" && (
        <div className="bg-zinc-800/60 rounded-lg p-4">
          <p className="text-xs text-zinc-400 mb-2 text-center">2層ネットワークの構造</p>
          <svg viewBox="0 0 400 140" className="w-full max-w-sm mx-auto h-auto">
            {/* Input layer */}
            {["x₁", "x₂"].map((label, i) => (
              <g key={`in-${i}`}>
                <circle cx={60} cy={40 + i * 60} r={18} fill="#27272a" stroke="#71717a" strokeWidth={1.5} />
                <text x={60} y={44 + i * 60} textAnchor="middle" className="text-[11px] fill-zinc-300">{label}</text>
              </g>
            ))}
            {/* Hidden layer */}
            {["h₁", "h₂"].map((label, i) => (
              <g key={`h-${i}`}>
                <circle cx={200} cy={40 + i * 60} r={18} fill="#422006" stroke="#f59e0b" strokeWidth={1.5} />
                <text x={200} y={44 + i * 60} textAnchor="middle" className="text-[11px] fill-amber-400">{label}</text>
              </g>
            ))}
            {/* Output */}
            <circle cx={340} cy={70} r={18} fill="#422006" stroke="#fbbf24" strokeWidth={2} />
            <text x={340} y={74} textAnchor="middle" className="text-[11px] fill-amber-300">y</text>

            {/* Connections: input to hidden */}
            {[0, 1].map((i) =>
              [0, 1].map((j) => (
                <line key={`ih-${i}-${j}`} x1={78} y1={40 + i * 60} x2={182} y2={40 + j * 60} stroke="#71717a" strokeWidth={0.8} opacity={0.5} />
              ))
            )}
            {/* Connections: hidden to output */}
            {[0, 1].map((i) => (
              <line key={`ho-${i}`} x1={218} y1={40 + i * 60} x2={322} y2={70} stroke="#f59e0b" strokeWidth={1} opacity={0.6} />
            ))}

            {/* Layer labels */}
            <text x={60} y={130} textAnchor="middle" className="text-[9px] fill-zinc-500">入力層</text>
            <text x={200} y={130} textAnchor="middle" className="text-[9px] fill-zinc-500">隠れ層</text>
            <text x={340} y={130} textAnchor="middle" className="text-[9px] fill-zinc-500">出力層</text>
          </svg>
          <p className="text-[10px] text-zinc-500 text-center mt-2">
            h₁ ≈ OR(x₁, x₂), h₂ ≈ AND(x₁, x₂), y ≈ h₁ AND NOT h₂
          </p>
        </div>
      )}
    </div>
  );
}
