import type { ComponentType } from "react";
import PipelineSteps from "./PipelineSteps";

export const rag4Registry: Record<string, ComponentType> = {
  "pipeline-steps": PipelineSteps,
};
