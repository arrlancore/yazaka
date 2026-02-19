import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Circle, Clock, BookOpen } from "lucide-react";
import { Post, PostMeta } from "@/types/blog";
import { getSeriesPosts } from "@/lib/mdx/series-utils";

interface SeriesHubProps {
  hubPost: Post;
  allPosts: PostMeta[];
}

export function SeriesHub({ hubPost, allPosts }: SeriesHubProps) {
  if (!hubPost.isSeriesHub || !hubPost.seriesSlug) {
    return null;
  }

  const seriesPosts = getSeriesPosts(allPosts, hubPost.seriesSlug);
  const totalReadingTime = seriesPosts.reduce((total, post) => {
    const time = parseInt(post.readingTime?.replace(/\D/g, '') || '0');
    return total + time;
  }, 0);

  return (
    <div className="space-y-6 mt-8">
      {/* Series Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Ringkasan Seri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{seriesPosts.length}</div>
              <div className="text-sm text-muted-foreground">Total Bagian</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">~{totalReadingTime}</div>
              <div className="text-sm text-muted-foreground">Menit Baca</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {seriesPosts.filter(p => new Date(p.publishedAt) <= new Date()).length}
              </div>
              <div className="text-sm text-muted-foreground">Dipublikasi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Series Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Struktur Seri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {seriesPosts.map((post, index) => {
              const isPublished = new Date(post.publishedAt) <= new Date();
              const StatusIcon = isPublished ? CheckCircle : Clock;
              
              return (
                <div
                  key={post.slug}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    isPublished 
                      ? 'hover:bg-muted/50 cursor-pointer' 
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <StatusIcon 
                      className={`h-4 w-4 flex-shrink-0 ${
                        isPublished ? 'text-green-600' : 'text-muted-foreground'
                      }`} 
                    />
                    <Badge variant="outline" className="text-xs">
                      Bagian {index + 1}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      {isPublished ? (
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="font-medium hover:underline block truncate"
                        >
                          {post.title}
                        </Link>
                      ) : (
                        <span className="font-medium text-muted-foreground block truncate">
                          {post.title}
                        </span>
                      )}
                      <p className="text-sm text-muted-foreground truncate">
                        {post.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isPublished ? (
                      <>
                        <span>{post.readingTime}</span>
                        <Link href={`/blog/${post.slug}`}>
                          <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground">
                            Baca
                          </Badge>
                        </Link>
                      </>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        Segera Hadir
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      {seriesPosts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Siap Memulai?</h3>
                <p className="text-sm text-muted-foreground">
                  Mulai perjalanan Anda dengan bagian pertama dari seri ini
                </p>
              </div>
              <Link href={`/blog/${seriesPosts[0].slug}`}>
                <Badge 
                  variant="default" 
                  className="px-6 py-2 text-sm cursor-pointer hover:bg-primary/90"
                >
                  Mulai Membaca →
                </Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}