import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SurahListSkeleton: React.FC = () => {
  return (
    <Card className="border-none overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 shadow-none text-foreground rounded-none p-0 sm:border sm:shadow-sm sm:rounded-2xl">
      <CardContent className="p-0">
        <div className="bg-background">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center p-4 border-b border-border">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurahListSkeleton;