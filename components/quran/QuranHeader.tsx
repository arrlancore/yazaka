import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { typography } from "@/lib/typography";
import { iconSizes } from "@/lib/icons";

const QuranHeader = () => {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
        "transition-all duration-300 px-4 py-2 shadow-md sm:rounded-t-[2rem]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
            >
              <ArrowLeft size={iconSizes.nav} />
            </Button>
          </Link>
          <h1 className={typography.h2}>Al-Qur'an</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-white/20"
        >
          <Search size={iconSizes.nav} />
        </Button>
      </div>
    </div>
  );
};

export default QuranHeader;
