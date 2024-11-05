import { getPostBySlug } from "@/lib/mdx/mdx-utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogFooter } from "@/components/blog/blog-footer";
import { Metadata } from "next";
import { appLocale, appUrl, blogUrl, brandName } from "@/config";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | ${brandName}`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${blogUrl}/${post.slug}`,
      siteName: brandName,
      images: [
        {
          url: post.image || `${appUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: appLocale,
      type: "article",
      authors: post.author,
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [post.image || `${appUrl}/og-image.jpg`],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);

  return (
    <article className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <BlogHeader />
      <div className="pt-12" />
      <div className="mb-12 text-center">
        <div className="flex justify-center gap-2 mb-4">
          {post.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted-foreground">
          {post.publishedAt} • {post.readingTime}
        </p>
      </div>
      {post.image && (
        <div className="relative w-full h-64 mb-12">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <Card className="p-8">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {post.content}
        </div>
      </Card>

      {post.author && (
        <div className="pt-8 text-center">
          <p className="text-sm text-muted-foreground">Written by:</p>
          <p className="font-semibold">{post.author}</p>
        </div>
      )}
      <div className="pt-12" />
      <BlogFooter />
    </article>
  );
}
