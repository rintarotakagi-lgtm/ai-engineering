"use client";

import { useState } from "react";

const errors = [
  {
    type: "KeyError",
    code: 'data["email"]',
    example: `data = {"name": "田中"}
data["email"]  # KeyError!`,
    fix: 'data.get("email", "未登録")',
    cause: "辞書に存在しないキーへアクセス",
    color: "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20",
  },
  {
    type: "AttributeError",
    code: "result.get('name')",
    example: `result = None
result.get("name")  # AttributeError!`,
    fix: "if result: result.get('name')",
    cause: "Noneに対してメソッドを呼んだ",
    color: "border-orange-300 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20",
  },
  {
    type: "TypeError",
    code: '"価格: " + 1980',
    example: `"価格: " + 1980  # TypeError!`,
    fix: '"価格: " + str(1980)',
    cause: "型が合わない演算（str + int）",
    color: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20",
  },
  {
    type: "ConnectionError",
    code: "requests.get(url)",
    example: `requests.get("https://down.example.com")
# ConnectionError!`,
    fix: "try/except requests.exceptions.ConnectionError",
    cause: "サーバーにつながらない",
    color: "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20",
  },
];

export default function ErrorFlow() {
  const [selected, setSelected] = useState(errors[0]);
  const [showFix, setShowFix] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {errors.map((e) => (
          <button
            key={e.type}
            onClick={() => { setSelected(e); setShowFix(false); }}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${
              selected.type === e.type ? "border-zinc-400 bg-zinc-800 text-white" : "border-zinc-200 text-zinc-500 dark:border-zinc-700"
            }`}
          >
            {e.type}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border p-4 ${selected.color}`}>
        <p className="mb-1 text-xs font-bold text-red-600">エラー: {selected.type}</p>
        <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-300">{selected.cause}</p>
        <pre className="rounded-lg bg-zinc-900 p-3 text-xs text-red-400 overflow-x-auto">{selected.example}</pre>
      </div>

      {!showFix ? (
        <button
          onClick={() => setShowFix(true)}
          className="w-full rounded-lg border border-dashed border-green-400 py-2.5 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
        >
          修正方法を見る →
        </button>
      ) : (
        <div className="rounded-xl border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/20">
          <p className="mb-1 text-xs font-bold text-green-600">✓ 修正方法</p>
          <code className="text-sm text-green-700 dark:text-green-400">{selected.fix}</code>
        </div>
      )}

      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
        <p className="mb-1 text-xs font-medium text-zinc-500">try/exceptパターン</p>
        <pre className="text-xs text-zinc-600 dark:text-zinc-300">{`try:
    ${selected.code}
except ${selected.type}:
    # エラー対処
    pass`}</pre>
      </div>
    </div>
  );
}
