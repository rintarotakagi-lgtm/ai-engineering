"use client";

import { useState } from "react";

interface DocResult {
  id: number;
  title: string;
  snippet: string;
  foundByKeyword: boolean;
  foundBySemantic: boolean;
}

interface SearchScenario {
  query: string;
  results: DocResult[];
}

const SCENARIOS: SearchScenario[] = [
  {
    query: "ISO 27001の認証取得手順",
    results: [
      {
        id: 1,
        title: "情報セキュリティ認証ガイド",
        snippet: "ISO 27001認証の取得には、まずISMSの適用範囲を決定し...",
        foundByKeyword: true,
        foundBySemantic: true,
      },
      {
        id: 2,
        title: "セキュリティ監査レポート 2024",
        snippet: "ISO 27001:2022の要求事項に基づく内部監査を実施...",
        foundByKeyword: true,
        foundBySemantic: false,
      },
      {
        id: 3,
        title: "情報管理体制の構築方法",
        snippet: "国際標準に準拠したセキュリティマネジメントシステムを構築する手順...",
        foundByKeyword: false,
        foundBySemantic: true,
      },
      {
        id: 4,
        title: "コンプライアンス推進マニュアル",
        snippet: "各種認証取得のロードマップと、審査に向けた準備事項の一覧...",
        foundByKeyword: false,
        foundBySemantic: true,
      },
    ],
  },
  {
    query: "GPT-4oの料金プラン",
    results: [
      {
        id: 1,
        title: "OpenAI API 料金表 2024",
        snippet: "GPT-4o: 入力 $5/1M tokens、出力 $15/1M tokens...",
        foundByKeyword: true,
        foundBySemantic: true,
      },
      {
        id: 2,
        title: "LLM API比較レポート",
        snippet: "主要なLLMのAPI料金を比較。GPT-4o、Claude、Geminiの...",
        foundByKeyword: true,
        foundBySemantic: false,
      },
      {
        id: 3,
        title: "AI導入コスト試算",
        snippet: "大規模言語モデルのAPI利用コストを試算する方法。月間トークン数の見積もり...",
        foundByKeyword: false,
        foundBySemantic: true,
      },
      {
        id: 4,
        title: "ChatGPT Plusの機能比較",
        snippet: "有料プランで利用できるモデルの性能差と、ビジネス利用での費用対効果...",
        foundByKeyword: false,
        foundBySemantic: true,
      },
    ],
  },
];

type SearchMode = "keyword" | "semantic" | "hybrid";

export default function HybridSearchDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [mode, setMode] = useState<SearchMode>("keyword");

  const scenario = SCENARIOS[scenarioIndex];

  const filteredResults = scenario.results.filter((r) => {
    if (mode === "keyword") return r.foundByKeyword;
    if (mode === "semantic") return r.foundBySemantic;
    return r.foundByKeyword || r.foundBySemantic; // hybrid
  });

  const keywordCount = scenario.results.filter((r) => r.foundByKeyword).length;
  const semanticCount = scenario.results.filter((r) => r.foundBySemantic).length;
  const hybridCount = scenario.results.filter(
    (r) => r.foundByKeyword || r.foundBySemantic
  ).length;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        検索方法を切り替えて、見つかる文書の違いを確認しましょう
      </h3>

      {/* Scenario selector */}
      <div className="mb-4 flex gap-2">
        {SCENARIOS.map((s, i) => (
          <button
            key={i}
            onClick={() => setScenarioIndex(i)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              i === scenarioIndex
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            クエリ {i + 1}
          </button>
        ))}
      </div>

      {/* Query */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-xs font-bold text-zinc-400">検索クエリ</span>
        <p className="mt-0.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {scenario.query}
        </p>
      </div>

      {/* Mode selector */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {([
          { key: "keyword" as SearchMode, label: "キーワード検索", count: keywordCount, color: "blue" },
          { key: "semantic" as SearchMode, label: "セマンティック検索", count: semanticCount, color: "violet" },
          { key: "hybrid" as SearchMode, label: "ハイブリッド検索", count: hybridCount, color: "amber" },
        ]).map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`rounded-xl border-2 p-3 text-center transition-all ${
              mode === m.key
                ? m.key === "keyword"
                  ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                  : m.key === "semantic"
                    ? "border-violet-300 bg-violet-50 dark:border-violet-700 dark:bg-violet-900/20"
                    : "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
                : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
            }`}
          >
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {m.label}
            </span>
            <p className="mt-1 text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {m.count}件
            </p>
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {result.title}
              </span>
              <div className="flex gap-1">
                {result.foundByKeyword && (
                  <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    KW
                  </span>
                )}
                {result.foundBySemantic && (
                  <span className="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-bold text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                    SEM
                  </span>
                )}
              </div>
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {result.snippet}
            </p>
          </div>
        ))}
      </div>

      {/* Insight */}
      {mode === "hybrid" && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            ハイブリッド検索は、キーワード検索でしか見つからない文書（型番・固有名詞の完全一致）と、セマンティック検索でしか見つからない文書（意味的に関連する表現）の両方をカバーします。
          </p>
        </div>
      )}
    </div>
  );
}
