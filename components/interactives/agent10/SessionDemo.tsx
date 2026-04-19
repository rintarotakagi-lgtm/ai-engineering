"use client";

import { useState } from "react";

type EventType = "user" | "assistant" | "tool_use" | "tool_result" | "error" | "resume";

interface SessionEvent {
  id: number;
  type: EventType;
  timestamp: string;
  summary: string;
  detail: string;
}

const SESSION_EVENTS: SessionEvent[] = [
  {
    id: 1,
    type: "user",
    timestamp: "14:30:01",
    summary: "ユーザーメッセージ",
    detail: "「テストカバレッジを80%以上にして」",
  },
  {
    id: 2,
    type: "assistant",
    timestamp: "14:30:03",
    summary: "エージェント思考",
    detail:
      "まず現在のカバレッジを確認し、カバーされていないファイルを特定します。npm test -- --coverage を実行します。",
  },
  {
    id: 3,
    type: "tool_use",
    timestamp: "14:30:04",
    summary: "Bash 実行",
    detail: 'command: "npm test -- --coverage"',
  },
  {
    id: 4,
    type: "tool_result",
    timestamp: "14:30:12",
    summary: "Bash 結果",
    detail:
      "Coverage: 62%. Uncovered: src/utils.ts (23%), src/handler.ts (45%)",
  },
  {
    id: 5,
    type: "assistant",
    timestamp: "14:30:14",
    summary: "エージェント思考",
    detail:
      "カバレッジ62%で目標80%に届いていません。utils.tsとhandler.tsが低いので、これらのテストを追加します。まずutils.tsを読んで関数を確認します。",
  },
  {
    id: 6,
    type: "tool_use",
    timestamp: "14:30:15",
    summary: "Read 実行",
    detail: 'file_path: "src/utils.ts"',
  },
  {
    id: 7,
    type: "tool_result",
    timestamp: "14:30:15",
    summary: "Read 結果",
    detail:
      "4つの関数を確認: formatDate, parseJSON, validateEmail, generateId",
  },
  {
    id: 8,
    type: "error",
    timestamp: "14:30:16",
    summary: "接続エラー",
    detail:
      "ネットワーク接続が中断されました。セッションを保存して中断します。",
  },
  {
    id: 9,
    type: "resume",
    timestamp: "14:45:30",
    summary: "セッション再開",
    detail:
      "15分後にセッションを再開。直前のコンテキスト（カバレッジ62%、utils.tsの4関数を確認済み）から続行します。",
  },
  {
    id: 10,
    type: "tool_use",
    timestamp: "14:45:32",
    summary: "Write 実行",
    detail:
      'file_path: "src/__tests__/utils.test.ts" — 4関数のテストケースを作成',
  },
  {
    id: 11,
    type: "tool_result",
    timestamp: "14:45:33",
    summary: "Write 結果",
    detail: "File created successfully at: src/__tests__/utils.test.ts",
  },
  {
    id: 12,
    type: "tool_use",
    timestamp: "14:45:40",
    summary: "Bash 実行",
    detail: 'command: "npm test -- --coverage"',
  },
  {
    id: 13,
    type: "tool_result",
    timestamp: "14:45:48",
    summary: "Bash 結果",
    detail: "Coverage: 81%. All tests passed (24/24).",
  },
  {
    id: 14,
    type: "assistant",
    timestamp: "14:45:50",
    summary: "タスク完了",
    detail:
      "テストカバレッジが81%に到達しました（目標: 80%以上）。utils.tsのテストを追加し、全24テストが合格しています。",
  },
];

const TYPE_CONFIG: Record<EventType, { label: string; color: string; bg: string }> = {
  user: {
    label: "User",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  assistant: {
    label: "Agent",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
  },
  tool_use: {
    label: "Tool",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  tool_result: {
    label: "Result",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
  },
  error: {
    label: "Error",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
  resume: {
    label: "Resume",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
  },
};

export default function SessionDemo() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<EventType | "all">("all");

  const filtered =
    filter === "all"
      ? SESSION_EVENTS
      : SESSION_EVENTS.filter((e) => e.type === filter);

  const allTypes: EventType[] = [
    "user",
    "assistant",
    "tool_use",
    "tool_result",
    "error",
    "resume",
  ];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        セッションのイベントログ
      </h3>

      {/* Filter */}
      <div className="mb-4 flex flex-wrap gap-1">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
            filter === "all"
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          全て ({SESSION_EVENTS.length})
        </button>
        {allTypes.map((t) => {
          const config = TYPE_CONFIG[t];
          const count = SESSION_EVENTS.filter((e) => e.type === t).length;
          if (count === 0) return null;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-all ${
                filter === t
                  ? "bg-amber-500 text-white"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Event list */}
      <div className="max-h-96 space-y-1 overflow-y-auto">
        {filtered.map((event) => {
          const config = TYPE_CONFIG[event.type];
          const isOpen = expandedId === event.id;
          return (
            <button
              key={event.id}
              onClick={() => setExpandedId(isOpen ? null : event.id)}
              className={`flex w-full items-start gap-3 rounded-lg border p-2.5 text-left transition-all ${
                isOpen
                  ? `border-amber-300 ${config.bg}`
                  : "border-zinc-100 hover:border-zinc-200 dark:border-zinc-800 dark:hover:border-zinc-700"
              }`}
            >
              {/* Timestamp */}
              <span className="shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                {event.timestamp}
              </span>

              {/* Type badge */}
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${config.color} ${config.bg}`}
              >
                {config.label}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="text-xs text-zinc-700 dark:text-zinc-200">
                  {event.summary}
                </div>
                {isOpen && (
                  <div className="mt-1 rounded bg-zinc-100 p-2 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {event.detail}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Session info */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 text-[10px] text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        <span>Session ID: sess_abc123def456</span>
        <span>Events: {SESSION_EVENTS.length} | Duration: 15m49s</span>
      </div>
    </div>
  );
}
