import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "prompt-engineering",
  title: "プロンプトエンジニアリングの最低限",
  subtitle: "system/user/assistant の役割、few-shot、構造化出力",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** system/user/assistantの役割を理解し、few-shot promptingと構造化出力（JSON出力）を使える。

**所要時間：** 約25分

---

「同じ質問をしても、プロンプトによって回答の質が全然違う」という経験はあるはずです。

プロンプトエンジニアリングは「LLMへの指示の書き方」の技術です。これを知ると、Claude Codeへの指示も上手くなります（このレッスン自体が応用可能）。`,
        },
      ],
    },
    {
      id: "roles",
      title: "system / user / assistant の役割",
      blocks: [
        {
          type: "text",
          content: `Claude APIのmessages配列には3種類のroleがあります。

---

**system（システムプロンプト）**

Claudeの「キャラクター」「制約」「ルール」を設定します。会話を通して有効です。

\`\`\`python
messages=[
    {
        "role": "user",
        "content": "こんにちは"
    }
]

# system引数として別に渡す
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=1024,
    system="あなたは経験豊富なエンジニアメンターです。非エンジニアに向けて、専門用語を使わず身近な例えで説明します。",
    messages=messages
)
\`\`\`

---

**user（ユーザー）**

人間が送るメッセージ。質問・指示・情報を渡す。

---

**assistant（アシスタント）**

Claudeが返したメッセージ。会話履歴として渡すと文脈を保持できる。

\`\`\`python
messages = [
    {"role": "user", "content": "Pythonとは？"},
    {"role": "assistant", "content": "Pythonはプログラミング言語です..."},
    {"role": "user", "content": "続きを教えて"}
]
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-role-demo",
        },
      ],
    },
    {
      id: "few-shot",
      title: "Few-shot prompting",
      blocks: [
        {
          type: "text",
          content: `**Few-shot prompting** は「例を見せることで、期待するフォーマットや品質をLLMに教える」技法です。

---

**Zero-shot（例なし）：**

\`\`\`python
messages = [
    {"role": "user", "content": "以下のレビューを「良い」「悪い」に分類してください：最高の商品でした！"}
]
# → 「良い」（これだけなら動く）
\`\`\`

**Few-shot（例あり）：**

\`\`\`python
system = """レビューを分類してください。

出力形式:
sentiment: [良い/悪い/普通]
reason: [1行の理由]"""

messages = [
    {"role": "user", "content": "価格が高すぎる"},
    {"role": "assistant", "content": "sentiment: 悪い\\nreason: コストパフォーマンスへの不満"},
    {"role": "user", "content": "普通に使えます"},
    {"role": "assistant", "content": "sentiment: 普通\\nreason: 特に不満も満足もない"},
    {"role": "user", "content": "最高の商品でした！"},
    # ← ここからClaudeが回答
]
\`\`\`

例を2〜3個見せるだけで、出力の形式が安定します。特に分類タスク・データ抽出に有効です。`,
        },
      ],
    },
    {
      id: "structured-output",
      title: "構造化出力（JSON）",
      blocks: [
        {
          type: "text",
          content: `APIの出力を後処理する場合、JSON形式で返してもらうと扱いやすくなります。

---

**JSONで返すよう指示：**

\`\`\`python
import json

system = """以下のテキストから情報を抽出し、必ずJSONで返してください。

出力形式:
{
  "name": "人名",
  "company": "会社名",
  "role": "役職",
  "email": "メールアドレス（なければnull）"
}

JSONのみを返し、説明文は不要です。"""

text = "田中太郎さんはUribo株式会社の代表取締役です。連絡先はtanaka@uribo.co.jpです。"

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=512,
    system=system,
    messages=[{"role": "user", "content": text}]
)

# JSON文字列をdictに変換
result = json.loads(response.content[0].text)
print(result["name"])   # → 田中太郎
print(result["email"])  # → tanaka@uribo.co.jp
\`\`\`

---

**プロンプトのコツ：**

1. **具体的な例を示す** — 「良い出力」を見せる
2. **出力形式を明示** — 「JSONで返す」「箇条書き3点で」
3. **制約を明示** — 「100文字以内」「日本語で」
4. **役割を与える** — 「あなたはXXXです」でキャラクター設定
5. **段階的に考えさせる** — 「ステップバイステップで」`,
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
            question: "システムプロンプト（system）を使う主な目的は？",
            options: [
              "APIキーを設定する",
              "Claudeのキャラクター・制約・ルールを会話全体に設定する",
              "コストを下げる",
              "レスポンス速度を上げる",
            ],
            answer: 1,
            explanation: "システムプロンプトはClaudeの「役割」「制約」「ルール」を設定します。「あなたは○○です」「必ずJSON形式で返す」「日本語で回答する」などを会話全体に適用できます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "Few-shot promptingで「例を見せる」主な効果は？",
            options: [
              "APIが速くなる",
              "期待する出力フォーマットや品質をLLMに伝えられる",
              "トークンが節約できる",
              "エラーが発生しなくなる",
            ],
            answer: 1,
            explanation: "Few-shotは「こういう入力にはこういう出力を返してほしい」という例を見せることで、LLMの出力フォーマットや品質を安定させます。特に分類・抽出タスクで効果的です。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "APIの出力をプログラムで処理するとき、どの形式が最も扱いやすい？",
            options: [
              "自然な日本語の文章",
              "JSON形式",
              "Markdownの箇条書き",
              "CSVテキスト",
            ],
            answer: 1,
            explanation: "JSON形式ならjson.loads()で即座にdictに変換でき、特定のキーに直接アクセスできます。自然言語を後処理するより安定性が高く、パースエラーが起きにくいです。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：名刺情報抽出ツールを作る",
      blocks: [
        {
          type: "text",
          content: `テキストから名刺情報を抽出するツールを作りましょう。

\`\`\`python
# business_card_parser.py
import json
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic()

SYSTEM = """テキストから名刺情報を抽出し、以下のJSON形式で返してください。
見つからない項目はnullにします。JSONのみ返し、説明文は不要です。

{
  "name": "氏名",
  "company": "会社名",
  "role": "役職",
  "email": "メールアドレス",
  "phone": "電話番号",
  "address": "住所"
}"""

def parse_business_card(text: str) -> dict:
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=SYSTEM,
        messages=[{"role": "user", "content": text}]
    )
    return json.loads(response.content[0].text)

# テスト
cards = [
    "田中太郎 / Uribo株式会社 代表取締役 / tanaka@uribo.co.jp / 03-1234-5678",
    "鈴木花子 エンジニア @ Tech Corp suzuki@techcorp.com",
]

for card in cards:
    result = parse_business_card(card)
    print(f"名前: {result.get('name')}")
    print(f"会社: {result.get('company')}")
    print(f"メール: {result.get('email')}")
    print("---")
\`\`\`

**課題：** few-shotを使って「役職がない場合は 'role': '不明' を返す」ようにプロンプトを改善してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
