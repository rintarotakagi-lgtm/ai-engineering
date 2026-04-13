import type { ComponentType } from "react";
import SFTDemo from "./SFTDemo";
import RewardModelDemo from "./RewardModelDemo";
import RLHFPipeline from "./RLHFPipeline";
import CAIDemo from "./CAIDemo";

export const lesson14Registry: Record<string, ComponentType> = {
  "sft-demo": SFTDemo,
  "reward-model-demo": RewardModelDemo,
  "rlhf-pipeline": RLHFPipeline,
  "cai-demo": CAIDemo,
};
