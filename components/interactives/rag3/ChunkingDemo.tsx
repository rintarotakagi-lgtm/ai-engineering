"use client";

import { useState } from "react";

type Strategy = "fixed" | "sentence" | "paragraph" | "semantic";

const DOCUMENT = `人工知能（AI）は、コンピュータに人間のような知的行動をさせる技術です。近年、深層学習の進歩により大きく発展しました。

機械学習はAIの一分野で、データからパターンを学習します。教師あり学習、教師なし学習、強化学習の3種類があります。教師あり学習では、正解ラベル付きのデータを使ってモデルを訓練します。

自然言語処理（NLP）は、人間の言語をコンピュータに理解・生成させる技術です。チャットボットや翻訳システムに使われています。最近ではTransformerアーキテクチャが主流です。

大規模言語モデル（LLM）は、膨大なテキストデータで訓練されたAIモデルです。GPTやClaudeがその代表例です。質問応答、文章生成、要約など多様なタスクをこなせます。`;

const STRATEGIES: Record<Strategy, { label: string; description: string; chunks: string[] }> = {
  fixed: {
    label: "固定長分割",
    description: "50文字ごとに機械的に分割。文の途中で切れることがある",
    chunks: (() => {
      const chunks: string[] = [];
      const text = DOCUMENT.replace(/\n\n/g, " ");
      for (let i = 0; i < text.length; i += 50) {
        chunks.push(text.slice(i, i + 50));
      }
      return chunks;
    })(),
  },
  sentence: {
    label: "文単位分割",
    description: "句点（。）で文を区切り、2〜3文ずつまとめる",
    chunks: [
      "人工知能（AI）は、コンピュータに人間のような知的行動をさせる技術です。近年、深層学習の進歩により大きく発展しました。",
      "機械学習はAIの一分野で、データからパターンを学習します。教師あり学習、教師なし学習、強化学習の3種類があります。",
      "教師あり学習では、正解ラベル付きのデータを使ってモデルを訓練します。",
      "自然言語処理（NLP）は、人間の言語をコンピュータに理解・生成させる技術です。チャットボットや翻訳システムに使われています。",
      "最近ではTransformerアーキテクチャが主流です。",
      "大規模言語モデル（LLM）は、膨大なテキストデータで訓練されたAIモデルです。GPTやClaudeがその代表例です。",
      "質問応答、文章生成、要約など多様なタスクをこなせます。",
    ],
  },
  paragraph: {
    label: "段落単位分割",
    description: "空行で区切られた段落をそのまま1チャンクにする",
    chunks: DOCUMENT.split("\n\n"),
  },
  semantic: {
    label: "意味分割",
    description: "話題の切り替わりポイントで分割。最も高精度だが処理コスト大",
    chunks: [
      "人工知能（AI）は、コンピュータに人間のような知的行動をさせる技術です。近年、深層学習の進歩により大きく発展しました。",
      "機械学習はAIの一分野で、データからパターンを学習します。教師あり学習、教師なし学習、強化学習の3種類があります。教師あり学習では、正解ラベル付きのデータを使ってモデルを訓練します。",
      "自然言語処理（NLP）は、人間の言語をコンピュータに理解・生成させる技術です。チャットボットや翻訳システムに使われています。最近ではTransformerアーキテクチャが主流です。",
      "大規模言語モデル（LLM）は、膨大なテキストデータで訓練されたAIモデルです。GPTやClaudeがその代表例です。質問応答、文章生成、要約など多様なタスクをこなせます。",
    ],
  },
};

const COLORS = [
  "bg-amber-100 border-amber-300 dark:bg-amber-900/30 dark:border-amber-700",
  "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
  "bg-emerald-100 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700",
  "bg-violet-100 border-violet-300 dark:bg-violet-900/30 dark:border-violet-700",
  "bg-rose-100 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700",
  "bg-teal-100 border-teal-300 dark:bg-teal-900/30 dark:border-teal-700",
  "bg-fuchsia-100 border-fuchsia-300 dark:bg-fuchsia-900/30 dark:border-fuchsia-700",
  "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
  "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700",
  "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700",
];

export default function ChunkingDemo() {
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const data = STRATEGIES[strategy];

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        同じ文書を異なる戦略で分割 — 切り替えて比較しましょう
      </h3>

      {/* Strategy selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(STRATEGIES) as Strategy[]).map((key) => (
          <button
            key={key}
            onClick={() => setStrategy(key)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              key === strategy
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {STRATEGIES[key].label}
          </button>
        ))}
      </div>

      {/* Strategy description */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold">{data.label}:</span>{" "}
          {data.description}
        </p>
      </div>

      {/* Chunk count */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          チャンク数:
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          {data.chunks.length}
        </span>
      </div>

      {/* Chunks display */}
      <div className="space-y-2">
        {data.chunks.map((chunk, i) => (
          <div
            key={`${strategy}-${i}`}
            className={`rounded-lg border p-3 transition-all ${COLORS[i % COLORS.length]}`}
          >
            <span className="mb-1 inline-block rounded bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-300">
              Chunk {i + 1} ({chunk.length}文字)
            </span>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{chunk}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
