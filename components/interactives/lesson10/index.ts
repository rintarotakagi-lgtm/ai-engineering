import type { ComponentType } from "react";
import SelfAttentionDemo from "./SelfAttentionDemo";
import MultiHeadDemo from "./MultiHeadDemo";
import PositionalEncoding from "./PositionalEncoding";
import TransformerBlock from "./TransformerBlock";

export const lesson10Registry: Record<string, ComponentType> = {
  "self-attention-demo": SelfAttentionDemo,
  "multi-head-demo": MultiHeadDemo,
  "positional-encoding-demo": PositionalEncoding,
  "transformer-block-demo": TransformerBlock,
};
