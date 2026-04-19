import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-functions",
  title: "関数・モジュール",
  subtitle: "関数定義・import・自作モジュール分割",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** 関数を定義し、モジュールに分割し、importして使える。コードの「部品化」ができる。

**所要時間：** 約20分

---

「この処理、3回同じコードを書いた…」という状況を防ぐのが関数です。

Claude Codeが書くコードを読むと、すべて関数に整理されています。関数の読み方を理解するだけで、コードの流れが追えるようになります。`,
        },
      ],
    },
    {
      id: "functions",
      title: "関数の定義と呼び出し",
      blocks: [
        {
          type: "text",
          content: `**関数** は「処理をひとまとめにして名前をつけたもの」です。

\`\`\`python
# 関数の定義
def greet(name):
    message = f"こんにちは、{name}さん！"
    return message

# 呼び出し
result = greet("田中")
print(result)  # → こんにちは、田中さん！
\`\`\`

---

**デフォルト引数：**

\`\`\`python
def send_message(text, recipient="全員"):
    print(f"{recipient}に送信: {text}")

send_message("お知らせ")            # → 全員に送信: お知らせ
send_message("DM", "田中")          # → 田中に送信: DM
\`\`\`

**キーワード引数：**

\`\`\`python
def create_user(name, age, email):
    return {"name": name, "age": age, "email": email}

# 名前付きで引数を渡す（順番が自由）
user = create_user(age=21, email="tanaka@example.com", name="田中")
\`\`\`

---

**型ヒント（Type Hints）：**

Claude Codeが書くコードでよく見ます。

\`\`\`python
def calculate_tax(price: float, rate: float = 0.1) -> float:
    return price * rate

# ": float" → 引数の型
# "-> float" → 戻り値の型
\`\`\`

型ヒントはエラーを防ぐためのドキュメントです（実行時には強制されない）。`,
        },
        {
          type: "interactive",
          id: "eng-function-call",
        },
      ],
    },
    {
      id: "modules",
      title: "モジュールとimport",
      blocks: [
        {
          type: "text",
          content: `**モジュール** は「Pythonファイル（.py）」のことです。コードを複数ファイルに分割して整理できます。

---

**標準ライブラリのimport：**

\`\`\`python
import os           # OS操作
import json         # JSON処理
import datetime     # 日時
import random       # 乱数

from pathlib import Path  # ファイルパス（推奨）
from datetime import datetime, timedelta  # 必要な部分だけ
\`\`\`

---

**自作モジュールの分割：**

\`\`\`
my-project/
├── main.py        ← メインスクリプト
└── utils.py       ← 便利関数をまとめる
\`\`\`

\`\`\`python
# utils.py
def format_price(price: int) -> str:
    return f"¥{price:,}"

def truncate(text: str, max_len: int = 50) -> str:
    if len(text) <= max_len:
        return text
    return text[:max_len] + "..."
\`\`\`

\`\`\`python
# main.py
from utils import format_price, truncate

print(format_price(12800))  # → ¥12,800
print(truncate("長い文章テキスト...", 10))
\`\`\`

---

**importのパターンまとめ：**

\`\`\`python
import requests              # モジュール全体（requests.getと使う）
from requests import get     # 特定の関数だけ（getと直接使える）
import numpy as np           # エイリアス（np.arrayと使う）
\`\`\``,
        },
      ],
    },
    {
      id: "practical",
      title: "実用パターン",
      blocks: [
        {
          type: "text",
          content: `**Claude Codeが書くコードで頻出のパターン：**

---

**メイン関数パターン：**

\`\`\`python
def main():
    # メイン処理をここに書く
    data = fetch_data()
    result = process(data)
    save(result)

if __name__ == "__main__":
    main()
\`\`\`

\`if __name__ == "__main__":\` は「このファイルが直接実行されたときだけmain()を呼ぶ」という意味。importされたときは動かない。

---

**設定を関数でまとめる：**

\`\`\`python
import os

def get_api_key() -> str:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        raise ValueError("ANTHROPIC_API_KEY が設定されていません")
    return key
\`\`\`

---

**早期return（guard clause）：**

\`\`\`python
# ネストが深い（読みにくい）
def process_user(user):
    if user:
        if user.get("active"):
            if user.get("email"):
                # 処理...
                pass

# 早期return（読みやすい）
def process_user(user):
    if not user:
        return None
    if not user.get("active"):
        return None
    if not user.get("email"):
        return None
    # 処理...
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
            question: "「from utils import format_price」の意味として正しいのはどれ？",
            options: [
              "utilsフォルダ内の全ファイルを読み込む",
              "utils.pyから format_price 関数だけをインポートする",
              "format_price という名前のモジュールをインストールする",
              "utilsという名前のAPIを呼び出す",
            ],
            answer: 1,
            explanation: "from [モジュール名] import [関数名] は、指定したモジュールから特定の関数だけを取り込みます。その後は format_price() と直接呼べます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "「def greet(name='名無し'):」のように引数にデフォルト値を設定する利点は？",
            options: [
              "必ず引数を渡さないといけなくなる",
              "引数を省略したときに自動でデフォルト値が使われる",
              "引数の型を固定できる",
              "関数を高速化できる",
            ],
            answer: 1,
            explanation: "デフォルト引数を設定すると、呼び出し時にその引数を省略できます。greet() と呼ぶと name='名無し' で動きます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "「if __name__ == '__main__': main()」の役割は？",
            options: [
              "mainという名前の関数しか定義できなくなる",
              "このファイルが直接実行されたときだけmain()を呼ぶ",
              "mainファイルを自動でインポートする",
              "エラーが発生したときmain()を呼ぶ",
            ],
            answer: 1,
            explanation: "Pythonでは他のファイルからimportされるとき __name__ が '__main__' にならないため、この条件はimport時には実行されません。直接 python main.py と実行したときだけ動きます。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：ユーティリティ関数を作る",
      blocks: [
        {
          type: "text",
          content: `プロジェクトに utils.py を作って、関数をまとめてみましょう。

**utils.pyを作成：**

\`\`\`python
# utils.py
import requests
from typing import Optional

def fetch_json(url: str) -> Optional[dict]:
    """URLからJSONを取得する。失敗したらNoneを返す。"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"エラー: {e}")
        return None

def format_post(post: dict) -> str:
    """投稿データを読みやすい文字列にフォーマットする。"""
    title = post.get("title", "タイトルなし")
    body = post.get("body", "")[:50]
    return f"[{post.get('id')}] {title}\n  {body}..."
\`\`\`

**main.pyで使う：**

\`\`\`python
# main.py
from utils import fetch_json, format_post

posts = fetch_json("https://jsonplaceholder.typicode.com/posts")

if posts:
    for post in posts[:5]:
        print(format_post(post))
        print()
\`\`\`

**課題：** utils.pyにさらに「ユーザーIDでフィルタする関数」を追加してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
