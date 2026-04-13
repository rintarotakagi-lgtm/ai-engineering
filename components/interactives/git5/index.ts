import type { ComponentType } from "react";
import WhyBranch from "./WhyBranch";
import BranchSwitch from "./BranchSwitch";
import MergeDemo from "./MergeDemo";
import ConflictDemo from "./ConflictDemo";

export const git5Registry: Record<string, ComponentType> = {
  "why-branch": WhyBranch,
  "branch-switch": BranchSwitch,
  "merge-demo": MergeDemo,
  "conflict-demo": ConflictDemo,
};
