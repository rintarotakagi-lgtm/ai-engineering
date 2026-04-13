"use client";

import { useState, useMemo } from "react";

const SVG_W = 640;
const SVG_H = 400;
const PAD = { top: 30, right: 30, bottom: 60, left: 70 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

const ALPHA_D = 0.095;
const DC = 5.4e13;

function loss(d: number): number {
  return Math.pow(DC / d, ALPHA_D);
}

const LOG_D_MIN = 8; // 100M tokens
const LOG_D_MAX = 14; // 100T tokens

const DATASETS: { name: string; tokens: number; color: string }[] = [
  { name: "GPT-2\n(WebText)", tokens: 40e9, color: "#3b82f6" },
  { name: "GPT-3\n(300B)", tokens: 300e9, color: "#8b5cf6" },
  { name: "LLaMA\n(1.4T)", tokens: 1.4e12, color: "#10b981" },
  { name: "GPT-4\n(13T+)", tokens: 13e12, color: "#ec4899" },
];

function toX(logD: number): number {
  return PAD.left + ((logD - LOG_D_MIN) / (LOG_D_MAX - LOG_D_MIN)) * PLOT_W;
}

function toY(l: number): number {
  const logL = Math.log10(l);
  const logLMax = Math.log10(loss(Math.pow(10, LOG_D_MIN)));
  const logLMin = Math.log10(loss(Math.pow(10, LOG_D_MAX)));
  return PAD.top + ((logLMax - logL) / (logLMax - logLMin)) * PLOT_H;
}

function formatTokens(d: number): string {
  if (d >= 1e12) return `${(d / 1e12).toFixed(1)}T`;
  if (d >= 1e9) return `${(d / 1e9).toFixed(0)}B`;
  if (d >= 1e6) return `${(d / 1e6).toFixed(0)}M`;
  return `${d}`;
}

export default function DataScaling() {
  const [logD, setLogD] = useState(11);
  const tokenCount = Math.pow(10, logD);
  const currentLoss = loss(tokenCount);

  const linePath = useMemo(() => {
    const points: string[] = [];
    for (let ld = LOG_D_MIN; ld <= LOG_D_MAX; ld += 0.05) {
      const d = Math.pow(10, ld);
      const x = toX(ld);
      const y = toY(loss(d));
      points.push(`${x},${y}`);
    }
    return `M${points.join(" L")}`;
  }, []);

  const ticks = [8, 9, 10, 11, 12, 13, 14];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        データ量 vs 損失（log-log スケール）
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        データを増やすほど損失は下がりますが、収穫逓減のパターンに注目してください
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
            {formatTokens(Math.pow(10, t))}
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
          データ量（トークン数）
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

        {/* dataset markers */}
        {DATASETS.map((ds) => {
          const lnD = Math.log10(ds.tokens);
          const dx = toX(lnD);
          const dy = toY(loss(ds.tokens));
          const lines = ds.name.split("\n");
          return (
            <g key={ds.name}>
              <circle cx={dx} cy={dy} r={6} fill={ds.color} />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={dx}
                  y={dy - 20 + i * 13}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill={ds.color}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}

        {/* current position */}
        <circle
          cx={toX(logD)}
          cy={toY(currentLoss)}
          r={7}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={2.5}
        />
        <line
          x1={toX(logD)}
          y1={toY(currentLoss)}
          x2={toX(logD)}
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
          データ量
        </label>
        <input
          type="range"
          min={LOG_D_MIN}
          max={LOG_D_MAX}
          step={0.01}
          value={logD}
          onChange={(e) => setLogD(parseFloat(e.target.value))}
          className="flex-1 accent-amber-500"
        />
      </div>

      <div className="mt-2 flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
        <span>
          トークン数:{" "}
          <span className="font-bold text-amber-600">
            {formatTokens(tokenCount)}
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
