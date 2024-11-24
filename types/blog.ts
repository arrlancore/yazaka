import { ReactElement } from "react";

export interface Author {
  name: string;
  slug: string;
  summary: string;
  bio: ReactElement;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface PostMeta {
  title: string;
  publishedAt: string;
  summary: string;
  author: Author;
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
