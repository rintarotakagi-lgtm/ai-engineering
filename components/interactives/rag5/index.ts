import type { ComponentType } from "react";
import GroundingDemo from "./GroundingDemo";
import RerankDemo from "./RerankDemo";

export const rag5Registry: Record<string, ComponentType> = {
  "grounding-demo": GroundingDemo,
  "rerank-demo": RerankDemo,
};
