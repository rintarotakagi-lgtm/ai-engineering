"use client";

import { useState } from "react";

type AnimState = "idle" | "pushing" | "pulling" | "done-push" | "done-pull";

export default function GitVsGitHub() {
  const [anim, setAnim] = useState<AnimState>("idle");

  function triggerPush() {
    setAnim("pushing");
    setTimeout(() => setAnim("done-push"), 1200);
  }

  function triggerPull() {
    setAnim("pulling");
    setTimeout(() => setAnim("done-pull"), 1200);
  }

  function reset() {
    setAnim("idle");
  }

  const arrowPushActive = anim === "pushing" || anim === "done-push";
  const arrowPullActive = anim === "pulling" || anim === "done-pull";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        GitとGitHubの関係 -- push と pull でつながる
      </h3>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 600 280" className="w-full min-w-[480px]">
          {/* Local machine box */}
          <rect x={20} y={40} width={220} height={200} rx={12} fill="#eff6ff" stroke="#93c5fd" strokeWidth={2} />
          <text x={130} y={30} textAnchor="middle" className="fill-blue-600 text-sm font-bold">
            あなたのPC（ローカル）
          </text>

          {/* Git icon inside local */}
          <rect x={50} y={80} width={160} height={60} rx={8} fill="white" stroke="#60a5fa" strokeWidth={1.5} />
          <text x={130} y={105} textAnchor="middle" className="fill-blue-700 text-xs font-bold">
            Git
          </text>
          <text x={130} y={125} textAnchor="middle" className="fill-blue-500 text-[10px]">
            バージョン管理ツール
          </text>

          {/* Files inside local */}
          <rect x={50} y={160} width={160} height={50} rx={8} fill="white" stroke="#60a5fa" strokeWidth={1.5} />
          <text x={130} y={185} textAnchor="middle" className="fill-zinc-600 text-[10px]">
            index.html / style.css / app.js
          </text>
          <text x={130} y={200} textAnchor="middle" className="fill-zinc-400 text-[9px]">
            あなたのファイル
          </text>

          {/* GitHub cloud box */}
          <rect x={360} y={40} width={220} height={200} rx={12} fill="#fefce8" stroke="#fcd34d" strokeWidth={2} />
          <text x={470} y={30} textAnchor="middle" className="fill-amber-600 text-sm font-bold">
            GitHub（クラウド）
          </text>

          {/* Repo inside GitHub */}
          <rect x={390} y={80} width={160} height={60} rx={8} fill="white" stroke="#fbbf24" strokeWidth={1.5} />
          <text x={470} y={105} textAnchor="middle" className="fill-amber-700 text-xs font-bold">
            リモートリポジトリ
          </text>
          <text x={470} y={125} textAnchor="middle" className="fill-amber-500 text-[10px]">
            コードをクラウドに保管
          </text>

          {/* Team inside GitHub */}
          <rect x={390} y={160} width={160} height={50} rx={8} fill="white" stroke="#fbbf24" strokeWidth={1.5} />
          <text x={470} y={185} textAnchor="middle" className="fill-zinc-600 text-[10px]">
            チームメンバーがアクセス
          </text>
          <text x={470} y={200} textAnchor="middle" className="fill-zinc-400 text-[9px]">
            共有・レビュー・公開
          </text>

          {/* Push arrow (top) */}
          <line
            x1={240} y1={100} x2={360} y2={100}
            stroke={arrowPushActive ? "#f59e0b" : "#d4d4d8"}
            strokeWidth={arrowPushActive ? 3 : 2}
            strokeDasharray={anim === "pushing" ? "8,4" : "none"}
            className="transition-all"
          >
            {anim === "pushing" && (
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.5s" repeatCount="indefinite" />
            )}
          </line>
          <polygon
            points="355,94 365,100 355,106"
            fill={arrowPushActive ? "#f59e0b" : "#d4d4d8"}
          />
          <text x={300} y={92} textAnchor="middle" className={`text-xs font-bold ${arrowPushActive ? "fill-amber-600" : "fill-zinc-400"}`}>
            git push
          </text>

          {/* Pull arrow (bottom) */}
          <line
            x1={360} y1={180} x2={240} y2={180}
            stroke={arrowPullActive ? "#3b82f6" : "#d4d4d8"}
            strokeWidth={arrowPullActive ? 3 : 2}
            strokeDasharray={anim === "pulling" ? "8,4" : "none"}
            className="transition-all"
          >
            {anim === "pulling" && (
              <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.5s" repeatCount="indefinite" />
            )}
          </line>
          <polygon
            points="245,174 235,180 245,186"
            fill={arrowPullActive ? "#3b82f6" : "#d4d4d8"}
          />
          <text x={300} y={198} textAnchor="middle" className={`text-xs font-bold ${arrowPullActive ? "fill-blue-600" : "fill-zinc-400"}`}>
            git pull
          </text>
        </svg>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={triggerPush}
          disabled={anim === "pushing"}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
        >
          git push を実行
        </button>
        <button
          onClick={triggerPull}
          disabled={anim === "pulling"}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
        >
          git pull を実行
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>

      <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {anim === "idle" && "ボタンをクリックして、push/pull の流れを確認しましょう。"}
        {anim === "pushing" && "ローカルの変更をGitHubにアップロード中..."}
        {anim === "done-push" && "push完了！ローカルの変更がGitHubに反映されました。チームメンバーがあなたの変更を見られます。"}
        {anim === "pulling" && "GitHubの最新変更をダウンロード中..."}
        {anim === "done-pull" && "pull完了！他のメンバーの変更をローカルに取り込みました。"}
      </div>
    </div>
  );
}
