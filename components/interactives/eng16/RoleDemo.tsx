"use client";

import { useState } from "react";

const presets = [
  {
    name: "デフォルト（system なし）",
    system: "",
    messages: [{ role: "user", content: "Pythonについて教えてください" }],
    response: "Pythonはプログラミング言語です。読みやすい文法が特徴で、AI・Web・データ分析に使われます。",
  },
  {
    name: "非エンジニア向けメンター",
    system: "あなたはフレンドリーなエンジニアメンターです。専門用語を避け、身近な例えで説明します。",
    messages: [{ role: "user", content: "Pythonについて教えてください" }],
    response: "Pythonはレゴブロックみたいなものです！小さな命令（ブロック）を積み重ねて、複雑なプログラムを作れます。英語に近い文法なので、コードを声に出して読むと意味がわかることが多いですよ。",
  },
  {
    name: "JSON出力モード",
    system: "ユーザーの質問に対して、必ずJSON形式で回答してください。{\"summary\": \"...\", \"key_points\": [...]}",
    messages: [{ role: "user", content: "Pythonについて教えてください" }],
    response: '{"summary": "Pythonは汎用プログラミング言語", "key_points": ["読みやすい文法", "AI/ML分野のデファクト", "豊富なライブラリ"]}',
  },
];

export default function RoleDemo() {
  const [selected, setSelected] = useState(presets[0]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">systemプロンプトを変えると回答がどう変わるか</p>

      <div className="space-y-1">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelected(p)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
              selected.name === p.name ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20" : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {selected.system && (
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
            <p className="mb-1 text-xs font-bold text-purple-600">system</p>
            <p className="text-sm text-purple-700 dark:text-purple-300">{selected.system}</p>
          </div>
        )}
        {selected.messages.map((m, i) => (
          <div key={i} className={`rounded-lg border p-3 ${m.role === "user" ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20" : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"}`}>
            <p className={`mb-1 text-xs font-bold ${m.role === "user" ? "text-blue-600" : "text-green-600"}`}>{m.role}</p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{m.content}</p>
          </div>
        ))}
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
          <p className="mb-1 text-xs font-bold text-green-600">assistant（Claudeの回答）</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{selected.response}</p>
        </div>
      </div>

      <div className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800">
        <p className="font-medium text-zinc-500 mb-1">まとめ</p>
        <ul className="space-y-1 text-zinc-400">
          <li>🟣 system: Claudeのキャラクター・制約・出力形式を設定</li>
          <li>🔵 user: ユーザーの入力・質問</li>
          <li>🟢 assistant: Claudeの回答（会話履歴として渡す）</li>
        </ul>
      </div>
    </div>
  );
}
