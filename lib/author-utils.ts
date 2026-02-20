import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Author } from "@/types/blog";

const authorsDirectory = path.join(process.cwd(), "content/authors");

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const fullPath = path.join(authorsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const author: Author = {
    name: data.name,
    slug: slug,
    bio: content, // Store MDX source string
    avatar: data.avatar,
    socialLinks: data.socialLinks,
    summary: data.summary,
  };

  return author;
}
