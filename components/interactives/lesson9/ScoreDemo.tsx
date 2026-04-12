"use client";

import { useState, useCallback, useRef } from "react";

const SVG_W = 500;
const SVG_H = 360;
const CENTER_X = SVG_W / 2;
const CENTER_Y = 180;
const SCALE = 80;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function dot(a: [number, number], b: [number, number]) {
  return a[0] * b[0] + a[1] * b[1];
}

function magnitude(v: [number, number]) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function cosAngle(a: [number, number], b: [number, number]) {
  const ma = magnitude(a);
  const mb = magnitude(b);
  if (ma < 0.001 || mb < 0.001) return 0;
  return dot(a, b) / (ma * mb);
}

export default function ScoreDemo() {
  const [qVec, setQVec] = useState<[number, number]>([1.5, -0.8]);
  const [kVec, setKVec] = useState<[number, number]>([1.2, -1.0]);
  const [dragging, setDragging] = useState<"q" | "k" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSvgCoords = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      pt.x = clientX;
      pt.y = clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      return { x: svgPt.x, y: svgPt.y };
    },
    []
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;
      const { x, y } = getSvgCoords(e);
      const vx = clamp((x - CENTER_X) / SCALE, -2, 2);
      const vy = clamp((CENTER_Y - y) / SCALE, -2, 2);
      if (dragging === "q") setQVec([vx, vy]);
      else setKVec([vx, vy]);
    },
    [dragging, getSvgCoords]
  );

  const dotProduct = dot(qVec, kVec);
  const d = 2;
  const scaledDot = dotProduct / Math.sqrt(d);
  const cos = cosAngle(qVec, kVec);

  const toSvgX = (v: number) => CENTER_X + v * SCALE;
  const toSvgY = (v: number) => CENTER_Y - v * SCALE;

  const scoreColor =
    dotProduct > 0.5
      ? "text-amber-400"
      : dotProduct < -0.5
        ? "text-blue-400"
        : "text-zinc-400";

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      <div className="text-center text-xs text-zinc-400">
        ベクトルの先端をドラッグして方向を変えてみましょう
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50 touch-none"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMove}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
        onTouchMove={handleMove}
        onTouchEnd={() => setDragging(null)}
      >
        <defs>
          <marker
            id="arrowQ"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth={8}
            markerHeight={6}
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#fbbf24" />
          </marker>
          <marker
            id="arrowK"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth={8}
            markerHeight={6}
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#38bdf8" />
          </marker>
        </defs>

        {/* Grid */}
        {[-2, -1, 0, 1, 2].map((v) => (
          <g key={v}>
            <line
              x1={toSvgX(v)}
              y1={toSvgY(-2)}
              x2={toSvgX(v)}
              y2={toSvgY(2)}
              stroke="#3f3f46"
              strokeWidth={v === 0 ? 1.5 : 0.5}
            />
            <line
              x1={toSvgX(-2)}
              y1={toSvgY(v)}
              x2={toSvgX(2)}
              y2={toSvgY(v)}
              stroke="#3f3f46"
              strokeWidth={v === 0 ? 1.5 : 0.5}
            />
          </g>
        ))}

        {/* Q vector */}
        <line
          x1={CENTER_X}
          y1={CENTER_Y}
          x2={toSvgX(qVec[0])}
          y2={toSvgY(qVec[1])}
          stroke="#fbbf24"
          strokeWidth={2.5}
          markerEnd="url(#arrowQ)"
        />
        {/* Q drag handle */}
        <circle
          cx={toSvgX(qVec[0])}
          cy={toSvgY(qVec[1])}
          r={10}
          fill="rgba(251, 191, 36, 0.3)"
          stroke="#fbbf24"
          strokeWidth={2}
          className="cursor-grab"
          onMouseDown={() => setDragging("q")}
          onTouchStart={() => setDragging("q")}
        />
        <text
          x={toSvgX(qVec[0]) + 14}
          y={toSvgY(qVec[1]) - 8}
          className="text-[12px] fill-amber-400 font-bold select-none"
        >
          Q
        </text>

        {/* K vector */}
        <line
          x1={CENTER_X}
          y1={CENTER_Y}
          x2={toSvgX(kVec[0])}
          y2={toSvgY(kVec[1])}
          stroke="#38bdf8"
          strokeWidth={2.5}
          markerEnd="url(#arrowK)"
        />
        {/* K drag handle */}
        <circle
          cx={toSvgX(kVec[0])}
          cy={toSvgY(kVec[1])}
          r={10}
          fill="rgba(56, 189, 248, 0.3)"
          stroke="#38bdf8"
          strokeWidth={2}
          className="cursor-grab"
          onMouseDown={() => setDragging("k")}
          onTouchStart={() => setDragging("k")}
        />
        <text
          x={toSvgX(kVec[0]) + 14}
          y={toSvgY(kVec[1]) - 8}
          className="text-[12px] fill-sky-400 font-bold select-none"
        >
          K
        </text>

        {/* Angle arc */}
        {magnitude(qVec) > 0.2 && magnitude(kVec) > 0.2 && (
          <path
            d={(() => {
              const r = 30;
              const angleQ = Math.atan2(-qVec[1], qVec[0]);
              const angleK = Math.atan2(-kVec[1], kVec[0]);
              const start = angleQ;
              const end = angleK;
              const sx = CENTER_X + r * Math.cos(start);
              const sy = CENTER_Y + r * Math.sin(start);
              const ex = CENTER_X + r * Math.cos(end);
              const ey = CENTER_Y + r * Math.sin(end);
              const diff = ((end - start + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
              const sweep = diff > 0 ? 1 : 0;
              return `M ${sx} ${sy} A ${r} ${r} 0 0 ${sweep} ${ex} ${ey}`;
            })()}
            fill="none"
            stroke="#a1a1aa"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        )}
      </svg>

      {/* Score display */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
          <div className="text-[10px] text-zinc-500 mb-1">Q ベクトル</div>
          <div className="text-xs font-mono text-amber-400">
            [{qVec[0].toFixed(2)}, {qVec[1].toFixed(2)}]
          </div>
        </div>
        <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
          <div className="text-[10px] text-zinc-500 mb-1">K ベクトル</div>
          <div className="text-xs font-mono text-sky-400">
            [{kVec[0].toFixed(2)}, {kVec[1].toFixed(2)}]
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
          <div className="text-[10px] text-zinc-500 mb-1">ドット積 (Q・K)</div>
          <div className={`text-lg font-mono font-bold ${scoreColor}`}>
            {dotProduct.toFixed(2)}
          </div>
        </div>
        <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
          <div className="text-[10px] text-zinc-500 mb-1">
            スケーリング (/sqrt;d)
          </div>
          <div className={`text-lg font-mono font-bold ${scoreColor}`}>
            {scaledDot.toFixed(2)}
          </div>
        </div>
        <div className="bg-zinc-800/60 rounded-lg p-3 text-center">
          <div className="text-[10px] text-zinc-500 mb-1">cos類似度</div>
          <div className={`text-lg font-mono font-bold ${scoreColor}`}>
            {cos.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4">
        {cos > 0.7 ? (
          <span>
            方向が<span className="text-amber-400">近い</span> → 高スコア
            → 強いAttention
          </span>
        ) : cos < -0.3 ? (
          <span>
            方向が<span className="text-blue-400">逆</span> → 負のスコア
            → 弱いAttention
          </span>
        ) : (
          <span>
            方向が<span className="text-zinc-400">直交に近い</span> →
            スコアは低め
          </span>
        )}
      </div>
    </div>
  );
}
