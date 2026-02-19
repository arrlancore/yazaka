import { getPostBySlug, getAllPosts } from "@/lib/mdx/mdx-utils";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogFooter } from "@/components/blog/blog-footer";
import { Metadata } from "next";
import { appLocale, appUrl, blogUrl, brandName } from "@/config";
import { format } from "date-fns";
import BlogPost from "@/components/blog/BlogPost";
import { getSeriesNavigation, isSeriesPost, isSeriesHub } from "@/lib/mdx/series-utils";

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
          url: post.image || `${appUrl}/og-image.png`,
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
      images: [post.image || `${appUrl}/og-image.png`],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  
  // Get all posts for series functionality
  let allPosts = null;
  let seriesNavigation = null;
  
  if (post && (isSeriesPost(post) || isSeriesHub(post))) {
    allPosts = await getAllPosts();
    if (isSeriesPost(post)) {
      seriesNavigation = getSeriesNavigation(allPosts, post);
    }
  }

  return (
    <article className="max-w-[680px] mx-auto px-6 sm:px-8 lg:px-6 pb-12">
      {/* Mobile-only blog header */}
      <div className="md:hidden">
        <BlogHeader />
        <div className="pt-12" />
      </div>
      
      {/* Desktop spacing (since main header is handled by ResponsiveLayout) */}
      <div className="hidden md:block pt-12" />
      
      <BlogPost 
        post={post} 
        seriesNavigation={seriesNavigation} 
        allPosts={allPosts}
      />
      
      <div className="pt-12" />
      
      {/* Mobile-only blog footer */}
      <div className="md:hidden">
        <BlogFooter />
      </div>
    </article>
  );
}
