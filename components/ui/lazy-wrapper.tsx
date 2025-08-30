"use client";

import { ComponentType, lazy, Suspense, ReactNode } from "react";

interface LazyWrapperProps {
  fallback: ReactNode;
  children: ReactNode;
}

/**
 * Generic wrapper for lazy loading components with custom fallback
 */
export function LazyWrapper({ fallback, children }: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

/**
 * Higher-order function to create lazy-loaded components
 */
export function withLazy<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyWrappedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}