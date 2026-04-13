"use client";

import { useState } from "react";

type Area = "working" | "staging" | "repository";

interface FileItem {
  id: string;
  name: string;
  area: Area;
}

const INITIAL_FILES: FileItem[] = [
  { id: "1", name: "index.html", area: "working" },
  { id: "2", name: "style.css", area: "working" },
  { id: "3", name: "app.js", area: "working" },
];

const AREA_CONFIG: Record<Area, { label: string; sub: string; color: string; bg: string; border: string; command: string }> = {
  working: {
    label: "作業ディレクトリ",
    sub: "ファイルを編集する場所",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    command: "",
  },
  staging: {
    label: "ステージングエリア",
    sub: "保存するファイルを選ぶ場所",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    command: "git add",
  },
  repository: {
    label: "リポジトリ",
    sub: "履歴が永久保存される場所",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    command: "git commit",
  },
};

const AREA_ORDER: Area[] = ["working", "staging", "repository"];

export default function ThreeStates() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [lastAction, setLastAction] = useState<string>("ファイルをクリックして次のエリアに移動しましょう");
  const [committed, setCommitted] = useState<string[]>([]);

  function moveFile(fileId: string) {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        const currentIdx = AREA_ORDER.indexOf(f.area);
        if (currentIdx >= AREA_ORDER.length - 1) return f;
        const nextArea = AREA_ORDER[currentIdx + 1];
        const config = AREA_CONFIG[nextArea];
        setLastAction(
          config.command
            ? `${config.command} ${f.name} → 「${config.label}」に移動`
            : `${f.name} を編集中`
        );
        if (nextArea === "repository") {
          setCommitted((c) => [...c, f.name]);
        }
        return { ...f, area: nextArea };
      })
    );
  }

  function reset() {
    setFiles(INITIAL_FILES);
    setLastAction("ファイルをクリックして次のエリアに移動しましょう");
    setCommitted([]);
  }

  const filesInArea = (area: Area) => files.filter((f) => f.area === area);
  const allCommitted = files.every((f) => f.area === "repository");

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{lastAction}</p>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          リセット
        </button>
      </div>

      {/* Three areas */}
      <div className="grid gap-4 md:grid-cols-3">
        {AREA_ORDER.map((area, areaIdx) => {
          const config = AREA_CONFIG[area];
          const areaFiles = filesInArea(area);
          return (
            <div key={area}>
              {/* Arrow between areas */}
              {areaIdx > 0 && (
                <div className="mb-2 hidden items-center justify-center md:flex">
                  {/* Arrow is shown above each box except the first */}
                </div>
              )}
              <div className={`rounded-lg border ${config.border} ${config.bg} p-4`}>
                <div className="mb-1 text-sm font-semibold">
                  <span className={config.color}>{config.label}</span>
                </div>
                <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{config.sub}</p>
                {config.command && (
                  <div className="mb-3">
                    <code className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                      {config.command}
                    </code>
                    <span className="ml-1 text-[10px] text-zinc-400">↑ このコマンドで移動</span>
                  </div>
                )}
                <div className="min-h-[80px] space-y-2">
                  {areaFiles.map((f) => {
                    const canMove = AREA_ORDER.indexOf(f.area) < AREA_ORDER.length - 1;
                    return (
                      <button
                        key={f.id}
                        onClick={() => canMove && moveFile(f.id)}
                        disabled={!canMove}
                        className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          canMove
                            ? "border-zinc-300 bg-white cursor-pointer hover:border-amber-400 hover:shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-amber-500"
                            : "border-green-300 bg-green-100 dark:border-green-700 dark:bg-green-900/30"
                        }`}
                      >
                        <svg className="h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-zinc-700 dark:text-zinc-200">{f.name}</span>
                        {canMove && (
                          <svg className="ml-auto h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                        {!canMove && (
                          <svg className="ml-auto h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                  {areaFiles.length === 0 && (
                    <div className="flex h-[60px] items-center justify-center text-xs text-zinc-400 dark:text-zinc-500">
                      （空）
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Committed files indicator */}
      {committed.length > 0 && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
          <span className="text-xs font-medium text-green-700 dark:text-green-400">
            保存済み: {committed.join(", ")}
          </span>
          {allCommitted && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400">
              全てのファイルがリポジトリに保存されました！これで変更履歴として永久に記録されます。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
