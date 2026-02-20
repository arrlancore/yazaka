import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Post,
  SeriesNavigation as SeriesNavigationData,
  PostMeta,
} from "@/types/blog";
import ShareButtons from "../share-button";
import { extractDomain } from "@/lib/utils";
import Link from "next/link";
import { Github, Linkedin, Twitter, BookOpen } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { SeriesNavigation } from "./SeriesNavigation";
import { SeriesHub } from "./SeriesHub";
import { isSeriesHub } from "@/lib/mdx/series-utils";
import { MDXRemote } from "next-mdx-remote/rsc";
import components from "@/lib/mdx/mdx-components";

export default async function BlogPost(props: {
  post: Post;
  seriesNavigation?: SeriesNavigationData | null;
  allPosts?: PostMeta[] | null;
}) {
  const { post, seriesNavigation, allPosts } = props;

  return (
    <div>
      <div className="mb-12 text-center">
        {/* Series context badge */}
        {seriesNavigation && (
          <div className="mb-6">
            <Link href={`/blog/${seriesNavigation.seriesHub?.slug}`}>
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 hover:bg-muted"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {seriesNavigation.seriesHub?.title} • Bagian{" "}
                {seriesNavigation.currentPosition} dari{" "}
                {seriesNavigation.totalPosts}
              </Badge>
            </Link>
          </div>
        )}

        <div className="flex justify-center gap-2 mb-4">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground">
          {format(new Date(post.publishedAt), "dd-MM-yyyy", {
            locale: id,
          })}{" "}
          • {post.readingTime}
        </p>
      </div>
      {post.image && (
        <div className="relative w-full h-64 mb-12">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 768px"
            priority={false}
            loading="lazy"
          />
        </div>
      )}
      {/* Optimized reading container - no card wrapper for better flow */}
      <div className="reading-content">
        <div className="prose prose-reading dark:prose-invert max-w-none">
          <MDXRemote source={post.content} components={components} />
        </div>
      </div>

      {/* Series Hub - Auto-generated series structure */}
      {isSeriesHub(post) && allPosts && (
        <SeriesHub hubPost={post} allPosts={allPosts} />
      )}
      {/* Series Navigation */}
      {seriesNavigation && <SeriesNavigation navigation={seriesNavigation} />}

      <ShareButtons
        title={post.title}
        description="Bagikan artikel ini jika Anda merasa terbantu"
      />

      {post.author && (
        <div className="mt-16 mb-8">
          <Separator className="mb-8" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="h-16 w-16 sm:h-12 sm:w-12">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="text-sm text-muted-foreground mb-1">Written by</p>
              <Link
                href={`/authors/${post.author.slug}`}
                className="text-lg font-semibold hover:underline"
              >
                {post.author.name}
              </Link>
              {/* <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {post.author.bio}
              </p> */}
              <div className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {post.author.summary}
              </div>
            </div>
            <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
              {post.author.socialLinks?.twitter && (
                <Button size="icon" variant="ghost" asChild>
                  <Link
                    href={post.author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {post.author.socialLinks?.github && (
                <Button size="icon" variant="ghost" asChild>
                  <Link
                    href={post.author.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </Link>
                </Button>
              )}
              {post.author.socialLinks?.linkedin && (
                <Button size="icon" variant="ghost" asChild>
                  <Link
                    href={post.author.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* credit image */}
      {post.image && (
        <div className="mt-4 text-center">
          <Link
            href={post.image}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="text-sm text-muted-foreground"
          >
            Photo by {extractDomain(post.image)}
          </Link>
        </div>
      )}
    </div>
  );
}
