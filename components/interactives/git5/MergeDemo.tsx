"use client";

import { useState } from "react";

type MergeType = "fast-forward" | "three-way";

interface Step {
  label: string;
  description: string;
  graph: GraphState;
}

interface GraphState {
  mainCommits: string[];
  featureCommits: string[];
  merged: boolean;
  mergeCommit: string | null;
}

export default function MergeDemo(): React.ReactElement {
  const [mergeType, setMergeType] = useState<MergeType>("fast-forward");
  const [step, setStep] = useState(0);

  const ffSteps: Step[] = [
    {
      label: "ブランチ作成",
      description: "mainからfeatureブランチを作成。この時点でmainとfeatureは同じ位置。",
      graph: { mainCommits: ["A", "B"], featureCommits: [], merged: false, mergeCommit: null },
    },
    {
      label: "featureで作業",
      description: "featureブランチでコミットC, Dを追加。mainは進んでいない。",
      graph: { mainCommits: ["A", "B"], featureCommits: ["C", "D"], merged: false, mergeCommit: null },
    },
    {
      label: "Fast-forwardマージ",
      description: "mainが進んでいないので、mainのポインタをfeatureの先頭に移動するだけ。マージコミットは不要。",
      graph: { mainCommits: ["A", "B", "C", "D"], featureCommits: [], merged: true, mergeCommit: null },
    },
  ];

  const threeWaySteps: Step[] = [
    {
      label: "ブランチ作成",
      description: "mainからfeatureブランチを作成。",
      graph: { mainCommits: ["A", "B"], featureCommits: [], merged: false, mergeCommit: null },
    },
    {
      label: "両方で作業",
      description: "featureでC, Dをコミット。同時にmainでもEをコミット。両方が進んでいる。",
      graph: { mainCommits: ["A", "B", "E"], featureCommits: ["C", "D"], merged: false, mergeCommit: null },
    },
    {
      label: "3-wayマージ",
      description: "両方が進んでいるので、新しい「マージコミット」Mを作成して統合。",
      graph: { mainCommits: ["A", "B", "E"], featureCommits: ["C", "D"], merged: true, mergeCommit: "M" },
    },
  ];

  const steps = mergeType === "fast-forward" ? ffSteps : threeWaySteps;
  const current = steps[Math.min(step, steps.length - 1)];
  const g = current.graph;

  const nodeR = 14;

  function renderGraph(): React.ReactElement {
    const w = 480;
    const h = 160;
    const mainY = 50;
    const featureY = 110;
    const startX = 60;
    const gap = 60;

    const nodes: React.ReactElement[] = [];
    const lines: React.ReactElement[] = [];

    // Main branch commits
    g.mainCommits.forEach((label, i) => {
      const x = startX + i * gap;
      if (i > 0) {
        lines.push(
          <line key={`ml-${i}`} x1={x - gap + nodeR} y1={mainY} x2={x - nodeR} y2={mainY} stroke="#10b981" strokeWidth={3} />
        );
      }
      nodes.push(
        <g key={`mc-${i}`}>
          <circle cx={x} cy={mainY} r={nodeR} fill="#10b981" stroke="white" strokeWidth={2} />
          <text x={x} y={mainY + 4} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">{label}</text>
        </g>
      );
    });

    // Feature branch commits
    if (g.featureCommits.length > 0) {
      const branchStart = startX + (g.mainCommits.length > 2 ? 1 : g.mainCommits.length - 1) * gap;
      // Line from main to feature
      lines.push(
        <line key="branch-line" x1={branchStart} y1={mainY + nodeR} x2={branchStart + gap - nodeR} y2={featureY} stroke="#f59e0b" strokeWidth={3} strokeDasharray="4" />
      );
      g.featureCommits.forEach((label, i) => {
        const x = branchStart + (i + 1) * gap;
        if (i > 0) {
          lines.push(
            <line key={`fl-${i}`} x1={x - gap + nodeR} y1={featureY} x2={x - nodeR} y2={featureY} stroke="#f59e0b" strokeWidth={3} />
          );
        }
        nodes.push(
          <g key={`fc-${i}`}>
            <circle cx={x} cy={featureY} r={nodeR} fill="#f59e0b" stroke="white" strokeWidth={2} />
            <text x={x} y={featureY + 4} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">{label}</text>
          </g>
        );
      });

      // Merge commit
      if (g.merged && g.mergeCommit) {
        const mergeX = startX + (g.mainCommits.length) * gap;
        const lastFeatureX = branchStart + g.featureCommits.length * gap;
        lines.push(
          <line key="merge-main" x1={startX + (g.mainCommits.length - 1) * gap + nodeR} y1={mainY} x2={mergeX - nodeR} y2={mainY} stroke="#10b981" strokeWidth={3} />
        );
        lines.push(
          <line key="merge-feat" x1={lastFeatureX} y1={featureY - nodeR} x2={mergeX} y2={mainY + nodeR} stroke="#f59e0b" strokeWidth={3} strokeDasharray="4" />
        );
        nodes.push(
          <g key="merge-node">
            <circle cx={mergeX} cy={mainY} r={nodeR} fill="#8b5cf6" stroke="white" strokeWidth={2} />
            <text x={mergeX} y={mainY + 4} textAnchor="middle" fill="white" fontSize={11} fontWeight="bold">{g.mergeCommit}</text>
          </g>
        );
      }
    }

    // Labels
    nodes.push(
      <text key="main-label" x={10} y={mainY + 4} fill="#10b981" fontSize={12} fontWeight="bold">main</text>
    );
    if (g.featureCommits.length > 0) {
      nodes.push(
        <text key="feat-label" x={10} y={featureY + 4} fill="#f59e0b" fontSize={12} fontWeight="bold">feature</text>
      );
    }

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full max-w-lg mx-auto">
        {lines}
        {nodes}
      </svg>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMergeType("fast-forward"); setStep(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mergeType === "fast-forward" ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          Fast-forward マージ
        </button>
        <button
          onClick={() => { setMergeType("three-way"); setStep(0); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            mergeType === "three-way" ? "bg-purple-500 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          3-way マージ
        </button>
      </div>

      <div className="overflow-x-auto">{renderGraph()}</div>

      <div className="bg-zinc-50 rounded-lg p-4">
        <div className="font-bold text-zinc-800 mb-1">{current.label}</div>
        <div className="text-sm text-zinc-600">{current.description}</div>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full transition ${i <= step ? "bg-amber-400" : "bg-zinc-200"}`} />
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
