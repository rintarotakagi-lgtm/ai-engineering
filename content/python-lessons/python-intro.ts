import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-intro",
  title: "Pythonとは・最初のスクリプト",
  subtitle: "インタープリタ型言語の特徴・Hello World・REPLの使い方",
  sections: [
    {
      id: "what-is-python",
      title: "Pythonとは",
      blocks: [
        {
          type: "text",
          content: `Pythonは1991年にオランダ人のグイド・ヴァン・ロッサムが作ったプログラミング言語です。現在、世界で最も使われている言語のひとつです。

**なぜPythonが選ばれるのか？**

- **読みやすい構文** — 英語に近い文法で、初心者でも理解しやすい
- **多用途** — Web開発、データ分析、機械学習、自動化、CLI ツールまで何でもできる
- **豊富なライブラリ** — PyPI に40万以上のパッケージが公開されている
- **AIとの相性抜群** — pandas、numpy、pytorch、anthropic-sdk など AI 関連の主要ライブラリが全て Python 製

**インタープリタ型とは？**

PythonはJavaのような**コンパイル型**ではなく、**インタープリタ型**です。

\`\`\`
コンパイル型: ソースコード → (コンパイル) → 機械語ファイル → 実行
インタープリタ型: ソースコード → (直接解釈・実行)
\`\`\`

コンパイルが不要なので、書いてすぐ動かせます。開発のサイクルが速いのが特徴です。`,
        },
      ],
    },
    {
      id: "hello-world",
      title: "最初のスクリプト",
      blocks: [
        {
          type: "text",
          content: `**Hello World** — プログラミングの最初の一歩は、画面に文字を表示することです。

Pythonでは1行で書けます：

\`\`\`python
print("Hello, World!")
\`\`\`

**print()** は Python の組み込み関数で、引数を画面に出力します。

下のコードランナーで実際に実行してみましょう。コードを変えても大丈夫です。`,
        },
        {
          type: "code-runner",
          initialCode: `print("Hello, World!")
print("Pythonを学び始めました")
print(1 + 2 + 3)`,
        },
        {
          type: "text",
          content: `**print() のバリエーション：**

\`\`\`python
# 複数の値をカンマで区切ると、スペース区切りで出力
print("今日は", 2024, "年です")

# end= で末尾文字を変更（デフォルトは改行）
print("A", end="")
print("B", end="")
print("C")  # → ABC

# sep= で区切り文字を指定
print("東京", "大阪", "福岡", sep=" / ")  # → 東京 / 大阪 / 福岡
\`\`\`

\`**コメント**は \`#\` で始まり、実行時に無視されます。コードの説明を書くのに使います。`,
        },
        {
          type: "code-runner",
          initialCode: `# コメントは実行されません
print("東京", "大阪", "福岡", sep=" / ")
print("A", end="")
print("B", end="")
print("C")`,
        },
      ],
    },
    {
      id: "repl",
      title: "REPL（対話型実行環境）",
      blocks: [
        {
          type: "text",
          content: `**REPL**（Read-Eval-Print Loop）は、コードを1行ずつ入力してすぐ結果を確認できる環境です。

ターミナルで \`python\` と入力すると起動します：

\`\`\`
$ python
Python 3.12.x
>>> print("hello")
hello
>>> 1 + 2
3
>>> exit()
\`\`\`

\`>>>\` がプロンプト（入力待ちの印）です。

**REPLの用途：**
- 小さなコードのテスト
- ライブラリの動作確認
- 計算や文字列操作の試行

このコースのコードランナーも REPL と同じ感覚で使えます。式を入力しても **print()** なしでは出力されない点だけ注意してください。`,
        },
        {
          type: "code-runner",
          initialCode: `# 式だけでは出力されない（REPLとの違い）
1 + 2  # ← 何も表示されない

# printが必要
print(1 + 2)

# 算術演算
print(10 / 3)    # 除算（float）
print(10 // 3)   # 整数除算
print(10 % 3)    # 余り
print(2 ** 10)   # べき乗`,
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
            question: "Pythonが「インタープリタ型」と呼ばれる理由はどれ？",
            options: [
              "コードをコンパイルしてから実行するから",
              "コードを直接解釈して実行するから",
              "ブラウザ上でしか動かないから",
              "英語にしか対応していないから",
            ],
            answer: 1,
            explanation: "インタープリタ型はコードを1行ずつ解釈しながら実行します。コンパイル（機械語への変換）が不要なので、書いてすぐ動かせます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "print(\"A\", \"B\", sep=\"-\") の出力はどれ？",
            options: ["AB", "A B", "A-B", "A, B"],
            answer: 2,
            explanation: "sep= で区切り文字を指定できます。デフォルトはスペースですが、sep=\"-\" を指定すると A-B になります。",
          },
        },
      ],
    },
  ],
};

export default lesson;
