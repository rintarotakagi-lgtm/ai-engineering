import type { ComponentType } from "react";
import MarginDemo from "./MarginDemo";
import SoftMarginDemo from "./SoftMarginDemo";
import KernelDemo from "./KernelDemo";
import RBFGammaDemo from "./RBFGammaDemo";

export const lesson4Registry: Record<string, ComponentType> = {
  "margin-demo": MarginDemo,
  "soft-margin-demo": SoftMarginDemo,
  "kernel-demo": KernelDemo,
  "rbf-gamma-demo": RBFGammaDemo,
};
