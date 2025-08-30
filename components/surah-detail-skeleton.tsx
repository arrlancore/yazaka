import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book } from "lucide-react";
import { cn } from "@/lib/utils";

const SurahDetailSkeleton: React.FC = () => {
  return (
    <>
      {/* Header */}
      <div
        className={cn(
          "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
          "transition-all duration-300 px-4 py-4 shadow-md rounded-t-[2rem]"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
              disabled
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <Skeleton className="h-5 w-32 mb-1 bg-white/20" />
              <Skeleton className="h-3 w-40 bg-white/10" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3 w-20 bg-white/10" />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
              disabled
            >
              <Book size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg text-foreground rounded-b-[2rem] p-0">
        <CardContent className="p-0">
          {/* Pre-Bismillah skeleton */}
          <div className="bg-background p-4 text-center">
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-3 w-2/3 mx-auto" />
          </div>

          {/* Verses skeleton */}
          <div className="bg-background p-0 sm:p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 border-b border-border last:border-b-0">
                {/* Verse number and actions */}
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>

                {/* Arabic text */}
                <div className="text-right mb-4">
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-8 w-4/5 mb-2 ml-auto" />
                  <Skeleton className="h-8 w-3/4 ml-auto" />
                </div>

                {/* Translation */}
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                {/* Transliteration */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation skeleton */}
      <div className="mt-8 flex justify-between items-center">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
    </>
  );
};

export default SurahDetailSkeleton;