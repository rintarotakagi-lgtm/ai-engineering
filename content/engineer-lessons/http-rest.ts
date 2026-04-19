import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "http-rest",
  title: "HTTP・REST APIとは",
  subtitle: "GET/POST/PUT/DELETE の違いを理解し、curlでAPIを叩く",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** GET/POST/PUT/DELETEの違いを説明できる。curlでAPIを叩いてデータを取得・送信できる。

**所要時間：** 約25分

---

「APIを叩く」という言葉、エンジニアとの会話でよく出てきます。でも非エンジニアには何をしているのか謎なはず。

このレッスンで、APIが「ルールに従った会話の窓口」であることを理解します。Notionのデータを取る、Slackにメッセージを送る、ChatGPTに問い合わせる——すべて「APIを叩く」ことでできています。`,
        },
      ],
    },
    {
      id: "http-methods",
      title: "HTTPメソッドの4つの動詞",
      blocks: [
        {
          type: "text",
          content: `HTTPには「何をしたいか」を伝える動詞（メソッド）があります。4つだけ覚えれば十分です。

| メソッド | 意味 | 日常の例え |
|---------|------|-----------|
| **GET** | データを取得する | 本棚から本を取り出す |
| **POST** | 新しいデータを作成する | 本棚に新しい本を追加する |
| **PUT** | 既存のデータを更新する | 本棚の本を入れ替える |
| **DELETE** | データを削除する | 本棚から本を捨てる |

---

**CRUD** という概念も覚えておくと便利です：

- **C**reate → POST（作る）
- **R**ead → GET（読む）
- **U**pdate → PUT（更新する）
- **D**elete → DELETE（消す）

ほぼすべてのWebシステムは、このCRUDの組み合わせで動いています。`,
        },
        {
          type: "interactive",
          id: "eng-http-methods",
        },
      ],
    },
    {
      id: "rest-api",
      title: "REST APIとは",
      blocks: [
        {
          type: "text",
          content: `**REST API** とは、「リソース（もの）を URL で表し、HTTP メソッドで操作するルール」です。

例えばタスク管理アプリのAPIを設計するとこうなります：

\`\`\`
GET    /tasks          → 全タスクの一覧を取得
GET    /tasks/42       → ID=42のタスクを取得
POST   /tasks          → 新しいタスクを作成
PUT    /tasks/42       → ID=42のタスクを更新
DELETE /tasks/42       → ID=42のタスクを削除
\`\`\`

URL（名詞）× HTTPメソッド（動詞）= 操作の意味、という構造になっています。

---

**実際のAPI例：GitHub API**

\`\`\`bash
# anthropicsのリポジトリ一覧を取得
GET https://api.github.com/users/anthropics/repos
\`\`\`

これだけで、GitHubのサーバーから「anthropicsというユーザーの全リポジトリ情報」がJSONで返ってきます。`,
        },
      ],
    },
    {
      id: "status-codes",
      title: "ステータスコード",
      blocks: [
        {
          type: "text",
          content: `サーバーはレスポンスに「結果の番号」を付けます。これがステータスコードです。

**よく見るコード：**

| コード | 意味 | 例え |
|--------|------|------|
| **200** OK | 成功 | 「はい、どうぞ」 |
| **201** Created | 作成成功 | 「作りました」 |
| **400** Bad Request | リクエストが間違っている | 「注文が意味不明です」 |
| **401** Unauthorized | 認証が必要 | 「会員証を見せてください」 |
| **403** Forbidden | アクセス権限なし | 「VIP専用です」 |
| **404** Not Found | 見つからない | 「そんなメニューはありません」 |
| **500** Internal Server Error | サーバー側のエラー | 「厨房が火事です」 |

---

**覚え方：**
- 2xx → 成功
- 4xx → クライアント側のミス
- 5xx → サーバー側のミス`,
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
            question: "ユーザー登録フォームを送信するとき（新しいユーザーを作成する）、使うべきHTTPメソッドはどれ？",
            options: ["GET", "POST", "PUT", "DELETE"],
            answer: 1,
            explanation: "新しいリソースの作成にはPOSTを使います。GETはデータ取得、PUTは更新、DELETEは削除です。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "APIを叩いたら「404」が返ってきた。何が起きている？",
            options: [
              "サーバーがクラッシュしている",
              "認証が必要",
              "指定したリソースが存在しない",
              "リクエストの形式が間違っている",
            ],
            answer: 2,
            explanation: "404はNot Found。URLで指定したリソース（ページやデータ）が存在しないことを意味します。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "REST APIの設計原則として正しいのはどれ？",
            options: [
              "URLにはなるべく動詞を使う（例：/getUser, /deletePost）",
              "URLは名詞でリソースを表し、メソッドで操作を表す",
              "全ての操作にPOSTを使う",
              "GETとPOSTの2種類だけ使う",
            ],
            answer: 1,
            explanation: "RESTの原則は「URL（名詞）でリソースを、HTTPメソッド（動詞）で操作を表す」です。/users/42 + DELETE = ユーザー42を削除、という読み方をします。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：curlでAPIを叩く",
      blocks: [
        {
          type: "text",
          content: `実際にcurlでREST APIを叩いてみましょう。

**ステップ1：GETリクエスト（データを取得）**

\`\`\`bash
curl https://jsonplaceholder.typicode.com/posts/1
\`\`\`

レスポンス例：
\`\`\`json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere...",
  "body": "quia et suscipit..."
}
\`\`\`

**ステップ2：POSTリクエスト（データを作成）**

\`\`\`bash
curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title": "テスト投稿", "body": "本文", "userId": 1}'
\`\`\`

- \`-X POST\` : メソッドを指定
- \`-H\` : ヘッダー（JSONを送ることを宣言）
- \`-d\` : 送るデータ（本文）

**ステップ3：ステータスコードを確認**

\`\`\`bash
curl -s -o /dev/null -w "%{http_code}" https://jsonplaceholder.typicode.com/posts/1
\`\`\`

「200」と表示されれば成功です。

**課題：** \`/posts/9999\`（存在しないID）を叩いて404が返ることを確認してください。`,
        },
      ],
    },
  ],
};

export default lesson;
