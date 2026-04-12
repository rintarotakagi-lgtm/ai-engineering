"use client";

import { useState, useEffect, useCallback } from "react";

// --- Network structure ---
// Inputs: x1=2, x2=3
// Hidden: h1 = sigmoid(x1*w1 + x2*w3 + b1), h2 = sigmoid(x1*w2 + x2*w4 + b2)
// Output: y = sigmoid(h1*w5 + h2*w6 + b3)

const WEIGHTS = { w1: 0.5, w2: -0.3, w3: 0.8, w4: 0.2, w5: 0.6, w6: -0.4, b1: 0.1, b2: -0.2, b3: 0.3 };
const INPUTS = { x1: 2.0, x2: 3.0 };

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

interface NodeInfo {
  id: string;
  label: string;
  x: number;
  y: number;
  value: number | null;
  desc: string;
}

interface EdgeInfo {
  from: string;
  to: string;
  label: string;
}

function computeForward() {
  const { x1, x2 } = INPUTS;
  const { w1, w2, w3, w4, w5, w6, b1, b2, b3 } = WEIGHTS;

  const z1 = x1 * w1 + x2 * w3 + b1;
  const h1 = sigmoid(z1);
  const z2 = x1 * w2 + x2 * w4 + b2;
  const h2 = sigmoid(z2);
  const z3 = h1 * w5 + h2 * w6 + b3;
  const out = sigmoid(z3);

  return { z1, h1, z2, h2, z3, out };
}

const SVG_W = 640;
const SVG_H = 340;

export default function ComputationGraph() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const vals = computeForward();

  const nodes: NodeInfo[] = [
    { id: "x1", label: "x₁", x: 60, y: 100, value: INPUTS.x1, desc: "入力1" },
    { id: "x2", label: "x₂", x: 60, y: 240, value: INPUTS.x2, desc: "入力2" },
    { id: "z1", label: "Σ+b₁", x: 240, y: 80, value: step >= 1 ? vals.z1 : null, desc: "重み付き和" },
    { id: "z2", label: "Σ+b₂", x: 240, y: 260, value: step >= 1 ? vals.z2 : null, desc: "重み付き和" },
    { id: "h1", label: "σ", x: 380, y: 80, value: step >= 2 ? vals.h1 : null, desc: "活性化(隠れ層)" },
    { id: "h2", label: "σ", x: 380, y: 260, value: step >= 2 ? vals.h2 : null, desc: "活性化(隠れ層)" },
    { id: "z3", label: "Σ+b₃", x: 480, y: 170, value: step >= 3 ? vals.z3 : null, desc: "重み付き和" },
    { id: "out", label: "σ", x: 590, y: 170, value: step >= 4 ? vals.out : null, desc: "出力" },
  ];

  const edges: EdgeInfo[] = [
    { from: "x1", to: "z1", label: `w₁=${WEIGHTS.w1}` },
    { from: "x1", to: "z2", label: `w₂=${WEIGHTS.w2}` },
    { from: "x2", to: "z1", label: `w₃=${WEIGHTS.w3}` },
    { from: "x2", to: "z2", label: `w₄=${WEIGHTS.w4}` },
    { from: "z1", to: "h1", label: "" },
    { from: "z2", to: "h2", label: "" },
    { from: "h1", to: "z3", label: `w₅=${WEIGHTS.w5}` },
    { from: "h2", to: "z3", label: `w₆=${WEIGHTS.w6}` },
    { from: "z3", to: "out", label: "" },
  ];

  // Which edges are active at each step
  const edgeSteps: Record<number, string[]> = {
    1: ["x1-z1", "x1-z2", "x2-z1", "x2-z2"],
    2: ["z1-h1", "z2-h2"],
    3: ["h1-z3", "h2-z3"],
    4: ["z3-out"],
  };

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const stepLabels = [
    "初期状態：入力値が設定されています",
    "Step 1：入力 × 重み + バイアスを計算",
    "Step 2：シグモイド活性化を適用",
    "Step 3：隠れ層 × 重み + バイアスを計算",
    "Step 4：出力のシグモイド活性化",
  ];

  const animate = useCallback(() => {
    setStep(0);
    setIsAnimating(true);
    let s = 0;
    const timer = setInterval(() => {
      s += 1;
      setStep(s);
      if (s >= 4) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, 800);
    return () => clearInterval(timer);
  }, []);

  // reset on unmount
  useEffect(() => {
    return () => setStep(0);
  }, []);

  function isEdgeActive(from: string, to: string) {
    const key = `${from}-${to}`;
    for (let s = 1; s <= step; s++) {
      if (edgeSteps[s]?.includes(key)) return true;
    }
    return false;
  }

  function isEdgeCurrent(from: string, to: string) {
    const key = `${from}-${to}`;
    return edgeSteps[step]?.includes(key) ?? false;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-3 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        計算グラフ：順伝播のアニメーション
      </h3>

      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={animate}
          disabled={isAnimating}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
        >
          {isAnimating ? "計算中..." : "▶ Forward Pass"}
        </button>
        <button
          onClick={() => setStep(0)}
          disabled={isAnimating}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {stepLabels[step]}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        style={{ maxWidth: 640 }}
      >
        {/* Edges */}
        {edges.map((e) => {
          const fn = nodeMap[e.from];
          const tn = nodeMap[e.to];
          const active = isEdgeActive(e.from, e.to);
          const current = isEdgeCurrent(e.from, e.to);
          const mx = (fn.x + tn.x) / 2;
          const my = (fn.y + tn.y) / 2;
          return (
            <g key={`${e.from}-${e.to}`}>
              <line
                x1={fn.x + 24}
                y1={fn.y}
                x2={tn.x - 24}
                y2={tn.y}
                stroke={current ? "#f59e0b" : active ? "#a3a3a3" : "#d4d4d8"}
                strokeWidth={current ? 2.5 : 1.5}
                strokeDasharray={active ? "none" : "4 4"}
              />
              {e.label && (
                <text
                  x={mx}
                  y={my - 8}
                  textAnchor="middle"
                  className="text-[10px]"
                  fill={active ? "#71717a" : "#a1a1aa"}
                >
                  {e.label}
                </text>
              )}
              {/* Animated dot */}
              {current && (
                <circle r={4} fill="#f59e0b">
                  <animateMotion
                    dur="0.6s"
                    repeatCount="1"
                    path={`M${fn.x + 24},${fn.y} L${tn.x - 24},${tn.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const hasValue = n.value !== null;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={24}
                fill={hasValue ? "#fffbeb" : "#fafafa"}
                stroke={hasValue ? "#f59e0b" : "#d4d4d8"}
                strokeWidth={hasValue ? 2 : 1.5}
              />
              <text
                x={n.x}
                y={n.y - 4}
                textAnchor="middle"
                className="text-xs font-bold"
                fill={hasValue ? "#92400e" : "#71717a"}
              >
                {n.label}
              </text>
              {hasValue && (
                <text
                  x={n.x}
                  y={n.y + 12}
                  textAnchor="middle"
                  className="text-[11px] font-mono font-semibold"
                  fill="#d97706"
                >
                  {n.value!.toFixed(3)}
                </text>
              )}
              <text
                x={n.x}
                y={n.y + 38}
                textAnchor="middle"
                className="text-[10px]"
                fill="#a1a1aa"
              >
                {n.desc}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-amber-600">ポイント：</span>
          順伝播では、入力から出力に向かって各ノードの値を計算・記録します。
          この記録された値が、逆伝播で勾配を計算する際に必要になります。
        </p>
      </div>
    </div>
  );
}
