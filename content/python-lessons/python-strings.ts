import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-strings",
  title: "文字列操作",
  subtitle: "スライス・メソッド・f-string・正規表現入門",
  sections: [
    {
      id: "basics",
      title: "文字列の基本",
      blocks: [
        {
          type: "text",
          content: `文字列（**str**）はシングルクォート \`'\` またはダブルクォート \`"\` で囲みます。どちらでも動作は同じです。

\`\`\`python
s1 = 'Hello'
s2 = "World"
s3 = """複数行の
文字列"""
\`\`\`

**文字列は「シーケンス」— インデックスでアクセスできる：**

\`\`\`python
s = "Python"
print(s[0])   # → P（最初の文字）
print(s[-1])  # → n（最後の文字）
print(s[-2])  # → o（後ろから2番目）
\`\`\`

インデックスは0始まりです。負のインデックスは末尾からのアクセスに使います。

**スライスで部分文字列を取り出す：**

\`\`\`python
s = "Python"
print(s[0:3])   # → Pyt  （0以上3未満）
print(s[2:])    # → thon （2以降全部）
print(s[:4])    # → Pyth （4未満全部）
print(s[::2])   # → Pto  （1文字おき）
print(s[::-1])  # → nohtyP（逆順）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `s = "Python"

# インデックス
print(s[0], s[-1])

# スライス
print(s[0:3])
print(s[::-1])  # 逆順

# 長さ
print(len(s))

# 連結・繰り返し
print("Hello" + " " + "World")
print("Ha" * 3)`,
        },
      ],
    },
    {
      id: "methods",
      title: "文字列メソッド",
      blocks: [
        {
          type: "text",
          content: `文字列はメソッドを持っています。ドット記法（\`.メソッド名()\`）で呼び出します。

**よく使うメソッド一覧：**

\`\`\`python
s = "  Hello, World!  "

# 変換
s.upper()          # → "  HELLO, WORLD!  "
s.lower()          # → "  hello, world!  "
s.strip()          # → "Hello, World!"（前後の空白除去）
s.replace("World", "Python")  # → "  Hello, Python!  "

# 検索・判定
s.startswith("  H")  # → True
s.endswith("!  ")    # → True
s.find("World")      # → 9（見つかった位置）
"World" in s         # → True（in 演算子）
s.count("l")         # → 3

# 分割・結合
"a,b,c".split(",")      # → ["a", "b", "c"]
" ".join(["a", "b", "c"])  # → "a b c"
\`\`\`

**注意：文字列は immutable（変更不可）**

\`\`\`python
s = "hello"
s.upper()  # 新しい文字列を返す（sは変わらない）
print(s)   # → hello（元のまま）
s = s.upper()  # 変数に再代入する必要がある
print(s)   # → HELLO
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `s = "  Hello, World!  "
print(repr(s.strip()))
print(s.strip().replace("World", "Python"))
print(s.strip().split(", "))

words = ["Python", "is", "awesome"]
print(" ".join(words))

# 判定メソッド
print("123".isdigit())
print("abc".isalpha())
print("Hello World".istitle())`,
        },
      ],
    },
    {
      id: "fstring",
      title: "f-string（フォーマット文字列）",
      blocks: [
        {
          type: "text",
          content: `**f-string**（フォーマット文字列）は、文字列の中に変数や式を埋め込む最も現代的な方法です。Python 3.6以降で使えます。

\`\`\`python
name = "Alice"
age = 25

# f"..." の中に {変数} を書く
message = f"名前は{name}、年齢は{age}歳です"
print(message)  # → 名前はAlice、年齢は25歳です
\`\`\`

**式も書ける：**

\`\`\`python
price = 1200
tax_rate = 0.1
print(f"税込価格: {price * (1 + tax_rate):.0f}円")
# → 税込価格: 1320円
\`\`\`

**フォーマット指定子：**

\`\`\`python
pi = 3.14159265
print(f"{pi:.2f}")     # → 3.14      （小数点2桁）
print(f"{pi:.4f}")     # → 3.1416    （小数点4桁）
print(f"{1000000:,}")  # → 1,000,000 （3桁カンマ区切り）
print(f"{'left':<10}|")  # → left      |（左寄せ幅10）
print(f"{'right':>10}|") # →      right|（右寄せ幅10）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `name = "Alice"
score = 98.5
rank = 1

print(f"{name}さんのスコアは{score:.1f}点、順位は{rank}位です")

# 計算を埋め込む
price = 1200
print(f"税込: {price * 1.1:.0f}円")

# 数値フォーマット
print(f"{1234567:,}")
print(f"{3.14159:.3f}")`,
        },
        {
          type: "quiz",
          data: {
            question: "f\"{3.14159:.2f}\" の出力はどれ？",
            options: ["3.14159", "3.14", "3.1416", "3"],
            answer: 1,
            explanation: ":.2f は「小数点以下2桁の浮動小数点」を意味します。3.14159 を小数点以下2桁に丸めると 3.14 になります。",
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
            question: "\"Python\"[::-1] の結果は？",
            options: ["Python", "nohtyP", "nohty", "P"],
            answer: 1,
            explanation: "[::-1] はステップ -1 のスライスで、文字列を逆順にします。\"Python\" → \"nohtyP\" になります。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "s = \"hello\"; s.upper() の後、s の値は？",
            options: ["HELLO", "hello", "Hello", "エラー"],
            answer: 1,
            explanation: "文字列は immutable（変更不可）です。s.upper() は新しい文字列 \"HELLO\" を返しますが、s 自体は変化しません。結果を使うには s = s.upper() と再代入する必要があります。",
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
            title: "文字列を逆順にしよう",
            description: "\"Python\" を逆順にして \"nohtyP\" と出力してください。スライスを使うこと。",
            starterCode: `s = "Python"

# スライスで逆順に
reversed_s = ???

print(reversed_s)`,
            hint: "s[::-1] でステップを -1 にすると逆順になる",
            expectedOutput: "nohtyP\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "メールアドレスを分解しよう",
            description: "\"user@example.com\" からユーザー名とドメインを分離して出力してください。",
            starterCode: `email = "user@example.com"

# @ で分割
parts = email.split(???)

username = parts[???]
domain = parts[???]

print(f"ユーザー名: {username}")
print(f"ドメイン: {domain}")`,
            hint: "split(\"@\") で @ を区切り文字にして分割できる",
            expectedOutput: "ユーザー名: user\nドメイン: example.com\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "名前を整形しよう",
            description: "\"  alice smith  \"（前後にスペースあり）を受け取り、前後のスペースを除去して各単語の先頭を大文字にして出力してください。",
            starterCode: `name = "  alice smith  "

# 前後のスペースを除去
name = name.???()

# 各単語の先頭を大文字に
name = name.???()

print(name)`,
            hint: "strip() でスペース除去、title() で各単語の先頭を大文字にできる",
            expectedOutput: "Alice Smith\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
