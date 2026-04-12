import type { ComponentType } from "react";
import RNNUnrolled from "./RNNUnrolled";
import BPTTDemo from "./BPTTDemo";
import LongRangeDemo from "./LongRangeDemo";
import LSTMCell from "./LSTMCell";

export const lesson8Registry: Record<string, ComponentType> = {
  "rnn-unrolled": RNNUnrolled,
  "bptt-demo": BPTTDemo,
  "long-range-demo": LongRangeDemo,
  "lstm-cell": LSTMCell,
};
