import type { ComponentType } from "react";
import ToolUseDemo from "./ToolUseDemo";
import MemoryDemo from "./MemoryDemo";

export const agent2Registry: Record<string, ComponentType> = {
  "tool-use-demo": ToolUseDemo,
  "memory-demo": MemoryDemo,
};
