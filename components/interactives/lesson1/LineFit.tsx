"use client";

import { useState, useCallback, type MouseEvent } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Point {
  x: number;
  y: number;
}

interface RegressionResult {
  w: number; // slope
  b: number; // intercept
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const VIEWBOX_W = 500;
const VIEWBOX_H = 400;
const PADDING = 40; // axis padding inside viewBox
const PLOT_W = VIEWBOX_W - PADDING * 2;
const PLOT_H = VIEWBOX_H - PADDING * 2;

/** Axis range in data-space */
const X_MIN = 0;
const X_MAX = 10;
const Y_MIN = 0;
const Y_MAX = 10;

/** Convert data-space → SVG-space */
function toSvg(p: Point): { sx: number; sy: number } {
  const sx = PADDING + ((p.x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
  const sy = PADDING + PLOT_H - ((p.y - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;
  return { sx, sy };
}

/** Convert SVG-space → data-space */
function toData(sx: number, sy: number): Point {
  const x = X_MIN + ((sx - PADDING) / PLOT_W) * (X_MAX - X_MIN);
  const y = Y_MIN + ((PADDING + PLOT_H - sy) / PLOT_H) * (Y_MAX - Y_MIN);
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

/** Ordinary least-squares regression. Returns null when < 2 points. */
function leastSquares(points: Point[]): RegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumXX += p.x * p.x;
  }

  const denom = n * sumXX - sumX * sumX;
  if (Math.abs(denom) < 1e-12) return null; // vertical alignment

  const w = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - w * sumX) / n;

  return { w: Math.round(w * 1000) / 1000, b: Math.round(b * 1000) / 1000 };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Grid() {
  const lines: React.ReactElement[] = [];

  // Vertical grid lines + x-axis labels
  for (let x = X_MIN; x <= X_MAX; x += 1) {
    const { sx } = toSvg({ x, y: 0 });
    lines.push(
      <line
        key={`vg-${x}`}
        x1={sx}
        y1={PADDING}
        x2={sx}
        y2={PADDING + PLOT_H}
        stroke="#e4e4e7"
        strokeWidth={0.5}
      />,
    );
    if (x % 2 === 0) {
      lines.push(
        <text
          key={`xl-${x}`}
          x={sx}
          y={PADDING + PLOT_H + 16}
          textAnchor="middle"
          fontSize={11}
          fill="#71717a"
        >
          {x}
        </text>,
      );
    }
  }

  // Horizontal grid lines + y-axis labels
  for (let y = Y_MIN; y <= Y_MAX; y += 1) {
    const { sy } = toSvg({ x: 0, y });
    lines.push(
      <line
        key={`hg-${y}`}
        x1={PADDING}
        y1={sy}
        x2={PADDING + PLOT_W}
        y2={sy}
        stroke="#e4e4e7"
        strokeWidth={0.5}
      />,
    );
    if (y % 2 === 0) {
      lines.push(
        <text
          key={`yl-${y}`}
          x={PADDING - 8}
          y={sy + 4}
          textAnchor="end"
          fontSize={11}
          fill="#71717a"
        >
          {y}
        </text>,
      );
    }
  }

  return <g>{lines}</g>;
}

function Axes() {
  return (
    <g>
      {/* x-axis */}
      <line
        x1={PADDING}
        y1={PADDING + PLOT_H}
        x2={PADDING + PLOT_W}
        y2={PADDING + PLOT_H}
        stroke="#52525b"
        strokeWidth={1.5}
      />
      {/* y-axis */}
      <line
        x1={PADDING}
        y1={PADDING}
        x2={PADDING}
        y2={PADDING + PLOT_H}
        stroke="#52525b"
        strokeWidth={1.5}
      />
      {/* axis labels */}
      <text
        x={PADDING + PLOT_W / 2}
        y={VIEWBOX_H - 4}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill="#52525b"
      >
        x
      </text>
      <text
        x={10}
        y={PADDING + PLOT_H / 2}
        textAnchor="middle"
        fontSize={13}
        fontWeight={600}
        fill="#52525b"
        transform={`rotate(-90, 10, ${PADDING + PLOT_H / 2})`}
      >
        y
      </text>
    </g>
  );
}

function RegressionLine({ regression }: { regression: RegressionResult }) {
  const { w, b } = regression;

  // Compute line endpoints clipped to x-range
  const p1: Point = { x: X_MIN, y: w * X_MIN + b };
  const p2: Point = { x: X_MAX, y: w * X_MAX + b };

  const sv1 = toSvg(p1);
  const sv2 = toSvg(p2);

  return (
    <line
      x1={sv1.sx}
      y1={sv1.sy}
      x2={sv2.sx}
      y2={sv2.sy}
      stroke="#f59e0b"
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function LineFit() {
  const [points, setPoints] = useState<Point[]>([]);

  const regression = leastSquares(points);

  const handleClick = useCallback(
    (e: MouseEvent<SVGSVGElement>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();

      // Map pixel click → viewBox coords
      const scaleX = VIEWBOX_W / rect.width;
      const scaleY = VIEWBOX_H / rect.height;
      const svgX = (e.clientX - rect.left) * scaleX;
      const svgY = (e.clientY - rect.top) * scaleY;

      // Ignore clicks outside plot area
      if (
        svgX < PADDING ||
        svgX > PADDING + PLOT_W ||
        svgY < PADDING ||
        svgY > PADDING + PLOT_H
      ) {
        return;
      }

      const dataPoint = toData(svgX, svgY);
      setPoints((prev) => [...prev, dataPoint]);
    },
    [],
  );

  const handleClear = useCallback(() => setPoints([]), []);

  /* Format equation string */
  const eqStr = regression
    ? `y = ${regression.w}x ${regression.b >= 0 ? "+" : "−"} ${Math.abs(regression.b)}`
    : "y = wx + b";

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-800">
            Linear Regression — Line Fit
          </h3>
          <p className="text-sm text-zinc-500">
            Click on the canvas to add data points.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:bg-zinc-100"
        >
          Clear
        </button>
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        width="100%"
        className="cursor-crosshair rounded-lg border border-zinc-200 bg-white"
        onClick={handleClick}
      >
        <Grid />
        <Axes />

        {/* Regression line */}
        {regression && <RegressionLine regression={regression} />}

        {/* Data points */}
        {points.map((p, i) => {
          const { sx, sy } = toSvg(p);
          return (
            <circle
              key={i}
              cx={sx}
              cy={sy}
              r={5}
              fill="#52525b"
              stroke="#fff"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>

      {/* Equation display */}
      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="rounded bg-zinc-100 px-3 py-1 font-mono text-zinc-700">
          {eqStr}
        </span>
        <span className="text-zinc-400">
          {points.length} point{points.length !== 1 && "s"}
        </span>
      </div>
    </div>
  );
}
