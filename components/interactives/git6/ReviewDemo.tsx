"use client";

import { useState } from "react";

interface DiffLine {
  type: "context" | "add" | "remove";
  content: string;
  lineNum: number;
}

interface Comment {
  lineNum: number;
  text: string;
}

const diffLines: DiffLine[] = [
  { type: "context", content: "function login(username, password) {", lineNum: 1 },
  { type: "remove", content: '  if (username === "admin") {', lineNum: 2 },
  { type: "add", content: "  if (username && password) {", lineNum: 2 },
  { type: "context", content: "    const user = findUser(username);", lineNum: 3 },
  { type: "remove", content: "    return true;", lineNum: 4 },
  { type: "add", content: "    return validatePassword(user, password);", lineNum: 4 },
  { type: "context", content: "  }", lineNum: 5 },
  { type: "add", content: "  logAttempt(username);", lineNum: 6 },
  { type: "context", content: "  return false;", lineNum: 7 },
  { type: "context", content: "}", lineNum: 8 },
];

export default function ReviewDemo(): React.ReactElement {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentingLine, setCommentingLine] = useState<number | null>(null);
  const [commentText, setCommentText] = useState("");
  const [decision, setDecision] = useState<"approve" | "changes" | null>(null);

  function addComment(): void {
    if (commentingLine === null || !commentText.trim()) return;
    setComments([...comments, { lineNum: commentingLine, text: commentText.trim() }]);
    setCommentText("");
    setCommentingLine(null);
  }

  function resetDemo(): void {
    setComments([]);
    setCommentingLine(null);
    setCommentText("");
    setDecision(null);
  }

  const lineColors = {
    context: "bg-white",
    add: "bg-emerald-50",
    remove: "bg-red-50",
  };

  const linePrefix = {
    context: " ",
    add: "+",
    remove: "-",
  };

  const linePrefixColor = {
    context: "text-zinc-400",
    add: "text-emerald-600",
    remove: "text-red-600",
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500">
        行をクリックしてコメントを追加してみましょう。レビューの体験ができます。
      </div>

      {/* PR header */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden">
        <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm font-bold text-zinc-800">ログイン機能のセキュリティ改善</span>
          <span className="text-xs text-zinc-400 ml-auto">Files changed: 1</span>
        </div>

        {/* Diff view */}
        <div className="font-mono text-xs overflow-x-auto">
          <div className="bg-zinc-100 text-zinc-500 px-4 py-1 border-b text-xs">
            login.js
          </div>
          {diffLines.map((line, i) => (
            <div key={i}>
              <div
                onClick={() => setCommentingLine(line.lineNum)}
                className={`${lineColors[line.type]} px-4 py-0.5 flex items-center gap-2 cursor-pointer hover:bg-amber-50 border-b border-zinc-100`}
              >
                <span className="text-zinc-300 w-6 text-right select-none">
                  {line.lineNum}
                </span>
                <span className={`w-4 font-bold ${linePrefixColor[line.type]}`}>
                  {linePrefix[line.type]}
                </span>
                <span className="text-zinc-800">{line.content}</span>
                <span className="ml-auto text-zinc-300 text-xs opacity-0 group-hover:opacity-100">
                  +
                </span>
              </div>
              {/* Comments for this line */}
              {comments
                .filter((c) => c.lineNum === line.lineNum)
                .map((c, ci) => (
                  <div
                    key={ci}
                    className="bg-blue-50 border-l-4 border-blue-400 px-4 py-2 text-xs text-blue-800 ml-12"
                  >
                    <span className="font-bold">あなた: </span>
                    {c.text}
                  </div>
                ))}
              {/* Comment input */}
              {commentingLine === line.lineNum && (
                <div className="bg-zinc-50 px-4 py-2 ml-12 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="コメントを入力..."
                    className="flex-1 px-2 py-1 border border-zinc-300 rounded text-xs"
                    onKeyDown={(e) => e.key === "Enter" && addComment()}
                    autoFocus
                  />
                  <button
                    onClick={addComment}
                    className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setCommentingLine(null)}
                    className="px-3 py-1 bg-zinc-200 text-zinc-600 rounded text-xs"
                  >
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review decision */}
      {!decision && (
        <div className="flex gap-2">
          <button
            onClick={() => setDecision("approve")}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
          >
            Approve（承認）
          </button>
          <button
            onClick={() => setDecision("changes")}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
          >
            Request Changes（修正依頼）
          </button>
        </div>
      )}

      {decision && (
        <div
          className={`rounded-lg p-4 ${
            decision === "approve"
              ? "bg-emerald-50 border border-emerald-300"
              : "bg-red-50 border border-red-300"
          }`}
        >
          <div
            className={`font-bold ${
              decision === "approve" ? "text-emerald-800" : "text-red-800"
            }`}
          >
            {decision === "approve"
              ? "レビューを承認しました！"
              : "修正を依頼しました！"}
          </div>
          <div
            className={`text-sm mt-1 ${
              decision === "approve" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {decision === "approve"
              ? "PRがマージ可能な状態になりました。"
              : "PR作成者に修正のフィードバックが送信されます。"}
          </div>
          {comments.length > 0 && (
            <div className="mt-2 text-xs text-zinc-500">
              コメント数: {comments.length}件
            </div>
          )}
        </div>
      )}

      {decision && (
        <button
          onClick={resetDemo}
          className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
        >
          もう一度やる
        </button>
      )}
    </div>
  );
}
