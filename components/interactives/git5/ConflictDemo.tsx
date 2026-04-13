"use client";

import { useState } from "react";

type Phase = "setup" | "conflict" | "resolve" | "done";

export default function ConflictDemo(): React.ReactElement {
  const [phase, setPhase] = useState<Phase>("setup");
  const [choice, setChoice] = useState<"ours" | "theirs" | "both" | null>(null);

  const mainChange = "background-color: blue;";
  const featureChange = "background-color: red;";

  function startMerge(): void {
    setPhase("conflict");
    setChoice(null);
  }

  function resolve(option: "ours" | "theirs" | "both"): void {
    setChoice(option);
    setPhase("resolve");
  }

  function finishResolve(): void {
    setPhase("done");
  }

  function resetDemo(): void {
    setPhase("setup");
    setChoice(null);
  }

  const resolvedContent =
    choice === "ours"
      ? mainChange
      : choice === "theirs"
        ? featureChange
        : `${mainChange}\n${featureChange}`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      {phase === "setup" && (
        <>
          <div className="text-sm text-zinc-600 mb-3">
            2つのブランチが <strong>style.css</strong> の同じ行を変更しています。マージするとどうなるでしょう？
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <div className="font-bold text-emerald-700 text-sm mb-2">main ブランチ</div>
              <div className="bg-white rounded p-2 font-mono text-xs">
                <span className="text-zinc-400">/* style.css */</span>
                <br />
                body {"{"} <span className="text-emerald-600">{mainChange}</span> {"}"}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="font-bold text-amber-700 text-sm mb-2">feature ブランチ</div>
              <div className="bg-white rounded p-2 font-mono text-xs">
                <span className="text-zinc-400">/* style.css */</span>
                <br />
                body {"{"} <span className="text-amber-600">{featureChange}</span> {"}"}
              </div>
            </div>
          </div>
          <button
            onClick={startMerge}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
          >
            git merge feature を実行
          </button>
        </>
      )}

      {phase === "conflict" && (
        <>
          <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-800">
            <strong>コンフリクト発生！</strong> 同じ行が変更されているため、自動マージできません。
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm leading-relaxed">
            <div className="text-zinc-400">/* style.css */</div>
            <div className="text-zinc-300">body {"{"}</div>
            <div className="text-red-400">{"<<<<<<< HEAD (mainの変更)"}</div>
            <div className="text-emerald-400 pl-4">{mainChange}</div>
            <div className="text-yellow-400">{"======="}</div>
            <div className="text-amber-400 pl-4">{featureChange}</div>
            <div className="text-red-400">{">>>>>>> feature (featureの変更)"}</div>
            <div className="text-zinc-300">{"}"}</div>
          </div>
          <div className="text-sm text-zinc-600">どちらの変更を採用しますか？</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => resolve("ours")}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600"
            >
              mainの変更を採用
            </button>
            <button
              onClick={() => resolve("theirs")}
              className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
            >
              featureの変更を採用
            </button>
            <button
              onClick={() => resolve("both")}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600"
            >
              両方取り入れる
            </button>
          </div>
        </>
      )}

      {phase === "resolve" && (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            コンフリクトマーカーを削除して、内容を確定します。
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm leading-relaxed">
            <div className="text-zinc-400">/* style.css - 解決済み */</div>
            <div className="text-zinc-300">body {"{"}</div>
            <div className="text-emerald-400 pl-4 whitespace-pre-line">{resolvedContent}</div>
            <div className="text-zinc-300">{"}"}</div>
          </div>
          <button
            onClick={finishResolve}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600"
          >
            git add & git commit で解決を確定
          </button>
        </>
      )}

      {phase === "done" && (
        <>
          <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">&#10003;</div>
            <div className="font-bold text-emerald-800">コンフリクト解決完了！</div>
            <div className="text-sm text-emerald-600 mt-1">
              マージが成功しました。コンフリクトは怖くありません。
              <br />
              落ち着いてマーカーを見て、どちらの変更を残すか決めるだけです。
            </div>
          </div>
          <button
            onClick={resetDemo}
            className="px-4 py-2 bg-zinc-100 text-zinc-600 rounded-lg text-sm hover:bg-zinc-200"
          >
            もう一度やる
          </button>
        </>
      )}
    </div>
  );
}
