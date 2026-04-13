import type { Lesson } from "@/lib/types";

const lesson7: Lesson = {
  slug: "team-workflow",
  title: "チーム開発のワークフロー",
  subtitle: "Git Flow, GitHub Flow — チームのルールを決めよう",
  sections: [
    {
      id: "why-workflow",
      title: "なぜワークフローが必要か",
      blocks: [
        {
          type: "text",
          content: `Gitの操作方法を知っていても、チームで**ルールなし**に開発すると混乱します。

- 誰かがmainに直接pushして本番が壊れる
- ブランチの名前がバラバラで何が何だかわからない
- レビューなしでマージされてバグが入り込む

こうした問題を防ぐために、チームで**「こうやって開発しましょう」**というルール（ワークフロー）を決めます。`,
        },
        {
          type: "text",
          content: `下のデモで、ルールなしの開発がどうなるか見てみましょう。`,
        },
        {
          type: "interactive",
          id: "chaos-demo",
        },
      ],
    },
    {
      id: "github-flow",
      title: "GitHub Flow",
      blocks: [
        {
          type: "text",
          content: `**GitHub Flow**は、最もシンプルで広く使われているワークフローです。ルールはたった6つ：

1. **mainブランチは常にデプロイ可能**（壊れていない状態を保つ）
2. **作業はブランチを作って行う**（mainは直接触らない）
3. **定期的にpushする**（進捗の共有 + バックアップ）
4. **PRを作成してレビューを依頼**する
5. **レビューが通ったらmainにマージ**する
6. **マージしたらすぐデプロイ**する

小〜中規模のチーム、Webアプリの開発に最適です。迷ったらまずこれを使いましょう。`,
        },
        {
          type: "text",
          content: `下のデモで、GitHub Flowの流れをアニメーションで見てみましょう。`,
        },
        {
          type: "interactive",
          id: "github-flow-demo",
        },
      ],
    },
    {
      id: "git-flow",
      title: "Git Flow",
      blocks: [
        {
          type: "text",
          content: `**Git Flow**は、より厳密なワークフローです。ブランチの種類が多く、大規模プロジェクト向けです。

ブランチの種類：
- **main** — 本番リリース用。タグ（バージョン番号）をつける
- **develop** — 開発の統合ブランチ。次のリリースに入る変更をまとめる
- **feature/** — 新機能の開発用（developから分岐）
- **release/** — リリース準備用（developから分岐、main+developにマージ）
- **hotfix/** — 本番の緊急修正用（mainから分岐、main+developにマージ）

GitHub Flowとの違い：
- **リリースサイクルが決まっている**プロジェクト向け
- **複数バージョンの管理**が必要な場合に有効
- 小さなチームには**やや複雑**`,
        },
        {
          type: "text",
          content: `下のデモで、Git Flowの全体像を見てみましょう。`,
        },
        {
          type: "interactive",
          id: "git-flow-demo",
        },
      ],
    },
    {
      id: "naming",
      title: "ブランチ命名規則",
      blocks: [
        {
          type: "text",
          content: `ブランチ名には**チームで統一したルール**を作りましょう。

よく使われるパターン：
- **feature/機能名** — 新機能（例: feature/add-login）
- **fix/修正内容** — バグ修正（例: fix/header-layout）
- **hotfix/緊急修正** — 本番の緊急対応（例: hotfix/security-patch）
- **docs/対象** — ドキュメント更新（例: docs/api-reference）

NGなブランチ名：
- **test** — 何のテストかわからない
- **my-branch** — 誰の何の作業かわからない
- **fix** — 何を修正するかわからない
- **aaa** — 論外`,
        },
        {
          type: "text",
          content: `下のデモで、良いブランチ名と悪いブランチ名を練習してみましょう。`,
        },
        {
          type: "interactive",
          id: "naming-demo",
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

- ワークフロー = **チーム開発の交通ルール**
- **GitHub Flow** — シンプルで始めやすい（まずはこれ）
- **Git Flow** — 厳密なリリース管理が必要な大規模プロジェクト向け
- **ブランチ命名規則**で「何の作業か」を一目でわかるようにする`,
        },
        {
          type: "quiz",
          data: {
            question:
              "小〜中規模のWebアプリ開発で、最初に導入すべきワークフローは？",
            options: [
              "Git Flow（厳密な管理が安心）",
              "GitHub Flow（シンプルで始めやすい）",
              "ワークフローなし（自由にやる方が早い）",
              "独自のワークフローを最初から作る",
            ],
            answer: 1,
            explanation:
              "GitHub Flowはシンプルで理解しやすく、小〜中規模のチームに最適です。まずはこれで始めて、必要に応じてルールを追加していきましょう。",
          },
        },
        {
          type: "quiz",
          data: {
            question:
              "ブランチ名として最も適切なものは？",
            options: [
              "my-work",
              "fix",
              "feature/add-user-search",
              "branch1",
            ],
            answer: 2,
            explanation:
              "feature/add-user-search は「種類/内容」の形式で、新機能の追加であること、ユーザー検索機能であることが一目でわかります。",
          },
        },
      ],
    },
  ],
};

export default lesson7;
