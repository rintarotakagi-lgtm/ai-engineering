"use client";

import { useState, useMemo } from "react";

function softmax(scores: number[], temperature: number): number[] {
  const t = Math.max(temperature, 0.01);
  const scaled = scores.map((s) => s / t);
  const maxVal = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - maxVal));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

const LABELS = ["入力1", "入力2", "入力3", "入力4", "入力5"];
const INITIAL_SCORES = [2.0, 1.0, 0.5, 3.0, 0.1];
const BAR_MAX_H = 140;

export default function SoftmaxDemo() {
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [temperature, setTemperature] = useState(1.0);

  const weights = useMemo(() => softmax(scores, temperature), [scores, temperature]);

  const updateScore = (idx: number, val: number) => {
    setScores((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Temperature control */}
      <div className="flex items-center justify-center gap-3">
        <label className="text-xs text-zinc-400">温度 (T):</label>
        <input
          type="range"
          min={0.1}
          max={5.0}
          step={0.1}
          value={temperature}
          onChange={(e) => setTemperature(Number(e.target.value))}
          className="w-40 accent-amber-500"
        />
        <span className="text-sm font-mono text-amber-400 w-10">
          {temperature.toFixed(1)}
        </span>
      </div>

      {/* Score inputs + bar chart */}
      <div className="flex justify-center gap-4">
        {scores.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 w-16">
            {/* Weight bar */}
            <div className="relative w-10 bg-zinc-800 rounded-t" style={{ height: BAR_MAX_H }}>
              <div
                className="absolute bottom-0 w-full rounded-t transition-all duration-300"
                style={{
                  height: weights[i] * BAR_MAX_H,
                  backgroundColor: `rgba(251, 191, 36, ${0.3 + weights[i] * 0.7})`,
                }}
              />
              <div className="absolute -top-5 w-full text-center text-[10px] font-mono text-amber-400">
                {weights[i].toFixed(3)}
              </div>
            </div>
            {/* Label */}
            <div className="text-[10px] text-zinc-500">{LABELS[i]}</div>
            {/* Score slider (vertical) */}
            <div className="flex flex-col items-center gap-1">
              <input
                type="range"
                min={-3}
                max={5}
                step={0.1}
                value={s}
                onChange={(e) => updateScore(i, Number(e.target.value))}
                className="w-14 accent-amber-500"
              />
              <span className="text-[10px] font-mono text-zinc-400">
                {s.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sum check */}
      <div className="text-center text-xs text-zinc-500">
        重みの合計:{" "}
        <span className="text-amber-400 font-mono">
          {weights.reduce((a, b) => a + b, 0).toFixed(4)}
        </span>
      </div>

      {/* Explanation */}
      <div className="text-center text-sm text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4">
        {temperature < 0.5 ? (
          <span>
            低温度 →{" "}
            <span className="text-amber-400">シャープな分布</span>
            ：最大スコアにほぼ全ての重みが集中（ハードAttention的）
          </span>
        ) : temperature > 2.5 ? (
          <span>
            高温度 →{" "}
            <span className="text-blue-400">滑らかな分布</span>
            ：重みが均等に近づく（全入力を広く参照）
          </span>
        ) : (
          <span>
            標準的な温度 → スコアの差がそのまま重みの差に反映されます
          </span>
        )}
      </div>
    </div>
  );
}
