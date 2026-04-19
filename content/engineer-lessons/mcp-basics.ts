import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "mcp-basics",
  title: "MCPの仕組み",
  subtitle: "MCPサーバーが何をしているか・公式MCPを接続する",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** MCPサーバーが何をしているか説明できる。Claude Codeに公式MCPサーバーを接続できる。

**所要時間：** 約25分

---

あなたがすでに使っているClaude Codeには、MCPサーバーを通じてNotionやGmailと連携する機能があります。

「なぜClaudeがNotionのデータを読めるの？」——その答えがMCPです。このレッスンを終えると、新しいMCPサーバーを自分で接続できるようになります。`,
        },
      ],
    },
    {
      id: "what-is-mcp",
      title: "MCPとは",
      blocks: [
        {
          type: "text",
          content: `**MCP（Model Context Protocol）** は、LLMと外部ツール・データソースを接続するためのオープンプロトコルです。2024年にAnthropicが公開しました。

---

**MCPのない世界：**

各アプリがLLMとの連携を独自に実装 → 無駄な重複・非互換

**MCPのある世界：**

標準化されたプロトコルで誰でもツールを接続できる。一度作ったMCPサーバーはどのMCP対応クライアントでも使える。

---

**MCPの構成要素：**

\`\`\`
MCPクライアント          MCPサーバー
(Claude Code,    ←──→  (Notion, Gmail,
 Cursor, IDE...)          GitHub, Slack...)
\`\`\`

- **MCPクライアント** : Claude Codeなど。MCPサーバーに接続して機能を使う
- **MCPサーバー** : 特定のサービスへの接続を提供するプログラム

---

**MCP vs Tool use の違い：**

| | Tool use | MCP |
|--|----------|-----|
| ツール定義の場所 | アプリのコード内 | 独立したMCPサーバー |
| 再利用性 | 同一アプリ内のみ | 複数クライアントで使える |
| 実装の複雑さ | シンプル | 標準プロトコルに従う |`,
        },
        {
          type: "interactive",
          id: "eng-mcp-arch",
        },
      ],
    },
    {
      id: "mcp-concepts",
      title: "MCPサーバーが提供するもの",
      blocks: [
        {
          type: "text",
          content: `MCPサーバーは3種類のものを提供できます。

---

**1. Tools（ツール）**

関数として実行できる操作。Tool useと同じ仕組みで、MCPサーバーが定義します。

\`\`\`json
// Notion MCPが提供するツール例
{
  "name": "notion-search",
  "description": "Notionのページを検索する",
  "inputSchema": {
    "query": "string",
    "limit": "number"
  }
}
\`\`\`

---

**2. Resources（リソース）**

読み取り専用のデータソース。ファイル、データベース、APIのレスポンスなど。

\`\`\`
file://~/Documents/notes.md
database://mydb/users
\`\`\`

---

**3. Prompts（プロンプトテンプレート）**

よく使うプロンプトのテンプレートを提供。

\`\`\`
/commit-message → コミットメッセージを生成するプロンプト
/code-review    → コードレビューを依頼するプロンプト
\`\`\`

---

**MCPの通信プロトコル：**

MCPはJSON-RPC 2.0を使ったシンプルなプロトコルです。

\`\`\`json
// クライアント → サーバー（ツール呼び出し）
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "notion-search",
    "arguments": {"query": "エンジニア採用"}
  }
}
\`\`\``,
        },
      ],
    },
    {
      id: "connect-mcp",
      title: "MCPサーバーを接続する",
      blocks: [
        {
          type: "text",
          content: `Claude Codeに公式MCPサーバーを接続してみましょう。

---

**Filesystem MCPサーバーを接続する（例）：**

\`\`\`bash
# claude_desktop_config.json を開く
# Mac: ~/.claude/claude_desktop_config.json
\`\`\`

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/your-name/Documents"
      ]
    }
  }
}
\`\`\`

---

**よく使う公式MCPサーバー：**

| サーバー | 提供する機能 |
|---------|------------|
| \`@modelcontextprotocol/server-filesystem\` | ローカルファイルの読み書き |
| \`@modelcontextprotocol/server-github\` | GitHubリポジトリの操作 |
| \`@modelcontextprotocol/server-slack\` | Slackメッセージの送受信 |
| \`@modelcontextprotocol/server-postgres\` | PostgreSQLへのクエリ |

---

**Claude Codeでの確認：**

接続後、Claude Codeに「利用可能なツールを教えて」と聞くか、\`/mcp\` コマンドで接続済みMCPサーバーが確認できます。`,
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
            question: "MCPが解決する主な問題は？",
            options: [
              "LLMの回答精度を上げる",
              "各ツールとLLMの接続を標準化し、誰でも再利用できるようにする",
              "APIのコストを下げる",
              "Pythonを不要にする",
            ],
            answer: 1,
            explanation: "MCPは「ツールとLLMの接続方法を標準化する」プロトコルです。一度MCPサーバーを作れば、Claude Code、Cursor、その他のMCP対応クライアントすべてで使えます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "MCPサーバーが提供できる3種類のものはどれ？",
            options: [
              "HTML、CSS、JavaScript",
              "Tools（ツール）、Resources（リソース）、Prompts（プロンプト）",
              "Input、Output、Memory",
              "System、User、Assistant",
            ],
            answer: 1,
            explanation: "MCPサーバーはTools（実行できる関数）、Resources（読み取れるデータ）、Prompts（プロンプトテンプレート）の3種類を提供できます。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "MCPクライアントとMCPサーバーの関係として正しいのは？",
            options: [
              "MCPクライアントがサービスを提供し、サーバーが使う",
              "MCPクライアント（Claude Codeなど）がMCPサーバー（Notion等）に接続して機能を使う",
              "両方が同じプログラム",
              "MCPサーバーはGitHubにしかない",
            ],
            answer: 1,
            explanation: "MCPクライアントは「使う側」（Claude Code、Cursorなど）、MCPサーバーは「機能を提供する側」（Notion、Gmail、GitHubなど）です。クライアントがサーバーに接続して、ツールやリソースを利用します。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：MCPサーバーを接続する",
      blocks: [
        {
          type: "text",
          content: `Claude Codeにファイルシステムのアクセスを追加するMCPサーバーを接続しましょう。

**ステップ1：Node.jsをインストール（未インストールの場合）**

\`\`\`bash
# nvmで管理する場合
brew install nvm
nvm install 20
\`\`\`

**ステップ2：Claude Codeの設定ファイルを開く**

\`\`\`bash
# Claude Codeの設定ファイルを開く
code ~/.claude/settings.json
\`\`\`

**ステップ3：MCPサーバーを追加**

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/あなたのユーザー名/Desktop"
      ]
    }
  }
}
\`\`\`

**ステップ4：Claude Codeを再起動して確認**

Claude Codeで「デスクトップにあるファイル一覧を教えて」と聞いてみましょう。filesystemツールを使って実際のファイルを返してくれるはずです。

**課題：** Claude Codeのチャットで「/mcp」と入力して、接続されているMCPサーバーの一覧を確認してみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
