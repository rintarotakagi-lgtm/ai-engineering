import type { ComponentType } from "react";
import ConvolutionDemo from "./ConvolutionDemo";
import FeatureMapDemo from "./FeatureMapDemo";
import PoolingDemo from "./PoolingDemo";
import CNNArchitecture from "./CNNArchitecture";

export const lesson7Registry: Record<string, ComponentType> = {
  "convolution-demo": ConvolutionDemo,
  "feature-map-demo": FeatureMapDemo,
  "pooling-demo": PoolingDemo,
  "cnn-architecture": CNNArchitecture,
};
