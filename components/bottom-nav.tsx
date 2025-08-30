"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Clock,
  BookOpen,
  Home,
  Heart,
  GraduationCap,
} from "lucide-react";

const navItems = [
  {
    href: "/jadwal-shalat",
    label: "Shalat",
    icon: Clock,
    activeColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    href: "/quran",
    label: "Quran",
    icon: BookOpen,
    activeColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    href: "/",
    label: "Home",
    icon: Home,
    activeColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    href: "/doa",
    label: "Doa",
    icon: Heart,
    activeColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
  {
    href: "/hafalan-quran",
    label: "Hafalan",
    icon: GraduationCap,
    activeColor: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-900/20"
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "px-3 py-2 rounded-xl min-w-[60px]",
                    "transition-all duration-200",
                    active ? item.activeBg : "hover:bg-muted/50"
                  )}
                >
                  <motion.div
                    animate={{
                      scale: active ? 1.1 : 1,
                      y: active ? -2 : 0
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 400,
                      damping: 17
                    }}
                  >
                    <Icon 
                      className={cn(
                        "w-5 h-5 mb-1 transition-colors",
                        active 
                          ? item.activeColor 
                          : "text-muted-foreground"
                      )} 
                    />
                  </motion.div>
                  <span 
                    className={cn(
                      "text-xs font-medium transition-colors",
                      active 
                        ? item.activeColor 
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}