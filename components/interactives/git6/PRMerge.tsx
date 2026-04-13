"use client";

import { useState } from "react";

type Phase = "ready" | "merging" | "cleanup" | "done";

export default function PRMerge(): React.ReactElement {
  const [phase, setPhase] = useState<Phase>("ready");
  const [mergeMethod, setMergeMethod] = useState<"merge" | "squash" | "rebase">("merge");

  const methods = {
    merge: {
      label: "Create a merge commit",
      description: "すべてのコミット履歴を保持してマージコミットを作成",
    },
    squash: {
      label: "Squash and merge",
      description: "複数コミットを1つにまとめてマージ（履歴がきれいに）",
    },
    rebase: {
      label: "Rebase and merge",
      description: "コミットをmainの先頭に移動（直線的な履歴に）",
    },
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      {phase === "ready" && (
        <>
          <div className="border border-zinc-200 rounded-lg overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-3 flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
              <span className="font-bold text-zinc-800">ログイン機能の改善</span>
              <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                Approved
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-sm text-zinc-600">
                レビューが承認されました。マージ方法を選んでマージしましょう。
              </div>

              {/* Merge method selector */}
              <div className="space-y-2">
                {(Object.keys(methods) as Array<keyof typeof methods>).map((key) => (
                  <label
                    key={key}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition ${
                      mergeMethod === key
                        ? "bg-amber-50 border-2 border-amber-300"
                        : "bg-zinc-50 border border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="merge-method"
                      checked={mergeMethod === key}
                      onChange={() => setMergeMethod(key)}
                      className="mt-1 accent-amber-500"
                    />
                    <div>
                      <div className="font-medium text-sm text-zinc-800">
                        {methods[key].label}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {methods[key].description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase("merging")}
            className="w-full px-4 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600"
          >
            Merge pull request
          </button>
        </>
      )}

      {phase === "merging" && (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-purple-800 mb-1">
              マージ完了！
            </div>
            <div className="text-sm text-purple-600">
              {methods[mergeMethod].label} でmainにマージされました。
            </div>
          </div>

          {/* Visual merge result */}
          <div className="overflow-x-auto">
            <svg viewBox="0 0 400 100" className="w-full max-w-sm mx-auto">
              <line x1="40" y1="30" x2="300" y2="30" stroke="#10b981" strokeWidth={3} />
              <line x1="120" y1="30" x2="160" y2="70" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4" />
              <line x1="160" y1="70" x2="240" y2="70" stroke="#f59e0b" strokeWidth={3} />
              <line x1="240" y1="70" x2="280" y2="30" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4" />
              {[60, 120, 200, 280].map((x, i) => (
                <circle key={i} cx={x} cy={30} r={8} fill="#10b981" stroke="white" strokeWidth={2} />
              ))}
              {[160, 200, 240].map((x, i) => (
                <circle key={i} cx={x} cy={70} r={8} fill="#f59e0b" stroke="white" strokeWidth={2} />
              ))}
              <circle cx={280} cy={30} r={10} fill="#8b5cf6" stroke="white" strokeWidth={2} />
              <text x={20} y={14} fill="#10b981" fontSize={10} fontWeight="bold">main</text>
              <text x={140} y={90} fill="#f59e0b" fontSize={10} fontWeight="bold">feature</text>
            </svg>
          </div>

          <div className="text-sm text-zinc-600">
            次に、不要になったブランチを削除しましょう。
          </div>

          <button
            onClick={() => setPhase("cleanup")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            Delete branch
          </button>
        </>
      )}

      {phase === "cleanup" && (
        <>
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
            <div className="font-bold text-zinc-800 mb-2">クリーンアップ完了</div>
            <div className="space-y-2 text-sm text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">&#10003;</span>
                <span>featureブランチを削除しました</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">&#9671;</span>
                <span>ローカルで <code className="bg-zinc-200 px-1 rounded text-xs">git pull</code> を実行してmainを最新にしましょう</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">&#9671;</span>
                <span>ローカルの不要ブランチも <code className="bg-zinc-200 px-1 rounded text-xs">git branch -d feature</code> で削除</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase("done")}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
          >
            git pull を実行
          </button>
        </>
      )}

      {phase === "done" && (
        <>
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">&#10003;</div>
            <div className="font-bold text-emerald-800">PR完了！</div>
            <div className="text-sm text-emerald-600 mt-1">
              ブランチ作成 → 開発 → PR → レビュー → マージ → クリーンアップ
              <br />
              これがチーム開発の基本サイクルです。
            </div>
          </div>
          <button
            onClick={() => {
              setPhase("ready");
              setMergeMethod("merge");
            }}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
          >
            もう一度やる
          </button>
        </>
      )}
    </div>
  );
}
