"use client";

import { useState } from "react";

const commands: Record<string, string> = {
  "uv --version": "uv 0.5.4",
  "uv init my-project": `Initialized project \`my-project\` at \`./my-project\`
Created \`pyproject.toml\`
Created \`README.md\`
Created \`hello.py\`
Created \`.python-version\``,
  "uv run hello.py": "Hello from my-project!",
  "uv add requests": `Resolved 5 packages in 234ms
Installed 5 packages in 89ms
 + certifi==2024.2.2
 + charset-normalizer==3.3.2
 + idna==3.6
 + requests==2.31.0
 + urllib3==2.2.1`,
  "uv add anthropic": `Resolved 12 packages in 312ms
Installed anthropic==0.40.0`,
  "uv sync": `Resolved 5 packages in 45ms
Audited 5 packages in 3ms`,
  "ls": `README.md
hello.py
pyproject.toml
.python-version`,
  "cat pyproject.toml": `[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.31.0",
]`,
  "help": `使えるコマンド:
  uv --version
  uv init my-project
  uv run hello.py
  uv add requests
  uv add anthropic
  uv sync
  ls
  cat pyproject.toml
  clear`,
  "clear": "__clear__",
};

export default function TerminalSim() {
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([
    { cmd: "", output: "uvターミナルシミュレーター。コマンドを入力してEnterを押してください。\n'help'で使えるコマンド一覧を表示" },
  ]);
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    if (cmd === "clear") {
      setHistory([{ cmd: "", output: "クリアしました。" }]);
    } else {
      const output = commands[cmd] ?? `bash: ${cmd}: コマンドが見つかりません\nヒント: 'help' と入力してください`;
      setHistory((prev) => [...prev, { cmd, output }]);
    }
    setInput("");
  };

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-700">
      <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-zinc-400">ターミナル</span>
      </div>
      <div className="bg-zinc-900 p-4 font-mono text-sm text-green-400 min-h-48 max-h-72 overflow-y-auto">
        {history.map((h, i) => (
          <div key={i} className="mb-2">
            {h.cmd && <p className="text-zinc-300"><span className="text-amber-400">$ </span>{h.cmd}</p>}
            <pre className="whitespace-pre-wrap text-green-400 text-xs">{h.output}</pre>
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-amber-400">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-zinc-200 outline-none"
            placeholder="コマンドを入力..."
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
}
