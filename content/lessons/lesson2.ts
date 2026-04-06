import type { Lesson } from "@/lib/types";

const lesson2: Lesson = {
  slug: "logistic-regression",
  title: "ロジスティック回帰",
  subtitle: "シグモイド関数、交差エントロピー、最尤推定 — 分類問題への第一歩",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `前回の線形回帰は「連続値の予測」でした。今回は**分類（classification）**を学びます。

例えば：
- メールがスパムかどうか（0 or 1）
- 腫瘍が良性か悪性か（0 or 1）
- 学生が試験に合格するかどうか（0 or 1）

出力が 0 か 1 の二値になる問題です。線形回帰の $\\hat{y} = wx + b$ をそのまま使うと、予測値が 0〜1 の範囲を超えてしまいます。そこで登場するのが**ロジスティック回帰**です。`,
        },
      ],
    },
    {
      id: "sigmoid",
      title: "シグモイド関数",
      blocks: [
        {
          type: "text",
          content: `ロジスティック回帰の鍵は**シグモイド関数（sigmoid function）**です：

$$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$

この関数は、任意の実数 $z$ を **0〜1の範囲**に写します。これを**確率**として解釈します。

$$P(y=1 | x) = \\sigma(wx + b) = \\frac{1}{1 + e^{-(wx+b)}}$$

つまり「入力 $x$ が与えられたとき、クラス1に属する確率」を出力します。`,
        },
        {
          type: "text",
          content: `シグモイド関数の重要な性質：
- $z = 0$ のとき $\\sigma(0) = 0.5$（半々）
- $z \\to +\\infty$ のとき $\\sigma(z) \\to 1$
- $z \\to -\\infty$ のとき $\\sigma(z) \\to 0$
- 滑らかで微分可能（勾配降下法に使える）

下のデモで、$w$ と $b$ を動かしてシグモイド関数の形がどう変わるか見てみましょう。`,
        },
        {
          type: "interactive",
          id: "sigmoid-explorer",
        },
        {
          type: "quiz",
          data: {
            question: "シグモイド関数 σ(z) の出力が0.5になるのはどんなとき？",
            options: [
              "z = 1 のとき",
              "z = 0 のとき",
              "z = -1 のとき",
              "常に0.5にはならない",
            ],
            answer: 1,
            explanation:
              "σ(0) = 1/(1+e^0) = 1/(1+1) = 0.5 です。z=0、つまり wx+b=0 が判定の境界線（decision boundary）になります。",
          },
        },
      ],
    },
    {
      id: "decision-boundary",
      title: "決定境界",
      blocks: [
        {
          type: "text",
          content: `分類の予測ルールは：

- $\\sigma(wx + b) \\geq 0.5$ → クラス 1 と予測
- $\\sigma(wx + b) < 0.5$ → クラス 0 と予測

$\\sigma(z) = 0.5$ となるのは $z = 0$ のとき、つまり $wx + b = 0$ が**決定境界（decision boundary）**です。

1次元の場合は1つの点、2次元の場合は直線、高次元では超平面になります。ロジスティック回帰は本質的に**線形分類器**です。`,
        },
        {
          type: "text",
          content: `下のデモでは2クラスのデータ点と決定境界を表示しています。$w$ と $b$ を調整して、うまく2つのクラスを分離してみてください。`,
        },
        {
          type: "interactive",
          id: "decision-boundary",
        },
      ],
    },
    {
      id: "cross-entropy",
      title: "交差エントロピー損失",
      blocks: [
        {
          type: "text",
          content: `線形回帰ではMSE（平均二乗誤差）を使いましたが、分類問題ではうまく機能しません。代わりに**交差エントロピー損失（cross-entropy loss）**を使います：

$$L(w, b) = -\\frac{1}{n} \\sum_{i=1}^{n} \\left[ y_i \\log(\\hat{p}_i) + (1 - y_i) \\log(1 - \\hat{p}_i) \\right]$$

ここで $\\hat{p}_i = \\sigma(wx_i + b)$ は予測確率です。`,
        },
        {
          type: "text",
          content: `この損失関数の直感：

- $y_i = 1$ のとき → $-\\log(\\hat{p}_i)$ が損失。$\\hat{p}_i$ が1に近いほど損失は小さい
- $y_i = 0$ のとき → $-\\log(1 - \\hat{p}_i)$ が損失。$\\hat{p}_i$ が0に近いほど損失は小さい

つまり「自信を持って間違えた」ときに損失が爆発的に大きくなります。これが交差エントロピーの強みです。`,
        },
        {
          type: "interactive",
          id: "cross-entropy-viz",
        },
        {
          type: "quiz",
          data: {
            question:
              "真のラベルが y=1 で、モデルの予測確率が p̂=0.01 のとき、交差エントロピー損失はどうなる？",
            options: [
              "ほぼ0（小さい）",
              "約1（中くらい）",
              "非常に大きい（約4.6）",
              "負の値になる",
            ],
            answer: 2,
            explanation:
              "-log(0.01) = -(-4.605) = 4.605。正解が1なのに0.01とほぼ0を予測してしまった場合、損失は非常に大きくなります。「自信を持って大外し」を強くペナルティするのが交差エントロピーの特徴です。",
          },
        },
      ],
    },
    {
      id: "mle",
      title: "最尤推定",
      blocks: [
        {
          type: "text",
          content: `交差エントロピー損失は、実は**最尤推定（Maximum Likelihood Estimation, MLE）**から自然に導出されます。

各データ点の尤度（likelihood）は：

$$P(y_i | x_i; w, b) = \\hat{p}_i^{y_i} (1 - \\hat{p}_i)^{1-y_i}$$

全データの尤度は各データ点の積：

$$\\mathcal{L}(w, b) = \\prod_{i=1}^{n} \\hat{p}_i^{y_i} (1 - \\hat{p}_i)^{1-y_i}$$

対数を取ると（積が和になる）：

$$\\log \\mathcal{L} = \\sum_{i=1}^{n} \\left[ y_i \\log \\hat{p}_i + (1-y_i) \\log(1-\\hat{p}_i) \\right]$$

この**対数尤度を最大化する**ことと、**交差エントロピー損失を最小化する**ことは同じです（符号が逆なだけ）。`,
        },
        {
          type: "text",
          content: `下のデモで、パラメータを変えたときに尤度がどう変わるか見てみましょう。各データ点の「もっともらしさ」が棒グラフで表示されます。`,
        },
        {
          type: "interactive",
          id: "mle-demo",
        },
      ],
    },
    {
      id: "gradient",
      title: "勾配降下法（分類版）",
      blocks: [
        {
          type: "text",
          content: `ロジスティック回帰には解析解がありません。勾配降下法で最適化します。

交差エントロピー損失の勾配は驚くほどシンプルです：

$$\\frac{\\partial L}{\\partial w} = -\\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{p}_i) x_i$$

$$\\frac{\\partial L}{\\partial b} = -\\frac{1}{n} \\sum_{i=1}^{n} (y_i - \\hat{p}_i)$$

線形回帰の勾配と形がほぼ同じです！違いは $\\hat{y}_i$ が $\\hat{p}_i = \\sigma(wx_i + b)$ に変わっただけ。

更新式：

$$w \\leftarrow w - \\alpha \\frac{\\partial L}{\\partial w}, \\quad b \\leftarrow b - \\alpha \\frac{\\partial L}{\\partial b}$$`,
        },
        {
          type: "text",
          content: `下のデモで、勾配降下法がデータを分類する決定境界を学習していく様子を見てみましょう。`,
        },
        {
          type: "interactive",
          id: "logistic-gd",
        },
      ],
    },
    {
      id: "comparison",
      title: "線形回帰 vs ロジスティック回帰",
      blocks: [
        {
          type: "text",
          content: `ここで2つのモデルを整理しましょう：

| | 線形回帰 | ロジスティック回帰 |
|---|---|---|
| **タスク** | 回帰（連続値予測） | 分類（確率予測） |
| **モデル** | $\\hat{y} = wx + b$ | $\\hat{p} = \\sigma(wx + b)$ |
| **損失関数** | MSE | 交差エントロピー |
| **解析解** | あり | なし |
| **出力範囲** | $(-\\infty, +\\infty)$ | $(0, 1)$ |
| **最適化** | 勾配降下法 or 正規方程式 | 勾配降下法 |

共通点のほうが多いことに気づくでしょう。実は、両方とも**一般化線形モデル（GLM）**というフレームワークの特殊ケースです。`,
        },
        {
          type: "quiz",
          data: {
            question: "ロジスティック回帰に解析解がない理由は？",
            options: [
              "データが少なすぎるから",
              "シグモイド関数が損失を非線形にするため、微分を0とおいても閉じた形で解けない",
              "交差エントロピーが微分できないから",
              "パラメータが多すぎるから",
            ],
            answer: 1,
            explanation:
              "シグモイド関数が入ることで損失関数が w, b の非線形関数になり、偏微分=0 の方程式を代数的に解くことができません。そのため反復的な最適化（勾配降下法など）が必要です。",
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

**シグモイド関数：** $\\sigma(z) = \\frac{1}{1+e^{-z}}$ — 実数を確率に変換

**モデル：** $\\hat{p} = \\sigma(wx + b)$ — 入力からクラス1の確率を予測

**決定境界：** $wx + b = 0$ — 確率0.5の境界。線形分類器

**交差エントロピー損失：** 正しいクラスの対数尤度。自信のある間違いを強くペナルティ

**最尤推定：** 交差エントロピーの最小化 = 対数尤度の最大化

**勾配：** 線形回帰とほぼ同じ形。$\\hat{y}$ が $\\sigma(wx+b)$ に置き換わるだけ`,
        },
        {
          type: "text",
          content: `ロジスティック回帰は「線形回帰 + シグモイド」というシンプルな構造ですが、ニューラルネットワークの各ニューロンはまさにこの構造です。次のレッスンでは、モデルの性能を左右する**正則化と汎化**を学びます。`,
        },
        {
          type: "quiz",
          data: {
            question:
              "ロジスティック回帰の構造（線形変換 → 非線形関数）は、ニューラルネットワークのどの部分に対応する？",
            options: [
              "損失関数",
              "1つのニューロン（ユニット）",
              "バッチ正規化",
              "ドロップアウト",
            ],
            answer: 1,
            explanation:
              "ニューラルネットワークの各ニューロンは「入力の重み付き和 + バイアス → 活性化関数」という構造をしています。これはロジスティック回帰の「wx + b → σ(z)」とまったく同じです。ニューラルネットワークはロジスティック回帰を大量に組み合わせたものと言えます。",
          },
        },
      ],
    },
  ],
};

export default lesson2;
