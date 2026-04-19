import type { ComponentType } from "react";
import SubagentDemo from "./SubagentDemo";
import MCPDemo from "./MCPDemo";

export const agent9Registry: Record<string, ComponentType> = {
  "subagent-demo": SubagentDemo,
  "mcp-demo": MCPDemo,
};
