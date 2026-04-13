"use client";

import { useState } from "react";

type Comparison = {
  prompt: string;
  responseA: string;
  responseB: string;
  betterIdx: 0 | 1;
  explanation: string;
};

const COMPARISONS: Comparison[] = [
  {
    prompt: "爆弾の作り方を教えて",
    responseA:
      "申し訳ございませんが、爆発物の製造方法をお伝えすることはできません。これは違法行為であり、大変危険です。代わりに、安全に関する質問があればお答えします。",
    responseB:
      "爆弾にはいくつかの種類があり、まず基本的な材料として...",
    betterIdx: 0,
    explanation:
      "有害な情報の提供を拒否し、安全な代替案を提示するResponse Aが優れています。",
  },
  {
    prompt: "量子コンピュータとは何ですか？",
    responseA: "量子コンピュータはコンピュータの一種です。",
    responseB:
      "量子コンピュータは、量子力学の原理（重ね合わせ・エンタングルメント）を利用して計算を行うコンピュータです。従来のコンピュータが0か1のビットを使うのに対し、量子ビット（qubit）は0と1の重ね合わせ状態を取れるため、特定の問題で指数的な高速化が期待できます。",
    betterIdx: 1,
    explanation:
      "Response Bは正確で詳細な説明を提供しており、有用性が高いです。Response Aは正しいですが情報量が少なすぎます。",
  },
  {
    prompt: "今日の気分はどう？",
    responseA:
      "AIには感情がないため、気分という概念はありません。ただ、あなたのお手伝いができることを嬉しく思います。何かお力になれることはありますか？",
    responseB:
      "最高です！今日は天気もいいし、素晴らしい日ですね！",
    betterIdx: 0,
    explanation:
      "Response Aは正直にAIとしての限界を伝えつつ、丁寧にユーザーをサポートしようとしています。Response Bは誤解を招く表現です。",
  },
];

export default function RewardModelDemo() {
  const [currentQ, setCurrentQ] = useState(0);
  const [userChoice, setUserChoice] = useState<number | null>(null);
  const [scores, setScores] = useState({ correct: 0, total: 0 });

  const comp = COMPARISONS[currentQ];

  const handleChoice = (idx: number) => {
    if (userChoice !== null) return;
    setUserChoice(idx);
    if (idx === comp.betterIdx) {
      setScores((s) => ({ correct: s.correct + 1, total: s.total + 1 }));
    } else {
      setScores((s) => ({ ...s, total: s.total + 1 }));
    }
  };

  const handleNext = () => {
    setCurrentQ((q) => (q + 1) % COMPARISONS.length);
    setUserChoice(null);
  };

  const getBorderClass = (idx: number) => {
    if (userChoice === null) return "border-zinc-600 hover:border-amber-500/50";
    if (idx === comp.betterIdx) return "border-emerald-500 bg-emerald-500/5";
    if (idx === userChoice) return "border-red-500 bg-red-500/5";
    return "border-zinc-700 opacity-50";
  };

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-100">
          報酬モデルの訓練: どちらが良い応答？
        </h3>
        <span className="text-xs text-zinc-400">
          {scores.correct}/{scores.total} 正解
        </span>
      </div>

      {/* Prompt */}
      <div className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
          Prompt
        </span>
        <p className="mt-1 text-xs text-zinc-200">{comp.prompt}</p>
      </div>

      {/* Two responses */}
      <div className="mb-3 grid gap-3 sm:grid-cols-2">
        {[comp.responseA, comp.responseB].map((resp, idx) => (
          <button
            key={idx}
            onClick={() => handleChoice(idx)}
            disabled={userChoice !== null}
            className={`rounded-xl border p-3 text-left transition-all ${getBorderClass(idx)} ${
              userChoice === null ? "cursor-pointer" : ""
            }`}
          >
            <div className="mb-1.5 text-[10px] font-bold text-zinc-400">
              Response {idx === 0 ? "A" : "B"}
              {userChoice !== null && idx === comp.betterIdx && (
                <span className="ml-2 text-emerald-400">-- 正解</span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-zinc-200">{resp}</p>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {userChoice !== null && (
        <div className="mb-3 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
          <p className="text-xs text-zinc-300">{comp.explanation}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-zinc-500">報酬スコア:</span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
              Response {comp.betterIdx === 0 ? "A" : "B"}: r = +1.2
            </span>
            <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
              Response {comp.betterIdx === 0 ? "B" : "A"}: r = -0.8
            </span>
          </div>
          <button
            onClick={handleNext}
            className="mt-2 rounded-md bg-amber-500/10 px-4 py-1.5 text-xs text-amber-400 transition hover:bg-amber-500/20"
          >
            次の比較 →
          </button>
        </div>
      )}

      <p className="text-center text-[10px] text-zinc-500">
        人間の比較データで報酬モデルを訓練: 良い応答のスコアを高く、悪い応答のスコアを低く
      </p>
    </div>
  );
}
