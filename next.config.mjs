import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const isDev = process.env.NODE_ENV === "development";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: next build writes plain HTML/JS/CSS to out/, served by
  // Cloudflare as static assets without invoking a Worker (no CPU limit).
  ...(isDev ? {} : { output: "export" }),
  staticPageGenerationTimeout: 180,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: true,
  },
  // Pre-existing lint errors (no-explicit-any etc.) would fail the build under
  // eslint-config-next 15; run `npm run lint` separately instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // No image optimizer on a static host
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.it",
      },
    ],
  },
};


const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
