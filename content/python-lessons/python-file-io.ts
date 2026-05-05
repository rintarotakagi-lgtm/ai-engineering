import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-file-io",
  title: "ファイル入出力",
  subtitle: "pathlib・テキスト / JSON / CSV の読み書き",
  sections: [
    {
      id: "pathlib",
      title: "pathlib でパスを扱う",
      blocks: [
        {
          type: "text",
          content: `**pathlib**（Python 3.4+）はファイルパスをオブジェクトとして扱う標準ライブラリです。文字列でのパス操作より安全で読みやすいです。

\`\`\`python
from pathlib import Path

# パスの作成
p = Path("/Users/alice/Documents/data.csv")
p = Path.home() / "Documents" / "data.csv"  # / 演算子で結合

# パスの情報
print(p.name)        # → data.csv
print(p.stem)        # → data
print(p.suffix)      # → .csv
print(p.parent)      # → /Users/alice/Documents
print(p.exists())    # → True/False
print(p.is_file())   # → True
print(p.is_dir())    # → False

# ディレクトリ操作
docs = Path.home() / "Documents"
docs.mkdir(parents=True, exist_ok=True)  # 存在してもエラーにしない

# ファイル一覧
for f in docs.glob("*.txt"):     # txtファイルを列挙
    print(f.name)

for f in docs.rglob("*.py"):    # 再帰的に検索
    print(f)
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `from pathlib import Path

# カレントディレクトリ
cwd = Path.cwd()
print(f"現在のディレクトリ: {cwd}")

# パスの操作
p = Path("/home/user/projects/myapp/src/main.py")
print(f"ファイル名: {p.name}")
print(f"拡張子なし: {p.stem}")
print(f"拡張子: {p.suffix}")
print(f"親ディレクトリ: {p.parent}")
print(f"祖父母ディレクトリ: {p.parent.parent}")

# パスの結合
base = Path("/data")
output = base / "2024" / "results.json"
print(f"出力パス: {output}")

# パスを文字列に変換
print(str(output))`,
        },
      ],
    },
    {
      id: "text-files",
      title: "テキストファイルの読み書き",
      blocks: [
        {
          type: "text",
          content: `**ファイルの書き込み：**

\`\`\`python
from pathlib import Path

path = Path("output.txt")

# with 文で自動クローズ（推奨）
with open(path, "w", encoding="utf-8") as f:
    f.write("1行目\\n")
    f.write("2行目\\n")
    print("3行目", file=f)  # print() の file 引数

# pathlib を使った簡潔な書き方
path.write_text("内容\\n2行目\\n", encoding="utf-8")
\`\`\`

**ファイルの読み込み：**

\`\`\`python
# 全体を読む
content = path.read_text(encoding="utf-8")

# 1行ずつ（大きなファイルに向く）
with open(path, encoding="utf-8") as f:
    for line in f:
        print(line.rstrip())  # 末尾の改行を除去

# 全行をリストで
lines = path.read_text().splitlines()
\`\`\`

**モード一覧：**

| モード | 意味 |
|--------|------|
| \`"r"\` | 読み取り（デフォルト） |
| \`"w"\` | 書き込み（上書き） |
| \`"a"\` | 追記 |
| \`"r+"\` | 読み書き |
| \`"rb"\` | バイナリ読み取り |`,
        },
        {
          type: "code-runner",
          initialCode: `import tempfile
from pathlib import Path

# 一時ファイルを使って読み書きをデモ
with tempfile.NamedTemporaryFile(mode='w', suffix='.txt',
                                  delete=False, encoding='utf-8') as f:
    tmp_path = Path(f.name)
    f.write("Python\\n")
    f.write("is\\n")
    f.write("awesome\\n")

print(f"書き込んだファイル: {tmp_path.name}")

# 読み取り
content = tmp_path.read_text(encoding='utf-8')
print("全体:")
print(content)

# 行ごと
lines = content.splitlines()
print(f"行数: {len(lines)}")
for i, line in enumerate(lines, 1):
    print(f"  {i}: {line}")

tmp_path.unlink()  # 後始末`,
        },
      ],
    },
    {
      id: "json-csv",
      title: "JSON と CSV",
      blocks: [
        {
          type: "text",
          content: `**JSON の読み書き：**

\`\`\`python
import json
from pathlib import Path

data = {
    "users": [
        {"name": "Alice", "age": 25},
        {"name": "Bob",   "age": 30},
    ]
}

# 書き込み
path = Path("data.json")
with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 読み込み
with open(path, encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["users"][0]["name"])  # → Alice

# 文字列との変換
json_str = json.dumps(data, ensure_ascii=False)
data2 = json.loads(json_str)
\`\`\`

**CSV の読み書き：**

\`\`\`python
import csv

# 書き込み
with open("users.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age", "city"])
    writer.writeheader()
    writer.writerows([
        {"name": "Alice", "age": 25, "city": "Tokyo"},
        {"name": "Bob",   "age": 30, "city": "Osaka"},
    ])

# 読み込み
with open("users.csv", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(dict(row))
\`\`\``,
        },
        {
          type: "code-runner",
          initialCode: `import json

# JSON の操作をメモリ内で試す
data = {
    "products": [
        {"id": 1, "name": "ノートPC", "price": 150000, "in_stock": True},
        {"id": 2, "name": "マウス",   "price": 5000,   "in_stock": True},
        {"id": 3, "name": "モニター", "price": 80000,  "in_stock": False},
    ]
}

# シリアライズ
json_str = json.dumps(data, ensure_ascii=False, indent=2)
print(json_str)

# デシリアライズ & フィルタリング
loaded = json.loads(json_str)
in_stock = [p for p in loaded["products"] if p["in_stock"]]
print(f"\\n在庫あり: {len(in_stock)}件")
for p in in_stock:
    print(f"  {p['name']}: {p['price']:,}円")`,
        },
        {
          type: "quiz",
          data: {
            question: "json.dumps() と json.dump() の違いは？",
            options: [
              "dumps は日本語を変換できない",
              "dumps は文字列に変換、dump はファイルに書き込む",
              "dump は文字列に変換、dumps はファイルに書き込む",
              "違いはない",
            ],
            answer: 1,
            explanation: "json.dumps() は Python オブジェクト → JSON 文字列（s = string）、json.dump() は Python オブジェクト → ファイルに直接書き込む。対応する読み込みは json.loads()（文字列から）と json.load()（ファイルから）です。",
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
            question: "open(path, \"a\") のモード「a」の意味は？",
            options: [
              "ファイルを上書きして書き込む",
              "ファイルの末尾に追記する",
              "読み取り専用で開く",
              "バイナリモードで開く",
            ],
            answer: 1,
            explanation: "\"a\" は append（追記）モードです。ファイルが存在する場合は末尾から追記し、存在しない場合は新規作成します。\"w\" は上書き（既存の内容が消える）なので混同しないように注意してください。",
          },
        },
      ],
    },
  ],
};

export default lesson;
