"use client";

import { useState } from "react";

type CloneStep = "idle" | "cloning" | "done";

export default function CloneDemo() {
  const [step, setStep] = useState<CloneStep>("idle");

  function startClone() {
    setStep("cloning");
    setTimeout(() => setStep("done"), 2000);
  }

  function reset() {
    setStep("idle");
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
        git clone の流れを視覚的に確認
      </h3>

      <div className="overflow-x-auto">
        <svg viewBox="0 0 600 220" className="w-full min-w-[480px]">
          {/* GitHub side */}
          <rect x={340} y={20} width={240} height={180} rx={12} fill="#fefce8" stroke="#fcd34d" strokeWidth={2} />
          <text x={460} y={50} textAnchor="middle" className="fill-amber-600 text-xs font-bold">
            GitHub
          </text>

          {/* Repo on GitHub */}
          <rect x={370} y={65} width={180} height={110} rx={8} fill="white" stroke="#fbbf24" strokeWidth={1.5} />
          <text x={460} y={85} textAnchor="middle" className="fill-zinc-700 text-[11px] font-medium dark:fill-zinc-200">
            my-project
          </text>
          <line x1={380} y1={95} x2={540} y2={95} stroke="#e5e7eb" strokeWidth={1} />
          {["README.md", "index.html", "style.css", "app.js"].map((f, i) => (
            <text key={f} x={390} y={113 + i * 16} className="fill-zinc-500 text-[10px] dark:fill-zinc-400">
              {f}
            </text>
          ))}
          <text x={460} y={113 + 4 * 16} textAnchor="middle" className="fill-zinc-400 text-[9px]">
            + 全ての変更履歴
          </text>

          {/* Local side */}
          <rect x={20} y={20} width={240} height={180} rx={12} fill="#eff6ff" stroke="#93c5fd" strokeWidth={2} />
          <text x={140} y={50} textAnchor="middle" className="fill-blue-600 text-xs font-bold">
            あなたのPC
          </text>

          {step === "idle" && (
            <text x={140} y={130} textAnchor="middle" className="fill-zinc-400 text-xs">
              （まだ何もありません）
            </text>
          )}

          {step === "cloning" && (
            <g>
              <text x={140} y={120} textAnchor="middle" className="fill-blue-500 text-xs">
                コピー中...
              </text>
              <rect x={70} y={135} width={140} height={8} rx={4} fill="#e5e7eb" />
              <rect x={70} y={135} width={90} height={8} rx={4} fill="#f59e0b">
                <animate attributeName="width" from="0" to="140" dur="2s" fill="freeze" />
              </rect>
            </g>
          )}

          {step === "done" && (
            <g>
              <rect x={50} y={65} width={180} height={110} rx={8} fill="white" stroke="#60a5fa" strokeWidth={1.5} />
              <text x={140} y={85} textAnchor="middle" className="fill-zinc-700 text-[11px] font-medium dark:fill-zinc-200">
                my-project
              </text>
              <line x1={60} y1={95} x2={220} y2={95} stroke="#e5e7eb" strokeWidth={1} />
              {["README.md", "index.html", "style.css", "app.js"].map((f, i) => (
                <text key={f} x={70} y={113 + i * 16} className="fill-zinc-500 text-[10px] dark:fill-zinc-400">
                  {f}
                </text>
              ))}
              <text x={140} y={113 + 4 * 16} textAnchor="middle" className="fill-green-500 text-[9px] font-medium">
                + 全ての変更履歴もコピー済み
              </text>
            </g>
          )}

          {/* Arrow */}
          <line
            x1={340} y1={110} x2={270} y2={110}
            stroke={step === "cloning" ? "#f59e0b" : step === "done" ? "#10b981" : "#d4d4d8"}
            strokeWidth={step === "cloning" ? 3 : 2}
            strokeDasharray={step === "cloning" ? "8,4" : "none"}
          />
          <polygon
            points="275,104 265,110 275,116"
            fill={step === "cloning" ? "#f59e0b" : step === "done" ? "#10b981" : "#d4d4d8"}
          />
          <text x={305} y={100} textAnchor="middle" className="fill-zinc-500 text-[10px] font-medium dark:fill-zinc-400">
            git clone
          </text>
        </svg>
      </div>

      {/* Terminal */}
      <div className="mt-4 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-zinc-500">Terminal</span>
        </div>
        <div className="font-mono text-sm text-green-400">
          <p>
            <span className="text-zinc-500">$</span> git clone https://github.com/user/my-project.git
          </p>
          {step === "cloning" && (
            <p className="text-zinc-400">Cloning into &apos;my-project&apos;...</p>
          )}
          {step === "done" && (
            <>
              <p className="text-zinc-400">Cloning into &apos;my-project&apos;...</p>
              <p className="text-zinc-400">Receiving objects: 100% (42/42), done.</p>
              <p className="text-zinc-400">Resolving deltas: 100% (12/12), done.</p>
              <p className="mt-2">
                <span className="text-zinc-500">$</span> cd my-project
              </p>
              <p>
                <span className="text-zinc-500">$</span> ls
              </p>
              <p className="text-white">README.md  index.html  style.css  app.js</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {step === "idle" && (
          <button
            onClick={startClone}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            git clone を実行
          </button>
        )}
        {step === "done" && (
          <button
            onClick={reset}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            リセット
          </button>
        )}
      </div>
    </div>
  );
}
