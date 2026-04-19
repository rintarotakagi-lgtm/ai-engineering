import type { ComponentType } from "react";
import RAGConceptDemo from "./RAGConceptDemo";
import RAGPipeline from "./RAGPipeline";

export const rag1Registry: Record<string, ComponentType> = {
  "rag-concept-demo": RAGConceptDemo,
  "rag-pipeline-overview": RAGPipeline,
};
