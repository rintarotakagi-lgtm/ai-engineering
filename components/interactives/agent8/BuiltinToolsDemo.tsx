"use client";

import { useState } from "react";

interface BuiltinTool {
  id: string;
  name: string;
  category: string;
  description: string;
  inputExample: string;
  outputExample: string;
}

const TOOLS: BuiltinTool[] = [
  {
    id: "read",
    name: "Read",
    category: "ファイル操作",
    description:
      "ファイルの内容を読み取る。テキスト・画像・PDFに対応。行番号付きで返却。",
    inputExample: `{ "file_path": "/src/index.ts", "offset": 0, "limit": 50 }`,
    outputExample: `1  import { Agent } from './agent';\n2  import { tools } from './tools';\n3\n4  const agent = new Agent({\n5    tools: [read, write, bash],\n6  });`,
  },
  {
    id: "write",
    name: "Write",
    category: "ファイル操作",
    description:
      "ファイルを新規作成、または既存ファイルを完全に上書きする。",
    inputExample: `{ "file_path": "/src/config.ts", "content": "export const API_KEY = process.env.API_KEY;" }`,
    outputExample: `File created successfully at: /src/config.ts`,
  },
  {
    id: "edit",
    name: "Edit",
    category: "ファイル操作",
    description:
      "既存ファイルの一部を置換する。差分だけ送るので効率的。",
    inputExample: `{ "file_path": "/src/index.ts", "old_string": "const x = 1;", "new_string": "const x = 42;" }`,
    outputExample: `File edited successfully. 1 replacement made.`,
  },
  {
    id: "bash",
    name: "Bash",
    category: "コマンド実行",
    description:
      "シェルコマンドを実行する。npm install、git、テスト実行などに使用。",
    inputExample: `{ "command": "npm test -- --coverage", "timeout": 30000 }`,
    outputExample: `PASS src/agent.test.ts\n  Agent\n    ✓ should initialize (12ms)\n    ✓ should run tools (45ms)\nCoverage: 87%`,
  },
  {
    id: "glob",
    name: "Glob",
    category: "検索",
    description:
      "パターンマッチでファイルを検索する。ワイルドカード対応。",
    inputExample: `{ "pattern": "**/*.test.ts", "path": "/src" }`,
    outputExample: `["src/agent.test.ts", "src/tools.test.ts", "src/hooks.test.ts"]`,
  },
  {
    id: "grep",
    name: "Grep",
    category: "検索",
    description:
      "正規表現でファイル内容を検索する。ripgrep ベースで高速。",
    inputExample: `{ "pattern": "function\\s+handle", "type": "ts" }`,
    outputExample: `src/handler.ts:12: function handleRequest(req)\nsrc/handler.ts:45: function handleError(err)`,
  },
  {
    id: "websearch",
    name: "WebSearch",
    category: "Web",
    description:
      "Web検索を実行し、結果のタイトル・URL・スニペットを返す。",
    inputExample: `{ "query": "Claude Agent SDK documentation" }`,
    outputExample: `[{ "title": "Agent SDK - Anthropic", "url": "https://docs.anthropic.com/...", "snippet": "Build production agents..." }]`,
  },
  {
    id: "webfetch",
    name: "WebFetch",
    category: "Web",
    description:
      "URLからWebページの内容を取得する。Markdownに変換して返却。",
    inputExample: `{ "url": "https://docs.anthropic.com/agent-sdk" }`,
    outputExample: `# Agent SDK\n\nClaude Agent SDKは...\n\n## Installation\nnpm install @anthropic-ai/agent-sdk`,
  },
];

const CATEGORIES = [...new Set(TOOLS.map((t) => t.category))];

export default function BuiltinToolsDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  const selectedTool = TOOLS.find((t) => t.id === selectedId);
  const filtered = filterCat
    ? TOOLS.filter((t) => t.category === filterCat)
    : TOOLS;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        組み込みツールカタログ
      </h3>

      {/* Category filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterCat(null)}
          className={`rounded-full px-3 py-1 text-xs transition-all ${
            filterCat === null
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          }`}
        >
          全て
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`rounded-full px-3 py-1 text-xs transition-all ${
              filterCat === cat
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {filtered.map((tool) => (
          <button
            key={tool.id}
            onClick={() =>
              setSelectedId(selectedId === tool.id ? null : tool.id)
            }
            className={`rounded-lg border p-3 text-left transition-all ${
              selectedId === tool.id
                ? "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
            }`}
          >
            <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
              {tool.name}
            </div>
            <div className="mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
              {tool.category}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selectedTool ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
          <div className="mb-2 text-sm font-bold text-amber-600 dark:text-amber-400">
            {selectedTool.name}
          </div>
          <p className="mb-3 text-xs text-zinc-600 dark:text-zinc-300">
            {selectedTool.description}
          </p>

          <div className="space-y-3">
            <div>
              <div className="mb-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                入力例:
              </div>
              <pre className="rounded bg-zinc-900 p-2 text-xs text-green-400 dark:bg-zinc-950">
                {selectedTool.inputExample}
              </pre>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
                出力例:
              </div>
              <pre className="max-h-40 overflow-auto rounded bg-zinc-900 p-2 text-xs text-amber-400 dark:bg-zinc-950">
                {selectedTool.outputExample}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400 dark:border-zinc-600 dark:text-zinc-500">
          ツールをクリックして入出力の例を確認
        </div>
      )}
    </div>
  );
}
