import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PopularSurahsSkeleton: React.FC = () => {
  return (
    <Card className="mb-4 bg-gradient-to-r from-primary/5 to-primary-light/5 border-none shadow-none rounded-none sm:rounded-2xl sm:border sm:shadow-sm">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="flex items-center justify-between p-3 rounded-lg bg-card">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularSurahsSkeleton;