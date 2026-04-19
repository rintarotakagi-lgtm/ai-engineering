"use client";

import { useState } from "react";

interface CheckItem {
  id: string;
  title: string;
  detail: string;
  category: string;
}

const CHECKLIST: CheckItem[] = [
  {
    id: "logging",
    title: "ログ記録",
    detail:
      "全てのツール呼び出し・LLM応答・エラーをログに記録する。実行トレースの再現に必要。構造化ログ（JSON形式）を推奨。",
    category: "可観測性",
  },
  {
    id: "monitoring",
    title: "モニタリング",
    detail:
      "エージェントの稼働状況をリアルタイムで監視する。重要メトリクス: 成功率、平均ステップ数、平均レイテンシ、エラー率。閾値超過でアラート。",
    category: "可観測性",
  },
  {
    id: "rate-limits",
    title: "レート制限",
    detail:
      "API呼び出しのレート制限を設定。ユーザーあたり・時間あたりのリクエスト数を制限。429エラー時の指数バックオフを実装。",
    category: "制御",
  },
  {
    id: "cost-controls",
    title: "コスト管理",
    detail:
      "1セッションあたりのトークン上限を設定。日次・月次の予算アラート。コストが閾値を超えたらエージェントを自動停止。",
    category: "制御",
  },
  {
    id: "max-iterations",
    title: "最大反復回数",
    detail:
      "エージェントループの最大反復回数を設定（例: 25回）。無限ループ防止の基本。タスクの複雑さに応じて調整。",
    category: "制御",
  },
  {
    id: "sandbox",
    title: "サンドボックス",
    detail:
      "エージェントのコード実行をサンドボックス環境（Docker, VM, gVisor等）で行う。ホストシステムへのアクセスを制限。",
    category: "安全性",
  },
  {
    id: "permissions",
    title: "権限の最小化",
    detail:
      "allowed_toolsで必要最小限のツールだけ許可する。ファイルアクセスはプロジェクトディレクトリに限定。ネットワークアクセスも制限。",
    category: "安全性",
  },
  {
    id: "pii",
    title: "個人情報の保護",
    detail:
      "ログやトレースに個人情報が含まれないよう自動マスキングを実装。パスワード・APIキー・メールアドレスを検出してマスク。",
    category: "安全性",
  },
  {
    id: "retry",
    title: "リトライ戦略",
    detail:
      "一時的エラーは指数バックオフで自動リトライ。永続的エラーは人間にエスカレーション。リトライ回数の上限を設定。",
    category: "耐障害性",
  },
  {
    id: "session-persist",
    title: "セッション永続化",
    detail:
      "セッション状態をDB/ファイルに永続化。プロセスの再起動やクラッシュからの復旧が可能。チェックポイントの自動保存。",
    category: "耐障害性",
  },
  {
    id: "graceful",
    title: "グレースフルデグラデーション",
    detail:
      "ツールが利用不可の場合の代替手段を用意。例: Web検索が失敗 → 手持ちの知識で回答。完全な失敗より部分的な成功を目指す。",
    category: "耐障害性",
  },
  {
    id: "testing",
    title: "テスト",
    detail:
      "エージェントの動作を自動テスト。ユニットテスト（個々のツール）、統合テスト（ループ全体）、回帰テスト（既知の問題パターン）。eval（評価ベンチマーク）の定期実行。",
    category: "品質",
  },
];

const CATEGORIES = [...new Set(CHECKLIST.map((c) => c.category))];

const CATEGORY_COLORS: Record<string, string> = {
  可観測性: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20",
  制御: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20",
  安全性: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20",
  耐障害性: "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20",
  品質: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20",
};

export default function ProductionChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleCheck(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const progress = Math.round((checked.size / CHECKLIST.length) * 100);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          本番運用チェックリスト
        </h3>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {checked.size}/{CHECKLIST.length} 項目
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 text-right text-[10px] text-zinc-400 dark:text-zinc-500">
          {progress}%
        </div>
      </div>

      {/* Checklist by category */}
      {CATEGORIES.map((category) => {
        const items = CHECKLIST.filter((c) => c.category === category);
        const catColors = CATEGORY_COLORS[category] ?? "text-zinc-600 bg-zinc-50";
        return (
          <div key={category} className="mb-4">
            <div
              className={`mb-2 inline-block rounded px-2 py-0.5 text-[10px] font-bold ${catColors}`}
            >
              {category}
            </div>
            <div className="space-y-1">
              {items.map((item) => {
                const isChecked = checked.has(item.id);
                const isExpanded = expandedId === item.id;
                return (
                  <div key={item.id}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCheck(item.id)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-all ${
                          isChecked
                            ? "border-amber-500 bg-amber-500"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : item.id)
                        }
                        className={`flex-1 text-left text-xs transition-all ${
                          isChecked
                            ? "text-zinc-400 line-through dark:text-zinc-500"
                            : "text-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        {item.title}
                      </button>
                      <svg
                        className={`h-3 w-3 shrink-0 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {isExpanded && (
                      <div className="ml-7 mt-1 rounded bg-zinc-50 p-2 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {item.detail}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {progress === 100 && (
        <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3 text-center text-xs text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          全項目をチェック完了！本番環境へのデプロイ準備ができています。
        </div>
      )}
    </div>
  );
}
