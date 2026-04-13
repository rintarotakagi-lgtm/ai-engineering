"use client";

import { useState } from "react";

interface NamingChallenge {
  scenario: string;
  goodName: string;
  badNames: string[];
}

const challenges: NamingChallenge[] = [
  {
    scenario: "ユーザーのプロフィール画像アップロード機能を追加したい",
    goodName: "feature/add-profile-image-upload",
    badNames: ["upload", "my-branch", "feature1"],
  },
  {
    scenario: "ヘッダーのナビゲーションメニューが崩れるバグを修正したい",
    goodName: "fix/header-nav-layout",
    badNames: ["fix", "bug-fix", "test"],
  },
  {
    scenario: "APIドキュメントを最新版に更新したい",
    goodName: "docs/update-api-reference",
    badNames: ["docs", "update", "aaa"],
  },
  {
    scenario: "本番で決済エラーが発生している緊急対応",
    goodName: "hotfix/payment-error",
    badNames: ["fix-asap", "urgent", "hotfix"],
  },
];

export default function NamingDemo(): React.ReactElement {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"good" | "ok" | "bad" | null>(null);

  const challenge = challenges[challengeIdx];

  function checkName(): void {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === challenge.goodName) {
      setResult("good");
    } else if (
      trimmed.includes("/") &&
      trimmed.length > 8 &&
      !challenge.badNames.includes(trimmed)
    ) {
      setResult("ok");
    } else {
      setResult("bad");
    }
  }

  function nextChallenge(): void {
    setChallengeIdx((challengeIdx + 1) % challenges.length);
    setInput("");
    setResult(null);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="text-sm text-zinc-500">
        シナリオに合ったブランチ名を考えてみましょう。
      </div>

      {/* Scenario */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-xs text-blue-500 mb-1">
          問題 {challengeIdx + 1}/{challenges.length}
        </div>
        <div className="font-bold text-blue-800">{challenge.scenario}</div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder="ブランチ名を入力... (例: feature/xxx)"
          className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono"
          onKeyDown={(e) => e.key === "Enter" && checkName()}
        />
        <button
          onClick={checkName}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
        >
          チェック
        </button>
      </div>

      {/* Result */}
      {result === "good" && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-3">
          <div className="font-bold text-emerald-800">素晴らしい！ 完璧なブランチ名です</div>
          <div className="text-sm text-emerald-600 font-mono mt-1">{challenge.goodName}</div>
        </div>
      )}
      {result === "ok" && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
          <div className="font-bold text-amber-800">悪くないですが、もっと良い名前があります</div>
          <div className="text-sm text-amber-600 mt-1">
            模範解答: <code className="font-mono bg-amber-100 px-1 rounded">{challenge.goodName}</code>
          </div>
        </div>
      )}
      {result === "bad" && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3">
          <div className="font-bold text-red-800">改善が必要です</div>
          <div className="text-sm text-red-600 mt-1">
            ポイント: <strong>種類/内容</strong> の形式で、何の作業かわかるように書きましょう。
          </div>
          <div className="text-sm text-red-600 mt-1">
            模範解答: <code className="font-mono bg-red-100 px-1 rounded">{challenge.goodName}</code>
          </div>
        </div>
      )}

      {/* Bad examples */}
      <div className="bg-zinc-50 rounded-lg p-3">
        <div className="text-xs font-bold text-zinc-500 mb-2">NGな例：</div>
        <div className="flex flex-wrap gap-2">
          {challenge.badNames.map((name) => (
            <span
              key={name}
              className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-mono line-through"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={nextChallenge}
        className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
      >
        次の問題
      </button>
    </div>
  );
}
