import type { ComponentType } from "react";
import RepoExplorer from "./RepoExplorer";
import CommitBuilder from "./CommitBuilder";
import BranchVisualizer from "./BranchVisualizer";
import HeadPointer from "./HeadPointer";

export const git2Registry: Record<string, ComponentType> = {
  "repo-explorer": RepoExplorer,
  "commit-builder": CommitBuilder,
  "branch-visualizer": BranchVisualizer,
  "head-pointer": HeadPointer,
};
