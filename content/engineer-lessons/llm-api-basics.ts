import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "llm-api-basics",
  title: "LLM API呼び出しの基本",
  subtitle: "PythonからClaude APIを叩いてレスポンスを受け取る",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** Anthropic SDKを使ってPythonからClaude APIを呼び出し、レスポンスを受け取れる。

**所要時間：** 約25分

---

「AIを組み込んだサービスを作る」の基本がここです。

ChatGPTのようなチャット、自動で文章を生成するシステム、データを要約するバッチ処理——これらすべてが「APIを叩いてレスポンスを受け取る」という同じ仕組みで動いています。

このレッスンを終えると、AI機能を組み込んだスクリプトをClause Codeに指示して作らせるとき、何が起きているかが完全に理解できます。`,
        },
      ],
    },
    {
      id: "setup",
      title: "SDKのセットアップ",
      blocks: [
        {
          type: "text",
          content: `**ステップ1：AnthropicのAPIキーを取得**

1. [console.anthropic.com](https://console.anthropic.com) にアクセス
2. 「API Keys」→「Create Key」
3. キーをコピー（\`sk-ant-api...\` から始まる文字列）

---

**ステップ2：環境変数に設定**

APIキーはコードに直接書いてはいけません（GitHubに公開したら終わり）。

\`\`\`bash
# .envファイルを作成
echo "ANTHROPIC_API_KEY=sk-ant-api..." > .env

# .gitignoreに追加（必須！）
echo ".env" >> .gitignore
\`\`\`

---

**ステップ3：SDKをインストール**

\`\`\`bash
uv add anthropic python-dotenv
\`\`\`

\`python-dotenv\` は \`.env\` ファイルを読み込むライブラリです。`,
        },
      ],
    },
    {
      id: "first-call",
      title: "最初のAPI呼び出し",
      blocks: [
        {
          type: "text",
          content: `\`\`\`python
# hello_claude.py
import os
from dotenv import load_dotenv
import anthropic

# .envファイルを読み込む
load_dotenv()

# クライアントを作成
client = anthropic.Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY")
)

# APIを呼び出す
message = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "日本語で「こんにちは」と言ってください"
        }
    ]
)

# レスポンスを表示
print(message.content[0].text)
\`\`\`

\`\`\`bash
uv run hello_claude.py
\`\`\`

「こんにちは！」や「こんにちは！どのようにお手伝いできますか？」などのレスポンスが返ってきます。

---

**レスポンスの構造：**

\`\`\`python
print(message.id)                # メッセージID
print(message.model)             # 使用モデル
print(message.usage.input_tokens)   # 入力トークン数
print(message.usage.output_tokens)  # 出力トークン数
print(message.stop_reason)       # 終了理由（end_turn等）
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-api-builder",
        },
      ],
    },
    {
      id: "messages-structure",
      title: "messagesの構造",
      blocks: [
        {
          type: "text",
          content: `Claude APIの核心は **messages配列** です。会話の履歴を全部渡します。

\`\`\`python
messages = [
    {"role": "user", "content": "Pythonとは何ですか？"},
    {"role": "assistant", "content": "Pythonはプログラミング言語です..."},
    {"role": "user", "content": "どんな用途に使われますか？"},
    # ↑ 最後が user で終わる = 次のレスポンスを求めている
]

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    messages=messages
)
\`\`\`

---

**会話を続けるパターン：**

\`\`\`python
def chat(history: list, user_input: str) -> tuple[str, list]:
    history.append({"role": "user", "content": user_input})

    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1024,
        messages=history
    )

    reply = response.content[0].text
    history.append({"role": "assistant", "content": reply})

    return reply, history

# 使い方
history = []
reply, history = chat(history, "こんにちは！")
print(reply)

reply, history = chat(history, "私の名前は臨太郎です")
print(reply)

reply, history = chat(history, "私の名前を覚えていますか？")
print(reply)  # ← 「臨太郎さん」と答えるはず
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
            question: "APIキーをコードに直接書かない理由として最も重要なのは？",
            options: [
              "コードが長くなるから",
              "GitHubにpushしたとき漏洩して不正利用されるリスクがあるから",
              "APIキーは毎回変わるから",
              "環境変数の方が速いから",
            ],
            answer: 1,
            explanation: "GitHubの公開リポジトリにAPIキーが含まれると、ボットに自動スキャンされて数分で不正利用されます。環境変数や.envファイル（.gitignore済み）に分離することが必須です。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "Claude APIのmessages配列に含まれるものはどれ？",
            options: [
              "実行するPythonコード",
              "会話の履歴（roleとcontent）",
              "APIキー",
              "モデル名",
            ],
            answer: 1,
            explanation: "messagesには会話の履歴を渡します。各メッセージはrole（user/assistant）とcontent（テキスト）のペアです。会話文脈を全部渡すのがClaude APIの仕組みです。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "max_tokensパラメータは何を制御する？",
            options: [
              "入力できる文字数の最大値",
              "レスポンスの最大トークン数（長さ）",
              "APIキーの有効期限",
              "モデルのバージョン",
            ],
            answer: 1,
            explanation: "max_tokensはClaudeが返すレスポンスの最大トークン数を指定します。長い文章が必要なら大きく、短い返答でいいなら小さく設定します。トークンはコストに直結します。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：テキスト要約ツールを作る",
      blocks: [
        {
          type: "text",
          content: `Claude APIを使って、テキストを自動要約するスクリプトを作りましょう。

\`\`\`python
# summarize.py
import os
from dotenv import load_dotenv
import anthropic

load_dotenv()
client = anthropic.Anthropic()

def summarize(text: str, max_points: int = 3) -> str:
    """テキストを箇条書きで要約する"""
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": f"""以下のテキストを{max_points}点の箇条書きで要約してください。

テキスト:
{text}

箇条書き:"""
            }
        ]
    )
    return response.content[0].text

# テスト
sample = """
Python（パイソン）は、1991年にグイド・ヴァン・ロッサムが作ったプログラミング言語です。
読みやすい文法と豊富なライブラリが特徴で、AI・データサイエンス・Web開発・自動化など
幅広い用途で使われています。初心者にも扱いやすく、世界で最も人気のある言語の一つです。
"""

result = summarize(sample)
print(result)
\`\`\`

**課題：** max_pointsを5に変えて呼び出し、要約の詳細度が変わることを確認してください。また、\`message.usage\` でトークン数を表示してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
