import type { ComponentType } from "react";
import LineFit from "./LineFit";
import LossLandscape from "./LossLandscape";
import AnalyticalDemo from "./AnalyticalDemo";
import GradientDescent from "./GradientDescent";
import LRComparison from "./LRComparison";
import MatrixDemo from "./MatrixDemo";

export const interactiveRegistry: Record<string, ComponentType> = {
  "line-fit": LineFit,
  "loss-landscape": LossLandscape,
  "analytical-demo": AnalyticalDemo,
  "gradient-descent": GradientDescent,
  "lr-comparison": LRComparison,
  "matrix-demo": MatrixDemo,
};
