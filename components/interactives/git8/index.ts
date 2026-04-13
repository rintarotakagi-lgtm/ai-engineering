import type { ComponentType } from "react";
import UndoMap from "./UndoMap";
import StashDemo from "./StashDemo";
import ResetDemo from "./ResetDemo";
import RevertDemo from "./RevertDemo";
import GitignoreDemo from "./GitignoreDemo";

export const git8Registry: Record<string, ComponentType> = {
  "undo-map": UndoMap,
  "stash-demo": StashDemo,
  "reset-demo": ResetDemo,
  "revert-demo": RevertDemo,
  "gitignore-demo": GitignoreDemo,
};
