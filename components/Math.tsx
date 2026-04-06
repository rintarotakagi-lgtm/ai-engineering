"use client";

import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export function InlineFormula({ math }: { math: string }) {
  return <InlineMath math={math} />;
}

export function BlockFormula({ math }: { math: string }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg border-l-4 border-amber-400 bg-zinc-50 px-6 py-4 dark:bg-zinc-900">
      <BlockMath math={math} />
    </div>
  );
}
