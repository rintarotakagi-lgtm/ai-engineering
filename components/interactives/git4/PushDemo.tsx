"use client";

import { useState } from "react";

interface CommitItem {
  id: string;
  message: string;
}

export default function PushDemo() {
  const [localCommits, setLocalCommits] = useState<CommitItem[]>([
    { id: "a1b2c3d", message: "ヘッダーのデザインを更新" },
    { id: "e4f5g6h", message: "フッターにリンクを追加" },
  ]);
  const [remoteCommits, setRemoteCommits] = useState<CommitItem[]>([
    { id: "x9y8z7w", message: "Initial commit" },
    { id: "v6u5t4s", message: "READMEを追加" },
  ]);
  const [isPushing, setIsPushing] = useState(false);
  const [pushed, setPushed] = useState(false);

  function handlePush() {
    if (pushed || isPushing) return;
    setIsPushing(true);
    setTimeout(() => {
      setRemoteCommits((prev) => [...prev, ...localCommits]);
      setLocalCommits([]);
      setIsPushing(false);
      setPushed(true);
    }, 1500);
  }

  function reset() {
    setLocalCommits([
      { id: "a1b2c3d", message: "ヘッダーのデザインを更新" },
      { id: "e4f5g6h", message: "フッターにリンクを追加" },
    ]);
    setRemoteCommits([
      { id: "x9y8z7w", message: "Initial commit" },
      { id: "v6u5t4s", message: "READMEを追加" },
    ]);
    setPushed(false);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        git push -- ローカルのコミットをGitHubにアップロード
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Local */}
        <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800/50 dark:bg-blue-900/10">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              ローカル（あなたのPC）
            </span>
          </div>
          <div className="space-y-2">
            {localCommits.map((c) => (
              <div key={c.id} className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2 dark:border-amber-700 dark:bg-amber-900/20">
                <code className="text-xs text-amber-600 dark:text-amber-400">{c.id}</code>
                <span className="text-xs text-zinc-700 dark:text-zinc-200">{c.message}</span>
                <span className="ml-auto text-[10px] text-amber-500">未push</span>
              </div>
            ))}
            {localCommits.length === 0 && (
              <div className="py-3 text-center text-xs text-zinc-400">
                {pushed ? "全てpush済み" : "コミットなし"}
              </div>
            )}
          </div>
        </div>

        {/* Remote */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800/50 dark:bg-amber-900/10">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
              GitHub（リモート）
            </span>
          </div>
          <div className="space-y-2">
            {remoteCommits.map((c, i) => (
              <div
                key={c.id}
                className={`flex items-center gap-2 rounded-lg border p-2 ${
                  i >= remoteCommits.length - localCommits.length && pushed
                    ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
                }`}
              >
                <code className="text-xs text-amber-600 dark:text-amber-400">{c.id}</code>
                <span className="text-xs text-zinc-700 dark:text-zinc-200">{c.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow indicator */}
      {isPushing && (
        <div className="my-4 flex items-center justify-center gap-2 text-amber-500">
          <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span className="text-sm font-medium">push中...</span>
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
          <p><span className="text-zinc-500">$</span> git push origin main</p>
          {isPushing && <p className="text-zinc-400">Enumerating objects: 6, done...</p>}
          {pushed && (
            <>
              <p className="text-zinc-400">Enumerating objects: 6, done.</p>
              <p className="text-zinc-400">Counting objects: 100% (6/6), done.</p>
              <p className="text-zinc-400">Writing objects: 100% (4/4), done.</p>
              <p className="text-white">To https://github.com/user/my-project.git</p>
              <p className="text-white">   v6u5t4s..e4f5g6h  main → main</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handlePush}
          disabled={pushed || isPushing}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            pushed || isPushing
              ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          git push
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
