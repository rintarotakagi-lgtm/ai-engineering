import type { ComponentType } from "react";
import VersionTimeline from "./VersionTimeline";
import GitVsManual from "./GitVsManual";
import ThreeStates from "./ThreeStates";

export const git1Registry: Record<string, ComponentType> = {
  "version-timeline": VersionTimeline,
  "git-vs-manual": GitVsManual,
  "three-states": ThreeStates,
};
