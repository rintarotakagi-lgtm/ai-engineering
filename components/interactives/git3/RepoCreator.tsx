"use client";

import { useState } from "react";

type Step = 0 | 1 | 2 | 3 | 4;

export default function RepoCreator() {
  const [step, setStep] = useState<Step>(0);
  const [repoName, setRepoName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [addReadme, setAddReadme] = useState(true);
  const [error, setError] = useState("");

  function nextStep() {
    if (step === 1 && !repoName.trim()) {
      setError("リポジトリ名を入力してください");
      return;
    }
    if (step === 1 && /[^a-zA-Z0-9_-]/.test(repoName)) {
      setError("リポジトリ名は英数字、ハイフン、アンダースコアのみ使えます");
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, 4) as Step);
  }

  function reset() {
    setStep(0);
    setRepoName("");
    setDescription("");
    setVisibility("public");
    setAddReadme(true);
    setError("");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                s <= step
                  ? "bg-amber-500 text-white"
                  : "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
              }`}
            >
              {s < step ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                s + 1
              )}
            </div>
            {s < 4 && (
              <div className={`h-0.5 w-8 ${s < step ? "bg-amber-500" : "bg-zinc-200 dark:bg-zinc-700"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="min-h-[200px]">
        {step === 0 && (
          <div>
            <h4 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              新しいリポジトリを作成
            </h4>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
              GitHubでリポジトリを作成するシミュレーションです。実際のGitHubと同じ手順を体験できます。
            </p>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                GitHubにログイン後、右上の「+」ボタン → 「New repository」をクリックすると、この画面が表示されます。
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              リポジトリ名と説明
            </h4>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Repository name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => { setRepoName(e.target.value); setError(""); }}
                  placeholder="my-first-repo"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                />
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="はじめてのリポジトリです"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              公開設定
            </h4>
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  visibility === "public" ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20" : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">Public</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    誰でもこのリポジトリを見ることができます。オープンソースプロジェクトに最適
                  </p>
                </div>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                  visibility === "private" ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20" : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="mt-1 accent-amber-500"
                />
                <div>
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">Private</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    招待した人だけがアクセスできます。社内プロジェクトや個人プロジェクトに最適
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h4 className="mb-4 text-lg font-semibold text-zinc-700 dark:text-zinc-200">
              初期設定
            </h4>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <input
                type="checkbox"
                checked={addReadme}
                onChange={() => setAddReadme(!addReadme)}
                className="mt-1 h-4 w-4 accent-amber-500"
              />
              <div>
                <span className="font-medium text-zinc-700 dark:text-zinc-200">Add a README file</span>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  プロジェクトの説明を書くファイルを自動生成します（推奨）
                </p>
              </div>
            </label>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-green-600 dark:text-green-400">
                リポジトリが作成されました！
              </h4>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  your-name / {repoName || "my-first-repo"}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
                  visibility === "public"
                    ? "border-green-300 text-green-600 dark:border-green-700 dark:text-green-400"
                    : "border-zinc-300 text-zinc-500 dark:border-zinc-600 dark:text-zinc-400"
                }`}>
                  {visibility}
                </span>
              </div>
              {description && (
                <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
              )}
              {addReadme && (
                <div className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-900">
                  <div className="mb-2 border-b border-zinc-200 pb-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">
                    README.md
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    # {repoName || "my-first-repo"}
                  </p>
                  {description && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
                  )}
                </div>
              )}
              <div className="mt-3 rounded bg-zinc-100 p-2 dark:bg-zinc-700">
                <code className="text-xs text-zinc-600 dark:text-zinc-300">
                  git clone https://github.com/your-name/{repoName || "my-first-repo"}.git
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        {step > 0 && step < 4 ? (
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 0) as Step)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            戻る
          </button>
        ) : (
          <div />
        )}
        {step < 4 ? (
          <button
            onClick={nextStep}
            className="rounded-lg bg-amber-500 px-6 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            {step === 3 ? "Create repository" : "次へ"}
          </button>
        ) : (
          <button
            onClick={reset}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            最初からやり直す
          </button>
        )}
      </div>
    </div>
  );
}
