import type { ComponentType } from "react";
import ToolSpecDemo from "./ToolSpecDemo";
import ToolDesignQuiz from "./ToolDesignQuiz";

export const agent7Registry: Record<string, ComponentType> = {
  "tool-spec-demo": ToolSpecDemo,
  "tool-design-quiz": ToolDesignQuiz,
};
