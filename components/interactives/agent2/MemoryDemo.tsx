"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface ConversationPair {
  label: string;
  withMemory: Message[];
  withoutMemory: Message[];
}

const CONVERSATIONS: ConversationPair[] = [
  {
    label: "1回目",
    withMemory: [
      { role: "user", text: "私はTypeScriptが好きです。" },
      {
        role: "assistant",
        text: "TypeScriptが好きなんですね！型安全性と優れたエディタサポートが魅力ですよね。覚えておきます。",
      },
    ],
    withoutMemory: [
      { role: "user", text: "私はTypeScriptが好きです。" },
      {
        role: "assistant",
        text: "TypeScriptが好きなんですね！型安全性と優れたエディタサポートが魅力ですよね。",
      },
    ],
  },
  {
    label: "2回目",
    withMemory: [
      { role: "user", text: "新しいプロジェクトを始めたいです。おすすめの構成は？" },
      {
        role: "assistant",
        text: "TypeScriptがお好きでしたよね。Next.js + TypeScript + Tailwindがおすすめです。型安全性を活かしつつ、フルスタックで開発できます。",
      },
    ],
    withoutMemory: [
      { role: "user", text: "新しいプロジェクトを始めたいです。おすすめの構成は？" },
      {
        role: "assistant",
        text: "どんな言語やフレームワークをお使いですか？プロジェクトの種類（Webアプリ、API、モバイルなど）を教えてください。",
      },
    ],
  },
  {
    label: "3回目",
    withMemory: [
      { role: "user", text: "APIの設計で迷っています。" },
      {
        role: "assistant",
        text: "TypeScript + Next.jsの構成でしたね。App RouterのRoute Handlersを使えば、型安全なAPIをプロジェクト内に直接定義できます。前回のプロジェクト構成に合った提案です。",
      },
    ],
    withoutMemory: [
      { role: "user", text: "APIの設計で迷っています。" },
      {
        role: "assistant",
        text: "API設計についてですね。REST APIですか？GraphQLですか？使用する言語やフレームワークも教えてください。",
      },
    ],
  },
];

export default function MemoryDemo() {
  const [turnIndex, setTurnIndex] = useState(0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        同じ質問でも、メモリがあると回答が変わる
      </h3>

      {/* Turn selector */}
      <div className="mb-4 flex gap-2">
        {CONVERSATIONS.map((conv, i) => (
          <button
            key={i}
            onClick={() => setTurnIndex(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              i === turnIndex
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : i <= turnIndex
                  ? "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            }`}
          >
            {conv.label}
          </button>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* With memory */}
        <div className="rounded-lg border border-amber-200 bg-amber-50/30 p-4 dark:border-amber-800/50 dark:bg-amber-900/5">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              メモリあり
            </span>
          </div>
          <div className="space-y-2">
            {CONVERSATIONS[turnIndex].withMemory.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg p-2.5 text-xs ${
                  msg.role === "user"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-white text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                <span className="mb-0.5 block text-[10px] font-semibold opacity-60">
                  {msg.role === "user" ? "ユーザー" : "LLM"}
                </span>
                {msg.text}
              </div>
            ))}
          </div>
          {turnIndex > 0 && (
            <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-[10px] text-amber-600 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
              記憶: TypeScriptが好き
              {turnIndex > 1 && "、Next.js+TSの構成でプロジェクト開始"}
            </div>
          )}
        </div>

        {/* Without memory */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/30 p-4 dark:border-zinc-700 dark:bg-zinc-800/30">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-zinc-400" />
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              メモリなし
            </span>
          </div>
          <div className="space-y-2">
            {CONVERSATIONS[turnIndex].withoutMemory.map((msg, i) => (
              <div
                key={i}
                className={`rounded-lg p-2.5 text-xs ${
                  msg.role === "user"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-white text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                <span className="mb-0.5 block text-[10px] font-semibold opacity-60">
                  {msg.role === "user" ? "ユーザー" : "LLM"}
                </span>
                {msg.text}
              </div>
            ))}
          </div>
          {turnIndex > 0 && (
            <div className="mt-2 rounded border border-zinc-200 bg-zinc-100 p-2 text-[10px] text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
              記憶なし — 毎回ゼロから
            </div>
          )}
        </div>
      </div>

      {/* Insight */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
        {turnIndex === 0 && "1回目は大きな違いはありません。次のターンで差が出ます。"}
        {turnIndex === 1 &&
          "メモリありのLLMは「TypeScriptが好き」を覚えているので、具体的な提案ができます。メモリなしのLLMは毎回聞き直す必要があります。"}
        {turnIndex === 2 &&
          "3回目になると差は歴然。メモリありは文脈を積み重ねて的確な提案ができますが、メモリなしは毎回ゼロスタートです。"}
      </div>
    </div>
  );
}
