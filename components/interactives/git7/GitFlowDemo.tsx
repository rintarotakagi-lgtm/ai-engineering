"use client";

import { useState } from "react";

interface BranchInfo {
  name: string;
  color: string;
  description: string;
  fromBranch: string;
  toBranch: string;
  useCase: string;
}

const branches: BranchInfo[] = [
  {
    name: "main",
    color: "#10b981",
    description: "本番リリース用。タグ（v1.0, v2.0等）をつける。",
    fromBranch: "-",
    toBranch: "-",
    useCase: "本番環境に出ているコード",
  },
  {
    name: "develop",
    color: "#3b82f6",
    description: "開発の統合ブランチ。次のリリースに入る変更が集まる。",
    fromBranch: "main",
    toBranch: "release → main",
    useCase: "日々の開発のベース",
  },
  {
    name: "feature/*",
    color: "#f59e0b",
    description: "新機能の開発用。1機能1ブランチ。",
    fromBranch: "develop",
    toBranch: "develop",
    useCase: "新しい機能を作るとき",
  },
  {
    name: "release/*",
    color: "#8b5cf6",
    description: "リリース準備用。バグ修正・バージョン番号の更新等。",
    fromBranch: "develop",
    toBranch: "main + develop",
    useCase: "リリース前の最終調整",
  },
  {
    name: "hotfix/*",
    color: "#ef4444",
    description: "本番の緊急修正用。mainから直接分岐。",
    fromBranch: "main",
    toBranch: "main + develop",
    useCase: "本番で重大なバグが見つかったとき",
  },
];

export default function GitFlowDemo(): React.ReactElement {
  const [selectedBranch, setSelectedBranch] = useState(0);

  const sel = branches[selectedBranch];
  const w = 480;
  const h = 200;

  // Simple visual layout
  const branchPositions: Record<string, { y: number; x1: number; x2: number }> = {
    main: { y: 30, x1: 30, x2: 450 },
    develop: { y: 70, x1: 60, x2: 450 },
    "feature/*": { y: 110, x1: 120, x2: 280 },
    "release/*": { y: 150, x1: 280, x2: 400 },
    "hotfix/*": { y: 150, x1: 80, x2: 180 },
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto">
          {branches.map((b, i) => {
            const pos = branchPositions[b.name];
            if (!pos) return null;
            const isSelected = i === selectedBranch;
            return (
              <g key={b.name} opacity={isSelected ? 1 : 0.3}>
                <line
                  x1={pos.x1}
                  y1={pos.y}
                  x2={pos.x2}
                  y2={pos.y}
                  stroke={b.color}
                  strokeWidth={isSelected ? 4 : 2}
                />
                <text
                  x={pos.x1 - 5}
                  y={pos.y + 4}
                  textAnchor="end"
                  fill={b.color}
                  fontSize={10}
                  fontWeight="bold"
                >
                  {b.name}
                </text>
                {/* Commits on line */}
                {[0.2, 0.5, 0.8].map((pct, ci) => {
                  const cx = pos.x1 + (pos.x2 - pos.x1) * pct;
                  return (
                    <circle
                      key={ci}
                      cx={cx}
                      cy={pos.y}
                      r={5}
                      fill={b.color}
                      stroke="white"
                      strokeWidth={1.5}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Connection arrows for selected branch */}
          {selectedBranch === 2 && (
            <>
              <line x1="120" y1="70" x2="120" y2="110" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4" />
              <line x1="280" y1="110" x2="280" y2="70" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4" />
            </>
          )}
          {selectedBranch === 3 && (
            <>
              <line x1="280" y1="70" x2="280" y2="150" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4" />
              <line x1="400" y1="150" x2="400" y2="30" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4" />
              <line x1="400" y1="150" x2="420" y2="70" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4" />
            </>
          )}
          {selectedBranch === 4 && (
            <>
              <line x1="80" y1="30" x2="80" y2="150" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4" />
              <line x1="180" y1="150" x2="180" y2="30" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4" />
              <line x1="180" y1="150" x2="200" y2="70" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4" />
            </>
          )}
        </svg>
      </div>

      {/* Branch selector */}
      <div className="flex flex-wrap gap-2">
        {branches.map((b, i) => (
          <button
            key={b.name}
            onClick={() => setSelectedBranch(i)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition border-2 ${
              i === selectedBranch
                ? "text-white"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
            }`}
            style={
              i === selectedBranch
                ? { backgroundColor: b.color, borderColor: b.color }
                : undefined
            }
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Detail card */}
      <div className="bg-zinc-50 rounded-lg p-4 space-y-2">
        <div className="font-bold text-zinc-800" style={{ color: sel.color }}>
          {sel.name}
        </div>
        <div className="text-sm text-zinc-600">{sel.description}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded p-2 border">
            <span className="text-zinc-400">分岐元: </span>
            <span className="font-medium">{sel.fromBranch}</span>
          </div>
          <div className="bg-white rounded p-2 border">
            <span className="text-zinc-400">マージ先: </span>
            <span className="font-medium">{sel.toBranch}</span>
          </div>
        </div>
        <div className="text-xs text-zinc-500">
          <span className="font-medium">使うタイミング:</span> {sel.useCase}
        </div>
      </div>
    </div>
  );
}
