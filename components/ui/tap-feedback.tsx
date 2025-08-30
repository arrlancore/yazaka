"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TapFeedbackProps {
  children: ReactNode;
  className?: string;
  haptic?: boolean;
  scaleAmount?: number;
  onClick?: () => void;
}

export default function TapFeedback({ 
  children, 
  className, 
  haptic = true,
  scaleAmount = 0.95,
  onClick 
}: TapFeedbackProps) {
  const handleTap = () => {
    // Add haptic feedback for mobile devices
    if (haptic && typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      whileTap={{ 
        scale: scaleAmount,
        transition: { duration: 0.1, ease: "easeOut" }
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={className}
      onTap={handleTap}
    >
      {children}
    </motion.div>
  );
}