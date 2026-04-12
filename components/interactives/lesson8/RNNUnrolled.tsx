"use client";

import { useState, useEffect, useCallback } from "react";

const SVG_W = 600;
const SVG_H = 280;
const CELL_W = 60;
const CELL_H = 50;
const GAP = 100;
const START_X = 40;
const CENTER_Y = SVG_H / 2;
const STEPS = 5;

type ViewMode = "folded" | "unrolled";

function RNNCell({
  x,
  y,
  label,
  highlight,
}: {
  x: number;
  y: number;
  label: string;
  highlight: boolean;
}) {
  return (
    <g>
      <rect
        x={x - CELL_W / 2}
        y={y - CELL_H / 2}
        width={CELL_W}
        height={CELL_H}
        rx={8}
        fill={highlight ? "#f59e0b" : "#3f3f46"}
        stroke={highlight ? "#fbbf24" : "#71717a"}
        strokeWidth={2}
        className="transition-all duration-500"
      />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        className="text-[11px] fill-white font-bold select-none"
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  highlight,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  highlight: boolean;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={highlight ? "#fbbf24" : "#71717a"}
      strokeWidth={highlight ? 2.5 : 1.5}
      strokeDasharray={dashed ? "5 3" : undefined}
      markerEnd={highlight ? "url(#arrowAmber)" : "url(#arrowGray)"}
      className="transition-all duration-500"
    />
  );
}

export default function RNNUnrolled() {
  const [mode, setMode] = useState<ViewMode>("folded");
  const [activeStep, setActiveStep] = useState(-1);
  const [animating, setAnimating] = useState(false);

  const toggleMode = useCallback(() => {
    setActiveStep(-1);
    setMode((m) => (m === "folded" ? "unrolled" : "folded"));
  }, []);

  const animate = useCallback(() => {
    if (mode !== "unrolled") return;
    setAnimating(true);
    setActiveStep(-1);
    let step = 0;
    const iv = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= STEPS) {
        clearInterval(iv);
        setTimeout(() => setAnimating(false), 600);
      }
    }, 600);
    return () => clearInterval(iv);
  }, [mode]);

  // Reset animation when switching to folded
  useEffect(() => {
    if (mode === "folded") {
      setActiveStep(-1);
      setAnimating(false);
    }
  }, [mode]);

  // --- Folded view ---
  const foldedCenterX = SVG_W / 2;

  // --- Unrolled positions ---
  const cellPositions = Array.from({ length: STEPS }, (_, i) => ({
    x: START_X + CELL_W / 2 + i * GAP + 30,
    y: CENTER_Y,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={toggleMode}
          className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
            mode === "folded"
              ? "bg-amber-500/20 border-amber-500 text-amber-400"
              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
          }`}
        >
          折りたたみ表示
        </button>
        <button
          onClick={toggleMode}
          className={`px-3 py-1 text-xs font-medium rounded-md border transition-colors ${
            mode === "unrolled"
              ? "bg-amber-500/20 border-amber-500 text-amber-400"
              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
          }`}
        >
          展開表示
        </button>
        {mode === "unrolled" && (
          <button
            onClick={animate}
            disabled={animating}
            className="px-3 py-1 text-xs font-medium rounded-md border bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-400 transition-colors disabled:opacity-50"
          >
            {animating ? "実行中..." : "▶ 隠れ状態の伝播"}
          </button>
        )}
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto bg-zinc-900 rounded-xl border border-zinc-700/50"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrowAmber"
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
            id="arrowGray"
            viewBox="0 0 10 7"
            refX="10"
            refY="3.5"
            markerWidth={8}
            markerHeight={6}
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#71717a" />
          </marker>
        </defs>

        {mode === "folded" ? (
          /* ---------- FOLDED VIEW ---------- */
          <g>
            {/* Self-loop arrow */}
            <path
              d={`M ${foldedCenterX + 20} ${CENTER_Y - CELL_H / 2}
                  C ${foldedCenterX + 60} ${CENTER_Y - 80},
                    ${foldedCenterX - 60} ${CENTER_Y - 80},
                    ${foldedCenterX - 20} ${CENTER_Y - CELL_H / 2}`}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={2}
              markerEnd="url(#arrowAmber)"
            />
            <text
              x={foldedCenterX}
              y={CENTER_Y - 72}
              textAnchor="middle"
              className="text-[10px] fill-amber-400 font-medium"
            >
              h_t
            </text>

            {/* Cell */}
            <RNNCell
              x={foldedCenterX}
              y={CENTER_Y}
              label="RNN"
              highlight
            />

            {/* Input arrow */}
            <Arrow
              x1={foldedCenterX}
              y1={CENTER_Y + CELL_H / 2 + 40}
              x2={foldedCenterX}
              y2={CENTER_Y + CELL_H / 2 + 4}
              highlight={false}
            />
            <text
              x={foldedCenterX}
              y={CENTER_Y + CELL_H / 2 + 55}
              textAnchor="middle"
              className="text-[11px] fill-zinc-400 font-medium"
            >
              x_t
            </text>

            {/* Output arrow */}
            <Arrow
              x1={foldedCenterX + CELL_W / 2 + 4}
              y1={CENTER_Y}
              x2={foldedCenterX + CELL_W / 2 + 50}
              y2={CENTER_Y}
              highlight={false}
            />
            <text
              x={foldedCenterX + CELL_W / 2 + 62}
              y={CENTER_Y + 4}
              textAnchor="start"
              className="text-[11px] fill-zinc-400 font-medium"
            >
              y_t
            </text>
          </g>
        ) : (
          /* ---------- UNROLLED VIEW ---------- */
          <g>
            {cellPositions.map((pos, i) => (
              <g key={i}>
                {/* Input arrow from below */}
                <Arrow
                  x1={pos.x}
                  y1={pos.y + CELL_H / 2 + 40}
                  x2={pos.x}
                  y2={pos.y + CELL_H / 2 + 4}
                  highlight={activeStep === i}
                />
                <text
                  x={pos.x}
                  y={pos.y + CELL_H / 2 + 55}
                  textAnchor="middle"
                  className="text-[10px] fill-zinc-400 font-medium"
                >
                  x_{i + 1}
                </text>

                {/* Output arrow upward */}
                <Arrow
                  x1={pos.x}
                  y1={pos.y - CELL_H / 2 - 4}
                  x2={pos.x}
                  y2={pos.y - CELL_H / 2 - 36}
                  highlight={activeStep === i}
                />
                <text
                  x={pos.x}
                  y={pos.y - CELL_H / 2 - 42}
                  textAnchor="middle"
                  className="text-[10px] fill-zinc-400 font-medium"
                >
                  y_{i + 1}
                </text>

                {/* Cell */}
                <RNNCell
                  x={pos.x}
                  y={pos.y}
                  label={`t=${i + 1}`}
                  highlight={activeStep >= i}
                />

                {/* Hidden state arrow to next cell */}
                {i < STEPS - 1 && (
                  <>
                    <Arrow
                      x1={pos.x + CELL_W / 2 + 4}
                      y1={pos.y}
                      x2={cellPositions[i + 1].x - CELL_W / 2 - 8}
                      y2={pos.y}
                      highlight={activeStep >= i && activeStep > i - 1}
                    />
                    {i === Math.floor(STEPS / 2) - 1 && (
                      <text
                        x={(pos.x + cellPositions[i + 1].x) / 2}
                        y={pos.y - 12}
                        textAnchor="middle"
                        className="text-[9px] fill-amber-400/70 font-medium"
                      >
                        h_t
                      </text>
                    )}
                  </>
                )}
              </g>
            ))}

            {/* h_0 input */}
            <Arrow
              x1={cellPositions[0].x - CELL_W / 2 - 30}
              y1={CENTER_Y}
              x2={cellPositions[0].x - CELL_W / 2 - 8}
              y2={CENTER_Y}
              highlight={false}
              dashed
            />
            <text
              x={cellPositions[0].x - CELL_W / 2 - 38}
              y={CENTER_Y + 4}
              textAnchor="end"
              className="text-[10px] fill-zinc-500 font-medium"
            >
              h_0
            </text>
          </g>
        )}
      </svg>

      {/* Equation */}
      <div className="text-center text-sm font-mono text-zinc-300 bg-zinc-800/60 rounded-lg py-3 px-4 space-y-1">
        <div>
          <span className="text-amber-400">h_t</span> = tanh(
          <span className="text-zinc-400">W_hh</span> ·{" "}
          <span className="text-amber-400">h_{"{t-1}"}</span> +{" "}
          <span className="text-zinc-400">W_xh</span> · x_t +{" "}
          <span className="text-zinc-400">b_h</span>)
        </div>
        <div>
          <span className="text-zinc-400">y_t</span> ={" "}
          <span className="text-zinc-400">W_hy</span> ·{" "}
          <span className="text-amber-400">h_t</span> +{" "}
          <span className="text-zinc-400">b_y</span>
        </div>
      </div>

      <p className="text-xs text-zinc-500 text-center">
        {mode === "folded"
          ? "RNNセルは自己ループで隠れ状態を保持します。展開表示で時間軸を見てみましょう。"
          : "各タイムステップで同じ重みを共有。隠れ状態 h_t が過去の情報を運びます。"}
      </p>
    </div>
  );
}
