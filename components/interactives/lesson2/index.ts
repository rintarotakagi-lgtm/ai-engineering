import type { ComponentType } from "react";
import SigmoidExplorer from "./SigmoidExplorer";
import DecisionBoundary from "./DecisionBoundary";
import CrossEntropyViz from "./CrossEntropyViz";
import MLEDemo from "./MLEDemo";
import LogisticGD from "./LogisticGD";

export const lesson2Registry: Record<string, ComponentType> = {
  "sigmoid-explorer": SigmoidExplorer,
  "decision-boundary": DecisionBoundary,
  "cross-entropy-viz": CrossEntropyViz,
  "mle-demo": MLEDemo,
  "logistic-gd": LogisticGD,
};
