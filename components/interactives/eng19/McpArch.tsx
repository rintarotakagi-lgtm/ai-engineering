"use client";

import { useState } from "react";

const mcpServers = [
  { name: "Notion MCP", icon: "📝", tools: ["notion-search", "notion-create-page", "notion-update-page"], resources: ["Notionページ", "データベース"] },
  { name: "GitHub MCP", icon: "🐙", tools: ["create-repo", "list-prs", "create-issue"], resources: ["リポジトリ", "Issues", "PRs"] },
  { name: "Filesystem MCP", icon: "📁", tools: ["read-file", "write-file", "list-files"], resources: ["ローカルファイル"] },
  { name: "Slack MCP", icon: "💬", tools: ["send-message", "list-channels", "search-messages"], resources: ["チャンネル", "メッセージ"] },
];

const clients = [
  { name: "Claude Code", icon: "💻" },
  { name: "Cursor", icon: "✏️" },
  { name: "カスタムアプリ", icon: "⚙️" },
];

export default function McpArch() {
  const [selectedServer, setSelectedServer] = useState<typeof mcpServers[0] | null>(null);
  const [activeClient, setActiveClient] = useState(0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">MCPのアーキテクチャ。サーバーをクリックして詳細を確認</p>

      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="mb-4 flex justify-center gap-3">
          {clients.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActiveClient(i)}
              className={`rounded-lg border px-3 py-2 text-center text-xs transition ${
                activeClient === i ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20" : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <p className="text-lg">{c.icon}</p>
              <p className="font-medium text-zinc-700 dark:text-zinc-300">{c.name}</p>
              <p className="text-zinc-400">MCP Client</p>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="rounded bg-zinc-100 px-3 py-1 text-xs text-zinc-500 dark:bg-zinc-800">
            ↕ MCP Protocol (JSON-RPC 2.0)
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {mcpServers.map((server) => (
            <button
              key={server.name}
              onClick={() => setSelectedServer(selectedServer?.name === server.name ? null : server)}
              className={`rounded-xl border p-3 text-center transition ${
                selectedServer?.name === server.name
                  ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/20"
                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700"
              }`}
            >
              <p className="text-2xl">{server.icon}</p>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{server.name}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedServer && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{selectedServer.icon}</span>
            <p className="font-bold text-zinc-800 dark:text-zinc-200">{selectedServer.name}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-bold text-amber-600">🔧 Tools（実行できる操作）</p>
              <ul className="space-y-1">
                {selectedServer.tools.map((t) => (
                  <li key={t} className="rounded bg-white px-2 py-1 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-blue-600">📚 Resources（読めるデータ）</p>
              <ul className="space-y-1">
                {selectedServer.resources.map((r) => (
                  <li key={r} className="rounded bg-white px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-zinc-50 p-3 text-xs dark:bg-zinc-800">
        <p className="font-medium text-zinc-500 mb-1">ポイント</p>
        <p className="text-zinc-400">一度MCPサーバーを作れば、Claude Code・Cursor・自作アプリなど<strong className="text-zinc-600 dark:text-zinc-300">すべてのMCPクライアントで使える</strong>。これがMCPの標準化の価値。</p>
      </div>
    </div>
  );
}
