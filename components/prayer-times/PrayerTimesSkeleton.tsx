import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PrayerTimesSkeleton = () => {
  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-primary-foreground">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-8 w-32 bg-white/20" />
            <Skeleton className="w-10 h-10 rounded-full bg-white/20" />
          </div>
          
          <div className="flex items-center justify-center text-sm space-x-2">
            <Skeleton className="w-4 h-4 bg-white/20" />
            <Skeleton className="h-4 w-24 bg-white/20" />
          </div>
        </div>

        {/* Prayer times grid */}
        <div className="p-6 bg-background">
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center p-4 bg-card rounded-xl">
                <Skeleton className="w-8 h-8 rounded mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-primary/5 text-center">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrayerTimesSkeleton;