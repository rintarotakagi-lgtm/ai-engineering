"use client";

import { useState } from "react";

type Scenario = "no-branch" | "with-branch";

interface FileState {
  name: string;
  content: string;
  editedBy: string;
}

export default function WhyBranch(): React.ReactElement {
  const [scenario, setScenario] = useState<Scenario>("no-branch");
  const [step, setStep] = useState(0);

  const noBranchSteps = [
    {
      label: "初期状態",
      description: "田中さんと佐藤さんが同じmainブランチで作業開始",
      files: [
        { name: "index.html", content: "<h1>トップページ</h1>", editedBy: "" },
      ],
      status: "safe" as const,
    },
    {
      label: "田中さんが編集中",
      description: "田中さんがindex.htmlのヘッダーを変更中...",
      files: [
        {
          name: "index.html",
          content: "<h1>新しいヘッダー</h1>",
          editedBy: "田中",
        },
      ],
      status: "warning" as const,
    },
    {
      label: "佐藤さんも同時に編集！",
      description: "佐藤さんが同じファイルを別の内容に変更してpush！",
      files: [
        {
          name: "index.html",
          content: "<h1>リニューアル！</h1>",
          editedBy: "佐藤",
        },
      ],
      status: "danger" as const,
    },
    {
      label: "衝突発生！",
      description:
        "田中さんの変更が佐藤さんのpushで上書きされた！田中さんの作業が消失...",
      files: [
        {
          name: "index.html",
          content: "<<<< 衝突！どちらの変更？ >>>>",
          editedBy: "衝突",
        },
      ],
      status: "danger" as const,
    },
  ];

  const withBranchSteps = [
    {
      label: "初期状態",
      description: "mainブランチに本番コードがある",
      files: [
        { name: "index.html", content: "<h1>トップページ</h1>", editedBy: "" },
      ],
      status: "safe" as const,
    },
    {
      label: "田中さんがブランチ作成",
      description: "feature/new-header ブランチで安全に作業",
      files: [
        {
          name: "index.html",
          content: "<h1>新しいヘッダー</h1>",
          editedBy: "田中（feature/new-header）",
        },
      ],
      status: "safe" as const,
    },
    {
      label: "佐藤さんもブランチ作成",
      description: "feature/renewal ブランチで安全に作業",
      files: [
        {
          name: "index.html",
          content: "<h1>リニューアル！</h1>",
          editedBy: "佐藤（feature/renewal）",
        },
      ],
      status: "safe" as const,
    },
    {
      label: "順番にマージ",
      description:
        "PRでレビュー → 順番にマージ。コンフリクトがあっても安全に解決できる",
      files: [
        {
          name: "index.html",
          content: "<h1>新しいヘッダー + リニューアル</h1>",
          editedBy: "マージ済み",
        },
      ],
      status: "safe" as const,
    },
  ];

  const steps = scenario === "no-branch" ? noBranchSteps : withBranchSteps;
  const currentStep = steps[Math.min(step, steps.length - 1)];

  const statusColor = {
    safe: "bg-emerald-100 border-emerald-400 text-emerald-800",
    warning: "bg-amber-100 border-amber-400 text-amber-800",
    danger: "bg-red-100 border-red-400 text-red-800",
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setScenario("no-branch");
            setStep(0);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            scenario === "no-branch"
              ? "bg-red-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          ブランチなし（危険）
        </button>
        <button
          onClick={() => {
            setScenario("with-branch");
            setStep(0);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            scenario === "with-branch"
              ? "bg-emerald-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          ブランチあり（安全）
        </button>
      </div>

      <div
        className={`rounded-lg border-2 p-4 ${statusColor[currentStep.status]}`}
      >
        <div className="font-bold text-lg mb-1">{currentStep.label}</div>
        <div className="text-sm">{currentStep.description}</div>
      </div>

      <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm">
        {currentStep.files.map((f: FileState, i: number) => (
          <div key={i} className="mb-2">
            <div className="text-amber-400">📄 {f.name}</div>
            <div className="text-zinc-300 pl-4">{f.content}</div>
            {f.editedBy && (
              <div className="text-zinc-500 pl-4 text-xs">
                編集者: {f.editedBy}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition ${
              i <= step ? "bg-amber-400" : "bg-zinc-200"
            }`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-sm hover:bg-zinc-200 disabled:opacity-40"
        >
          戻る
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600 disabled:opacity-40"
        >
          次へ
        </button>
      </div>
    </div>
  );
}
