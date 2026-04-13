import type { ComponentType } from "react";
import NextTokenDemo from "./NextTokenDemo";
import TemperatureDemo from "./TemperatureDemo";
import SamplingDemo from "./SamplingDemo";
import BeamSearchDemo from "./BeamSearchDemo";

export const lesson15Registry: Record<string, ComponentType> = {
  "next-token-demo": NextTokenDemo,
  "temperature-demo": TemperatureDemo,
  "sampling-demo": SamplingDemo,
  "beam-search-demo": BeamSearchDemo,
};
