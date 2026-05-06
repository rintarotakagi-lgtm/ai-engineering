import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-variables",
  title: "変数・数値・文字列・ブール・None",
  subtitle: "Pythonの基本データ型と動的型付けを理解する",
  sections: [
    {
      id: "variables",
      title: "変数と代入",
      blocks: [
        {
          type: "text",
          content: `**変数**とは、値に名前をつけて保存する仕組みです。

\`\`\`python
x = 10        # 整数を変数 x に保存
name = "Alice"  # 文字列を変数 name に保存
\`\`\`

\`=\` は「等しい」ではなく「右辺の値を左辺の変数に代入する」という意味です。

**Pythonの変数の特徴 — 動的型付け：**

Java や C++ では変数を使う前に型を宣言しますが、Python は不要です。

\`\`\`python
# Java の場合
int x = 10;     // 型(int)を先に宣言

# Python の場合
x = 10         # 型の宣言不要
x = "hello"    # あとから別の型の値も代入できる
\`\`\`

型を意識しなくていい反面、バグが混入しやすいというトレードオフがあります。（後のレッスンで学ぶ「型ヒント」で補完できます）

**命名規則 — スネークケース：**

\`\`\`python
user_name = "Alice"   # ✅ スネークケース（単語をアンダースコアで繋ぐ）
userName = "Alice"    # ❌ キャメルケース（クラス名以外ではNG）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `x = 10
name = "Alice"
is_active = True

print(x)
print(name)
print(is_active)

# type() で型を確認
print(type(x))
print(type(name))
print(type(is_active))`,
        },
      ],
    },
    {
      id: "numbers",
      title: "数値型（int / float）",
      blocks: [
        {
          type: "text",
          content: `Pythonの数値型は主に2種類です。

| 型 | 説明 | 例 |
|---|---|---|
| \`int\` | 整数（無限精度） | \`42\`, \`-10\`, \`0\` |
| \`float\` | 浮動小数点数 | \`3.14\`, \`-0.5\`, \`1e10\` |

**整数の特徴：**

\`\`\`python
# Pythonのintは桁数に制限なし
print(2 ** 100)  # 巨大な数も正確に計算できる

# 数値の区切りにアンダースコアが使える（可読性向上）
population = 1_000_000  # 100万
\`\`\`

**浮動小数点の注意：**

\`\`\`python
print(0.1 + 0.2)  # → 0.30000000000000004（誤差が出る）
\`\`\`

これはPython固有の問題ではなく、コンピュータが小数を2進数で表現することによる限界です。お金の計算には \`decimal\` モジュールを使いましょう。

**型変換：**

\`\`\`python
int("42")    # → 42     文字列→整数
float("3.14")  # → 3.14  文字列→浮動小数
str(100)     # → "100"  整数→文字列
int(3.9)     # → 3      小数→整数（切り捨て）
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `print(2 ** 100)
print(1_000_000)
print(0.1 + 0.2)

# 型変換
print(int("42") + 1)
print(str(100) + " 円")
print(int(3.9))`,
        },
      ],
    },
    {
      id: "bool-none",
      title: "ブール型とNone",
      blocks: [
        {
          type: "text",
          content: `**ブール型（bool）：**

\`True\` か \`False\` の2値をとる型です。（大文字始まりに注意）

\`\`\`python
is_admin = True
is_deleted = False
\`\`\`

**truthy / falsy — 条件式での自動変換：**

Pythonでは、bool以外の値でも「真」か「偽」かを判定できます。

\`\`\`python
# False と評価されるもの（falsy）
False, 0, 0.0, "", [], {}, None

# 上記以外はすべて True（truthy）
if []:       # 空リストは falsy
    print("実行されない")
if [1, 2]:   # 要素ありは truthy
    print("実行される")
\`\`\`

**None — 「値がない」ことを表す特別な値：**

\`\`\`python
result = None    # まだ値が決まっていない
print(result)    # → None
print(result is None)   # → True（None との比較は is を使う）
\`\`\`

\`None\` は他言語の \`null\` や \`nil\` に相当します。「値がない状態」を明示的に表すために使います。`,
        },
        {
          type: "code-runner",
          initialCode: `# bool の演算
print(True and False)
print(True or False)
print(not True)

# truthy / falsy
print(bool(0))     # False
print(bool(""))    # False
print(bool([]))    # False
print(bool(1))     # True
print(bool("hi"))  # True

# None
x = None
print(x is None)
print(x is not None)`,
        },
        {
          type: "quiz",
          data: {
            question: "bool([]) の結果はどれ？",
            options: ["True", "False", "None", "エラー"],
            answer: 1,
            explanation: "空のリスト [] は falsy（偽）です。bool() で変換すると False になります。空の文字列 \"\"、0、None も同様に False になります。",
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
            question: "Pythonの「動的型付け」の説明として正しいのは？",
            options: [
              "変数に型を事前宣言する必要がある",
              "変数の型宣言が不要で、実行時に型が決まる",
              "型を変えることができない",
              "数値型しか扱えない",
            ],
            answer: 1,
            explanation: "動的型付けでは変数を使う前に型を宣言する必要がなく、代入する値によって型が自動的に決まります。同じ変数に後から別の型の値を代入することもできます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "int(3.9) の結果は？",
            options: ["4", "3", "3.9", "エラー"],
            answer: 1,
            explanation: "int() で float を整数に変換すると、小数点以下が切り捨てられます。四捨五入ではなく切り捨てなので、3.9 → 3 になります。",
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
            title: "BMIを計算しよう",
            description: "身長170cm・体重65kgのBMIを計算して出力してください。BMI = 体重(kg) ÷ 身長(m)²",
            starterCode: `height_cm = 170
weight_kg = 65

# 身長をメートルに変換
height_m = ???

# BMI を計算
bmi = ???

print(f"BMI: {bmi:.1f}")`,
            hint: "身長はcmをmに変換（÷100）してから2乗する",
            expectedOutput: "BMI: 22.5\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "型変換をマスターしよう",
            description: "文字列 \"3.14\" を float に変換し、さらに int に変換して、それぞれ出力してください。最後に元の値の型も確認しよう。",
            starterCode: `s = "3.14"

# float に変換
f = ???

# int に変換（float からでOK）
i = ???

print(f)
print(i)
print(type(s).__name__, type(f).__name__, type(i).__name__)`,
            hint: "float() と int() を使う。int(\"3.14\") は直接はエラーになるので int(float(...)) の順で",
            expectedOutput: "3.14\n3\nstr float int\n",
          },
        },
        {
          type: "challenge" as const,
          data: {
            title: "複合代入演算子を使おう",
            description: "変数 score を 0 から始めて、+= で10点を5回加算し、最後に2倍にして出力してください。",
            starterCode: `score = 0

# += で10点を5回加算
score += ???
score += ???
score += ???
score += ???
score += ???

# 2倍にする
score ???= 2

print(score)`,
            hint: "score += 10 を5回書く。掛け算の複合代入は *=",
            expectedOutput: "100\n",
          },
        },
      ],
    },
  ],
};

export default lesson;
