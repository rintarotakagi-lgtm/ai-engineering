import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "frontend-backend",
  title: "フロントエンドとバックエンドの分離",
  subtitle: "SPA / SSR / SSG の違いと「どこで何が動くか」の地図",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** SPA/SSR/SSGの違いを説明できる。「この機能はフロントかバックか」をすぐに判断できる。

**所要時間：** 約20分

---

エンジニアが「これはフロントの問題」「バックで処理する」と言うとき、あなたは何のことかわかりますか？

この分離を理解すると、要件定義・設計・デバッグの会話が格段にスムーズになります。また「このUX改善は工数がかかる/かからない」の判断もできるようになります。`,
        },
      ],
    },
    {
      id: "separation",
      title: "フロントとバックの役割分担",
      blocks: [
        {
          type: "text",
          content: `**フロントエンド** = ユーザーが直接見て触る部分

- ブラウザやスマホアプリ上で動く
- 見た目（デザイン）、インタラクション（クリック・入力）
- 言語：HTML / CSS / JavaScript（React, Vue, Next.js など）

**バックエンド** = サーバー側で動く部分

- ユーザーから見えない「処理エンジン」
- ビジネスロジック（決済計算、認証、権限管理）
- データベースとのやりとり
- 言語：Python, Node.js, Go, Ruby など

---

**例：ログイン機能の場合**

\`\`\`
フロント側の仕事:
  → ログインフォームを表示する
  → 入力値のバリデーション（メールアドレス形式チェック）
  → ボタンクリックでAPIを呼ぶ
  → ログイン成功後、ダッシュボードに遷移する

バックエンド側の仕事:
  → パスワードをハッシュ化して照合する
  → セッショントークン（JWT）を発行する
  → ユーザー情報をDBから取得する
\`\`\`

フロントが「見せ方」、バックが「実処理」を担当します。`,
        },
        {
          type: "interactive",
          id: "eng-frontend-backend",
        },
      ],
    },
    {
      id: "rendering",
      title: "SPA / SSR / SSG の違い",
      blocks: [
        {
          type: "text",
          content: `同じWebアプリでも、「HTMLをどこで生成するか」によって3種類のアーキテクチャがあります。

---

**SPA（Single Page Application）**

HTMLの空っぽのページだけをサーバーから受け取り、JavaScriptがブラウザ上でUIを組み立てます。

- 例：Gmail、Notion、Figma
- 特徴：初回ロードは遅いが、操作が速い（ページ遷移なし）
- SEO：苦手（検索エンジンがJSを実行しないと内容を読めない）

\`\`\`
ブラウザ → サーバー: HTMLください
サーバー → ブラウザ: <html><body><div id="app"></div></html>（空）
ブラウザ: JSを実行 → データをAPIで取得 → UIを構築
\`\`\`

---

**SSR（Server-Side Rendering）**

サーバーがリクエストのたびにHTMLを組み立てて返します。

- 例：ECサイトの商品ページ（在庫が常に変わる）
- 特徴：最新データを常に表示できる、SEO強い
- デメリット：サーバーに負荷がかかる

\`\`\`
ブラウザ → サーバー: /products/42 ください
サーバー: DBから商品データ取得 → HTML生成
サーバー → ブラウザ: 商品情報が入った完成HTML
\`\`\`

---

**SSG（Static Site Generation）**

ビルド時（デプロイ前）にHTMLを全部生成して、CDNに置きます。

- 例：ブログ、ドキュメントサイト、このサイト
- 特徴：超高速、SEO最強、サーバー不要
- デメリット：リアルタイム更新が苦手（再ビルドが必要）

\`\`\`
ビルド時: 全記事のHTMLを事前生成
ブラウザ → CDN: /blog/1 ください
CDN → ブラウザ: 静的HTML（爆速）
\`\`\``,
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
            question: "「パスワードの照合」はフロントとバック、どちらで行うべきか？",
            options: [
              "フロントエンド（ブラウザ上）で行う",
              "バックエンド（サーバー）で行う",
              "どちらでも同じ",
              "データベースが自動でやる",
            ],
            answer: 1,
            explanation: "パスワード照合は必ずバックエンドで行います。フロントでやるとJavaScriptを見れば誰でもロジックがわかってしまいます。セキュリティに関わる処理はすべてバックエンドです。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "リアルタイムで在庫数が変わるECサイトの商品ページに最も適したレンダリング方式は？",
            options: [
              "SSG（ビルド時にHTMLを生成）",
              "SSR（リクエストのたびにサーバーでHTML生成）",
              "どちらでも変わらない",
              "SPAが唯一の選択肢",
            ],
            answer: 1,
            explanation: "在庫は常に変わるのでSSGは不適切（再ビルドが必要）。SSRならリクエスト時にDBから最新在庫を取得してHTMLに埋め込めます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "SPAの「SPA」は何の略？",
            options: [
              "Server Page Application",
              "Single Page Application",
              "Static Page Architecture",
              "Secure Protocol API",
            ],
            answer: 1,
            explanation: "Single Page Application。1つのHTMLページの中でJavaScriptがDOMを書き換えることで、複数ページがあるように見せます。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：curl でSSRを体験する",
      blocks: [
        {
          type: "text",
          content: `curlでSSRサイトとSPAサイトの違いを体験してみましょう。

**SSRサイト（HTMLが充実している）：**
\`\`\`bash
curl -s https://www.wikipedia.org | head -50
\`\`\`
HTMLの中に実際のコンテンツ（テキスト）が含まれているのが確認できます。

**SPAサイト（HTMLがほぼ空）：**
\`\`\`bash
curl -s https://app.notion.so | head -30
\`\`\`
\`<div id="notion-app"></div>\` のような空のdivしかないはずです。コンテンツはJSが実行されて初めて表示されます。

**課題：** 自分がよく使うWebサービスにcurlを送って、HTMLが充実しているか（SSR）空っぽか（SPA）を確認してみてください。`,
        },
      ],
    },
  ],
};

export default lesson;
