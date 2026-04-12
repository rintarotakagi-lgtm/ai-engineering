"use client";

import { useState, useMemo } from "react";

// Small network: 2 inputs -> 2 hidden (sigmoid) -> 1 output (sigmoid)
// MSE loss: L = 0.5 * (y - ŷ)^2

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}
function sigmoidDeriv(z: number) {
  const s = sigmoid(z);
  return s * (1 - s);
}

const INIT = {
  x1: 1.0,
  x2: 0.5,
  w1: 0.4,
  w2: -0.2,
  w3: 0.6,
  w4: 0.3,
  w5: 0.7,
  w6: -0.5,
  b1: 0.1,
  b2: -0.1,
  b3: 0.2,
  target: 1.0,
};

function computeAll(p: typeof INIT) {
  // Forward
  const z1 = p.x1 * p.w1 + p.x2 * p.w3 + p.b1;
  const h1 = sigmoid(z1);
  const z2 = p.x1 * p.w2 + p.x2 * p.w4 + p.b2;
  const h2 = sigmoid(z2);
  const z3 = h1 * p.w5 + h2 * p.w6 + p.b3;
  const yhat = sigmoid(z3);
  const loss = 0.5 * (p.target - yhat) ** 2;

  // Backward
  const dL_dyhat = -(p.target - yhat);
  const dL_dz3 = dL_dyhat * sigmoidDeriv(z3);
  const dL_dw5 = dL_dz3 * h1;
  const dL_dw6 = dL_dz3 * h2;
  const dL_db3 = dL_dz3;
  const dL_dh1 = dL_dz3 * p.w5;
  const dL_dh2 = dL_dz3 * p.w6;
  const dL_dz1 = dL_dh1 * sigmoidDeriv(z1);
  const dL_dz2 = dL_dh2 * sigmoidDeriv(z2);
  const dL_dw1 = dL_dz1 * p.x1;
  const dL_dw3 = dL_dz1 * p.x2;
  const dL_db1 = dL_dz1;
  const dL_dw2 = dL_dz2 * p.x1;
  const dL_dw4 = dL_dz2 * p.x2;
  const dL_db2 = dL_dz2;

  return {
    forward: { z1, h1, z2, h2, z3, yhat, loss },
    backward: {
      dL_dyhat, dL_dz3, dL_dw5, dL_dw6, dL_db3,
      dL_dh1, dL_dh2, dL_dz1, dL_dz2,
      dL_dw1, dL_dw3, dL_db1, dL_dw2, dL_dw4, dL_db2,
    },
  };
}

type Phase = "forward" | "loss" | "backward";

interface StepInfo {
  phase: Phase;
  title: string;
  description: string;
  highlights: string[];
  values: { label: string; value: number }[];
}

export default function BackpropStep() {
  const [step, setStep] = useState(0);
  const data = useMemo(() => computeAll(INIT), []);

  const steps: StepInfo[] = [
    {
      phase: "forward",
      title: "Step 1: 隠れ層の重み付き和",
      description: "入力 × 重み + バイアスを計算します",
      highlights: ["z1", "z2"],
      values: [
        { label: "z₁ = x₁w₁ + x₂w₃ + b₁", value: data.forward.z1 },
        { label: "z₂ = x₁w₂ + x₂w₄ + b₂", value: data.forward.z2 },
      ],
    },
    {
      phase: "forward",
      title: "Step 2: 隠れ層の活性化",
      description: "シグモイド関数を適用します",
      highlights: ["h1", "h2"],
      values: [
        { label: "h₁ = σ(z₁)", value: data.forward.h1 },
        { label: "h₂ = σ(z₂)", value: data.forward.h2 },
      ],
    },
    {
      phase: "forward",
      title: "Step 3: 出力層の計算",
      description: "隠れ層の出力 × 重み + バイアス → シグモイド",
      highlights: ["z3", "yhat"],
      values: [
        { label: "z₃ = h₁w₅ + h₂w₆ + b₃", value: data.forward.z3 },
        { label: "ŷ = σ(z₃)", value: data.forward.yhat },
      ],
    },
    {
      phase: "loss",
      title: "Step 4: 損失の計算",
      description: "予測値と正解値の差を計算します（MSE）",
      highlights: ["loss"],
      values: [
        { label: `L = 0.5(y - ŷ)² = 0.5(${INIT.target} - ${data.forward.yhat.toFixed(4)})²`, value: data.forward.loss },
      ],
    },
    {
      phase: "backward",
      title: "Step 5: 出力層の勾配",
      description: "損失から出力に向かって勾配を計算します",
      highlights: ["dL_dyhat", "dL_dz3"],
      values: [
        { label: "∂L/∂ŷ = -(y - ŷ)", value: data.backward.dL_dyhat },
        { label: "∂L/∂z₃ = ∂L/∂ŷ · σ'(z₃)", value: data.backward.dL_dz3 },
      ],
    },
    {
      phase: "backward",
      title: "Step 6: 出力層の重み勾配",
      description: "w₅, w₆, b₃ の勾配を計算します",
      highlights: ["dL_dw5", "dL_dw6", "dL_db3"],
      values: [
        { label: "∂L/∂w₅ = ∂L/∂z₃ · h₁", value: data.backward.dL_dw5 },
        { label: "∂L/∂w₆ = ∂L/∂z₃ · h₂", value: data.backward.dL_dw6 },
        { label: "∂L/∂b₃ = ∂L/∂z₃", value: data.backward.dL_db3 },
      ],
    },
    {
      phase: "backward",
      title: "Step 7: 隠れ層への勾配伝播",
      description: "勾配を隠れ層に逆伝播させます",
      highlights: ["dL_dh1", "dL_dh2", "dL_dz1", "dL_dz2"],
      values: [
        { label: "∂L/∂h₁ = ∂L/∂z₃ · w₅", value: data.backward.dL_dh1 },
        { label: "∂L/∂h₂ = ∂L/∂z₃ · w₆", value: data.backward.dL_dh2 },
        { label: "∂L/∂z₁ = ∂L/∂h₁ · σ'(z₁)", value: data.backward.dL_dz1 },
        { label: "∂L/∂z₂ = ∂L/∂h₂ · σ'(z₂)", value: data.backward.dL_dz2 },
      ],
    },
    {
      phase: "backward",
      title: "Step 8: 入力層の重み勾配",
      description: "w₁〜w₄, b₁, b₂ の勾配を計算します",
      highlights: ["dL_dw1", "dL_dw2", "dL_dw3", "dL_dw4"],
      values: [
        { label: "∂L/∂w₁ = ∂L/∂z₁ · x₁", value: data.backward.dL_dw1 },
        { label: "∂L/∂w₂ = ∂L/∂z₂ · x₁", value: data.backward.dL_dw2 },
        { label: "∂L/∂w₃ = ∂L/∂z₁ · x₂", value: data.backward.dL_dw3 },
        { label: "∂L/∂w₄ = ∂L/∂z₂ · x₂", value: data.backward.dL_dw4 },
      ],
    },
  ];

  const currentStep = steps[step];

  const phaseColor = {
    forward: "bg-blue-500",
    loss: "bg-red-500",
    backward: "bg-amber-500",
  };

  const phaseLabel = {
    forward: "順伝播",
    loss: "損失計算",
    backward: "逆伝播",
  };

  // SVG network diagram
  const SVG_W = 520;
  const SVG_H = 220;

  type NPos = { id: string; label: string; x: number; y: number };
  const nodePositions: NPos[] = [
    { id: "x1", label: "x₁", x: 60, y: 70 },
    { id: "x2", label: "x₂", x: 60, y: 150 },
    { id: "h1", label: "h₁", x: 220, y: 70 },
    { id: "h2", label: "h₂", x: 220, y: 150 },
    { id: "yhat", label: "ŷ", x: 380, y: 110 },
    { id: "loss", label: "L", x: 480, y: 110 },
  ];

  const nodeMap = Object.fromEntries(nodePositions.map((n) => [n.id, n]));

  const networkEdges = [
    { from: "x1", to: "h1" }, { from: "x1", to: "h2" },
    { from: "x2", to: "h1" }, { from: "x2", to: "h2" },
    { from: "h1", to: "yhat" }, { from: "h2", to: "yhat" },
    { from: "yhat", to: "loss" },
  ];

  // Determine which nodes are "active" at this step
  function getNodeState(id: string): "active" | "gradient" | "idle" {
    if (currentStep.phase === "forward") {
      if (step === 0 && (id === "h1" || id === "h2")) return "active";
      if (step === 1 && (id === "h1" || id === "h2")) return "active";
      if (step === 2 && (id === "yhat")) return "active";
    }
    if (currentStep.phase === "loss" && id === "loss") return "active";
    if (currentStep.phase === "backward") {
      if (step === 4 && id === "yhat") return "gradient";
      if (step === 5 && id === "yhat") return "gradient";
      if (step === 6 && (id === "h1" || id === "h2")) return "gradient";
      if (step === 7 && (id === "x1" || id === "x2")) return "gradient";
    }
    return "idle";
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        逆伝播ステップバイステップ
      </h3>

      {/* Network diagram */}
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="mb-4 w-full" style={{ maxWidth: 520 }}>
        {/* Direction arrow */}
        {currentStep.phase === "backward" && (
          <text x={SVG_W / 2} y={18} textAnchor="middle" className="text-xs font-bold" fill="#f59e0b">
            ← 勾配の流れ（逆伝播）
          </text>
        )}
        {currentStep.phase === "forward" && (
          <text x={SVG_W / 2} y={18} textAnchor="middle" className="text-xs font-bold" fill="#3b82f6">
            データの流れ（順伝播）→
          </text>
        )}

        {/* Edges */}
        {networkEdges.map((e) => {
          const fn = nodeMap[e.from];
          const tn = nodeMap[e.to];
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={fn.x + 22}
              y1={fn.y}
              x2={tn.x - 22}
              y2={tn.y}
              stroke="#d4d4d8"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Nodes */}
        {nodePositions.map((n) => {
          const state = getNodeState(n.id);
          let fill = "#fafafa";
          let stroke = "#d4d4d8";
          if (state === "active") { fill = "#dbeafe"; stroke = "#3b82f6"; }
          if (state === "gradient") { fill = "#fef3c7"; stroke = "#f59e0b"; }
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth={2} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" className="text-xs font-bold" fill="#374151">
                {n.label}
              </text>
            </g>
          );
        })}

        {/* Layer labels */}
        <text x={60} y={205} textAnchor="middle" className="text-[10px]" fill="#a1a1aa">入力層</text>
        <text x={220} y={205} textAnchor="middle" className="text-[10px]" fill="#a1a1aa">隠れ層</text>
        <text x={380} y={205} textAnchor="middle" className="text-[10px]" fill="#a1a1aa">出力層</text>
        <text x={480} y={205} textAnchor="middle" className="text-[10px]" fill="#a1a1aa">損失</text>
      </svg>

      {/* Current step info */}
      <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mb-2 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${phaseColor[currentStep.phase]}`}>
            {phaseLabel[currentStep.phase]}
          </span>
          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
            {currentStep.title}
          </span>
        </div>
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
          {currentStep.description}
        </p>

        {/* Values */}
        <div className="space-y-2">
          {currentStep.values.map((v, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-zinc-900"
            >
              <span className="font-mono text-sm text-zinc-600 dark:text-zinc-300">
                {v.label}
              </span>
              <span className="font-mono text-sm font-bold text-amber-600">
                {v.value.toFixed(6)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3 flex gap-1">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-2 flex-1 rounded-full transition ${
              i === step
                ? phaseColor[s.phase]
                : i < step
                ? "bg-zinc-300 dark:bg-zinc-600"
                : "bg-zinc-200 dark:bg-zinc-700"
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          ← 前へ
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step >= steps.length - 1}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          次へ →
        </button>
        <span className="text-xs text-zinc-400">
          {step + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}
