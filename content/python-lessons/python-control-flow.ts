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
  ],
};

export default lesson;
