"use client";

import { useState } from "react";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

/* ------------------------------------------------------------------ */
/*  Dataset                                                            */
/* ------------------------------------------------------------------ */

/** Small dataset: (x, y) pairs representing hours studied vs. exam score */
const DATA: { x: number; y: number }[] = [
  { x: 1, y: 2.2 },
  { x: 2, y: 2.8 },
  { x: 3, y: 4.5 },
  { x: 4, y: 3.9 },
  { x: 5, y: 5.1 },
];

/* ------------------------------------------------------------------ */
/*  Matrix math helpers                                                */
/* ------------------------------------------------------------------ */

/**
 * Build the design matrix X (n x 2) with a column of 1s for the intercept.
 *   X = [[1, x1], [1, x2], ...]
 */
function designMatrix(data: typeof DATA): number[][] {
  return data.map((d) => [1, d.x]);
}

/** Extract the y column vector */
function yVector(data: typeof DATA): number[] {
  return data.map((d) => d.y);
}

/** Transpose a matrix */
function transpose(M: number[][]): number[][] {
  const rows = M.length;
  const cols = M[0].length;
  const T: number[][] = [];
  for (let j = 0; j < cols; j++) {
    T[j] = [];
    for (let i = 0; i < rows; i++) {
      T[j][i] = M[i][j];
    }
  }
  return T;
}

/** Multiply two matrices */
function matMul(A: number[][], B: number[][]): number[][] {
  const rowsA = A.length;
  const colsA = A[0].length;
  const colsB = B[0].length;
  const C: number[][] = Array.from({ length: rowsA }, () =>
    Array(colsB).fill(0),
  );
  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

/** Inverse of a 2x2 matrix */
function inv2x2(M: number[][]): number[][] {
  const [[a, b], [c, d]] = M;
  const det = a * d - b * c;
  return [
    [d / det, -b / det],
    [-c / det, a / det],
  ];
}

/** Matrix-vector product (matrix * column vector) → vector */
function matVec(M: number[][], v: number[]): number[] {
  return M.map((row) => row.reduce((s, val, i) => s + val * v[i], 0));
}

/** Format a number to at most `d` decimal places */
function fmt(n: number, d = 2): string {
  return Number(n.toFixed(d)).toString();
}

/* ------------------------------------------------------------------ */
/*  Pre-compute all results so steps can reference them                */
/* ------------------------------------------------------------------ */

const X = designMatrix(DATA);
const y = yVector(DATA);
const Xt = transpose(X);
const XtX = matMul(Xt, X);
const XtX_inv = inv2x2(XtX);
const Xty = matVec(Xt, y);
// w* = (X^T X)^{-1} X^T y
const wStar = matVec(XtX_inv, Xty);

/* ------------------------------------------------------------------ */
/*  LaTeX builders                                                     */
/* ------------------------------------------------------------------ */

function latexMatrix(M: number[][], decimals = 1): string {
  const rows = M.map(
    (row) => row.map((v) => fmt(v, decimals)).join(" & "),
  ).join(" \\\\ ");
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}

function latexColVec(v: number[], decimals = 1): string {
  return `\\begin{bmatrix} ${v.map((x) => fmt(x, decimals)).join(" \\\\ ")} \\end{bmatrix}`;
}

/* ------------------------------------------------------------------ */
/*  Step definitions                                                   */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 5;

function StepContent({ step }: { step: number }) {
  switch (step) {
    /* ---- Step 1: Data table ---- */
    case 1:
      return (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700">
            Step 1 &mdash; The Dataset
          </h4>
          <p className="mb-3 text-sm text-zinc-500">
            We have {DATA.length} observations. Each row is one data point with
            a feature <InlineMath math="x" /> (hours studied) and a target{" "}
            <InlineMath math="y" /> (exam score).
          </p>
          <table className="mx-auto text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-300">
                <th className="px-4 py-1.5 text-zinc-500 font-medium">i</th>
                <th className="px-4 py-1.5 text-zinc-500 font-medium">
                  <InlineMath math="x_i" />
                </th>
                <th className="px-4 py-1.5 text-zinc-500 font-medium">
                  <InlineMath math="y_i" />
                </th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((d, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="px-4 py-1.5 text-center text-zinc-400">
                    {i + 1}
                  </td>
                  <td className="px-4 py-1.5 text-center font-mono">
                    {d.x}
                  </td>
                  <td className="px-4 py-1.5 text-center font-mono">
                    {d.y}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    /* ---- Step 2: Matrix formulation ---- */
    case 2:
      return (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700">
            Step 2 &mdash; Matrix Formulation
          </h4>
          <p className="mb-3 text-sm text-zinc-500">
            We rewrite each data point as a row of the{" "}
            <strong>design matrix</strong> <InlineMath math="\mathbf{X}" />.
            The first column is all 1s (for the intercept term{" "}
            <InlineMath math="w_0" />
            ), and the second column holds the feature values.
          </p>
          <div className="space-y-3">
            <BlockMath
              math={`\\mathbf{X} = ${latexMatrix(X, 0)} \\qquad (${DATA.length} \\times 2)`}
            />
            <BlockMath
              math={`\\mathbf{y} = ${latexColVec(y)} \\qquad (${DATA.length} \\times 1)`}
            />
            <BlockMath
              math={`\\mathbf{w} = \\begin{bmatrix} w_0 \\\\ w_1 \\end{bmatrix} \\qquad (2 \\times 1)`}
            />
          </div>
          <p className="mt-3 text-sm text-zinc-500">
            The model <InlineMath math="y = w_0 + w_1 x" /> becomes{" "}
            <InlineMath math="\mathbf{y} \approx \mathbf{X}\mathbf{w}" /> in
            matrix form.
          </p>
        </div>
      );

    /* ---- Step 3: Normal equation ---- */
    case 3:
      return (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700">
            Step 3 &mdash; The Normal Equation
          </h4>
          <p className="mb-3 text-sm text-zinc-500">
            To minimize the squared error{" "}
            <InlineMath math="\|\mathbf{y} - \mathbf{X}\mathbf{w}\|^2" />, we
            take the derivative, set it to zero, and solve for{" "}
            <InlineMath math="\mathbf{w}" />. The closed-form solution is:
          </p>
          <BlockMath math="\mathbf{w}^* = (\mathbf{X}^\top \mathbf{X})^{-1}\;\mathbf{X}^\top \mathbf{y}" />
          <p className="mt-3 text-sm text-zinc-500">
            This is the <strong>normal equation</strong>. No iteration needed
            &mdash; just matrix multiplication and one inverse.
          </p>
        </div>
      );

    /* ---- Step 4: Numerical computation ---- */
    case 4:
      return (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700">
            Step 4 &mdash; Plugging in the Numbers
          </h4>
          <p className="mb-3 text-sm text-zinc-500">
            Let&rsquo;s compute each piece step-by-step with our data.
          </p>

          {/* X^T X */}
          <p className="mb-1 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            1. Compute <InlineMath math="\mathbf{X}^\top \mathbf{X}" />
          </p>
          <BlockMath
            math={`\\mathbf{X}^\\top \\mathbf{X} = ${latexMatrix(Xt, 0)} ${latexMatrix(X, 0)} = ${latexMatrix(XtX, 0)}`}
          />

          {/* (X^T X)^{-1} */}
          <p className="mb-1 mt-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            2. Invert <InlineMath math="(\mathbf{X}^\top \mathbf{X})^{-1}" />
          </p>
          <BlockMath
            math={`(\\mathbf{X}^\\top \\mathbf{X})^{-1} = ${latexMatrix(XtX_inv, 4)}`}
          />

          {/* X^T y */}
          <p className="mb-1 mt-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            3. Compute <InlineMath math="\mathbf{X}^\top \mathbf{y}" />
          </p>
          <BlockMath
            math={`\\mathbf{X}^\\top \\mathbf{y} = ${latexMatrix(Xt, 0)} ${latexColVec(y)} = ${latexColVec(Xty, 1)}`}
          />

          {/* Final multiply */}
          <p className="mb-1 mt-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
            4. Multiply to get{" "}
            <InlineMath math="\mathbf{w}^*" />
          </p>
          <BlockMath
            math={`\\mathbf{w}^* = ${latexMatrix(XtX_inv, 4)} ${latexColVec(Xty, 1)} = ${latexColVec(wStar, 3)}`}
          />
        </div>
      );

    /* ---- Step 5: Result ---- */
    case 5:
      return (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-zinc-700">
            Step 5 &mdash; The Result
          </h4>
          <p className="mb-3 text-sm text-zinc-500">
            We now have the optimal weights:
          </p>
          <BlockMath
            math={`\\mathbf{w}^* = \\begin{bmatrix} w_0 \\\\ w_1 \\end{bmatrix} = \\begin{bmatrix} ${fmt(wStar[0], 3)} \\\\ ${fmt(wStar[1], 3)} \\end{bmatrix}`}
          />
          <p className="mt-3 text-sm text-zinc-500">
            So the best-fit line is:
          </p>
          <BlockMath
            math={`\\hat{y} = ${fmt(wStar[0], 3)} + ${fmt(wStar[1], 3)}\\,x`}
          />
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Key takeaway:</strong> Linear regression is just matrix
            algebra. Given data <InlineMath math="\mathbf{X}" /> and targets{" "}
            <InlineMath math="\mathbf{y}" />, we can compute the exact
            solution in one shot with the normal equation &mdash; no gradient
            descent required.
          </div>

          {/* Prediction table */}
          <p className="mt-4 mb-2 text-sm text-zinc-500">
            Predictions vs. actual values:
          </p>
          <table className="mx-auto text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-300">
                <th className="px-3 py-1.5 text-zinc-500 font-medium">
                  <InlineMath math="x" />
                </th>
                <th className="px-3 py-1.5 text-zinc-500 font-medium">
                  <InlineMath math="y" /> (actual)
                </th>
                <th className="px-3 py-1.5 text-zinc-500 font-medium">
                  <InlineMath math="\hat{y}" /> (predicted)
                </th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((d, i) => {
                const yHat = wStar[0] + wStar[1] * d.x;
                return (
                  <tr key={i} className="border-b border-zinc-100">
                    <td className="px-3 py-1.5 text-center font-mono">
                      {d.x}
                    </td>
                    <td className="px-3 py-1.5 text-center font-mono">
                      {d.y}
                    </td>
                    <td className="px-3 py-1.5 text-center font-mono text-amber-600">
                      {fmt(yHat, 2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MatrixDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-zinc-800">
          Linear Regression &mdash; Matrix Formulation
        </h3>
        <p className="text-sm text-zinc-500">
          Step through the matrix derivation of ordinary least squares.
        </p>
      </div>

      {/* Step indicator */}
      <div className="mb-4 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
          <button
            key={s}
            onClick={() => setStep(s)}
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition ${
              s === step
                ? "bg-amber-400 text-white shadow-sm"
                : s < step
                  ? "bg-amber-100 text-amber-700"
                  : "bg-zinc-100 text-zinc-400"
            }`}
          >
            {s}
          </button>
        ))}
        <span className="ml-2 text-xs text-zinc-400">
          Step {step} / {TOTAL_STEPS}
        </span>
      </div>

      {/* Content area */}
      <div className="rounded-lg border border-zinc-200 bg-white px-5 py-4">
        <StepContent step={step} />
      </div>

      {/* Navigation buttons */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="rounded-md border border-zinc-300 bg-white px-4 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          &larr; Back
        </button>
        <button
          onClick={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
          disabled={step === TOTAL_STEPS}
          className="rounded-md border border-amber-400 bg-amber-400 px-4 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next Step &rarr;
        </button>
      </div>
    </div>
  );
}
