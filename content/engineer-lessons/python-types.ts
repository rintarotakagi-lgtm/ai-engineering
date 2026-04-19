import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-types",
  title: "変数・データ型・データ構造",
  subtitle: "str / int / list / dict / set を使い分ける",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** Pythonの基本データ型と構造を使い分けられる。APIのレスポンス（JSON）を読んでデータを取り出せる。

**所要時間：** 約25分

---

プログラムは「データを処理する機械」です。データをどう格納するか（型と構造）を理解すれば、コードが読めるようになります。

特に重要なのは **dict（辞書）** です。APIのレスポンス（JSON）の中身はほぼdictなので、これを自在に扱えればAPIの出力を操作できます。`,
        },
      ],
    },
    {
      id: "basic-types",
      title: "基本データ型",
      blocks: [
        {
          type: "text",
          content: `Pythonの基本型は4つ。実際にPythonインタープリタ（\`uv run python\`）で試してみましょう。

\`\`\`python
# str（文字列） — テキストデータ
name = "田中太郎"
greeting = 'こんにちは'
message = f"私の名前は{name}です"  # f文字列（変数を埋め込む）
print(message)  # → 私の名前は田中太郎です

# int（整数）
age = 21
count = 0

# float（小数）
price = 1980.5
tax_rate = 0.1

# bool（真偽値）
is_active = True
is_deleted = False
\`\`\`

---

**型を確認する：**

\`\`\`python
print(type("hello"))   # → <class 'str'>
print(type(42))        # → <class 'int'>
print(type(3.14))      # → <class 'float'>
print(type(True))      # → <class 'bool'>
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-type-explorer",
        },
      ],
    },
    {
      id: "data-structures",
      title: "データ構造",
      blocks: [
        {
          type: "text",
          content: `**list（リスト）** — 順番を持つデータの集まり

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]

# アクセス（0始まり）
print(fruits[0])   # → apple
print(fruits[-1])  # → cherry（最後）

# 追加・削除
fruits.append("orange")  # 末尾に追加
fruits.remove("banana")  # 値で削除

# ループ
for fruit in fruits:
    print(fruit)
\`\`\`

---

**dict（辞書）** — キーと値のペア。JSONと同じ構造

\`\`\`python
user = {
    "name": "田中太郎",
    "age": 21,
    "email": "tanaka@example.com"
}

# アクセス
print(user["name"])       # → 田中太郎
print(user.get("age"))    # → 21（存在しないキーでもエラーにならない）

# 追加・更新
user["phone"] = "090-1234-5678"
user["age"] = 22

# ループ
for key, value in user.items():
    print(f"{key}: {value}")
\`\`\`

---

**set（集合）** — 重複なしのコレクション

\`\`\`python
tags = {"python", "ai", "python", "web"}  # "python"は1つだけ
print(tags)  # → {"python", "ai", "web"}

# 和集合・積集合
a = {1, 2, 3}
b = {2, 3, 4}
print(a | b)  # 和: {1, 2, 3, 4}
print(a & b)  # 積: {2, 3}
\`\`\``,
        },
      ],
    },
    {
      id: "json-handling",
      title: "JSONを扱う（実践）",
      blocks: [
        {
          type: "text",
          content: `APIのレスポンスはJSON形式です。PythonではJSONとdictがほぼ同じ感覚で扱えます。

\`\`\`python
import json

# JSON文字列 → Pythonのdict
json_str = '{"name": "田中", "scores": [90, 85, 92]}'
data = json.loads(json_str)

print(data["name"])       # → 田中
print(data["scores"][0])  # → 90

# dictをJSON文字列に変換
output = json.dumps(data, ensure_ascii=False, indent=2)
print(output)
\`\`\`

---

**ネストしたJSONの扱い方：**

\`\`\`python
response = {
    "status": "success",
    "data": {
        "user": {
            "id": 1,
            "name": "田中太郎",
            "tags": ["admin", "premium"]
        }
    }
}

# 深い階層にアクセス
name = response["data"]["user"]["name"]
first_tag = response["data"]["user"]["tags"][0]

print(name)      # → 田中太郎
print(first_tag) # → admin
\`\`\`

Claude APIのレスポンスも同じ構造です。\`response.content[0].text\` のようなアクセスをよく見るはずです。`,
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
            question: "APIレスポンスのJSONデータを扱うのに最も適したPythonのデータ構造は？",
            options: ["list", "dict", "set", "int"],
            answer: 1,
            explanation: "JSONは「キー:値」のペアで構成されており、Pythonのdictと同じ構造です。json.loads()でJSON文字列をdictに変換できます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "リスト [10, 20, 30, 40] で、最後の要素（40）を取り出すコードはどれ？",
            options: [
              "nums[4]",
              "nums[-1]",
              "nums.last()",
              "nums.end()",
            ],
            answer: 1,
            explanation: "Pythonのリストはマイナスインデックスで後ろから数えられます。nums[-1]が最後の要素、nums[-2]が後ろから2番目です。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "タグの重複を自動で除去したいとき、最適なデータ構造は？",
            options: ["list", "dict", "set", "str"],
            answer: 2,
            explanation: "setは重複を許しません。同じ値を追加しても1つしか保存されないため、重複除去に最適です。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：APIレスポンスを解析する",
      blocks: [
        {
          type: "text",
          content: `前のレッスンで作ったプロジェクトを使って、APIレスポンスを解析してみましょう。

\`\`\`python
import requests

# GitHub APIからリポジトリ情報を取得
response = requests.get("https://api.github.com/repos/anthropics/anthropic-sdk-python")
data = response.json()

# データを取り出す
print("リポジトリ名:", data["name"])
print("スター数:", data["stargazers_count"])
print("言語:", data["language"])
print("説明:", data["description"])
\`\`\`

**課題：** 上記を実行して結果を確認したら、\`data.keys()\` を実行してレスポンスに含まれる全キーを確認してください。その中から自分が興味あるキーを3つ選んで表示してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
