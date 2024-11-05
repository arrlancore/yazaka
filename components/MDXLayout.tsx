import { MDXRemote } from "next-mdx-remote";
import { components } from "./mdx-components";

interface MDXLayoutProps {
  content: any;
}

export default function MDXLayout({ content }: MDXLayoutProps) {
  if (!content) return null;
  return (
    <div className="mdx-content">
      <MDXRemote {...content} components={components} />
    </div>
  );
}
