"use client";

import { useState } from "react";

const DOCUMENT_TEXT = `人工知能（AI）は、コンピュータに人間のような知的行動をさせる技術です。近年、深層学習の進歩により大きく発展しました。機械学習はAIの一分野で、データからパターンを学習します。教師あり学習、教師なし学習、強化学習の3種類があります。教師あり学習では、正解ラベル付きのデータを使ってモデルを訓練します。自然言語処理（NLP）は、人間の言語をコンピュータに理解・生成させる技術です。チャットボットや翻訳システムに使われています。最近ではTransformerアーキテクチャが主流です。大規模言語モデル（LLM）は、膨大なテキストデータで訓練されたAIモデルです。GPTやClaudeがその代表例です。質問応答、文章生成、要約など多様なタスクをこなせます。RAG（検索拡張生成）は、外部データをLLMに渡して正確な回答を生成する技術です。`;

// Simulate token count as roughly 1 token per 2 characters for Japanese
const TOTAL_TOKENS = Math.ceil(DOCUMENT_TEXT.length / 2);

function chunkBySize(text: string, chunkSize: number): string[] {
  const charSize = chunkSize * 2; // rough char-to-token
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += charSize) {
    chunks.push(text.slice(i, i + charSize));
  }
  return chunks;
}

interface TradeoffLevel {
  label: string;
  description: string;
  color: string;
}

function getTradeoff(chunkSize: number): TradeoffLevel {
  if (chunkSize < 80) {
    return {
      label: "小さすぎ",
      description: "文脈が失われ、チャンク数が多すぎてノイズが増える",
      color: "text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    };
  }
  if (chunkSize < 150) {
    return {
      label: "やや小さい",
      description: "短い質問には有効だが、複雑な内容では文脈不足になりがち",
      color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    };
  }
  if (chunkSize <= 400) {
    return {
      label: "適切",
      description: "検索精度と文脈保持のバランスが良い。多くのユースケースに適合",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800",
    };
  }
  if (chunkSize <= 700) {
    return {
      label: "やや大きい",
      description: "文脈は十分だが、検索精度が下がり始める。技術文書向け",
      color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
    };
  }
  return {
    label: "大きすぎ",
    description: "ベクトルが平均化され、ピンポイントの検索が困難になる",
    color: "text-red-500 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
  };
}

export default function ChunkSizeDemo() {
  const [chunkSize, setChunkSize] = useState(200);
  const chunks = chunkBySize(DOCUMENT_TEXT, chunkSize);
  const tradeoff = getTradeoff(chunkSize);

  const barMax = 800;
  const precisionScore = chunkSize < 200 ? 90 : chunkSize < 400 ? 75 : chunkSize < 600 ? 50 : 30;
  const contextScore = chunkSize < 100 ? 20 : chunkSize < 300 ? 60 : chunkSize < 500 ? 85 : 95;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        スライダーでチャンクサイズを変更して、影響を確認しましょう
      </h3>

      {/* Slider */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            チャンクサイズ
          </label>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            {chunkSize} トークン
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={barMax}
          step={50}
          value={chunkSize}
          onChange={(e) => setChunkSize(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-amber-500 dark:bg-zinc-700"
        />
        <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
          <span>50</span>
          <span>200</span>
          <span>400</span>
          <span>600</span>
          <span>800</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <span className="text-xs text-zinc-400">チャンク数</span>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {chunks.length}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <span className="text-xs text-zinc-400">総トークン数</span>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {TOTAL_TOKENS}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-700 dark:bg-zinc-800">
          <span className="text-xs text-zinc-400">平均サイズ</span>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
            {Math.round(TOTAL_TOKENS / chunks.length)}
          </p>
        </div>
      </div>

      {/* Tradeoff bars */}
      <div className="mb-4 space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">検索精度</span>
            <span className="font-medium text-zinc-600 dark:text-zinc-300">{precisionScore}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${precisionScore}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">文脈保持</span>
            <span className="font-medium text-zinc-600 dark:text-zinc-300">{contextScore}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${contextScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tradeoff assessment */}
      <div className={`rounded-lg border p-3 ${tradeoff.color}`}>
        <span className="text-xs font-bold">{tradeoff.label}</span>
        <p className="mt-0.5 text-xs">{tradeoff.description}</p>
      </div>
    </div>
  );
}
