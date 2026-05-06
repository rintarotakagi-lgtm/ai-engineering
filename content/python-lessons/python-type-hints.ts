import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-type-hints",
  title: "型ヒント",
  subtitle: "基本型・Optional・Union・TypeVar・ジェネリクス",
  sections: [
    {
      id: "basics",
      title: "型ヒントの基本",
      blocks: [
        {
          type: "text",
          content: `**型ヒント**（Type Hints）はPython 3.5で導入された、変数・引数・返り値に型を明示する記法です。

**実行時には無視されます** — 型ヒントを書いても、Pythonはそれを強制しません。静的解析ツール（mypy）やIDEが活用します。

\`\`\`python
# 変数の型ヒント
name: str = "Alice"
age: int = 25
score: float = 98.5
is_active: bool = True

# 関数の型ヒント
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

# 型ヒントなしと比べると…
def greet_untyped(name, times=1):  # 何を渡すべきか分からない
    return (f"Hello, {name}! " * times).strip()
\`\`\`

**コレクション型：**

\`\`\`python
# Python 3.9+（小文字で書ける）
names: list[str] = ["Alice", "Bob"]
scores: dict[str, float] = {"Alice": 95.0}
tags: set[str] = {"python", "backend"}
pair: tuple[int, str] = (1, "one")

# Python 3.8 以前
from typing import List, Dict, Set, Tuple
names: List[str] = ["Alice", "Bob"]
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from typing import Optional

def find_user(users: list[dict], user_id: int) -> Optional[dict]:
    """IDでユーザーを検索。見つからなければ None を返す"""
    for user in users:
        if user["id"] == user_id:
            return user
    return None

def calculate_average(numbers: list[float]) -> float:
    if not numbers:
        raise ValueError("空のリストです")
    return sum(numbers) / len(numbers)

users = [
    {"id": 1, "name": "Alice", "score": 85.0},
    {"id": 2, "name": "Bob",   "score": 92.0},
    {"id": 3, "name": "Carol", "score": 78.5},
]

user = find_user(users, 2)
print(user)

user = find_user(users, 99)
print(user)

scores = [u["score"] for u in users]
print(f"平均: {calculate_average(scores):.1f}")`,
        },
      ],
    },
    {
      id: "union-optional",
      title: "Optional・Union・Literal",
      blocks: [
        {
          type: "text",
          content: `**Optional[X] — X か None：**

\`\`\`python
from typing import Optional

# Optional[str] は str | None と同じ
def get_name(user_id: int) -> Optional[str]:
    if user_id == 0:
        return None
    return "Alice"
\`\`\`

**Union — 複数の型のどれか：**

\`\`\`python
from typing import Union

def process(value: Union[int, str]) -> str:
    return str(value)

# Python 3.10+ では | で書ける
def process(value: int | str) -> str:
    return str(value)
\`\`\`

**Literal — 特定の値のみ許可：**

\`\`\`python
from typing import Literal

Direction = Literal["north", "south", "east", "west"]
Status = Literal["active", "inactive", "banned"]

def move(direction: Direction, steps: int) -> None:
    print(f"{direction} に {steps} 歩移動")

def set_status(status: Status) -> None:
    print(f"ステータスを {status} に変更")
\`\`\`

**TypedDict — 辞書の型定義：**

\`\`\`python
from typing import TypedDict

class UserData(TypedDict):
    name: str
    age: int
    email: str

def process_user(user: UserData) -> str:
    return f"{user['name']} ({user['age']}歳)"
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from typing import Union, Literal, TypedDict, Optional

class Config(TypedDict):
    host: str
    port: int
    debug: bool
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"]

def connect(config: Config) -> str:
    return f"Connecting to {config['host']}:{config['port']}"

def parse_value(s: str) -> Union[int, float, str]:
    """文字列を適切な型に変換"""
    try:
        return int(s)
    except ValueError:
        pass
    try:
        return float(s)
    except ValueError:
        pass
    return s

cfg: Config = {
    "host": "localhost",
    "port": 8080,
    "debug": True,
    "log_level": "INFO",
}
print(connect(cfg))

for s in ["42", "3.14", "hello", "100"]:
    val = parse_value(s)
    print(f"{s!r} → {val!r} ({type(val).__name__})")`,
        },
      ],
    },
    {
      id: "generics",
      title: "TypeVar・ジェネリクス",
      blocks: [
        {
          type: "text",
          content: `**TypeVar — 型変数（ジェネリクス）：**

\`\`\`python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T:
    """リストの最初の要素を返す（型を保持）"""
    return items[0]

# str のリストを渡すと str が返る
name: str = first(["Alice", "Bob"])

# int のリストを渡すと int が返る
number: int = first([1, 2, 3])
\`\`\`

**ジェネリクスでスタックを実装：**

\`\`\`python
from typing import Generic, TypeVar

T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("スタックが空です")
        return self._items.pop()

    def peek(self) -> T:
        return self._items[-1]

    def __len__(self) -> int:
        return len(self._items)

# str のスタック
stack: Stack[str] = Stack()
stack.push("first")
stack.push("second")
print(stack.pop())   # → second（型チェッカーはstrと認識）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from typing import TypeVar, Callable

T = TypeVar("T")
U = TypeVar("U")

def pipe(value: T, *functions: Callable) -> object:
    """関数を順番に適用するパイプライン"""
    result = value
    for func in functions:
        result = func(result)
    return result

# 文字列変換パイプライン
result = pipe(
    "  hello, world  ",
    str.strip,
    str.title,
    lambda s: s + "!",
)
print(result)

# 数値変換パイプライン
result2 = pipe(
    [1, 2, 3, 4, 5],
    lambda lst: [x**2 for x in lst],
    sum,
    lambda n: f"合計の二乗和: {n}",
)
print(result2)`,
        },
        {
          type: "quiz",
          data: {
            question: "型ヒントを付けた関数に間違った型の引数を渡すとどうなる？",
            options: [
              "実行時エラーが発生する",
              "何も起きない（Pythonは型ヒントを実行時に強制しない）",
              "警告が表示される",
              "自動的に型変換される",
            ],
            answer: 1,
            explanation: "Pythonの型ヒントは実行時には完全に無視されます。型チェックはmypyなどの静的解析ツールやIDEが行います。実行時に型を強制したい場合は、関数内で isinstance() によるチェックや Pydantic などのライブラリを使います。",
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
            question: "Optional[str] と同等の書き方は？（Python 3.10+）",
            options: ["Union[str]", "str | None", "str | Optional", "Maybe[str]"],
            answer: 1,
            explanation: "Python 3.10以降では Optional[X] の代わりに X | None と書けます。Optional[str] = str | None です。Union[str, None] とも同じです。",
          },
        },
      ],
    },
    {
      id: "challenges",
      title: "チャレンジ",
      blocks: [
        {
          type: "challenge" as const,
          data: {
            title: "型ヒントを付けてみよう",
            description: "文字列のリストを受け取り、最も長い文字列を返す関数 longest(words: list[str]) -> str を型ヒント付きで定義してください。",
            starterCode: `def longest(words: list[???]) -> ???:
    result = words[0]
    for word in words[1:]:
        if len(word) > len(result):
            result = word
    return result

print(longest(["apple", "banana", "kiwi", "strawberry"]))
print(longest(["a", "bb", "ccc"]))`,
            hint: "list[str] でstr のリスト型を表す。戻り値は str",
            expectedOutput: "strawberry\nccc\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "Optional を使って None を表現しよう",
            description: "リストから指定した値のインデックスを返す find(items, target) を定義してください。見つからない場合は None を返すこと。戻り値の型は Optional[int] を使うこと。",
            starterCode: `from typing import Optional

def find(items: list, target) -> Optional[???]:
    for i, item in enumerate(items):
        if item == target:
            return i
    return ???

print(find([10, 20, 30, 40], 30))
print(find([10, 20, 30, 40], 99))`,
            hint: "見つかった場合はインデックス i を返す。見つからない場合は None を返す",
            expectedOutput: "2\nNone\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "TypedDict で辞書の型を定義しよう",
            description: "名前(str)とスコア(int)を持つ TypedDict 型 Student を定義し、生徒リストの平均スコアを計算する関数 average_score(students) を書いてください。",
            starterCode: `from typing import TypedDict

class Student(TypedDict):
    name: ???
    score: ???

def average_score(students: list[Student]) -> float:
    total = sum(s[???] for s in students)
    return total / len(students)

students: list[Student] = [
    {"name": "Alice", "score": 85},
    {"name": "Bob", "score": 92},
    {"name": "Charlie", "score": 78},
]

print(f"{average_score(students):.1f}")`,
            hint: "TypedDict のフィールドは name: str, score: int のように定義する",
            expectedOutput: "85.0\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
