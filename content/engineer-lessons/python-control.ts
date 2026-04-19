import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-control",
  title: "条件分岐・ループ",
  subtitle: "if / for / while でロジックを書く",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** if/for/whileを使って「条件に応じた処理」「繰り返し処理」が書ける。

**所要時間：** 約20分

---

プログラムの基本は「条件に応じて分岐」と「繰り返し」の2つです。これさえ理解すれば、Claude Codeが書いたコードを読んで「あ、ここでこの処理をしているな」と追えるようになります。`,
        },
      ],
    },
    {
      id: "if",
      title: "条件分岐（if文）",
      blocks: [
        {
          type: "text",
          content: `**if文** は「もし〇〇なら、△△する」という分岐です。

\`\`\`python
score = 85

if score >= 90:
    print("A評価")
elif score >= 70:
    print("B評価")
elif score >= 50:
    print("C評価")
else:
    print("不合格")

# → B評価
\`\`\`

---

**比較演算子：**

\`\`\`python
x == y   # 等しい
x != y   # 等しくない
x > y    # より大きい
x >= y   # 以上
x < y    # より小さい
x <= y   # 以下
\`\`\`

**論理演算子：**

\`\`\`python
# and（両方）
if age >= 18 and has_id:
    print("入場できます")

# or（どちらか）
if is_admin or is_premium:
    print("アクセス許可")

# not（否定）
if not is_deleted:
    print("有効なユーザー")
\`\`\`

---

**実用例：APIステータスコードの処理**

\`\`\`python
response = requests.get("https://api.example.com/data")

if response.status_code == 200:
    data = response.json()
    print("成功:", data)
elif response.status_code == 404:
    print("データが見つかりません")
elif response.status_code >= 500:
    print("サーバーエラー")
else:
    print(f"エラー: {response.status_code}")
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-flow-chart",
        },
      ],
    },
    {
      id: "for-loop",
      title: "繰り返し（for文）",
      blocks: [
        {
          type: "text",
          content: `**for文** はリストなどの要素を1つずつ取り出して処理します。

\`\`\`python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(f"フルーツ: {fruit}")

# → フルーツ: apple
# → フルーツ: banana
# → フルーツ: cherry
\`\`\`

---

**enumerate（インデックス付き）：**

\`\`\`python
for i, fruit in enumerate(fruits):
    print(f"{i+1}番目: {fruit}")

# → 1番目: apple
# → 2番目: banana
\`\`\`

**range（数値のループ）：**

\`\`\`python
for i in range(5):
    print(i)   # → 0, 1, 2, 3, 4

for i in range(1, 6):
    print(i)   # → 1, 2, 3, 4, 5
\`\`\`

---

**リスト内包表記（一行で変換）：**

\`\`\`python
# 通常の書き方
squares = []
for x in range(5):
    squares.append(x ** 2)

# リスト内包表記（同じ意味）
squares = [x ** 2 for x in range(5)]
print(squares)  # → [0, 1, 4, 9, 16]
\`\`\`

Claude Codeが生成するコードでよく見るパターンです。`,
        },
      ],
    },
    {
      id: "while-loop",
      title: "while文",
      blocks: [
        {
          type: "text",
          content: `**while文** は「条件が真の間、繰り返す」ループです。

\`\`\`python
count = 0

while count < 5:
    print(f"count = {count}")
    count += 1

# → count = 0, 1, 2, 3, 4
\`\`\`

---

**リトライ処理（実用例）：**

APIは失敗することがあります。whileでリトライ処理を実装できます。

\`\`\`python
import requests
import time

max_retries = 3
retry_count = 0

while retry_count < max_retries:
    response = requests.get("https://api.example.com/data")

    if response.status_code == 200:
        print("成功!")
        break  # ← ループを抜ける
    else:
        retry_count += 1
        print(f"失敗。リトライ {retry_count}/{max_retries}")
        time.sleep(1)  # 1秒待つ

if retry_count == max_retries:
    print("最大リトライ回数に達しました")
\`\`\`

**break** はループを即座に終了、**continue** は次の反復にスキップします。`,
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
            question: "リストの全要素を処理したいとき、最適なのはどれ？",
            options: ["if文", "for文", "while文", "どれでも同じ"],
            answer: 1,
            explanation: "リストなど「決まった要素数を繰り返す」にはfor文が最適です。while文は「条件が満たされる間」の不定回ループに使います。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "コード「for i in range(3):」で、iが取る値の順番は？",
            options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "1, 2"],
            answer: 1,
            explanation: "range(3)は0, 1, 2の3つの値を生成します。range(n)はn個の値で0始まりです。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "[x*2 for x in [1,2,3]] の結果はどれ？",
            options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "エラー"],
            answer: 1,
            explanation: "リスト内包表記で各要素を2倍にしています。1→2, 2→4, 3→6 なので [2, 4, 6] が正解です。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：記事リストを処理する",
      blocks: [
        {
          type: "text",
          content: `JSONPlaceholderから投稿一覧を取得し、条件でフィルタリングしてみましょう。

\`\`\`python
import requests

# 投稿一覧を取得
response = requests.get("https://jsonplaceholder.typicode.com/posts")
posts = response.json()

print(f"総投稿数: {len(posts)}")

# ユーザーID=1の投稿だけ取り出す
user1_posts = []
for post in posts:
    if post["userId"] == 1:
        user1_posts.append(post)

print(f"ユーザー1の投稿数: {len(user1_posts)}")

# タイトルだけ表示
for post in user1_posts[:3]:  # 最初の3件だけ
    print(f"- {post['title'][:30]}...")
\`\`\`

**課題：** リスト内包表記を使って、\`user1_posts\` の部分を1行で書き直してみましょう。ヒント：\`[post for post in posts if post["userId"] == 1]\``,
        },
      ],
    },
  ],
};

export default lesson;
