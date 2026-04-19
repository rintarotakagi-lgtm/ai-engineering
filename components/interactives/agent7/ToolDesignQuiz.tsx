"use client";

import { useState } from "react";

interface ToolChallenge {
  id: number;
  toolSpec: {
    name: string;
    description: string;
    params: string;
  };
  problem: string;
  options: string[];
  answer: number;
  explanation: string;
}

const CHALLENGES: ToolChallenge[] = [
  {
    id: 1,
    toolSpec: {
      name: "get",
      description: "Gets something",
      params: "url: string",
    },
    problem: "このツール仕様の最大の問題点は？",
    options: [
      "パラメータが少なすぎる",
      "名前と説明が曖昧で何をするツールか分からない",
      "戻り値の型が定義されていない",
      "エラーハンドリングがない",
    ],
    answer: 1,
    explanation:
      '名前が"get"だけでは何を取得するのか不明です。"fetch_webpage"や"get_api_response"のように、対象を明確にすべきです。説明も"Gets something"では使いどころが分かりません。',
  },
  {
    id: 2,
    toolSpec: {
      name: "execute_database_query_and_return_results_as_json",
      description:
        "Executes a SQL query against the PostgreSQL database and returns results",
      params: "query: string",
    },
    problem: "このツール仕様の改善点は？",
    options: [
      "説明が英語になっている",
      "名前が長すぎる。query_database 程度で十分",
      "パラメータの型が間違っている",
      "PostgreSQL以外のDBに対応していない",
    ],
    answer: 1,
    explanation:
      "ツール名は簡潔で分かりやすいのが理想です。\"execute_database_query_and_return_results_as_json\" は冗長で、\"query_database\" で十分に意味が伝わります。ただし説明は詳細な方が良いので、戻り値の形式は説明に書きましょう。",
  },
  {
    id: 3,
    toolSpec: {
      name: "modify_file",
      description: "Modifies a file on disk. Can create, update, or delete.",
      params: "path: string, content: string",
    },
    problem: "このツール仕様の最大の問題点は？",
    options: [
      "ファイル操作にパスワードが必要",
      "1つのツールに複数の操作（作成・更新・削除）を詰め込んでいる",
      "contentパラメータが必須になっている",
      "説明が英語で書かれている",
    ],
    answer: 1,
    explanation:
      "1つのツールに作成・更新・削除の3つの操作を入れると、LLMがどのモードで使うべきか迷います。create_file、update_file、delete_file のように分離する方が、LLMが正しいツールを選びやすくなります。",
  },
  {
    id: 4,
    toolSpec: {
      name: "search_web",
      description: "Search the internet for information",
      params: "query: string, max_results?: number",
    },
    problem: "このツール仕様に足りないものは？",
    options: [
      "ツール名をもっと長くすべき",
      "descriptionに使用場面・制限事項・出力形式の記載がない",
      "max_resultsを必須にすべき",
      "パラメータが少なすぎる",
    ],
    answer: 1,
    explanation:
      '良いdescriptionには「いつ使うべきか」「制限事項」「出力形式」が含まれます。例: "リアルタイムの情報が必要な場合に使用。1回の検索で最大10件。結果はタイトル・URL・スニペットのオブジェクト配列で返却。"',
  },
];

export default function ToolDesignQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const challenge = CHALLENGES[currentIdx];
  const isCorrect = selected === challenge.answer;
  const isFinished = currentIdx >= CHALLENGES.length;

  function handleSelect(idx: number) {
    if (showResult) return;
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null) return;
    setShowResult(true);
    if (selected === challenge.answer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    setCurrentIdx((i) => i + 1);
    setSelected(null);
    setShowResult(false);
  }

  function handleReset() {
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
  }

  if (isFinished) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <div className="text-center">
          <div className="mb-2 text-3xl font-bold text-amber-500">
            {score}/{CHALLENGES.length}
          </div>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
            {score === CHALLENGES.length
              ? "全問正解！ツール設計のポイントを理解しています。"
              : "ツール設計のベストプラクティスを振り返りましょう。"}
          </p>
          <button
            onClick={handleReset}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            もう一度挑戦
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
          ツール設計クイズ
        </h3>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {currentIdx + 1}/{CHALLENGES.length}
        </span>
      </div>

      {/* Tool spec display */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-2 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500">
          ツール仕様:
        </div>
        <div className="space-y-1 font-mono text-xs">
          <div>
            <span className="text-zinc-500">name:</span>{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {challenge.toolSpec.name}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">description:</span>{" "}
            <span className="text-zinc-700 dark:text-zinc-200">
              &quot;{challenge.toolSpec.description}&quot;
            </span>
          </div>
          <div>
            <span className="text-zinc-500">params:</span>{" "}
            <span className="text-zinc-700 dark:text-zinc-200">
              {challenge.toolSpec.params}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {challenge.problem}
      </p>

      {/* Options */}
      <div className="mb-4 space-y-2">
        {challenge.options.map((opt, i) => {
          let optStyle =
            "border-zinc-200 hover:border-amber-300 dark:border-zinc-700 dark:hover:border-amber-600";
          if (selected === i && !showResult) {
            optStyle =
              "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20";
          }
          if (showResult && i === challenge.answer) {
            optStyle =
              "border-green-400 bg-green-50 dark:border-green-500 dark:bg-green-900/20";
          }
          if (showResult && selected === i && i !== challenge.answer) {
            optStyle =
              "border-red-400 bg-red-50 dark:border-red-500 dark:bg-red-900/20";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${optStyle}`}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-zinc-700 dark:text-zinc-200">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Submit / Next */}
      {!showResult ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-40"
        >
          回答する
        </button>
      ) : (
        <div>
          <div
            className={`mb-3 rounded-lg p-3 text-sm ${
              isCorrect
                ? "border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            <div className="mb-1 font-semibold">
              {isCorrect ? "正解！" : "不正解"}
            </div>
            <div className="text-xs">{challenge.explanation}</div>
          </div>
          <button
            onClick={handleNext}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            {currentIdx < CHALLENGES.length - 1 ? "次の問題" : "結果を見る"}
          </button>
        </div>
      )}
    </div>
  );
}
