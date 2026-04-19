"use client";

import { useState } from "react";

const scenario = [
  { step: 1, type: "think", label: "タスク受け取り", desc: "「競合A社の情報を調べてまとめて」", icon: "🎯" },
  { step: 2, type: "tool", label: "ツール実行 #1", desc: "search(\"競合A社\") → 基本情報を取得", icon: "🔍" },
  { step: 3, type: "think", label: "中間推論", desc: "CEOの情報も必要だと判断", icon: "🤔" },
  { step: 4, type: "tool", label: "ツール実行 #2", desc: "search(\"競合A社 CEO\") → 経営者情報", icon: "🔍" },
  { step: 5, type: "think", label: "中間推論", desc: "資金調達情報も欲しい", icon: "🤔" },
  { step: 6, type: "tool", label: "ツール実行 #3", desc: "search(\"競合A社 資金調達\") → 財務情報", icon: "🔍" },
  { step: 7, type: "think", label: "完了判断", desc: "十分な情報が集まった", icon: "✅" },
  { step: 8, type: "output", label: "最終出力", desc: "競合分析レポートを生成して返す", icon: "📄" },
];

export default function AgentLoop() {
  const [current, setCurrent] = useState(-1);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setCurrent(-1);
    for (let i = 0; i < scenario.length; i++) {
      setCurrent(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    setRunning(false);
  };

  const reset = () => { setCurrent(-1); setRunning(false); };

  const typeColors: Record<string, string> = {
    think: "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20",
    tool: "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20",
    output: "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20",
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">エージェントのループ動作を可視化</p>

      <div className="space-y-1.5">
        {scenario.map((s, i) => (
          <div
            key={s.step}
            className={`flex items-center gap-3 rounded-lg border p-2.5 transition-all duration-300 ${
              i <= current ? typeColors[s.type] : "border-zinc-200 dark:border-zinc-700 opacity-40"
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{s.label}</p>
              <p className="text-xs text-zinc-500">{s.desc}</p>
            </div>
            {i === current && running && (
              <div className="h-3 w-3 animate-pulse rounded-full bg-amber-500" />
            )}
            {i < current && (
              <span className="text-xs text-green-500">✓</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={run}
          disabled={running}
          className="flex-1 rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {running ? "実行中..." : "▶ エージェントを動かす"}
        </button>
        <button onClick={reset} className="rounded-lg border border-zinc-200 px-4 text-sm dark:border-zinc-700">
          リセット
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-950/20">
          <p className="font-bold text-blue-600">🤔 推論</p>
          <p className="text-zinc-400">次に何をするか考える</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="font-bold text-amber-600">🔍 ツール</p>
          <p className="text-zinc-400">実際に外部と相互作用</p>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-2 dark:border-green-800 dark:bg-green-950/20">
          <p className="font-bold text-green-600">✅ 完了</p>
          <p className="text-zinc-400">タスクが終わったら出力</p>
        </div>
      </div>
    </div>
  );
}
