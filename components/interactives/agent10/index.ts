import type { ComponentType } from "react";
import BrainHandsDemo from "./BrainHandsDemo";
import SessionDemo from "./SessionDemo";
import ProductionChecklist from "./ProductionChecklist";

export const agent10Registry: Record<string, ComponentType> = {
  "brain-hands-demo": BrainHandsDemo,
  "session-demo": SessionDemo,
  "production-checklist": ProductionChecklist,
};
