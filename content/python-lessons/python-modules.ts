import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-modules",
  title: "モジュール・パッケージ・import体系",
  subtitle: "自作モジュール・__init__.py・相対import",
  sections: [
    {
      id: "modules",
      title: "モジュールとimport",
      blocks: [
        {
          type: "text",
          content: `**モジュール**は Python ファイル（\`.py\`）のことです。\`import\` で他のファイルの機能を読み込めます。

**import の種類：**

\`\`\`python
# モジュール全体をインポート
import math
print(math.pi)         # → 3.14159...
print(math.sqrt(16))   # → 4.0

# モジュールに別名をつける
import numpy as np     # np は慣習的な略称
arr = np.array([1, 2, 3])

# 特定の関数・クラスだけインポート
from pathlib import Path
from datetime import datetime, timedelta

# 全てインポート（非推奨）
from math import *     # ← 名前空間が汚染される
\`\`\`

**\`from X import Y\` vs \`import X\` の使い分け：**

\`\`\`python
# from import — 短く書けるが、どこから来たか分かりにくい
from math import sqrt
print(sqrt(16))   # → 4.0（math.sqrt とは書かなくていい）

# import — 少し長いが、出所が明確
import math
print(math.sqrt(16))
\`\`\`

大型プロジェクトでは \`import X\` の方が可読性が高い場合が多いです。`,
        },
        {
          type: "code-runner",
          initialCode: `import math
import random
from datetime import datetime, timedelta

# math モジュール
print(f"π = {math.pi:.6f}")
print(f"√2 = {math.sqrt(2):.6f}")
print(f"log10(1000) = {math.log10(1000)}")

# random モジュール
random.seed(42)  # 再現性のためのシード
nums = [random.randint(1, 100) for _ in range(5)]
print(f"ランダム: {nums}")
print(f"選択: {random.choice(nums)}")

# datetime
now = datetime.now()
print(f"現在時刻: {now.strftime('%Y-%m-%d %H:%M')}")
future = now + timedelta(days=30)
print(f"30日後: {future.strftime('%Y-%m-%d')}")`,
        },
      ],
    },
    {
      id: "packages",
      title: "パッケージと__init__.py",
      blocks: [
        {
          type: "text",
          content: `**パッケージ**は複数のモジュールをまとめたディレクトリです。

\`\`\`
myapp/
├── __init__.py      ← パッケージであることを示すファイル
├── models.py
├── utils.py
└── services/
    ├── __init__.py
    ├── auth.py
    └── payment.py
\`\`\`

**\`__init__.py\` の役割：**

\`\`\`python
# myapp/__init__.py
from .models import User, Product   # . は現在のパッケージを指す
from .utils import format_date

__version__ = "1.0.0"
__all__ = ["User", "Product", "format_date"]  # from myapp import * で公開するもの
\`\`\`

これにより：
\`\`\`python
from myapp import User      # models.py から User が使える
import myapp
print(myapp.__version__)   # → 1.0.0
\`\`\`

**相対インポートと絶対インポート：**

\`\`\`python
# myapp/services/auth.py から

# 相対インポート（同じパッケージ内）
from ..models import User   # .. は1つ上のパッケージ
from .payment import PaymentService  # . は同じパッケージ

# 絶対インポート（プロジェクトルートから）
from myapp.models import User
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `# モジュールの __name__ と if __name__ == "__main__"
# このイディオムは非常によく使われます

def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

# このファイルが直接実行された場合のみ動くコード
if __name__ == "__main__":
    print("テスト実行")
    print(add(2, 3))
    print(multiply(4, 5))

# sys.modules で読み込まれたモジュールを確認
import sys
print("\\n読み込まれたモジュール（一部）:")
for name in list(sys.modules.keys())[:5]:
    print(f"  {name}")`,
        },
      ],
    },
    {
      id: "stdlib-overview",
      title: "よく使う標準ライブラリ",
      blocks: [
        {
          type: "text",
          content: `Python の標準ライブラリ（batteries included）には豊富なモジュールが含まれています。

**os / sys — システム操作：**

\`\`\`python
import os
import sys

# 環境変数
api_key = os.environ.get("API_KEY", "未設定")
home = os.path.expanduser("~")

# コマンドライン引数
script_name = sys.argv[0]
args = sys.argv[1:]   # スクリプト以外の引数

# Pythonのバージョン
print(sys.version_info)   # → sys.version_info(major=3, minor=12, ...)
\`\`\`

**itertools — 高度なイテレーション：**

\`\`\`python
import itertools

# チェーン（複数のイテラブルを連結）
for x in itertools.chain([1, 2], [3, 4], [5]):
    print(x)  # 1 2 3 4 5

# 組み合わせ・順列
for pair in itertools.combinations("ABCD", 2):
    print(pair)  # ('A', 'B'), ('A', 'C'), ...

# groupby（ソート済みデータをグループ化）
data = [("A", 1), ("B", 2), ("A", 3), ("B", 4)]
data.sort(key=lambda x: x[0])
for key, group in itertools.groupby(data, key=lambda x: x[0]):
    print(key, list(group))
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import itertools
from collections import Counter, defaultdict

# itertools.combinations で組み合わせ
players = ["Alice", "Bob", "Carol", "Dave"]
pairs = list(itertools.combinations(players, 2))
print(f"ペアリング数: {len(pairs)}")
for p in pairs[:4]:
    print(f"  {p[0]} vs {p[1]}")

print()

# Counter で頻度カウント
words = "the quick brown fox jumps over the lazy dog the".split()
freq = Counter(words)
print("単語の頻度:")
for word, count in freq.most_common(3):
    print(f"  {word}: {count}回")

print()

# defaultdict でグループ化
students = [
    ("Alice", "A"), ("Bob", "B"), ("Carol", "A"),
    ("Dave", "C"), ("Eve", "B")
]
by_grade = defaultdict(list)
for name, grade in students:
    by_grade[grade].append(name)

for grade in sorted(by_grade):
    print(f"グレード{grade}: {by_grade[grade]}")`,
        },
        {
          type: "quiz",
          data: {
            question: "if __name__ == \"__main__\": のブロックが実行されるのは？",
            options: [
              "常に実行される",
              "そのファイルを直接実行した場合のみ",
              "import された場合のみ",
              "テスト実行時のみ",
            ],
            answer: 1,
            explanation: "__name__ はファイルが直接実行された場合に \"__main__\" になります。別のファイルから import された場合はモジュール名（ファイル名）になります。このイディオムを使うと、モジュールとして使える関数を定義しつつ、直接実行時のテストコードも書けます。",
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
            question: "from math import * を避けるべき理由は？",
            options: [
              "実行速度が遅くなる",
              "名前空間が汚染され、どこから来た名前か分からなくなる",
              "エラーが発生する",
              "math モジュールが使えなくなる",
            ],
            answer: 1,
            explanation: "from X import * は X の全てのシンボルをローカル名前空間に取り込みます。どこから来た名前か分からなくなるため、大きなコードベースでは避けるべきです。意図せず既存の変数を上書きするリスクもあります。",
          },
        },
      ],
    },
  ],
};

export default lesson;
