"use client";

import { useState } from "react";

interface SearchResult {
  id: number;
  title: string;
  snippet: string;
  initialScore: number;
  rerankScore: number;
  isRelevant: boolean;
}

const QUERY = "リモートワーク中のセキュリティ対策";

const RESULTS: SearchResult[] = [
  {
    id: 1,
    title: "リモートワーク導入ガイド §2.3",
    snippet: "自宅のWi-Fiルーターのファームウェアを最新に保ち、WPA3暗号化を有効にしてください。VPN接続を必須とし...",
    initialScore: 0.82,
    rerankScore: 0.96,
    isRelevant: true,
  },
  {
    id: 2,
    title: "オフィスセキュリティ規程",
    snippet: "入退室管理にはICカードを使用します。来客時はフロントで受付を行い、社員の同伴なしでの移動は...",
    initialScore: 0.79,
    rerankScore: 0.23,
    isRelevant: false,
  },
  {
    id: 3,
    title: "情報セキュリティポリシー §5",
    snippet: "社外での業務時は、画面のぞき見防止フィルターの使用を義務付けます。公共Wi-Fiの使用は禁止...",
    initialScore: 0.76,
    rerankScore: 0.91,
    isRelevant: true,
  },
  {
    id: 4,
    title: "人事制度マニュアル",
    snippet: "リモートワーク制度は週3日まで利用可能です。申請は上長の承認を得た上で、人事部に提出...",
    initialScore: 0.74,
    rerankScore: 0.31,
    isRelevant: false,
  },
  {
    id: 5,
    title: "IT部門FAQ #45",
    snippet: "Q.自宅PCで業務してもいいですか？ A.会社支給のPCのみ使用可能です。BYODは現在認めておらず...",
    initialScore: 0.71,
    rerankScore: 0.88,
    isRelevant: true,
  },
  {
    id: 6,
    title: "通信費精算規程",
    snippet: "リモートワーク時の通信費は月額3,000円を上限に精算可能。申請はKintaiProから...",
    initialScore: 0.69,
    rerankScore: 0.15,
    isRelevant: false,
  },
];

export default function RerankDemo() {
  const [showReranked, setShowReranked] = useState(false);

  const displayResults = showReranked
    ? [...RESULTS].sort((a, b) => b.rerankScore - a.rerankScore)
    : [...RESULTS].sort((a, b) => b.initialScore - a.initialScore);

  const topK = 3;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        リランキング前後の検索結果を比較しましょう
      </h3>

      {/* Query */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-xs font-bold text-zinc-400">検索クエリ</span>
        <p className="mt-0.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {QUERY}
        </p>
      </div>

      {/* Toggle */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setShowReranked(false)}
          className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
            !showReranked
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          ベクトル検索のみ
        </button>
        <button
          onClick={() => setShowReranked(true)}
          className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
            showReranked
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          リランキング後
        </button>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {displayResults.map((result, i) => {
          const score = showReranked
            ? result.rerankScore
            : result.initialScore;
          const isTopK = i < topK;

          return (
            <div
              key={result.id}
              className={`rounded-lg border p-3 transition-all ${
                isTopK
                  ? result.isRelevant
                    ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                    : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
                  : "border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-700 dark:bg-zinc-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        isTopK
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-700"
                      }`}
                    >
                      #{i + 1}
                    </span>
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      {result.title}
                    </span>
                    {result.isRelevant && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                        関連あり
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {result.snippet}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400">スコア</span>
                  <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    {score.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">
            Top-{topK}のうち関連ありの数:
          </span>
          <span className="font-bold text-zinc-700 dark:text-zinc-300">
            {displayResults.slice(0, topK).filter((r) => r.isRelevant).length} / {topK}
            {showReranked
              ? " (リランキング後 — 精度向上!)"
              : " (ベクトル検索のみ)"}
          </span>
        </div>
      </div>
    </div>
  );
}
