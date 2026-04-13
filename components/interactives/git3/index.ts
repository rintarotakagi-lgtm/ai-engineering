import type { ComponentType } from "react";
import GitVsGitHub from "./GitVsGitHub";
import RepoCreator from "./RepoCreator";
import ReadmeEditor from "./ReadmeEditor";
import CloneDemo from "./CloneDemo";

export const git3Registry: Record<string, ComponentType> = {
  "git-vs-github": GitVsGitHub,
  "repo-creator": RepoCreator,
  "readme-editor": ReadmeEditor,
  "clone-demo": CloneDemo,
};
