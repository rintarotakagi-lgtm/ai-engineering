import type { ComponentType } from "react";
import AttentionIntuition from "./AttentionIntuition";
import ScoreDemo from "./ScoreDemo";
import SoftmaxDemo from "./SoftmaxDemo";
import AttentionCalc from "./AttentionCalc";

export const lesson9Registry: Record<string, ComponentType> = {
  "attention-intuition": AttentionIntuition,
  "score-demo": ScoreDemo,
  "softmax-demo": SoftmaxDemo,
  "attention-calc": AttentionCalc,
};
