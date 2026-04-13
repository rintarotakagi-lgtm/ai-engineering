"use client";

import { useState } from "react";

interface FileItem {
  name: string;
  type: "file" | "dir";
  shouldIgnore: boolean;
  reason: string;
}

const allFiles: FileItem[] = [
  { name: "index.html", type: "file", shouldIgnore: false, reason: "メインのHTMLファイル。管理が必要" },
  { name: "app.js", type: "file", shouldIgnore: false, reason: "アプリのメインコード。管理が必要" },
  { name: "style.css", type: "file", shouldIgnore: false, reason: "スタイルシート。管理が必要" },
  { name: "package.json", type: "file", shouldIgnore: false, reason: "依存関係の定義。管理が必要" },
  { name: "node_modules/", type: "dir", shouldIgnore: true, reason: "npm installで復元できる。サイズが大きい" },
  { name: ".env", type: "file", shouldIgnore: true, reason: "パスワード等の機密情報。絶対に含めない" },
  { name: ".DS_Store", type: "file", shouldIgnore: true, reason: "macOSのシステムファイル。開発に不要" },
  { name: "build/", type: "dir", shouldIgnore: true, reason: "ビルド成果物。毎回生成できる" },
  { name: "debug.log", type: "file", shouldIgnore: true, reason: "ログファイル。開発時の一時データ" },
  { name: "README.md", type: "file", shouldIgnore: false, reason: "プロジェクト説明。管理が必要" },
];

export default function GitignoreDemo(): React.ReactElement {
  const [ignored, setIgnored] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);

  function toggleIgnore(name: string): void {
    const next = new Set(ignored);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setIgnored(next);
    setShowResult(false);
  }

  function checkAnswer(): void {
    setShowResult(true);
  }

  const score = allFiles.reduce((acc, f) => {
    const userIgnored = ignored.has(f.name);
    return acc + (userIgnored === f.shouldIgnore ? 1 : 0);
  }, 0);

  // Generate .gitignore content from selections
  const gitignoreContent = Array.from(ignored).sort().join("\n") || "# まだルールがありません";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500">
        以下のファイル一覧から、.gitignoreに追加すべきものを選んでください。
      </div>

      {/* File list */}
      <div className="space-y-1">
        {allFiles.map((f) => {
          const isIgnored = ignored.has(f.name);
          const isCorrect = showResult && isIgnored === f.shouldIgnore;
          const isWrong = showResult && isIgnored !== f.shouldIgnore;

          return (
            <button
              key={f.name}
              onClick={() => toggleIgnore(f.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition text-sm ${
                isCorrect
                  ? "bg-emerald-50 border border-emerald-300"
                  : isWrong
                    ? "bg-red-50 border border-red-300"
                    : isIgnored
                      ? "bg-amber-50 border border-amber-300"
                      : "bg-white border border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs ${
                  isIgnored
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-zinc-300"
                }`}
              >
                {isIgnored && "x"}
              </span>
              <span className="font-mono flex-1">
                {f.type === "dir" ? "📁 " : "📄 "}
                <span className={isIgnored ? "line-through text-zinc-400" : ""}>
                  {f.name}
                </span>
              </span>
              {showResult && (
                <span className="text-xs text-zinc-500">{f.reason}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Generated .gitignore */}
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="text-zinc-400 text-xs mb-2 font-mono">📄 .gitignore</div>
        <pre className="text-emerald-400 font-mono text-sm whitespace-pre-line">
          {gitignoreContent}
        </pre>
      </div>

      {!showResult ? (
        <button
          onClick={checkAnswer}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
        >
          答え合わせ
        </button>
      ) : (
        <div className="space-y-3">
          <div
            className={`rounded-lg p-4 text-center ${
              score === allFiles.length
                ? "bg-emerald-50 border border-emerald-300"
                : "bg-amber-50 border border-amber-300"
            }`}
          >
            <div className="text-lg font-bold">
              {score === allFiles.length
                ? "完璧！ 全問正解です"
                : `${score}/${allFiles.length} 正解`}
            </div>
            <div className="text-sm text-zinc-600 mt-1">
              {score < allFiles.length &&
                "各ファイルの横に理由が表示されています。確認してみましょう。"}
            </div>
          </div>
          <button
            onClick={() => {
              setIgnored(new Set());
              setShowResult(false);
            }}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
          >
            もう一度やる
          </button>
        </div>
      )}
    </div>
  );
}
