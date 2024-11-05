import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostMeta } from "@/types/blog";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <CardHeader>
          <div className="flex gap-2 mb-2">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle>{post.title}</CardTitle>
          <div className="text-sm text-muted-foreground">
            {post.readingTime} •{" "}
            {new Date(post.publishedAt).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{post.summary}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
