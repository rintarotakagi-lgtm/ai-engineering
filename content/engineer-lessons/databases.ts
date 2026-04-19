import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "databases",
  title: "データベース（RDB vs NoSQL）",
  subtitle: "テーブル構造を理解し、使い分けの判断基準をつかむ",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** テーブル構造を図で書ける。RDBとNoSQLの違いを説明し、どちらを使うか判断できる。

**所要時間：** 約25分

---

「このデータはどこに保存されているの？」という問いの答えが、ほぼ常にデータベースです。

ユーザー情報、注文履歴、チャット履歴、商品在庫——すべてデータベースに入っています。エンジニアに「DBのスキーマを見せて」と言えるだけで、システム理解がぐっと深まります。`,
        },
      ],
    },
    {
      id: "rdb",
      title: "RDB（リレーショナルDB）",
      blocks: [
        {
          type: "text",
          content: `**RDB（リレーショナルデータベース）** は、データをExcelのような「表（テーブル）」で管理します。

代表例：PostgreSQL, MySQL, SQLite

---

**例：ECサイトのデータ構造**

\`\`\`
【usersテーブル】
| id | name     | email              |
|----|----------|--------------------|
|  1 | 田中太郎  | tanaka@example.com |
|  2 | 鈴木花子  | suzuki@example.com |

【ordersテーブル】
| id | user_id | total  | created_at |
|----|---------|--------|------------|
|  1 |       1 | 3,200円 | 2024-01-15 |
|  2 |       1 | 1,800円 | 2024-02-03 |
|  3 |       2 |   950円 | 2024-02-10 |
\`\`\`

ordersテーブルの \`user_id\` が usersテーブルの \`id\` を参照しています。これが「リレーション（関係）」です。

---

**RDBの強み：**
- データの整合性が保てる（矛盾したデータが入りにくい）
- 複数テーブルをまたいだ複雑な検索ができる（JOIN）
- 30年以上の実績。銀行・ECサイト・SNSで広く使われる`,
        },
        {
          type: "interactive",
          id: "eng-table-builder",
        },
      ],
    },
    {
      id: "nosql",
      title: "NoSQL",
      blocks: [
        {
          type: "text",
          content: `**NoSQL** は「表形式に縛られない」データベースの総称です。

代表例：
- **MongoDB** — ドキュメント型（JSONをそのまま保存）
- **Redis** — キーバリュー型（超高速）
- **Firestore** — ドキュメント型（Googleが提供、モバイルアプリ向け）
- **DynamoDB** — キーバリュー型（AWSが提供）

---

**MongoDBの例（ドキュメント型）：**

\`\`\`json
{
  "_id": "user_001",
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "orders": [
    { "total": 3200, "date": "2024-01-15" },
    { "total": 1800, "date": "2024-02-03" }
  ],
  "tags": ["premium", "repeat"]
}
\`\`\`

ユーザー情報と注文履歴が1つのドキュメントにまとまっています。テーブルをJOINする必要がありません。

---

**NoSQLの強み：**
- スキーマ（テーブル設計）が柔軟。カラムを後から追加しやすい
- 水平スケールが得意（サーバーを増やして性能を上げやすい）
- JSONと相性がいい（APIのデータをそのまま保存できる）`,
        },
      ],
    },
    {
      id: "comparison",
      title: "どちらを選ぶか",
      blocks: [
        {
          type: "text",
          content: `**RDB vs NoSQL 使い分けチートシート：**

| 条件 | RDB | NoSQL |
|------|-----|-------|
| データの関係が複雑（ユーザー↔注文↔商品） | ◎ | △ |
| スキーマが頻繁に変わる | △ | ◎ |
| 金融・決済（絶対に整合性が必要） | ◎ | △ |
| リアルタイムチャット・SNS | △ | ◎ |
| 超大量データ（スケール重視） | △ | ◎ |
| 開発初期（スピード重視） | △ | ◎ |

---

**実際の判断基準（ディレクター目線）：**

「このシステムのデータは、どう関係しているか？」を最初に考えます。

- 「ユーザーが注文して、注文に商品が紐づいて、商品に在庫が...」→ 関係が複雑 → **RDB**
- 「ユーザーのフィードに投稿を流す。フォロワーが多くてデータ量が多い」→ スケール重視 → **NoSQL**

多くのスタートアップは「最初はPostgreSQL（RDB）で始め、ボトルネックが出たらNoSQLを部分導入」というパターンをとります。`,
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
            question: "RDBの「リレーション」とは何を指す？",
            options: [
              "データベースとアプリの接続",
              "テーブル同士がIDで関連付けられていること",
              "データのバックアップ",
              "クエリの実行速度",
            ],
            answer: 1,
            explanation: "リレーションは「テーブル間の関係」です。ordersテーブルのuser_idがusersテーブルのidを参照するように、外部キーで関連付けます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "決済システム（お金の動き）のデータベースとして適切なのはどちら？",
            options: [
              "MongoDB（NoSQL）— 柔軟なスキーマで開発が速いから",
              "PostgreSQL（RDB）— データの整合性が厳密に保てるから",
              "どちらでも変わらない",
              "Redis — 高速だから",
            ],
            answer: 1,
            explanation: "金融・決済は「絶対に矛盾が起きてはいけない」ためRDBが適しています。RDBはトランザクション（原子的な操作）が強力で、「送金したのにお金が増えも減りもしない」ような事故を防げます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "SNSのタイムライン（大量ユーザーのフィードを超高速で返す）に向いているのはどちら？",
            options: [
              "MySQL（RDB）",
              "Redis または DynamoDB（NoSQL）",
              "どちらも同等",
              "データベース不要",
            ],
            answer: 1,
            explanation: "SNSのタイムラインはスケール（データ量・アクセス数）が重要。NoSQLは水平スケールが得意で、Twitterなど大規模SNSはRedis/Cassandraなどを使います。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：SQLを体験する",
      blocks: [
        {
          type: "text",
          content: `ブラウザ上でSQLを試せる環境を使ってみましょう。

**オンラインSQL環境を使う：**
[https://sqliteonline.com/](https://sqliteonline.com/) を開いて、以下のSQLを実行してください。

**テーブルを作る：**
\`\`\`sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT,
  email TEXT
);

INSERT INTO users VALUES (1, '田中太郎', 'tanaka@example.com');
INSERT INTO users VALUES (2, '鈴木花子', 'suzuki@example.com');
\`\`\`

**データを取得する：**
\`\`\`sql
SELECT * FROM users;
SELECT name FROM users WHERE id = 1;
\`\`\`

**課題：** 自分で \`products\` テーブルを作り（id, name, price）、商品を3つ追加して、SELECTで表示してみてください。`,
        },
      ],
    },
  ],
};

export default lesson;
