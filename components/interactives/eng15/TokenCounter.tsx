"use client";

import { useState } from "react";

const COSTS = {
  "claude-haiku-4-5-20251001": { input: 0.25, output: 1.25, name: "Haiku 4.5" },
  "claude-sonnet-4-6": { input: 3.0, output: 15.0, name: "Sonnet 4.6" },
  "claude-opus-4-7": { input: 15.0, output: 75.0, name: "Opus 4.7" },
};

function estimateTokens(text: string, lang: "ja" | "en"): number {
  if (lang === "ja") return Math.ceil(text.length * 1.8);
  return Math.ceil(text.split(/\s+/).length * 1.3);
}

export default function TokenCounter() {
  const [text, setText] = useState("Pythonは、1991年にグイド・ヴァン・ロッサムが作ったプログラミング言語です。AIやデータ処理に広く使われています。");
  const [lang, setLang] = useState<"ja" | "en">("ja");
  const [model, setModel] = useState<keyof typeof COSTS>("claude-sonnet-4-6");
  const [callsPerDay, setCallsPerDay] = useState(100);

  const inputTokens = estimateTokens(text, lang);
  const outputTokens = 200;
  const cost = COSTS[model];
  const costPerCall = (inputTokens * cost.input + outputTokens * cost.output) / 1_000_000;
  const costPerDay = costPerCall * callsPerDay;
  const costPerMonth = costPerDay * 30;

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">テキストのトークン数とAPIコストを試算</p>

      <div className="flex gap-2">
        <button onClick={() => setLang("ja")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${lang === "ja" ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700"}`}>日本語</button>
        <button onClick={() => setLang("en")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${lang === "en" ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-700"}`}>English</button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        rows={3}
        placeholder="テキストを入力..."
      />

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
          <p className="text-xs text-zinc-400">文字数</p>
          <p className="text-xl font-bold text-zinc-700 dark:text-zinc-300">{text.length}</p>
        </div>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950/20">
          <p className="text-xs text-amber-600">トークン数（推定）</p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{inputTokens}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
          <p className="text-xs text-zinc-400">1000トークン比</p>
          <p className="text-xl font-bold text-zinc-700 dark:text-zinc-300">{(inputTokens / 1000).toFixed(2)}k</p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-zinc-500">モデルを選択</p>
        <div className="space-y-1">
          {(Object.entries(COSTS) as [keyof typeof COSTS, typeof COSTS[keyof typeof COSTS]][]).map(([id, c]) => (
            <button
              key={id}
              onClick={() => setModel(id)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                model === id ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20" : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{c.name}</span>
              <span className="text-xs text-zinc-400">入力 ${c.input}/MTok</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex justify-between text-xs font-medium text-zinc-500">
          <span>1日のAPI呼び出し回数</span>
          <span className="text-zinc-700 dark:text-zinc-300">{callsPerDay}回</span>
        </label>
        <input type="range" min={10} max={10000} step={10} value={callsPerDay} onChange={(e) => setCallsPerDay(Number(e.target.value))} className="mt-1 w-full" />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="mb-2 text-xs font-bold text-zinc-500">コスト試算（出力200トークン想定）</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div><p className="text-xs text-zinc-400">1回</p><p className="font-bold text-zinc-700 dark:text-zinc-300">${costPerCall.toFixed(5)}</p></div>
          <div><p className="text-xs text-zinc-400">1日</p><p className="font-bold text-amber-600">${costPerDay.toFixed(3)}</p></div>
          <div><p className="text-xs text-zinc-400">月額</p><p className="font-bold text-amber-700 dark:text-amber-400">${costPerMonth.toFixed(2)}</p></div>
        </div>
      </div>
    </div>
  );
}
