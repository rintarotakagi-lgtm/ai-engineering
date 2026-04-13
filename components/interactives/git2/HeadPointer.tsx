"use client";

import { useState } from "react";

interface CommitInfo {
  id: string;
  message: string;
  branch: string;
  x: number;
}

const COMMITS: CommitInfo[] = [
  { id: "a1b2c3d", message: "Initial commit", branch: "main", x: 80 },
  { id: "e4f5g6h", message: "READMEを追加", branch: "main", x: 200 },
  { id: "i7j8k9l", message: "基本構造を作成", branch: "main", x: 320 },
  { id: "m0n1o2p", message: "スタイルを調整", branch: "main", x: 440 },
];

const FILES_BY_COMMIT: Record<string, string[]> = {
  "a1b2c3d": [".gitignore"],
  "e4f5g6h": [".gitignore", "README.md"],
  "i7j8k9l": [".gitignore", "README.md", "index.html", "style.css"],
  "m0n1o2p": [".gitignore", "README.md", "index.html", "style.css", "app.js"],
};

export default function HeadPointer() {
  const [headIdx, setHeadIdx] = useState(COMMITS.length - 1);
  const current = COMMITS[headIdx];
  const files = FILES_BY_COMMIT[current.id] ?? [];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        HEADを動かして、各コミット時点のファイル状態を確認しましょう
      </h3>

      {/* SVG commit line */}
      <div className="mb-6 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <svg viewBox="0 0 520 120" className="w-full min-w-[400px]">
          {/* Main line */}
          <line x1={60} y1={60} x2={460} y2={60} stroke="#71717a" strokeWidth={2} opacity={0.3} />

          {/* Commits */}
          {COMMITS.map((c, i) => (
            <g key={c.id} onClick={() => setHeadIdx(i)} className="cursor-pointer">
              <circle
                cx={c.x}
                cy={60}
                r={i === headIdx ? 16 : 12}
                fill={i === headIdx ? "#f59e0b" : i < headIdx ? "#10b981" : "#a1a1aa"}
                stroke="white"
                strokeWidth={2}
                className="transition-all"
              />
              <text
                x={c.x}
                y={64}
                textAnchor="middle"
                className="fill-white text-[10px] font-bold pointer-events-none"
              >
                {i + 1}
              </text>
              <text
                x={c.x}
                y={95}
                textAnchor="middle"
                className="fill-zinc-500 text-[9px] dark:fill-zinc-400"
              >
                {c.id.substring(0, 7)}
              </text>
            </g>
          ))}

          {/* HEAD pointer */}
          <g className="transition-all duration-300" style={{ transform: `translateX(${COMMITS[headIdx].x - 80}px)` }}>
            <rect x={60} y={8} width={40} height={20} rx={4} fill="#f59e0b" />
            <text x={80} y={22} textAnchor="middle" className="fill-white text-[10px] font-bold">
              HEAD
            </text>
            <line x1={80} y1={28} x2={80} y2={44} stroke="#f59e0b" strokeWidth={2} />
            <polygon points="76,44 84,44 80,50" fill="#f59e0b" />
          </g>
        </svg>
      </div>

      {/* Current state */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="mb-2 text-xs font-semibold text-amber-700 dark:text-amber-400">
            現在のコミット
          </div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {current.message}
          </p>
          <code className="mt-1 block text-xs text-amber-600 dark:text-amber-400">
            {current.id}
          </code>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            この時点のファイル
          </div>
          <div className="space-y-1">
            {files.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                <svg className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        {headIdx < COMMITS.length - 1
          ? `過去のコミットを見ています。最新（${COMMITS.length}番）をクリックすると現在に戻ります。`
          : "最新のコミットを見ています。過去のコミットをクリックして「タイムトラベル」してみましょう。"}
      </p>
    </div>
  );
}
