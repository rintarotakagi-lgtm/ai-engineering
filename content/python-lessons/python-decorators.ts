import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-decorators",
  title: "デコレータ",
  subtitle: "@staticmethod / @classmethod・functools.wraps・カスタムデコレータ",
  sections: [
    {
      id: "decorator-basics",
      title: "デコレータとは",
      blocks: [
        {
          type: "text",
          content: `**デコレータ**は関数やクラスを「ラップ」して機能を追加する仕組みです。\`@\` 記号で関数の直前に書きます。

\`\`\`python
@decorator
def my_function():
    pass

# 上記は以下と同じ
def my_function():
    pass
my_function = decorator(my_function)
\`\`\`

**シンプルなデコレータを作ってみる：**

\`\`\`python
def logger(func):
    """関数の呼び出しをログする"""
    def wrapper(*args, **kwargs):
        print(f"呼び出し: {func.__name__}({args}, {kwargs})")
        result = func(*args, **kwargs)
        print(f"返り値: {result}")
        return result
    return wrapper

@logger
def add(a: int, b: int) -> int:
    return a + b

add(1, 2)
# 呼び出し: add((1, 2), {})
# 返り値: 3
\`\`\`

**functools.wraps — メタデータを保持：**

\`\`\`python
import functools

def logger(func):
    @functools.wraps(func)   # ← func のメタデータを wrapper に引き継ぐ
    def wrapper(*args, **kwargs):
        print(f"呼び出し: {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@logger
def greet(name: str) -> str:
    """挨拶する"""
    return f"Hello, {name}"

print(greet.__name__)   # → greet（wraps がなければ wrapper になる）
print(greet.__doc__)    # → 挨拶する
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import functools
import time

def timer(func):
    """実行時間を計測するデコレータ"""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed*1000:.3f}ms")
        return result
    return wrapper

@timer
def slow_sum(n: int) -> int:
    return sum(range(n))

@timer
def fast_sum(n: int) -> int:
    return n * (n - 1) // 2  # ガウスの公式

print(slow_sum(1_000_000))
print(fast_sum(1_000_000))`,
        },
      ],
    },
    {
      id: "parameterized",
      title: "引数付きデコレータ",
      blocks: [
        {
          type: "text",
          content: `デコレータ自体に引数を渡すには、デコレータを返す関数を作ります（3層構造）。

\`\`\`python
def retry(max_attempts: int = 3, delay: float = 0.5):
    """失敗時にリトライするデコレータ"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    print(f"試行 {attempt + 1} 失敗: {e}、リトライします")
                    time.sleep(delay)
        return wrapper
    return decorator

@retry(max_attempts=3, delay=1.0)
def fetch_data(url: str) -> dict:
    # 不安定なAPIコール
    ...
\`\`\`

**実用的なデコレータ例：**

\`\`\`python
def validate_types(**type_map):
    """引数の型をバリデートするデコレータ"""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(**kwargs):
            for name, expected_type in type_map.items():
                if name in kwargs and not isinstance(kwargs[name], expected_type):
                    raise TypeError(
                        f"{name} は {expected_type.__name__} である必要があります"
                    )
            return func(**kwargs)
        return wrapper
    return decorator

@validate_types(name=str, age=int)
def create_user(*, name: str, age: int) -> dict:
    return {"name": name, "age": age}
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import functools

def cache(func):
    """メモ化デコレータ（functools.lru_cache の簡易版）"""
    memo = {}
    @functools.wraps(func)
    def wrapper(*args):
        if args not in memo:
            memo[args] = func(*args)
        return memo[args]
    wrapper.cache = memo  # キャッシュを外から参照可能に
    return wrapper

@cache
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")

print(f"キャッシュサイズ: {len(fibonacci.cache)}")`,
        },
      ],
    },
    {
      id: "class-decorator",
      title: "クラスデコレータとdataclass",
      blocks: [
        {
          type: "text",
          content: `**@dataclass — ボイラープレートを自動生成：**

\`\`\`python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float
    label: str = "point"    # デフォルト値

    # __init__, __repr__, __eq__ が自動生成される

@dataclass(frozen=True)   # immutable にする
class ImmutablePoint:
    x: float
    y: float

@dataclass
class User:
    name: str
    age: int
    tags: list[str] = field(default_factory=list)  # ミュータブルなデフォルト

    def greet(self) -> str:
        return f"Hello, {self.name}"
\`\`\`

\`field(default_factory=list)\` を使うのは、デフォルト引数のバグ（前のレッスンで学んだ）を回避するためです。

\`\`\`python
p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
print(p1 == p2)  # → True（__eq__ が自動生成）
print(p1)        # → Point(x=1.0, y=2.0, label='point')
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Product:
    name: str
    price: float
    stock: int = 0
    tags: list[str] = field(default_factory=list)

    @property
    def available(self) -> bool:
        return self.stock > 0

    def discounted(self, rate: float) -> "Product":
        return Product(
            name=self.name,
            price=round(self.price * (1 - rate), 2),
            stock=self.stock,
            tags=self.tags + ["セール"],
        )

    def __str__(self) -> str:
        status = "在庫あり" if self.available else "在庫なし"
        return f"{self.name}: {self.price:,}円 [{status}]"

p1 = Product("ノートPC", 150000, 5, ["電子機器", "PC"])
p2 = Product("マウス", 5000, 0)

print(p1)
print(p2)
print(p1 == Product("ノートPC", 150000, 5, ["電子機器", "PC"]))

sale = p1.discounted(0.2)
print(sale)`,
        },
        {
          type: "quiz",
          data: {
            question: "@functools.wraps(func) をデコレータ内で使う理由は？",
            options: [
              "デコレータの実行速度を上げるため",
              "元の関数の __name__ や __doc__ などのメタデータを wrapper に引き継ぐため",
              "型ヒントを有効にするため",
              "再帰を可能にするため",
            ],
            answer: 1,
            explanation: "functools.wraps(func) を使わないと、デコレートされた関数の __name__ が wrapper になってしまい、デバッグが困難になります。wraps を使うことで、元の関数名・ドキュメント文字列・型アノテーションが保持されます。",
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
            question: "@decorator が func = decorator(func) と等価である理由は？",
            options: [
              "Python のシンタックスシュガー（糖衣構文）だから",
              "decorator は特殊関数だから",
              "func が特殊な型だから",
              "@ 演算子が特別に定義されているから",
            ],
            answer: 0,
            explanation: "@decorator は「関数定義の後に decorator(func) を実行して変数に再代入する」処理のシンタックスシュガー（書きやすい短縮記法）です。デコレータ自体は普通の関数です。",
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
            title: "タイマーデコレータを作ろう",
            description: "関数の実行前後に \"開始\" と \"終了\" を出力するデコレータ log_call を実装してください（時間計測は不要、出力のみ）。",
            starterCode: `def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"{func.???}: 開始")
        result = func(*args, **kwargs)
        print(f"{func.__name__}: 終了")
        return result
    return wrapper

@log_call
def greet(name):
    print(f"こんにちは、{name}!")

greet("Alice")`,
            hint: "func.__name__ で関数名を取得できる",
            expectedOutput: "greet: 開始\nこんにちは、Alice!\ngreet: 終了\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "メモ化デコレータを作ろう",
            description: "引数に対する結果をキャッシュする memoize デコレータを実装してください。2回目以降は \"キャッシュから取得\" と表示して保存済みの値を返すこと。",
            starterCode: `def memoize(func):
    cache = {}
    def wrapper(*args):
        if args in cache:
            print("キャッシュから取得")
            return cache[???]
        result = func(*args)
        cache[args] = result
        return result
    return wrapper

@memoize
def square(n):
    return n * n

print(square(4))
print(square(4))
print(square(5))
print(square(4))`,
            hint: "cache は dict。args をキーにして結果を保存・取得する",
            expectedOutput: "16\nキャッシュから取得\n16\n25\nキャッシュから取得\n16\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "引数付きデコレータを作ろう",
            description: "関数を n 回繰り返す repeat(n) デコレータを実装してください。@repeat(3) とすると関数が3回実行される。",
            starterCode: `def repeat(n):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(???):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(???)
def say_hello():
    print("Hello!")

say_hello()`,
            hint: "repeat(n) が decorator を返し、decorator が wrapper を返す3層構造",
            expectedOutput: "Hello!\nHello!\nHello!\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
