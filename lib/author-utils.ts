import { Author } from "@/types/blog";
import { authorEntries, hasEntry } from "./content-source";

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!slug || !hasEntry(authorEntries, slug)) {
    return null;
  }

  const { data, content } = authorEntries[slug];

  const author: Author = {
    name: data.name,
    slug: slug,
    bio: content, // plain markdown source string
    avatar: data.avatar,
    socialLinks: data.socialLinks,
    summary: data.summary,
  };

  return author;
}
