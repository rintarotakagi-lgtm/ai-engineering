"use client";

import { useState } from "react";

interface Snapshot {
  id: number;
  label: string;
  date: string;
  content: string;
  changes: string;
}

const SNAPSHOTS: Snapshot[] = [
  {
    id: 1,
    label: "初版作成",
    date: "4/1 10:00",
    content: "# 企画書\n\n## 概要\nAI活用による業務効率化プロジェクト",
    changes: "新規作成",
  },
  {
    id: 2,
    label: "目的を追加",
    date: "4/1 14:30",
    content:
      "# 企画書\n\n## 概要\nAI活用による業務効率化プロジェクト\n\n## 目的\n社内の定型業務を自動化し、\n月40時間の工数削減を目指す",
    changes: "「目的」セクションを追加",
  },
  {
    id: 3,
    label: "スケジュール追加",
    date: "4/2 11:00",
    content:
      "# 企画書\n\n## 概要\nAI活用による業務効率化プロジェクト\n\n## 目的\n社内の定型業務を自動化し、\n月40時間の工数削減を目指す\n\n## スケジュール\n4月: 要件定義\n5月: 開発\n6月: テスト・導入",
    changes: "「スケジュール」セクションを追加",
  },
  {
    id: 4,
    label: "予算を修正",
    date: "4/3 09:00",
    content:
      "# 企画書\n\n## 概要\nAI活用による業務効率化プロジェクト\n\n## 目的\n社内の定型業務を自動化し、\n月40時間の工数削減を目指す\n\n## スケジュール\n4月: 要件定義\n5月: 開発\n6月: テスト・導入\n\n## 予算\n初期費用: 200万円\n月額運用: 5万円",
    changes: "「予算」セクションを追加",
  },
  {
    id: 5,
    label: "レビュー反映",
    date: "4/3 16:00",
    content:
      "# 企画書 v2\n\n## 概要\nAI活用による業務効率化プロジェクト\n（対象: カスタマーサポート部門）\n\n## 目的\n社内の定型業務を自動化し、\n月40時間の工数削減を目指す\n\n## スケジュール\n4月: 要件定義・PoC\n5月: 開発・テスト\n6月: 段階的導入\n\n## 予算\n初期費用: 150万円（見直し済）\n月額運用: 5万円",
    changes: "タイトル変更、対象部門追記、スケジュール・予算修正",
  },
];

export default function VersionTimeline() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        セーブポイントをクリックして、過去のファイル内容を確認しましょう
      </h3>

      {/* Timeline */}
      <div className="relative mb-6">
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-zinc-200 dark:bg-zinc-700" />
        <div className="relative flex justify-between">
          {SNAPSHOTS.map((snap, i) => (
            <button
              key={snap.id}
              onClick={() => setSelected(i)}
              className="group flex flex-col items-center"
            >
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  i === selected
                    ? "border-amber-500 bg-amber-500 text-white"
                    : i < selected
                      ? "border-amber-300 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                      : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800"
                } group-hover:scale-110`}
              >
                <span className="text-xs font-bold">{snap.id}</span>
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  i === selected
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {snap.label}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {snap.date}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content display */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              ファイル内容
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-700 dark:text-zinc-300">
            {SNAPSHOTS[selected].content}
          </pre>
        </div>
        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              変更内容
            </span>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
              {SNAPSHOTS[selected].changes}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              ポイント
            </span>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              {selected === 0
                ? "最初のセーブポイント。ここからいつでもやり直せます。"
                : selected === SNAPSHOTS.length - 1
                  ? "最新の状態。過去のどのポイントにも戻れます！"
                  : `${SNAPSHOTS.length - selected - 1}つ先の変更がありますが、ここに戻ることもできます。`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
