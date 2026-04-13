"use client";

import { useState } from "react";

interface Commit {
  id: string;
  message: string;
  branch: string;
}

interface BranchData {
  name: string;
  color: string;
  files: Record<string, string>;
}

export default function BranchSwitch(): React.ReactElement {
  const [branches, setBranches] = useState<BranchData[]>([
    {
      name: "main",
      color: "#10b981",
      files: { "index.html": "<h1>トップページ</h1>", "style.css": "body { color: black; }" },
    },
  ]);
  const [currentBranch, setCurrentBranch] = useState("main");
  const [commits, setCommits] = useState<Commit[]>([
    { id: "c1", message: "初期コミット", branch: "main" },
  ]);
  const [newBranchName, setNewBranchName] = useState("");
  const [message, setMessage] = useState("mainブランチにいます");

  const current = branches.find((b) => b.name === currentBranch)!;

  function createBranch(): void {
    const name = newBranchName.trim();
    if (!name || branches.some((b) => b.name === name)) {
      setMessage("ブランチ名が空か、既に存在します");
      return;
    }
    const base = branches.find((b) => b.name === currentBranch)!;
    setBranches([
      ...branches,
      { name, color: "#f59e0b", files: { ...base.files } },
    ]);
    setCurrentBranch(name);
    setNewBranchName("");
    setMessage(`ブランチ「${name}」を作成して切り替えました（git checkout -b ${name}）`);
  }

  function switchBranch(name: string): void {
    setCurrentBranch(name);
    setMessage(`ブランチ「${name}」に切り替えました（git checkout ${name}）`);
  }

  function editFile(fileName: string, content: string): void {
    setBranches(
      branches.map((b) =>
        b.name === currentBranch
          ? { ...b, files: { ...b.files, [fileName]: content } }
          : b
      )
    );
  }

  function makeCommit(): void {
    const newCommit: Commit = {
      id: `c${commits.length + 1}`,
      message: `${currentBranch}で変更`,
      branch: currentBranch,
    };
    setCommits([...commits, newCommit]);
    setMessage(`コミットしました: "${newCommit.message}"`);
  }

  // SVG commit graph
  const graphWidth = 500;
  const graphHeight = 160;
  const branchNames = branches.map((b) => b.name);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      {/* Commit graph */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${graphWidth} ${graphHeight}`}
          className="w-full max-w-lg mx-auto"
        >
          {branchNames.map((bName, bi) => {
            const y = 40 + bi * 50;
            const branchCommits = commits.filter((c) => c.branch === bName);
            const branch = branches.find((b) => b.name === bName)!;
            return (
              <g key={bName}>
                {/* Branch line */}
                <line
                  x1={60}
                  y1={y}
                  x2={60 + branchCommits.length * 60}
                  y2={y}
                  stroke={branch.color}
                  strokeWidth={3}
                />
                {/* Branch label */}
                <text
                  x={10}
                  y={y + 5}
                  fill={branch.color}
                  fontSize={12}
                  fontWeight="bold"
                >
                  {bName}
                </text>
                {/* Commits */}
                {branchCommits.map((c, ci) => (
                  <g key={c.id}>
                    <circle
                      cx={60 + ci * 60}
                      cy={y}
                      r={10}
                      fill={branch.color}
                      stroke="white"
                      strokeWidth={2}
                    />
                    <text
                      x={60 + ci * 60}
                      y={y + 25}
                      textAnchor="middle"
                      fill="#71717a"
                      fontSize={9}
                    >
                      {c.message.slice(0, 8)}
                    </text>
                  </g>
                ))}
                {/* HEAD indicator */}
                {bName === currentBranch && (
                  <text
                    x={60 + Math.max(0, branchCommits.length - 1) * 60}
                    y={y - 16}
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize={10}
                    fontWeight="bold"
                  >
                    HEAD
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Status message */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        {message}
      </div>

      {/* Branch tabs */}
      <div className="flex gap-2 flex-wrap">
        {branches.map((b) => (
          <button
            key={b.name}
            onClick={() => switchBranch(b.name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              currentBranch === b.name
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Create branch */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newBranchName}
          onChange={(e) => setNewBranchName(e.target.value)}
          placeholder="新しいブランチ名..."
          className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm"
          onKeyDown={(e) => e.key === "Enter" && createBranch()}
        />
        <button
          onClick={createBranch}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
        >
          ブランチ作成
        </button>
      </div>

      {/* File editor */}
      <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
        <div className="text-zinc-400 text-xs">
          ブランチ: {currentBranch} のファイル
        </div>
        {Object.entries(current.files).map(([name, content]) => (
          <div key={name}>
            <div className="text-amber-400 text-sm mb-1">📄 {name}</div>
            <input
              type="text"
              value={content}
              onChange={(e) => editFile(name, e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded text-sm font-mono border border-zinc-700"
            />
          </div>
        ))}
      </div>

      <button
        onClick={makeCommit}
        className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700"
      >
        コミットする
      </button>
    </div>
  );
}
