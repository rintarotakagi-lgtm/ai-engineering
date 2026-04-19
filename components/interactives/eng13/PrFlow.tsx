"use client";

import { useState } from "react";

const steps = [
  { id: 1, label: "featureブランチを作成", cmd: "git checkout -b feature/login", detail: "mainから分岐して安全に開発", icon: "🌿" },
  { id: 2, label: "コードを変更してcommit", cmd: "git add . && git commit -m '...'", detail: "作業を記録する", icon: "💾" },
  { id: 3, label: "GitHubにpush", cmd: "git push origin feature/login", detail: "ローカルの変更をGitHubに送る", icon: "⬆️" },
  { id: 4, label: "Pull Requestを作成", cmd: "GitHub上で操作", detail: "「mainに取り込んでほしい」という提案", icon: "📝" },
  { id: 5, label: "コードレビュー", cmd: "GitHubのPRページ", detail: "チームがコメント・承認/却下", icon: "👀" },
  { id: 6, label: "マージ", cmd: "Merge pull request", detail: "featureブランチがmainに統合される", icon: "✅" },
  { id: 7, label: "ブランチを削除", cmd: "git branch -d feature/login", detail: "不要になったブランチをクリーンアップ", icon: "🗑️" },
];

export default function PrFlow() {
  const [current, setCurrent] = useState(0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">PRフローのステップを順番に確認</p>
      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => setCurrent(i)}
            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
              i === current
                ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20"
                : i < current
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/10"
                : "border-zinc-200 dark:border-zinc-700"
            }`}
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              i < current ? "bg-green-500 text-white" : i === current ? "bg-amber-500 text-white" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
            }`}>
              {i < current ? "✓" : step.id}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{step.icon}</span>
                <span className={`font-medium ${i === current ? "text-amber-700 dark:text-amber-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                  {step.label}
                </span>
              </div>
              {i === current && (
                <div className="mt-1 space-y-1">
                  <code className="text-xs text-zinc-500">{step.cmd}</code>
                  <p className="text-xs text-zinc-400">{step.detail}</p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="flex-1 rounded-lg border border-zinc-200 py-2 text-sm disabled:opacity-30"
        >
          ← 前のステップ
        </button>
        <button
          onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          disabled={current === steps.length - 1}
          className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white disabled:opacity-30"
        >
          次のステップ →
        </button>
      </div>
    </div>
  );
}
