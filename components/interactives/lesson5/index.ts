import type { ComponentType } from "react";
import PerceptronDemo from "./PerceptronDemo";
import XORDemo from "./XORDemo";
import NetworkBuilder from "./NetworkBuilder";
import ActivationExplorer from "./ActivationExplorer";
import UniversalApprox from "./UniversalApprox";

export const lesson5Registry: Record<string, ComponentType> = {
  "perceptron-demo": PerceptronDemo,
  "xor-demo": XORDemo,
  "network-builder": NetworkBuilder,
  "activation-explorer": ActivationExplorer,
  "universal-approx": UniversalApprox,
};
