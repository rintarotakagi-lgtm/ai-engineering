import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-advanced-functions",
  title: "高階関数・lambda・クロージャ",
  subtitle: "*args / **kwargs・map / filter・クロージャの仕組み",
  sections: [
    {
      id: "args-kwargs",
      title: "*args と **kwargs",
      blocks: [
        {
          type: "text",
          content: `**\*args — 可変長の位置引数：**

\`\`\`python
def total(*args):
    return sum(args)

print(total(1, 2, 3))        # → 6
print(total(1, 2, 3, 4, 5))  # → 15
\`\`\`

\`*args\` は余分な位置引数をタプルとしてまとめます。

**\*\*kwargs — 可変長のキーワード引数：**

\`\`\`python
def show_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

show_info(name="Alice", age=25, city="Tokyo")
# name: Alice
# age: 25
# city: Tokyo
\`\`\`

**組み合わせて使う：**

\`\`\`python
def func(required, *args, **kwargs):
    print(f"required: {required}")
    print(f"args: {args}")
    print(f"kwargs: {kwargs}")

func("必須", 1, 2, 3, x=10, y=20)
\`\`\`

**アンパック演算子 \* と \*\*：**

\`\`\`python
nums = [1, 2, 3]
print(*nums)          # → 1 2 3（リストを展開して渡す）

d1 = {"a": 1, "b": 2}
d2 = {"c": 3}
merged = {**d1, **d2}  # → {"a": 1, "b": 2, "c": 3}
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `def log(level, *messages, **context):
    prefix = f"[{level.upper()}]"
    msg = " ".join(str(m) for m in messages)
    ctx = " | ".join(f"{k}={v}" for k, v in context.items())
    print(f"{prefix} {msg} | {ctx}" if ctx else f"{prefix} {msg}")

log("info", "Server started", port=8080)
log("error", "Connection failed", host="db", retry=3)
log("debug", "Value is", 42)

# アンパック
nums = [1, 2, 3, 4, 5]
print(sum(nums))
print(max(*nums))

d1 = {"x": 1}
d2 = {"y": 2}
print({**d1, **d2})`,
        },
      ],
    },
    {
      id: "lambda-higher-order",
      title: "lambda・高階関数",
      blocks: [
        {
          type: "text",
          content: `**lambda（無名関数）：**

\`\`\`python
# 通常の関数
def square(x):
    return x ** 2

# lambda で1行に
square = lambda x: x ** 2

# 引数が複数
add = lambda x, y: x + y
\`\`\`

lambda は「その場限り」の小さな関数を作るのに使います。

**高階関数 — 関数を引数・返り値にする：**

\`\`\`python
# sorted() の key引数で lambda を使う
students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob",   "score": 92},
    {"name": "Carol", "score": 78},
]

# スコア順に並べ替え
sorted_students = sorted(students, key=lambda s: s["score"], reverse=True)

# map() — 各要素に関数を適用
nums = [1, 2, 3, 4, 5]
squares = list(map(lambda x: x**2, nums))
# → [1, 4, 9, 16, 25]

# filter() — 条件を満たす要素だけ抽出
evens = list(filter(lambda x: x % 2 == 0, nums))
# → [2, 4]
\`\`\`

**ただし、内包表記の方が Pythonic：**

\`\`\`python
# map/filter より内包表記を好む
squares = [x**2 for x in nums]
evens   = [x for x in nums if x % 2 == 0]
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `students = [
    {"name": "Alice", "score": 85},
    {"name": "Bob",   "score": 92},
    {"name": "Carol", "score": 78},
    {"name": "Dave",  "score": 88},
]

# スコアの降順
ranked = sorted(students, key=lambda s: s["score"], reverse=True)
for i, s in enumerate(ranked, 1):
    print(f"{i}位: {s['name']} ({s['score']}点)")

print()

# 名前の文字数順
by_name_len = sorted(students, key=lambda s: len(s["name"]))
for s in by_name_len:
    print(f"{s['name']} ({len(s['name'])}文字)")`,
        },
      ],
    },
    {
      id: "closure",
      title: "クロージャ",
      blocks: [
        {
          type: "text",
          content: `**クロージャ**とは、外側のスコープの変数を「閉じ込めた」関数のことです。

\`\`\`python
def make_multiplier(n):
    def multiplier(x):
        return x * n  # 外側の n を参照
    return multiplier

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # → 10
print(triple(5))  # → 15
\`\`\`

\`multiplier\` は \`n\` の値を記憶した状態で返されます。これがクロージャです。

**実用例 — カウンター：**

\`\`\`python
def make_counter(start=0):
    count = [start]  # リストで包むのは nonlocal を使わないテクニック
    def counter():
        count[0] += 1
        return count[0]
    return counter

c1 = make_counter()
c2 = make_counter(10)

print(c1())  # → 1
print(c1())  # → 2
print(c2())  # → 11（c1 とは独立）
\`\`\`

**nonlocal — 外側スコープの変数を変更：**

\`\`\`python
def make_counter():
    count = 0
    def increment():
        nonlocal count   # 外側の count を変更する宣言
        count += 1
        return count
    return increment
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `def make_adder(n):
    """n を加算する関数を返す"""
    return lambda x: x + n

add5 = make_adder(5)
add10 = make_adder(10)

print(add5(3))   # 8
print(add10(3))  # 13

# キャッシュ付き関数
def make_cached(func):
    cache = {}
    def wrapper(n):
        if n not in cache:
            cache[n] = func(n)
        return cache[n]
    return wrapper

@make_cached
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`,
        },
        {
          type: "quiz",
          data: {
            question: "sorted([3,1,2], key=lambda x: -x) の結果は？",
            options: ["[1, 2, 3]", "[3, 2, 1]", "[-3, -2, -1]", "エラー"],
            answer: 1,
            explanation: "key=lambda x: -x は各要素を負に変換してソートします。-3 < -2 < -1 の順に並ぶので、元の値は 3 > 2 > 1 の降順になります。",
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
            question: "list(filter(lambda x: x > 3, [1, 2, 3, 4, 5])) の結果は？",
            options: ["[1, 2, 3]", "[4, 5]", "[3, 4, 5]", "[True, True]"],
            answer: 1,
            explanation: "filter() は条件（lambda x: x > 3）が True の要素のみを残します。1, 2, 3 は条件を満たさず、4, 5 が残ります。",
          },
        },
      ],
    },
  ],
};

export default lesson;
