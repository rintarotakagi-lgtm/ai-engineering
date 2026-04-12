import type { Lesson } from "@/lib/types";

const lesson11: Lesson = {
  slug: "bert-vs-gpt",
  title: "BERT vs GPT",
  subtitle:
    "事前学習の二大パラダイム — エンコーダとデコーダ、双方向と自己回帰、そして転移学習の威力",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `前回までのレッスンでは、Transformerの仕組み（Self-Attention、Multi-Head Attention、位置エンコーディング）を学びました。

Transformerアーキテクチャは強力ですが、それをどう**訓練**し、どう**活用**するかで大きく2つの流派に分かれます：

1. **BERT**（Bidirectional Encoder Representations from Transformers）— Google, 2018
2. **GPT**（Generative Pre-trained Transformer）— OpenAI, 2018

両者は同じTransformerをベースにしながら、**全く異なるアプローチ**を取ります。

キーワード：
- **事前学習（Pre-training）** — 大量の無ラベルテキストでモデルを訓練
- **ファインチューニング（Fine-tuning）** — 少量のラベル付きデータでタスクに特化
- **エンコーダ** vs **デコーダ** — Transformerのどちら側を使うか
- **双方向** vs **自己回帰** — 文脈の見え方の違い

このレッスンでは、BERTとGPTの違いを**直感的に**理解し、それぞれの強みと使い分けを学びます。`,
        },
      ],
    },
    {
      id: "encoder-decoder",
      title: "エンコーダ vs デコーダ",
      blocks: [
        {
          type: "text",
          content: `Transformerのオリジナル論文（Vaswani et al., 2017）では、**エンコーダ**と**デコーダ**の両方を使う構造でした。BERTとGPTは、それぞれ片方だけを使います。

**エンコーダ（BERT側）:**
- 入力の**すべてのトークンを同時に**見る
- 各トークンは左右両方の文脈を参照できる（**双方向**）
- 出力は各トークンの**文脈を含んだ表現**

**デコーダ（GPT側）:**
- トークンを**左から右へ順番に**処理
- 各トークンは**自分より左側のトークンだけ**を参照できる（**因果マスク**）
- 次のトークンを**生成（予測）**するのに特化

直感的に言えば：
- **エンコーダ** = 文章を**読んで理解する**装置
- **デコーダ** = 文章を**書き出す**装置`,
        },
        {
          type: "text",
          content: `下のデモで、エンコーダとデコーダの**Attentionの違い**を比べてみましょう。

- **BERT（エンコーダ）**: すべてのトークン間に双方向の矢印がある
- **GPT（デコーダ）**: 右から左への矢印がない（因果マスク）

「トークンを選択」して、そのトークンがどの範囲の文脈を参照できるか確認してみてください。`,
        },
        {
          type: "interactive",
          id: "encoder-decoder-compare",
        },
        {
          type: "quiz",
          data: {
            question:
              "BERTがGPTと異なり「双方向」である最大のメリットは何か？",
            options: [
              "テキストを高速に生成できる",
              "各トークンが左右両方の文脈を使えるため、意味の把握が正確になる",
              "モデルのパラメータ数が少なくて済む",
              "学習データが少なくて済む",
            ],
            answer: 1,
            explanation:
              "BERTのエンコーダは各トークンが文全体を見渡せるため、前後の文脈から正確にトークンの意味を把握できます。例えば「銀行」が金融機関か川岸かを、前後の文脈で判定できます。ただし、テキスト生成にはデコーダ（GPT型）が適しています。",
          },
        },
      ],
    },
    {
      id: "bert",
      title: "BERT — Masked Language Model",
      blocks: [
        {
          type: "text",
          content: `**BERT** の事前学習には、2つの課題が使われます：

**1. Masked Language Model（MLM）**
入力テキストのトークンを**ランダムに15%マスク**し、そのトークンを予測する課題です：

$$P(x_{\\text{mask}} | x_1, x_2, \\ldots, x_{\\text{mask}-1}, x_{\\text{mask}+1}, \\ldots, x_n)$$

例えば「猫が[MASK]を食べた」→「猫が**魚**を食べた」

重要なのは、マスクされたトークンの予測に**左右両方の文脈**を使える点です。「猫が」（左）と「を食べた」（右）の両方から「魚」を推測します。

**2. Next Sentence Prediction（NSP）**
2つの文が**連続する文**か**ランダムな文の組み合わせ**かを判定する課題です。これにより、文間の関係理解を学習します。

> 後の研究（RoBERTaなど）では、NSPの有効性に疑問が呈され、MLMのみで十分という結果も出ています。`,
        },
        {
          type: "text",
          content: `下のデモで、**Masked Language Model** の動作を体験してみましょう。

文中の [MASK] トークンに対して、BERTが**両方向の文脈**からどう予測するかを可視化しています。マスク位置を変えて、文脈の影響を確認してみてください。`,
        },
        {
          type: "interactive",
          id: "mlm-demo",
        },
      ],
    },
    {
      id: "gpt",
      title: "GPT — 自己回帰言語モデル",
      blocks: [
        {
          type: "text",
          content: `**GPT** の事前学習は非常にシンプルです：**次のトークンを予測する**。

$$P(x_t | x_1, x_2, \\ldots, x_{t-1})$$

これを**自己回帰（autoregressive）**と呼びます。文の先頭から1トークンずつ、左側の文脈だけを使って次のトークンを予測します。

例えば「今日の天気は」に対して：
1. 「今日」→ 次は「の」を予測
2. 「今日の」→ 次は「天気」を予測
3. 「今日の天気」→ 次は「は」を予測
4. 「今日の天気は」→ 次は「晴れ」を予測

**因果マスク（Causal Mask）**により、各トークンは**自分より未来のトークンを見ることができません**。Attentionの重み行列で、未来の位置に $-\\infty$ を代入することで実現します：

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}} + M_{\\text{causal}}\\right)V$$

ここで $M_{\\text{causal}}$ は上三角が $-\\infty$、下三角が $0$ の行列です。`,
        },
        {
          type: "text",
          content: `下のデモで、GPTの**自己回帰生成**と**因果マスク**を可視化してみましょう。

「生成開始」ボタンで、GPTが1トークンずつテキストを生成する過程を確認できます。各ステップで、因果マスク（下三角行列）によってどのトークンが参照されるかに注目してください。`,
        },
        {
          type: "interactive",
          id: "autoregressive-demo",
        },
        {
          type: "quiz",
          data: {
            question:
              "GPTの因果マスクについて正しい説明はどれか？",
            options: [
              "すべてのトークン間のAttentionを遮断する",
              "未来のトークンへのAttentionを遮断し、過去のトークンのみ参照可能にする",
              "ランダムにトークンをマスクして予測課題を作る",
              "低いAttentionスコアのトークンを無視する",
            ],
            answer: 1,
            explanation:
              "因果マスクは上三角行列に -∞ を設定することで、各トークンが自分より未来の位置を参照できないようにします。これにより、GPTは自己回帰的に（左から右へ）テキストを生成できます。BERTの [MASK] とは全く異なる仕組みです。",
          },
        },
      ],
    },
    {
      id: "pretrain-finetune",
      title: "事前学習と転移学習",
      blocks: [
        {
          type: "text",
          content: `BERTもGPTも、**事前学習 + ファインチューニング** の2段階で使います。

**事前学習（Pre-training）:**
- **大量の無ラベルテキスト**（Wikipedia、書籍、Webテキスト）で学習
- BERTはMLM + NSP、GPTは次トークン予測
- 汎用的な言語理解・生成能力を獲得
- 数十〜数百GPUで数週間〜数ヶ月かかる

**ファインチューニング（Fine-tuning）:**
- **少量のラベル付きデータ**で特定タスクに特化
- 事前学習済みモデルの重みを初期値として、タスク固有のデータで微調整
- 数時間〜数日で完了

$$\\theta_{\\text{fine-tuned}} = \\theta_{\\text{pretrained}} - \\eta \\nabla_{\\theta} \\mathcal{L}_{\\text{task}}$$

この「大量のデータで汎用知識を学び、少量のデータでタスクに特化する」パラダイムを**転移学習（Transfer Learning）**と呼びます。

**BERTの得意タスク：**
- テキスト分類（感情分析、スパム検知）
- 固有表現抽出（NER）
- 質問応答（SQuAD）

**GPTの得意タスク：**
- テキスト生成（文章作成、コード生成）
- 文章補完
- 対話（チャットボット）`,
        },
        {
          type: "text",
          content: `下のデモで、事前学習からファインチューニングへの流れと、BERT/GPTそれぞれの下流タスクを確認しましょう。

「BERT タスク」と「GPT タスク」を切り替えて、それぞれがどのような応用に使われるかを見てみてください。`,
        },
        {
          type: "interactive",
          id: "pretrain-finetune-demo",
        },
      ],
    },
    {
      id: "summary",
      title: "まとめ",
      blocks: [
        {
          type: "text",
          content: `BERTとGPTの違いをまとめます：

| | **BERT** | **GPT** |
|---|---|---|
| アーキテクチャ | Transformerエンコーダ | Transformerデコーダ |
| 文脈の方向 | 双方向（Bidirectional） | 左から右（Autoregressive） |
| 事前学習 | MLM + NSP | 次トークン予測 |
| Attentionマスク | なし（全トークン参照可） | 因果マスク（未来を遮断） |
| 得意タスク | 分類・抽出・理解 | 生成・補完・対話 |
| 代表モデル | BERT, RoBERTa, ALBERT | GPT-2, GPT-3, GPT-4 |

**重要なポイント：**
- 両者は**補完的な関係**にある（理解 vs 生成）
- **事前学習 + ファインチューニング** のパラダイムはNLPに革命をもたらした
- 最近のモデル（T5、GPT-4）は両方のアイデアを統合する方向に進化
- GPT系列は「スケーリング則」により、モデルを大きくするほど性能が向上することが示された

次のレッスンでは、これらのモデルがどのように**大規模言語モデル（LLM）**へと発展していったかを見ていきます。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "テキスト分類タスク（例: 映画レビューの感情分析）に最も適しているのはどちらか？",
            options: [
              "GPT — 自己回帰で文全体を生成しながら判定するため",
              "BERT — 双方向の文脈理解により文全体の意味を正確に把握できるため",
              "どちらも同じ性能が出る",
              "どちらも使えず、CNNが最適",
            ],
            answer: 1,
            explanation:
              "テキスト分類は文全体の意味を理解するタスクです。BERTは双方向Attentionで文の全体像を把握するのが得意です。GPTは生成に特化しているため、分類タスクではBERTに劣ることが多いです（ただし、十分に大きなGPTモデルはプロンプト設計で分類も可能です）。",
          },
        },
      ],
    },
  ],
};

export default lesson11;
