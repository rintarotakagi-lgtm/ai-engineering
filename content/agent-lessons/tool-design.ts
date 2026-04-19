import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "tool-design",
  title: "ツール設計",
  subtitle: "エージェントのUIデザイン — 良いツールが良いエージェントを作る",
  sections: [
    {
      id: "why-tool-design",
      title: "なぜツール設計が重要か",
      blocks: [
        {
          type: "text",
          content: `Anthropicは「**ツール設計はUIデザインと同じくらい重要**」と言っています。なぜでしょうか？

人間がアプリを使うとき、ボタンの配置やラベルが分かりにくいと操作を間違えます。同じように、LLMがツールを使うとき、ツールの名前や説明が曖昧だと、正しいツールを選べなかったり、間違ったパラメータを渡してしまいます。

### 悪いツール設計の例

\`\`\`
ツール名: do_stuff
説明: Does things
パラメータ: data (any)
\`\`\`

これでは何をするツールなのか、LLMにも人間にも分かりません。

### 良いツール設計の例

\`\`\`
ツール名: search_files
説明: 指定ディレクトリ以下のファイルを正規表現パターンで検索し、
      マッチした行を返す。大きなコードベースでの調査に最適。
パラメータ:
  - pattern (string, 必須): 検索する正規表現パターン
  - directory (string, 任意): 検索開始ディレクトリ。デフォルト: "."
  - file_type (string, 任意): ファイル種別フィルタ（例: "ts", "py"）
\`\`\`

名前だけで何をするか分かり、説明で使いどころが分かり、パラメータの型と意味が明確です。`,
        },
        {
          type: "interactive",
          id: "tool-spec-demo",
        },
      ],
    },
    {
      id: "best-practices",
      title: "ベストプラクティス",
      blocks: [
        {
          type: "text",
          content: `Anthropicが推奨するツール設計のベストプラクティスをまとめます。

### 1. 明確な命名
- 動詞 + 名詞の組み合わせ: \`search_files\`, \`create_issue\`, \`read_document\`
- 曖昧な名前を避ける: \`do_action\`, \`process\`, \`handle\`

### 2. 詳細な説明（description）
- **何をするか**だけでなく、**いつ使うべきか**も書く
- エッジケースや制限事項を明記する
- 良い例: 「テキストファイルの内容を読み取る。バイナリファイルには使えない。最大10MBまで」

### 3. 型付きパラメータ
- 各パラメータに型（string, number, boolean）を指定
- 必須/任意を明示
- enumで選択肢を限定できる場合は限定する

### 4. エラーメッセージ
- 何が悪かったか具体的に伝える
- 悪い例: \`"Error"\`
- 良い例: \`"File not found: /path/to/file.txt. Did you mean /path/to/files.txt?"\`

次のインタラクティブデモで、ツール設計の問題点を見つける練習をしましょう。`,
        },
        {
          type: "interactive",
          id: "tool-design-quiz",
        },
      ],
    },
    {
      id: "format",
      title: "フォーマットの工夫",
      blocks: [
        {
          type: "text",
          content: `ツールの**出力フォーマット**も重要な設計ポイントです。LLMが結果を理解しやすい形で返す必要があります。

### 構造化データを返す

人間向けのフォーマット（Markdownの表など）ではなく、LLMが解析しやすい構造化データを返しましょう。

**良くない例（整形済みテキスト）:**
\`\`\`
=== 検索結果 ===
ファイル: src/index.ts (3件)
  L10: import { Agent } from './agent'
  L25: const agent = new Agent()
  L42: agent.run()
---
合計: 3件のマッチ
\`\`\`

**良い例（構造化データ）:**
\`\`\`json
{
  "matches": [
    {"file": "src/index.ts", "line": 10, "content": "import { Agent } from './agent'"},
    {"file": "src/index.ts", "line": 25, "content": "const agent = new Agent()"},
    {"file": "src/index.ts", "line": 42, "content": "agent.run()"}
  ],
  "total": 3
}
\`\`\`

### ポイント
- 装飾（罫線、区切り線など）は不要 — トークンの無駄
- ステータス情報（成功/失敗、件数）を含める
- 大量のデータは要約やページネーションで制限する`,
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

- ツール設計は**Agent-Computer Interface** — LLMとコンピュータの接点
- **明確な命名・詳細な説明・型付きパラメータ**が良いツールの条件
- ツールの出力は**構造化データ**で返す（装飾テキストではなく）
- 悪いツール設計 → エージェントの性能低下、余計なリトライ、コスト増加
- 次のレッスンでは、これらのベストプラクティスを実装した**Claude Agent SDK**を学びます`,
        },
        {
          type: "quiz",
          data: {
            question:
              "ツールの出力フォーマットとして最も適切なものはどれ？",
            options: [
              "Markdownの表で見やすく整形したテキスト",
              "JSON形式の構造化データ",
              "自然言語の文章で説明したテキスト",
              "CSV形式のテキスト",
            ],
            answer: 1,
            explanation:
              "LLMがツールの結果を解析しやすいように、JSON形式などの構造化データで返すのがベストプラクティスです。装飾テキストはトークンの無駄になり、自然言語は解析が不安定になります。",
          },
        },
      ],
    },
  ],
};

export default lesson;
