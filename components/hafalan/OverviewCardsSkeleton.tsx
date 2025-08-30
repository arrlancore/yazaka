import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function OverviewCardSkeleton() {
  return (
    <Card className="bg-card">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <OverviewCardSkeleton />
      <OverviewCardSkeleton />
    </div>
  );
}