import type { CurriculumItem } from "@/lib/types";

export const curriculum: CurriculumItem[] = [
  // Phase 1: 機械学習の理論
  {
    slug: "linear-regression",
    title: "線形回帰",
    subtitle: "損失関数、最小二乗法、勾配降下法",
    phase: "Phase 1: 機械学習の理論",
    available: true,
  },
  {
    slug: "logistic-regression",
    title: "ロジスティック回帰",
    subtitle: "シグモイド、交差エントロピー、最尤推定",
    phase: "Phase 1: 機械学習の理論",
    available: true,
  },
  {
    slug: "regularization",
    title: "正則化と汎化",
    subtitle: "バイアス-バリアンス、L1/L2、過学習",
    phase: "Phase 1: 機械学習の理論",
    available: true,
  },
  {
    slug: "kernel-svm",
    title: "カーネル法・SVM",
    subtitle: "非線形分離、カーネルトリック",
    phase: "Phase 1: 機械学習の理論",
    available: true,
  },
  // Phase 2: ニューラルネットワーク
  {
    slug: "perceptron-mlp",
    title: "パーセプトロン → 多層NN",
    subtitle: "万能近似定理、活性化関数",
    phase: "Phase 2: ニューラルネットワーク",
    available: true,
  },
  {
    slug: "backpropagation",
    title: "誤差逆伝播法",
    subtitle: "連鎖律、計算グラフ",
    phase: "Phase 2: ニューラルネットワーク",
    available: true,
  },
  {
    slug: "cnn",
    title: "CNN",
    subtitle: "畳み込み、プーリング、画像認識",
    phase: "Phase 2: ニューラルネットワーク",
    available: true,
  },
  {
    slug: "rnn-lstm",
    title: "RNN・LSTM",
    subtitle: "系列データ、勾配消失問題",
    phase: "Phase 2: ニューラルネットワーク",
    available: true,
  },
  // Phase 3: Transformerへの道
  {
    slug: "attention",
    title: "Attention機構",
    subtitle: "なぜRNNを超えたか",
    phase: "Phase 3: Transformerへの道",
    available: false,
  },
  {
    slug: "transformer",
    title: "Transformer",
    subtitle: "Self-Attention、位置エンコーディング",
    phase: "Phase 3: Transformerへの道",
    available: false,
  },
  {
    slug: "bert-vs-gpt",
    title: "BERT vs GPT",
    subtitle: "エンコーダ vs デコーダ、事前学習",
    phase: "Phase 3: Transformerへの道",
    available: false,
  },
  // Phase 4: LLMの科学
  {
    slug: "tokenization-embedding",
    title: "トークナイゼーションと埋め込み",
    subtitle: "BPE、Word2Vec",
    phase: "Phase 4: LLMの科学",
    available: false,
  },
  {
    slug: "scaling-laws",
    title: "スケーリング則",
    subtitle: "パラメータ数・データ量・計算量",
    phase: "Phase 4: LLMの科学",
    available: false,
  },
  {
    slug: "rlhf",
    title: "RLHF・Constitutional AI",
    subtitle: "アラインメント",
    phase: "Phase 4: LLMの科学",
    available: false,
  },
  {
    slug: "inference",
    title: "推論の仕組み",
    subtitle: "Temperature、Top-k/p、ビームサーチ",
    phase: "Phase 4: LLMの科学",
    available: false,
  },
];
