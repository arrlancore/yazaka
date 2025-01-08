import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AppHeaderProps {
  title: string;
  backHref?: string;
  rightElement?: ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  backHref = "/",
  rightElement,
}) => {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
        "transition-all duration-300 px-4 py-2 shadow-md sm:rounded-t-[2rem]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href={backHref}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
            >
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {rightElement}
      </div>
    </div>
  );
};

export default AppHeader;
