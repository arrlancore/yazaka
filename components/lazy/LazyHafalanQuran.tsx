"use client";

import { lazy, Suspense } from "react";
import HafalanPageSkeleton from "@/components/hafalan/HafalanPageSkeleton";

// Lazy load the HafalanQuran component
const HafalanQuran = lazy(() => import("@/components/HafalanQuran"));

export default function LazyHafalanQuran() {
  return (
    <Suspense fallback={<HafalanPageSkeleton />}>
      <HafalanQuran />
    </Suspense>
  );
}