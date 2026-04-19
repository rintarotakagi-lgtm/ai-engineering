"use client";

import { useState } from "react";

const commits = [
  { hash: "a1b2c3d", message: "初期セットアップ", author: "田中", date: "4/19 10:00", files: ["main.py", "README.md"] },
  { hash: "e4f5g6h", message: "ユーザー認証を追加", author: "田中", date: "4/19 14:30", files: ["auth.py", "main.py"] },
  { hash: "i7j8k9l", message: "バグ修正: ログイン後リダイレクト", author: "鈴木", date: "4/20 09:15", files: ["auth.py"] },
  { hash: "m0n1o2p", message: "テストを追加", author: "田中", date: "4/20 16:00", files: ["test_auth.py"] },
];

export default function CommitTimeline() {
  const [selected, setSelected] = useState<typeof commits[0] | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">コミット履歴。クリックして詳細を確認</p>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
        <div className="space-y-3">
          {commits.map((commit, i) => (
            <button
              key={commit.hash}
              onClick={() => setSelected(selected?.hash === commit.hash ? null : commit)}
              className={`relative flex items-start gap-4 w-full text-left rounded-xl border p-3 transition ${
                selected?.hash === commit.hash
                  ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-white text-xs font-bold text-amber-600 dark:bg-zinc-900">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-800 dark:text-zinc-200">{commit.message}</p>
                <p className="text-xs text-zinc-400">{commit.author} · {commit.date}</p>
              </div>
              <code className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
                {commit.hash.slice(0, 7)}
              </code>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <p className="text-xs font-bold text-amber-600 mb-2">コミット: {selected.hash}</p>
          <p className="font-medium text-zinc-800 dark:text-zinc-200 mb-1">{selected.message}</p>
          <p className="text-xs text-zinc-500 mb-2">Author: {selected.author} | {selected.date}</p>
          <div>
            <p className="text-xs text-zinc-400 mb-1">変更ファイル:</p>
            <div className="flex flex-wrap gap-1">
              {selected.files.map((f) => (
                <span key={f} className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">{f}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-zinc-50 p-3 text-xs font-mono text-zinc-500 dark:bg-zinc-800">
        <p>$ git log --oneline</p>
        {commits.map((c) => (
          <p key={c.hash} className="text-zinc-400">{c.hash.slice(0, 7)} {c.message}</p>
        ))}
      </div>
    </div>
  );
}
