"use client";

import { useState } from "react";

const steps = [
  {
    id: 1,
    label: "ユーザーがリクエスト",
    from: "user",
    desc: "「東京の今日の天気は？」",
    code: 'messages=[{"role": "user", "content": "東京の今日の天気は？"}]\ntools=[get_weather, ...]',
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: 2,
    label: "Claudeがツール呼び出しを決定",
    from: "claude",
    desc: "stop_reason == 'tool_use'",
    code: 'response.stop_reason == "tool_use"\nblock.name == "get_weather"\nblock.input == {"city": "Tokyo"}',
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    id: 3,
    label: "アプリがツールを実行",
    from: "app",
    desc: "get_weather('Tokyo') → '晴れ、25°C'",
    code: 'result = get_weather(block.input["city"])\n# → "晴れ、25°C"',
    color: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: 4,
    label: "結果をClaudeに返す",
    from: "app",
    desc: "tool_resultとして渡す",
    code: 'messages.append({"role": "user", "content": [\n  {"type": "tool_result", "content": "晴れ、25°C"}\n]})',
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    id: 5,
    label: "Claudeが最終回答を生成",
    from: "claude",
    desc: "「今日の東京は晴れで25°Cです」",
    code: 'response.content[0].text\n→ "今日の東京は晴れで25°Cです。\n   過ごしやすい天気ですね。"',
    color: "bg-green-100 text-green-800 border-green-300",
  },
];

export default function ToolFlow() {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">Tool useの5ステップ。クリックして詳細を確認</p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => setActive(i)}
            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
              active === i ? `border-2 ${step.color}` : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active === i ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"}`}>
              {step.id}
            </span>
            <div className="flex-1">
              <p className="font-medium text-zinc-700 dark:text-zinc-300">{step.label}</p>
              <p className="text-xs text-zinc-400">{step.desc}</p>
              {active === i && (
                <pre className="mt-2 rounded-lg bg-zinc-900 p-2 text-xs text-green-400 overflow-x-auto">{step.code}</pre>
              )}
            </div>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${step.from === "user" ? "bg-blue-100 text-blue-600" : step.from === "claude" ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"}`}>
              {step.from === "user" ? "👤 User" : step.from === "claude" ? "🤖 Claude" : "⚙️ App"}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-zinc-400 text-center">Claudeは「指示するだけ」。実際の実行はアプリ側</p>
    </div>
  );
}
