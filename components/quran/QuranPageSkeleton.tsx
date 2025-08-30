import React from "react";
import QuranHeader from "@/components/quran/QuranHeader";
import LastReadSkeleton from "@/components/quran/LastReadSkeleton";
import PopularSurahsSkeleton from "@/components/quran/PopularSurahsSkeleton";
import SurahListSkeleton from "@/components/quran/SurahListSkeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const QuranPageSkeleton: React.FC = () => {
  return (
    <main className="flex flex-col pb-4">
      <QuranHeader />
      <div className="px-4 space-y-4 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
        <LastReadSkeleton />
        <PopularSurahsSkeleton />
        <SurahListSkeleton />
        {/* Intro content skeleton */}
        <Card className="p-8 my-12 border-none shadow-none rounded-none sm:border sm:shadow-sm sm:rounded-2xl">
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
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-5/6" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default QuranPageSkeleton;