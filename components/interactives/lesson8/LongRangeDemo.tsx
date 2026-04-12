"use client";

import { useState, useMemo } from "react";

const SEQ_LEN = 15;
const SVG_W = 620;
const SVG_H = 240;
const PAD_L = 50;
const PAD_R = 20;
const PAD_T = 30;
const PAD_B = 40;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

type Preset = "short" | "long";

const PRESETS: Record<Preset, { sequence: number[]; signalIdx: number; label: string }> = {
  short: {
    sequence: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    signalIdx: 12,
    label: "短距離: シグナルが近い",
  },
  long: {
    sequence: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    signalIdx: 0,
    label: "長距離: シグナルが遠い",
  },
};

function simulateRNN(
  seq: number[],
  decayRate: number
): { hiddenStates: number[]; outputs: number[] } {
  const h: number[] = [];
  const y: number[] = [];
  let hPrev = 0;
  for (let t = 0; t < seq.length; t++) {
    const hNew = Math.tanh(decayRate * hPrev + seq[t]);
    h.push(hNew);
    y.push(hNew);
    hPrev = hNew;
  }
  return { hiddenStates: h, outputs: y };
}

export default function LongRangeDemo() {
  const [preset, setPreset] = useState<Preset>("short");
  const [decay, setDecay] = useState(0.9);

  const { sequence, signalIdx } = PRESETS[preset];

  const { hiddenStates } = useMemo(
    () => simulateRNN(sequence, decay),
    [sequence, decay]
  );

  const toX = (i: number) => PAD_L + (i / (SEQ_LEN - 1)) * PLOT_W;
  const toY = (v: number) => PAD_T + PLOT_H - ((v + 1) / 2) * PLOT_H; // map [-1,1] to plot

  const pathD = hiddenStates
    .map((h, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(h)}`)
    .join(" ");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap items-center">
        {(["short", "long"] as Preset[]).map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
              preset === p
                ? "bg-amber-500/20 border-amber-500 text-amber-400"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {PRESETS[p].label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 justify-center">
        <label className="text-xs text-zinc-400">減衰率:</label>
        <input
          type="range"
          min={0.3}
          max={0.99}
          step={0.01}
          value={decay}
          onChange={(e) => setDecay(Number(e.target.value))}
          className="w-32 accent-amber-500"
        />
        <span className="text-xs font-mono text-amber-400 w-8">
          {decay.toFixed(2)}
        </span>
      </div>

      {/* SVG Plot */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y axis */}
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1}
        />
        {/* X axis (at y=0) */}
        <line
          x1={PAD_L}
          y1={toY(0)}
          x2={SVG_W - PAD_R}
          y2={toY(0)}
          stroke="#52525b"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        {/* Y axis labels */}
        {[-1, 0, 1].map((v) => (
          <text
            key={v}
            x={PAD_L - 8}
            y={toY(v) + 3}
            textAnchor="end"
            className="text-[9px] fill-zinc-500"
          >
            {v}
          </text>
        ))}

        {/* Input sequence bars */}
        {sequence.map((val, i) => (
          <g key={`inp-${i}`}>
            {val > 0 && (
              <rect
                x={toX(i) - 6}
                y={PAD_T + PLOT_H - 14}
                width={12}
                height={14}
                rx={2}
                fill="#f59e0b"
                opacity={0.6}
              />
            )}
            <text
              x={toX(i)}
              y={PAD_T + PLOT_H + 16}
              textAnchor="middle"
              className={`text-[8px] ${
                i === signalIdx ? "fill-amber-400 font-bold" : "fill-zinc-500"
              }`}
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Hidden state line */}
        <path
          d={pathD}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Hidden state dots */}
        {hiddenStates.map((h, i) => (
          <circle
            key={`dot-${i}`}
            cx={toX(i)}
            cy={toY(h)}
            r={4}
            fill="#f59e0b"
            stroke="#fbbf24"
            strokeWidth={1.5}
          />
        ))}

        {/* Signal marker */}
        <text
          x={toX(signalIdx)}
          y={PAD_T - 4}
          textAnchor="middle"
          className="text-[10px] fill-amber-400 font-bold"
        >
          ↓ シグナル
        </text>

        {/* Labels */}
        <text
          x={PAD_L - 8}
          y={PAD_T - 8}
          textAnchor="end"
          className="text-[9px] fill-zinc-400"
        >
          h_t
        </text>
        <text
          x={SVG_W / 2}
          y={SVG_H - 4}
          textAnchor="middle"
          className="text-[10px] fill-zinc-400"
        >
          タイムステップ
        </text>

        {/* Final hidden state annotation */}
        <text
          x={toX(SEQ_LEN - 1) + 8}
          y={toY(hiddenStates[SEQ_LEN - 1]) - 10}
          textAnchor="start"
          className="text-[9px] fill-zinc-300"
        >
          h_final = {hiddenStates[SEQ_LEN - 1].toFixed(3)}
        </text>
      </svg>

      {/* Explanation */}
      <div className="text-center text-sm text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4">
        {preset === "short" ? (
          <span>
            シグナルがステップ13にあるため、最終隠れ状態にしっかり残っています。
            <span className="text-amber-400"> 短距離依存は問題なし。</span>
          </span>
        ) : (
          <span>
            シグナルがステップ1にあるため、{decay < 0.7 ? "ほぼ完全に忘却されています" : "大きく減衰しています"}。
            <span className="text-amber-400">
              {" "}
              これが「長距離依存性問題」です。
            </span>{" "}
            減衰率を変えて影響を確認してみましょう。
          </span>
        )}
      </div>
    </div>
  );
}
