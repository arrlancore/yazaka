import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LastReadSkeleton: React.FC = () => {
  return (
    <Card className="mb-4 bg-gradient-to-r rounded-none border-none shadow-none from-primary/5 to-primary-light/5 sm:rounded-2xl sm:border sm:shadow-sm">
      <CardContent className="p-4">
        <div className="mb-4">
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="flex items-center justify-between p-3 rounded-lg bg-card">
            <div className="flex items-center space-x-3">
              <Skeleton className="w-6 h-6" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastReadSkeleton;