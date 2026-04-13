import type { Lesson } from "@/lib/types";

const lesson8: Lesson = {
  slug: "troubleshooting",
  title: "トラブルシューティング",
  subtitle: "コンフリクト解消、やり直し方 — 困ったときの対処法",
  sections: [
    {
      id: "undo-map",
      title: "やり直し方の全体像",
      blocks: [
        {
          type: "text",
          content: `Gitを使っていると、「やり直したい」場面が必ず出てきます。でも慌てなくて大丈夫です。Gitは**ほとんどの操作をやり直せる**ように設計されています。

状況に応じて使うコマンドが違います：
- **まだコミットしていない変更を取り消したい** → git checkout / git restore
- **作業を一時的に退避したい** → git stash
- **コミットをやり直したい（ローカルのみ）** → git reset
- **共有済みのコミットを取り消したい** → git revert
- **特定のファイルを管理対象外にしたい** → .gitignore`,
        },
        {
          type: "text",
          content: `下のデモで、状況に応じたコマンドの選び方を確認しましょう。`,
        },
        {
          type: "interactive",
          id: "undo-map",
        },
      ],
    },
    {
      id: "stash",
      title: "git stash",
      blocks: [
        {
          type: "text",
          content: `**git stash**は、今の作業を**一時的に退避**するコマンドです。

こんなときに使います：
- 作業中にブランチを切り替える必要が出た
- まだコミットするほどではないけど、今の変更を保存したい

使い方：
- **git stash** — 現在の変更を退避（作業ディレクトリがきれいになる）
- **git stash pop** — 退避した変更を戻す
- **git stash list** — 退避した変更の一覧を見る

イメージとしては、**机の上の書類を引き出しにしまって、別の作業をして、また戻す**感じです。`,
        },
        {
          type: "text",
          content: `下のデモで、stashの動きを体験してみましょう。`,
        },
        {
          type: "interactive",
          id: "stash-demo",
        },
      ],
    },
    {
      id: "reset",
      title: "git reset",
      blocks: [
        {
          type: "text",
          content: `**git reset**は、コミットを**取り消す**コマンドです。**まだpushしていないコミット**に対して使います。

3つのモードがあります：
- **--soft** — コミットだけ取り消す。変更はステージングに残る
- **--mixed**（デフォルト） — コミットを取り消し、ステージングも解除。変更はファイルに残る
- **--hard** — コミットを取り消し、変更も完全に削除。**注意: 元に戻せない**

使い分け：
- 「コミットメッセージを間違えた」→ --soft で取り消して再コミット
- 「ステージングし直したい」→ --mixed
- 「全部なかったことにしたい」→ --hard（要注意）`,
        },
        {
          type: "text",
          content: `下のデモで、3つのリセットモードの違いを見てみましょう。`,
        },
        {
          type: "interactive",
          id: "reset-demo",
        },
      ],
    },
    {
      id: "revert",
      title: "git revert",
      blocks: [
        {
          type: "text",
          content: `**git revert**は、過去のコミットを**打ち消す新しいコミットを作る**コマンドです。

resetとの違い：
- **reset** — コミットを歴史から消す → **push済みのコミットには使えない**
- **revert** — 打ち消しコミットを追加する → **push済みでも安全に使える**

チーム開発では、**共有ブランチ（main等）の変更を取り消すときは必ずrevertを使います**。resetで歴史を書き換えると、他のメンバーの環境と矛盾が生じて大混乱になります。`,
        },
        {
          type: "text",
          content: `下のデモで、revertの動きを見てみましょう。`,
        },
        {
          type: "interactive",
          id: "revert-demo",
        },
      ],
    },
    {
      id: "gitignore",
      title: ".gitignore",
      blocks: [
        {
          type: "text",
          content: `**.gitignore**は、**Gitの管理対象から除外するファイル**を指定する設定ファイルです。

除外すべきファイル：
- **node_modules/** — パッケージ（npm installで復元できる）
- **.env** — 環境変数（パスワード等の機密情報）
- **build/** や **dist/** — ビルド成果物（毎回生成できる）
- **.DS_Store** — macOSのシステムファイル
- ***.log** — ログファイル

書き方：
- **ファイル名** — そのファイルを除外（例: .env）
- **ディレクトリ/** — そのフォルダごと除外（例: node_modules/）
- ***.拡張子** — 特定の拡張子を全て除外（例: *.log）
- **!ファイル名** — 除外ルールの例外（例: !important.log）`,
        },
        {
          type: "text",
          content: `下のデモで、.gitignoreのルールを作ってみましょう。`,
        },
        {
          type: "interactive",
          id: "gitignore-demo",
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

- **git stash** — 作業を一時退避（引き出しにしまうイメージ）
- **git reset** — ローカルのコミットを取り消す（soft/mixed/hardの3種類）
- **git revert** — 共有済みのコミットを安全に取り消す（新しいコミットで打ち消し）
- **.gitignore** — 管理不要なファイルを除外

これでGit/GitHubコースは完了です。基本操作からチーム開発まで、一通りの知識が身につきました。あとは実践あるのみです。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "すでにpush済みのコミットを取り消したいとき、使うべきコマンドは？",
            options: [
              "git reset --hard",
              "git revert",
              "git stash",
              "git branch -d",
            ],
            answer: 1,
            explanation:
              "push済みのコミットにはgit revertを使います。resetで歴史を書き換えると、他のメンバーの環境と矛盾が生じます。revertは打ち消しコミットを新たに作るので安全です。",
          },
        },
        {
          type: "quiz",
          data: {
            question:
              ".gitignoreに含めるべきファイルは？",
            options: [
              "index.html（メインのHTMLファイル）",
              "README.md（プロジェクトの説明）",
              ".env（パスワードなどの環境変数）",
              "app.js（アプリのメインコード）",
            ],
            answer: 2,
            explanation:
              ".envにはパスワードやAPIキーなどの機密情報が含まれるため、Gitに含めてはいけません。.gitignoreに追加して管理対象から除外します。",
          },
        },
      ],
    },
  ],
};

export default lesson8;
