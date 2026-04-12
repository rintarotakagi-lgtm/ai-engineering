"use client";

import React, { useState, useMemo } from "react";

const MAX_POS = 32;
const MAX_DIM = 64;

function computePE(positions: number, dims: number): number[][] {
  const pe: number[][] = [];
  for (let pos = 0; pos < positions; pos++) {
    const row: number[] = [];
    for (let d = 0; d < dims; d++) {
      const i = Math.floor(d / 2);
      const denom = Math.pow(10000, (2 * i) / dims);
      row.push(d % 2 === 0 ? Math.sin(pos / denom) : Math.cos(pos / denom));
    }
    pe.push(row);
  }
  return pe;
}

function valueToColor(v: number): string {
  // v in [-1, 1] -> blue(-1) to black(0) to amber(+1)
  if (v >= 0) {
    const t = v;
    const r = Math.round(245 * t);
    const g = Math.round(158 * t);
    const b = Math.round(11 * t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const t = -v;
    const r = Math.round(59 * t);
    const g = Math.round(130 * t);
    const b = Math.round(246 * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export default function PositionalEncoding(): React.ReactElement {
  const [numPos, setNumPos] = useState(20);
  const [numDim, setNumDim] = useState(32);
  const [hoveredPos, setHoveredPos] = useState<number | null>(null);
  const [hoveredDim, setHoveredDim] = useState<number | null>(null);
  const [showWaves, setShowWaves] = useState(true);

  const pe = useMemo(() => computePE(numPos, numDim), [numPos, numDim]);

  const CELL_W = Math.min(14, 420 / numDim);
  const CELL_H = Math.min(16, 340 / numPos);
  const LABEL_W = 30;
  const LABEL_H = 20;
  const matrixW = numDim * CELL_W;
  const matrixH = numPos * CELL_H;
  const svgW = LABEL_W + matrixW + 4;
  const svgH = LABEL_H + matrixH + 4;

  // Wave chart dimensions
  const waveW = 360;
  const waveH = 100;
  const waveDims = [0, 1, 4, 5, 10, 11]; // Show a few sin/cos pairs

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          位置数:
          <input
            type="range"
            min={8}
            max={MAX_POS}
            value={numPos}
            onChange={(e) => setNumPos(Number(e.target.value))}
            className="w-24 accent-amber-500"
          />
          <span className="text-amber-400 font-mono w-6 text-right">
            {numPos}
          </span>
        </label>
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          次元数:
          <input
            type="range"
            min={8}
            max={MAX_DIM}
            step={2}
            value={numDim}
            onChange={(e) => setNumDim(Number(e.target.value))}
            className="w-24 accent-amber-500"
          />
          <span className="text-amber-400 font-mono w-6 text-right">
            {numDim}
          </span>
        </label>
        <button
          onClick={() => setShowWaves(!showWaves)}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            showWaves
              ? "bg-amber-500 text-zinc-900 font-bold"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
          }`}
        >
          波形表示
        </button>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <svg width={svgW} height={svgH} className="block mx-auto">
          {/* Dim labels (sparse) */}
          {Array.from({ length: numDim }, (_, d) => d)
            .filter((d) => d % Math.max(1, Math.floor(numDim / 8)) === 0)
            .map((d) => (
              <text
                key={`dl-${d}`}
                x={LABEL_W + d * CELL_W + CELL_W / 2}
                y={LABEL_H - 4}
                textAnchor="middle"
                className="text-[7px] fill-zinc-500 font-mono"
              >
                {d}
              </text>
            ))}

          {/* Position labels (sparse) */}
          {Array.from({ length: numPos }, (_, p) => p)
            .filter((p) => p % Math.max(1, Math.floor(numPos / 10)) === 0)
            .map((p) => (
              <text
                key={`pl-${p}`}
                x={LABEL_W - 4}
                y={LABEL_H + p * CELL_H + CELL_H / 2 + 3}
                textAnchor="end"
                className="text-[7px] fill-zinc-500 font-mono"
              >
                {p}
              </text>
            ))}

          {/* Heatmap cells */}
          <g transform={`translate(${LABEL_W}, ${LABEL_H})`}>
            {pe.map((row, p) =>
              row.map((val, d) => (
                <rect
                  key={`${p}-${d}`}
                  x={d * CELL_W}
                  y={p * CELL_H}
                  width={CELL_W}
                  height={CELL_H}
                  fill={valueToColor(val)}
                  stroke={
                    hoveredPos === p || hoveredDim === d
                      ? "#fbbf24"
                      : "transparent"
                  }
                  strokeWidth={hoveredPos === p || hoveredDim === d ? 0.8 : 0}
                  className="cursor-crosshair"
                  onMouseEnter={() => {
                    setHoveredPos(p);
                    setHoveredDim(d);
                  }}
                  onMouseLeave={() => {
                    setHoveredPos(null);
                    setHoveredDim(null);
                  }}
                />
              ))
            )}
          </g>
        </svg>
      </div>

      {/* Hover info */}
      {hoveredPos !== null && hoveredDim !== null && (
        <div className="bg-zinc-800/60 rounded p-2 text-xs text-zinc-300 text-center">
          位置={hoveredPos}, 次元={hoveredDim} →{" "}
          <span className="text-amber-400 font-mono font-bold">
            {pe[hoveredPos][hoveredDim].toFixed(4)}
          </span>
          {" "}
          ({hoveredDim % 2 === 0 ? "sin" : "cos"}, 周期 ={" "}
          {(
            2 *
            Math.PI *
            Math.pow(10000, (2 * Math.floor(hoveredDim / 2)) / numDim)
          ).toFixed(1)}
          )
        </div>
      )}

      {/* Color legend */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500">
        <span className="text-blue-400">-1</span>
        <div className="w-32 h-3 rounded" style={{
          background: "linear-gradient(to right, rgb(59,130,246), rgb(0,0,0), rgb(245,158,11))"
        }} />
        <span className="text-amber-400">+1</span>
      </div>

      {/* Wave view */}
      {showWaves && (
        <div className="bg-zinc-800/30 rounded-lg p-3 space-y-2">
          <p className="text-xs text-zinc-400 font-bold">
            次元ごとのsin/cos波 — 低次元=高周波、高次元=低周波
          </p>
          <svg
            width={waveW}
            height={waveH}
            className="block mx-auto"
            viewBox={`0 0 ${waveW} ${waveH}`}
          >
            {/* Axes */}
            <line
              x1={30}
              y1={waveH / 2}
              x2={waveW}
              y2={waveH / 2}
              stroke="#52525b"
              strokeWidth={0.5}
            />
            <text
              x={2}
              y={waveH / 2 + 3}
              className="text-[8px] fill-zinc-600"
            >
              0
            </text>

            {waveDims.map((d) => {
              const hue = (d / numDim) * 300;
              const color = `hsl(${hue}, 70%, 55%)`;
              const points = Array.from({ length: numPos }, (_, p) => {
                const x = 30 + ((waveW - 34) * p) / (numPos - 1);
                const y =
                  waveH / 2 - pe[p][Math.min(d, numDim - 1)] * (waveH / 2 - 8);
                return `${x},${y}`;
              }).join(" ");

              return (
                <g key={d}>
                  <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth={1.2}
                    opacity={0.7}
                  />
                  <text
                    x={waveW - 2}
                    y={
                      waveH / 2 -
                      pe[numPos - 1][Math.min(d, numDim - 1)] *
                        (waveH / 2 - 8) +
                      3
                    }
                    textAnchor="end"
                    className="text-[7px]"
                    fill={color}
                  >
                    d={d}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="text-[10px] text-zinc-500 text-center">
            横軸: 位置 (0〜{numPos - 1}) / 縦軸: PE値 (-1〜+1)
          </p>
        </div>
      )}

      <p className="text-xs text-zinc-500 text-center">
        行: トークン位置 / 列: 埋め込み次元 — 各位置が固有の「シグネチャ」を持つ
      </p>
    </div>
  );
}
