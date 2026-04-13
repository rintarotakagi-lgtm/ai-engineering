"use client";

import { useState } from "react";

const MANUAL_FILES = [
  { name: "企画書_v1.docx", date: "4/1", size: "24KB" },
  { name: "企画書_v2.docx", date: "4/1", size: "28KB" },
  { name: "企画書_v3_修正版.docx", date: "4/2", size: "31KB" },
  { name: "企画書_v3_修正版_最終.docx", date: "4/3", size: "35KB" },
  { name: "企画書_v3_修正版_最終_本当の最終.docx", date: "4/3", size: "36KB" },
  { name: "企画書_v3_修正版_最終_本当の最終(2).docx", date: "4/4", size: "38KB" },
  { name: "企画書_提出用_FINAL.docx", date: "4/5", size: "40KB" },
];

const GIT_HISTORY = [
  { hash: "a1b2c3d", message: "企画書の初版を作成", date: "4/1", author: "田中" },
  { hash: "e4f5g6h", message: "目的セクションを追加", date: "4/1", author: "田中" },
  { hash: "i7j8k9l", message: "スケジュールを追加", date: "4/2", author: "佐藤" },
  { hash: "m0n1o2p", message: "レビュー指摘を反映", date: "4/3", author: "田中" },
  { hash: "q3r4s5t", message: "予算を150万円に修正", date: "4/3", author: "佐藤" },
  { hash: "u6v7w8x", message: "対象部門を明記", date: "4/4", author: "田中" },
  { hash: "y9z0a1b", message: "最終版として承認", date: "4/5", author: "鈴木" },
];

export default function GitVsManual() {
  const [hoveredManual, setHoveredManual] = useState<number | null>(null);
  const [hoveredGit, setHoveredGit] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Manual side */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-red-100 px-2 py-1 text-xs font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
              NG
            </span>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              ファイル名で管理
            </span>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-800/50 dark:bg-red-900/10">
            <div className="mb-2 flex items-center gap-2 border-b border-red-200 pb-2 dark:border-red-800/50">
              <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span className="text-xs text-red-500 dark:text-red-400">プロジェクトフォルダ</span>
            </div>
            <div className="space-y-1">
              {MANUAL_FILES.map((f, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredManual(i)}
                  onMouseLeave={() => setHoveredManual(null)}
                  className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors ${
                    hoveredManual === i
                      ? "bg-red-100 dark:bg-red-900/30"
                      : ""
                  }`}
                >
                  <svg className="h-3.5 w-3.5 shrink-0 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate text-zinc-700 dark:text-zinc-300">{f.name}</span>
                  <span className="ml-auto shrink-0 text-zinc-400">{f.size}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded bg-red-100 p-2 text-xs text-red-600 dark:bg-red-900/30 dark:text-red-400">
              合計 7ファイル / 232KB / どれが最新？
            </div>
          </div>
        </div>

        {/* Git side */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400">
              OK
            </span>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Gitで管理
            </span>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-800/50 dark:bg-green-900/10">
            {/* Single file */}
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-green-300 bg-white p-2 dark:border-green-700 dark:bg-zinc-800">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">企画書.docx</span>
              <span className="ml-auto text-xs text-green-600 dark:text-green-400">40KB（最新版のみ）</span>
            </div>

            {/* History */}
            <div className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              変更履歴（Git が自動管理）
            </div>
            <div className="space-y-1">
              {GIT_HISTORY.map((h, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredGit(i)}
                  onMouseLeave={() => setHoveredGit(null)}
                  className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs transition-colors ${
                    hoveredGit === i
                      ? "bg-green-100 dark:bg-green-900/30"
                      : ""
                  }`}
                >
                  <code className="shrink-0 text-amber-600 dark:text-amber-400">{h.hash}</code>
                  <span className="truncate text-zinc-700 dark:text-zinc-300">{h.message}</span>
                  <span className="ml-auto shrink-0 text-zinc-400">{h.author}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded bg-green-100 p-2 text-xs text-green-600 dark:bg-green-900/30 dark:text-green-400">
              1ファイル / 履歴は自動管理 / いつでも過去に戻れる
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
