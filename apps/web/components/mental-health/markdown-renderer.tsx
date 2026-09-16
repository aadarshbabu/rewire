"use client";

import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-3.5 mb-2 pb-1 border-b border-zinc-200/80 dark:border-zinc-800/80 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mt-3 mb-1.5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100 mt-2.5 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 leading-relaxed break-words">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-4 space-y-1 mb-2.5 marker:text-teal-600 dark:marker:text-teal-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-4 space-y-1 mb-2.5 marker:text-teal-600 dark:marker:text-teal-400">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-teal-500 bg-teal-50/60 dark:bg-teal-950/30 px-3.5 py-1.5 rounded-r-lg my-2.5 text-zinc-700 dark:text-zinc-300 italic text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-zinc-900 dark:text-zinc-50">
              {children}
            </strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 dark:text-teal-400 underline underline-offset-2 hover:text-teal-700 dark:hover:text-teal-300 transition-colors font-medium inline-flex items-center gap-0.5"
            >
              {children}
            </a>
          ),
          hr: () => (
            <hr className="my-3.5 border-zinc-200/80 dark:border-zinc-800/80" />
          ),
          table: ({ children }) => (
            <div className="my-2.5 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <table className="w-full text-left text-xs border-collapse divide-y divide-zinc-200 dark:divide-zinc-800">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100/80 dark:bg-zinc-800/60 font-semibold text-zinc-900 dark:text-zinc-100">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {children}
            </tbody>
          ),
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => (
            <th className="px-3 py-2 font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-1.5 text-zinc-700 dark:text-zinc-300">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const isMultiLine =
              typeof children === "string" && children.includes("\n");

            if (!match && !isMultiLine) {
              return (
                <code
                  className="rounded-md bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[12px] text-teal-700 dark:text-teal-300 font-medium border border-zinc-200/60 dark:border-zinc-700/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className={`block font-mono text-xs text-zinc-100 ${className || ""}`}
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2.5 overflow-x-auto rounded-xl bg-zinc-950 p-3.5 text-xs text-zinc-100 border border-zinc-800 shadow-inner">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
