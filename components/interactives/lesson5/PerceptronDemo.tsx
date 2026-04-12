"use client";

import { useState, useMemo } from "react";

// --- SVG constants ---
const SVG_W = 480;
const SVG_H = 340;
const PAD = 40;

// Data space: x1, x2 in [−0.5, 1.5]
const D_MIN = -0.5;
const D_MAX = 1.5;

function toSx(v: number) {
  return PAD + ((v - D_MIN) / (D_MAX - D_MIN)) * (SVG_W - 2 * PAD);
}
function toSy(v: number) {
  return SVG_H - PAD - ((v - D_MIN) / (D_MAX - D_MIN)) * (SVG_H - 2 * PAD);
}

function step(z: number): number {
  return z >= 0 ? 1 : 0;
}

type Gate = "AND" | "OR" | "CUSTOM";

const PRESETS: Record<Gate, { w1: number; w2: number; b: number }> = {
  AND: { w1: 1, w2: 1, b: -1.5 },
  OR: { w1: 1, w2: 1, b: -0.5 },
  CUSTOM: { w1: 0.5, w2: 0.5, b: 0 },
};

const TRUTH_TABLE = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

export default function PerceptronDemo() {
  const [gate, setGate] = useState<Gate>("AND");
  const [w1, setW1] = useState(PRESETS.AND.w1);
  const [w2, setW2] = useState(PRESETS.AND.w2);
  const [b, setB] = useState(PRESETS.AND.b);

  const selectGate = (g: Gate) => {
    setGate(g);
    setW1(PRESETS[g].w1);
    setW2(PRESETS[g].w2);
    setB(PRESETS[g].b);
  };

  // Compute outputs for truth table
  const outputs = useMemo(
    () => TRUTH_TABLE.map(([x1, x2]) => step(w1 * x1 + w2 * x2 + b)),
    [w1, w2, b]
  );

  // Decision boundary: w1*x1 + w2*x2 + b = 0  =>  x2 = (-w1*x1 - b) / w2
  const boundaryPoints = useMemo(() => {
    if (Math.abs(w2) < 0.01 && Math.abs(w1) < 0.01) return null;

    const pts: [number, number][] = [];
    // Intersect with edges of the visible area
    if (Math.abs(w2) > 0.01) {
      for (const x1 of [D_MIN, D_MAX]) {
        const x2 = (-w1 * x1 - b) / w2;
        if (x2 >= D_MIN - 0.1 && x2 <= D_MAX + 0.1) pts.push([x1, x2]);
      }
    }
    if (Math.abs(w1) > 0.01) {
      for (const x2 of [D_MIN, D_MAX]) {
        const x1 = (-w2 * x2 - b) / w1;
        if (x1 >= D_MIN - 0.1 && x1 <= D_MAX + 0.1) pts.push([x1, x2]);
      }
    }
    // Deduplicate & take first two
    const unique = pts.filter(
      (p, i, a) =>
        a.findIndex((q) => Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) < 0.01) === i
    );
    return unique.length >= 2 ? [unique[0], unique[1]] : null;
  }, [w1, w2, b]);

  // Expected outputs for gates
  const expected: Record<Gate, number[]> = {
    AND: [0, 0, 0, 1],
    OR: [0, 1, 1, 1],
    CUSTOM: [],
  };

  const isCorrect =
    gate !== "CUSTOM" &&
    outputs.every((o, i) => o === expected[gate][i]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Gate selector */}
      <div className="flex gap-2 justify-center">
        {(["AND", "OR", "CUSTOM"] as Gate[]).map((g) => (
          <button
            key={g}
            onClick={() => selectGate(g)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              gate === g
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        {/* SVG plot */}
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full sm:w-2/3 h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Shaded regions */}
          {(() => {
            const res = 30;
            const rects: React.ReactElement[] = [];
            for (let i = 0; i < res; i++) {
              for (let j = 0; j < res; j++) {
                const x1 = D_MIN + (i / res) * (D_MAX - D_MIN);
                const x2 = D_MIN + (j / res) * (D_MAX - D_MIN);
                const out = step(w1 * x1 + w2 * x2 + b);
                const sx = toSx(x1);
                const sy = toSy(x2 + (D_MAX - D_MIN) / res);
                const sw = (SVG_W - 2 * PAD) / res;
                const sh = (SVG_H - 2 * PAD) / res;
                rects.push(
                  <rect
                    key={`${i}-${j}`}
                    x={sx}
                    y={sy}
                    width={sw + 1}
                    height={sh + 1}
                    fill={out === 1 ? "#f59e0b" : "#3f3f46"}
                    opacity={0.15}
                  />
                );
              }
            }
            return rects;
          })()}

          {/* Grid */}
          {[0, 1].map((v) => (
            <g key={`grid-${v}`}>
              <line x1={toSx(v)} y1={toSy(D_MIN)} x2={toSx(v)} y2={toSy(D_MAX)} stroke="#52525b" strokeWidth={0.5} strokeDasharray="4 3" />
              <line x1={toSx(D_MIN)} y1={toSy(v)} x2={toSx(D_MAX)} y2={toSy(v)} stroke="#52525b" strokeWidth={0.5} strokeDasharray="4 3" />
            </g>
          ))}

          {/* Decision boundary */}
          {boundaryPoints && (
            <line
              x1={toSx(boundaryPoints[0][0])}
              y1={toSy(boundaryPoints[0][1])}
              x2={toSx(boundaryPoints[1][0])}
              y2={toSy(boundaryPoints[1][1])}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="6 4"
            />
          )}

          {/* Data points */}
          {TRUTH_TABLE.map(([x1, x2], i) => (
            <g key={`pt-${i}`}>
              <circle
                cx={toSx(x1)}
                cy={toSy(x2)}
                r={14}
                fill={outputs[i] === 1 ? "#f59e0b" : "#52525b"}
                stroke={outputs[i] === 1 ? "#fbbf24" : "#71717a"}
                strokeWidth={2}
                opacity={0.9}
              />
              <text
                x={toSx(x1)}
                y={toSy(x2) + 4}
                textAnchor="middle"
                className="text-[11px] fill-white font-bold"
              >
                {outputs[i]}
              </text>
            </g>
          ))}

          {/* Axis labels */}
          <text x={SVG_W / 2} y={SVG_H - 4} textAnchor="middle" className="text-[11px] fill-zinc-400 font-medium">
            x₁
          </text>
          <text x={12} y={SVG_H / 2} textAnchor="middle" transform={`rotate(-90, 12, ${SVG_H / 2})`} className="text-[11px] fill-zinc-400 font-medium">
            x₂
          </text>
        </svg>

        {/* Truth table */}
        <div className="sm:w-1/3 space-y-2">
          <table className="w-full text-xs text-center">
            <thead>
              <tr className="text-zinc-400 border-b border-zinc-700">
                <th className="py-1">x₁</th>
                <th className="py-1">x₂</th>
                <th className="py-1">出力</th>
                {gate !== "CUSTOM" && <th className="py-1">正解</th>}
              </tr>
            </thead>
            <tbody>
              {TRUTH_TABLE.map(([x1, x2], i) => (
                <tr key={i} className="border-b border-zinc-800">
                  <td className="py-1 text-zinc-300">{x1}</td>
                  <td className="py-1 text-zinc-300">{x2}</td>
                  <td className={`py-1 font-bold ${outputs[i] === 1 ? "text-amber-400" : "text-zinc-500"}`}>
                    {outputs[i]}
                  </td>
                  {gate !== "CUSTOM" && (
                    <td className="py-1">
                      {outputs[i] === expected[gate][i] ? (
                        <span className="text-emerald-400">OK</span>
                      ) : (
                        <span className="text-red-400">NG</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {gate !== "CUSTOM" && (
            <div className={`text-center text-xs font-medium py-1 rounded ${isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>
              {isCorrect ? "All correct!" : "Try adjusting w₁, w₂, b"}
            </div>
          )}
        </div>
      </div>

      {/* Sliders */}
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
              onChange={(e) => {
                set(Number(e.target.value));
                setGate("CUSTOM");
              }}
              className="w-full accent-amber-500"
            />
          </div>
        ))}
      </div>

      {/* Equation */}
      <div className="text-center text-sm font-mono text-zinc-300 bg-zinc-800/60 rounded-lg py-2 px-4">
        y = step({w1.toFixed(1)}x₁ + {w2.toFixed(1)}x₂ {b >= 0 ? "+" : "−"} {Math.abs(b).toFixed(1)})
      </div>
    </div>
  );
}
