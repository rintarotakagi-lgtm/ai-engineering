import type { Lesson } from "@/lib/types";

const lesson10: Lesson = {
  slug: "transformer",
  title: "Transformer",
  subtitle:
    "\"Attention Is All You Need\" — 再帰を捨て、Attentionだけで系列を処理する革命的アーキテクチャ",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `前回のレッスンで、RNN/LSTMは系列データを扱えるが**逐次処理**が必要で、長い系列での並列化が困難だと学びました。

2017年、Googleの研究者たちが発表した論文 **"Attention Is All You Need"** は、この限界を根本から覆しました。

**Transformer** は、再帰構造を**完全に排除**し、**Attention機構だけ**で系列を処理するアーキテクチャです。RNNのように1ステップずつ処理するのではなく、系列全体を**一度に**見ることができます。

これにより：
- **並列計算**が可能 → GPUの恩恵を最大限に受けられる
- **長距離依存性**を直接捉えられる → 勾配消失の心配なし
- **スケーリング**が容易 → モデルを大きくするほど性能が向上

GPT、BERT、LLaMA、Claude — 現代のほぼすべての大規模言語モデルはTransformerをベースにしています。

このレッスンでは、Transformerの核となる要素を一つずつ分解して理解していきます：

- **Self-Attention** — 系列内の各トークンが他のすべてのトークンに注目する仕組み
- **Multi-Head Attention** — 複数の視点からAttentionを計算する
- **位置エンコーディング** — 順序情報の埋め込み
- **Transformerブロック** — これらを組み合わせた基本構造`,
        },
      ],
    },
    {
      id: "self-attention",
      title: "Self-Attention",
      blocks: [
        {
          type: "text",
          content: `**Self-Attention**（自己注意機構）は、Transformerの心臓部です。

入力系列の**各トークンが、他のすべてのトークンとの関連度を計算**し、その関連度に基づいて情報を集約します。

具体的な計算手順：

**1. Query, Key, Value の生成**

各トークンの埋め込みベクトル $x_i$ から、3つのベクトルを作ります：

$$Q = XW^Q, \\quad K = XW^K, \\quad V = XW^V$$

- **Query（問い合わせ）**: 「私は何を探している？」
- **Key（鍵）**: 「私はどんな情報を持っている？」
- **Value（値）**: 「私の実際の情報内容」

**2. Attention スコアの計算**

QueryとKeyの内積で「関連度」を計算し、softmaxで正規化します：

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V$$

$\\sqrt{d_k}$ で割るのは、内積の値が大きくなりすぎてsoftmaxが飽和するのを防ぐためです（**Scaled Dot-Product Attention**）。`,
        },
        {
          type: "text",
          content: `**直感的な理解：**

「猫が魚を食べた」という文を考えましょう。

- 「食べた」のQueryは「誰が？何を？」を探している
- 「猫」のKeyは「動作主」の情報を持ち、「魚」のKeyは「対象物」の情報を持つ
- Attentionスコアが高いペアから、より多くの情報を取り入れる

結果として、「食べた」は「猫」と「魚」に強くAttendし、文法的・意味的な関係を捉えます。

下のデモで、文中の各単語がどの単語に注目しているかを確認してみましょう。単語をクリックすると、そのトークンのAttentionの分布がハイライトされます。`,
        },
        {
          type: "interactive",
          id: "self-attention-demo",
        },
        {
          type: "quiz",
          data: {
            question:
              "Scaled Dot-Product Attentionで $\\sqrt{d_k}$ で割る理由は？",
            options: [
              "計算速度を上げるため",
              "内積の値が大きくなりすぎてsoftmaxが飽和し、勾配が消失するのを防ぐため",
              "Query と Key のノルムを1にするため",
              "Valueベクトルの次元を合わせるため",
            ],
            answer: 1,
            explanation:
              "次元数 $d_k$ が大きいと、内積の値も大きくなります。softmaxに大きな値が入ると、出力がほぼone-hot（1つだけ1、他は0）になり、勾配がほぼゼロになってしまいます。$\\sqrt{d_k}$ で割ることで値のスケールを適切に保ちます。",
          },
        },
      ],
    },
    {
      id: "multi-head",
      title: "Multi-Head Attention",
      blocks: [
        {
          type: "text",
          content: `1つのAttentionヘッドでは、1種類の「関係パターン」しか捉えられません。しかし言語には多様な関係があります：

- **文法的関係**: 主語-動詞、動詞-目的語
- **参照関係**: 代名詞が何を指しているか
- **意味的関係**: 類似した概念、対比関係
- **位置的関係**: 隣接する単語間の局所的パターン

**Multi-Head Attention** は、複数のAttentionヘッドを**並列に**走らせ、それぞれが異なるパターンを学習します：

$$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h) W^O$$

$$\\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

各ヘッドは異なる $W_i^Q, W_i^K, W_i^V$ を持つため、**異なる部分空間**で異なる関係を捉えます。すべてのヘッドの出力を結合（Concat）し、$W^O$ で射影して最終出力を得ます。

元の論文では **$h = 8$** ヘッドを使い、$d_{\\text{model}} = 512$ の場合、各ヘッドは $d_k = d_v = 64$ 次元で計算します。ヘッド数を増やしても総計算量はほぼ変わらないのがポイントです。`,
        },
        {
          type: "text",
          content: `下のデモでは、4つのAttentionヘッドが同じ文に対してどのような異なるパターンを捉えるかを並べて表示します。

ヘッドごとに色分けされたAttentionマップを比較してみましょう。あるヘッドは隣接する単語に注目し、別のヘッドは離れた単語間の関係を捉えている様子がわかります。`,
        },
        {
          type: "interactive",
          id: "multi-head-demo",
        },
      ],
    },
    {
      id: "positional-encoding",
      title: "位置エンコーディング",
      blocks: [
        {
          type: "text",
          content: `RNNは構造的に「順序」を扱えましたが、Transformerは系列を**一括で**処理するため、トークンの順序情報が失われます。

「猫が魚を食べた」と「魚が猫を食べた」は、Self-Attentionだけでは同じ結果になってしまいます — 集合演算のように順序を無視するからです。

そこで**位置エンコーディング（Positional Encoding）**を入力に加算し、順序情報を注入します。

元の論文では**正弦波（sinusoidal）**を使います：

$$PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right)$$

$$PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right)$$

- $pos$: トークンの位置（0, 1, 2, ...）
- $i$: 次元のインデックス
- $d_{\\text{model}}$: 埋め込み次元`,
        },
        {
          type: "text",
          content: `**なぜ正弦波なのか？**

1. **一意性**: 各位置が異なるベクトルを得る
2. **相対位置の表現**: $PE_{pos+k}$ は $PE_{pos}$ の線形変換で表現できる → モデルが相対位置を学習しやすい
3. **汎化**: 学習時より長い系列にも外挿できる

低い次元（$i$ が小さい）では波長が短く、高い次元では波長が長くなります。これにより、近い位置は低次元で区別でき、遠い位置は高次元で区別できます。

下のデモでは、位置エンコーディングの行列をヒートマップで可視化します。各行が位置、各列が次元に対応します。sin/cosの波が異なる周波数で変化する様子を確認してみましょう。`,
        },
        {
          type: "interactive",
          id: "positional-encoding-demo",
        },
        {
          type: "quiz",
          data: {
            question:
              "Transformerに位置エンコーディングが必要な理由は？",
            options: [
              "Attentionの計算を高速化するため",
              "Self-Attentionは順序を考慮しない集合演算のため、入力に順序情報を明示的に加える必要があるから",
              "勾配消失を防ぐため",
              "モデルのパラメータ数を削減するため",
            ],
            answer: 1,
            explanation:
              "Self-Attentionはすべてのトークンペア間の関連度を計算しますが、この計算自体は入力の順序に依存しません（置換に対して不変）。位置エンコーディングを加えることで、各トークンの「位置」という情報がベクトルに含まれるようになります。",
          },
        },
      ],
    },
    {
      id: "transformer-block",
      title: "Transformer ブロック",
      blocks: [
        {
          type: "text",
          content: `ここまでの要素を組み合わせた**Transformerブロック**（エンコーダ側）は、以下の構造を持ちます：

$$\\text{出力} = \\text{LayerNorm}(x + \\text{FFN}(\\text{LayerNorm}(x + \\text{MultiHead}(x, x, x))))$$

具体的な流れ：

**1. Multi-Head Self-Attention**
入力 $x$ から Q, K, V を生成し、Attentionを計算

**2. 残差接続 + Layer Normalization**
Attentionの出力を入力に加算（**残差接続**）し、正規化
$$x' = \\text{LayerNorm}(x + \\text{MultiHead}(x, x, x))$$

**3. Feed-Forward Network（FFN）**
各位置ごとに独立した2層の全結合ネットワークを適用
$$\\text{FFN}(x) = \\text{ReLU}(xW_1 + b_1)W_2 + b_2$$

**4. 残差接続 + Layer Normalization（再び）**
$$\\text{output} = \\text{LayerNorm}(x' + \\text{FFN}(x'))$$`,
        },
        {
          type: "text",
          content: `**残差接続**はLesson 7で学んだResNetと同じアイデアです。勾配の流れを助け、深いモデルでも安定した学習を可能にします。

**Layer Normalization** は各サンプルの各位置で正規化を行い、学習を安定させます（Batch Normalizationが「バッチ方向」で正規化するのに対し、LayerNormは「特徴方向」で正規化します）。

元のTransformerはこのブロックを **$N = 6$ 回** 積み重ねます。各ブロックは異なるパラメータを持ち、層が深くなるほど抽象的な表現を学習します。

下のデモで、1つのTransformerブロック内のデータフローをアニメーションで確認しましょう。`,
        },
        {
          type: "interactive",
          id: "transformer-block-demo",
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

**Self-Attention**: 各トークンがすべてのトークンとの関連度を計算し、情報を集約する。$\\text{softmax}(QK^\\top / \\sqrt{d_k})V$ で計算

**Multi-Head Attention**: 複数のAttentionヘッドを並列に走らせ、異なる関係パターンを捉える。出力を結合して射影

**位置エンコーディング**: 正弦波を使って順序情報を入力に注入。Self-Attentionは順序に不変なため、これが必要

**Transformerブロック**: Multi-Head Attention → Add&Norm → FFN → Add&Norm。残差接続とLayerNormで安定した学習を実現`,
        },
        {
          type: "text",
          content: `Transformerは2017年の登場以来、NLPを根本から変えました。BERT（2018）は双方向のエンコーダ、GPT（2018〜）はデコーダのみのアーキテクチャで、それぞれ大きな成功を収めています。

特にGPTシリーズの成功は、**スケーリング則**（Scaling Laws）の発見とともに、「Transformerを大きくし、大量のデータで学習すれば、能力が予測可能に向上する」という知見をもたらしました。

現在の大規模言語モデル（LLM）はすべてTransformerベースであり、このアーキテクチャの理解はAIエンジニアリングの基礎です。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "TransformerがRNNに対して持つ最大の構造的優位性は？",
            options: [
              "パラメータ数が少ない",
              "再帰構造を排除し、系列全体を並列処理できるため、計算効率が高く長距離依存性も直接捉えられる",
              "活性化関数が不要",
              "学習データが少なくて済む",
            ],
            answer: 1,
            explanation:
              "RNNは系列を1ステップずつ逐次処理するため並列化が困難で、長距離の情報は勾配消失で失われやすいです。Transformerは Self-Attention で系列全体を一度に処理でき、任意の2トークン間の関係を直接計算します。",
          },
        },
      ],
    },
  ],
};

export default lesson10;
