"use client";

import { useState, useCallback, useRef } from "react";

// --- Chart constants ---
const SVG_W = 480;
const SVG_H = 300;
const PAD_L = 48;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 40;

const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

// Data ranges
const P_MIN = 0.01;
const P_MAX = 1.0;
const LOSS_MIN = 0;
const LOSS_MAX = 5;

// Number of sample points for curves
const N_POINTS = 200;

// --- Helpers ---
function toSvgX(p: number): number {
  return PAD_L + ((p - 0) / (1 - 0)) * PLOT_W;
}

function toSvgY(loss: number): number {
  const clamped = Math.min(loss, LOSS_MAX);
  return PAD_T + (1 - (clamped - LOSS_MIN) / (LOSS_MAX - LOSS_MIN)) * PLOT_H;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function buildCurvePoints(fn: (p: number) => number): string {
  const pts: string[] = [];
  for (let i = 0; i <= N_POINTS; i++) {
    const p = P_MIN + (P_MAX - P_MIN) * (i / N_POINTS);
    const loss = fn(p);
    if (loss > LOSS_MAX + 1) continue; // skip off-chart points
    pts.push(`${toSvgX(p)},${toSvgY(loss)}`);
  }
  return pts.join(" ");
}

// --- Component ---
export default function CrossEntropyViz() {
  const [pHat, setPHat] = useState(0.7);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const lossY1 = -Math.log(pHat);
  const lossY0 = -Math.log(1 - pHat);

  // Curve data
  const curveY1 = buildCurvePoints((p) => -Math.log(p));
  const curveY0 = buildCurvePoints((p) => -Math.log(1 - p));

  // Drag handling on SVG
  const pFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!svgRef.current) return pHat;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const svgX = ((clientX - rect.left) / rect.width) * SVG_W;
      const p = ((svgX - PAD_L) / PLOT_W) * (1 - 0) + 0;
      return clamp(p, P_MIN, 0.99);
    },
    [pHat]
  );

  const onPointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      dragging.current = true;
      setPHat(pFromEvent(e));
    },
    [pFromEvent]
  );

  const onPointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging.current) return;
      setPHat(pFromEvent(e));
    },
    [pFromEvent]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Axis ticks
  const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const yTicks = [0, 1, 2, 3, 4, 5];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 select-none">
      <h3 className="text-lg font-semibold text-zinc-100">
        Cross-Entropy Loss: −log(p) vs −log(1−p)
      </h3>

      {/* SVG Chart */}
      <div className="w-full bg-zinc-900 rounded-xl border border-zinc-700 p-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-auto cursor-crosshair"
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
        >
          {/* Grid lines */}
          {yTicks.map((t) => (
            <line
              key={`yg-${t}`}
              x1={PAD_L}
              x2={SVG_W - PAD_R}
              y1={toSvgY(t)}
              y2={toSvgY(t)}
              stroke="#3f3f46"
              strokeWidth={0.5}
            />
          ))}
          {xTicks.map((t) => (
            <line
              key={`xg-${t}`}
              x1={toSvgX(t)}
              x2={toSvgX(t)}
              y1={PAD_T}
              y2={SVG_H - PAD_B}
              stroke="#3f3f46"
              strokeWidth={0.5}
            />
          ))}

          {/* Axes */}
          <line
            x1={PAD_L}
            x2={SVG_W - PAD_R}
            y1={SVG_H - PAD_B}
            y2={SVG_H - PAD_B}
            stroke="#a1a1aa"
            strokeWidth={1}
          />
          <line
            x1={PAD_L}
            x2={PAD_L}
            y1={PAD_T}
            y2={SVG_H - PAD_B}
            stroke="#a1a1aa"
            strokeWidth={1}
          />

          {/* Axis labels */}
          <text
            x={PAD_L + PLOT_W / 2}
            y={SVG_H - 4}
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize={11}
          >
            Predicted probability p̂
          </text>
          <text
            x={12}
            y={PAD_T + PLOT_H / 2}
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize={11}
            transform={`rotate(-90, 12, ${PAD_T + PLOT_H / 2})`}
          >
            Loss
          </text>

          {/* X tick labels */}
          {xTicks.map((t) => (
            <text
              key={`xl-${t}`}
              x={toSvgX(t)}
              y={SVG_H - PAD_B + 14}
              textAnchor="middle"
              fill="#a1a1aa"
              fontSize={10}
            >
              {t.toFixed(1)}
            </text>
          ))}

          {/* Y tick labels */}
          {yTicks.map((t) => (
            <text
              key={`yl-${t}`}
              x={PAD_L - 6}
              y={toSvgY(t) + 4}
              textAnchor="end"
              fill="#a1a1aa"
              fontSize={10}
            >
              {t}
            </text>
          ))}

          {/* Curve: -log(p) — y=1 case (amber) */}
          <polyline
            points={curveY1}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* Curve: -log(1-p) — y=0 case (blue) */}
          <polyline
            points={curveY0}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />

          {/* Draggable vertical line */}
          <line
            x1={toSvgX(pHat)}
            x2={toSvgX(pHat)}
            y1={PAD_T}
            y2={SVG_H - PAD_B}
            stroke="#e4e4e7"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            opacity={0.6}
          />

          {/* Point on y=1 curve */}
          {lossY1 <= LOSS_MAX && (
            <circle
              cx={toSvgX(pHat)}
              cy={toSvgY(lossY1)}
              r={5}
              fill="#f59e0b"
              stroke="#fef3c7"
              strokeWidth={2}
            />
          )}

          {/* Point on y=0 curve */}
          {lossY0 <= LOSS_MAX && (
            <circle
              cx={toSvgX(pHat)}
              cy={toSvgY(lossY0)}
              r={5}
              fill="#3b82f6"
              stroke="#dbeafe"
              strokeWidth={2}
            />
          )}

          {/* Legend */}
          <line x1={SVG_W - PAD_R - 150} x2={SVG_W - PAD_R - 130} y1={PAD_T + 10} y2={PAD_T + 10} stroke="#f59e0b" strokeWidth={2.5} />
          <text x={SVG_W - PAD_R - 126} y={PAD_T + 14} fill="#f59e0b" fontSize={10}>
            −log(p) &nbsp; (y=1)
          </text>
          <line x1={SVG_W - PAD_R - 150} x2={SVG_W - PAD_R - 130} y1={PAD_T + 26} y2={PAD_T + 26} stroke="#3b82f6" strokeWidth={2.5} />
          <text x={SVG_W - PAD_R - 126} y={PAD_T + 30} fill="#3b82f6" fontSize={10}>
            −log(1−p) (y=0)
          </text>
        </svg>
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3 px-1">
        <label className="text-sm text-zinc-400 whitespace-nowrap">
          p̂ = {pHat.toFixed(2)}
        </label>
        <input
          type="range"
          min={1}
          max={99}
          value={Math.round(pHat * 100)}
          onChange={(e) => setPHat(Number(e.target.value) / 100)}
          className="flex-1 accent-zinc-400"
        />
      </div>

      {/* Loss panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* y=1 panel */}
        <div
          className={`rounded-lg border p-4 transition-colors ${
            lossY1 > 2
              ? "border-amber-500/60 bg-amber-950/30"
              : "border-zinc-700 bg-zinc-800/50"
          }`}
        >
          <div className="text-xs font-medium text-amber-400 mb-1">
            If true label y = 1
          </div>
          <div className="text-sm text-zinc-300">
            loss = −log({pHat.toFixed(2)}) ={" "}
            <span
              className={`font-bold text-lg ${
                lossY1 > 3
                  ? "text-red-400"
                  : lossY1 > 1
                  ? "text-amber-300"
                  : "text-green-400"
              }`}
            >
              {lossY1 > 10 ? "∞" : lossY1.toFixed(3)}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            {pHat < 0.2
              ? "Predicting low p when y=1 — huge penalty!"
              : pHat < 0.5
              ? "Still not confident enough — significant loss."
              : pHat > 0.9
              ? "Confident and correct — minimal loss."
              : "Reasonable prediction — moderate loss."}
          </div>
        </div>

        {/* y=0 panel */}
        <div
          className={`rounded-lg border p-4 transition-colors ${
            lossY0 > 2
              ? "border-blue-500/60 bg-blue-950/30"
              : "border-zinc-700 bg-zinc-800/50"
          }`}
        >
          <div className="text-xs font-medium text-blue-400 mb-1">
            If true label y = 0
          </div>
          <div className="text-sm text-zinc-300">
            loss = −log(1 − {pHat.toFixed(2)}) ={" "}
            <span
              className={`font-bold text-lg ${
                lossY0 > 3
                  ? "text-red-400"
                  : lossY0 > 1
                  ? "text-blue-300"
                  : "text-green-400"
              }`}
            >
              {lossY0 > 10 ? "∞" : lossY0.toFixed(3)}
            </span>
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            {pHat > 0.8
              ? "Predicting high p when y=0 — huge penalty!"
              : pHat > 0.5
              ? "Leaning wrong way — significant loss."
              : pHat < 0.1
              ? "Confident and correct — minimal loss."
              : "Reasonable prediction — moderate loss."}
          </div>
        </div>
      </div>

      {/* Insight box */}
      <div className="rounded-lg bg-zinc-800/60 border border-zinc-700 px-4 py-3 text-sm text-zinc-400">
        <span className="font-semibold text-zinc-200">Key insight:</span>{" "}
        Cross-entropy loss goes to <strong className="text-red-400">infinity</strong>{" "}
        when the model is confidently wrong (p̂ → 0 when y=1, or p̂ → 1 when y=0).
        This means the model is <em>severely</em> punished for confident
        mistakes, which forces it to calibrate its probability estimates.
      </div>
    </div>
  );
}
