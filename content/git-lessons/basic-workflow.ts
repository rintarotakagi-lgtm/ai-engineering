import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "basic-workflow",
  title: "基本ワークフロー",
  subtitle: "clone, add, commit, push の流れ — 日常のGit操作をマスター",
  sections: [
    {
      id: "overview",
      title: "全体の流れ",
      blocks: [
        {
          type: "text",
          content: `Gitの日常的な作業は、5つのステップの繰り返しです：

1. **clone** — GitHubからリポジトリをコピー（最初の1回だけ）
2. **edit** — ファイルを編集する（普通に作業する）
3. **add** — 変更したファイルをステージングエリアに追加
4. **commit** — ステージングエリアの内容を保存（スナップショット作成）
5. **push** — ローカルの変更をGitHubにアップロード

この流れを覚えれば、日常のGit操作はほぼカバーできます。下のアニメーションで全体像を確認しましょう。`,
        },
        {
          type: "interactive",
          id: "workflow-overview",
        },
      ],
    },
    {
      id: "git-add",
      title: "git add",
      blocks: [
        {
          type: "text",
          content: `\`git add\` は、変更したファイルをステージングエリアに追加するコマンドです。

\`\`\`
git add ファイル名        # 特定のファイルをステージング
git add .               # 全ての変更をステージング
\`\`\`

**なぜステージングが必要？**

「変更したファイル全部を一気に保存すればいいのでは？」と思うかもしれません。でも実際には、関連する変更だけをまとめて保存したいことがあります。

例えば、「ログイン画面のデザインを修正」と「メール通知のバグ修正」を同時にしていた場合、2つの別々のコミットに分けた方が履歴が分かりやすくなります。

下のデモで、ファイルをステージングする操作を体験しましょう。`,
        },
        {
          type: "interactive",
          id: "staging-demo",
        },
      ],
    },
    {
      id: "git-commit",
      title: "git commit",
      blocks: [
        {
          type: "text",
          content: `\`git commit\` は、ステージングエリアの内容をスナップショットとして保存するコマンドです。

\`\`\`
git commit -m "コミットメッセージ"
\`\`\`

**良いコミットメッセージのコツ：**

| NG | OK |
|---|---|
| ファイルを変更 | ログイン画面のバリデーションを追加 |
| 修正 | パスワードリセット時のエラーを修正 |
| update | 利用規約ページを2024年版に更新 |
| あああ | ヘッダーのレスポンシブ対応を実装 |

ポイントは**「何をしたか」が具体的に分かること**です。半年後の自分やチームメンバーが読んで理解できるメッセージを書きましょう。`,
        },
        {
          type: "interactive",
          id: "commit-demo",
        },
      ],
    },
    {
      id: "git-push",
      title: "git push",
      blocks: [
        {
          type: "text",
          content: `\`git push\` は、ローカル（自分のパソコン）のコミットをGitHub（リモート）にアップロードするコマンドです。

\`\`\`
git push origin main
\`\`\`

- **origin** — GitHubのリポジトリを指す名前（クローン時に自動設定）
- **main** — アップロード先のブランチ名

pushするまで、あなたの変更は**自分のパソコンの中だけ**にあります。pushして初めて、チームメンバーがあなたの変更を見ることができます。

**注意：** pushする前にcommitが必要です。commitしていない変更はpushできません。`,
        },
        {
          type: "interactive",
          id: "push-demo",
        },
      ],
    },
    {
      id: "git-pull",
      title: "git pull",
      blocks: [
        {
          type: "text",
          content: `\`git pull\` は、GitHub（リモート）の最新の変更をローカル（自分のパソコン）にダウンロードするコマンドです。

\`\`\`
git pull origin main
\`\`\`

チームで作業しているとき、他のメンバーがGitHubに変更をpushしていることがあります。\`git pull\` で、他の人の変更を自分のパソコンに取り込みます。

**ベストプラクティス：**
- 作業を始める前に \`git pull\` する習慣をつける
- 長時間作業した後のpush前にも \`git pull\` する
- こうすることで、変更の衝突（コンフリクト）を最小限にできる`,
        },
        {
          type: "interactive",
          id: "pull-demo",
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

- **git add** — 変更をステージングエリアに追加（保存するファイルを選ぶ）
- **git commit** — スナップショットを作成（変更を記録する）
- **git push** — ローカルの変更をGitHubにアップロード
- **git pull** — GitHubの変更をローカルにダウンロード
- 日常の流れ: **pull → edit → add → commit → push** の繰り返し
- コミットメッセージは具体的に書く`,
        },
        {
          type: "quiz",
          data: {
            question:
              "git addした後、git pushする前に必ず必要な操作はどれ？",
            options: [
              "git pull",
              "git commit",
              "git clone",
              "git branch",
            ],
            answer: 1,
            explanation:
              "git pushはコミットをGitHubにアップロードする操作です。pushする前にcommitが必要です。commitしていない変更はpushできません。流れは add → commit → push です。",
          },
        },
      ],
    },
  ],
};

export default lesson;
