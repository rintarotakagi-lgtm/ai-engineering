"use client";

import { useState } from "react";

interface MCPServer {
  id: string;
  name: string;
  icon: string;
  description: string;
  tools: { name: string; desc: string }[];
}

const MCP_SERVERS: MCPServer[] = [
  {
    id: "browser",
    name: "ブラウザ操作",
    icon: "B",
    description:
      "Webブラウザを制御する。ページの読み取り、フォーム入力、スクリーンショット取得が可能。",
    tools: [
      { name: "navigate", desc: "指定URLに移動する" },
      { name: "read_page", desc: "現在のページの内容をテキストで取得" },
      { name: "form_input", desc: "フォームフィールドに入力する" },
      { name: "screenshot", desc: "ページのスクリーンショットを撮る" },
    ],
  },
  {
    id: "database",
    name: "データベース",
    icon: "D",
    description:
      "PostgreSQL/MySQL/SQLiteなどのデータベースにクエリを実行する。読み取り専用モード対応。",
    tools: [
      { name: "query", desc: "SQLクエリを実行して結果を返す" },
      { name: "list_tables", desc: "テーブル一覧を取得する" },
      { name: "describe_table", desc: "テーブルのスキーマを取得する" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    icon: "S",
    description:
      "Slackワークスペースでメッセージの送受信、チャンネル管理を行う。",
    tools: [
      { name: "send_message", desc: "チャンネルにメッセージを送信" },
      { name: "read_channel", desc: "チャンネルの最新メッセージを読む" },
      { name: "search_messages", desc: "メッセージをキーワード検索" },
      { name: "list_channels", desc: "チャンネル一覧を取得" },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    icon: "G",
    description:
      "GitHubリポジトリでIssue・PR・コードの操作を行う。",
    tools: [
      { name: "create_issue", desc: "新しいIssueを作成する" },
      { name: "create_pr", desc: "Pull Requestを作成する" },
      { name: "list_prs", desc: "PR一覧を取得する" },
      { name: "review_pr", desc: "PRにレビューコメントを付ける" },
    ],
  },
  {
    id: "filesystem",
    name: "ファイルシステム",
    icon: "F",
    description:
      "ローカルまたはリモートのファイルシステムを操作する。サンドボックス内で安全に実行。",
    tools: [
      { name: "read_file", desc: "ファイルの内容を読み取る" },
      { name: "write_file", desc: "ファイルを作成・更新する" },
      { name: "list_directory", desc: "ディレクトリの内容を一覧" },
      { name: "search_files", desc: "パターンでファイルを検索" },
    ],
  },
  {
    id: "calendar",
    name: "カレンダー",
    icon: "C",
    description:
      "Google Calendar等のカレンダーサービスと連携。予定の作成・確認・変更が可能。",
    tools: [
      { name: "list_events", desc: "指定期間のイベントを取得" },
      { name: "create_event", desc: "新しい予定を作成" },
      { name: "find_free_time", desc: "空き時間を検索" },
    ],
  },
];

export default function MCPDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedServer = MCP_SERVERS.find((s) => s.id === selectedId);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        MCP（Model Context Protocol）の構成
      </h3>
      <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
        各MCPサーバーをクリックして、提供されるツールを確認
      </p>

      {/* Central LLM + MCP servers layout */}
      <div className="mb-6 flex flex-col items-center gap-4">
        {/* LLM box */}
        <div className="rounded-xl border-2 border-amber-400 bg-amber-50 px-8 py-3 text-center dark:border-amber-500 dark:bg-amber-900/20">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
            LLM (Claude)
          </div>
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
            MCPクライアント
          </div>
        </div>

        {/* Connection lines */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
          <div className="text-[10px] text-zinc-400">MCP Protocol</div>
          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-600" />
        </div>

        {/* MCP Server grid */}
        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
          {MCP_SERVERS.map((server) => {
            const isSelected = selectedId === server.id;
            return (
              <button
                key={server.id}
                onClick={() =>
                  setSelectedId(isSelected ? null : server.id)
                }
                className={`rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-50 shadow-sm dark:border-amber-500 dark:bg-amber-900/20"
                    : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                      isSelected
                        ? "bg-amber-500 text-white"
                        : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {server.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                      {server.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {server.tools.length} tools
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected server detail */}
      {selectedServer ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
          <div className="mb-1 text-sm font-bold text-amber-600 dark:text-amber-400">
            MCP Server: {selectedServer.name}
          </div>
          <p className="mb-3 text-xs text-zinc-600 dark:text-zinc-300">
            {selectedServer.description}
          </p>

          <div className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
            提供ツール:
          </div>
          <div className="mt-1 space-y-1">
            {selectedServer.tools.map((tool) => (
              <div
                key={tool.name}
                className="flex items-start gap-2 rounded bg-white p-2 text-xs dark:bg-zinc-800"
              >
                <code className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 font-bold text-amber-600 dark:bg-zinc-700 dark:text-amber-400">
                  {tool.name}
                </code>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400 dark:border-zinc-600 dark:text-zinc-500">
          MCPサーバーをクリックして、LLMが使えるツールを確認
        </div>
      )}
    </div>
  );
}
