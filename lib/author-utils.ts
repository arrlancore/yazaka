import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Author } from "@/types/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import components from "./mdx/mdx-components";

const authorsDirectory = path.join(process.cwd(), "content/authors");

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const fullPath = path.join(authorsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const mdxContent = await MDXRemote({
    source: content,
    components: components,
  });

  const author: Author = {
    name: data.name,
    slug: slug,
    bio: mdxContent,
    avatar: data.avatar,
    socialLinks: data.socialLinks,
    summary: data.summary,
  };

  return author;
}
