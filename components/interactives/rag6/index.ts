import type { ComponentType } from "react";
import HybridSearchDemo from "./HybridSearchDemo";
import MultiStepDemo from "./MultiStepDemo";

export const rag6Registry: Record<string, ComponentType> = {
  "hybrid-search-demo": HybridSearchDemo,
  "multi-step-demo": MultiStepDemo,
};
