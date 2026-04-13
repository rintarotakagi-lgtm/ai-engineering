"use client";

import { useState } from "react";

interface CommitItem {
  id: string;
  message: string;
  author: string;
}

export default function PullDemo() {
  const [localCommits, setLocalCommits] = useState<CommitItem[]>([
    { id: "a1b2c3d", message: "Initial commit", author: "あなた" },
    { id: "e4f5g6h", message: "READMEを追加", author: "あなた" },
  ]);
  const remoteOnlyCommits: CommitItem[] = [
    { id: "k3l4m5n", message: "APIエンドポイントを追加", author: "佐藤" },
    { id: "o6p7q8r", message: "テストコードを追加", author: "田中" },
  ];
  const [pulled, setPulled] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  function handlePull() {
    if (pulled || isPulling) return;
    setIsPulling(true);
    setTimeout(() => {
      setLocalCommits((prev) => [...prev, ...remoteOnlyCommits]);
      setIsPulling(false);
      setPulled(true);
    }, 1500);
  }

  function reset() {
    setLocalCommits([
      { id: "a1b2c3d", message: "Initial commit", author: "あなた" },
      { id: "e4f5g6h", message: "READMEを追加", author: "あなた" },
    ]);
    setPulled(false);
  }

  const remoteCommits = pulled
    ? localCommits
    : [...localCommits, ...remoteOnlyCommits];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        git pull -- 他の人の変更を取り込む
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Remote */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800/50 dark:bg-amber-900/10">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              GitHub（リモート）
            </span>
          </div>
          <div className="space-y-2">
            {remoteCommits.map((c, i) => {
              const isNew = i >= 2;
              return (
                <div key={c.id} className={`flex items-center gap-2 rounded-lg border p-2 ${
                  isNew && !pulled
                    ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                }`}>
                  <code className="text-xs text-amber-600 dark:text-amber-400">{c.id}</code>
                  <span className="text-xs text-zinc-700 dark:text-zinc-200">{c.message}</span>
                  <span className="ml-auto text-[10px] text-zinc-400">{c.author}</span>
                  {isNew && !pulled && (
                    <span className="text-[10px] font-medium text-amber-500">NEW</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Local */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              ローカル（あなたのPC）
            </span>
          </div>
          <div className="space-y-2">
            {localCommits.map((c, i) => {
              const isNewlyPulled = pulled && i >= 2;
              return (
                <div key={c.id} className={`flex items-center gap-2 rounded-lg border p-2 ${
                  isNewlyPulled
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                }`}>
                  <code className="text-xs text-amber-600 dark:text-amber-400">{c.id}</code>
                  <span className="text-xs text-zinc-700 dark:text-zinc-200">{c.message}</span>
                  <span className="ml-auto text-[10px] text-zinc-400">{c.author}</span>
                  {isNewlyPulled && (
                    <span className="text-[10px] font-medium text-green-500">pull済み</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arrow */}
      {isPulling && (
        <div className="my-4 flex items-center justify-center gap-2 text-blue-500">
          <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span className="text-sm font-medium">pull中...</span>
        </div>
      )}

      {/* Terminal */}
      <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-500">Terminal</span>
        </div>
        <div className="font-mono text-xs text-green-400">
          <p><span className="text-zinc-500">$</span> git pull origin main</p>
          {isPulling && <p className="text-zinc-400">Updating e4f5g6h..o6p7q8r...</p>}
          {pulled && (
            <>
              <p className="text-zinc-400">remote: Enumerating objects: 8, done.</p>
              <p className="text-zinc-400">Updating e4f5g6h..o6p7q8r</p>
              <p className="text-zinc-400">Fast-forward</p>
              <p className="text-white"> api.js   | 42 ++++++++++++++</p>
              <p className="text-white"> test.js  | 28 +++++++++</p>
              <p className="text-white"> 2 files changed, 70 insertions(+)</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handlePull}
          disabled={pulled || isPulling}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            pulled || isPulling
              ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          git pull
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>

      {!pulled && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          GitHub上に佐藤さんと田中さんの新しいコミットがあります。git pull で取り込みましょう。
        </div>
      )}
      {pulled && (
        <div className="mt-3 rounded-lg bg-green-50 p-3 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
          pull完了！他のメンバーの変更がローカルに反映されました。これで最新の状態です。
        </div>
      )}
    </div>
  );
}
