import type { ComponentType } from "react";
import WorkflowOverview from "./WorkflowOverview";
import StagingDemo from "./StagingDemo";
import CommitDemo from "./CommitDemo";
import PushDemo from "./PushDemo";
import PullDemo from "./PullDemo";

export const git4Registry: Record<string, ComponentType> = {
  "workflow-overview": WorkflowOverview,
  "staging-demo": StagingDemo,
  "commit-demo": CommitDemo,
  "push-demo": PushDemo,
  "pull-demo": PullDemo,
};
