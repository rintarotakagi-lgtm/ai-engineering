import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "git-concepts-eng",
  title: "Gitの概念（commit, branch, merge）",
  subtitle: "変更履歴の仕組みと基本コマンドをマスターする",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** commitとbranchとmergeの概念を図で説明できる。git add/commit/push/pull の基本コマンドが使える。

**所要時間：** 約25分

---

Gitを使わずにコードを書くことは、セーブなしでRPGをプレイするようなものです。

Claude Codeを使っていると自動でGitコマンドが走ることもありますが、何が起きているかを理解することで、「エンジニアへの指示」「コードレビュー依頼」「問題発生時の対処」がずっとスムーズになります。`,
        },
      ],
    },
    {
      id: "commit",
      title: "commit（コミット）",
      blocks: [
        {
          type: "text",
          content: `**commit** は「変更の記録（セーブポイント）」です。

\`\`\`bash
# 現在の状態を確認
git status

# ファイルをステージング（コミット対象に追加）
git add main.py
git add .          # 全ファイル

# コミット（変更を記録）
git commit -m "ユーザー認証機能を追加"
\`\`\`

---

**コミットには何が入るか：**

\`\`\`
commit a1b2c3d
Author: 田中太郎 <tanaka@example.com>
Date:   Mon Apr 19 10:30:00 2026

    ユーザー認証機能を追加

変更されたファイル:
  + auth.py         ← 新規追加
  ~ main.py         ← 変更
  - old_login.py    ← 削除
\`\`\`

- コミットには **一意のID（ハッシュ）** が付く
- **誰が・いつ・何を変えたか** が永久に記録される
- 過去のどのコミットにも \`git checkout <hash>\` で戻れる

---

**良いコミットメッセージ：**

\`\`\`bash
# NG: 何をしたかわからない
git commit -m "修正"
git commit -m "update"

# OK: 何を・なぜ変えたか
git commit -m "メール認証のバリデーションを強化"
git commit -m "APIレートリミット対応（1秒1リクエストに制限）"
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-commit-timeline",
        },
      ],
    },
    {
      id: "branch",
      title: "branch（ブランチ）",
      blocks: [
        {
          type: "text",
          content: `**branch** は「並行して作業できる分岐」です。

ゲームの「セーブデータをコピーして別ルートを試す」イメージです。本流（main）を汚さずに新機能を試せます。

\`\`\`bash
# ブランチ一覧を確認
git branch

# 新しいブランチを作って切り替え
git checkout -b feature/user-auth

# 別のブランチに切り替え
git checkout main
\`\`\`

---

**ブランチの流れ：**

\`\`\`
main:     A ── B ── C ────────────── F (merge)
                     \\              /
feature:              D ── E ────────
\`\`\`

1. \`main\` から \`feature/user-auth\` ブランチを作る
2. feature ブランチで新機能を開発（コミットD, E）
3. mainブランチに戻ってマージ（F）

---

**ブランチ命名の慣例：**

\`\`\`
feature/xxx  → 新機能開発
fix/xxx      → バグ修正
hotfix/xxx   → 緊急修正
release/x.x  → リリース準備
\`\`\``,
        },
      ],
    },
    {
      id: "remote",
      title: "GitHubとリモートリポジトリ",
      blocks: [
        {
          type: "text",
          content: `**GitHub** は「Gitのリポジトリをクラウドで共有するサービス」です。

\`\`\`bash
# リモートリポジトリにpush（アップロード）
git push origin main

# リモートの変更をpull（ダウンロード・反映）
git pull origin main

# リポジトリをclone（コピーをダウンロード）
git clone https://github.com/user/repo.git
\`\`\`

---

**ローカルとリモートの関係：**

\`\`\`
【あなたのPC】            【GitHub】
  local repo  ──push──→  remote repo
              ←──pull──
\`\`\`

- **push** : ローカルの変更をGitHubに送る
- **pull** : GitHubの変更をローカルに取り込む
- **clone** : GitHubのリポジトリをローカルにコピー

---

**基本ワークフロー：**

\`\`\`bash
git pull origin main          # 最新を取得
# ... コードを編集 ...
git add .
git commit -m "機能を追加"
git push origin feature/xxx   # GitHubに送る
# → GitHub上でPull Requestを作成
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
            question: "「git add」の役割はどれ？",
            options: [
              "変更を記録（保存）する",
              "コミットに含めるファイルをステージングする",
              "GitHubにアップロードする",
              "新しいブランチを作る",
            ],
            answer: 1,
            explanation: "git addはコミット前の「準備」です。変更したファイルの中から「今回のコミットに含めるもの」を選んでステージングします。git commitで初めて記録されます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "本番環境のコードを壊さずに新機能を開発するための正しいアプローチは？",
            options: [
              "mainブランチで直接開発する",
              "featureブランチを作って、完成後にmainにマージする",
              "別のGitHubアカウントを使う",
              "コードをコピーして別フォルダで開発する",
            ],
            answer: 1,
            explanation: "featureブランチを使うことで、mainブランチ（本番コード）を守りながら新機能を開発できます。完成・レビュー後にmainにマージします。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "「git push origin feature/login」の意味は？",
            options: [
              "originというブランチをfeature/loginにコピーする",
              "feature/loginブランチの変更をGitHub（origin）にアップロードする",
              "GitHubからfeature/loginをダウンロードする",
              "feature/loginブランチを削除する",
            ],
            answer: 1,
            explanation: "git push [リモート名] [ブランチ名] は「ローカルの指定ブランチをリモート（GitHub）に送る」コマンドです。originはGitHubリポジトリの別名です。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：Gitを初期化して最初のコミット",
      blocks: [
        {
          type: "text",
          content: `先ほど作ったPythonプロジェクトにGitを導入しましょう。

\`\`\`bash
# プロジェクトフォルダへ移動
cd ~/Desktop/my-first-project

# Gitリポジトリを初期化
git init

# .gitignoreを作成（uvの仮想環境などをGit管理外にする）
echo ".venv/" > .gitignore
echo "__pycache__/" >> .gitignore
echo ".env" >> .gitignore

# 全ファイルをステージング
git add .

# 最初のコミット
git commit -m "初期セットアップ"

# コミット履歴を確認
git log --oneline
\`\`\`

**課題：** hello.py に1行追加（コメントでも可）してから、git addとgit commitを実行してください。その後git log --onelineで2つのコミットが表示されることを確認しましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
