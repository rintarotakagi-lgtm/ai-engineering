"use client";

import { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ------------------------------------------------------------------ */
/*  Fixed dataset                                                      */
/* ------------------------------------------------------------------ */

const DATA: { x: number; y: number }[] = [
  { x: 1, y: 2.2 },
  { x: 2, y: 2.8 },
  { x: 3, y: 4.5 },
  { x: 4, y: 4.1 },
  { x: 5, y: 5.9 },
];

/* ------------------------------------------------------------------ */
/*  Precomputed statistics                                             */
/* ------------------------------------------------------------------ */

const n = DATA.length;
const sumX = DATA.reduce((s, p) => s + p.x, 0);
const sumY = DATA.reduce((s, p) => s + p.y, 0);
const meanX = sumX / n;
const meanY = sumY / n;

const covXY = DATA.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0) / n;
const varX = DATA.reduce((s, p) => s + (p.x - meanX) ** 2, 0) / n;

const wStar = covXY / varX;
const bStar = meanY - wStar * meanX;

/* helpers */
const fmt = (v: number) => v.toFixed(2);
const fmtSigned = (v: number) => (v >= 0 ? `+ ${fmt(v)}` : `- ${fmt(Math.abs(v))}`);

/* ------------------------------------------------------------------ */
/*  SVG Plot                                                           */
/* ------------------------------------------------------------------ */

const PLOT_W = 400;
const PLOT_H = 300;
const PAD = 40;

function toSvgX(x: number) {
  return PAD + ((x - 0) / 6) * (PLOT_W - 2 * PAD);
}
function toSvgY(y: number) {
  return PLOT_H - PAD - ((y - 0) / 8) * (PLOT_H - 2 * PAD);
}

function Plot({ showLine }: { showLine: boolean }) {
  const xTicks = [0, 1, 2, 3, 4, 5, 6];
  const yTicks = [0, 2, 4, 6, 8];

  const lineX0 = 0;
  const lineX1 = 6;
  const lineY0 = wStar * lineX0 + bStar;
  const lineY1 = wStar * lineX1 + bStar;

  return (
    <svg
      viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
      className="w-full max-w-md rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
    >
      {/* grid lines */}
      {xTicks.map((t) => (
        <line
          key={`gx-${t}`}
          x1={toSvgX(t)}
          y1={toSvgY(0)}
          x2={toSvgX(t)}
          y2={toSvgY(8)}
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth={0.5}
        />
      ))}
      {yTicks.map((t) => (
        <line
          key={`gy-${t}`}
          x1={toSvgX(0)}
          y1={toSvgY(t)}
          x2={toSvgX(6)}
          y2={toSvgY(t)}
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth={0.5}
        />
      ))}

      {/* axes */}
      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(6)}
        y2={toSvgY(0)}
        className="stroke-zinc-400 dark:stroke-zinc-500"
        strokeWidth={1}
      />
      <line
        x1={toSvgX(0)}
        y1={toSvgY(0)}
        x2={toSvgX(0)}
        y2={toSvgY(8)}
        className="stroke-zinc-400 dark:stroke-zinc-500"
        strokeWidth={1}
      />

      {/* tick labels */}
      {xTicks.map((t) => (
        <text
          key={`lx-${t}`}
          x={toSvgX(t)}
          y={toSvgY(0) + 16}
          textAnchor="middle"
          className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
        >
          {t}
        </text>
      ))}
      {yTicks.map((t) => (
        <text
          key={`ly-${t}`}
          x={toSvgX(0) - 10}
          y={toSvgY(t) + 4}
          textAnchor="end"
          className="fill-zinc-500 text-[10px] dark:fill-zinc-400"
        >
          {t}
        </text>
      ))}

      {/* axis labels */}
      <text
        x={PLOT_W / 2}
        y={PLOT_H - 4}
        textAnchor="middle"
        className="fill-zinc-600 text-xs dark:fill-zinc-300"
      >
        x
      </text>
      <text
        x={12}
        y={PLOT_H / 2}
        textAnchor="middle"
        transform={`rotate(-90, 12, ${PLOT_H / 2})`}
        className="fill-zinc-600 text-xs dark:fill-zinc-300"
      >
        y
      </text>

      {/* regression line */}
      {showLine && (
        <line
          x1={toSvgX(lineX0)}
          y1={toSvgY(lineY0)}
          x2={toSvgX(lineX1)}
          y2={toSvgY(lineY1)}
          stroke="#f59e0b"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      )}

      {/* data points */}
      {DATA.map((p, i) => (
        <circle
          key={i}
          cx={toSvgX(p.x)}
          cy={toSvgY(p.y)}
          r={5}
          className="fill-zinc-600 stroke-zinc-800 dark:fill-zinc-300 dark:stroke-zinc-100"
          strokeWidth={1.5}
        />
      ))}

      {/* mean lines (always shown) */}
      <line
        x1={toSvgX(meanX)}
        y1={toSvgY(0)}
        x2={toSvgX(meanX)}
        y2={toSvgY(8)}
        stroke="#3b82f6"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />
      <line
        x1={toSvgX(0)}
        y1={toSvgY(meanY)}
        x2={toSvgX(6)}
        y2={toSvgY(meanY)}
        stroke="#3b82f6"
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.5}
      />

      {/* mean labels */}
      <text
        x={toSvgX(meanX) + 4}
        y={toSvgY(8) + 12}
        className="fill-blue-500 text-[9px]"
      >
        x&#772; = {fmt(meanX)}
      </text>
      <text
        x={toSvgX(6) - 2}
        y={toSvgY(meanY) - 4}
        textAnchor="end"
        className="fill-blue-500 text-[9px]"
      >
        y&#772; = {fmt(meanY)}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Step content                                                       */
/* ------------------------------------------------------------------ */

function DataTable() {
  return (
    <table className="mx-auto my-2 text-sm">
      <thead>
        <tr className="border-b border-zinc-300 dark:border-zinc-600">
          <th className="px-3 py-1 text-zinc-500">i</th>
          <th className="px-3 py-1 text-zinc-500">
            <InlineMath math="x_i" />
          </th>
          <th className="px-3 py-1 text-zinc-500">
            <InlineMath math="y_i" />
          </th>
        </tr>
      </thead>
      <tbody>
        {DATA.map((p, i) => (
          <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800">
            <td className="px-3 py-1 text-center text-zinc-400">{i + 1}</td>
            <td className="px-3 py-1 text-center">{p.x}</td>
            <td className="px-3 py-1 text-center">{p.y}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

interface StepProps {
  step: number;
}

function StepContent({ step }: StepProps) {
  const deviations = DATA.map((p) => ({
    dx: p.x - meanX,
    dy: p.y - meanY,
    prod: (p.x - meanX) * (p.y - meanY),
    dxSq: (p.x - meanX) ** 2,
  }));

  switch (step) {
    case 0:
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
            Step 1: Data &amp; Means
          </h3>
          <DataTable />
          <div className="space-y-1">
            <BlockMath
              math={`\\bar{x} = \\frac{1}{n}\\sum x_i = \\frac{${DATA.map((p) => p.x).join(" + ")}}{${n}} = ${fmt(meanX)}`}
            />
            <BlockMath
              math={`\\bar{y} = \\frac{1}{n}\\sum y_i = \\frac{${DATA.map((p) => fmt(p.y)).join(" + ")}}{${n}} = ${fmt(meanY)}`}
            />
          </div>
        </div>
      );

    case 1:
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
            Step 2: Covariance &amp; Variance
          </h3>
          <BlockMath
            math={`\\text{Cov}(x,y) = \\frac{1}{n}\\sum(x_i - \\bar{x})(y_i - \\bar{y})`}
          />
          <table className="mx-auto my-2 text-xs">
            <thead>
              <tr className="border-b border-zinc-300 dark:border-zinc-600">
                <th className="px-2 py-1 text-zinc-500">
                  <InlineMath math="x_i - \bar{x}" />
                </th>
                <th className="px-2 py-1 text-zinc-500">
                  <InlineMath math="y_i - \bar{y}" />
                </th>
                <th className="px-2 py-1 text-zinc-500">product</th>
                <th className="px-2 py-1 text-zinc-500">
                  <InlineMath math="(x_i - \bar{x})^2" />
                </th>
              </tr>
            </thead>
            <tbody>
              {deviations.map((d, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  <td className="px-2 py-1 text-center">{fmt(d.dx)}</td>
                  <td className="px-2 py-1 text-center">{fmt(d.dy)}</td>
                  <td className="px-2 py-1 text-center">{fmt(d.prod)}</td>
                  <td className="px-2 py-1 text-center">{fmt(d.dxSq)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <BlockMath
            math={`\\text{Cov}(x,y) = \\frac{${deviations.map((d) => fmt(d.prod)).join(" + ")}}{${n}} = ${fmt(covXY)}`}
          />
          <BlockMath
            math={`\\text{Var}(x) = \\frac{${deviations.map((d) => fmt(d.dxSq)).join(" + ")}}{${n}} = ${fmt(varX)}`}
          />
        </div>
      );

    case 2:
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
            Step 3: Optimal slope <InlineMath math="w^*" />
          </h3>
          <BlockMath math={`w^* = \\frac{\\text{Cov}(x,y)}{\\text{Var}(x)}`} />
          <BlockMath
            math={`w^* = \\frac{${fmt(covXY)}}{${fmt(varX)}} = ${fmt(wStar)}`}
          />
        </div>
      );

    case 3:
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
            Step 4: Optimal intercept <InlineMath math="b^*" />
          </h3>
          <BlockMath math={`b^* = \\bar{y} - w^*\\bar{x}`} />
          <BlockMath
            math={`b^* = ${fmt(meanY)} - ${fmt(wStar)} \\times ${fmt(meanX)} = ${fmt(bStar)}`}
          />
        </div>
      );

    case 4:
      return (
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
            Step 5: Final regression line
          </h3>
          <BlockMath
            math={`\\hat{y} = ${fmt(wStar)}x ${fmtSigned(bStar)}`}
          />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            The amber line on the plot is the closed-form least-squares solution
            -- no iterative optimization needed.
          </p>
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 5;

export default function AnalyticalDemo() {
  const [step, setStep] = useState(-1); // -1 = no step revealed yet

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const handlePrev = () => setStep((s) => Math.max(s - 1, -1));
  const handleReset = () => setStep(-1);

  const showLine = step >= 4;

  return (
    <div className="my-8 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900/60">
      <h2 className="mb-4 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        Analytical (Closed-Form) Solution
      </h2>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Plot */}
        <div className="flex-shrink-0">
          <Plot showLine={showLine} />
        </div>

        {/* Steps panel */}
        <div className="min-h-[260px] flex-1">
          {step < 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Click <strong>Next step</strong> to walk through the analytical
              solution for linear regression.
            </p>
          ) : (
            <StepContent step={step} />
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={step < 0}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={step >= TOTAL_STEPS - 1}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next step
        </button>
        <button
          onClick={handleReset}
          className="ml-auto rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
        <span className="text-xs text-zinc-400">
          {step < 0 ? "0" : step + 1} / {TOTAL_STEPS}
        </span>
      </div>
    </div>
  );
}
