import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-control-flow",
  title: "条件分岐",
  subtitle: "if / elif / else・比較演算子・論理演算子",
  sections: [
    {
      id: "if-basics",
      title: "if文の基本",
      blocks: [
        {
          type: "text",
          content: `**if文**は条件に応じて処理を分岐させます。

\`\`\`python
age = 20

if age >= 18:
    print("成人です")
elif age >= 13:
    print("ティーンエイジャーです")
else:
    print("子供です")
\`\`\`

**Pythonのインデント（字下げ）：**

Pythonはブロックの範囲を \`{}\` ではなく**インデント（スペース4つ）**で表します。インデントが正しくないとエラーになります。

\`\`\`python
if True:
    print("これはブロック内")  # インデントあり
print("これはブロック外")      # インデントなし
\`\`\`

**比較演算子：**

| 演算子 | 意味 | 例 |
|--------|------|-----|
| \`==\` | 等しい | \`x == 5\` |
| \`!=\` | 等しくない | \`x != 5\` |
| \`<\` \`>\` | より小さい/大きい | \`x < 10\` |
| \`<=\` \`>=\` | 以下/以上 | \`x >= 0\` |
| \`is\` | 同一オブジェクト | \`x is None\` |
| \`in\` | コレクション内に含まれる | \`"a" in "abc"\` |`,
        },
        {
          type: "code-runner",
          initialCode: `score = 75

if score >= 90:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 50:
    grade = "C"
else:
    grade = "F"

print(f"スコア {score} → グレード {grade}")

# in 演算子
fruits = ["apple", "banana", "cherry"]
print("banana" in fruits)
print("grape" in fruits)`,
        },
      ],
    },
    {
      id: "logical-operators",
      title: "論理演算子と三項演算子",
      blocks: [
        {
          type: "text",
          content: `**論理演算子：**

\`\`\`python
# and — 両方 True のとき True
if age >= 18 and has_id:
    print("入場できます")

# or — どちらか True のとき True
if is_admin or is_owner:
    print("管理権限あり")

# not — True/False を反転
if not is_banned:
    print("利用できます")
\`\`\`

**短絡評価（ショートサーキット）：**

\`\`\`python
# and は左が False なら右を評価しない
x = None
if x is not None and x > 0:  # x が None でも x > 0 はチェックされない
    print(x)

# or は左が True なら右を評価しない
name = user_name or "匿名"  # user_name が空文字列なら "匿名"
\`\`\`

**三項演算子（条件式）：**

\`\`\`python
# 通常のif
if x >= 0:
    label = "正"
else:
    label = "負"

# 三項演算子で1行に
label = "正" if x >= 0 else "負"
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `age = 20
has_ticket = True

# and / or
can_enter = age >= 18 and has_ticket
print(f"入場可能: {can_enter}")

# or でデフォルト値
user_name = ""
display_name = user_name or "匿名"
print(f"表示名: {display_name}")

# 三項演算子
for n in range(-2, 3):
    label = "正" if n > 0 else ("零" if n == 0 else "負")
    print(f"{n}: {label}")`,
        },
      ],
    },
    {
      id: "match",
      title: "match文（Python 3.10+）",
      blocks: [
        {
          type: "text",
          content: `Python 3.10から**match文**（構造的パターンマッチング）が導入されました。他言語の \`switch\` に相当しますが、より強力です。

\`\`\`python
status_code = 404

match status_code:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 500:
        print("Internal Server Error")
    case _:           # デフォルト（どれにも当たらない場合）
        print("Unknown")
\`\`\`

**パターンマッチングの応用：**

\`\`\`python
point = (1, 0)

match point:
    case (0, 0):
        print("原点")
    case (x, 0):
        print(f"X軸上の点 x={x}")
    case (0, y):
        print(f"Y軸上の点 y={y}")
    case (x, y):
        print(f"点 ({x}, {y})")
\`\`\`

これは特にAPIレスポンスの解析や、コマンドの振り分けに便利です。`,
        },
        {
          type: "code-runner",
          initialCode: `# match文でHTTPステータスを判定
def describe_status(code):
    match code:
        case 200:
            return "OK"
        case 201:
            return "Created"
        case 400:
            return "Bad Request"
        case 401 | 403:
            return "Auth Error"
        case 404:
            return "Not Found"
        case _:
            return f"Unknown ({code})"

for code in [200, 201, 404, 401, 500]:
    print(f"{code}: {describe_status(code)}")`,
        },
        {
          type: "quiz",
          data: {
            question: "x = 5; label = \"正\" if x > 0 else \"非正\" の label は？",
            options: ["\"正\"", "\"非正\"", "True", "エラー"],
            answer: 0,
            explanation: "三項演算子は「条件が True なら左の値、False なら右の値」を返します。x = 5 > 0 は True なので \"正\" が返されます。",
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
            question: "\"\" or \"default\" の結果は？",
            options: ["\"\"", "\"default\"", "True", "False"],
            answer: 1,
            explanation: "空文字列 \"\" は falsy です。or 演算子は左辺が falsy のとき右辺を返します。これはデフォルト値を設定するイディオムとしてよく使われます。",
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
            title: "FizzBuzz",
            description: "1から20までの数を出力してください。3の倍数は \"Fizz\"、5の倍数は \"Buzz\"、両方の倍数は \"FizzBuzz\" と出力すること。",
            starterCode: `for i in range(1, 21):
    if ???:
        print("FizzBuzz")
    elif ???:
        print("Fizz")
    elif ???:
        print("Buzz")
    else:
        print(i)`,
            hint: "FizzBuzz の判定を先に書く（15の倍数 or 3と5の両方の倍数）。% で余りを求める",
            expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "成績を判定しよう",
            description: "点数（0〜100）を受け取り、90以上はA、80以上はB、70以上はC、60以上はD、それ未満はFと出力してください。score = 75 で試すこと。",
            starterCode: `score = 75

if ???:
    grade = "A"
elif ???:
    grade = "B"
elif ???:
    grade = "C"
elif ???:
    grade = "D"
else:
    grade = "F"

print(f"点数: {score}, 評価: {grade}")`,
            hint: "score >= 90 から順番に書く。上から順に評価されるので大きい方から",
            expectedOutput: "点数: 75, 評価: C\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "うるう年を判定しよう",
            description: "year = 2024 がうるう年かどうかを判定してください。うるう年の条件: 4で割り切れる、かつ100で割り切れないか、400で割り切れる。",
            starterCode: `year = 2024

if ???:
    print(f"{year}年はうるう年です")
else:
    print(f"{year}年はうるう年ではありません")`,
            hint: "(year % 4 == 0 and year % 100 != 0) or (year % 400 == 0) という条件式になる",
            expectedOutput: "2024年はうるう年です\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
