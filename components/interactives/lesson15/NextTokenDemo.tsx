"use client";

import { useState } from "react";

type TokenProb = { token: string; prob: number };

type PromptData = {
  prompt: string;
  distribution: TokenProb[];
};

const PROMPTS: PromptData[] = [
  {
    prompt: "今日の天気は",
    distribution: [
      { token: "晴れ", prob: 0.35 },
      { token: "曇り", prob: 0.2 },
      { token: "雨", prob: 0.15 },
      { token: "良い", prob: 0.1 },
      { token: "快���", prob: 0.08 },
      { token: "悪い", prob: 0.05 },
      { token: "最高", prob: 0.04 },
      { token: "微妙", prob: 0.03 },
    ],
  },
  {
    prompt: "機械学習の目的は",
    distribution: [
      { token: "データ", prob: 0.3 },
      { token: "パターン", prob: 0.22 },
      { token: "予測", prob: 0.18 },
      { token: "自動", prob: 0.1 },
      { token: "最適", prob: 0.08 },
      { token: "人間", prob: 0.05 },
      { token: "効率", prob: 0.04 },
      { token: "精度", prob: 0.03 },
    ],
  },
  {
    prompt: "東京タワーの高さは",
    distribution: [
      { token: "333", prob: 0.45 },
      { token: "約", prob: 0.2 },
      { token: "東京", prob: 0.08 },
      { token: "高い", prob: 0.07 },
      { token: "スカイ", prob: 0.06 },
      { token: "有名", prob: 0.05 },
      { token: "赤い", prob: 0.05 },
      { token: "展望", prob: 0.04 },
    ],
  },
];

const BAR_MAX_W = 200;
const BAR_H = 22;
const CHART_X = 100;
const ROW_H = 28;

export default function NextTokenDemo() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);

  const data = PROMPTS[promptIdx];
  const maxProb = Math.max(...data.distribution.map((d) => d.prob));
  const svgH = data.distribution.length * ROW_H + 30;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-bold text-zinc-100">
        次のトークン予測: 確率分布
      </h3>

      {/* Prompt selector */}
      <div className="mb-3 flex flex-wrap gap-2">
        {PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => { setPromptIdx(i); setSelectedToken(null); }}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              i === promptIdx
                ? "border-amber-500 bg-amber-500/10 text-amber-400"
                : "border-zinc-600 text-zinc-400 hover:bg-zinc-800"
            }`}
          >
            {p.prompt}...
          </button>
        ))}
      </div>

      {/* Prompt display */}
      <div className="mb-3 rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          入力プロンプト
        </span>
        <p className="mt-1 text-sm font-mono text-amber-300">
          {data.prompt}
          <span className="animate-pulse text-amber-500">|</span>
        </p>
      </div>

      {/* Bar chart */}
      <svg viewBox={`0 0 360 ${svgH}`} className="w-full">
        {data.distribution.map((d, i) => {
          const y = 10 + i * ROW_H;
          const barW = (d.prob / maxProb) * BAR_MAX_W;
          const isSelected = i === selectedToken;
          const isTop = i === 0;

          return (
            <g
              key={d.token}
              onClick={() => setSelectedToken(i)}
              className="cursor-pointer"
            >
              {/* Token label */}
              <text
                x={CHART_X - 8}
                y={y + BAR_H / 2 + 4}
                textAnchor="end"
                className={`text-[11px] select-none ${
                  isSelected
                    ? "fill-amber-300 font-bold"
                    : isTop
                    ? "fill-white font-bold"
                    : "fill-zinc-300"
                }`}
              >
                {d.token}
              </text>
              {/* Bar */}
              <rect
                x={CHART_X}
                y={y}
                width={barW}
                height={BAR_H}
                rx={4}
                fill={isSelected ? "#f59e0b" : isTop ? "#d97706" : "#52525b"}
                opacity={isSelected ? 1 : isTop ? 0.9 : 0.6}
                className="transition-all duration-300"
              />
              {/* Probability */}
              <text
                x={CHART_X + barW + 6}
                y={y + BAR_H / 2 + 4}
                className={`text-[10px] select-none ${
                  isSelected ? "fill-amber-300" : "fill-zinc-400"
                }`}
              >
                {(d.prob * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Explanation */}
      <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2">
        <p className="text-xs text-zinc-300">
          {selectedToken !== null ? (
            <>
              「<span className="font-bold text-amber-400">{data.distribution[selectedToken].token}</span>
              」が選ばれる確率は{" "}
              <span className="font-bold text-amber-400">
                {(data.distribution[selectedToken].prob * 100).toFixed(1)}%
              </span>
              {selectedToken === 0
                ? "。Greedy Decodingではこのトークンが選ばれます。"
                : "。サンプリングではこのトークンも選ばれる可能性があります。"}
            </>
          ) : (
            "トークンをクリックして詳細を確認。Greedy Decodingでは最も確率の高いトークンが選ばれます。"
          )}
        </p>
      </div>
    </div>
  );
}
