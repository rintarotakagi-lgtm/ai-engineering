import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "github-pr",
  title: "GitHub・PR・レビューフロー",
  subtitle: "リポジトリ作成・push・PR作成・マージ",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** GitHubにリポジトリを作り、pushして、Pull Requestを作成・マージできる。エンジニアとのレビューフローに乗れる。

**所要時間：** 約25分

---

Pull Request（PR）はエンジニアのコラボレーションの中心です。「このコードをmainに取り込んでいいですか？」という提案と、それに対するレビューのやりとりが全部GitHubに残ります。

ディレクターとしてPRのタイトルや説明を読めること、コメントを残せること、これだけでエンジニアとの信頼関係が変わります。`,
        },
      ],
    },
    {
      id: "create-repo",
      title: "GitHubリポジトリを作る",
      blocks: [
        {
          type: "text",
          content: `**GitHubでリポジトリを作成する手順：**

1. [github.com](https://github.com) にログイン
2. 右上の「+」→「New repository」
3. 設定：
   - Repository name: \`my-first-project\`
   - Public / Private を選択
   - 「Add a README file」はチェックしない（既存プロジェクトをpushするため）
4. 「Create repository」をクリック

---

**ローカルとGitHubを接続する：**

\`\`\`bash
# 作成したGitHubリポジトリのURLを登録
git remote add origin https://github.com/[あなたのユーザー名]/my-first-project.git

# リモートが登録されたか確認
git remote -v

# GitHubにpush
git push -u origin main
# -u はデフォルトのリモートを設定（2回目以降は git push だけで動く）
\`\`\`

GitHubのリポジトリページを開くとコードが表示されているはずです。`,
        },
      ],
    },
    {
      id: "pull-request",
      title: "Pull Requestを作る",
      blocks: [
        {
          type: "text",
          content: `**Pull Request（PR）** は「このブランチの変更をmainに取り込んでください」という提案です。

**ステップ1：featureブランチで作業**

\`\`\`bash
# 新機能用ブランチを作成
git checkout -b feature/add-greeting

# ファイルを変更（hello.pyに関数を追加するなど）
# ... 編集 ...

git add .
git commit -m "あいさつ関数を追加"
git push origin feature/add-greeting
\`\`\`

**ステップ2：GitHubでPRを作成**

1. GitHubリポジトリページを開く
2. 「Compare & pull request」ボタンをクリック
3. PRのタイトルと説明を書く
4. 「Create pull request」

---

**良いPRの説明文：**

\`\`\`markdown
## 変更内容
ユーザーへのあいさつ機能を追加しました。

## 変更理由
ウェルカムメッセージが表示されると離脱率が下がるため。

## テスト方法
1. uv run main.py を実行
2. "こんにちは、田中さん！" が表示されることを確認

## スクリーンショット
（あれば）
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-pr-flow",
        },
      ],
    },
    {
      id: "review",
      title: "レビューとマージ",
      blocks: [
        {
          type: "text",
          content: `**コードレビュー** はPRに対して他のメンバーがコメントするプロセスです。

---

**GitHubのレビューコメントの読み方：**

\`\`\`
🔴 Changes requested（要修正）
✅ Approved（承認）
💬 Commented（コメントのみ）
\`\`\`

**レビューコメントの例：**

\`\`\`
+ def greet(name):
+     return f"こんにちは、{name}!"

レビュアー: 感嘆符は全角「！」に統一しませんか？
\`\`\`

---

**マージの方法：**

GitHubには3種類のマージ方法があります：

| 方法 | 説明 | 使いどき |
|------|------|----------|
| Merge commit | ブランチ全コミット + マージコミット | 履歴を詳しく残したい |
| Squash and merge | 全コミットを1つにまとめてmerge | WIPコミットをきれいにしたい |
| Rebase and merge | ブランチのコミットをmainの先頭に並べる | 線形な履歴を保ちたい |

チームで統一することが重要です。

---

**マージ後のブランチ削除：**

\`\`\`bash
# リモートブランチを削除（GitHubのボタンでもOK）
git push origin --delete feature/add-greeting

# ローカルブランチを削除
git branch -d feature/add-greeting
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
            question: "Pull Requestを作る目的として最も正しいのはどれ？",
            options: [
              "コードを直接mainブランチに書くため",
              "featureブランチの変更をレビューしてもらい、mainに取り込むため",
              "GitHubにログインするため",
              "バグを自動修正するため",
            ],
            answer: 1,
            explanation: "PRは「このブランチをmainに取り込む前に、チームでレビューする」ためのプロセスです。コードの品質を保ち、知識を共有し、問題を早期発見できます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "「git push -u origin main」の \"-u\" フラグの意味は？",
            options: [
              "強制的にpushする",
              "upstream（デフォルトリモート）を設定する",
              "ブランチを削除する",
              "URLを変更する",
            ],
            answer: 1,
            explanation: "-u（--set-upstream）は「このブランチのデフォルトリモートをorigin/mainに設定する」フラグです。設定後は git push だけで同じ操作ができます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "「Squash and merge」を使う主なメリットは？",
            options: [
              "コードが圧縮されてファイルサイズが小さくなる",
              "featureブランチの複数コミットを1つにまとめてmainをきれいにできる",
              "自動テストが実行される",
              "コンフリクトが自動解消される",
            ],
            answer: 1,
            explanation: "Squash mergeはfeatureブランチの「作業中の細かいコミット」をまとめて1つのコミットにします。mainブランチの履歴がすっきりします。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：最初のPRを作る",
      blocks: [
        {
          type: "text",
          content: `実際にPRを作成してマージするまでやってみましょう。

\`\`\`bash
# 1. featureブランチを作成
git checkout -b feature/add-readme

# 2. README.md を編集（プロジェクトの説明を書く）
cat > README.md << 'EOF'
# My First Project

Pythonの学習プロジェクト。

## 使い方
\`\`\`bash
uv run hello.py
\`\`\`
EOF

# 3. コミット
git add README.md
git commit -m "README.mdを追加"

# 4. GitHubにpush
git push origin feature/add-readme
\`\`\`

**GitHubでPRを作成：**
1. リポジトリページの「Compare & pull request」をクリック
2. タイトル：「README.mdを追加」
3. 説明：「プロジェクトの説明と使い方を追記」
4. 「Create pull request」→「Merge pull request」→「Confirm merge」

**課題：** マージ後、\`git checkout main\` してから \`git pull\` を実行して、ローカルのmainにREADME.mdが反映されていることを確認してください。`,
        },
      ],
    },
  ],
};

export default lesson;
