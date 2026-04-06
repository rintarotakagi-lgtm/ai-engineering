import type { Lesson } from "@/lib/types";

const lesson1: Lesson = {
  slug: "linear-regression",
  title: "線形回帰",
  subtitle: "損失関数、最小二乗法、勾配降下法 — 機械学習の最初の一歩",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `機械学習の第一歩は**線形回帰**です。「データに直線を当てはめる」というシンプルな問題ですが、ここに機械学習の本質的なアイデアがすべて詰まっています。

このレッスンでは、以下を学びます：
- データに「最もよく当てはまる直線」とは何か
- 「当てはまりの良さ」をどう数値化するか（損失関数）
- 最適な直線を求める2つの方法（解析解と勾配降下法）
- 行列を使った表現（線形代数の視点）`,
        },
        {
          type: "text",
          content: `まずは直感から始めましょう。下のデモでキャンバスをクリックしてデータ点を追加してみてください。回帰直線がリアルタイムで更新されます。`,
        },
        {
          type: "interactive",
          id: "line-fit",
        },
      ],
    },
    {
      id: "model",
      title: "モデル",
      blocks: [
        {
          type: "text",
          content: `線形回帰のモデルは非常にシンプルです。入力 $x$ に対して、出力 $\\hat{y}$ を次のように予測します：

$$\\hat{y} = wx + b$$

ここで：
- $w$ は**重み（weight）** — 直線の傾き
- $b$ は**バイアス（bias）** — 直線の切片
- $\\hat{y}$（yハット）は**予測値**

機械学習の「学習」とは、データに最もよく当てはまる $w$ と $b$ を見つけることです。では「最もよく当てはまる」とはどういう意味でしょうか？`,
        },
      ],
    },
    {
      id: "loss",
      title: "損失関数",
      blocks: [
        {
          type: "text",
          content: `「当てはまりの良さ」を測るために、**損失関数（loss function）**を定義します。線形回帰では**平均二乗誤差（MSE: Mean Squared Error）**が標準的に使われます：

$$L(w, b) = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{y}_i)^2 = \\frac{1}{n} \\sum_{i=1}^{n} (y_i - wx_i - b)^2$$

各データ点の実際の値 $y_i$ と予測値 $\\hat{y}_i$ の差（**残差**）を二乗して平均したものです。`,
        },
        {
          type: "text",
          content: `なぜ二乗するのか？
- 正の誤差と負の誤差が打ち消し合わないようにするため
- 大きな誤差をより強くペナルティするため
- 微分が綺麗になるため（後で見ます）

下のデモで、$w$ と $b$ を変えたときに損失がどう変わるか見てみましょう。色が暖かいほど損失が大きく、冷たいほど損失が小さい領域です。`,
        },
        {
          type: "interactive",
          id: "loss-landscape",
        },
        {
          type: "quiz",
          data: {
            question:
              "損失関数 L(w,b) の値が0になるのはどんなとき？",
            options: [
              "w = 0 かつ b = 0 のとき",
              "すべてのデータ点が予測直線の上に完全に乗っているとき",
              "データ点が2個以上あるとき",
              "w と b が十分に大きいとき",
            ],
            answer: 1,
            explanation:
              "損失関数は各データ点の予測誤差の二乗和なので、すべてのデータ点で予測が完全に一致すれば（残差がすべて0）、損失は0になります。実際のデータではノイズがあるため、0になることは稀です。",
          },
        },
      ],
    },
    {
      id: "analytical",
      title: "解析解（最小二乗法）",
      blocks: [
        {
          type: "text",
          content: `線形回帰の素晴らしいところは、最適な $w$ と $b$ を**数式で直接求められる**ことです。これを**解析解（closed-form solution）**と呼びます。

損失関数を $w$ と $b$ で偏微分して0とおくと：

$$w^* = \\frac{\\text{Cov}(x, y)}{\\text{Var}(x)} = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sum(x_i - \\bar{x})^2}$$

$$b^* = \\bar{y} - w^* \\bar{x}$$

ここで $\\bar{x}$ と $\\bar{y}$ はそれぞれの平均値です。`,
        },
        {
          type: "text",
          content: `直感的には、$w$（傾き）は「$x$ と $y$ がどれだけ一緒に動くか（共分散）」を「$x$ がどれだけばらつくか（分散）」で割ったものです。

下のデモで、実際の数値を使って一歩ずつ計算してみましょう。`,
        },
        {
          type: "interactive",
          id: "analytical-demo",
        },
      ],
    },
    {
      id: "gradient-descent",
      title: "勾配降下法",
      blocks: [
        {
          type: "text",
          content: `線形回帰には解析解がありますが、より複雑なモデル（ニューラルネットワークなど）では解析解が存在しません。そこで登場するのが**勾配降下法（Gradient Descent）**です。

アイデアはシンプルです：
1. $w$ と $b$ をランダムに初期化する
2. 損失関数の**勾配**（傾き）を計算する
3. 勾配の逆方向に少し動かす（損失が減る方向に進む）
4. 収束するまで繰り返す

更新式：

$$w \\leftarrow w - \\alpha \\frac{\\partial L}{\\partial w}$$

$$b \\leftarrow b - \\alpha \\frac{\\partial L}{\\partial b}$$

ここで $\\alpha$ は**学習率（learning rate）** — 一歩の大きさを決めるハイパーパラメータです。`,
        },
        {
          type: "text",
          content: `偏微分を計算すると：

$$\\frac{\\partial L}{\\partial w} = -\\frac{2}{n} \\sum_{i=1}^{n} x_i(y_i - wx_i - b)$$

$$\\frac{\\partial L}{\\partial b} = -\\frac{2}{n} \\sum_{i=1}^{n} (y_i - wx_i - b)$$

下のデモで学習率を調整しながら、勾配降下法が直線をデータにフィットさせていく様子を見てみましょう。`,
        },
        {
          type: "interactive",
          id: "gradient-descent",
        },
      ],
    },
    {
      id: "learning-rate",
      title: "学習率の影響",
      blocks: [
        {
          type: "text",
          content: `学習率 $\\alpha$ の選び方は非常に重要です：

- **小さすぎる**：収束が遅い。何千ステップも必要
- **ちょうどいい**：スムーズに収束する
- **大きすぎる**：損失が発散する。最適値を飛び越えてしまう

下のデモで3つの学習率を同時に比較してみましょう。`,
        },
        {
          type: "interactive",
          id: "lr-comparison",
        },
        {
          type: "quiz",
          data: {
            question: "学習率が大きすぎると何が起きる？",
            options: [
              "学習が遅くなる",
              "損失が振動・発散する",
              "常に最適解に到達する",
              "バイアスが0になる",
            ],
            answer: 1,
            explanation:
              "学習率が大きすぎると、更新のステップが大きすぎて最適値を飛び越えてしまい、損失が減るどころか増えてしまいます（発散）。適切な学習率の選択は機械学習の実践で最も重要なスキルの一つです。",
          },
        },
      ],
    },
    {
      id: "matrix",
      title: "行列表現",
      blocks: [
        {
          type: "text",
          content: `ここまでのスカラー表現を、**行列（線形代数）**で書き直してみましょう。これは単なる表記の変更ではなく、重要な意味があります：

- 多変量回帰（$x$ が複数の特徴量を持つ場合）に自然に拡張できる
- NumPyなどのライブラリで効率的に計算できる
- ニューラルネットワークの理解につながる

データ行列 $X$ を次のように定義します（各行がデータ点、列は $[x_i, 1]$）：

$$X = \\begin{bmatrix} x_1 & 1 \\\\ x_2 & 1 \\\\ \\vdots & \\vdots \\\\ x_n & 1 \\end{bmatrix}, \\quad \\mathbf{y} = \\begin{bmatrix} y_1 \\\\ y_2 \\\\ \\vdots \\\\ y_n \\end{bmatrix}, \\quad \\mathbf{w} = \\begin{bmatrix} w \\\\ b \\end{bmatrix}$$

すると予測は $\\hat{\\mathbf{y}} = X\\mathbf{w}$ と書け、正規方程式は：

$$\\mathbf{w}^* = (X^T X)^{-1} X^T \\mathbf{y}$$`,
        },
        {
          type: "text",
          content: `下のデモで、具体的な数値を行列に入れて正規方程式を解く過程を見てみましょう。`,
        },
        {
          type: "interactive",
          id: "matrix-demo",
        },
      ],
    },
    {
      id: "summary",
      title: "まとめ",
      blocks: [
        {
          type: "text",
          content: `このレッスンで学んだことを整理しましょう：

**モデル：** $\\hat{y} = wx + b$ — データに直線を当てはめる

**損失関数：** $L(w,b) = \\frac{1}{n}\\sum(y_i - wx_i - b)^2$ — 予測の良さを測る

**解析解：** $w^* = \\text{Cov}(x,y) / \\text{Var}(x)$ — 数式で直接求まる

**勾配降下法：** $w \\leftarrow w - \\alpha \\nabla L$ — 勾配の逆方向に少しずつ進む

**学習率：** 小さすぎると遅い、大きすぎると発散。チューニングが重要

**行列表現：** $\\mathbf{w}^* = (X^TX)^{-1}X^T\\mathbf{y}$ — 多変量への拡張に必要`,
        },
        {
          type: "text",
          content: `線形回帰はシンプルですが、ここで学んだ概念（損失関数、勾配降下法、学習率）は、ニューラルネットワーク・Transformer・LLMまで一貫して使われます。

次のレッスンでは、**ロジスティック回帰** — 「分類」問題への拡張を学びます。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "線形回帰の解析解が使えるのに、なぜ勾配降下法を学ぶ必要がある？",
            options: [
              "解析解は正確ではないから",
              "勾配降下法のほうが速いから",
              "より複雑なモデルでは解析解が存在しないから",
              "解析解は1次元の場合しか使えないから",
            ],
            answer: 2,
            explanation:
              "ニューラルネットワークなどの非線形モデルでは、損失関数が複雑になり解析的に解くことができません。勾配降下法は、どんなモデルにも適用できる汎用的な最適化手法です。線形回帰で勾配降下法の直感を掴んでおくことが、後のレッスンへの重要な準備になります。",
          },
        },
      ],
    },
  ],
};

export default lesson1;
