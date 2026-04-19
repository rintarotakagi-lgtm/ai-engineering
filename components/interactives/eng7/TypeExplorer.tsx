"use client";

import { useState } from "react";

const examples = [
  { code: '"田中太郎"', type: "str", color: "text-green-600", desc: "文字列。ダブルまたはシングルクォートで囲む" },
  { code: "42", type: "int", color: "text-blue-600", desc: "整数。小数点なし" },
  { code: "3.14", type: "float", color: "text-purple-600", desc: "浮動小数点数" },
  { code: "True", type: "bool", color: "text-amber-600", desc: "真偽値。True または False" },
  { code: '["apple", "banana"]', type: "list", color: "text-pink-600", desc: "順序付きコレクション。インデックスでアクセス" },
  { code: '{"name": "田中", "age": 21}', type: "dict", color: "text-orange-600", desc: "キーと値のペア。JSONと同じ構造" },
  { code: '{"python", "ai", "python"}', type: "set", color: "text-teal-600", desc: "重複なしコレクション。\"python\"は1つだけ残る" },
  { code: "None", type: "NoneType", color: "text-zinc-500", desc: "値がない状態。nullに相当" },
];

export default function TypeExplorer() {
  const [selected, setSelected] = useState(examples[0]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">コードをクリックして型を確認</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {examples.map((ex) => (
          <button
            key={ex.type}
            onClick={() => setSelected(ex)}
            className={`rounded-lg border p-2 text-left transition ${
              selected.type === ex.type
                ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
            }`}
          >
            <code className={`text-xs font-bold ${ex.color}`}>{ex.type}</code>
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-zinc-900 p-4">
        <p className="mb-1 text-xs text-zinc-500">コード</p>
        <code className={`text-lg font-bold ${selected.color}`}>{selected.code}</code>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-zinc-500">type():</span>
          <code className="rounded bg-zinc-800 px-2 py-0.5 text-sm text-zinc-200">
            &lt;class &apos;{selected.type}&apos;&gt;
          </code>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{selected.desc}</p>
      </div>

      <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
        <p className="mb-1 text-xs font-medium text-zinc-500">Python でのアクセス例</p>
        {selected.type === "list" && <code className="text-xs text-zinc-700 dark:text-zinc-300">fruits = ["apple", "banana"]<br/>fruits[0]  # → "apple"<br/>len(fruits)  # → 2</code>}
        {selected.type === "dict" && <code className="text-xs text-zinc-700 dark:text-zinc-300">user = {"{"}&#34;name&#34;: &#34;田中&#34;{"}"}<br/>user[&#34;name&#34;]  # → &#34;田中&#34;<br/>user.get(&#34;age&#34;, 0)  # → 0</code>}
        {selected.type === "str" && <code className="text-xs text-zinc-700 dark:text-zinc-300">name = &#34;田中太郎&#34;<br/>len(name)  # → 5<br/>f&#34;こんにちは&#123;name&#125;&#34;</code>}
        {["int", "float", "bool", "NoneType", "set"].includes(selected.type) && (
          <code className="text-xs text-zinc-700 dark:text-zinc-300">x = {selected.code}<br/>type(x)  # → &lt;class &apos;{selected.type}&apos;&gt;</code>
        )}
      </div>
    </div>
  );
}
