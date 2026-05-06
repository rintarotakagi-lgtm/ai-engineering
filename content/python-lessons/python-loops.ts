import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-loops",
  title: "ループ",
  subtitle: "for / while・enumerate・zip・リスト内包表記",
  sections: [
    {
      id: "for-loop",
      title: "forループ",
      blocks: [
        {
          type: "text",
          content: `**forループ**はシーケンス（リスト・文字列・range など）の要素を順に処理します。

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# range() で数値のループ
for i in range(5):     # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11):  # 1〜10
    print(i)

for i in range(0, 10, 2):  # 0, 2, 4, 6, 8（ステップ2）
    print(i)
\`\`\`

**enumerate() — インデックスと値を同時に：**

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# 悪い書き方（インデックスで要素を取る）
for i in range(len(fruits)):
    print(i, fruits[i])

# 良い書き方（enumerate を使う）
for i, fruit in enumerate(fruits):
    print(i, fruit)

# 開始インデックスを指定
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `# enumerate で番号付きリスト
langs = ["Python", "JavaScript", "Rust", "Go"]
for i, lang in enumerate(langs, start=1):
    print(f"{i}. {lang}")

print()

# range の応用
total = 0
for n in range(1, 101):
    total += n
print(f"1〜100の合計: {total}")`,
        },
      ],
    },
    {
      id: "while-zip",
      title: "while・zip・break・continue",
      blocks: [
        {
          type: "text",
          content: `**whileループ：**

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

**break と continue：**

\`\`\`python
# break — ループを即座に終了
for n in range(10):
    if n == 5:
        break      # 5になったら終了
    print(n)  # 0,1,2,3,4

# continue — 現在の繰り返しをスキップ
for n in range(10):
    if n % 2 == 0:
        continue   # 偶数はスキップ
    print(n)  # 1,3,5,7,9
\`\`\`

**zip() — 複数のリストを同時にループ：**

\`\`\`python
names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78]

for name, score in zip(names, scores):
    print(f"{name}: {score}点")
\`\`\`

**else節（あまり知られていない機能）：**

\`\`\`python
for n in range(10):
    if n == 5:
        break
else:
    # break で終了しなかった場合のみ実行
    print("ループが最後まで回りました")
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `names = ["Alice", "Bob", "Charlie"]
scores = [85, 92, 78]
grades = ["B", "A", "C"]

for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score}点 → {grade}")

print()

# while で入力バリデーション（シミュレーション）
attempts = ["abc", "123", "42"]  # 擬似入力
i = 0
while i < len(attempts):
    val = attempts[i]
    i += 1
    if not val.isdigit():
        print(f"'{val}' は数値ではありません")
        continue
    print(f"入力値: {int(val)}")
    break`,
        },
      ],
    },
    {
      id: "comprehension",
      title: "内包表記",
      blocks: [
        {
          type: "text",
          content: `**リスト内包表記**は、ループを1行で書く Python らしい記法です。

\`\`\`python
# 通常のループ
squares = []
for n in range(1, 6):
    squares.append(n ** 2)

# リスト内包表記
squares = [n ** 2 for n in range(1, 6)]
# → [1, 4, 9, 16, 25]
\`\`\`

**条件付き内包表記：**

\`\`\`python
# 偶数だけ
evens = [n for n in range(10) if n % 2 == 0]
# → [0, 2, 4, 6, 8]

# 条件で値を変換
labels = ["正" if n > 0 else "負または零" for n in [-1, 0, 1, 2]]
\`\`\`

**辞書・セットの内包表記：**

\`\`\`python
# 辞書内包表記
squares_dict = {n: n**2 for n in range(1, 6)}
# → {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# セット内包表記
unique_lengths = {len(word) for word in ["apple", "banana", "fig"]}
# → {3, 5, 6}
\`\`\`

**使いすぎに注意：** 内包表記は短くてエレガントですが、複雑にすると読みにくくなります。「1行で書けない内包表記はforループで書く」が目安です。`,
        },
        {
          type: "code-runner",
          initialCode: `# リスト内包表記
squares = [n**2 for n in range(1, 11)]
print(squares)

# 条件付き
evens = [n for n in range(20) if n % 2 == 0]
print(evens)

# 文字列の変換
words = ["  hello  ", "  world  ", "  python  "]
cleaned = [w.strip().title() for w in words]
print(cleaned)

# 辞書内包表記
word_lengths = {w: len(w) for w in ["apple", "banana", "cherry"]}
print(word_lengths)`,
        },
        {
          type: "quiz",
          data: {
            question: "[x**2 for x in range(4) if x % 2 == 0] の結果は？",
            options: ["[0, 4]", "[0, 1, 4, 9]", "[0, 4, 16]", "[1, 9]"],
            answer: 0,
            explanation: "range(4) は [0, 1, 2, 3]。if x % 2 == 0 で偶数のみ選ぶと [0, 2]。それを二乗すると [0, 4] になります。",
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
            question: "enumerate([\"a\", \"b\", \"c\"], start=1) で得られる最初のペアは？",
            options: ["(0, \"a\")", "(1, \"a\")", "(\"a\", 1)", "(\"a\", 0)"],
            answer: 1,
            explanation: "enumerate() は (インデックス, 値) のタプルを返します。start=1 を指定するとインデックスが1から始まるので、最初のペアは (1, \"a\") です。",
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
            title: "平方数の合計を求めよう",
            description: "1² + 2² + 3² + ... + 10² の合計を計算して出力してください。",
            starterCode: `total = 0

for i in range(1, 11):
    total += ???

print(total)`,
            hint: "i**2 を total に加算していく",
            expectedOutput: "385\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "素数をリストアップしよう",
            description: "2から30までの素数を全て出力してください。",
            starterCode: `for n in range(2, 31):
    is_prime = True
    for i in range(2, n):
        if ???:
            is_prime = False
            break
    if is_prime:
        print(n)`,
            hint: "n が i で割り切れる（n % i == 0）なら素数ではない",
            expectedOutput: "2\n3\n5\n7\n11\n13\n17\n19\n23\n29\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "enumerate を使おう",
            description: "[\"Python\", \"JavaScript\", \"Rust\", \"Go\"] を enumerate を使って、\"1. Python\" のように1始まりの番号付きで出力してください。",
            starterCode: `languages = ["Python", "JavaScript", "Rust", "Go"]

for ???, lang in enumerate(languages, start=???):
    print(f"{???}. {lang}")`,
            hint: "enumerate(list, start=1) で1始まりのインデックスが取れる",
            expectedOutput: "1. Python\n2. JavaScript\n3. Rust\n4. Go\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
