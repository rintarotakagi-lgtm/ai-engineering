"use client";

import { useState } from "react";

interface Step {
  id: number;
  title: string;
  label: string;
  input: string;
  output: string;
  explanation: string;
}

const STEPS: Step[] = [
  {
    id: 0,
    title: "ユーザーの質問",
    label: "入力",
    input: "",
    output: "「リモートワーク時の経費精算はどうすればいいですか？」",
    explanation: "ユーザーが自然言語で質問を入力します。",
  },
  {
    id: 1,
    title: "質問のベクトル化",
    label: "埋め込み",
    input: "「リモートワーク時の経費精算はどうすればいいですか？」",
    output: "[0.23, -0.15, 0.87, 0.42, -0.31, ... ]  (768次元)",
    explanation:
      "埋め込みモデルが質問テキストをベクトル（数値の配列）に変換します。文書のインデックス作成時と同じモデルを使います。",
  },
  {
    id: 2,
    title: "ベクトル検索",
    label: "検索",
    input: "質問ベクトル [0.23, -0.15, 0.87, ...]",
    output: `Top-3 検索結果:
1. [類似度: 0.94] 経費精算マニュアル §3.2
2. [類似度: 0.87] リモートワーク規程 §5.1
3. [類似度: 0.82] 総務FAQ #24`,
    explanation:
      "ベクトルデータベースで質問ベクトルに最も近いチャンクを検索し、類似度順にTop-K件を取得します。",
  },
  {
    id: 3,
    title: "コンテキスト注入",
    label: "プロンプト構築",
    input: "検索結果 Top-3 チャンク",
    output: `以下の社内規程を参考に回答してください。

【参考資料1】経費精算マニュアル §3.2:
リモートワーク中の通信費は月額3,000円を上限として精算可能。申請はKintaiProの「経費」タブから...

【参考資料2】リモートワーク規程 §5.1:
自宅での業務に必要な備品は事前申請の上、10,000円まで会社負担...

【参考資料3】総務FAQ #24:
Q.在宅勤務の光熱費は精算できますか？ A.現在の規程では対象外...

【質問】リモートワーク時の経費精算はどうすればいいですか？`,
    explanation:
      "検索結果をプロンプトの「コンテキスト」セクションに埋め込み、質問と一緒にLLMに渡す形に組み立てます。",
  },
  {
    id: 4,
    title: "LLMが回答生成",
    label: "生成",
    input: "コンテキスト付きプロンプト",
    output: `リモートワーク時の経費精算について、以下の通りです。

■ 通信費: 月額3,000円を上限として精算可能です（経費精算マニュアル §3.2）
■ 備品購入: 事前申請の上、10,000円まで会社負担となります（リモートワーク規程 §5.1）
■ 光熱費: 現在の規程では精算対象外です（総務FAQ #24）

申請はKintaiProの「経費」タブから行ってください。`,
    explanation:
      "LLMが検索結果に基づいて回答を生成します。出典を明記しているので、ユーザーは根拠を確認できます。",
  },
];

export default function PipelineSteps() {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        RAGパイプラインをステップごとに追いかけましょう
      </h3>

      {/* Step progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(i)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                  i === currentStep
                    ? "border-amber-500 bg-amber-500 text-white scale-110"
                    : i < currentStep
                      ? "border-amber-300 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
                      : "border-zinc-300 bg-white text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800"
                }`}
              >
                {i + 1}
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`h-0.5 w-6 sm:w-10 transition-colors ${
                    i < currentStep
                      ? "bg-amber-400"
                      : "bg-zinc-200 dark:bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className="w-10 text-center text-[9px] text-zinc-400 sm:w-14"
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400">
            Step {currentStep + 1}: {step.title}
          </h4>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">
            {step.explanation}
          </p>
        </div>

        {step.input && (
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Input
            </span>
            <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-600 dark:text-zinc-400">
              {step.input}
            </pre>
          </div>
        )}

        <div className="rounded-lg border-2 border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/10">
          <span className="mb-1 inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Output
          </span>
          <pre className="whitespace-pre-wrap font-mono text-xs text-zinc-700 dark:text-zinc-300">
            {step.output}
          </pre>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 disabled:opacity-30 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          前のステップ
        </button>
        <button
          onClick={() =>
            setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1))
          }
          disabled={currentStep === STEPS.length - 1}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-30"
        >
          次のステップ
        </button>
      </div>
    </div>
  );
}
