import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { typography } from "@/lib/typography";

interface PopularSurahsSectionProps {
  topSurahs: {
    name: string;
    number: number;
    alias?: {
      aliasName: string;
      ayatNumber: number;
    };
  }[];
}

const PopularSurahsSection: React.FC<PopularSurahsSectionProps> = ({
  topSurahs,
}) => {
  return (
    <Card className="mb-4 bg-gradient-to-r from-primary/5 to-primary-light/5 border-none shadow-none rounded-none sm:rounded-2xl sm:border sm:shadow-sm">
      <CardContent className="p-4">
        <h3 className={cn(typography.label, "text-muted-foreground mb-2")}>
          Sering dibaca:
        </h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-primary/5 transition-all duration-300">
          <div className="flex flex-wrap gap-2">
            {topSurahs.map((surah, index) => (
              <Link
                key={index}
                href={`/quran/surah/${surah.number}_${encodeURIComponent(surah.name)}${surah.alias ? `#${surah.alias.ayatNumber}` : ""}`}
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "cursor-pointer transition-all duration-300",
                    "bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900",
                    "border border-gray-200 dark:border-gray-700",
                    "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),_0_1px_3px_0_rgba(0,0,0,0.1),_0_1px_2px_-1px_rgba(0,0,0,0.1)]",
                    "dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),_0_1px_3px_0_rgba(0,0,0,0.1),_0_1px_2px_-1px_rgba(0,0,0,0.1)]",
                    "hover:shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.1),_0_1px_2px_-1px_rgba(0,0,0,0.1)]",
                    "dark:hover:shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.1),_0_1px_2px_-1px_rgba(0,0,0,0.1)]",
                    "hover:bg-gradient-to-tl hover:from-gray-100 hover:to-white",
                    "dark:hover:from-gray-900 dark:hover:to-gray-800",
                    "text-gray-800 dark:text-gray-200",
                    "hover:text-primary dark:hover:text-primary-foreground",
                    "font-medium"
                  )}
                >
                  {surah.alias ? surah.alias.aliasName : surah.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularSurahsSection;
