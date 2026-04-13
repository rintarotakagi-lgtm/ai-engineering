"use client";

import { useState, useMemo } from "react";

const SVG_W = 640;
const SVG_H = 400;
const PAD = { top: 30, right: 30, bottom: 60, left: 70 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

const ALPHA = 0.076;
const NC = 8.8e13;

function loss(n: number): number {
  return Math.pow(NC / n, ALPHA);
}

const LOG_N_MIN = 7; // 10M
const LOG_N_MAX = 13; // 10T

const MODELS: { name: string; params: number; color: string }[] = [
  { name: "GPT-2", params: 1.5e9, color: "#3b82f6" },
  { name: "GPT-3", params: 175e9, color: "#8b5cf6" },
  { name: "GPT-4", params: 1.8e12, color: "#ec4899" },
];

function toX(logN: number): number {
  return PAD.left + ((logN - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * PLOT_W;
}

function toY(l: number): number {
  const logL = Math.log10(l);
  const logLMax = Math.log10(loss(Math.pow(10, LOG_N_MIN)));
  const logLMin = Math.log10(loss(Math.pow(10, LOG_N_MAX)));
  return PAD.top + ((logLMax - logL) / (logLMax - logLMin)) * PLOT_H;
}

function formatParams(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return `${n}`;
}

export default function ParamScaling() {
  const [logN, setLogN] = useState(10);
  const paramCount = Math.pow(10, logN);
  const currentLoss = loss(paramCount);

  const linePath = useMemo(() => {
    const points: string[] = [];
    for (let ln = LOG_N_MIN; ln <= LOG_N_MAX; ln += 0.05) {
      const n = Math.pow(10, ln);
      const x = toX(ln);
      const y = toY(loss(n));
      points.push(`${x},${y}`);
    }
    return `M${points.join(" L")}`;
  }, []);

  const ticks = [7, 8, 9, 10, 11, 12, 13];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        パラメータ数 vs 損失（log-log スケール）
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        スライダーでモデルサイズを変えて、損失の変化を確認しましょう
      </p>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        style={{ maxWidth: SVG_W }}
      >
        {/* grid */}
        {ticks.map((t) => (
          <line
            key={`gx-${t}`}
            x1={toX(t)}
            y1={PAD.top}
            x2={toX(t)}
            y2={PAD.top + PLOT_H}
            stroke="#71717a"
            strokeOpacity={0.15}
            strokeDasharray="4 4"
          />
        ))}

        {/* axes */}
        <line
          x1={PAD.left}
          y1={PAD.top + PLOT_H}
          x2={PAD.left + PLOT_W}
          y2={PAD.top + PLOT_H}
          stroke="#a1a1aa"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + PLOT_H}
          stroke="#a1a1aa"
          strokeWidth={1}
        />

        {/* x ticks */}
        {ticks.map((t) => (
          <text
            key={`xt-${t}`}
            x={toX(t)}
            y={PAD.top + PLOT_H + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#a1a1aa"
          >
            {formatParams(Math.pow(10, t))}
          </text>
        ))}

        {/* x label */}
        <text
          x={PAD.left + PLOT_W / 2}
          y={SVG_H - 8}
          textAnchor="middle"
          fontSize={13}
          fill="#71717a"
        >
          パラメータ数
        </text>

        {/* y label */}
        <text
          x={16}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={13}
          fill="#71717a"
          transform={`rotate(-90, 16, ${PAD.top + PLOT_H / 2})`}
        >
          損失（Loss）
        </text>

        {/* scaling line */}
        <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth={2.5} />

        {/* model markers */}
        {MODELS.map((m) => {
          const lnM = Math.log10(m.params);
          const mx = toX(lnM);
          const my = toY(loss(m.params));
          return (
            <g key={m.name}>
              <circle cx={mx} cy={my} r={6} fill={m.color} />
              <text
                x={mx}
                y={my - 12}
                textAnchor="middle"
                fontSize={11}
                fontWeight="bold"
                fill={m.color}
              >
                {m.name}
              </text>
            </g>
          );
        })}

        {/* current position */}
        <circle
          cx={toX(logN)}
          cy={toY(currentLoss)}
          r={7}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2.5}
        />
        <line
          x1={toX(logN)}
          y1={toY(currentLoss)}
          x2={toX(logN)}
          y2={PAD.top + PLOT_H}
          stroke="#f59e0b"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.5}
        />
      </svg>

      {/* slider */}
      <div className="mt-4 flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
          モデルサイズ
        </label>
        <input
          type="range"
          min={LOG_N_MIN}
          max={LOG_N_MAX}
          step={0.01}
          value={logN}
          onChange={(e) => setLogN(parseFloat(e.target.value))}
          className="flex-1 accent-amber-500"
        />
      </div>

      <div className="mt-2 flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          パラメータ数:{" "}
          <span className="font-bold text-amber-600">
            {formatParams(paramCount)}
          </span>
        </span>
        <span>
          損失:{" "}
          <span className="font-bold text-amber-600">
            {currentLoss.toFixed(3)}
          </span>
        </span>
      </div>
    </div>
  );
}
