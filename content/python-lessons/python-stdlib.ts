import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-stdlib",
  title: "標準ライブラリ活用",
  subtitle: "collections・itertools・datetime・os / pathlib",
  sections: [
    {
      id: "collections",
      title: "collections モジュール",
      blocks: [
        {
          type: "text",
          content: `**collections** モジュールは、組み込みのコレクション型を拡張した便利なデータ構造を提供します。

**Counter — 要素の出現回数を数える：**

\`\`\`python
from collections import Counter

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
count = Counter(words)

print(count["apple"])           # → 3
print(count.most_common(2))     # → [("apple", 3), ("banana", 2)]
print(count.total())            # → 6（Python 3.10+）

# 算術演算
a = Counter(["a", "b", "b"])
b = Counter(["b", "c"])
print(a + b)  # Counter({"b": 3, "a": 1, "c": 1})
\`\`\`

**defaultdict — デフォルト値付き辞書：**

\`\`\`python
from collections import defaultdict

# 通常の辞書
d = {}
d.setdefault("key", []).append(1)  # 面倒

# defaultdict
d = defaultdict(list)
d["fruits"].append("apple")   # KeyError にならない
d["fruits"].append("banana")
d["vegs"].append("carrot")

print(dict(d))
# → {"fruits": ["apple", "banana"], "vegs": ["carrot"]}
\`\`\`

**deque — 両端キュー（高速な先頭・末尾操作）：**

\`\`\`python
from collections import deque

q = deque([1, 2, 3], maxlen=5)
q.appendleft(0)   # 先頭に追加（O(1)）
q.append(4)       # 末尾に追加
q.popleft()       # 先頭を取り出す（O(1)）
# リストで同じことをすると O(n)
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from collections import Counter, defaultdict, deque

# Counter で文字の頻度分析
text = "mississippi"
freq = Counter(text)
print("文字の頻度:")
for char, count in freq.most_common():
    print(f"  '{char}': {'█' * count} ({count})")

print()

# defaultdict でグループ化
records = [
    ("Alice", "sales"), ("Bob", "eng"),
    ("Carol", "sales"), ("Dave", "eng"),
    ("Eve", "hr"), ("Frank", "eng"),
]
by_dept = defaultdict(list)
for name, dept in records:
    by_dept[dept].append(name)

for dept, members in sorted(by_dept.items()):
    print(f"{dept}: {', '.join(members)}")

print()

# deque で直近N件のログを保持
log = deque(maxlen=3)  # 最大3件
for i in range(6):
    log.append(f"ログ{i}")
    print(f"追加後: {list(log)}")`,
        },
      ],
    },
    {
      id: "itertools",
      title: "itertools モジュール",
      blocks: [
        {
          type: "text",
          content: `**itertools** はイテレータの生成・組み合わせに特化したモジュールです。メモリ効率の良い処理が書けます。

\`\`\`python
import itertools

# chain — 複数のイテラブルを連結
for x in itertools.chain([1, 2], [3, 4], "AB"):
    print(x, end=" ")  # → 1 2 3 4 A B

# product — デカルト積（全組み合わせ）
for pair in itertools.product("AB", "12"):
    print(pair, end=" ")  # → ('A','1') ('A','2') ('B','1') ('B','2')

# combinations — 組み合わせ（順序なし）
list(itertools.combinations("ABCD", 2))
# → [('A','B'), ('A','C'), ('A','D'), ('B','C'), ('B','D'), ('C','D')]

# permutations — 順列（順序あり）
list(itertools.permutations("ABC", 2))
# → [('A','B'), ('A','C'), ('B','A'), ('B','C'), ('C','A'), ('C','B')]

# groupby — 連続する同じ値をグループ化
data = [("A", 1), ("A", 2), ("B", 3), ("A", 4)]
data.sort(key=lambda x: x[0])  # groupby の前にソートが必要
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, [g[1] for g in group])

# islice — イテレータの先頭N件
for n in itertools.islice(itertools.count(), 5):
    print(n, end=" ")  # → 0 1 2 3 4
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import itertools

# トーナメント表（総当たり）
players = ["Alice", "Bob", "Carol", "Dave"]
matches = list(itertools.combinations(players, 2))
print(f"試合数: {len(matches)}")
for p1, p2 in matches:
    print(f"  {p1} vs {p2}")

print()

# 商品のカラー・サイズのSKU生成
colors = ["赤", "青", "緑"]
sizes = ["S", "M", "L", "XL"]
skus = list(itertools.product(colors, sizes))
print(f"SKU数: {len(skus)}")
for color, size in skus[:6]:
    print(f"  {color}-{size}")

print()

# accumulate で累積和
import itertools
nums = [1, 2, 3, 4, 5]
cumsum = list(itertools.accumulate(nums))
print(f"累積和: {cumsum}")`,
        },
      ],
    },
    {
      id: "datetime-os",
      title: "datetime と os",
      blocks: [
        {
          type: "text",
          content: `**datetime — 日付・時刻の操作：**

\`\`\`python
from datetime import datetime, date, timedelta, timezone

# 現在時刻
now = datetime.now()          # ローカル時刻
utc_now = datetime.now(timezone.utc)  # UTC

# 文字列との変換
now.strftime("%Y-%m-%d %H:%M:%S")   # → "2024-05-01 14:30:00"
datetime.strptime("2024-05-01", "%Y-%m-%d")  # 文字列→datetime

# 演算
tomorrow = now + timedelta(days=1)
diff = now - datetime(2024, 1, 1)
print(f"2024年の経過日数: {diff.days}")

# タイムゾーン
from zoneinfo import ZoneInfo  # Python 3.9+
tokyo = datetime.now(ZoneInfo("Asia/Tokyo"))
\`\`\`

**os / os.path — システム操作：**

\`\`\`python
import os

# 環境変数
api_key = os.environ.get("API_KEY", "未設定")
os.environ["MY_VAR"] = "value"

# カレントディレクトリ
cwd = os.getcwd()
os.chdir("/tmp")   # ディレクトリ変更

# ディレクトリ作成・削除
os.makedirs("dir/subdir", exist_ok=True)
os.remove("file.txt")
os.rmdir("empty_dir")
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from datetime import datetime, timedelta

# 日付計算
now = datetime.now()
print(f"現在: {now.strftime('%Y-%m-%d %H:%M:%S')}")

deadlines = [1, 7, 30, 365]
for days in deadlines:
    future = now + timedelta(days=days)
    print(f"+{days:3d}日後: {future.strftime('%Y-%m-%d')}")

print()

# 期間の計算
start = datetime(2026, 1, 1)
end = datetime(2026, 12, 31)
diff = end - start
print(f"2026年の残り日数: {diff.days}日")

# フォーマット一覧
formats = ["%Y/%m/%d", "%d %b %Y", "%A, %B %d", "%Y%m%d"]
for fmt in formats:
    print(f"  {now.strftime(fmt)}")`,
        },
        {
          type: "quiz",
          data: {
            question: "defaultdict(list) のメリットは？",
            options: [
              "リストより高速に検索できる",
              "キーが存在しない場合に自動で空リストを作成するので KeyError が起きない",
              "辞書の要素を自動でソートする",
              "スレッドセーフになる",
            ],
            answer: 1,
            explanation: "defaultdict(list) は存在しないキーにアクセスしたとき、指定したファクトリ（list）を呼び出して自動的にデフォルト値を生成します。d[key].append(val) のようにグループ化処理で KeyError を気にせず書けます。",
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
            question: "itertools.combinations('ABC', 2) で得られる組み合わせ数は？",
            options: ["3", "6", "9", "2"],
            answer: 0,
            explanation: "3つから2つを選ぶ組み合わせは 3C2 = 3通りです：('A','B'), ('A','C'), ('B','C')。順列（permutations）なら 3P2 = 6通りになります。",
          },
        },
      ],
    },
  ],
};

export default lesson;
