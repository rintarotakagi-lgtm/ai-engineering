import type { ComponentType } from "react";
import ChaosDemo from "./ChaosDemo";
import GitHubFlowDemo from "./GitHubFlowDemo";
import GitFlowDemo from "./GitFlowDemo";
import NamingDemo from "./NamingDemo";

export const git7Registry: Record<string, ComponentType> = {
  "chaos-demo": ChaosDemo,
  "github-flow-demo": GitHubFlowDemo,
  "git-flow-demo": GitFlowDemo,
  "naming-demo": NamingDemo,
};
