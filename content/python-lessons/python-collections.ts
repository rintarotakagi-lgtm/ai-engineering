import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-collections",
  title: "リスト・タプル・辞書・セット",
  subtitle: "4つのコレクション型を使い分ける",
  sections: [
    {
      id: "list",
      title: "リスト（list）",
      blocks: [
        {
          type: "text",
          content: `**リスト**は順序ありの可変なコレクションです。角括弧 \`[]\` で作ります。

\`\`\`python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, None]  # 異なる型を混在できる
\`\`\`

**基本操作：**

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# 追加
fruits.append("date")       # 末尾に追加
fruits.insert(1, "avocado") # 指定位置に挿入

# 削除
fruits.remove("banana")     # 値で削除（最初の1つ）
popped = fruits.pop()       # 末尾を取り出して返す
popped = fruits.pop(0)      # 指定インデックスを取り出す

# 検索
print("apple" in fruits)    # True/False
print(fruits.index("cherry"))  # インデックスを返す
print(fruits.count("apple"))   # 出現回数

# ソート
fruits.sort()               # 元のリストを変更
sorted_fruits = sorted(fruits)  # 新しいリストを返す
fruits.sort(reverse=True)   # 降順
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `fruits = ["apple", "banana", "cherry"]

# 追加・削除
fruits.append("date")
fruits.insert(1, "avocado")
print(fruits)

fruits.remove("banana")
print(fruits)

# スライス（文字列と同じ）
print(fruits[1:3])
print(fruits[::-1])

# ソート
nums = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(nums))
print(sorted(nums, reverse=True))`,
        },
      ],
    },
    {
      id: "tuple-set",
      title: "タプルとセット",
      blocks: [
        {
          type: "text",
          content: `**タプル（tuple）— 変更不可のリスト：**

\`\`\`python
point = (10, 20)       # 丸括弧で作成
point = 10, 20         # 括弧を省略できる
x, y = point           # アンパック（分解して代入）

# リストとの違い
point[0] = 99  # → TypeError！ 変更できない
\`\`\`

**タプルをいつ使うか？**
- 変更されてはいけないデータ（座標、RGB値など）
- 関数から複数の値を返す
- 辞書のキーに使う（リストはキーにできない）

---

**セット（set）— 重複なし・順序なし：**

\`\`\`python
s = {1, 2, 3, 2, 1}  # → {1, 2, 3}（重複が除去される）
s = set([1, 2, 2, 3])  # リストからセットを作る

s.add(4)
s.remove(2)
print(3 in s)  # → True（高速な検索）

# 集合演算
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print(a | b)  # 和集合: {1, 2, 3, 4, 5, 6}
print(a & b)  # 積集合: {3, 4}
print(a - b)  # 差集合: {1, 2}
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `# タプルのアンパック
point = (10, 20)
x, y = point
print(f"x={x}, y={y}")

# 複数返り値
def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([3, 1, 4, 1, 5, 9])
print(f"min={lo}, max={hi}")

# セットで重複除去
words = ["apple", "banana", "apple", "cherry", "banana"]
unique = set(words)
print(unique)
print(len(unique))`,
        },
      ],
    },
    {
      id: "dict",
      title: "辞書（dict）",
      blocks: [
        {
          type: "text",
          content: `**辞書（dict）**はキーと値のペアを管理するコレクションです。

\`\`\`python
user = {
    "name": "Alice",
    "age": 25,
    "active": True,
}
\`\`\`

**基本操作：**

\`\`\`python
# 読み取り
print(user["name"])          # → Alice
print(user.get("email"))     # → None（キーがなくてもエラーにならない）
print(user.get("email", "未設定"))  # → 未設定（デフォルト値）

# 追加・更新
user["email"] = "alice@example.com"
user.update({"age": 26, "city": "Tokyo"})

# 削除
del user["active"]
email = user.pop("email")  # 取り出して削除

# 存在確認
print("name" in user)   # → True（キーの存在確認）

# イテレーション
for key in user:                    # キーのループ
    print(key, user[key])
for key, val in user.items():       # キーと値のループ
    print(f"{key}: {val}")
print(list(user.keys()))
print(list(user.values()))
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `user = {"name": "Alice", "age": 25, "city": "Tokyo"}

# 安全な読み取り
print(user.get("email", "未登録"))

# 更新
user["age"] = 26
user["email"] = "alice@example.com"
print(user)

# ループ
for key, val in user.items():
    print(f"  {key}: {val}")

# 辞書内包表記
squares = {n: n**2 for n in range(1, 6)}
print(squares)`,
        },
        {
          type: "quiz",
          data: {
            question: "d = {\"a\": 1}; d.get(\"b\", 0) の結果は？",
            options: ["None", "0", "エラー", "\"b\""],
            answer: 1,
            explanation: "dict.get(key, default) はキーが存在しない場合にデフォルト値を返します。\"b\" は存在しないので 0 が返されます。d[\"b\"] と書くと KeyError になりますが、get() は安全です。",
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
            question: "リストとタプルの最大の違いは？",
            options: [
              "タプルは数値しか格納できない",
              "タプルは変更できない（immutable）",
              "リストは検索が速い",
              "タプルは順序を持たない",
            ],
            answer: 1,
            explanation: "タプルは作成後に要素を追加・削除・変更できない immutable なデータ構造です。リストは mutable（変更可能）で、append() や remove() などで変更できます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "set([1, 2, 2, 3, 3, 3]) の結果は？",
            options: ["{1, 2, 2, 3, 3, 3}", "{1, 2, 3}", "[1, 2, 3]", "エラー"],
            answer: 1,
            explanation: "セットは重複を自動的に除去します。また順序は保証されません（表示順序が異なる場合があります）。リストからセットを作るには set() を使います。",
          },
        },
      ],
    },
  ],
};

export default lesson;
