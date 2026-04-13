"use client";

import { useState } from "react";

interface FileChange {
  name: string;
  change: string;
  staged: boolean;
}

const INITIAL_FILES: FileChange[] = [
  { name: "index.html", change: "タイトルを「ようこそ」に変更", staged: false },
  { name: "style.css", change: "フォントサイズを16pxに変更", staged: false },
  { name: "app.js", change: "ボタンクリック時のアラートを追加", staged: false },
  { name: "about.html", change: "新しいページを作成", staged: false },
];

export default function StagingDemo() {
  const [files, setFiles] = useState<FileChange[]>(INITIAL_FILES);

  function toggleStage(name: string) {
    setFiles((prev) =>
      prev.map((f) => (f.name === name ? { ...f, staged: !f.staged } : f))
    );
  }

  function stageAll() {
    setFiles((prev) => prev.map((f) => ({ ...f, staged: true })));
  }

  function reset() {
    setFiles(INITIAL_FILES);
  }

  const stagedFiles = files.filter((f) => f.staged);
  const unstagedFiles = files.filter((f) => !f.staged);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        ファイルを選んでステージングしてみましょう
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Unstaged */}
        <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800/50 dark:bg-red-900/10">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                変更あり（未ステージ）
              </span>
            </div>
            <span className="text-xs text-zinc-400">{unstagedFiles.length} files</span>
          </div>
          <div className="space-y-2">
            {unstagedFiles.map((f) => (
              <div key={f.name} className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800">
                <div className="flex-1">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{f.name}</span>
                  <p className="text-xs text-zinc-400">{f.change}</p>
                </div>
                <button
                  onClick={() => toggleStage(f.name)}
                  className="rounded bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-600"
                >
                  add
                </button>
              </div>
            ))}
            {unstagedFiles.length === 0 && (
              <div className="py-4 text-center text-xs text-zinc-400">全てステージング済み</div>
            )}
          </div>
        </div>

        {/* Staged */}
        <div className="rounded-lg border border-green-200 bg-green-50/50 p-4 dark:border-green-800/50 dark:bg-green-900/10">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                ステージング済み
              </span>
            </div>
            <span className="text-xs text-zinc-400">{stagedFiles.length} files</span>
          </div>
          <div className="space-y-2">
            {stagedFiles.map((f) => (
              <div key={f.name} className="flex items-center gap-2 rounded-lg border border-green-200 bg-white p-2 dark:border-green-700 dark:bg-zinc-800">
                <div className="flex-1">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{f.name}</span>
                  <p className="text-xs text-zinc-400">{f.change}</p>
                </div>
                <button
                  onClick={() => toggleStage(f.name)}
                  className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  戻す
                </button>
              </div>
            ))}
            {stagedFiles.length === 0 && (
              <div className="py-4 text-center text-xs text-zinc-400">
                ファイルを「add」してステージングに追加
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal output */}
      <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-500">Terminal</span>
        </div>
        <div className="font-mono text-xs text-green-400">
          <p><span className="text-zinc-500">$</span> git status</p>
          {unstagedFiles.length > 0 && (
            <>
              <p className="text-red-400">Changes not staged for commit:</p>
              {unstagedFiles.map((f) => (
                <p key={f.name} className="text-red-400 ml-4">modified: {f.name}</p>
              ))}
            </>
          )}
          {stagedFiles.length > 0 && (
            <>
              <p className="text-green-400">Changes to be committed:</p>
              {stagedFiles.map((f) => (
                <p key={f.name} className="text-green-400 ml-4">modified: {f.name}</p>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={stageAll}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          git add . （全て追加）
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
