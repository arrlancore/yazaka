import { ReactElement } from "react";

export interface PostMeta {
  title: string;
  publishedAt: string;
  summary: string;
  author: string;
  slug: string;
  featured?: boolean;
  draft?: boolean;
  tags?: string[];
  image?: string;
  readingTime?: string;
}

export interface Post extends PostMeta {
  content: ReactElement;
  toc?: TableOfContents[];
}

export interface TableOfContents {
  level: number;
  text: string;
  slug: string;
}
