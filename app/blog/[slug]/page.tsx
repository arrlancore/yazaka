import { getPostBySlug } from "@/lib/mdx/mdx-utils";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogFooter } from "@/components/blog/blog-footer";
import { Metadata } from "next";
import { appLocale, appUrl, blogUrl, brandName } from "@/config";
import { format } from "date-fns";
import BlogPost from "@/components/blog/BlogPost";

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
    title: `${post.title}`,
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
      authors: post.author.name,
      publishedTime: format(
        new Date(post.publishedAt),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
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
      <BlogPost post={post} />
      <div className="pt-12" />
      <BlogFooter />
    </article>
  );
}
