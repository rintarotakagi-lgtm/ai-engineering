"use client";

import { useState } from "react";

const methods = [
  {
    method: "GET",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    border: "border-blue-200 dark:border-blue-800",
    description: "データを取得する",
    example: "GET /users/42",
    analogy: "本棚から本を取り出す",
    safe: true,
  },
  {
    method: "POST",
    color: "bg-green-500",
    textColor: "text-green-700",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    description: "新しいデータを作成する",
    example: "POST /users",
    analogy: "本棚に新しい本を追加する",
    safe: false,
  },
  {
    method: "PUT",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    description: "既存データを更新する",
    example: "PUT /users/42",
    analogy: "本棚の本を入れ替える",
    safe: false,
  },
  {
    method: "DELETE",
    color: "bg-red-500",
    textColor: "text-red-700",
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    description: "データを削除する",
    example: "DELETE /users/42",
    analogy: "本棚から本を捨てる",
    safe: false,
  },
];

export default function HttpMethods() {
  const [selected, setSelected] = useState(methods[0]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">HTTPメソッドを選んで詳細を確認</p>
      <div className="flex gap-2">
        {methods.map((m) => (
          <button
            key={m.method}
            onClick={() => setSelected(m)}
            className={`rounded-lg px-4 py-2 text-sm font-bold text-white transition ${m.color} ${selected.method === m.method ? "ring-2 ring-offset-2 ring-zinc-400" : "opacity-70 hover:opacity-100"}`}
          >
            {m.method}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border p-5 ${selected.bg} ${selected.border}`}>
        <div className="mb-3 flex items-center gap-3">
          <span className={`rounded-lg px-3 py-1 text-sm font-bold text-white ${selected.color}`}>
            {selected.method}
          </span>
          <span className={`font-semibold ${selected.textColor}`}>{selected.description}</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="w-16 shrink-0 text-zinc-400">例:</span>
            <code className="font-mono text-zinc-700 dark:text-zinc-300">{selected.example}</code>
          </div>
          <div className="flex gap-2">
            <span className="w-16 shrink-0 text-zinc-400">例え:</span>
            <span className="text-zinc-600 dark:text-zinc-400">{selected.analogy}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-16 shrink-0 text-zinc-400">安全?:</span>
            <span className={selected.safe ? "text-green-600" : "text-amber-600"}>
              {selected.safe ? "✓ 安全（データを変更しない）" : "⚠ 副作用あり（データが変わる）"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
        <p className="text-xs font-medium text-zinc-500">CRUD マッピング</p>
        <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
          {[["Create", "POST"], ["Read", "GET"], ["Update", "PUT"], ["Delete", "DELETE"]].map(([crud, http]) => (
            <div key={crud} className="rounded border border-zinc-200 p-2 dark:border-zinc-700">
              <p className="font-bold text-zinc-700 dark:text-zinc-300">{crud}</p>
              <p className="text-zinc-400">{http}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
