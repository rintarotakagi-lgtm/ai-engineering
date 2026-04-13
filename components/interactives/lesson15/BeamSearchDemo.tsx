"use client";

import { useState, useMemo } from "react";

type TreeNode = {
  token: string;
  logProb: number;
  cumLogProb: number;
  depth: number;
  children: TreeNode[];
  pruned: boolean;
};

// Pre-defined beam search tree data
const VOCABULARY: Record<string, { token: string; logProb: number }[]> = {
  "ROOT": [
    { token: "今日", logProb: -0.5 },
    { token: "明日", logProb: -0.9 },
    { token: "天気", logProb: -1.2 },
    { token: "気温", logProb: -1.8 },
    { token: "空", logProb: -2.1 },
  ],
  "今日": [
    { token: "は", logProb: -0.3 },
    { token: "の", logProb: -0.8 },
    { token: "も", logProb: -1.5 },
    { token: "から", logProb: -2.0 },
    { token: "こそ", logProb: -2.3 },
  ],
  "明日": [
    { token: "は", logProb: -0.4 },
    { token: "の", logProb: -0.7 },
    { token: "も", logProb: -1.3 },
    { token: "から", logProb: -1.9 },
    { token: "まで", logProb: -2.5 },
  ],
  "天気": [
    { token: "は", logProb: -0.2 },
    { token: "が", logProb: -0.6 },
    { token: "予報", logProb: -1.4 },
    { token: "の", logProb: -1.6 },
    { token: "情報", logProb: -2.2 },
  ],
  "気温": [
    { token: "は", logProb: -0.3 },
    { token: "が", logProb: -0.7 },
    { token: "の", logProb: -1.5 },
    { token: "も", logProb: -2.0 },
    { token: "上昇", logProb: -2.4 },
  ],
  "空": [
    { token: "は", logProb: -0.3 },
    { token: "が", logProb: -0.5 },
    { token: "の", logProb: -1.1 },
    { token: "を", logProb: -1.8 },
    { token: "模様", logProb: -2.6 },
  ],
};

function buildBeamTree(beamWidth: number): TreeNode[] {
  const rootCandidates = VOCABULARY["ROOT"];

  // Depth 0: pick top beamWidth
  const depth0 = rootCandidates
    .slice(0, 5)
    .map((c) => ({
      token: c.token,
      logProb: c.logProb,
      cumLogProb: c.logProb,
      depth: 0,
      children: [] as TreeNode[],
      pruned: false,
    }))
    .sort((a, b) => b.cumLogProb - a.cumLogProb);

  // Mark pruned at depth 0
  depth0.forEach((node, i) => {
    node.pruned = i >= beamWidth;
  });

  // Depth 1: expand kept nodes
  const keptDepth0 = depth0.filter((n) => !n.pruned);
  const allDepth1Candidates: { parent: TreeNode; node: TreeNode }[] = [];

  for (const parent of keptDepth0) {
    const nextTokens = VOCABULARY[parent.token] || [];
    for (const nt of nextTokens.slice(0, 3)) {
      const child: TreeNode = {
        token: nt.token,
        logProb: nt.logProb,
        cumLogProb: parent.cumLogProb + nt.logProb,
        depth: 1,
        children: [],
        pruned: false,
      };
      allDepth1Candidates.push({ parent, node: child });
    }
  }

  // Sort all depth-1 candidates and keep top beamWidth
  allDepth1Candidates.sort((a, b) => b.node.cumLogProb - a.node.cumLogProb);
  allDepth1Candidates.forEach((c, i) => {
    c.node.pruned = i >= beamWidth;
    c.parent.children.push(c.node);
  });

  return depth0;
}

const NODE_W = 56;
const NODE_H = 32;
const LEVEL_GAP_X = 140;
const START_X = 30;

export default function BeamSearchDemo() {
  const [beamWidth, setBeamWidth] = useState(3);

  const tree = useMemo(() => buildBeamTree(beamWidth), [beamWidth]);

  // Layout nodes for SVG
  type LayoutNode = {
    token: string;
    cumLogProb: number;
    pruned: boolean;
    x: number;
    y: number;
    parentX?: number;
    parentY?: number;
  };

  const layoutNodes: LayoutNode[] = [];

  // Depth 0
  const d0Count = tree.length;
  tree.forEach((node, i) => {
    const x = START_X + LEVEL_GAP_X * 0;
    const y = 30 + i * (260 / Math.max(d0Count - 1, 1));
    layoutNodes.push({
      token: node.token,
      cumLogProb: node.cumLogProb,
      pruned: node.pruned,
      x,
      y,
    });

    // Depth 1
    node.children.forEach((child, j) => {
      const cx = START_X + LEVEL_GAP_X * 1;
      const cy = y - 30 + j * 30;
      layoutNodes.push({
        token: child.token,
        cumLogProb: child.cumLogProb,
        pruned: child.pruned,
        x: cx,
        y: cy,
        parentX: x + NODE_W,
        parentY: y,
      });
    });
  });

  const svgH = 300;
  const svgW = 380;

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
      <h3 className="mb-3 text-sm font-bold text-zinc-100">
        ビームサーチ: 複数候補の並行探索
      </h3>

      <div className="mb-1 text-xs text-zinc-400">
        プロンプト: 「今日の天気は」→ 次の系列を探索
      </div>

      {/* Beam width slider */}
      <div className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 p-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-300">
            ビーム幅 (B): <span className="font-bold text-amber-400">{beamWidth}</span>
          </label>
          <span className="text-[10px] text-zinc-500">
            {beamWidth === 1 ? "= Greedy Decoding" : `上位${beamWidth}個の候補を保持`}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={beamWidth}
          onChange={(e) => setBeamWidth(parseInt(e.target.value))}
          className="mt-2 w-full accent-amber-500"
        />
      </div>

      {/* Tree visualization */}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full">
        <defs>
          <marker id="beamArrow" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4 Z" fill="#52525b" />
          </marker>
          <marker id="beamArrowActive" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <path d="M0,0 L6,2 L0,4 Z" fill="#f59e0b" />
          </marker>
        </defs>

        {/* Level labels */}
        <text x={START_X + NODE_W / 2} y={15} textAnchor="middle" className="text-[9px] fill-zinc-500">
          深さ 0
        </text>
        <text x={START_X + LEVEL_GAP_X + NODE_W / 2} y={15} textAnchor="middle" className="text-[9px] fill-zinc-500">
          深さ 1
        </text>

        {/* Arrows */}
        {layoutNodes
          .filter((n) => n.parentX !== undefined)
          .map((n, i) => (
            <line
              key={`arrow-${i}`}
              x1={n.parentX!}
              y1={n.parentY!}
              x2={n.x}
              y2={n.y}
              stroke={n.pruned ? "#3f3f46" : "#71717a"}
              strokeWidth={n.pruned ? 0.5 : 1}
              strokeDasharray={n.pruned ? "3,3" : undefined}
              markerEnd={n.pruned ? undefined : "url(#beamArrow)"}
              className="transition-all duration-300"
            />
          ))}

        {/* Nodes */}
        {layoutNodes.map((n, i) => {
          const isKept = !n.pruned;
          return (
            <g key={`node-${i}`}>
              <rect
                x={n.x}
                y={n.y - NODE_H / 2}
                width={NODE_W}
                height={NODE_H}
                rx={6}
                fill={n.pruned ? "#18181b" : isKept ? "#27272a" : "#27272a"}
                stroke={n.pruned ? "#27272a" : "#f59e0b"}
                strokeWidth={n.pruned ? 0.5 : 1.5}
                opacity={n.pruned ? 0.4 : 1}
                className="transition-all duration-300"
              />
              <text
                x={n.x + NODE_W / 2}
                y={n.y - 2}
                textAnchor="middle"
                className={`text-[10px] font-bold select-none ${
                  n.pruned ? "fill-zinc-600" : "fill-white"
                }`}
              >
                {n.token}
              </text>
              <text
                x={n.x + NODE_W / 2}
                y={n.y + 10}
                textAnchor="middle"
                className={`text-[8px] select-none ${
                  n.pruned ? "fill-zinc-700" : "fill-zinc-400"
                }`}
              >
                {n.cumLogProb.toFixed(1)}
              </text>
              {n.pruned && (
                <line
                  x1={n.x + 2}
                  y1={n.y - NODE_H / 2 + 2}
                  x2={n.x + NODE_W - 2}
                  y2={n.y + NODE_H / 2 - 2}
                  stroke="#ef4444"
                  strokeWidth={1}
                  opacity={0.4}
                />
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${svgW - 120}, ${svgH - 50})`}>
          <rect x={0} y={0} width={8} height={8} rx={2} fill="#27272a" stroke="#f59e0b" strokeWidth={1} />
          <text x={12} y={8} className="text-[8px] fill-zinc-400">保持された候補</text>
          <rect x={0} y={14} width={8} height={8} rx={2} fill="#18181b" stroke="#27272a" strokeWidth={0.5} opacity={0.4} />
          <text x={12} y={22} className="text-[8px] fill-zinc-500">枝刈りされた候補</text>
        </g>
      </svg>

      <p className="mt-2 text-center text-[10px] text-zinc-500">
        各ステップでスコア上位B個の候補を保持し、残りを枝刈り。数値は累積対数確率。
      </p>
    </div>
  );
}
