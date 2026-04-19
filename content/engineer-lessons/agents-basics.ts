import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "agents-basics",
  title: "エージェントとは何か",
  subtitle: "ループ・記憶・計画の概念と簡単な自律エージェント",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** エージェントの構成要素（ループ・記憶・計画）を理解し、簡単な自律エージェントを実装できる。

**所要時間：** 約30分

---

「エージェント」はAIの世界で最も注目されている概念です。Claude Code自体がエージェントの一例です。

「1回聞いて終わり」ではなく、「自律的に考えて、ツールを使って、タスクを完了するまで動き続ける」——それがエージェントです。`,
        },
      ],
    },
    {
      id: "what-is-agent",
      title: "エージェントとは",
      blocks: [
        {
          type: "text",
          content: `**エージェント** は「目標を与えると、自律的に行動してそれを達成しようとするAIシステム」です。

---

**普通のLLM呼び出し（1回のAPI呼び出し）：**

\`\`\`
ユーザー → 「このメールを要約して」→ Claude → 「要約した文章」→ ユーザー
\`\`\`

**エージェント（ループ + ツール使用）：**

\`\`\`
ユーザー → 「競合他社をリサーチしてまとめて」
    ↓
Claude: 「まずGoogle検索する」→ search("競合A")
    ↓
Claude: 「結果を見て、もっと調べる」→ search("競合A CEO")
    ↓
Claude: 「情報が揃った。まとめる」
    ↓
ユーザー ← レポート
\`\`\`

複数ステップを自律的に実行します。

---

**エージェントの3要素：**

1. **LLM（推論エンジン）** — 次に何をするか考える
2. **ツール（手足）** — 実際に外の世界と相互作用する
3. **ループ（継続性）** — タスクが完了するまで繰り返す`,
        },
        {
          type: "interactive",
          id: "eng-agent-loop",
        },
      ],
    },
    {
      id: "memory",
      title: "記憶の種類",
      blocks: [
        {
          type: "text",
          content: `エージェントは「何を覚えているか」によって振る舞いが変わります。

---

**1. コンテキスト内記憶（短期記憶）**

現在の会話ウィンドウに含まれる情報。セッションが終わると消える。

\`\`\`python
messages = [
    {"role": "user", "content": "私の名前は臨太郎です"},
    {"role": "assistant", "content": "わかりました"},
    {"role": "user", "content": "私の名前は？"}
    # ← 上の会話が全部コンテキストにあるので答えられる
]
\`\`\`

---

**2. 外部記憶（長期記憶）**

ファイル・データベース・ベクトルDBに保存。セッションをまたいで使える。

\`\`\`python
import json
from pathlib import Path

def save_memory(key: str, value: str):
    memory_file = Path("memory.json")
    data = json.loads(memory_file.read_text()) if memory_file.exists() else {}
    data[key] = value
    memory_file.write_text(json.dumps(data, ensure_ascii=False))

def load_memory(key: str) -> str:
    memory_file = Path("memory.json")
    if not memory_file.exists():
        return ""
    data = json.loads(memory_file.read_text())
    return data.get(key, "")
\`\`\`

---

**3. 作業記憶（ワーキングメモリ）**

タスク実行中の中間結果。変数やリストに保持。

\`\`\`python
workspace = {
    "task": "競合分析",
    "gathered_info": [],
    "completed_steps": []
}
\`\`\``,
        },
      ],
    },
    {
      id: "simple-agent",
      title: "シンプルなエージェントを実装",
      blocks: [
        {
          type: "text",
          content: `「タスクリストを自律的に実行するエージェント」を作ります。

\`\`\`python
# simple_agent.py
import anthropic
import json

client = anthropic.Anthropic()

# ツール定義
tools = [
    {
        "name": "search_web",
        "description": "キーワードでWeb検索する（ここではダミー）",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "検索キーワード"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "save_result",
        "description": "調査結果をファイルに保存する",
        "input_schema": {
            "type": "object",
            "properties": {
                "content": {"type": "string", "description": "保存する内容"}
            },
            "required": ["content"]
        }
    }
]

# ツール実装
def search_web(query: str) -> str:
    # ダミーデータ（実際はAPI）
    return f"'{query}' の検索結果: 関連情報がN件見つかりました（ダミー）"

def save_result(content: str) -> str:
    with open("output.txt", "w") as f:
        f.write(content)
    return "output.txtに保存しました"

def run_agent(task: str, max_steps: int = 5) -> str:
    print(f"\\n=== エージェント開始: {task} ===")
    messages = [{"role": "user", "content": task}]

    for step in range(max_steps):
        print(f"\\nステップ {step + 1}:")

        response = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=1024,
            tools=tools,
            messages=messages
        )

        # ツール呼び出しがなければタスク完了
        if response.stop_reason == "end_turn":
            final_text = response.content[0].text
            print(f"完了: {final_text[:100]}...")
            return final_text

        # ツールを実行
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"ツール使用: {block.name}({block.input})")

                if block.name == "search_web":
                    result = search_web(block.input["query"])
                elif block.name == "save_result":
                    result = save_result(block.input["content"])
                else:
                    result = "未知のツール"

                print(f"結果: {result}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        # 会話履歴に追加
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

    return "最大ステップ数に達しました"

# 実行
run_agent("PythonとJavaScriptの違いを調べて、output.txtに保存してください")
\`\`\``,
        },
      ],
    },
    {
      id: "quiz-section",
      title: "理解度チェック",
      blocks: [
        {
          type: "quiz",
          data: {
            question: "エージェントが「ループ」する理由は？",
            options: [
              "バグがあるから繰り返す",
              "タスクが完了するまで自律的にステップを実行し続けるため",
              "コストを下げるため",
              "ユーザーの入力を待つため",
            ],
            answer: 1,
            explanation: "エージェントは「タスクが完了するまで」LLMの判断 → ツール実行 → 結果確認 → 次のアクション、というサイクルを繰り返します。これがエージェントと単純なLLM呼び出しの最大の違いです。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "エージェントの「外部記憶」の用途として正しいのはどれ？",
            options: [
              "現在の会話の文脈を保持する",
              "セッションをまたいで情報を保存・参照する",
              "LLMのモデルウェイトを保存する",
              "APIキーを管理する",
            ],
            answer: 1,
            explanation: "外部記憶（ファイル、DB）はセッション終了後も情報を保持できます。「前回の会話で話したことを今回も覚えている」ような長期記憶を実現します。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "エージェントにmax_stepsを設定する主な理由は？",
            options: [
              "レスポンスを速くするため",
              "無限ループやコスト爆発を防ぐため",
              "ツールの数を制限するため",
              "メモリ使用量を減らすため",
            ],
            answer: 1,
            explanation: "エージェントが無限にループすると、APIコストが青天井になります。max_stepsで最大試行回数を設定することで、暴走を防ぎます。本番環境では必須です。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：ファイル管理エージェント",
      blocks: [
        {
          type: "text",
          content: `ファイルを作成・読み取り・一覧表示できるエージェントを作りましょう。

\`\`\`python
# file_agent.py
import anthropic
import os
from pathlib import Path

client = anthropic.Anthropic()

WORKSPACE = Path("./agent_workspace")
WORKSPACE.mkdir(exist_ok=True)

tools = [
    {
        "name": "write_file",
        "description": "ファイルを作成・上書きする",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["filename", "content"]
        }
    },
    {
        "name": "read_file",
        "description": "ファイルの内容を読む",
        "input_schema": {
            "type": "object",
            "properties": {
                "filename": {"type": "string"}
            },
            "required": ["filename"]
        }
    },
    {
        "name": "list_files",
        "description": "ファイル一覧を表示する",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    }
]

def handle_tool(name: str, inputs: dict) -> str:
    if name == "write_file":
        (WORKSPACE / inputs["filename"]).write_text(inputs["content"])
        return f"{inputs['filename']} を作成しました"
    elif name == "read_file":
        path = WORKSPACE / inputs["filename"]
        return path.read_text() if path.exists() else "ファイルが存在しません"
    elif name == "list_files":
        files = [f.name for f in WORKSPACE.iterdir()]
        return str(files) if files else "ファイルなし"
    return "未知のツール"

# タスクを与える
task = """以下のタスクをこなしてください:
1. notes.txtに今日学んだことを3点書く
2. そのファイルを読み直して確認する
3. ファイル一覧を確認する"""

# 上記のrun_agent関数をコピーして実行してください
\`\`\`

**課題：** タスクを「notes.txtとtodo.txtの2つを作成する」に変えて実行してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
