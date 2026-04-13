"use client";

import { useState } from "react";

const SVG_W = 640;
const SVG_H = 380;
const PAD = { top: 30, right: 30, bottom: 60, left: 70 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

interface Task {
  name: string;
  description: string;
  threshold: number; // log10 of parameter count where emergence happens
  maxAcc: number;
  color: string;
}

const TASKS: Task[] = [
  {
    name: "3桁の足し算",
    description: "3桁の数字同士の足し算を正確に解く能力",
    threshold: 10,
    maxAcc: 85,
    color: "#3b82f6",
  },
  {
    name: "コード生成",
    description: "自然言語の指示からプログラムを生成する能力",
    threshold: 10.8,
    maxAcc: 75,
    color: "#8b5cf6",
  },
  {
    name: "多段階推論",
    description: "Chain-of-Thoughtによる論理的な推論能力",
    threshold: 11,
    maxAcc: 80,
    color: "#ec4899",
  },
  {
    name: "ジョークの理解",
    description: "ユーモアや皮肉を理解し説明する能力",
    threshold: 11.2,
    maxAcc: 70,
    color: "#10b981",
  },
];

// Sigmoid-like step function
function accuracy(logN: number, task: Task): number {
  const steepness = 5;
  const sigmoid =
    1 / (1 + Math.exp(-steepness * (logN - task.threshold)));
  return sigmoid * task.maxAcc;
}

const LOG_N_MIN = 8;
const LOG_N_MAX = 12.5;
const ACC_MIN = 0;
const ACC_MAX = 100;

function toX(logN: number): number {
  return PAD.left + ((logN - LOG_N_MIN) / (LOG_N_MAX - LOG_N_MIN)) * PLOT_W;
}

function toY(acc: number): number {
  return PAD.top + ((ACC_MAX - acc) / (ACC_MAX - ACC_MIN)) * PLOT_H;
}

function formatParams(n: number): string {
  if (n >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return `${n}`;
}

export default function EmergentDemo() {
  const [activeTasks, setActiveTasks] = useState<Set<number>>(
    () => new Set([0, 1, 2, 3])
  );

  function toggleTask(idx: number) {
    setActiveTasks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  }

  const ticks = [8, 9, 10, 11, 12];
  const accTicks = [0, 20, 40, 60, 80, 100];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="mb-2 text-lg font-bold text-zinc-800 dark:text-zinc-100">
        創発能力（Emergent Abilities）
      </h3>
      <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
        タスクを切り替えて、どのスケールで能力が「開花」するかを観察しましょう
      </p>

      {/* task toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {TASKS.map((task, idx) => (
          <button
            key={task.name}
            onClick={() => toggleTask(idx)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              activeTasks.has(idx)
                ? "text-white shadow-sm"
                : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500"
            }`}
            style={
              activeTasks.has(idx)
                ? { backgroundColor: task.color }
                : undefined
            }
          >
            {task.name}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full"
        style={{ maxWidth: SVG_W }}
      >
        {/* grid */}
        {ticks.map((t) => (
          <line
            key={`gx-${t}`}
            x1={toX(t)}
            y1={PAD.top}
            x2={toX(t)}
            y2={PAD.top + PLOT_H}
            stroke="#71717a"
            strokeOpacity={0.15}
            strokeDasharray="4 4"
          />
        ))}
        {accTicks.map((a) => (
          <line
            key={`gy-${a}`}
            x1={PAD.left}
            y1={toY(a)}
            x2={PAD.left + PLOT_W}
            y2={toY(a)}
            stroke="#71717a"
            strokeOpacity={0.15}
            strokeDasharray="4 4"
          />
        ))}

        {/* axes */}
        <line
          x1={PAD.left}
          y1={PAD.top + PLOT_H}
          x2={PAD.left + PLOT_W}
          y2={PAD.top + PLOT_H}
          stroke="#a1a1aa"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + PLOT_H}
          stroke="#a1a1aa"
          strokeWidth={1}
        />

        {/* x ticks */}
        {ticks.map((t) => (
          <text
            key={`xt-${t}`}
            x={toX(t)}
            y={PAD.top + PLOT_H + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#a1a1aa"
          >
            {formatParams(Math.pow(10, t))}
          </text>
        ))}

        {/* y ticks */}
        {accTicks.map((a) => (
          <text
            key={`yt-${a}`}
            x={PAD.left - 10}
            y={toY(a) + 4}
            textAnchor="end"
            fontSize={11}
            fill="#a1a1aa"
          >
            {a}%
          </text>
        ))}

        {/* x label */}
        <text
          x={PAD.left + PLOT_W / 2}
          y={SVG_H - 8}
          textAnchor="middle"
          fontSize={13}
          fill="#71717a"
        >
          モデルサイズ（パラメータ数）
        </text>

        {/* y label */}
        <text
          x={16}
          y={PAD.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={13}
          fill="#71717a"
          transform={`rotate(-90, 16, ${PAD.top + PLOT_H / 2})`}
        >
          タスク正答率
        </text>

        {/* task curves */}
        {TASKS.map((task, idx) => {
          if (!activeTasks.has(idx)) return null;
          const points: string[] = [];
          for (let ln = LOG_N_MIN; ln <= LOG_N_MAX; ln += 0.03) {
            const acc = accuracy(ln, task);
            const x = toX(ln);
            const y = toY(acc);
            points.push(`${x},${y}`);
          }
          const pathD = `M${points.join(" L")}`;

          // threshold marker
          const threshX = toX(task.threshold);
          const threshY = toY(accuracy(task.threshold, task));

          return (
            <g key={task.name}>
              <path
                d={pathD}
                fill="none"
                stroke={task.color}
                strokeWidth={2.5}
              />
              <circle
                cx={threshX}
                cy={threshY}
                r={5}
                fill={task.color}
                fillOpacity={0.4}
                stroke={task.color}
                strokeWidth={2}
              />
              <text
                x={threshX + 8}
                y={threshY - 8}
                fontSize={10}
                fill={task.color}
                fontWeight="bold"
              >
                {formatParams(Math.pow(10, task.threshold))}
              </text>
            </g>
          );
        })}
      </svg>

      {/* task descriptions */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {TASKS.map((task, idx) => {
          if (!activeTasks.has(idx)) return null;
          return (
            <div
              key={task.name}
              className="flex items-start gap-2 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800"
            >
              <div
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: task.color }}
              />
              <div>
                <div className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {task.name}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  {task.description}
                </div>
                <div className="text-xs text-zinc-400 dark:text-zinc-500">
                  創発スケール: ~{formatParams(Math.pow(10, task.threshold))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
