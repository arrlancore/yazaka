import { convertMDToContent } from "@/lib/mdx/mdx-utils";

export const renderMd = (content: string) =>
  convertMDToContent(content, {
    p: (props: any) => <p style={{ fontSize: "1rem" }} {...props} />,
    h1: (props: any) => <h1 style={{ fontSize: "2rem" }} {...props} />,
    h2: (props: any) => <h2 style={{ fontSize: "1.5rem" }} {...props} />,
    h3: (props: any) => <h3 style={{ fontSize: "1.25rem" }} {...props} />,
  });
