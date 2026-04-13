import type { ComponentType } from "react";
import ParamScaling from "./ParamScaling";
import DataScaling from "./DataScaling";
import ChinchillaDemo from "./ChinchillaDemo";
import EmergentDemo from "./EmergentDemo";

export const lesson13Registry: Record<string, ComponentType> = {
  "param-scaling": ParamScaling,
  "data-scaling": DataScaling,
  "chinchilla-demo": ChinchillaDemo,
  "emergent-demo": EmergentDemo,
};
