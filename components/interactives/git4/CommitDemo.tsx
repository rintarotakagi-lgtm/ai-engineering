"use client";

import { useState } from "react";

interface CommitExample {
  message: string;
  quality: "good" | "bad";
  reason: string;
}

const EXAMPLES: CommitExample[] = [
  { message: "修正", quality: "bad", reason: "何を修正したか分からない" },
  { message: "ログインページのパスワードバリデーションを修正", quality: "good", reason: "何をどう変えたか具体的" },
  { message: "update", quality: "bad", reason: "何を更新したかが不明" },
  { message: "利用規約ページの内容を2024年版に更新", quality: "good", reason: "対象と内容が明確" },
  { message: "あああ", quality: "bad", reason: "情報ゼロ" },
  { message: "ヘッダーのレスポンシブ対応を実装", quality: "good", reason: "作業内容が具体的" },
];

function generateHash(): string {
  return Math.random().toString(36).substring(2, 9);
}

interface CommitEntry {
  id: string;
  message: string;
  time: string;
}

export default function CommitDemo() {
  const [message, setMessage] = useState("");
  const [commits, setCommits] = useState<CommitEntry[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleCommit() {
    if (!message.trim()) {
      setFeedback("コミットメッセージを入力してください");
      return;
    }
    if (message.trim().length < 5) {
      setFeedback("もう少し具体的に書くとチームメンバーが助かります");
      return;
    }

    const badPatterns = ["修正", "update", "fix", "変更", "更新"];
    const isTooVague = badPatterns.some(
      (p) => message.trim().toLowerCase() === p
    );

    if (isTooVague) {
      setFeedback(`「${message.trim()}」だけでは何をしたか分かりません。「何を」「どう」変えたか書いてみましょう。`);
      return;
    }

    const entry: CommitEntry = {
      id: generateHash(),
      message: message.trim(),
      time: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
    };
    setCommits((prev) => [entry, ...prev]);
    setMessage("");
    setFeedback(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        コミットメッセージを書いてコミットしてみよう
      </h3>

      {/* Commit form */}
      <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-500">Terminal</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-zinc-500">$</span>
          <span className="text-green-400">git commit -m &quot;</span>
          <input
            type="text"
            value={message}
            onChange={(e) => { setMessage(e.target.value); setFeedback(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleCommit()}
            placeholder="ここにメッセージを入力"
            className="flex-1 border-none bg-transparent text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <span className="text-green-400">&quot;</span>
        </div>
      </div>

      {feedback && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          {feedback}
        </div>
      )}

      <div className="mb-4 flex gap-2">
        <button
          onClick={handleCommit}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          commit
        </button>
        <button
          onClick={() => setShowExamples(!showExamples)}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {showExamples ? "例を閉じる" : "良い例・悪い例を見る"}
        </button>
      </div>

      {/* Examples */}
      {showExamples && (
        <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            コミットメッセージの良い例・悪い例
          </h4>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                <span className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                  ex.quality === "good"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {ex.quality === "good" ? "OK" : "NG"}
                </span>
                <div>
                  <code className="text-sm text-zinc-700 dark:text-zinc-200">{ex.message}</code>
                  <p className="mt-0.5 text-xs text-zinc-400">{ex.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Commit history */}
      {commits.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            あなたのコミット履歴
          </h4>
          <div className="space-y-2">
            {commits.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <code className="text-xs text-amber-600 dark:text-amber-400">{c.id}</code>
                <span className="text-sm text-zinc-700 dark:text-zinc-200">{c.message}</span>
                <span className="ml-auto text-xs text-zinc-400">{c.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
