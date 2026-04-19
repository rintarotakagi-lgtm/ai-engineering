"use client";

import { useState } from "react";

const models = [
  { id: "claude-opus-4-7", name: "Claude Opus 4.7", cost: "$15/MTok" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", cost: "$3/MTok" },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", cost: "$0.25/MTok" },
];

const sampleResponses: Record<string, string> = {
  "Pythonを1行で説明してください": "Pythonは読みやすい文法が特徴のプログラミング言語で、AI・Web・自動化などに広く使われています。",
  "AIエージェントとは何ですか？": "AIエージェントとは、目標を与えると自律的にツールを使いながらタスクを完了しようとするAIシステムです。",
  "こんにちは": "こんにちは！今日はどのようなことでお手伝いできますか？",
};

export default function ApiBuilder() {
  const [model, setModel] = useState(models[1]);
  const [maxTokens, setMaxTokens] = useState(256);
  const [message, setMessage] = useState("Pythonを1行で説明してください");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    setResponse("");
    await new Promise((r) => setTimeout(r, 800));
    const reply = sampleResponses[message] ?? `「${message}」に対するClaudeの回答（シミュレーション）`;
    setResponse(reply);
    setLoading(false);
  };

  const inputTokens = Math.ceil(message.length * 1.5);
  const outputTokens = response ? Math.ceil(response.length * 1.5) : 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">APIリクエストを組み立てる（シミュレーション）</p>

      <div className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <div>
          <label className="text-xs font-medium text-zinc-500">model</label>
          <div className="mt-1 flex flex-wrap gap-1">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  model.id === m.id ? "border-amber-400 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-950/20 dark:text-amber-400" : "border-zinc-200 text-zinc-500 dark:border-zinc-700"
                }`}
              >
                {m.name} <span className="text-zinc-400">{m.cost}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-zinc-500">
            <span>max_tokens</span>
            <span className="font-mono text-zinc-700 dark:text-zinc-300">{maxTokens}</span>
          </label>
          <input type="range" min={64} max={1024} step={64} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} className="mt-1 w-full" />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500">messages[0].content</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            rows={2}
          />
        </div>
      </div>

      <div className="rounded-xl bg-zinc-900 p-3 text-xs font-mono text-zinc-300">
        <p className="text-zinc-500"># API呼び出しコード</p>
        <p>client.messages.create(</p>
        <p className="pl-4">model=<span className="text-green-400">&quot;{model.id}&quot;</span>,</p>
        <p className="pl-4">max_tokens=<span className="text-blue-400">{maxTokens}</span>,</p>
        <p className="pl-4">messages=[{"{"}&#34;role&#34;: &#34;user&#34;, &#34;content&#34;: <span className="text-green-400">&quot;{message.slice(0, 30)}{message.length > 30 ? "..." : ""}&quot;</span>{"}"}]</p>
        <p>)</p>
      </div>

      <button onClick={simulate} disabled={loading} className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {loading ? "呼び出し中..." : "▶ API を呼び出す（シミュレーション）"}
      </button>

      {response && (
        <div className="space-y-2 rounded-xl border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-950/20">
          <p className="text-xs font-bold text-green-600">レスポンス</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{response}</p>
          <div className="flex gap-4 text-xs text-zinc-400">
            <span>入力: ~{inputTokens} tokens</span>
            <span>出力: ~{outputTokens} tokens</span>
          </div>
        </div>
      )}
    </div>
  );
}
