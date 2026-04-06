"use client";

import { InlineFormula, BlockFormula } from "./Math";

type Props = {
  content: string;
};

type Segment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "inline-math"; value: string }
  | { type: "block-math"; value: string };

function parseInline(text: string): Segment[] {
  const segments: Segment[] = [];
  const pattern = /\*\*(.+?)\*\*|\$(.+?)\$/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: "bold", value: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: "inline-math", value: match[2] });
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
}

function renderInlineSegments(segments: Segment[]) {
  return segments.map((seg, i) => {
    switch (seg.type) {
      case "text":
        return <span key={i}>{seg.value}</span>;
      case "bold":
        return (
          <strong key={i} className="font-semibold">
            {seg.value}
          </strong>
        );
      case "inline-math":
        return <InlineFormula key={i} math={seg.value} />;
      default:
        return null;
    }
  });
}

export default function RichText({ content }: Props) {
  // Split by block math ($$...$$) first
  const blockParts = content.split(/\$\$([\s\S]+?)\$\$/);

  return (
    <div className="space-y-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
      {blockParts.map((part, i) => {
        // Odd indices are block math content
        if (i % 2 === 1) {
          return <BlockFormula key={i} math={part.trim()} />;
        }

        // Even indices are text — split by newlines for paragraphs
        const paragraphs = part
          .split(/\n\n+/)
          .map((p) => p.trim())
          .filter(Boolean);

        return paragraphs.map((paragraph, j) => (
          <p key={`${i}-${j}`}>{renderInlineSegments(parseInline(paragraph))}</p>
        ));
      })}
    </div>
  );
}
