import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getAllPosts } from "@/lib/mdx/mdx-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogFooter } from "@/components/blog/blog-footer";
import { Metadata } from "next";
import {
  appLocale,
  blogDescription,
  blogTitle,
  blogUrl,
  brandName,
} from "@/config";

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: blogUrl,
    siteName: brandName,
    locale: appLocale,
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <BlogHeader />
      <div className="pt-12" />
      <h1 className="text-4xl font-bold mb-12 text-center">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card
            key={post.slug}
            className="flex flex-col h-full overflow-hidden"
          >
            {post.image && (
              <div className="relative w-full h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  quality={75}
                  sizes="(max-width: 300px) 100vw, 300px"
                  loading="lazy"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-xl mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-between items-center mb-4">
                <p className="text-muted-foreground text-sm">
                  by {post.author.name}
                </p>

                <p className="text-muted-foreground text-sm">
                  {format(new Date(post.publishedAt), "dd-MM-yyyy", {
                    locale: id,
                  })}{" "}
                  • {post.readingTime}
                </p>
              </div>

              <p className="text-muted-foreground">{post.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="pt-12" />
      <BlogFooter />
    </div>
  );
}
