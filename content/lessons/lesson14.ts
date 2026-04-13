import type { Lesson } from "@/lib/types";

const lesson14: Lesson = {
  slug: "rlhf",
  title: "RLHF・Constitutional AI",
  subtitle:
    "人間のフィードバックと憲法的AIで、大規模言語モデルを「有用で安全なアシスタント」に仕上げるアラインメント技術",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `事前学習を終えたLLMは、膨大な知識を持っています。しかし、そのままでは**有用なアシスタント**にはなりません。

なぜでしょうか？

- 事前学習は「次のトークンを予測する」だけの学習
- 「ユーザーの質問に丁寧に答える」ことは学んでいない
- 有害な内容、嘘、偏見をそのまま出力する可能性がある

$$\\text{Pre-trained LLM} \\neq \\text{Useful Assistant}$$

この**ギャップを埋める**のが**アラインメント（Alignment）**です。

アラインメントの3つの目標：
- **Helpful（有用）** — ユーザーの意図を理解し、役立つ回答をする
- **Harmless（無害）** — 有害・危険な内容を出力しない
- **Honest（正直）** — 嘘をつかず、不確実な場合はそう伝える

このレッスンでは、アラインメントの代表的手法である **RLHF（Reinforcement Learning from Human Feedback）** と **Constitutional AI** を学びます。`,
        },
      ],
    },
    {
      id: "sft",
      title: "SFT（教師ありファインチューニング）",
      blocks: [
        {
          type: "text",
          content: `アラインメントの第一歩は **SFT（Supervised Fine-Tuning）** です。

SFTでは、人間が作成した**高品質な指示-応答ペア**を使って、モデルを微調整します：

$$\\mathcal{L}_{\\text{SFT}} = -\\sum_{t} \\log P(y_t | y_{<t}, x)$$

ここで $x$ はユーザーの指示（instruction）、$y$ は理想的な応答（response）です。

**SFTのプロセス：**
1. 人間のアノテーターが高品質な指示-応答ペアを数万件作成
2. 事前学習済みモデルをこのデータでファインチューニング
3. モデルが「質問に答える」「指示に従う」形式を学ぶ

**SFTの限界：**
- 良い回答の**書き方**を教えるが、「AよりBが良い」という**好み**を教えるのは苦手
- 人間が書いた回答のクオリティに上限が縛られる
- 数万件のデータ作成は高コスト`,
        },
        {
          type: "text",
          content: `下のデモで、SFTの仕組みを確認しましょう。指示と応答のペアがどのようにモデルの訓練に使われるかを見てください。`,
        },
        {
          type: "interactive",
          id: "sft-demo",
        },
      ],
    },
    {
      id: "reward-model",
      title: "報酬モデル",
      blocks: [
        {
          type: "text",
          content: `SFTの次のステップは、**報酬モデル（Reward Model）**の訓練です。

報酬モデルは「この応答はどのくらい良いか」をスコア化するモデルです。

**訓練方法：**
1. 同じプロンプトに対して、SFTモデルが**複数の応答**を生成
2. 人間のアノテーターが**どちらが良いか**をランキング
3. このランキングデータで報酬モデルを訓練

報酬モデルの損失関数（**Bradley-Terry モデル**）：

$$\\mathcal{L}_{\\text{RM}} = -\\log \\sigma(r(x, y_w) - r(x, y_l))$$

ここで：
- $r(x, y)$ はプロンプト $x$ に対する応答 $y$ の報酬スコア
- $y_w$ は人間が選んだ「勝ち」の応答
- $y_l$ は「負け」の応答
- $\\sigma$ はシグモイド関数

直感的には、**良い応答のスコアを高く、悪い応答のスコアを低く**するように学習します。`,
        },
        {
          type: "text",
          content: `下のデモで、報酬モデルの訓練を体験してみましょう。同じプロンプトに対する2つの応答を比較し、どちらが良いかを選んでみてください。`,
        },
        {
          type: "interactive",
          id: "reward-model-demo",
        },
        {
          type: "quiz",
          data: {
            question:
              "報酬モデルの訓練データとして必要なのは何か？",
            options: [
              "大量の無ラベルテキスト",
              "同じプロンプトに対する複数応答の人間によるランキング",
              "正解ラベル付きの分類データ",
              "モデルが自動生成した応答のみ",
            ],
            answer: 1,
            explanation:
              "報酬モデルは、同じプロンプトに対する複数の応答を人間が比較・ランキングしたデータで訓練されます。これにより「良い応答」と「悪い応答」の違いを学習します。",
          },
        },
      ],
    },
    {
      id: "ppo",
      title: "PPO（強化学習）",
      blocks: [
        {
          type: "text",
          content: `最後のステップが **PPO（Proximal Policy Optimization）** による強化学習です。

訓練済みの報酬モデルをフィードバックとして使い、SFTモデルをさらに改善します。

**RLHFの全体像：**
1. プロンプト $x$ をLLMに入力
2. LLMが応答 $y$ を生成
3. 報酬モデルがスコア $r(x, y)$ を計算
4. PPOでLLMのパラメータを更新

PPOの目的関数：

$$\\mathcal{J}(\\theta) = \\mathbb{E}_{x, y \\sim \\pi_\\theta} \\left[ r(x, y) - \\beta \\cdot \\text{KL}(\\pi_\\theta \\| \\pi_{\\text{SFT}}) \\right]$$

重要なのは **KLペナルティ** $\\beta \\cdot \\text{KL}(\\pi_\\theta \\| \\pi_{\\text{SFT}})$ です：
- 報酬モデルのスコアだけを最大化すると、モデルが「ハック」してしまう
- 例：やたらと長い文章を生成する、同じフレーズを繰り返す
- KLペナルティにより、SFTモデルから大きく離れないように制約をかける`,
        },
        {
          type: "text",
          content: `下のデモで、RLHFの全体パイプラインをアニメーションで確認しましょう。各ステップがどう繋がっているかに注目してください。`,
        },
        {
          type: "interactive",
          id: "rlhf-pipeline",
        },
        {
          type: "quiz",
          data: {
            question:
              "PPOのKLペナルティの役割は何か？",
            options: [
              "学習速度を上げるため",
              "モデルがSFTモデルから大きく離れすぎないように制約するため",
              "報酬モデルの精度を上げるため",
              "生成テキストの長さを制限するため",
            ],
            answer: 1,
            explanation:
              "KLペナルティは、PPOで最適化されるモデルがSFTモデルの分布から大きく乖離しないようにする正則化項です。これがないと、報酬モデルの弱点を突くような不自然な応答を生成する「報酬ハッキング」が起きやすくなります。",
          },
        },
      ],
    },
    {
      id: "constitutional-ai",
      title: "Constitutional AI",
      blocks: [
        {
          type: "text",
          content: `**Constitutional AI（CAI）** は、Anthropicが提案した手法で、人間のフィードバックの代わりに**AIのフィードバック**を使います。

**RLHFの問題点：**
- 人間のアノテーターを大量に雇う必要がある（高コスト）
- アノテーター間の品質のバラつき
- 有害なコンテンツの評価は心理的負担が大きい

**CAIのアプローチ：**
1. **憲法（Constitution）**を定義 — AIが守るべき原則のリスト
2. **Critique（批評）** — AIが自分の応答を原則に照らして批評
3. **Revise（修正）** — 批評に基づいて応答を修正
4. この批評-修正ペアでモデルを訓練（RLAIF: RL from AI Feedback）

**憲法の例：**
- 「有害な情報を提供してはいけない」
- 「嘘をついてはいけない」
- 「差別的な内容を避ける」
- 「ユーザーの意図を尊重する」

$$y_{\\text{revised}} = \\text{LLM}(y_{\\text{original}}, \\text{critique}, \\text{constitution})$$

CAIは**スケーラブル**で**一貫性が高い**というメリットがあります。`,
        },
        {
          type: "text",
          content: `下のデモで、Constitutional AIの批評-修正ループを体験しましょう。元の応答がどのように批評され、改善されていくかをステップごとに確認してください。`,
        },
        {
          type: "interactive",
          id: "cai-demo",
        },
      ],
    },
    {
      id: "summary",
      title: "まとめ",
      blocks: [
        {
          type: "text",
          content: `アラインメント技術をまとめます：

| ステップ | 手法 | データ | 目的 |
|---|---|---|---|
| 1 | SFT | 指示-応答ペア | 指示に従う形式を学習 |
| 2 | 報酬モデル | 人間の比較ランキング | 応答品質のスコア化 |
| 3 | PPO | 報酬モデルのスコア | 高品質な応答を生成 |
| 代替 | Constitutional AI | AI自身の批評 | スケーラブルな改善 |

**重要なポイント：**
- 事前学習だけでは「有用なアシスタント」にはならない
- **RLHF** = SFT → 報酬モデル → PPO の3段階パイプライン
- **Constitutional AI** = 人間の代わりにAIがフィードバック。スケーラブルで一貫性が高い
- KLペナルティが「報酬ハッキング」を防ぐ鍵
- 現在のChatGPT、Claude、Geminiなどはすべてこれらの技術を組み合わせている

次のレッスンでは、アラインメントされたLLMが実際にテキストを生成する**推論（Inference）の仕組み**を学びます。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "Constitutional AIがRLHFと比べて優れている点は何か？",
            options: [
              "モデルの性能が必ず高くなる",
              "事前学習が不要になる",
              "人間のアノテーターへの依存を減らし、スケーラブルに改善できる",
              "学習に必要な計算量が大幅に削減される",
            ],
            answer: 2,
            explanation:
              "Constitutional AIは、人間の代わりにAI自身が原則（憲法）に基づいて応答を批評・修正します。これにより、大量の人間アノテーターを雇うコストを削減し、一貫した品質で大規模にアラインメントを行えます。",
          },
        },
      ],
    },
  ],
};

export default lesson14;
