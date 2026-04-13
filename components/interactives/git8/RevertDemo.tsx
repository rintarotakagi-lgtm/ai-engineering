"use client";

import { useState } from "react";

interface Commit {
  id: string;
  message: string;
  reverted: boolean;
}

export default function RevertDemo(): React.ReactElement {
  const [commits, setCommits] = useState<Commit[]>([
    { id: "a1b2c3", message: "初期コミット", reverted: false },
    { id: "d4e5f6", message: "ヘッダー変更", reverted: false },
    { id: "g7h8i9", message: "バグのあるコード追加", reverted: false },
    { id: "j0k1l2", message: "フッター更新", reverted: false },
  ]);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  function revertCommit(): void {
    if (!selectedCommit) return;
    const target = commits.find((c) => c.id === selectedCommit);
    if (!target) return;

    setCommits([
      ...commits.map((c) =>
        c.id === selectedCommit ? { ...c, reverted: true } : c
      ),
      {
        id: `rv${selectedCommit.slice(0, 4)}`,
        message: `Revert "${target.message}"`,
        reverted: false,
      },
    ]);
    setShowResult(true);
  }

  function reset(): void {
    setCommits([
      { id: "a1b2c3", message: "初期コミット", reverted: false },
      { id: "d4e5f6", message: "ヘッダー変更", reverted: false },
      { id: "g7h8i9", message: "バグのあるコード追加", reverted: false },
      { id: "j0k1l2", message: "フッター更新", reverted: false },
    ]);
    setSelectedCommit(null);
    setShowResult(false);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500">
        取り消したいコミットをクリックして、revertを実行してみましょう。
      </div>

      {/* Commit log */}
      <div className="bg-zinc-900 rounded-lg p-4 space-y-1">
        <div className="text-zinc-400 text-xs mb-2 font-mono">$ git log --oneline</div>
        {[...commits].reverse().map((c) => (
          <button
            key={c.id}
            onClick={() => {
              if (!showResult && !c.id.startsWith("rv")) {
                setSelectedCommit(c.id);
              }
            }}
            disabled={showResult || c.id.startsWith("rv")}
            className={`w-full text-left font-mono text-sm px-3 py-1.5 rounded transition ${
              c.reverted
                ? "bg-red-900/30 text-red-400 line-through"
                : c.id === selectedCommit
                  ? "bg-amber-900/40 text-amber-300 ring-1 ring-amber-500"
                  : c.id.startsWith("rv")
                    ? "bg-emerald-900/30 text-emerald-400"
                    : "text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            <span className="text-zinc-500">{c.id.slice(0, 7)}</span>{" "}
            {c.message}
          </button>
        ))}
      </div>

      {/* Comparison: reset vs revert */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="font-bold text-red-700 mb-1">git reset（履歴を消す）</div>
          <div className="text-red-600">
            コミットを歴史から削除する。push済みだと他の人と矛盾が生じる。
          </div>
          <div className="font-mono mt-1 text-red-500">A → B → C → D → &#10060; Cを削除</div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="font-bold text-emerald-700 mb-1">git revert（打ち消す）</div>
          <div className="text-emerald-600">
            打ち消しコミットを追加する。履歴は安全に保たれる。
          </div>
          <div className="font-mono mt-1 text-emerald-500">A → B → C → D → E(Revert C)</div>
        </div>
      </div>

      {selectedCommit && !showResult && (
        <div className="flex items-center gap-3">
          <div className="bg-zinc-900 rounded-lg px-4 py-2 font-mono text-amber-400 text-sm flex-1">
            $ git revert {selectedCommit.slice(0, 7)}
          </div>
          <button
            onClick={revertCommit}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 whitespace-nowrap"
          >
            実行
          </button>
        </div>
      )}

      {showResult && (
        <>
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-sm text-emerald-800">
            <strong>revert成功！</strong> 新しいコミットが追加されました。元のコミットは履歴に残っていますが、その変更は打ち消されました。
          </div>
          <button
            onClick={reset}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
          >
            最初から
          </button>
        </>
      )}
    </div>
  );
}
