import type { ComponentType } from "react";
import PRConcept from "./PRConcept";
import PRCreator from "./PRCreator";
import ReviewDemo from "./ReviewDemo";
import PRMerge from "./PRMerge";

export const git6Registry: Record<string, ComponentType> = {
  "pr-concept": PRConcept,
  "pr-creator": PRCreator,
  "review-demo": ReviewDemo,
  "pr-merge": PRMerge,
};
