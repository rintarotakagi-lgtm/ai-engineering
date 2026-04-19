"use client";

import { useState } from "react";

interface Scenario {
  source: string;
  question: string;
  answers: {
    text: string;
    parts: { text: string; grounded: boolean }[];
    isGood: boolean;
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    source:
      "当社の有給休暇は入社6ヶ月後に10日付与されます。翌年以降は勤続年数に応じて増加し、最大20日です。未消化分は翌年度に限り繰り越し可能です。",
    question: "有給休暇の日数と繰り越しについて教えてください。",
    answers: [
      {
        text: "入社6ヶ月後に10日付与。最大20日まで増加。未消化分は翌年度に限り繰り越し可能。",
        parts: [
          { text: "入社6ヶ月後に10日付与。", grounded: true },
          { text: "最大20日まで増加。", grounded: true },
          { text: "未消化分は翌年度に限り繰り越し可能。", grounded: true },
        ],
        isGood: true,
      },
      {
        text: "入社6ヶ月後に10日、最大20日まで増加します。有給の買い取り制度もあり、未消化分は翌年度に繰り越せます。",
        parts: [
          { text: "入社6ヶ月後に10日、最大20日まで増加します。", grounded: true },
          { text: "有給の買い取り制度もあり、", grounded: false },
          { text: "未消化分は翌年度に繰り越せます。", grounded: true },
        ],
        isGood: false,
      },
    ],
  },
  {
    source:
      "弊社のクラウドストレージは、Basicプランで50GB、Proプランで500GBの容量です。ファイルの暗号化はAES-256を採用しています。月額料金はBasicが980円、Proが2,980円です。",
    question: "プランの違いと料金を教えてください。",
    answers: [
      {
        text: "Basicプランは50GBで月額980円、Proプランは500GBで月額2,980円です。両プランともAES-256暗号化に対応しています。",
        parts: [
          {
            text: "Basicプランは50GBで月額980円、Proプランは500GBで月額2,980円です。",
            grounded: true,
          },
          {
            text: "両プランともAES-256暗号化に対応しています。",
            grounded: true,
          },
        ],
        isGood: true,
      },
      {
        text: "BasicプランとProプランがあり、容量は50GBと500GBです。Proプランには優先サポートが含まれ、99.9%のSLA保証があります。",
        parts: [
          {
            text: "BasicプランとProプランがあり、容量は50GBと500GBです。",
            grounded: true,
          },
          {
            text: "Proプランには優先サポートが含まれ、",
            grounded: false,
          },
          {
            text: "99.9%のSLA保証があります。",
            grounded: false,
          },
        ],
        isGood: false,
      },
    ],
  },
];

export default function GroundingDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const scenario = SCENARIOS[scenarioIndex];

  const handleSelect = (ansIdx: number) => {
    setSelectedAnswer(ansIdx);
    setShowResult(true);
  };

  const handleNextScenario = () => {
    setScenarioIndex((s) => (s + 1) % SCENARIOS.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        ソースに基づいた回答（グラウンドされた回答）を見分けましょう
      </h3>

      {/* Source */}
      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          ソース文書
        </span>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
          {scenario.source}
        </p>
      </div>

      {/* Question */}
      <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <span className="text-xs font-bold text-zinc-400">質問</span>
        <p className="mt-0.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {scenario.question}
        </p>
      </div>

      {/* Answer options */}
      <p className="mb-3 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        どちらの回答がソースに基づいていますか？
      </p>
      <div className="space-y-3">
        {scenario.answers.map((ans, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={showResult}
            className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
              showResult
                ? ans.isGood
                  ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/10"
                  : "border-red-300 bg-red-50/50 dark:border-red-700 dark:bg-red-900/10"
                : selectedAnswer === i
                  ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
                  : "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
                回答 {String.fromCharCode(65 + i)}
              </span>
              {showResult && (
                <span
                  className={`text-xs font-bold ${
                    ans.isGood
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {ans.isGood ? "グラウンドされている" : "ハルシネーションあり"}
                </span>
              )}
            </div>

            {showResult ? (
              <p className="text-sm">
                {ans.parts.map((part, pi) => (
                  <span
                    key={pi}
                    className={
                      part.grounded
                        ? "text-zinc-700 dark:text-zinc-300"
                        : "rounded bg-red-100 px-0.5 font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }
                  >
                    {part.text}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {ans.text}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Result explanation */}
      {showResult && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            赤くハイライトされた部分がソースに根拠がない情報（ハルシネーション）です。RAGでは、回答がソースに基づいているか（グラウンドされているか）を常に確認することが重要です。
          </p>
        </div>
      )}

      {/* Next scenario */}
      {showResult && (
        <button
          onClick={handleNextScenario}
          className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
        >
          次のシナリオ
        </button>
      )}
    </div>
  );
}
