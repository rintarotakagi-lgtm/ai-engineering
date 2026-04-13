"use client";

import { useState, useMemo } from "react";

const TOKENS = [
  { token: "晴れ", prob: 0.3 },
  { token: "曇り", prob: 0.2 },
  { token: "雨", prob: 0.15 },
  { token: "良い", prob: 0.1 },
  { token: "快晴", prob: 0.08 },
  { token: "悪い", prob: 0.06 },
  { token: "最高", prob: 0.04 },
  { token: "微妙", prob: 0.03 },
  { token: "寒い", prob: 0.025 },
  { token: "暑い", prob: 0.015 },
];

type FilterMode = "top-k" | "top-p";

const BAR_MAX_W = 160;
const BAR_H = 18;
const CHART_X = 70;
const ROW_H = 24;

export default function SamplingDemo() {
  const [mode, setMode] = useState<FilterMode>("top-k");
  const [topK, setTopK] = useState(5);
  const [topP, setTopP] = useState(0.9);

  const { kept, filtered, renormalized } = useMemo(() => {
    const sorted = [...TOKENS].sort((a, b) => b.prob - a.prob);

    let keptTokens: typeof TOKENS;
    let filteredTokens: typeof TOKENS;

    if (mode === "top-k") {
      keptTokens = sorted.slice(0, topK);
      filteredTokens = sorted.slice(topK);
    } else {
      let cumProb = 0;
      let cutoff = sorted.length;
      for (let i = 0; i < sorted.length; i++) {
        cumProb += sorted[i].prob;
        if (cumProb >= topP) {
          cutoff = i + 1;
          break;
        }
      }
      keptTokens = sorted.slice(0, cutoff);
      filteredTokens = sorted.slice(cutoff);
    }

    const totalKept = keptTokens.reduce((s, t) => s + t.prob, 0);
    const renorm = keptTokens.map((t) => ({
      ...t,
      prob: t.prob / totalKept,
    }));

    return { kept: keptTokens, filtered: filteredTokens, renormalized: renorm };
  }, [mode, topK, topP]);

  const svgH = TOKENS.length * ROW_H + 20;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-bold text-zinc-100">
        Top-k / Top-p フィルタリング
      </h3>

      {/* Mode toggle */}
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setMode("top-k")}
          className={`rounded-md border px-4 py-1.5 text-xs transition ${
            mode === "top-k"
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Top-k
        </button>
        <button
          onClick={() => setMode("top-p")}
          className={`rounded-md border px-4 py-1.5 text-xs transition ${
            mode === "top-p"
              ? "border-amber-500 bg-amber-500/10 text-amber-400"
              : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Top-p (Nucleus)
        </button>
      </div>

      {/* Slider */}
      <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
        {mode === "top-k" ? (
          <>
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-300">
                k = <span className="font-bold text-amber-400">{topK}</span>
              </label>
              <span className="text-[10px] text-zinc-500">
                上位{topK}個のトークンから選択
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="mt-2 w-full accent-amber-500"
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <label className="text-xs text-zinc-300">
                p = <span className="font-bold text-amber-400">{topP.toFixed(2)}</span>
              </label>
              <span className="text-[10px] text-zinc-500">
                累積確率{(topP * 100).toFixed(0)}%以内のトークン: {kept.length}個
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="mt-2 w-full accent-amber-500"
            />
          </>
        )}
      </div>

      {/* Chart: showing kept vs filtered */}
      <svg viewBox={`0 0 340 ${svgH}`} className="w-full">
        {TOKENS.map((item, i) => {
          const y = 5 + i * ROW_H;
          const barW = Math.max(1, (item.prob / 0.3) * BAR_MAX_W);
          const isKept = kept.some((k) => k.token === item.token);

          return (
            <g key={item.token}>
              <text
                x={CHART_X - 6}
                y={y + BAR_H / 2 + 4}
                textAnchor="end"
                className={`text-[10px] select-none ${
                  isKept ? "fill-white font-bold" : "fill-zinc-600"
                }`}
              >
                {item.token}
              </text>
              <rect
                x={CHART_X}
                y={y}
                width={barW}
                height={BAR_H}
                rx={3}
                fill={isKept ? "#f59e0b" : "#3f3f46"}
                opacity={isKept ? 0.8 : 0.3}
                className="transition-all duration-300"
              />
              <text
                x={CHART_X + barW + 6}
                y={y + BAR_H / 2 + 4}
                className={`text-[10px] select-none ${isKept ? "fill-zinc-300" : "fill-zinc-600"}`}
              >
                {(item.prob * 100).toFixed(1)}%
              </text>
              {!isKept && (
                <line
                  x1={CHART_X}
                  y1={y + BAR_H / 2}
                  x2={CHART_X + barW}
                  y2={y + BAR_H / 2}
                  stroke="#ef4444"
                  strokeWidth={1}
                  strokeDasharray="4,2"
                  opacity={0.5}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Summary */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-3 py-2">
          <span className="text-[10px] font-bold text-emerald-400">
            候補（{kept.length}個）
          </span>
          <p className="mt-1 text-[10px] text-zinc-300">
            {kept.map((t) => t.token).join(", ")}
          </p>
        </div>
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-3 py-2">
          <span className="text-[10px] font-bold text-red-400">
            除外（{filtered.length}個）
          </span>
          <p className="mt-1 text-[10px] text-zinc-300">
            {filtered.length > 0 ? filtered.map((t) => t.token).join(", ") : "なし"}
          </p>
        </div>
      </div>

      {/* Renormalized */}
      <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2">
        <span className="text-[10px] font-bold text-zinc-400">
          再正規化後の確率:
        </span>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {renormalized.map((t) => (
            <span
              key={t.token}
              className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400"
            >
              {t.token}: {(t.prob * 100).toFixed(1)}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
