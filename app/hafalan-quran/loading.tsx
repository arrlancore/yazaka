import HafalanPageSkeleton from "@/components/hafalan/HafalanPageSkeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="max-w-2xl mx-auto mb-8 px-4 md:px-0">
      <HafalanPageSkeleton />
      {/* Intro content skeleton */}
      <Card className="p-8 my-12 container max-w-xl">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2 mt-6">
            <Skeleton className="h-6 w-1/3" />
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-5/6" />
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}