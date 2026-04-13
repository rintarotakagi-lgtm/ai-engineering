"use client";

import { useState } from "react";

interface DecisionNode {
  id: string;
  question: string;
  options: { label: string; next: string }[];
}

interface ResultNode {
  id: string;
  command: string;
  description: string;
  warning?: string;
}

const decisions: Record<string, DecisionNode> = {
  start: {
    id: "start",
    question: "何をやり直したいですか？",
    options: [
      { label: "まだコミットしていない変更を取り消したい", next: "uncommitted" },
      { label: "コミットをやり直したい", next: "committed" },
      { label: "作業を一時退避したい", next: "result-stash" },
      { label: "ファイルをGit管理から外したい", next: "result-gitignore" },
    ],
  },
  uncommitted: {
    id: "uncommitted",
    question: "ステージング（git add）済みですか？",
    options: [
      { label: "はい（git add済み）", next: "result-unstage" },
      { label: "いいえ（まだaddしていない）", next: "result-restore" },
    ],
  },
  committed: {
    id: "committed",
    question: "そのコミットはpush済みですか？",
    options: [
      { label: "いいえ（ローカルのみ）", next: "result-reset" },
      { label: "はい（pushして共有済み）", next: "result-revert" },
    ],
  },
};

const results: Record<string, ResultNode> = {
  "result-stash": {
    id: "result-stash",
    command: "git stash",
    description: "今の変更を一時的に退避します。git stash pop で戻せます。",
  },
  "result-gitignore": {
    id: "result-gitignore",
    command: ".gitignore に追記",
    description: "管理対象外にしたいファイルパターンを .gitignore に書きます。",
  },
  "result-unstage": {
    id: "result-unstage",
    command: "git restore --staged ファイル名",
    description: "ステージングを解除します。ファイルの変更内容はそのまま残ります。",
  },
  "result-restore": {
    id: "result-restore",
    command: "git restore ファイル名",
    description: "ファイルを最後のコミットの状態に戻します。",
    warning: "変更内容が完全に失われます。元に戻せません。",
  },
  "result-reset": {
    id: "result-reset",
    command: "git reset HEAD~1",
    description: "直前のコミットを取り消します。--soft / --mixed / --hard でモードを選択。",
  },
  "result-revert": {
    id: "result-revert",
    command: "git revert コミットID",
    description: "指定したコミットを打ち消す新しいコミットを作成します。履歴は安全に保たれます。",
  },
};

export default function UndoMap(): React.ReactElement {
  const [path, setPath] = useState<string[]>(["start"]);

  const currentId = path[path.length - 1];
  const isResult = currentId.startsWith("result-");

  function choose(next: string): void {
    setPath([...path, next]);
  }

  function goBack(): void {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  }

  function reset(): void {
    setPath(["start"]);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-zinc-400 flex-wrap">
        {path.map((id, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span>→</span>}
            <span
              className={
                i === path.length - 1 ? "text-amber-600 font-medium" : ""
              }
            >
              {id === "start"
                ? "開始"
                : decisions[id]
                  ? decisions[id].question.slice(0, 15) + "..."
                  : results[id]?.command.slice(0, 15) + "..."}
            </span>
          </span>
        ))}
      </div>

      {!isResult && decisions[currentId] && (
        <div>
          <div className="font-bold text-zinc-800 text-lg mb-3">
            {decisions[currentId].question}
          </div>
          <div className="space-y-2">
            {decisions[currentId].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => choose(opt.next)}
                className="w-full text-left px-4 py-3 rounded-lg border border-zinc-200 hover:border-amber-400 hover:bg-amber-50 transition text-sm"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isResult && results[currentId] && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
          <div className="font-bold text-emerald-800 text-lg">
            使うコマンド:
          </div>
          <div className="bg-zinc-900 rounded-lg px-4 py-3 font-mono text-amber-400 text-sm">
            $ {results[currentId].command}
          </div>
          <div className="text-sm text-emerald-700">
            {results[currentId].description}
          </div>
          {results[currentId].warning && (
            <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
              <strong>注意:</strong> {results[currentId].warning}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        {path.length > 1 && (
          <button
            onClick={goBack}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
          >
            戻る
          </button>
        )}
        {isResult && (
          <button
            onClick={reset}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
          >
            最初から
          </button>
        )}
      </div>
    </div>
  );
}
