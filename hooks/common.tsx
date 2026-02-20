import { MDXRemote } from "next-mdx-remote/rsc";

export const renderMd = async (content: string) => {
  return (
    <MDXRemote
      source={content}
      components={{
        p: (props: any) => <p style={{ fontSize: "1rem" }} {...props} />,
        h1: (props: any) => <h1 style={{ fontSize: "2rem" }} {...props} />,
        h2: (props: any) => <h2 style={{ fontSize: "1.5rem" }} {...props} />,
        h3: (props: any) => <h3 style={{ fontSize: "1.25rem" }} {...props} />,
      }}
    />
  );
};
