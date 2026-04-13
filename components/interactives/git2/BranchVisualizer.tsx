"use client";

import { useState } from "react";

interface CommitNode {
  id: string;
  message: string;
  branch: string;
  x: number;
  y: number;
  parentId?: string;
}

interface BranchInfo {
  name: string;
  color: string;
  lane: number;
}

const BRANCHES: BranchInfo[] = [
  { name: "main", color: "#10b981", lane: 0 },
  { name: "feature", color: "#f59e0b", lane: 1 },
];

const INITIAL_COMMITS: CommitNode[] = [
  { id: "c1", message: "Initial commit", branch: "main", x: 60, y: 200 },
  { id: "c2", message: "READMEを追加", branch: "main", x: 160, y: 200, parentId: "c1" },
  { id: "c3", message: "基本構造を作成", branch: "main", x: 260, y: 200, parentId: "c2" },
];

export default function BranchVisualizer() {
  const [commits, setCommits] = useState<CommitNode[]>(INITIAL_COMMITS);
  const [hasBranch, setHasBranch] = useState(false);
  const [merged, setMerged] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  function createBranch() {
    if (hasBranch) return;
    const branchCommits: CommitNode[] = [
      { id: "f1", message: "ログイン画面を追加", branch: "feature", x: 340, y: 120, parentId: "c3" },
      { id: "f2", message: "バリデーションを実装", branch: "feature", x: 440, y: 120, parentId: "f1" },
    ];
    const mainContinue: CommitNode = {
      id: "c4", message: "バグを修正", branch: "main", x: 380, y: 200, parentId: "c3",
    };
    setCommits((prev) => [...prev, mainContinue, ...branchCommits]);
    setHasBranch(true);
    setStep(1);
  }

  function mergeBranch() {
    if (merged || !hasBranch) return;
    const mergeCommit: CommitNode = {
      id: "m1", message: "featureをmainにマージ", branch: "main", x: 540, y: 200, parentId: "c4",
    };
    setCommits((prev) => [...prev, mergeCommit]);
    setMerged(true);
    setStep(2);
  }

  function reset() {
    setCommits(INITIAL_COMMITS);
    setHasBranch(false);
    setMerged(false);
    setHoveredId(null);
    setStep(0);
  }

  const branchColor = (branch: string) =>
    BRANCHES.find((b) => b.name === branch)?.color ?? "#71717a";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        ブランチの作成とマージを体験
      </h3>

      <div className="mb-4 flex gap-2">
        <button
          onClick={createBranch}
          disabled={hasBranch}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            hasBranch
              ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              : "bg-amber-500 text-white hover:bg-amber-600"
          }`}
        >
          1. ブランチを作成
        </button>
        <button
          onClick={mergeBranch}
          disabled={!hasBranch || merged}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            !hasBranch || merged
              ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          2. マージ
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>

      {/* Branch labels */}
      <div className="mb-2 flex gap-4">
        {BRANCHES.map((b) => (
          <div key={b.name} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{b.name}</span>
          </div>
        ))}
      </div>

      {/* SVG Graph */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
        <svg viewBox="0 0 620 280" className="w-full min-w-[500px]">
          {/* Connection lines */}
          {commits.map((c) => {
            if (!c.parentId) return null;
            const parent = commits.find((p) => p.id === c.parentId);
            if (!parent) return null;
            return (
              <line
                key={`${parent.id}-${c.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={c.x}
                y2={c.y}
                stroke={branchColor(c.branch)}
                strokeWidth={2.5}
                opacity={0.5}
              />
            );
          })}
          {/* Merge line from feature to main */}
          {merged && (
            <line
              x1={440} y1={120}
              x2={540} y2={200}
              stroke="#f59e0b"
              strokeWidth={2.5}
              strokeDasharray="6,3"
              opacity={0.5}
            />
          )}
          {/* Commit circles */}
          {commits.map((c) => (
            <g key={c.id} onMouseEnter={() => setHoveredId(c.id)} onMouseLeave={() => setHoveredId(null)}>
              <circle
                cx={c.x}
                cy={c.y}
                r={hoveredId === c.id ? 14 : 10}
                fill={branchColor(c.branch)}
                stroke="white"
                strokeWidth={2}
                className="cursor-pointer transition-all"
              />
              <text
                x={c.x}
                y={c.y + 30}
                textAnchor="middle"
                className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
              >
                {c.message.length > 14 ? c.message.substring(0, 14) + "..." : c.message}
              </text>
              {hoveredId === c.id && (
                <g>
                  <rect x={c.x - 80} y={c.y - 50} width={160} height={28} rx={6} fill="#18181b" fillOpacity={0.9} />
                  <text x={c.x} y={c.y - 32} textAnchor="middle" className="fill-white text-[11px]">
                    {c.message}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Step explanation */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {step === 0 && "mainブランチに3つのコミットがあります。「ブランチを作成」をクリックして、featureブランチを作ってみましょう。"}
          {step === 1 && "featureブランチ（オレンジ）で新機能を開発中。mainブランチ（緑）でもバグ修正が進んでいます。「マージ」で合流させましょう。"}
          {step === 2 && "マージ完了！featureブランチの変更がmainに統合されました。ブランチを使うと、メインの流れを壊さずに安全に開発できます。"}
        </p>
      </div>
    </div>
  );
}
