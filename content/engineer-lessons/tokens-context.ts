import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "tokens-context",
  title: "トークン・コンテキスト・モデル選択",
  subtitle: "コスト感とモデルの使い分け判断基準",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** トークンとコンテキストウィンドウの概念を理解し、コスト感を持てる。用途に応じたモデル選択ができる。

**所要時間：** 約20分

---

LLM APIを使うとき、「このAI、月いくらかかるの？」という問いに答えられることがディレクターとして重要です。

トークンとコストの関係を理解するだけで、設計判断が変わります。「毎回長いプロンプトを送るより、短く要約した方がコストが10分の1になる」といった判断ができるようになります。`,
        },
      ],
    },
    {
      id: "tokens",
      title: "トークンとは",
      blocks: [
        {
          type: "text",
          content: `**トークン（token）** は、LLMがテキストを処理する最小単位です。単語と文字の中間くらいのサイズです。

---

**日本語と英語でトークン数が違う：**

\`\`\`
英語: "Hello, how are you?"  → 約6トークン
日本語: "こんにちは、お元気ですか？" → 約18トークン（3倍多い）
\`\`\`

日本語は1文字〜2文字で1トークンになることが多く、英語より多くのトークンを消費します。これはコストに直結します。

---

**トークン数の目安：**

\`\`\`
1,000 tokens ≈ 英語750単語 ≈ 日本語約500文字
\`\`\`

\`\`\`python
# Anthropic SDK でトークン数を計算
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=100,
    messages=[{"role": "user", "content": "こんにちは"}]
)
print(f"入力: {response.usage.input_tokens}トークン")
print(f"出力: {response.usage.output_tokens}トークン")
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-token-counter",
        },
      ],
    },
    {
      id: "context-window",
      title: "コンテキストウィンドウ",
      blocks: [
        {
          type: "text",
          content: `**コンテキストウィンドウ（context window）** は「一度に処理できるトークンの最大数」です。

LLMは「今見えている範囲」でしか考えられません。この「見える範囲」がコンテキストウィンドウです。

---

**Claudeのコンテキストウィンドウ：**

| モデル | コンテキスト | 用途 |
|--------|------------|------|
| Claude Opus 4.7 | 200,000トークン | 長い文書、複雑な推論 |
| Claude Sonnet 4.6 | 200,000トークン | バランス型 |
| Claude Haiku 4.5 | 200,000トークン | 高速・低コスト |

200,000トークン ≈ 日本語で約10万文字 ≈ 文庫本1冊分

---

**コンテキストの使い方：**

\`\`\`
[システムプロンプト] + [会話履歴] + [今回のメッセージ] = 合計トークン
\`\`\`

長い会話を続けると、過去のやりとりが蓄積されてコンテキストを消費します。コンテキスト上限を超えると、古いメッセージが「見えなくなる」か、エラーになります。

---

**ディレクター判断のポイント：**

- 「長い文書を丸ごと渡す」 → トークン大量消費 → 要約してから渡す方がコスト効率◎
- 「会話を長く続ける」 → 定期的にコンテキストをリセットする設計が必要`,
        },
      ],
    },
    {
      id: "model-selection",
      title: "モデル選択の判断基準",
      blocks: [
        {
          type: "text",
          content: `**Claude モデルの特性（2026年4月時点）：**

| モデル | 速度 | コスト | 知能 | 用途 |
|--------|------|--------|------|------|
| **Opus 4.7** | 遅い | 高い | 最高 | 複雑な推論、重要タスク |
| **Sonnet 4.6** | 普通 | 中 | 高い | バランス型。多くの用途 |
| **Haiku 4.5** | 速い | 低い | 中 | 単純タスク、大量処理 |

---

**コスト比較（目安）：**

\`\`\`
Haiku 4.5 : $0.25 / 100万入力トークン
Sonnet 4.6: $3.00 / 100万入力トークン（Haikuの12倍）
Opus 4.7  : $15.00 / 100万入力トークン（Haikuの60倍）
\`\`\`

---

**使い分けの判断フロー：**

\`\`\`
高精度が必要？（法律文書、医療、複雑な分析）
  → YES → Opus 4.7

大量処理でコストが気になる？（チャット、分類、要約）
  → YES → Haiku 4.5

その他（一般的な用途）
  → Sonnet 4.6
\`\`\`

---

**月額コストの試算：**

\`\`\`
チャットボット（1日100回、各500トークン）:
  月3,000回 × 500トークン = 150万トークン
  Haiku: $0.25 × 1.5 = $0.375/月（約56円）
  Sonnet: $3 × 1.5 = $4.5/月（約675円）
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
            question: "日本語テキストのトークン数が英語より多くなる理由は？",
            options: [
              "日本語はLLMが苦手だから",
              "日本語は1文字〜2文字で1トークンになりやすく、単語単位の英語より多くなるから",
              "日本語のAPIは別料金だから",
              "日本語は圧縮できないから",
            ],
            answer: 1,
            explanation: "英語は単語単位でトークン化されることが多いですが（hello=1トークン）、日本語や中国語は文字単位になりやすいです。そのため同じ意味の文章でも日本語の方がトークン数が多くなります。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "大量のシンプルなテキスト分類（「この文章は肯定的か否定的か」を1万件処理）に最適なモデルは？",
            options: [
              "Claude Opus 4.7（最高知能）",
              "Claude Haiku 4.5（高速・低コスト）",
              "どのモデルでも同じ",
              "最新モデルを常に使うべき",
            ],
            answer: 1,
            explanation: "単純な分類タスクにはHaikuが最適です。Opusは複雑な推論が必要なタスク向けで、単純分類に使うとコストがHaikuの60倍になります。タスクの複雑さとコストを合わせましょう。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "コンテキストウィンドウが200,000トークンとは何を意味する？",
            options: [
              "1日に200,000トークンまで使える",
              "1回のAPIリクエストで処理できる最大トークン数",
              "200,000個の質問が答えられる",
              "モデルの学習データのサイズ",
            ],
            answer: 1,
            explanation: "コンテキストウィンドウはLLMが「一度に見ることができる」テキストの最大量です。200,000トークンは約日本語10万文字で、文庫本1冊分に相当します。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：トークン数とコストを計算する",
      blocks: [
        {
          type: "text",
          content: `APIレスポンスからトークン使用量を確認し、コストを計算してみましょう。

\`\`\`python
# token_cost.py
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic()

# モデルごとのコスト（$/100万トークン）
COSTS = {
    "claude-haiku-4-5-20251001": {"input": 0.25, "output": 1.25},
    "claude-sonnet-4-6": {"input": 3.0, "output": 15.0},
    "claude-opus-4-7": {"input": 15.0, "output": 75.0},
}

def call_with_cost(model: str, prompt: str) -> tuple[str, float]:
    response = client.messages.create(
        model=model,
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}]
    )

    input_tokens = response.usage.input_tokens
    output_tokens = response.usage.output_tokens
    cost = COSTS[model]
    total_cost = (input_tokens * cost["input"] + output_tokens * cost["output"]) / 1_000_000

    print(f"モデル: {model}")
    print(f"入力: {input_tokens}トークン, 出力: {output_tokens}トークン")
    print(f"コスト: \${total_cost:.6f} ({total_cost * 150:.4f}円)")

    return response.content[0].text, total_cost

prompt = "Pythonを3行で説明してください"
call_with_cost("claude-haiku-4-5-20251001", prompt)
\`\`\`

**課題：** 同じプロンプトをHaiku、Sonnet、Opusで呼んで、コストの差を比較してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
