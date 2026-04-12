import type { ComponentType } from "react";
import BiasVarianceDemo from "./BiasVarianceDemo";
import OverfittingDemo from "./OverfittingDemo";
import RidgeDemo from "./RidgeDemo";
import LassoDemo from "./LassoDemo";
import RegularizationCompare from "./RegularizationCompare";

export const lesson3Registry: Record<string, ComponentType> = {
  "bias-variance": BiasVarianceDemo,
  "overfitting": OverfittingDemo,
  "ridge": RidgeDemo,
  "lasso": LassoDemo,
  "regularization-compare": RegularizationCompare,
};
