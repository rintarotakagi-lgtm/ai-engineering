import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-libraries",
  title: "ライブラリの使い方（requests, pandas）",
  subtitle: "外部ライブラリ追加・APIコール・CSV読み書き",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** requestsでAPIを叩き、pandasでCSVを読み書きできる。ライブラリの検索→インストール→使用の流れをマスターする。

**所要時間：** 約25分

---

Pythonの真の強みは「ライブラリの豊富さ」です。世界中の開発者が作った便利なコード（ライブラリ）を組み合わせることで、ゼロから書く必要がなくなります。

「車輪の再発明をしない」がプログラマーの格言。ライブラリを探す → uvで追加 → 使う、このサイクルを体で覚えましょう。`,
        },
      ],
    },
    {
      id: "requests",
      title: "requests — HTTPクライアント",
      blocks: [
        {
          type: "text",
          content: `**requests** はHTTPリクエストを簡単に送れるライブラリです。curlでやっていたことをPythonで書けるようになります。

\`\`\`bash
uv add requests
\`\`\`

---

**GETリクエスト：**

\`\`\`python
import requests

# シンプルなGET
response = requests.get("https://api.github.com/users/octocat")

# ステータスコードの確認
print(response.status_code)   # → 200

# JSONレスポンスをdictに変換
data = response.json()
print(data["name"])            # → The Octocat

# ヘッダーの確認
print(response.headers["Content-Type"])
\`\`\`

---

**クエリパラメータ：**

\`\`\`python
params = {
    "q": "python tutorial",
    "per_page": 5,
    "sort": "stars"
}
response = requests.get(
    "https://api.github.com/search/repositories",
    params=params
)
# URL: https://api.github.com/search/repositories?q=python+tutorial&per_page=5&sort=stars
\`\`\`

---

**POSTリクエスト（認証付き）：**

\`\`\`python
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

body = {
    "model": "claude-opus-4-7",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello!"}]
}

response = requests.post(
    "https://api.anthropic.com/v1/messages",
    headers=headers,
    json=body   # dictを自動でJSON化
)
\`\`\``,
        },
      ],
    },
    {
      id: "pandas",
      title: "pandas — データ処理",
      blocks: [
        {
          type: "text",
          content: `**pandas** はデータ分析・加工のライブラリです。ExcelのようなテーブルデータをPythonで扱えます。

\`\`\`bash
uv add pandas
\`\`\`

---

**CSVを読み込む：**

\`\`\`python
import pandas as pd

# CSVを読み込む
df = pd.read_csv("sales.csv")

# 基本情報を確認
print(df.shape)       # → (100, 5) ← 100行5列
print(df.columns)     # → ['date', 'product', 'price', 'qty', 'total']
print(df.head(3))     # 最初の3行を表示
print(df.describe())  # 数値列の統計情報
\`\`\`

---

**データの操作：**

\`\`\`python
# 特定の列を取り出す
prices = df["price"]

# 条件でフィルタ
expensive = df[df["price"] > 10000]

# 新しい列を追加
df["total"] = df["price"] * df["qty"]

# グループ集計
summary = df.groupby("product")["total"].sum()
print(summary)
\`\`\`

---

**CSVに書き出す：**

\`\`\`python
df.to_csv("output.csv", index=False, encoding="utf-8-sig")
# index=False: 行番号を含めない
# utf-8-sig: Excelで開いたとき文字化けしない
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-csv-preview",
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
            question: "requestsでPOSTリクエストにJSONデータを送るとき、正しい引数は？",
            options: [
              "requests.post(url, body=data)",
              "requests.post(url, json=data)",
              "requests.post(url, data=json.dumps(data))",
              "requests.send(url, method='POST', data=data)",
            ],
            answer: 1,
            explanation: "requests.post()のjson=引数を使うと、dictを自動的にJSONシリアライズして送ります。また Content-Type: application/json ヘッダーも自動でセットされます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "pandasで「売上が10000円以上の行だけ取り出す」コードはどれ？",
            options: [
              "df.filter(price > 10000)",
              "df[df['price'] > 10000]",
              "df.where('price', '>', 10000)",
              "df.select(price='>10000')",
            ],
            answer: 1,
            explanation: "pandasのブールインデックスを使います。df['price'] > 10000 がTrueの行だけを df[] に渡すことでフィルタリングできます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "「uv add pandas」を実行した後、何が変わる？",
            options: [
              "pandasのコードが自動で生成される",
              "pyproject.tomlのdependenciesにpandasが追記され、インストールされる",
              "Pythonが再インストールされる",
              "プロジェクトフォルダにpandas.pyが作られる",
            ],
            answer: 1,
            explanation: "uv addはpyproject.tomlに依存関係を記録し、.venv/にインストールします。これでimport pandasが使えるようになります。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：APIデータをCSVに保存する",
      blocks: [
        {
          type: "text",
          content: `APIからデータを取得してCSVに保存する、実用的なスクリプトを作りましょう。

\`\`\`bash
uv add requests pandas
\`\`\`

\`\`\`python
# api_to_csv.py
import requests
import pandas as pd

# 投稿データを取得
response = requests.get("https://jsonplaceholder.typicode.com/posts")
posts = response.json()

# DataFrameに変換
df = pd.DataFrame(posts)

print("カラム:", df.columns.tolist())
print("件数:", len(df))
print(df.head())

# CSVに保存
df.to_csv("posts.csv", index=False)
print("posts.csv に保存しました")

# 保存したCSVを読み直して確認
df2 = pd.read_csv("posts.csv")
print(f"読み込み確認: {len(df2)}件")
\`\`\`

**課題：** df.groupby("userId")["id"].count() を実行して、ユーザーごとの投稿数を集計してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
