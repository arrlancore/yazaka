"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ReactNode, useState } from "react";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export default function PullToRefresh({ 
  children, 
  onRefresh, 
  threshold = 80 
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, threshold], [0, 1]);
  const rotate = useTransform(y, [0, threshold], [0, 180]);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        y.set(0);
      }
    } else {
      y.set(0);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Pull to refresh indicator */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
        style={{
          opacity,
          y: useTransform(y, (value) => Math.max(0, value - threshold))
        }}
      >
        <div className="bg-background/90 backdrop-blur-sm border rounded-full p-3 shadow-lg">
          <motion.div style={{ rotate }}>
            <RefreshCw 
              className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} 
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Content wrapper */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        style={{ y }}
        onDragEnd={handleDragEnd}
        dragMomentum={false}
      >
        {children}
      </motion.div>
    </div>
  );
}