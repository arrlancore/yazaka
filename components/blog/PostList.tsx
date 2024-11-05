import { PostMeta } from "@/types/blog";
import PostCard from "./PostCard";

export default function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
