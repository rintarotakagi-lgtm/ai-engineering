"use client";

import { useState } from "react";

const DEFAULT_MD = `# My Project

このプロジェクトは〇〇するためのツールです。

## セットアップ

\`\`\`
git clone https://github.com/user/my-project.git
cd my-project
\`\`\`

## 使い方

1. ファイルを編集する
2. 変更をコミットする
3. GitHubにプッシュする

## 連絡先

質問があれば **田中** まで`;

function renderMarkdown(md: string): string {
  let html = md
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre class="rounded bg-zinc-800 p-3 text-xs text-green-400 my-2 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 text-xs text-amber-600 dark:text-amber-400">$1</code>')
    // H1
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-zinc-800 dark:text-zinc-100 mt-4 mb-2 border-b border-zinc-200 dark:border-zinc-700 pb-2">$1</h1>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-zinc-700 dark:text-zinc-200 mt-3 mb-1">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-zinc-600 dark:text-zinc-300 mt-2 mb-1">$3</h3>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-sm text-zinc-600 dark:text-zinc-300 list-decimal">$1</li>')
    // Unordered list
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-zinc-600 dark:text-zinc-300 list-disc">$1</li>')
    // Paragraphs (lines that aren't already tagged)
    .replace(/^(?!<[hluop])((?!<).+)$/gm, '<p class="text-sm text-zinc-600 dark:text-zinc-300 my-1">$1</p>')
    // Empty lines
    .replace(/^\s*$/gm, '<div class="h-2"></div>');

  return html;
}

export default function ReadmeEditor() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        Markdownを編集して、プレビューを確認しましょう
      </h3>

      {/* Tab buttons */}
      <div className="mb-4 flex border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setTab("edit")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "edit"
              ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          Edit
        </button>
        <button
          onClick={() => setTab("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "border-b-2 border-amber-500 text-amber-600 dark:text-amber-400"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          }`}
        >
          Preview
        </button>
      </div>

      {tab === "edit" ? (
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="h-[300px] w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 p-4 font-mono text-sm text-zinc-700 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
          spellCheck={false}
        />
      ) : (
        <div
          className="min-h-[300px] rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      )}

      {/* Cheat sheet */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Markdown チートシート</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-300 md:grid-cols-4">
          <div><code className="text-amber-600 dark:text-amber-400"># 見出し1</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">## 見出し2</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">**太字**</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">- リスト</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">`コード`</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">1. 番号リスト</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">```コードブロック```</code></div>
          <div><code className="text-amber-600 dark:text-amber-400">[リンク](URL)</code></div>
        </div>
      </div>
    </div>
  );
}
