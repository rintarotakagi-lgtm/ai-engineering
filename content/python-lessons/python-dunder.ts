import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-dunder",
  title: "特殊メソッド（ダンダーメソッド）",
  subtitle: "__str__ / __repr__ / __len__ / 演算子オーバーロード",
  sections: [
    {
      id: "dunder-basics",
      title: "特殊メソッドとは",
      blocks: [
        {
          type: "text",
          content: `**特殊メソッド**（ダンダーメソッド）は、アンダースコア2つで囲まれた \`__name__\` 形式のメソッドです。Pythonの組み込み操作（\`print\`、\`len\`、算術演算子など）と連携します。

**\`__str__\` と \`__repr__\`：**

\`\`\`python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __str__(self) -> str:
        """人間向けの表示（print用）"""
        return f"({self.x}, {self.y})"

    def __repr__(self) -> str:
        """開発者向けの表示（デバッグ用）"""
        return f"Point(x={self.x}, y={self.y})"

p = Point(1, 2)
print(p)        # → (1, 2)    __str__ が呼ばれる
print(repr(p))  # → Point(x=1, y=2)  __repr__ が呼ばれる

# リストの中ではreprが使われる
points = [Point(0, 0), Point(1, 2)]
print(points)  # → [Point(x=0, y=0), Point(x=1, y=2)]
\`\`\`

**\`__len__\`、\`__bool__\`、\`__contains__\`：**

\`\`\`python
class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song: str):
        self.songs.append(song)

    def __len__(self) -> int:
        return len(self.songs)

    def __bool__(self) -> bool:
        return len(self) > 0

    def __contains__(self, song: str) -> bool:
        return song in self.songs

pl = Playlist()
print(len(pl))           # → 0
print(bool(pl))          # → False（空なので）
pl.add("Bohemian Rhapsody")
print("Bohemian Rhapsody" in pl)  # → True
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Vector({self.x}, {self.y})"

    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"

    def __len__(self):
        return 2  # 2次元ベクトル

    def __abs__(self):
        return (self.x**2 + self.y**2) ** 0.5

v = Vector(3, 4)
print(v)
print(repr(v))
print(len(v))
print(abs(v))  # → 5.0（3-4-5の直角三角形）`,
        },
      ],
    },
    {
      id: "operators",
      title: "演算子のオーバーロード",
      blocks: [
        {
          type: "text",
          content: `演算子に対応する特殊メソッドを定義することで、独自クラスに \`+\`、\`-\`、\`==\` などを使えるようにできます。

| 演算子 | メソッド |
|--------|---------|
| \`+\` | \`__add__\` |
| \`-\` | \`__sub__\` |
| \`*\` | \`__mul__\` |
| \`/\` | \`__truediv__\` |
| \`==\` | \`__eq__\` |
| \`<\` | \`__lt__\` |
| \`[]\` | \`__getitem__\` |

\`\`\`python
class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other: "Vector") -> "Vector":
        return Vector(self.x - other.x, self.y - other.y)

    def __mul__(self, scalar: float) -> "Vector":
        return Vector(self.x * scalar, self.y * scalar)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __str__(self):
        return f"({self.x}, {self.y})"

a = Vector(1, 2)
b = Vector(3, 4)
print(a + b)   # → (4, 6)
print(b - a)   # → (2, 2)
print(a * 3)   # → (3, 6)
print(a == Vector(1, 2))  # → True
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `class Fraction:
    """分数クラス"""
    def __init__(self, numerator: int, denominator: int):
        from math import gcd
        g = gcd(abs(numerator), abs(denominator))
        self.n = numerator // g
        self.d = denominator // g

    def __str__(self):
        return f"{self.n}/{self.d}" if self.d != 1 else str(self.n)

    def __repr__(self):
        return f"Fraction({self.n}, {self.d})"

    def __add__(self, other):
        return Fraction(self.n * other.d + other.n * self.d,
                        self.d * other.d)

    def __mul__(self, other):
        return Fraction(self.n * other.n, self.d * other.d)

    def __eq__(self, other):
        return self.n == other.n and self.d == other.d

a = Fraction(1, 2)
b = Fraction(1, 3)
print(f"{a} + {b} = {a + b}")
print(f"{a} * {b} = {a * b}")
print(f"1/2 == 2/4: {a == Fraction(2, 4)}")`,
        },
        {
          type: "quiz",
          data: {
            question: "print(obj) を呼んだとき最初に試みられる特殊メソッドは？",
            options: ["__repr__", "__str__", "__print__", "__display__"],
            answer: 1,
            explanation: "print() は __str__() を呼び出します。__str__ が定義されていない場合は __repr__ にフォールバックします。デバッグ情報には repr()（→ __repr__）を、ユーザー向け表示には str()（→ __str__）を使い分けましょう。",
          },
        },
      ],
    },
    {
      id: "context-manager",
      title: "__enter__ / __exit__（コンテキストマネージャ）",
      blocks: [
        {
          type: "text",
          content: `**コンテキストマネージャ**は \`with\` 文と連携し、リソースの確保・解放を自動化します。

\`\`\`python
# with 文の典型的な使い方
with open("file.txt") as f:
    content = f.read()
# ← ここで自動的に f.close() が呼ばれる

# 独自コンテキストマネージャを作る
class Timer:
    import time

    def __enter__(self):
        self.start = __import__("time").time()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = __import__("time").time() - self.start
        print(f"経過時間: {elapsed:.4f}秒")
        return False  # 例外を伝播させる

with Timer() as t:
    total = sum(range(1_000_000))
print(f"合計: {total}")
\`\`\`

**contextlib.contextmanager を使う（より簡単）：**

\`\`\`python
from contextlib import contextmanager

@contextmanager
def managed_resource():
    print("リソース確保")
    try:
        yield "resource"
    finally:
        print("リソース解放")

with managed_resource() as r:
    print(f"使用中: {r}")
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import time
from contextlib import contextmanager

@contextmanager
def timer(label: str = ""):
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"{label}: {elapsed*1000:.2f}ms")

with timer("リスト内包表記"):
    result = [i**2 for i in range(10000)]

with timer("for ループ"):
    result2 = []
    for i in range(10000):
        result2.append(i**2)

print(f"結果が一致: {result == result2}")`,
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
            question: "クラスに __len__ を定義すると何ができる？",
            options: [
              "クラスの属性数を取得できる",
              "len(インスタンス) で独自の長さを返せる",
              "インスタンスをリストに変換できる",
              "インスタンスの比較ができる",
            ],
            answer: 1,
            explanation: "__len__ を定義すると、len(obj) でその戻り値が返されます。また bool() の暗黙変換にも使われます（__bool__ が未定義の場合、len() == 0 なら False）。",
          },
        },
      ],
    },
  ],
};

export default lesson;
