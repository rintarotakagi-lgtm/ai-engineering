"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";

type Props = {
  content: string;
};

const components: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{children}</h3>
  ),

  // Paragraph
  p: ({ children }) => (
    <p className="leading-7 text-zinc-700 dark:text-zinc-300">{children}</p>
  ),

  // Bold / italic
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,

  // Inline code
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) return <code className={className}>{children}</code>;
    return (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
        {children}
      </code>
    );
  },

  // Code block
  pre: ({ children }) => (
    <pre className="my-4 overflow-x-auto rounded-xl bg-zinc-900 px-5 py-4 text-sm leading-6 text-zinc-100 dark:bg-zinc-800">
      {children}
    </pre>
  ),

  // Lists
  ul: ({ children }) => (
    <ul className="my-2 space-y-1 pl-5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="leading-7 text-zinc-700 marker:text-zinc-400 dark:text-zinc-300 [&>ul]:my-1">
      {children}
    </li>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-4 border-zinc-300 pl-4 text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => <hr className="my-6 border-zinc-200 dark:border-zinc-700" />,
};

export default function RichText({ content }: Props) {
  return (
    <div className="space-y-4 text-base">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
