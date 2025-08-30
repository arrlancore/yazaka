import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PrayerTimesCompactSkeleton = () => {
  return (
    <Card className="p-0 shadow-none border-none w-full mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/5 via-background to-primary/5 text-foreground rounded-none sm:rounded-2xl sm:shadow-sm sm:border sm:max-w-md sm:mx-auto">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-0 sm:p-1 text-primary-foreground">
          {/* Location skeleton */}
          <div className="flex items-center justify-center text-xs space-x-1 py-1">
            <Skeleton className="w-3 h-3 bg-white/20" />
            <Skeleton className="h-3 w-24 bg-white/20" />
          </div>

          {/* Prayer times grid skeleton */}
          <div className="grid grid-cols-5 gap-1 p-0">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-1 sm:p-2"
              >
                <Skeleton className="h-3 w-10 mb-1 bg-white/20" />
                <Skeleton className="h-4 w-12 bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      {/* Footer */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-1 text-muted-foreground">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </Card>
  );
};

export default PrayerTimesCompactSkeleton;