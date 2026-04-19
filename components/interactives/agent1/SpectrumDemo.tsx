"use client";

import { useState } from "react";

interface SpectrumLevel {
  id: number;
  label: string;
  description: string;
  useCases: string[];
  complexity: string;
  icon: string;
}

const LEVELS: SpectrumLevel[] = [
  {
    id: 0,
    label: "単一LLM呼び出し",
    description:
      "プロンプトを送って応答を得る、最もシンプルな形。プロンプトエンジニアリングだけで解決できるタスクに最適。",
    useCases: [
      "テキストの要約・翻訳",
      "メールの下書き生成",
      "コードの説明",
    ],
    complexity: "低",
    icon: "1",
  },
  {
    id: 1,
    label: "拡張LLM",
    description:
      "LLMにツール・検索・メモリを追加して強化する。外部情報へのアクセスやアクションの実行が可能に。",
    useCases: [
      "Web検索を使った質問応答",
      "電卓を使った計算タスク",
      "社内文書を参照した回答（RAG）",
    ],
    complexity: "中低",
    icon: "1+",
  },
  {
    id: 2,
    label: "ワークフロー",
    description:
      "複数のLLM呼び出しを事前に定義した手順で組み合わせる。人間が設計したパイプライン。",
    useCases: [
      "文書の要約→翻訳のチェーン",
      "問い合わせの分類→専門処理",
      "コード生成→テスト→修正ループ",
    ],
    complexity: "中",
    icon: "N",
  },
  {
    id: 3,
    label: "エージェント",
    description:
      "LLMが自律的に次の行動を決定する。環境からのフィードバックに基づいて動的にプランを調整。",
    useCases: [
      "複雑なコーディングタスク",
      "オープンエンドなリサーチ",
      "マルチステップの問題解決",
    ],
    complexity: "高",
    icon: "A",
  },
];

export default function SpectrumDemo() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        各レベルをクリックして詳細を確認しましょう
      </h3>

      {/* Spectrum bar */}
      <div className="relative mb-8 mt-6">
        {/* Gradient line */}
        <div className="absolute left-0 right-0 top-5 h-1.5 rounded-full bg-gradient-to-r from-zinc-200 via-amber-300 to-amber-600 dark:from-zinc-700 dark:via-amber-600 dark:to-amber-400" />

        {/* Arrow labels */}
        <div className="absolute -top-4 left-0 text-[10px] font-medium text-zinc-400">
          シンプル
        </div>
        <div className="absolute -top-4 right-0 text-[10px] font-medium text-zinc-400">
          複雑
        </div>

        {/* Level nodes */}
        <div className="relative flex justify-between">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() =>
                setSelected(selected === level.id ? null : level.id)
              }
              className="group flex flex-col items-center"
            >
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                  selected === level.id
                    ? "border-amber-500 bg-amber-500 text-white scale-110 shadow-lg shadow-amber-500/25"
                    : "border-zinc-300 bg-white text-zinc-500 hover:border-amber-400 hover:text-amber-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-amber-500"
                }`}
              >
                {level.icon}
              </div>
              <span
                className={`mt-2 max-w-[80px] text-center text-[11px] font-medium leading-tight ${
                  selected === level.id
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {level.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected !== null && (
        <div className="animate-in fade-in slide-in-from-top-2 rounded-lg border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800/50 dark:bg-amber-900/10">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200">
              {LEVELS[selected].label}
            </h4>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              複雑さ: {LEVELS[selected].complexity}
            </span>
          </div>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            {LEVELS[selected].description}
          </p>
          <div>
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              ユースケース
            </span>
            <ul className="mt-1.5 space-y-1">
              {LEVELS[selected].useCases.map((uc, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  {uc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selected === null && (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50">
          上のノードをクリックすると、各レベルの詳細が表示されます
        </div>
      )}
    </div>
  );
}
