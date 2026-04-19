import type { ComponentType } from "react";
import ChunkingDemo from "./ChunkingDemo";
import ChunkSizeDemo from "./ChunkSizeDemo";

export const rag3Registry: Record<string, ComponentType> = {
  "chunking-demo": ChunkingDemo,
  "chunk-size-demo": ChunkSizeDemo,
};
