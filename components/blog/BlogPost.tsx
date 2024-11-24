import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Post } from "@/types/blog";
import ShareButtons from "../share-button";
import { extractDomain } from "@/lib/utils";
import Link from "next/link";

export default async function BlogPost(props: { post: Post }) {
  const { post } = props;

  return (
    <div>
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
      <ShareButtons
        title={post.title}
        description="Bagikan artikel ini jika Anda merasa terbantu"
      />
    </div>
  );
}
