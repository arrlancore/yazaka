import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Remove the common leading indentation (inline template strings are indented,
// which markdown would otherwise treat as a code block).
function dedent(text: string): string {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/^\s*/)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n");
}

// Rendered with react-markdown (no runtime code evaluation, so it runs on
// Cloudflare Workers).
export const renderMd = async (content: string) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ node, ...props }: any) => <p style={{ fontSize: "1rem" }} {...props} />,
        h1: ({ node, ...props }: any) => <h1 style={{ fontSize: "2rem" }} {...props} />,
        h2: ({ node, ...props }: any) => <h2 style={{ fontSize: "1.5rem" }} {...props} />,
        h3: ({ node, ...props }: any) => <h3 style={{ fontSize: "1.25rem" }} {...props} />,
      }}
    >
      {dedent(content)}
    </ReactMarkdown>
  );
};
