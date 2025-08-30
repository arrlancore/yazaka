import PrayerTimesSkeleton from "@/components/prayer-times/PrayerTimesSkeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="sm:container flex flex-col sm:gap-4 py-4 px-4 md:px-0">
      <PrayerTimesSkeleton />
      {/* Intro content skeleton */}
      <Card className="p-8 my-12 container max-w-md">
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