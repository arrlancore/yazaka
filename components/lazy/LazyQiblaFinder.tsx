"use client";

import { lazy, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the QiblaFinder component
const QiblaFinder = lazy(() => import("@/components/QiblaFinder"));

function QiblaFinderSkeleton() {
  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="w-80 h-80 mx-auto rounded-full" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-6 w-16 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LazyQiblaFinder() {
  return (
    <Suspense fallback={<QiblaFinderSkeleton />}>
      <QiblaFinder />
    </Suspense>
  );
}