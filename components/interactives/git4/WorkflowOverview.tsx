"use client";

import { useState, useEffect } from "react";

const STEPS = [
  { label: "clone", desc: "GitHubからコピー", color: "#8b5cf6", icon: "download" },
  { label: "edit", desc: "ファイルを編集", color: "#3b82f6", icon: "edit" },
  { label: "add", desc: "ステージングに追加", color: "#f59e0b", icon: "plus" },
  { label: "commit", desc: "スナップショット保存", color: "#10b981", icon: "save" },
  { label: "push", desc: "GitHubにアップロード", color: "#ef4444", icon: "upload" },
];

export default function WorkflowOverview() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  function play() {
    setActiveStep(0);
    setIsPlaying(true);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        Gitの基本ワークフロー -- 5つのステップ
      </h3>

      {/* Steps */}
      <div className="mb-6 flex items-start justify-between gap-2">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-1 flex-col items-center">
            {/* Arrow connector */}
            <div className="flex w-full items-center">
              {i > 0 && (
                <div
                  className="h-0.5 flex-1 transition-colors duration-300"
                  style={{ backgroundColor: i <= activeStep ? STEPS[i - 1].color : "#d4d4d8" }}
                />
              )}
              <button
                onClick={() => { setActiveStep(i); setIsPlaying(false); }}
                className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: i <= activeStep ? step.color : "#d4d4d8",
                  backgroundColor: i <= activeStep ? step.color : "transparent",
                  transform: i === activeStep ? "scale(1.15)" : "scale(1)",
                }}
              >
                <span className={`text-lg ${i <= activeStep ? "text-white" : "text-zinc-400"}`}>
                  {i === activeStep ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      {step.icon === "download" && <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />}
                      {step.icon === "edit" && <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
                      {step.icon === "plus" && <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />}
                      {step.icon === "save" && <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />}
                      {step.icon === "upload" && <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />}
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{i + 1}</span>
                  )}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className="h-0.5 flex-1 transition-colors duration-300"
                  style={{ backgroundColor: i < activeStep ? step.color : "#d4d4d8" }}
                />
              )}
            </div>
            <span
              className="mt-2 text-center text-xs font-bold transition-colors"
              style={{ color: i <= activeStep ? step.color : "#a1a1aa" }}
            >
              git {step.label}
            </span>
            <span className="text-center text-[10px] text-zinc-400 dark:text-zinc-500">
              {step.desc}
            </span>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div
        className="mb-4 rounded-lg border p-4 transition-colors"
        style={{ borderColor: STEPS[activeStep].color + "40", backgroundColor: STEPS[activeStep].color + "10" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: STEPS[activeStep].color }} />
          <span className="text-sm font-semibold" style={{ color: STEPS[activeStep].color }}>
            git {STEPS[activeStep].label}
          </span>
        </div>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {activeStep === 0 && "GitHubにあるリポジトリを自分のパソコンにコピーします。最初の1回だけ実行。全てのファイルと履歴がダウンロードされます。"}
          {activeStep === 1 && "普段通りにファイルを編集します。テキストエディタで開いて、コードや文章を書きます。この段階ではGitは何もしていません。"}
          {activeStep === 2 && "変更したファイルの中から、今回保存したいものを選びます。「お買い物カゴに入れる」イメージです。"}
          {activeStep === 3 && "ステージングエリアにあるファイルをまとめてスナップショット保存します。メッセージを付けて「何をしたか」を記録します。"}
          {activeStep === 4 && "ローカルで作ったコミットをGitHubにアップロードします。これでチームメンバーがあなたの変更を見られるようになります。"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={play}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          {isPlaying ? "再生中..." : "自動再生"}
        </button>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          各ステップをクリックしても確認できます
        </p>
      </div>

      {/* Repeat indicator */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
        <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          clone は最初の1回だけ。その後は edit → add → commit → push の繰り返し
        </span>
      </div>
    </div>
  );
}
