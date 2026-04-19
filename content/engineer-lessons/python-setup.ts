import type { Lesson } from "@/lib/types";

const lesson: Lesson = {
  slug: "python-setup",
  title: "環境構築（uv + Python 3.12）",
  subtitle: "uvでプロジェクト作成・依存追加・スクリプト実行の流れをマスターする",
  sections: [
    {
      id: "intro",
      title: "このレッスンのゴール",
      blocks: [
        {
          type: "text",
          content: `**ゴール：** \`uv\`でPythonプロジェクトを作成し、依存ライブラリを追加し、スクリプトを実行できる。

**所要時間：** 約30分

---

「環境構築でつまずいてプログラミング挫折」は非常によくあるパターンです。このレッスンでは最もスムーズな現代的セットアップ方法を伝えます。

**なぜuvを使うか？**

uvはRust製のPythonパッケージマネージャーで、従来の\`pip\` + \`venv\` + \`pyenv\`の組み合わせを1つのツールで解決します。爆速で、シンプルで、Claude Codeとの相性も最高です。`,
        },
      ],
    },
    {
      id: "install",
      title: "uvのインストール",
      blocks: [
        {
          type: "text",
          content: `**ステップ1：uvをインストールする**

macOSのターミナルで以下を実行：

\`\`\`bash
curl -LsSf https://astral.sh/uv/install.sh | sh
\`\`\`

インストール後、シェルを再起動（またはターミナルを開き直す）：

\`\`\`bash
source ~/.zshrc
\`\`\`

バージョン確認：

\`\`\`bash
uv --version
\`\`\`

\`uv 0.x.x\` と表示されれば成功です。

---

**uvのコマンド体系（全部覚える必要なし）：**

\`\`\`
uv init       → プロジェクト作成
uv add        → ライブラリ追加
uv run        → スクリプト実行
uv sync       → 依存関係をインストール
uv python     → Pythonバージョン管理
\`\`\``,
        },
        {
          type: "interactive",
          id: "eng-terminal-sim",
        },
      ],
    },
    {
      id: "project",
      title: "最初のプロジェクトを作る",
      blocks: [
        {
          type: "text",
          content: `**ステップ2：プロジェクトを作成する**

\`\`\`bash
# 作業フォルダに移動
cd ~/Desktop

# プロジェクト作成
uv init my-first-project

# プロジェクトフォルダへ移動
cd my-first-project
\`\`\`

作成されたフォルダ構造：

\`\`\`
my-first-project/
├── .python-version    ← Pythonのバージョン指定
├── pyproject.toml     ← プロジェクト設定ファイル
├── README.md
└── hello.py           ← サンプルスクリプト
\`\`\`

**ステップ3：スクリプトを実行する**

\`\`\`bash
uv run hello.py
\`\`\`

\`Hello from my-first-project!\` と表示されれば成功。

---

**ステップ4：ライブラリを追加する**

\`\`\`bash
uv add requests
\`\`\`

\`pyproject.toml\` に \`requests\` が追記されます。これがPythonプロジェクトの「依存関係の記録」です。`,
        },
      ],
    },
    {
      id: "pyproject",
      title: "pyproject.tomlを理解する",
      blocks: [
        {
          type: "text",
          content: `\`pyproject.toml\` はプロジェクトの「設計書」です。

\`\`\`toml
[project]
name = "my-first-project"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "requests>=2.31.0",
]
\`\`\`

- \`name\` : プロジェクト名
- \`requires-python\` : 必要なPythonのバージョン
- \`dependencies\` : 使うライブラリの一覧

---

**なぜこれが重要か：**

このファイルさえあれば、どのPC・サーバーでも同じ環境を再現できます。

\`\`\`bash
# 別のPCでセットアップ
git clone ...
uv sync  # ← これだけで全依存関係がインストールされる
\`\`\`

Gitで共有したプロジェクトを、他の人が動かすのに必要なのは \`uv sync\` の1コマンドだけです。`,
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
            question: "uvで新しいライブラリ（例：pandas）を追加するコマンドはどれ？",
            options: [
              "uv install pandas",
              "uv add pandas",
              "pip install pandas",
              "uv import pandas",
            ],
            answer: 1,
            explanation: "uvでライブラリを追加するのは「uv add パッケージ名」です。pip installは古い方法で、uvを使う場合は不要です。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "pyproject.tomlの主な役割は？",
            options: [
              "Pythonのインストール設定",
              "プロジェクトの依存関係や設定を記録するファイル",
              "実行するPythonスクリプト",
              "データベースの接続設定",
            ],
            answer: 1,
            explanation: "pyproject.tomlはプロジェクトの「設計書」。どのライブラリが必要か、Pythonのバージョンは何かを記録し、他の人が同じ環境を再現できるようにします。",
          },
        },
        {
          type: "quiz",
          data: {
            question: "uvを使うメリットとして最も適切なのはどれ？",
            options: [
              "JavaScriptも使えるようになる",
              "pip/venv/pyenvの機能を1つのツールで解決できる",
              "コードが自動的に書かれる",
              "クラウドに自動でデプロイされる",
            ],
            answer: 1,
            explanation: "uvはパッケージ管理（pip）・仮想環境（venv）・Pythonバージョン管理（pyenv）を1つに統合したツールです。これらを別々に設定していた手間がなくなります。",
          },
        },
      ],
    },
    {
      id: "handson",
      title: "ハンズオン：最初のPythonスクリプト",
      blocks: [
        {
          type: "text",
          content: `先ほど作ったプロジェクトで、requestsを使うスクリプトを書いてみましょう。

**hello.pyの中身を書き換える：**

\`\`\`python
import requests

response = requests.get("https://httpbin.org/json")
data = response.json()
print(data)
\`\`\`

**実行：**

\`\`\`bash
uv run hello.py
\`\`\`

JSONデータが表示されれば成功です。

**課題：** \`response.status_code\` をprintして、ステータスコード（200）が表示されることを確認してください。また、\`response.headers\` も表示して、サーバーからのヘッダー情報を見てみましょう。`,
        },
      ],
    },
  ],
};

export default lesson;
