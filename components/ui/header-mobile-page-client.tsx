"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface HeaderMobilePageClientProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  onBackClick?: () => void;
  rightContent?: ReactNode;
  className?: string;
}

const HeaderMobilePageClient = ({
  title,
  subtitle,
  backUrl,
  onBackClick,
  rightContent,
  className,
}: HeaderMobilePageClientProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
        "transition-all duration-300 px-4 py-2 shadow-md sm:rounded-t-[2rem]",
        className
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/20"
            onClick={handleBackClick}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            {subtitle && (
              <div className="text-xs opacity-80">{subtitle}</div>
            )}
          </div>
        </div>
        {rightContent && (
          <div className="flex items-center space-x-2">{rightContent}</div>
        )}
      </div>
    </div>
  );
};

export default HeaderMobilePageClient;