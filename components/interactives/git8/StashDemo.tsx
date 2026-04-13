"use client";

import { useState } from "react";

type Phase = "working" | "stashed" | "switched" | "popped";

interface FileState {
  name: string;
  content: string;
  modified: boolean;
}

export default function StashDemo(): React.ReactElement {
  const [phase, setPhase] = useState<Phase>("working");
  const [branch, setBranch] = useState("feature/new-login");

  const phases: Record<Phase, { files: FileState[]; stash: string[]; description: string }> = {
    working: {
      files: [
        { name: "login.js", content: "// ログイン機能を実装中...", modified: true },
        { name: "style.css", content: "/* 新しいスタイル */", modified: true },
      ],
      stash: [],
      description: "feature/new-login ブランチでログイン機能を開発中。まだ途中です。",
    },
    stashed: {
      files: [
        { name: "login.js", content: "// 元のコード", modified: false },
        { name: "style.css", content: "/* 元のスタイル */", modified: false },
      ],
      stash: ["stash@{0}: WIP on feature/new-login"],
      description: "git stash で変更を退避。作業ディレクトリがきれいになりました。",
    },
    switched: {
      files: [
        { name: "header.js", content: "// ヘッダーのバグを修正", modified: true },
      ],
      stash: ["stash@{0}: WIP on feature/new-login"],
      description: "fix/header-bug ブランチに切り替えて、緊急修正を完了。",
    },
    popped: {
      files: [
        { name: "login.js", content: "// ログイン機能を実装中...", modified: true },
        { name: "style.css", content: "/* 新しいスタイル */", modified: true },
      ],
      stash: [],
      description: "feature/new-login に戻って git stash pop。退避した変更が復元されました！",
    },
  };

  const current = phases[phase];

  const phaseOrder: Phase[] = ["working", "stashed", "switched", "popped"];
  const phaseLabels = ["作業中", "stash実行", "ブランチ切替", "stash pop"];
  const phaseCommands = [
    "",
    "$ git stash",
    "$ git checkout fix/header-bug",
    "$ git checkout feature/new-login\n$ git stash pop",
  ];
  const currentIdx = phaseOrder.indexOf(phase);

  function advance(): void {
    const nextIdx = currentIdx + 1;
    if (nextIdx < phaseOrder.length) {
      setPhase(phaseOrder[nextIdx]);
      if (nextIdx === 2) setBranch("fix/header-bug");
      else if (nextIdx === 3) setBranch("feature/new-login");
    }
  }

  function goBack(): void {
    const prevIdx = currentIdx - 1;
    if (prevIdx >= 0) {
      setPhase(phaseOrder[prevIdx]);
      if (prevIdx <= 1) setBranch("feature/new-login");
      else if (prevIdx === 2) setBranch("fix/header-bug");
    }
  }

  function reset(): void {
    setPhase("working");
    setBranch("feature/new-login");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      {/* Branch indicator */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">現在のブランチ:</span>
        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-mono font-medium">
          {branch}
        </span>
      </div>

      {/* Visual: desk and drawer metaphor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Desk (working directory) */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
          <div className="text-xs font-bold text-zinc-500 mb-2">
            机の上（作業ディレクトリ）
          </div>
          {current.files.map((f, i) => (
            <div
              key={i}
              className={`text-xs font-mono p-1.5 rounded mb-1 ${
                f.modified
                  ? "bg-amber-50 border border-amber-200 text-amber-800"
                  : "bg-white border border-zinc-200 text-zinc-500"
              }`}
            >
              {f.modified && <span className="text-amber-500 mr-1">M</span>}
              {f.name}: {f.content}
            </div>
          ))}
        </div>

        {/* Drawer (stash) */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3">
          <div className="text-xs font-bold text-zinc-500 mb-2">
            引き出し（stash）
          </div>
          {current.stash.length > 0 ? (
            current.stash.map((s, i) => (
              <div
                key={i}
                className="text-xs font-mono p-1.5 rounded mb-1 bg-purple-50 border border-purple-200 text-purple-700"
              >
                {s}
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-400 italic">空</div>
          )}
        </div>
      </div>

      {/* Command display */}
      {phaseCommands[currentIdx] && (
        <div className="bg-zinc-900 rounded-lg px-4 py-2 font-mono text-amber-400 text-sm whitespace-pre-line">
          {phaseCommands[currentIdx]}
        </div>
      )}

      {/* Description */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        {current.description}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1">
        {phaseLabels.map((label, i) => (
          <div key={i} className="flex items-center gap-1 flex-1">
            <div
              className={`text-center flex-1 py-1 rounded text-xs font-medium ${
                i === currentIdx
                  ? "bg-amber-500 text-white"
                  : i < currentIdx
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {label}
            </div>
            {i < phaseLabels.length - 1 && (
              <span className="text-zinc-300 text-xs">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={goBack}
          disabled={currentIdx === 0}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 disabled:opacity-40"
        >
          戻る
        </button>
        {currentIdx < phaseOrder.length - 1 ? (
          <button
            onClick={advance}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600"
          >
            次へ
          </button>
        ) : (
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200"
          >
            最初から
          </button>
        )}
      </div>
    </div>
  );
}
