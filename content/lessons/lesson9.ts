import type { Lesson } from "@/lib/types";

const lesson9: Lesson = {
  slug: "attention",
  title: "Attention機構",
  subtitle:
    "固定長ボトルネックを打破する — スコア関数、Softmax重み付け、Q・K・V行列によるAttention計算の全体像",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `前回のレッスンで、RNN・LSTMが**系列データ**を扱えることを学びました。しかし、RNNベースのEncoder-Decoderモデルには根本的な問題があります：

**固定長ボトルネック（Fixed-Length Bottleneck）**

Encoderは入力系列全体を1つの固定サイズの隠れ状態ベクトルに圧縮します。10単語の文も100単語の文も、同じサイズのベクトルに押し込まなければなりません。

- 短い文 → ベクトルに余裕がある
- 長い文 → 情報が圧縮されすぎて失われる

これは「分厚い教科書の内容を、付箋1枚にまとめろ」と言われているようなものです。

2014年、Bahdanauらはこの問題に対するエレガントな解決策を提案しました：**Attention機構**。

キーワード：
- **Attention** — 出力を生成するとき、入力のどこに注目するかを動的に決定
- **スコア関数** — 2つのベクトルの「関連度」を数値化
- **Softmax重み** — スコアを確率的な重みに変換
- **Q, K, V** — Query, Key, Valueによる一般化されたAttentionの枠組み`,
        },
      ],
    },
    {
      id: "attention-intuition",
      title: "Attention の直感",
      blocks: [
        {
          type: "text",
          content: `Attentionの核心的アイデアは非常にシンプルです：

> **出力の各ステップで、入力のすべてのステップを「見返し」、どこに注目すべきかを動的に決める**

例えば機械翻訳で「猫が魚を食べた」を "The cat ate the fish" に翻訳する場合：

- "cat" を出力するとき → 「猫」に強く注目
- "fish" を出力するとき → 「魚」に強く注目
- "ate" を出力するとき → 「食べた」に強く注目

従来のEncoder-Decoderモデルが「教科書を付箋にまとめてから答える」だとすれば、Attentionは「教科書を開いたまま、必要なページを参照しながら答える」ようなものです。

数式で表すと：

$$\\text{context}_t = \\sum_{i=1}^{n} \\alpha_{t,i} \\cdot h_i$$

ここで $\\alpha_{t,i}$ は「出力ステップ $t$ が入力ステップ $i$ にどれだけ注目するか」を表す重み（0〜1で、合計1）、$h_i$ はEncoderの隠れ状態です。`,
        },
        {
          type: "text",
          content: `下のデモで、Attention機構の動きを体験してみましょう。ターゲット側の各単語をクリックすると、ソース側のどの単語に注目しているかが線の太さと色で表示されます。`,
        },
        {
          type: "interactive",
          id: "attention-intuition",
        },
        {
          type: "quiz",
          data: {
            question:
              "Attention機構が解決する「固定長ボトルネック」問題とは何か？",
            options: [
              "Decoderの出力長が固定されてしまう問題",
              "Encoderが入力系列全体を1つの固定サイズベクトルに圧縮するため、長い入力で情報が失われる問題",
              "学習率が固定で変更できない問題",
              "単語の埋め込み次元が固定されている問題",
            ],
            answer: 1,
            explanation:
              "従来のEncoder-Decoderモデルでは、Encoderが入力系列全体を1つの隠れ状態ベクトルに圧縮します。系列が長くなるほど情報が失われやすく、これが「固定長ボトルネック」です。Attentionは出力の各ステップで入力全体を参照することで、この問題を解決します。",
          },
        },
      ],
    },
    {
      id: "score-function",
      title: "スコア関数",
      blocks: [
        {
          type: "text",
          content: `Attentionの重み $\\alpha_{t,i}$ を計算するには、まず**スコア関数**で「2つのベクトルがどれだけ関連しているか」を数値化します。

代表的なスコア関数：

**1. ドット積（Dot Product）**

$$\\text{score}(q, k) = q \\cdot k = \\sum_{j=1}^{d} q_j \\cdot k_j$$

最もシンプル。2つのベクトルの方向が近いほど高スコア。

**2. スケーリングドット積（Scaled Dot Product）**

$$\\text{score}(q, k) = \\frac{q \\cdot k}{\\sqrt{d}}$$

ドット積を次元数 $d$ の平方根で割ります。次元数が大きいとドット積の値も大きくなり、Softmaxが極端な分布になるのを防ぎます。これが**Transformerで採用されている方式**です。

**なぜスケーリングが必要か？**

$d = 512$ の場合、各要素が平均0・分散1だと、ドット積の分散は約512になります。$\\sqrt{512} \\approx 22.6$ で割ることで分散を1に正規化し、Softmaxが適切に機能するようにします。`,
        },
        {
          type: "text",
          content: `下のデモでは、Query（Q）ベクトルとKey（K）ベクトルのドット積を計算します。ベクトルの先端をドラッグして方向を変え、類似度（スコア）がどう変化するか確認してみましょう。`,
        },
        {
          type: "interactive",
          id: "score-demo",
        },
      ],
    },
    {
      id: "softmax-weights",
      title: "Softmaxと重み",
      blocks: [
        {
          type: "text",
          content: `スコア関数で得られた生のスコアは、任意の実数値です。これを「合計1の確率的な重み」に変換するのが**Softmax関数**です：

$$\\alpha_i = \\text{softmax}(s_i) = \\frac{e^{s_i / T}}{\\sum_{j} e^{s_j / T}}$$

ここで $T$ は**温度パラメータ（temperature）**です：

- **$T$ が小さい**（例: 0.1）→ 最大スコアに集中する**シャープな分布**（ほぼone-hot）
- **$T = 1$** → 標準的なSoftmax
- **$T$ が大きい**（例: 5.0）→ 均等に近い**滑らかな分布**

温度が低いほど「自信を持って1箇所に注目」、高いほど「広く浅く注目」するイメージです。

Attentionの文脈では、Softmaxの出力 $\\alpha_i$ が**Attention重み**になります。これは「各入力にどれだけ注目するか」の配分を表します。`,
        },
        {
          type: "text",
          content: `下のデモで、生のスコアを入力してSoftmaxの出力を確認しましょう。温度パラメータを変えると、分布のシャープさがどう変わるか体験できます。`,
        },
        {
          type: "interactive",
          id: "softmax-demo",
        },
      ],
    },
    {
      id: "attention-calc",
      title: "Attention の計算",
      blocks: [
        {
          type: "text",
          content: `Attentionを一般化すると、3つの行列を使った枠組みで表現できます：

- **Query（Q）**: 「何を探しているか」 — 現在の出力ステップの情報
- **Key（K）**: 「何を持っているか」 — 各入力ステップのラベル情報
- **Value（V）**: 「実際の中身」 — 各入力ステップが提供する情報

直感的には、図書館での検索に例えられます：
- **Query**: あなたの検索キーワード
- **Key**: 各本の索引・タイトル
- **Value**: 各本の内容

計算の手順（Scaled Dot-Product Attention）：

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

**ステップバイステップ：**

1. **$QK^T$**: QueryとKeyの全ペアのドット積 → スコア行列
2. **$/ \\sqrt{d_k}$**: スケーリング → 安定したスコア
3. **softmax**: 行ごとにSoftmax → Attention重み行列
4. **$\\times V$**: 重み付き平均 → 最終出力`,
        },
        {
          type: "text",
          content: `下のデモで、Attention計算の各ステップを順番に追っていきましょう。小さな行列を使って、$QK^T$ → スケーリング → Softmax → $\\times V$ の流れを実際の数値で確認できます。`,
        },
        {
          type: "interactive",
          id: "attention-calc",
        },
        {
          type: "quiz",
          data: {
            question:
              "Scaled Dot-Product Attentionで √d_k で割る理由として正しいのはどれ？",
            options: [
              "計算速度を上げるため",
              "次元数が大きいとドット積の分散も大きくなり、Softmaxの出力が極端（ほぼone-hot）になるのを防ぐため",
              "Valueベクトルの大きさを正規化するため",
              "逆伝播時の勾配を大きくするため",
            ],
            answer: 1,
            explanation:
              "ドット積の値は次元数 d_k に比例して大きくなります（各要素が標準正規分布なら分散は d_k）。大きな値がSoftmaxに入ると、出力がほぼ one-hot になり勾配が消失します。√d_k で割ることで分散を1に正規化し、Softmaxが適切に機能するようにします。",
          },
        },
      ],
    },
    {
      id: "summary",
      title: "まとめ",
      blocks: [
        {
          type: "text",
          content: `このレッスンで学んだこと：

**固定長ボトルネック：** Encoder-Decoderモデルが入力全体を1つのベクトルに圧縮する限界

**Attention機構：** 出力の各ステップで入力全体を「見返し」、どこに注目するかを動的に決定する仕組み

**スコア関数：** ドット積・スケーリングドット積で2つのベクトルの関連度を計算

**Softmax重み：** 生のスコアを合計1の確率的な重みに変換。温度パラメータで分布のシャープさを制御

**Q, K, V：** Query（検索）、Key（索引）、Value（内容）の3要素による一般化されたAttentionの枠組み

**Scaled Dot-Product Attention：** $\\text{softmax}(QK^T / \\sqrt{d_k}) \\cdot V$`,
        },
        {
          type: "text",
          content: `Attention機構はRNNの固定長ボトルネックを解消し、機械翻訳の性能を大幅に向上させました。

しかしここまでのAttentionは、あくまでRNNの**補助**として使われていました。「RNNなしで、Attentionだけで系列を処理できないか？」 — この問いに答えたのが、次のレッスンで学ぶ**Self-Attention（自己注意）**と**Transformer**アーキテクチャです。

Self-Attentionでは、入力系列が自分自身に対してAttentionを計算します。これにより並列計算が可能になり、現代のGPTやBERTなどの大規模言語モデルの基礎が生まれました。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "Attentionの Q, K, V を図書館に例えたとき、正しい対応はどれ？",
            options: [
              "Q = 本の内容、K = 検索キーワード、V = 本のタイトル",
              "Q = 検索キーワード、K = 本の索引・タイトル、V = 本の内容",
              "Q = 本の索引、K = 本の内容、V = 検索キーワード",
              "Q = 本棚の番号、K = 検索キーワード、V = 本のページ数",
            ],
            answer: 1,
            explanation:
              "Query（Q）はあなたが探している情報（検索キーワード）、Key（K）は各本がどんな内容かを示す索引やタイトル、Value（V）は実際の本の内容です。QとKの類似度でどの本が関連するかを判定し、関連するVを重み付けて取り出します。",
          },
        },
      ],
    },
  ],
};

export default lesson9;
