"use client";

import { useState, useMemo, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                   */
/* ------------------------------------------------------------------ */

interface Point {
  x: number;
  y: number;
  label: -1 | 1;
}

const VIEWBOX_W = 520;
const VIEWBOX_H = 400;
const PAD_L = 45;
const PAD_R = 20;
const PAD_T = 50;
const PAD_B = 40;
const PLOT_W = VIEWBOX_W - PAD_L - PAD_R;
const PLOT_H = VIEWBOX_H - PAD_T - PAD_B;

const DATA_MIN = -5;
const DATA_MAX = 5;

/** Two linearly separable clusters */
const DATASET: Point[] = [
  // Class -1 (blue) — lower-left cluster
  { x: -3.5, y: -2.0, label: -1 },
  { x: -2.5, y: -3.0, label: -1 },
  { x: -2.0, y: -1.5, label: -1 },
  { x: -3.0, y: -0.5, label: -1 },
  { x: -1.5, y: -2.5, label: -1 },
  { x: -4.0, y: -1.0, label: -1 },
  { x: -2.2, y: -0.3, label: -1 },
  // Class +1 (amber) — upper-right cluster
  { x: 2.0, y: 1.5, label: 1 },
  { x: 3.0, y: 2.5, label: 1 },
  { x: 1.5, y: 3.0, label: 1 },
  { x: 2.5, y: 0.5, label: 1 },
  { x: 3.5, y: 1.0, label: 1 },
  { x: 1.0, y: 2.0, label: 1 },
  { x: 2.8, y: 3.5, label: 1 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toSvgX(v: number): number {
  return PAD_L + ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_W;
}
function toSvgY(v: number): number {
  return PAD_T + PLOT_H - ((v - DATA_MIN) / (DATA_MAX - DATA_MIN)) * PLOT_H;
}
function toDataX(sx: number): number {
  return DATA_MIN + ((sx - PAD_L) / PLOT_W) * (DATA_MAX - DATA_MIN);
}
function toDataY(sy: number): number {
  return DATA_MIN + ((PAD_T + PLOT_H - sy) / PLOT_H) * (DATA_MAX - DATA_MIN);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MarginDemo() {
  // Decision boundary: w1*x + w2*y + b = 0, parameterised by angle + offset
  const [angle, setAngle] = useState(45); // degrees
  const [offset, setOffset] = useState(0);

  const rad = (angle * Math.PI) / 180;
  const w1 = Math.cos(rad);
  const w2 = Math.sin(rad);
  const b = -offset;

  const { margin, supportVectors, lineEndpoints, marginLines } = useMemo(() => {
    const norm = Math.sqrt(w1 * w1 + w2 * w2); // always 1 for unit vector but keep general

    // Signed distance for each point
    const distances = DATASET.map((p) => {
      const signedDist = (w1 * p.x + w2 * p.y + b) / norm;
      return { ...p, signedDist, absDist: Math.abs(signedDist) };
    });

    // Find minimum distance to boundary for each class
    const pos = distances.filter((d) => d.label === 1);
    const neg = distances.filter((d) => d.label === -1);

    const minPosAbs = pos.length > 0 ? Math.min(...pos.map((d) => d.absDist)) : Infinity;
    const minNegAbs = neg.length > 0 ? Math.min(...neg.map((d) => d.absDist)) : Infinity;

    const marginVal = minPosAbs + minNegAbs;

    // Identify support vectors (within 0.1 of min distance)
    const svIndices: number[] = [];
    distances.forEach((d, i) => {
      if (d.label === 1 && Math.abs(d.absDist - minPosAbs) < 0.15) svIndices.push(i);
      if (d.label === -1 && Math.abs(d.absDist - minNegAbs) < 0.15) svIndices.push(i);
    });

    // Line endpoints (clip to viewport)
    // w1*x + w2*y + b = 0  =>  y = -(w1*x + b) / w2 (if w2 != 0)
    const getLineY = (x: number, bVal: number) =>
      w2 !== 0 ? -(w1 * x + bVal) / w2 : null;
    const getLineX = (y: number, bVal: number) =>
      w1 !== 0 ? -(w2 * y + bVal) / w1 : null;

    const clipLine = (bVal: number) => {
      const pts: { x: number; y: number }[] = [];
      // Check intersections with viewport edges
      for (const edge of [DATA_MIN, DATA_MAX]) {
        const ly = getLineY(edge, bVal);
        if (ly !== null && ly >= DATA_MIN && ly <= DATA_MAX) {
          pts.push({ x: edge, y: ly });
        }
        const lx = getLineX(edge, bVal);
        if (lx !== null && lx >= DATA_MIN && lx <= DATA_MAX) {
          pts.push({ x: lx, y: edge });
        }
      }
      // Deduplicate
      const unique = pts.filter(
        (p, i, arr) =>
          arr.findIndex((q) => Math.abs(q.x - p.x) < 0.01 && Math.abs(q.y - p.y) < 0.01) === i,
      );
      return unique.length >= 2 ? [unique[0], unique[1]] : null;
    };

    const mainLine = clipLine(b);

    // Margin lines: w1*x + w2*y + b = +-marginHalf
    const marginPosLine = clipLine(b - minPosAbs * norm);
    const marginNegLine = clipLine(b + minNegAbs * norm);

    return {
      margin: marginVal,
      supportVectors: svIndices,
      lineEndpoints: mainLine,
      marginLines: { pos: marginPosLine, neg: marginNegLine },
    };
  }, [w1, w2, b]);

  // Dragging
  const [dragging, setDragging] = useState(false);
  const handlePointerDown = useCallback(() => setDragging(true), []);
  const handlePointerUp = useCallback(() => setDragging(false), []);
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragging) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const scaleX = VIEWBOX_W / rect.width;
      const scaleY = VIEWBOX_H / rect.height;
      const sx = (e.clientX - rect.left) * scaleX;
      const sy = (e.clientY - rect.top) * scaleY;
      const dx = toDataX(sx);
      const dy = toDataY(sy);
      // Project onto normal direction to get offset
      const newOffset = w1 * dx + w2 * dy;
      setOffset(Math.max(-5, Math.min(5, newOffset)));
    },
    [dragging, w1, w2],
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-zinc-800">
          SVM Margin Visualization
        </h3>
        <p className="text-sm text-zinc-500">
          Adjust the angle and drag the boundary to maximize the margin. Support
          vectors are highlighted with rings.
        </p>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        className="rounded-lg border border-zinc-200 bg-white cursor-crosshair select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerDown={handlePointerDown}
      >
        {/* Grid */}
        {[-4, -2, 0, 2, 4].map((v) => (
          <g key={`grid-${v}`}>
            <line
              x1={toSvgX(v)}
              y1={PAD_T}
              x2={toSvgX(v)}
              y2={PAD_T + PLOT_H}
              stroke="#e4e4e7"
              strokeWidth={v === 0 ? 1 : 0.5}
            />
            <line
              x1={PAD_L}
              y1={toSvgY(v)}
              x2={PAD_L + PLOT_W}
              y2={toSvgY(v)}
              stroke="#e4e4e7"
              strokeWidth={v === 0 ? 1 : 0.5}
            />
            <text
              x={toSvgX(v)}
              y={PAD_T + PLOT_H + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#a1a1aa"
            >
              {v}
            </text>
            <text
              x={PAD_L - 8}
              y={toSvgY(v) + 4}
              textAnchor="end"
              fontSize={10}
              fill="#a1a1aa"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line
          x1={PAD_L}
          y1={PAD_T + PLOT_H}
          x2={PAD_L + PLOT_W}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1.5}
        />
        <line
          x1={PAD_L}
          y1={PAD_T}
          x2={PAD_L}
          y2={PAD_T + PLOT_H}
          stroke="#52525b"
          strokeWidth={1.5}
        />

        {/* Margin band (shaded) */}
        {marginLines.pos && marginLines.neg && (
          <polygon
            points={[
              `${toSvgX(marginLines.pos[0].x)},${toSvgY(marginLines.pos[0].y)}`,
              `${toSvgX(marginLines.pos[1].x)},${toSvgY(marginLines.pos[1].y)}`,
              `${toSvgX(marginLines.neg[1].x)},${toSvgY(marginLines.neg[1].y)}`,
              `${toSvgX(marginLines.neg[0].x)},${toSvgY(marginLines.neg[0].y)}`,
            ].join(" ")}
            fill="rgba(245,158,11,0.08)"
          />
        )}

        {/* Margin lines (dashed) */}
        {marginLines.pos && (
          <line
            x1={toSvgX(marginLines.pos[0].x)}
            y1={toSvgY(marginLines.pos[0].y)}
            x2={toSvgX(marginLines.pos[1].x)}
            y2={toSvgY(marginLines.pos[1].y)}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            opacity={0.6}
          />
        )}
        {marginLines.neg && (
          <line
            x1={toSvgX(marginLines.neg[0].x)}
            y1={toSvgY(marginLines.neg[0].y)}
            x2={toSvgX(marginLines.neg[1].x)}
            y2={toSvgY(marginLines.neg[1].y)}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            opacity={0.6}
          />
        )}

        {/* Decision boundary */}
        {lineEndpoints && (
          <line
            x1={toSvgX(lineEndpoints[0].x)}
            y1={toSvgY(lineEndpoints[0].y)}
            x2={toSvgX(lineEndpoints[1].x)}
            y2={toSvgY(lineEndpoints[1].y)}
            stroke="#f59e0b"
            strokeWidth={2.5}
          />
        )}

        {/* Data points */}
        {DATASET.map((pt, i) => {
          const isSV = supportVectors.includes(i);
          const fill = pt.label === -1 ? "#3b82f6" : "#f59e0b";
          return (
            <g key={i}>
              {isSV && (
                <circle
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.y)}
                  r={12}
                  fill="none"
                  stroke={fill}
                  strokeWidth={2}
                  opacity={0.5}
                />
              )}
              <circle
                cx={toSvgX(pt.x)}
                cy={toSvgY(pt.y)}
                r={6}
                fill={fill}
                stroke="#fff"
                strokeWidth={1.5}
                opacity={0.9}
              />
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${PAD_L + 8}, ${PAD_T + 10})`}>
          <circle cx={0} cy={0} r={5} fill="#3b82f6" />
          <text x={10} y={4} fontSize={10} fill="#71717a">
            Class -1
          </text>
          <circle cx={0} cy={16} r={5} fill="#f59e0b" />
          <text x={10} y={20} fontSize={10} fill="#71717a">
            Class +1
          </text>
          <circle cx={80} cy={8} r={5} fill="none" stroke="#f59e0b" strokeWidth={2} />
          <text x={90} y={12} fontSize={10} fill="#71717a">
            Support Vector
          </text>
        </g>
      </svg>

      {/* Controls */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
            <span className="font-medium">
              Angle <span className="text-zinc-400 font-normal">(degrees)</span>
            </span>
            <span className="font-mono text-zinc-800">{angle}</span>
          </label>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
            <span>0</span>
            <span>90</span>
            <span>180</span>
          </div>
        </div>
        <div>
          <label className="flex items-center justify-between text-sm text-zinc-600 mb-1">
            <span className="font-medium">
              Offset <span className="text-zinc-400 font-normal">(position)</span>
            </span>
            <span className="font-mono text-zinc-800">{offset.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={-5}
            max={5}
            step={0.1}
            value={offset}
            onChange={(e) => setOffset(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
            <span>-5</span>
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
        <span
          className={`rounded px-3 py-1 font-semibold ${
            margin > 3
              ? "bg-emerald-100 text-emerald-700"
              : margin > 1.5
                ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          Margin: {margin.toFixed(2)}
        </span>
        <span className="text-zinc-400">
          Support Vectors: {supportVectors.length}
        </span>
      </div>
    </div>
  );
}
