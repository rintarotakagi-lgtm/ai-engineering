"use client";

import { useState } from "react";

interface TreeNode {
  id: string;
  question: string;
  yes: string;
  no: string;
  result?: string;
  resultType?: "simple" | "augmented" | "workflow" | "agent";
}

const TREE: Record<string, TreeNode> = {
  start: {
    id: "start",
    question: "単一のLLM呼び出し（プロンプトエンジニアリング）で解決できますか？",
    yes: "result-simple",
    no: "q2",
  },
  q2: {
    id: "q2",
    question: "外部ツール・検索・メモリが必要ですか？（計算、API呼び出し、社内文書参照など）",
    yes: "q3",
    no: "result-simple",
  },
  q3: {
    id: "q3",
    question: "タスクの手順を事前に明確に定義できますか？",
    yes: "result-workflow",
    no: "q4",
  },
  q4: {
    id: "q4",
    question: "LLMが自律的に判断・方針転換する必要がありますか？",
    yes: "result-agent",
    no: "result-augmented",
  },
  "result-simple": {
    id: "result-simple",
    question: "",
    yes: "",
    no: "",
    result: "単一LLM呼び出しで十分です。プロンプトを最適化しましょう。最もシンプルで速く、コストも低い方法です。",
    resultType: "simple",
  },
  "result-augmented": {
    id: "result-augmented",
    question: "",
    yes: "",
    no: "",
    result: "拡張LLMが最適です。ツール・検索・メモリでLLMを強化して、1回の呼び出しで解決しましょう。",
    resultType: "augmented",
  },
  "result-workflow": {
    id: "result-workflow",
    question: "",
    yes: "",
    no: "",
    result: "ワークフローを設計しましょう。プロンプトチェーン、ルーティング、並列化などのパターンが使えます。",
    resultType: "workflow",
  },
  "result-agent": {
    id: "result-agent",
    question: "",
    yes: "",
    no: "",
    result: "エージェントの出番です。LLMが自律的にループし、動的にツールを使い、タスクを完遂します。ただし、本当にエージェントが必要か、もう一度考えてみましょう。",
    resultType: "agent",
  },
};

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  simple: {
    bg: "bg-zinc-50 dark:bg-zinc-800/50",
    border: "border-zinc-300 dark:border-zinc-600",
    text: "text-zinc-700 dark:text-zinc-300",
    label: "単一LLM",
  },
  augmented: {
    bg: "bg-amber-50/50 dark:bg-amber-900/10",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-800 dark:text-amber-300",
    label: "拡張LLM",
  },
  workflow: {
    bg: "bg-orange-50/50 dark:bg-orange-900/10",
    border: "border-orange-300 dark:border-orange-700",
    text: "text-orange-800 dark:text-orange-300",
    label: "ワークフロー",
  },
  agent: {
    bg: "bg-red-50/50 dark:bg-red-900/10",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-800 dark:text-red-300",
    label: "エージェント",
  },
};

export default function DecisionTreeDemo() {
  const [path, setPath] = useState<string[]>(["start"]);

  const currentId = path[path.length - 1];
  const currentNode = TREE[currentId];

  const handleAnswer = (next: string) => {
    setPath([...path, next]);
  };

  const handleReset = () => {
    setPath(["start"]);
  };

  const handleBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        質問に答えて、最適なアプローチを見つけましょう
      </h3>

      {/* Progress dots */}
      <div className="mb-6 flex items-center gap-2">
        {path.map((nodeId, i) => (
          <div key={i} className="flex items-center gap-2">
            {i > 0 && (
              <div className="h-0.5 w-4 bg-amber-300 dark:bg-amber-600" />
            )}
            <div
              className={`h-3 w-3 rounded-full ${
                i === path.length - 1
                  ? "bg-amber-500 ring-2 ring-amber-200 dark:ring-amber-800"
                  : "bg-amber-300 dark:bg-amber-700"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Question or Result */}
      {currentNode.result ? (
        <div
          className={`rounded-lg border p-5 ${TYPE_COLORS[currentNode.resultType!].bg} ${TYPE_COLORS[currentNode.resultType!].border}`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_COLORS[currentNode.resultType!].text} ${TYPE_COLORS[currentNode.resultType!].bg}`}
            >
              {TYPE_COLORS[currentNode.resultType!].label}
            </span>
          </div>
          <p
            className={`text-sm ${TYPE_COLORS[currentNode.resultType!].text}`}
          >
            {currentNode.result}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800">
          <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Q{path.length}. {currentNode.question}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(currentNode.yes)}
              className="rounded-lg border border-amber-300 bg-amber-50 px-5 py-2 text-sm font-medium text-amber-700 transition-all hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40"
            >
              はい
            </button>
            <button
              onClick={() => handleAnswer(currentNode.no)}
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            >
              いいえ
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-4 flex gap-2">
        {path.length > 1 && (
          <button
            onClick={handleBack}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            ← 戻る
          </button>
        )}
        {path.length > 1 && (
          <button
            onClick={handleReset}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            最初からやり直す
          </button>
        )}
      </div>
    </div>
  );
}
