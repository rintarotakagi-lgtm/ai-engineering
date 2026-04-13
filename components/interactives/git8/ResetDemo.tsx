"use client";

import { useState } from "react";

type ResetMode = "soft" | "mixed" | "hard";

interface AreaState {
  commits: string[];
  staging: string[];
  working: string[];
}

export default function ResetDemo(): React.ReactElement {
  const [mode, setMode] = useState<ResetMode>("soft");
  const [hasReset, setHasReset] = useState(false);

  const beforeState: AreaState = {
    commits: ["A: 初期コミット", "B: ヘッダー変更", "C: フッター追加"],
    staging: [],
    working: [],
  };

  const afterStates: Record<ResetMode, AreaState> = {
    soft: {
      commits: ["A: 初期コミット", "B: ヘッダー変更"],
      staging: ["フッター追加の変更（ステージング済み）"],
      working: [],
    },
    mixed: {
      commits: ["A: 初期コミット", "B: ヘッダー変更"],
      staging: [],
      working: ["フッター追加の変更（未ステージング）"],
    },
    hard: {
      commits: ["A: 初期コミット", "B: ヘッダー変更"],
      staging: [],
      working: [],
    },
  };

  const modeInfo: Record<ResetMode, { label: string; command: string; description: string; danger: string }> = {
    soft: {
      label: "--soft",
      command: "git reset --soft HEAD~1",
      description: "コミットだけ取り消し。変更はステージングに残る。すぐに再コミットできる。",
      danger: "安全",
    },
    mixed: {
      label: "--mixed（デフォルト）",
      command: "git reset HEAD~1",
      description: "コミットを取り消し、ステージングも解除。変更はファイルに残る。",
      danger: "安全",
    },
    hard: {
      label: "--hard",
      command: "git reset --hard HEAD~1",
      description: "コミットを取り消し、変更も完全に削除。すべてがなかったことに。",
      danger: "危険！元に戻せません",
    },
  };

  const current = modeInfo[mode];
  const state = hasReset ? afterStates[mode] : beforeState;

  function areaColor(area: "commits" | "staging" | "working"): string {
    if (!hasReset) return "border-zinc-200 bg-zinc-50";
    if (area === "commits") return "border-emerald-200 bg-emerald-50";
    if (area === "staging" && afterStates[mode].staging.length > 0)
      return "border-amber-200 bg-amber-50";
    if (area === "working" && afterStates[mode].working.length > 0)
      return "border-blue-200 bg-blue-50";
    return "border-zinc-200 bg-zinc-50";
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2 flex-wrap">
        {(["soft", "mixed", "hard"] as ResetMode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setHasReset(false);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium font-mono transition ${
              mode === m
                ? m === "hard"
                  ? "bg-red-500 text-white"
                  : "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {modeInfo[m].label}
          </button>
        ))}
      </div>

      {/* Command */}
      <div className="bg-zinc-900 rounded-lg px-4 py-2 font-mono text-amber-400 text-sm">
        $ {current.command}
      </div>

      {/* Three areas visualization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Commits */}
        <div className={`border rounded-lg p-3 ${areaColor("commits")}`}>
          <div className="text-xs font-bold text-zinc-500 mb-2">
            コミット履歴
          </div>
          {state.commits.map((c, i) => (
            <div
              key={i}
              className="text-xs font-mono bg-white border rounded p-1.5 mb-1"
            >
              {c}
            </div>
          ))}
          {hasReset && (
            <div className="text-xs text-red-400 font-mono line-through mt-1">
              C: フッター追加
            </div>
          )}
        </div>

        {/* Staging */}
        <div className={`border rounded-lg p-3 ${areaColor("staging")}`}>
          <div className="text-xs font-bold text-zinc-500 mb-2">
            ステージング
          </div>
          {state.staging.length > 0 ? (
            state.staging.map((s, i) => (
              <div
                key={i}
                className="text-xs font-mono bg-white border border-amber-200 rounded p-1.5 mb-1 text-amber-700"
              >
                {s}
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-400 italic">空</div>
          )}
        </div>

        {/* Working directory */}
        <div className={`border rounded-lg p-3 ${areaColor("working")}`}>
          <div className="text-xs font-bold text-zinc-500 mb-2">
            作業ディレクトリ
          </div>
          {state.working.length > 0 ? (
            state.working.map((w, i) => (
              <div
                key={i}
                className="text-xs font-mono bg-white border border-blue-200 rounded p-1.5 mb-1 text-blue-700"
              >
                {w}
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-400 italic">
              {hasReset && mode === "hard" ? "変更は完全に削除" : "空"}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div
        className={`rounded-lg p-3 text-sm ${
          mode === "hard" && hasReset
            ? "bg-red-50 border border-red-200 text-red-800"
            : "bg-amber-50 border border-amber-200 text-amber-800"
        }`}
      >
        <div className="font-bold mb-1">{current.description}</div>
        <div
          className={`text-xs font-medium ${
            current.danger === "安全" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          安全度: {current.danger}
        </div>
      </div>

      <button
        onClick={() => setHasReset(!hasReset)}
        className={`px-4 py-2 rounded-lg text-sm text-white ${
          hasReset
            ? "bg-zinc-500 hover:bg-zinc-600"
            : mode === "hard"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        {hasReset ? "リセット前に戻す" : "git reset を実行"}
      </button>
    </div>
  );
}
