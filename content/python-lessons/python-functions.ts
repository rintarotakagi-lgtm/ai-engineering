import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-functions",
  title: "関数定義・引数・返り値",
  subtitle: "def・デフォルト引数・キーワード引数・型ヒント",
  sections: [
    {
      id: "def-basics",
      title: "関数の定義と呼び出し",
      blocks: [
        {
          type: "text",
          content: `**関数**は処理をまとめて名前をつけたものです。\`def\` キーワードで定義します。

\`\`\`python
def greet(name):
    """ユーザーに挨拶する"""
    message = f"こんにちは、{name}さん！"
    return message

result = greet("Alice")
print(result)  # → こんにちは、Aliceさん！
\`\`\`

**ドキュメント文字列（docstring）：**

関数の最初の行に \`"""\`で囲まれた文字列を書くと、関数の説明になります。\`help(greet)\` で確認できます。

**return 文：**

\`\`\`python
def add(a, b):
    return a + b    # 値を返す

def log(message):
    print(message)  # return なし → None を返す

# 複数の値を返す（タプルとして）
def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([3, 1, 4, 1, 5])
print(lo, hi)  # → 1 5
\`\`\`

**スコープ — 変数はどこから見えるか：**

\`\`\`python
x = 10  # グローバル変数

def func():
    x = 20     # ローカル変数（関数内だけ有効）
    print(x)   # → 20

func()
print(x)  # → 10（グローバルは変わっていない）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `def circle_area(radius):
    """円の面積を計算する"""
    PI = 3.14159
    return PI * radius ** 2

def circle_info(radius):
    area = circle_area(radius)
    circumference = 2 * 3.14159 * radius
    return area, circumference

area, circ = circle_info(5)
print(f"面積: {area:.2f}")
print(f"周長: {circ:.2f}")`,
        },
      ],
    },
    {
      id: "arguments",
      title: "引数の種類",
      blocks: [
        {
          type: "text",
          content: `**デフォルト引数 — 省略可能な引数：**

\`\`\`python
def greet(name, greeting="こんにちは"):
    return f"{greeting}、{name}さん！"

print(greet("Alice"))              # → こんにちは、Aliceさん！
print(greet("Bob", "おはよう"))     # → おはよう、Bobさん！
\`\`\`

⚠️ デフォルト引数は定義時に1度だけ評価されます。リストや辞書をデフォルトにすると意図しない動作になります：

\`\`\`python
# バグ！
def append_item(item, lst=[]):
    lst.append(item)
    return lst

print(append_item(1))  # → [1]
print(append_item(2))  # → [1, 2] ← lst が共有されてしまう！

# 正しい書き方
def append_item(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
\`\`\`

**キーワード引数 — 名前で指定：**

\`\`\`python
def create_user(name, age, role="user"):
    return {"name": name, "age": age, "role": role}

# 位置引数
create_user("Alice", 25, "admin")

# キーワード引数（順序不問）
create_user(age=25, name="Alice", role="admin")
create_user("Alice", role="admin", age=25)
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `def format_price(price, currency="円", thousands_sep=True):
    if thousands_sep:
        return f"{price:,}{currency}"
    return f"{price}{currency}"

print(format_price(1234567))
print(format_price(99.99, currency="USD", thousands_sep=False))
print(format_price(1000000, "JPY"))

# デフォルト引数のバグパターン
def safe_append(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst

print(safe_append(1))
print(safe_append(2))  # 毎回新しいリスト`,
        },
      ],
    },
    {
      id: "type-hints",
      title: "型ヒント",
      blocks: [
        {
          type: "text",
          content: `**型ヒント**は引数と返り値の型を明示する記法です（Python 3.5+）。

\`\`\`python
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str) -> str:
    return f"Hello, {name}"

def process(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}
\`\`\`

型ヒントは**実行時には無視されます**（Pythonは強制しません）。主な目的は：
1. コードの読みやすさ向上
2. IDE の補完・型チェックの精度向上
3. mypy などの静的型チェッカーで事前にバグを検出

**よく使う型：**

\`\`\`python
from typing import Optional, Union

def find_user(user_id: int) -> Optional[str]:
    # 見つかれば名前(str)、見つからなければ None
    ...

def convert(value: Union[int, str]) -> str:
    # int か str を受け取り、str を返す
    return str(value)

# Python 3.10+ では | で書ける
def convert(value: int | str) -> str:
    return str(value)
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from typing import Optional

def divide(a: float, b: float) -> Optional[float]:
    """b が 0 の場合は None を返す"""
    if b == 0:
        return None
    return a / b

result = divide(10, 3)
if result is not None:
    print(f"10 / 3 = {result:.4f}")

result = divide(10, 0)
print(f"10 / 0 = {result}")  # None

# 型ヒント付き関数
def summarize(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

print(summarize(["apple", "banana", "fig"]))`,
        },
        {
          type: "quiz",
          data: {
            question: "デフォルト引数にリストを使うとバグになる理由は？",
            options: [
              "リストは引数に渡せないから",
              "デフォルト値が関数定義時に1度だけ作られ、呼び出しをまたいで共有されるから",
              "Pythonがリストをコピーするから",
              "型が違うからエラーになるから",
            ],
            answer: 1,
            explanation: "デフォルト引数は関数が定義されたときに1度だけ評価されます。リストのようなmutableなオブジェクトをデフォルトにすると、全ての呼び出しで同じオブジェクトが共有されます。代わりに None をデフォルトにして関数内で新しいリストを作るのが正しいパターンです。",
          },
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
            question: "def f(a, b=10): return a + b; f(5) の結果は？",
            options: ["5", "10", "15", "エラー"],
            answer: 2,
            explanation: "b のデフォルト値は 10 なので、f(5) は f(5, 10) と同じです。5 + 10 = 15 が返されます。",
          },
        },
      ],
    },
  ],
};

export default lesson;
