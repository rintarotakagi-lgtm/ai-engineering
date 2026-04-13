import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "github-start",
  title: "GitHubを使ってみよう",
  subtitle: "アカウント作成からリポジトリ作成まで — クラウドでコードを共有",
  sections: [
    {
      id: "what-is-github",
      title: "GitHubとは",
      blocks: [
        {
          type: "text",
          content: `**Git**と**GitHub**は名前が似ていますが、別物です。

- **Git** — あなたのパソコン上で動くバージョン管理ツール（ソフトウェア）
- **GitHub** — Gitで管理したファイルをインターネット上に保存・共有できるサービス（Webサイト）

例えるなら：
- **Git** = カメラ（写真を撮る道具）
- **GitHub** = Googleフォト（写真をクラウドに保存・共有するサービス）

カメラがなくてもGoogleフォトは使えるし、Googleフォトがなくてもカメラは使えます。でも両方使うと最強です。

下の図で、GitとGitHubの関係を確認しましょう。`,
        },
        {
          type: "interactive",
          id: "git-vs-github",
        },
      ],
    },
    {
      id: "create-repo",
      title: "リポジトリの作成",
      blocks: [
        {
          type: "text",
          content: `GitHubでリポジトリを作成する手順を見てみましょう。

**手順：**
1. GitHubにログイン
2. 右上の「+」ボタン → 「New repository」をクリック
3. リポジトリ名を入力（例: \`my-first-repo\`）
4. 説明文を入力（任意）
5. Public（公開）か Private（非公開）を選択
6. 「Add a README file」にチェック
7. 「Create repository」をクリック

下のデモで、リポジトリ作成の流れをシミュレーションしてみましょう。`,
        },
        {
          type: "interactive",
          id: "repo-creator",
        },
      ],
    },
    {
      id: "readme",
      title: "READMEとは",
      blocks: [
        {
          type: "text",
          content: `**README（リードミー）**ファイルは、リポジトリの「表紙」です。GitHubでリポジトリを開くと、最初に表示されます。

READMEには通常、以下を書きます：
- **プロジェクトの説明** — これは何？
- **使い方** — どうやって使う？
- **セットアップ手順** — どうやって始める？
- **連絡先** — 困ったら誰に聞く？

READMEは**Markdown（マークダウン）**という書式で書きます。Markdownを使うと、簡単な記号で見出しや箇条書きが作れます。

下のエディタで、Markdownを書いてプレビューを確認してみましょう。`,
        },
        {
          type: "interactive",
          id: "readme-editor",
        },
      ],
    },
    {
      id: "clone",
      title: "クローン",
      blocks: [
        {
          type: "text",
          content: `**クローン（Clone）**は、GitHub上のリポジトリを自分のパソコンにコピーする操作です。

\`\`\`
git clone https://github.com/ユーザー名/リポジトリ名.git
\`\`\`

このコマンドを実行すると：
1. リポジトリの**全てのファイル**がダウンロードされる
2. **全ての変更履歴**も一緒にコピーされる
3. 自動的にGitHubとの**接続設定**が行われる

クローンは「ダウンロード」と似ていますが、違いは**変更履歴ごとコピーされる**こと。さらに、元のリポジトリとの接続が維持されるので、後から変更を送ったり受け取ったりできます。`,
        },
        {
          type: "interactive",
          id: "clone-demo",
        },
      ],
    },
    {
      id: "summary",
      title: "まとめ",
      blocks: [
        {
          type: "text",
          content: `このレッスンのポイント：

- **Git**はパソコン上のツール、**GitHub**はクラウドのサービス。別物だが組み合わせて使う
- GitHubで**リポジトリ**を作成し、プロジェクトの「家」を作る
- **README**はリポジトリの表紙。Markdownで書く
- **クローン**でGitHub上のリポジトリを自分のパソコンにコピーする
- 次のレッスンでは、clone → add → commit → push の基本ワークフローを学びます`,
        },
        {
          type: "quiz",
          data: {
            question: "GitとGitHubの違いについて正しいものはどれ？",
            options: [
              "GitとGitHubは同じものの別名である",
              "Gitはクラウドサービスで、GitHubはローカルツールである",
              "Gitはローカルのバージョン管理ツールで、GitHubはクラウドの共有サービスである",
              "GitHubがないとGitは使えない",
            ],
            answer: 2,
            explanation:
              "Gitはパソコン上で動くバージョン管理ツール、GitHubはGitで管理したファイルをクラウドに保存・共有できるWebサービスです。それぞれ独立して使えますが、組み合わせて使うのが一般的です。",
          },
        },
      ],
    },
  ],
};

export default lesson;
