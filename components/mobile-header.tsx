"use client";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export default function MobileHeader({
  title,
  showBack = true,
  actions,
  className
}: MobileHeaderProps) {
  const router = useRouter();

  return (
    <header className={cn(
      "md:hidden sticky top-0 z-40 w-full",
      "bg-background/95 backdrop-blur-lg border-b border-border",
      className
    )}>
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="w-8 h-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h1 className="font-semibold text-lg truncate">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
          >
            <ModeToggle />
          </Button>
        </div>
      </div>
    </header>
  );
}