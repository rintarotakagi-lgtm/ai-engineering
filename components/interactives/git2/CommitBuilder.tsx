"use client";

import { useState } from "react";

interface Commit {
  id: string;
  message: string;
  files: string[];
  time: string;
}

const AVAILABLE_FILES = [
  { name: "index.html", change: "タイトルを変更" },
  { name: "style.css", change: "背景色を追加" },
  { name: "app.js", change: "ボタンの動作を追加" },
];

function generateHash(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function CommitBuilder() {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [commits, setCommits] = useState<Commit[]>([
    { id: "a1b2c3d", message: "Initial commit", files: ["README.md"], time: "10:00" },
  ]);
  const [error, setError] = useState("");

  function toggleFile(name: string) {
    setSelectedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function handleCommit() {
    if (selectedFiles.size === 0) {
      setError("ファイルを1つ以上選択してください（git add に相当）");
      return;
    }
    if (!message.trim()) {
      setError("コミットメッセージを入力してください");
      return;
    }
    if (message.trim().length < 5) {
      setError("もう少し具体的なメッセージを書きましょう");
      return;
    }

    const newCommit: Commit = {
      id: generateHash(),
      message: message.trim(),
      files: Array.from(selectedFiles),
      time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    };
    setCommits((prev) => [newCommit, ...prev]);
    setSelectedFiles(new Set());
    setMessage("");
    setError("");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Builder */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            コミットを作成
          </h3>

          {/* File selection */}
          <div className="mb-4">
            <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
              1. 含めるファイルを選択（git add）
            </p>
            <div className="space-y-2">
              {AVAILABLE_FILES.map((f) => (
                <label
                  key={f.name}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                    selectedFiles.has(f.name)
                      ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20"
                      : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(f.name)}
                    onChange={() => toggleFile(f.name)}
                    className="h-4 w-4 rounded border-zinc-300 text-amber-500 accent-amber-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{f.name}</span>
                    <span className="ml-2 text-xs text-zinc-400">({f.change})</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <p className="mb-2 text-xs text-zinc-500 dark:text-zinc-400">
              2. コミットメッセージを入力
            </p>
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError("");
              }}
              placeholder="例: ヘッダーのデザインを更新"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500"
            />
          </div>

          {error && (
            <p className="mb-3 text-xs text-red-500">{error}</p>
          )}

          <button
            onClick={handleCommit}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            git commit
          </button>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            コミット履歴
          </h3>
          <div className="space-y-3">
            {commits.map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                  {i < commits.length - 1 && (
                    <div className="w-0.5 flex-1 bg-zinc-200 dark:bg-zinc-700" />
                  )}
                </div>
                <div className={`flex-1 rounded-lg border p-3 ${i === 0 ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20" : "border-zinc-200 dark:border-zinc-700"}`}>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-amber-600 dark:text-amber-400">{c.id}</code>
                    <span className="text-[10px] text-zinc-400">{c.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">{c.message}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.files.map((f) => (
                      <span key={f} className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
