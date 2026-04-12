"use client";

import { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// Example: f(x) = (2x + 1)^2
// g(x) = 2x + 1, f(u) = u^2
// df/dx = df/du * du/dx = 2u * 2 = 4(2x+1)

type Example = {
  name: string;
  outer: string;
  inner: string;
  composed: string;
  outerDeriv: string;
  innerDeriv: string;
  chain: string;
  result: string;
  evalX: number;
  evalSteps: { label: string; value: string }[];
};

const EXAMPLES: Example[] = [
  {
    name: "f(x) = (2x + 1)²",
    outer: "f(u) = u^2",
    inner: "g(x) = 2x + 1",
    composed: "f(g(x)) = (2x + 1)^2",
    outerDeriv: "f'(u) = 2u",
    innerDeriv: "g'(x) = 2",
    chain: "\\frac{df}{dx} = f'(g(x)) \\cdot g'(x) = 2(2x+1) \\cdot 2",
    result: "\\frac{df}{dx} = 4(2x + 1)",
    evalX: 1,
    evalSteps: [
      { label: "x = 1 を代入", value: "" },
      { label: "g(1) = 2(1) + 1 = 3", value: "u = 3" },
      { label: "f'(u) = 2u → f'(3) = 6", value: "外側の微分 = 6" },
      { label: "g'(x) = 2", value: "内側の微分 = 2" },
      { label: "df/dx = 6 × 2 = 12", value: "最終結果 = 12" },
    ],
  },
  {
    name: "f(x) = sin(x²)",
    outer: "f(u) = \\sin(u)",
    inner: "g(x) = x^2",
    composed: "f(g(x)) = \\sin(x^2)",
    outerDeriv: "f'(u) = \\cos(u)",
    innerDeriv: "g'(x) = 2x",
    chain: "\\frac{df}{dx} = \\cos(x^2) \\cdot 2x",
    result: "\\frac{df}{dx} = 2x\\cos(x^2)",
    evalX: 2,
    evalSteps: [
      { label: "x = 2 を代入", value: "" },
      { label: "g(2) = 4", value: "u = 4" },
      { label: "f'(u) = cos(u) → cos(4) ≈ -0.654", value: "外側の微分 ≈ -0.654" },
      { label: "g'(2) = 2(2) = 4", value: "内側の微分 = 4" },
      { label: "df/dx ≈ -0.654 × 4 ≈ -2.614", value: "最終結果 ≈ -2.614" },
    ],
  },
  {
    name: "f(x) = σ(3x) [シグモイド]",
    outer: "f(u) = \\sigma(u) = \\frac{1}{1+e^{-u}}",
    inner: "g(x) = 3x",
    composed: "f(g(x)) = \\sigma(3x)",
    outerDeriv: "f'(u) = \\sigma(u)(1-\\sigma(u))",
    innerDeriv: "g'(x) = 3",
    chain: "\\frac{df}{dx} = \\sigma(3x)(1-\\sigma(3x)) \\cdot 3",
    result: "\\frac{df}{dx} = 3\\sigma(3x)(1-\\sigma(3x))",
    evalX: 0,
    evalSteps: [
      { label: "x = 0 を代入", value: "" },
      { label: "g(0) = 0", value: "u = 0" },
      { label: "σ(0) = 0.5", value: "σ(u) = 0.5" },
      { label: "σ'(0) = 0.5 × 0.5 = 0.25", value: "外側の微分 = 0.25" },
      { label: "g'(0) = 3", value: "内側の微分 = 3" },
      { label: "df/dx = 0.25 × 3 = 0.75", value: "最終結果 = 0.75" },
    ],
  },
];

export default function ChainRuleDemo() {
  const [exIdx, setExIdx] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const ex = EXAMPLES[exIdx];

  function selectExample(i: number) {
    setExIdx(i);
    setRevealStep(0);
  }

  const steps = [
    { label: "合成関数を分解", content: <div className="space-y-1"><p className="text-sm text-zinc-600 dark:text-zinc-300">外側の関数：</p><BlockMath math={ex.outer} /><p className="text-sm text-zinc-600 dark:text-zinc-300">内側の関数：</p><BlockMath math={ex.inner} /></div> },
    { label: "それぞれを微分", content: <div className="space-y-1"><p className="text-sm text-zinc-600 dark:text-zinc-300">外側の微分：</p><BlockMath math={ex.outerDeriv} /><p className="text-sm text-zinc-600 dark:text-zinc-300">内側の微分：</p><BlockMath math={ex.innerDeriv} /></div> },
    { label: "連鎖律で掛け合わせる", content: <div><BlockMath math={ex.chain} /><div className="mt-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20"><p className="text-sm font-semibold text-amber-700 dark:text-amber-400">結果：</p><BlockMath math={ex.result} /></div></div> },
    { label: "具体的な数値で検算", content: <div className="space-y-2">{ex.evalSteps.map((s, i) => (<div key={i} className="flex items-center gap-3 text-sm"><span className="text-zinc-600 dark:text-zinc-300">{s.label}</span>{s.value && <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-amber-700 dark:bg-zinc-800 dark:text-amber-400">{s.value}</span>}</div>))}</div> },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        連鎖律ステップバイステップ
      </h3>

      {/* Example selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {EXAMPLES.map((e, i) => (
          <button
            key={i}
            onClick={() => selectExample(i)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              i === exIdx
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {e.name}
          </button>
        ))}
      </div>

      {/* Composed function */}
      <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
        <p className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">合成関数</p>
        <BlockMath math={ex.composed} />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`rounded-lg border p-4 transition-all ${
              i <= revealStep
                ? "border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-900/10"
                : "border-zinc-200 bg-zinc-50 opacity-40 dark:border-zinc-700 dark:bg-zinc-800"
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  i <= revealStep
                    ? "bg-amber-500 text-white"
                    : "bg-zinc-300 text-zinc-500 dark:bg-zinc-600"
                }`}
              >
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {s.label}
              </span>
            </div>
            {i <= revealStep && <div className="ml-8">{s.content}</div>}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setRevealStep(Math.max(0, revealStep - 1))}
          disabled={revealStep === 0}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← 戻る
        </button>
        <button
          onClick={() => setRevealStep(Math.min(steps.length - 1, revealStep + 1))}
          disabled={revealStep >= steps.length - 1}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          次のステップ →
        </button>
        <span className="text-xs text-zinc-400">
          {revealStep + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}
