import type { ComponentType } from "react";
import SpectrumDemo from "./SpectrumDemo";
import DecisionTreeDemo from "./DecisionTreeDemo";

export const agent1Registry: Record<string, ComponentType> = {
  "spectrum-demo": SpectrumDemo,
  "decision-tree-demo": DecisionTreeDemo,
};
