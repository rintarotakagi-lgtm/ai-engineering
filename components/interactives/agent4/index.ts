import type { ComponentType } from "react";
import ParallelDemo from "./ParallelDemo";
import OrchestratorDemo from "./OrchestratorDemo";

export const agent4Registry: Record<string, ComponentType> = {
  "parallel-demo": ParallelDemo,
  "orchestrator-demo": OrchestratorDemo,
};
