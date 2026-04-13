"use client";

import { useState } from "react";

interface TreeNode {
  name: string;
  type: "folder" | "file";
  description: string;
  children?: TreeNode[];
  highlight?: boolean;
}

const REPO_TREE: TreeNode = {
  name: "my-project/",
  type: "folder",
  description: "プロジェクトのルートフォルダ（リポジトリ）",
  children: [
    {
      name: ".git/",
      type: "folder",
      description: "Gitが管理する隠しフォルダ。変更履歴の全てがここに格納される。直接触る必要はない",
      highlight: true,
      children: [
        { name: "objects/", type: "folder", description: "全てのコミット・ファイルのスナップショットが保存される場所" },
        { name: "refs/", type: "folder", description: "ブランチやタグの情報が保存される場所" },
        { name: "HEAD", type: "file", description: "今どのブランチにいるかを示すファイル" },
        { name: "config", type: "file", description: "このリポジトリの設定ファイル" },
      ],
    },
    { name: "index.html", type: "file", description: "あなたが作成したHTMLファイル。普通のファイルと同じように編集できる" },
    { name: "style.css", type: "file", description: "あなたが作成したCSSファイル。Gitが変更を追跡してくれる" },
    { name: "app.js", type: "file", description: "あなたが作成したJavaScriptファイル" },
    { name: "README.md", type: "file", description: "プロジェクトの説明を書くファイル。GitHubで最初に表示される" },
  ],
};

function TreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(depth === 0);
  const [showDesc, setShowDesc] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
          setShowDesc(!showDesc);
        }}
        className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
          node.highlight ? "text-amber-600 font-semibold dark:text-amber-400" : "text-zinc-700 dark:text-zinc-300"
        }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {node.type === "folder" ? (
          <svg className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "rotate-90" : ""} ${node.highlight ? "text-amber-500" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        <span>{node.name}</span>
        {node.highlight && (
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Git管理
          </span>
        )}
      </button>
      {showDesc && (
        <div
          className="mx-2 mb-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
          style={{ marginLeft: `${depth * 20 + 32}px` }}
        >
          {node.description}
        </div>
      )}
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child, i) => (
            <TreeItem key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RepoExplorer() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        リポジトリの中身を探検しよう（クリックで詳細表示）
      </h3>
      <p className="mb-4 text-xs text-zinc-400 dark:text-zinc-500">
        オレンジ色の .git/ フォルダがGitの心臓部。ここに全ての履歴が保存されます
      </p>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800">
        <TreeItem node={REPO_TREE} depth={0} />
      </div>
    </div>
  );
}
