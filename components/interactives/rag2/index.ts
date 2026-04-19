import type { ComponentType } from "react";
import EmbeddingSpace from "./EmbeddingSpace";
import SimilarityDemo from "./SimilarityDemo";

export const rag2Registry: Record<string, ComponentType> = {
  "embedding-space": EmbeddingSpace,
  "similarity-demo": SimilarityDemo,
};
