import type { ComponentType } from "react";
import TokenizerDemo from "./TokenizerDemo";
import BPEDemo from "./BPEDemo";
import EmbeddingDemo from "./EmbeddingDemo";
import Word2VecDemo from "./Word2VecDemo";

export const lesson12Registry: Record<string, ComponentType> = {
  "tokenizer-demo": TokenizerDemo,
  "bpe-demo": BPEDemo,
  "embedding-demo": EmbeddingDemo,
  "word2vec-demo": Word2VecDemo,
};
