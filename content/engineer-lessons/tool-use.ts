import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "tool-use",
  title: "Tool use（関数呼び出し）の基本",
  subtitle: "LLMに関数を渡してツール経由で動作させる",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** Tool use（function calling）の仕組みを理解し、カスタム関数をLLMに渡して呼び出させられる。

**所要時間：** 約25分

---

「LLMが外部のAPIを自律的に呼び出す」——これがTool useです。

天気を調べる、カレンダーに登録する、データベースを検索する。LLMは言語を理解しますが、外部システムとは直接やりとりできません。Tool useはその橋渡しをします。Claude Codeが「ファイルを読む・コマンドを実行する」のも、全部Tool useの仕組みです。`,
        },
      ],
    },
    {
      id: "concept",
      title: "仕組みを理解する",
      blocks: [
        {
          type: "text",
          content: `Tool useの流れを図で見てみましょう。

\`\`\`
1. アプリ → Claude: 「今日の東京の天気は？」+ tools=[get_weather]
      ↓
2. Claude → アプリ: 「get_weatherを呼んで (city="Tokyo")」
      ↓
3. アプリ: get_weather("Tokyo") を実行 → "晴れ、25°C"
      ↓
4. アプリ → Claude: tool_result="晴れ、25°C"
      ↓
5. Claude → アプリ: 「今日の東京は晴れで25°Cです」
\`\`\`

---

重要な点：**Claudeは関数を直接実行しない**

Claudeは「この関数を呼んでほしい、引数はこれ」と指示するだけです。実際の実行はアプリ側（Python）が行います。

これにより：
- セキュリティ：危険な操作の前に確認できる
- 柔軟性：どんな関数でも接続できる
- 制御：アプリ側で実行を制御できる`,
        },
        {
          type: "interactive",
          id: "eng-tool-flow",
        },
      ],
    },
    {
      id: "implementation",
      title: "実装してみる",
      blocks: [
        {
          type: "text",
          content: `**ステップ1：ツールを定義する**

\`\`\`python
tools = [
    {
        "name": "get_weather",
        "description": "指定した都市の現在の天気を取得する",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "都市名（例：Tokyo, Osaka）"
                }
            },
            "required": ["city"]
        }
    }
]
\`\`\`

---

**ステップ2：実際の関数を実装**

\`\`\`python
def get_weather(city: str) -> str:
    # 実際はAPIを叩くが、ここではダミーデータ
    weather_data = {
        "Tokyo": "晴れ、25°C、湿度60%",
        "Osaka": "曇り、22°C、湿度70%",
        "Sapporo": "雪、-2°C、湿度80%"
    }
    return weather_data.get(city, f"{city}のデータがありません")
\`\`\`

---

**ステップ3：Claudeを呼んでツール実行をハンドリング**

\`\`\`python
import anthropic
import json

client = anthropic.Anthropic()

def chat_with_tools(user_message: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=1024,
        tools=tools,
        messages=[{"role": "user", "content": user_message}]
    )

    # Claudeがツールを使おうとしているか確認
    if response.stop_reason == "tool_use":
        tool_results = []

        for block in response.content:
            if block.type == "tool_use":
                tool_name = block.name
                tool_input = block.input

                # 実際に関数を実行
                if tool_name == "get_weather":
                    result = get_weather(tool_input["city"])
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": result
                    })

        # ツール結果をClaudeに返す
        final_response = client.messages.create(
            model="claude-opus-4-7",
            max_tokens=1024,
            tools=tools,
            messages=[
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": response.content},
                {"role": "user", "content": tool_results}
            ]
        )
        return final_response.content[0].text

    return response.content[0].text

print(chat_with_tools("東京と大阪の天気を教えてください"))
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
            question: "Tool useでClaudeが直接やること・やらないことを正しく説明しているのはどれ？",
            options: [
              "ClaudeがPythonコードを直接実行する",
              "Claudeはどの関数を呼ぶか・引数は何かを指示し、実際の実行はアプリ側が行う",
              "ClaudeがAPIを直接叩く",
              "アプリ側は関係なく、Claudeが全部やる",
            ],
            answer: 1,
            explanation: "Claudeはどのツールをどの引数で呼ぶかを決めますが、実際の実行はアプリ側のPythonコードが行います。これによりセキュリティと制御を保てます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "response.stop_reason == 'tool_use' になったとき、次にすべきことは？",
            options: [
              "会話を終了する",
              "指定されたツール関数を実行して、結果をClaudeに返す",
              "別のモデルに切り替える",
              "エラーとして処理する",
            ],
            answer: 1,
            explanation: "stop_reason == 'tool_use' はClaudeが「このツールを使いたい」と言っているサインです。response.contentからtool_use blockを取り出し、対応する関数を実行して結果をtool_resultとして返します。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "ツール定義のinput_schemaで'required'を設定する目的は？",
            options: [
              "Claudeが必ずその引数を渡すようにする",
              "アプリのパフォーマンスを上げる",
              "コストを下げる",
              "セキュリティのため",
            ],
            answer: 0,
            explanation: "requiredに含まれた引数はClaudeが必ず含めます。省略してほしくない必須パラメータ（例：都市名がないと天気を取得できない）をrequiredに入れます。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：計算ツールを実装する",
      blocks: [
        {
          type: "text",
          content: `Claudeに計算を「外部関数で」やらせてみましょう。

\`\`\`python
# calculator_agent.py
import anthropic
import math

client = anthropic.Anthropic()

# ツール定義
tools = [
    {
        "name": "calculate",
        "description": "数学的な計算を実行する",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "計算式（例：'2 + 3 * 4', 'sqrt(16)'）"
                }
            },
            "required": ["expression"]
        }
    }
]

def calculate(expression: str) -> str:
    try:
        # evalは危険なので本番では使わない（学習用）
        result = eval(expression, {"__builtins__": {}}, {"sqrt": math.sqrt, "pi": math.pi})
        return str(result)
    except Exception as e:
        return f"エラー: {e}"

def ask_calculator(question: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-7",
        max_tokens=512,
        tools=tools,
        messages=[{"role": "user", "content": question}]
    )

    if response.stop_reason == "tool_use":
        for block in response.content:
            if block.type == "tool_use":
                result = calculate(block.input["expression"])
                print(f"計算: {block.input['expression']} = {result}")

                final = client.messages.create(
                    model="claude-opus-4-7",
                    max_tokens=512,
                    tools=tools,
                    messages=[
                        {"role": "user", "content": question},
                        {"role": "assistant", "content": response.content},
                        {"role": "user", "content": [{"type": "tool_result", "tool_use_id": block.id, "content": result}]}
                    ]
                )
                return final.content[0].text

    return response.content[0].text

print(ask_calculator("円の面積の公式でr=5のとき面積はいくつですか？"))
\`\`\`

**課題：** 「単位変換ツール（km→マイル）」を追加して、Claudeが使えるようにしてみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
