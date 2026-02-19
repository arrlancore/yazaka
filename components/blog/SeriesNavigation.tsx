import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeriesNavigation as SeriesNavigationData } from "@/types/blog";

interface SeriesNavigationProps {
  navigation: SeriesNavigationData;
}

export function SeriesNavigation({ navigation }: SeriesNavigationProps) {
  const {
    seriesHub,
    previousPost,
    nextPost,
    currentPosition,
    totalPosts,
    allSeriesPosts
  } = navigation;

  if (!seriesHub) return null;

  return (
    <div className="space-y-4 mt-8">
      {/* Series Context */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <CardTitle className="text-lg">
              Bagian {currentPosition} dari {totalPosts}: {seriesHub.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm mb-3">
            {seriesHub.summary}
          </p>
          <Link href={`/blog/${seriesHub.slug}`}>
            <Button variant="outline" size="sm">
              <List className="h-3 w-3 mr-1" />
              Lihat Seri Lengkap
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Previous Post */}
        <div>
          {previousPost ? (
            <Link href={`/blog/${previousPost.slug}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowLeft className="h-4 w-4" />
                    <Badge variant="secondary" className="text-xs">
                      Sebelumnya
                    </Badge>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2">
                    {previousPost.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="h-full opacity-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowLeft className="h-4 w-4" />
                  <Badge variant="secondary" className="text-xs">
                    Sebelumnya
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ini adalah bagian pertama
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Next Post */}
        <div>
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`}>
              <Card className="h-full hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <Badge variant="secondary" className="text-xs">
                      Selanjutnya
                    </Badge>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 text-right">
                    {nextPost.title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="h-full opacity-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <Badge variant="secondary" className="text-xs">
                    Selanjutnya
                  </Badge>
                  <ArrowRight className="h-4 w-4" />
                </div>
                <p className="text-sm text-muted-foreground text-right">
                  Ini adalah bagian terakhir
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progres</span>
          <span>{currentPosition} dari {totalPosts}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentPosition / totalPosts) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}