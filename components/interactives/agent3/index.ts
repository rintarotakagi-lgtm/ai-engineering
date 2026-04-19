import type { ComponentType } from "react";
import ChainDemo from "./ChainDemo";
import RoutingDemo from "./RoutingDemo";

export const agent3Registry: Record<string, ComponentType> = {
  "chain-demo": ChainDemo,
  "routing-demo": RoutingDemo,
};
