import type { ComponentType } from "react";
import SDKArchitecture from "./SDKArchitecture";
import BuiltinToolsDemo from "./BuiltinToolsDemo";
import HooksDemo from "./HooksDemo";

export const agent8Registry: Record<string, ComponentType> = {
  "sdk-architecture": SDKArchitecture,
  "builtin-tools-demo": BuiltinToolsDemo,
  "hooks-demo": HooksDemo,
};
