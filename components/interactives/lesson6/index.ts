import type { ComponentType } from "react";
import ComputationGraph from "./ComputationGraph";
import ChainRuleDemo from "./ChainRuleDemo";
import BackpropStep from "./BackpropStep";
import VanishingGradient from "./VanishingGradient";

export const lesson6Registry: Record<string, ComponentType> = {
  "computation-graph": ComputationGraph,
  "chain-rule-demo": ChainRuleDemo,
  "backprop-step": BackpropStep,
  "vanishing-gradient": VanishingGradient,
};
