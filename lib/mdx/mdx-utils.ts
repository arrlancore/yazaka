import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import readingTime from "reading-time";
import { Post, PostMeta } from "@/types/blog";

const POSTS_PATH = path.join(process.cwd(), "content/posts");

const randomImage = "https://unsplash.it/640/425?";

function getPostFilePaths(): string[] {
  return fs.readdirSync(POSTS_PATH).filter((path) => /\.mdx?$/.test(path));
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const posts = getPostFilePaths()
    .map((filePath) => {
      const source = fs.readFileSync(path.join(POSTS_PATH, filePath), "utf8");
      const { data } = matter(source);

      const randomImageUrl =
        randomImage + data.tags ? randomImage + data.tags[0] : "";

      return {
        ...data,
        slug: filePath.replace(/\.mdx?$/, ""),
        readingTime: readingTime(source).text,
        image: data.image || randomImageUrl,
      } as PostMeta;
    })
    .filter((post) => post.draft !== true)
    .sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

  return posts;
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const postFilePath = path.join(POSTS_PATH, `${slug}.mdx`);
  const source = fs.readFileSync(postFilePath, "utf8");

  const { content, data } = matter(source);
  const mdxContent = await MDXRemote({
    source: content,
    components: {},
  });

  const randomImageUrl =
    randomImage + data.tags ? randomImage + data.tags[0] : "";

  return {
    content: mdxContent,
    ...data,
    slug,
    readingTime: readingTime(content).text,
    image: data.image || randomImageUrl,
  } as Post;
}
