import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom code block rendering with syntax highlighting
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            return isInline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="code-block"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          // Custom link rendering to open in new tab
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props} />
          ),
          // Custom table styling
          table: ({ node, ...props }) => (
            <div className="table-wrapper">
              <table {...props} />
            </div>
          ),
          // Custom blockquote styling
          blockquote: ({ node, ...props }) => (
            <blockquote className="markdown-blockquote" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
