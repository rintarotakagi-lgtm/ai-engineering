import type { ComponentType } from "react";
import EncoderDecoderCompare from "./EncoderDecoderCompare";
import MLMDemo from "./MLMDemo";
import AutoregressiveDemo from "./AutoregressiveDemo";
import PretrainFinetuneDemo from "./PretrainFinetuneDemo";

export const lesson11Registry: Record<string, ComponentType> = {
  "encoder-decoder-compare": EncoderDecoderCompare,
  "mlm-demo": MLMDemo,
  "autoregressive-demo": AutoregressiveDemo,
  "pretrain-finetune-demo": PretrainFinetuneDemo,
};
