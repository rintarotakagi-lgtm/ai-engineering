import type { Lesson } from "@/lib/types";

const lesson6: Lesson = {
  slug: "backpropagation",
  title: "誤差逆伝播法",
  subtitle:
    "計算グラフ、連鎖律、逆伝播のステップ、勾配消失問題 — ニューラルネットワークの学習アルゴリズム",
  sections: [
    {
      id: "intro",
      title: "はじめに",
      blocks: [
        {
          type: "text",
          content: `前回のレッスンで、多層ネットワークが強力な表現力を持つことを学びました。しかし、大きな問題が残っていました：

$$\\text{重み} \\mathbf{W} \\text{をどう学習させるか？}$$

1層のパーセプトロンなら、損失関数の勾配を直接計算できました。しかし多層ネットワークでは、**出力層の誤差が隠れ層にどう影響しているか**を知る必要があります。

この問題を解決するのが**誤差逆伝播法（Backpropagation）**です。1986年にRumelhart, Hinton, Williamsが（再）発見し、ニューラルネットワークの実用化を可能にした、機械学習史上最も重要なアルゴリズムの1つです。

キーワード：
- **計算グラフ** — 演算をノードとエッジで表す
- **連鎖律** — 合成関数の微分の基本法則
- **逆伝播** — 出力から入力に向かって勾配を伝える
- **勾配消失問題** — 深いネットワークの学習を阻む壁`,
        },
      ],
    },
    {
      id: "computation-graph",
      title: "計算グラフ",
      blocks: [
        {
          type: "text",
          content: `逆伝播を理解する第一歩は、ニューラルネットワークの計算を**グラフ構造**で捉えることです。

**計算グラフ（Computation Graph）**とは、数式を「ノード（演算）」と「エッジ（データの流れ）」で表現したものです。

例えば、$y = (x_1 \\cdot w_1 + x_2 \\cdot w_2) + b$ という計算は：

1. $x_1 \\cdot w_1$ を計算（掛け算ノード）
2. $x_2 \\cdot w_2$ を計算（掛け算ノード）
3. 結果を足す（足し算ノード）
4. バイアス $b$ を足す（足し算ノード）

という順番で、左から右に計算が流れます。これが**順伝播（Forward Pass）**です。`,
        },
        {
          type: "text",
          content: `計算グラフの利点は、**逆方向にたどることで勾配を効率的に計算できる**ことです。各ノードは「局所的な微分」だけ知っていればよく、全体の微分はそれを掛け合わせるだけで求まります。

下のデモで、シンプルな2層ネットワークの計算グラフを見てみましょう。「Forward」ボタンで数値が順伝播する様子をアニメーションで確認できます。`,
        },
        {
          type: "interactive",
          id: "computation-graph",
        },
      ],
    },
    {
      id: "chain-rule",
      title: "連鎖律",
      blocks: [
        {
          type: "text",
          content: `逆伝播の数学的基盤は**連鎖律（Chain Rule）**です。

合成関数 $y = f(g(x))$ の微分は：

$$\\frac{dy}{dx} = \\frac{dy}{dg} \\cdot \\frac{dg}{dx}$$

つまり、**各段階の微分を掛け合わせる**だけです。

3段の合成なら：$y = f(g(h(x)))$

$$\\frac{dy}{dx} = \\frac{dy}{df} \\cdot \\frac{df}{dg} \\cdot \\frac{dg}{dh} \\cdot \\frac{dh}{dx}$$

これが逆伝播の核心です。ネットワークの各層は「関数の合成」なので、連鎖律で出力から入力まで勾配を伝播できます。`,
        },
        {
          type: "text",
          content: `具体例で見てみましょう。$f(x) = (2x + 1)^2$ を連鎖律で微分します：

- 外側の関数：$f(u) = u^2$ → $\\frac{df}{du} = 2u$
- 内側の関数：$g(x) = 2x + 1$ → $\\frac{dg}{dx} = 2$

$$\\frac{df}{dx} = \\frac{df}{du} \\cdot \\frac{du}{dx} = 2u \\cdot 2 = 2(2x+1) \\cdot 2 = 4(2x+1)$$

下のデモで、連鎖律がどう機能するかステップバイステップで確認しましょう。`,
        },
        {
          type: "interactive",
          id: "chain-rule-demo",
        },
        {
          type: "quiz",
          data: {
            question:
              "$y = \\sigma(3x + 2)$ の $x$ に関する微分 $\\frac{dy}{dx}$ は？（$\\sigma$ はシグモイド関数、$\\sigma'(z) = \\sigma(z)(1-\\sigma(z))$）",
            options: [
              "$\\sigma(3x+2)(1-\\sigma(3x+2))$",
              "$3\\sigma(3x+2)(1-\\sigma(3x+2))$",
              "$3\\sigma(3x+2)$",
              "$(3x+2)\\sigma(3x+2)(1-\\sigma(3x+2))$",
            ],
            answer: 1,
            explanation:
              "連鎖律を適用します。外側: σ'(z) = σ(z)(1-σ(z))、内側: (3x+2)' = 3。よって dy/dx = σ(3x+2)(1-σ(3x+2)) × 3 = 3σ(3x+2)(1-σ(3x+2))。連鎖律では各段階の微分を掛け合わせるだけです。",
          },
        },
      ],
    },
    {
      id: "backprop-steps",
      title: "逆伝播のステップ",
      blocks: [
        {
          type: "text",
          content: `いよいよ逆伝播の具体的な手順です。小さなネットワーク（2入力→2隠れ→1出力）で流れを追います。

**Step 1: 順伝播（Forward Pass）**
入力から出力まで計算を進め、各ノードの値を記録します。

$$z^{(1)} = W^{(1)}x + b^{(1)}, \\quad h = \\sigma(z^{(1)})$$
$$z^{(2)} = W^{(2)}h + b^{(2)}, \\quad \\hat{y} = \\sigma(z^{(2)})$$

**Step 2: 損失の計算**
予測値と正解値の誤差を計算します。

$$L = \\frac{1}{2}(y - \\hat{y})^2$$

**Step 3: 逆伝播（Backward Pass）**
出力層から入力層に向かって、各パラメータの勾配を計算します。`,
        },
        {
          type: "text",
          content: `逆伝播の勾配計算をもう少し詳しく見ましょう。

出力層の勾配：
$$\\frac{\\partial L}{\\partial \\hat{y}} = -(y - \\hat{y})$$

$$\\frac{\\partial L}{\\partial z^{(2)}} = \\frac{\\partial L}{\\partial \\hat{y}} \\cdot \\sigma'(z^{(2)})$$

隠れ層への伝播：
$$\\frac{\\partial L}{\\partial W^{(2)}} = \\frac{\\partial L}{\\partial z^{(2)}} \\cdot h^T$$

$$\\frac{\\partial L}{\\partial h} = (W^{(2)})^T \\cdot \\frac{\\partial L}{\\partial z^{(2)}}$$

さらに入力層側へ：
$$\\frac{\\partial L}{\\partial z^{(1)}} = \\frac{\\partial L}{\\partial h} \\cdot \\sigma'(z^{(1)})$$

下のデモで、1ステップずつ順伝播と逆伝播を体験しましょう。各ノードの勾配がどう計算されるか注目してください。`,
        },
        {
          type: "interactive",
          id: "backprop-step",
        },
        {
          type: "quiz",
          data: {
            question:
              "逆伝播で勾配を計算するとき、順伝播の結果が必要な理由は？",
            options: [
              "計算速度を上げるため",
              "連鎖律の各段階の微分に、順伝播時の値（活性化の出力など）が含まれるから",
              "勾配の符号を決めるため",
              "バイアスの値を更新するため",
            ],
            answer: 1,
            explanation:
              "例えばシグモイドの微分 σ'(z) = σ(z)(1-σ(z)) を計算するには σ(z) の値が必要です。重みの勾配 ∂L/∂W にも、前の層の活性化 h の値が含まれます。だから順伝播で各ノードの値を保存しておく必要があるのです。",
          },
        },
      ],
    },
    {
      id: "vanishing-gradient",
      title: "勾配消失問題",
      blocks: [
        {
          type: "text",
          content: `逆伝播には大きな弱点があります。**勾配消失問題（Vanishing Gradient Problem）**です。

シグモイド関数の導関数 $\\sigma'(z) = \\sigma(z)(1-\\sigma(z))$ の最大値は **0.25**（$z=0$ のとき）です。

連鎖律で各層の勾配を掛け合わせると：

$$\\frac{\\partial L}{\\partial W^{(1)}} \\propto \\sigma'(z^{(1)}) \\cdot \\sigma'(z^{(2)}) \\cdot \\ldots \\cdot \\sigma'(z^{(n)})$$

$n$ 層あると、勾配は最大で $(0.25)^n$ 倍に縮小します：

| 層数 | 最大勾配スケール |
|---|---|
| 2層 | 0.0625 |
| 5層 | 0.00098 |
| 10層 | 0.00000095 |

入力に近い層ほど勾配がほぼゼロになり、**学習がほとんど進まない**のです。`,
        },
        {
          type: "text",
          content: `この問題の解決策として、**ReLU（Rectified Linear Unit）**が広く使われています。

$$\\text{ReLU}(z) = \\max(0, z), \\quad \\text{ReLU}'(z) = \\begin{cases} 1 & z > 0 \\\\ 0 & z \\leq 0 \\end{cases}$$

ReLUの導関数は $z > 0$ で**常に1**なので、勾配が層を通過しても縮小しません。これが深層学習を実用的にした大きな要因の1つです。

下のデモで、シグモイドとReLUの層数を変えて、勾配がどう変化するか比較してみましょう。`,
        },
        {
          type: "interactive",
          id: "vanishing-gradient",
        },
        {
          type: "quiz",
          data: {
            question:
              "勾配消失問題が最も深刻になるのはどの状況？",
            options: [
              "ReLU活性化関数を使い、層数が少ない場合",
              "シグモイド活性化関数を使い、層数が多い場合",
              "学習率が大きすぎる場合",
              "バッチサイズが小さい場合",
            ],
            answer: 1,
            explanation:
              "シグモイドの導関数の最大値は0.25です。層数が増えるほどこれが掛け合わされ、入力に近い層の勾配は指数的に小さくなります。ReLUはz>0で導関数が1なので、この問題を大幅に軽減します。",
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

**計算グラフ：** ネットワークの計算をノードとエッジで表現。順伝播は左→右、逆伝播は右→左

**連鎖律：** 合成関数の微分は各段階の微分の積。$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$

**逆伝播のステップ：**
1. 順伝播で各ノードの値を計算・記録
2. 損失を計算
3. 出力から入力に向かって勾配を計算（連鎖律で伝播）
4. 勾配を使ってパラメータを更新

**勾配消失問題：** シグモイドでは層が深くなると勾配が指数的に縮小。ReLUで大幅に軽減`,
        },
        {
          type: "text",
          content: `逆伝播法は「出力の誤差を、各パラメータがどれだけ責任を持つかを定量的に分配する」アルゴリズムです。連鎖律という単純な数学的原理に基づきながら、何百万ものパラメータを効率的に学習できる — これが深層学習の基盤です。

次のレッスンでは、計算された勾配を使って実際にパラメータを更新する**最適化アルゴリズム（SGD, Adam など）**を学びます。`,
        },
      ],
    },
  ],
};

export default lesson6;
