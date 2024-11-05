import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { format } from "date-fns";

const POSTS_PATH = path.join(process.cwd(), "content/posts");

export function getAllPosts() {
  const files = fs.readdirSync(POSTS_PATH);

  const posts = files
    .map((filename) => {
      const filePath = path.join(POSTS_PATH, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data: frontmatter, content } = matter(fileContents);

      return {
        frontmatter: {
          ...frontmatter,
          date: format(new Date(frontmatter.date), "MMMM dd, yyyy"),
        },
        slug: filename.replace(".mdx", ""),
        content,
      };
    })
    .sort((a, b) => {
      return (
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
      );
    });

  return posts;
}

export function getPostBySlug(slug: string) {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(fileContents);

  return {
    frontmatter: {
      ...frontmatter,
      date: format(new Date(frontmatter.date), "MMMM dd, yyyy"),
    },
    content,
  };
}
