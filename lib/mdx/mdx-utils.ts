import { notFound } from "next/navigation";
import { Post, PostMeta } from "@/types/blog";
import { getAuthorBySlug } from "../author-utils";
import { postEntries, hasEntry } from "../content-source";

const randomImage = "https://unsplash.it/640/425?";

function getPostSlugs(): string[] {
  return Object.keys(postEntries);
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const currentDate = new Date();

  const mapPost = async (postSlug: string) => {
    const { data, readingTimeList } = postEntries[postSlug];

    let author = await getAuthorBySlug(data.author);

    if (!author) {
      console.warn(`Author not found for slug: ${data.author}`);
      const defaultAuthorName = data.author
        ? data.author.split("-").join(" ")
        : "Tim Redaksi";
      author = {
        name: defaultAuthorName,
        slug: "tim-redaksi",
        bio: null as any,
        summary: "",
      };
    }

    const randomImageUrl =
      randomImage + data.tags ? randomImage + data.tags[0] : "";

    return {
      ...data,
      author,
      slug: postSlug,
      readingTime: readingTimeList,
      image: data.image || randomImageUrl,
    } as PostMeta;
  };

  let posts = await Promise.all(getPostSlugs().map(mapPost));

  posts = posts
    .filter((post) => post.draft !== true)
    .filter((post) => new Date(post.publishedAt) <= currentDate)
    .sort((a, b) => {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

  return posts;
}

export async function getPostsByAuthor(
  authorSlug: string
): Promise<PostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((post) => post.author.slug === authorSlug);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  if (!hasEntry(postEntries, slug)) {
    notFound();
  }
  const { data, readingTimePost } = postEntries[slug];
  let author = await getAuthorBySlug(data.author);

  if (!author) {
    console.warn(`Author not found for slug: ${data.author}`);
    const defaultAuthorName = data.author
      ? data.author.split("-").join(" ")
      : "Tim Redaksi";
    author = {
      name: defaultAuthorName,
      slug: "tim-redaksi",
      bio: null as any,
      summary: "",
    };
  }

  const randomImageUrl =
    randomImage + data.tags ? randomImage + data.tags[0] : "";

  return {
    content: "",
    ...data,
    slug,
    author,
    readingTime: readingTimePost,
    image: data.image || randomImageUrl,
  } as Post;
}

