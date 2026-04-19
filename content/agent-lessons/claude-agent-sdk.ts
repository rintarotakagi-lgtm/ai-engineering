import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "claude-agent-sdk",
  title: "Claude Agent SDK",
  subtitle: "Anthropic公式のエージェント構築SDK — 実践的なツールキット",
  sections: [
    {
      id: "overview",
      title: "SDKの概要",
      blocks: [
        {
          type: "text",
          content: `**Claude Agent SDK**は、Anthropicが提供するエージェント構築のための公式SDKです。Python版とTypeScript版があり、プロダクション環境でのエージェント開発に必要な機能が揃っています。

### SDKが解決する問題

エージェントをゼロから作ると、以下を全て自分で実装する必要があります：

- エージェントループの実装
- ツールの登録・実行管理
- エラーハンドリング・リトライ
- 権限管理（危険なコマンドのブロック）
- セッション管理（長い会話の維持）

Claude Agent SDKは、これらを**すぐに使えるコンポーネント**として提供します。下のデモでSDKのアーキテクチャを確認しましょう。`,
        },
        {
          type: "interactive",
          id: "sdk-architecture",
        },
      ],
    },
    {
      id: "builtin-tools",
      title: "組み込みツール",
      blocks: [
        {
          type: "text",
          content: `Claude Agent SDKには、すぐに使える**組み込みツール**が含まれています。エージェントにコンピュータ操作能力を与えるための基本ツールセットです。

これらのツールは、前のレッスンで学んだツール設計のベストプラクティスに従って設計されています。名前が明確で、説明が詳細で、パラメータが型付けされています。

各ツールをクリックして、入出力の例を確認しましょう。`,
        },
        {
          type: "interactive",
          id: "builtin-tools-demo",
        },
      ],
    },
    {
      id: "hooks",
      title: "フックシステム",
      blocks: [
        {
          type: "text",
          content: `**フック（Hook）**は、ツール実行の前後に独自のロジックを差し込む仕組みです。これにより、エージェントの動作をカスタマイズできます。

### フックの種類

- **PreToolUse** — ツール実行の**前**に呼ばれる。バリデーションやアクセス制御に使う
- **PostToolUse** — ツール実行の**後**に呼ばれる。結果の加工やログ記録に使う
- **Stop** — エージェント停止時に呼ばれる。クリーンアップに使う

### 実用例

\`\`\`typescript
// 危険なコマンドをブロックするフック
const safetyHook: PreToolUseHook = {
  name: "block-dangerous-commands",
  async run(toolName, toolInput) {
    if (toolName === "bash" && toolInput.command.includes("rm -rf")) {
      return { decision: "block", message: "危険なコマンドがブロックされました" };
    }
    return { decision: "allow" };
  }
};
\`\`\`

下のデモで、フックがどのタイミングで実行されるか確認しましょう。`,
        },
        {
          type: "interactive",
          id: "hooks-demo",
        },
      ],
    },
    {
      id: "permissions",
      title: "権限管理",
      blocks: [
        {
          type: "text",
          content: `エージェントにツールを渡すということは、**コンピュータの操作権限を渡す**ということです。安全に運用するには、適切な権限管理が不可欠です。

### パーミッションモード

Claude Agent SDKには3つのパーミッションモードがあります：

| モード | 説明 | 用途 |
|--------|------|------|
| **allowlist** | 許可リストのツールだけ使える | 本番環境。最も安全 |
| **blocklist** | ブロックリスト以外のツールが使える | 開発環境 |
| **prompt** | 実行前にユーザーに確認する | デバッグ・テスト |

### allowed_tools の設定例

\`\`\`typescript
const agent = new Agent({
  tools: [read, write, bash, search],
  allowedTools: ["read", "search"], // readとsearchだけ許可
});
\`\`\`

### 多層防御の原則

権限管理は**1つの仕組みだけに頼らない**ことが重要です：

1. **SDKレベル** — allowed_tools で使えるツールを制限
2. **フックレベル** — PreToolUseフックで危険な操作をブロック
3. **環境レベル** — サンドボックスやDockerコンテナで実行
4. **ネットワークレベル** — 外部通信を制限`,
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

- **Claude Agent SDK**はエージェントループ・ツール管理・権限制御をまとめて提供
- **組み込みツール**（Read, Write, Bash, Searchなど）でコンピュータ操作が可能
- **フックシステム**でツール実行前後にカスタムロジックを挿入できる
- **権限管理**は多層防御（SDK + フック + 環境 + ネットワーク）が基本
- 次のレッスンでは、複数のエージェントを連携させる**マルチエージェント**を学びます`,
        },
        {
          type: "quiz",
          data: {
            question:
              "Claude Agent SDKのフックシステムで、危険なコマンドをブロックするのに使うフックはどれ？",
            options: [
              "PostToolUse — ツール実行後にエラーを返す",
              "PreToolUse — ツール実行前にブロック判定する",
              "Stop — エージェント停止時にロールバックする",
              "OnError — エラー発生時に自動修復する",
            ],
            answer: 1,
            explanation:
              "PreToolUseフックはツール実行の「前」に呼ばれるため、危険なコマンドを実行前にブロックできます。PostToolUseだと既に実行された後なので手遅れです。",
          },
        },
      ],
    },
  ],
};

export default lesson;
