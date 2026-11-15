/**
 * Build-time generated content (see scripts/generate-content-bundle.ts).
 * Replaces runtime `fs` access and runtime MDX evaluation so the app runs on
 * Cloudflare Workers (no filesystem, no `new Function`).
 */
import posts from "@/lib/generated/content/posts.json";
import authors from "@/lib/generated/content/authors.json";
import doa from "@/lib/generated/content/doa.json";
import { postsMdx } from "@/lib/generated/content/mdx-registry";

export interface PostEntry {
  data: Record<string, any>;
  readingTimeList: string;
  readingTimePost: string;
}
export interface AuthorEntry {
  data: Record<string, any>;
  content: string;
}
export interface DoaEntry {
  groupSlug: string;
  fileName: string;
  data: Record<string, any>;
  content: string;
}

export const postEntries = posts as unknown as Record<string, PostEntry>;
export const authorEntries = authors as unknown as Record<string, AuthorEntry>;
export const doaEntries = doa as unknown as DoaEntry[];
export { postsMdx };

export function hasEntry(map: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(map, key);
}
