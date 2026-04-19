import type { ComponentType } from "react";
import ReActDemo from "./ReActDemo";
import AgentTraceDemo from "./AgentTraceDemo";

export const agent6Registry: Record<string, ComponentType> = {
  "react-demo": ReActDemo,
  "agent-trace-demo": AgentTraceDemo,
};
