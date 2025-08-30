import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const NextPrayerSkeleton = () => {
  return (
    <Card className="overflow-hidden border-none w-full mx-auto shadow-none rounded-none bg-gradient-to-br from-primary/5 via-background to-primary/5 transition-all duration-300 sm:rounded-2xl sm:shadow-sm sm:border sm:max-w-md">
      <CardContent className="px-4 py-2 flex items-center gap-2">
        <Skeleton className="w-4 h-4" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardContent>
    </Card>
  );
};

export default NextPrayerSkeleton;