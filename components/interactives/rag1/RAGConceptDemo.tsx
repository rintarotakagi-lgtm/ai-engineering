"use client";

import { useState } from "react";

interface Scenario {
  question: string;
  llmOnly: {
    answer: string;
    issue: string;
  };
  ragAnswer: {
    answer: string;
    source: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    question: "2025年のノーベル物理学賞は誰が受賞しましたか？",
    llmOnly: {
      answer:
        "申し訳ありませんが、私の知識は2024年4月までのため、2025年のノーベル物理学賞の情報を持っていません。",
      issue: "知識のカットオフ — 訓練データ以降の情報に答えられない",
    },
    ragAnswer: {
      answer:
        "2025年のノーベル物理学賞は、量子コンピューティングの基礎理論への貢献が認められたマーク・ジョンソン博士が受賞しました。（出典: ノーベル財団公式発表 2025年10月）",
      source: "ノーベル財団公式プレスリリース（2025年10月10日）",
    },
  },
  {
    question: "御社の返品ポリシーを教えてください。",
    llmOnly: {
      answer:
        "一般的に、多くのオンラインショップでは購入後30日以内の返品が可能です。商品が未開封であれば全額返金されることが多いです。",
      issue:
        "ハルシネーション — 具体的なポリシーを知らないのに、一般論を「もっともらしく」回答している",
    },
    ragAnswer: {
      answer:
        "当社の返品ポリシーは以下の通りです：購入後14日以内、未開封の商品に限り返品を受け付けます。返品送料はお客様負担となります。（出典: FAQ #12）",
      source: "社内FAQ文書 #12「返品・交換について」",
    },
  },
  {
    question:
      "新しい社内勤怠システムの打刻方法を教えてください。",
    llmOnly: {
      answer:
        "一般的な勤怠システムでは、Webブラウザからログインして出勤・退勤ボタンを押すか、ICカードをリーダーにかざす方法が多いです。",
      issue:
        "専門知識の限界 — 社内固有の情報を知らないため、一般論しか答えられない",
    },
    ragAnswer: {
      answer:
        "新しい勤怠システム「KintaiPro」の打刻手順：1. スマートフォンアプリを起動 2. 社員QRコードをスキャン 3. 位置情報の確認後、打刻完了。テレワーク時はVPN接続なしで利用可能です。（出典: 社内マニュアル v2.1）",
      source: "社内IT部門マニュアル「KintaiPro利用ガイド v2.1」",
    },
  },
];

export default function RAGConceptDemo() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const scenario = SCENARIOS[selectedScenario];

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        質問を選んで、LLM単体とRAGの回答を比較しましょう
      </h3>

      {/* Question selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => setSelectedScenario(i)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              i === selectedScenario
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            質問 {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-xs font-semibold text-zinc-400">質問</span>
        <p className="mt-1 font-medium text-zinc-800 dark:text-zinc-200">
          {scenario.question}
        </p>
      </div>

      {/* Side by side comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* LLM only */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-4 dark:border-red-800/50 dark:bg-red-900/10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <svg
                className="h-3.5 w-3.5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-red-700 dark:text-red-400">
              LLM単体
            </span>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {scenario.llmOnly.answer}
          </p>
          <div className="mt-3 rounded-lg bg-red-100/80 p-2.5 dark:bg-red-900/30">
            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
              問題点
            </span>
            <p className="mt-0.5 text-xs text-red-700 dark:text-red-300">
              {scenario.llmOnly.issue}
            </p>
          </div>
        </div>

        {/* RAG */}
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <svg
                className="h-3.5 w-3.5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
              RAG（検索+生成）
            </span>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {scenario.ragAnswer.answer}
          </p>
          <div className="mt-3 rounded-lg bg-emerald-100/80 p-2.5 dark:bg-emerald-900/30">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              情報ソース
            </span>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-300">
              {scenario.ragAnswer.source}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
