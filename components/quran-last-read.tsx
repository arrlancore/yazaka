import React from "react";
import { Book, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const topSurah = [
  "Al-Fatihah",
  "Al-Kahf",
  "Al-Mulk",
  "Al-Waqi'ah",
  "Yasin",
  "Ar-Rahman",
];

const QuranLastRead = () => {
  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardHeader className="p-6 text-primary">
        <CardTitle className="text-2xl font-bold">Bacaan Qur'an</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Terakhir dibaca:
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-primary/5 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <Book className="text-primary" size={24} />
              <div>
                <div className="text-lg font-semibold">Al Maidah</div>
                <div className="text-sm text-muted-foreground">Ayat 54</div>
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Lanjut
            </Button>
          </div>
        </div>

        <div className="mb-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Surat pilihan:
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-primary/5 transition-all duration-300">
            <div className="flex flex-wrap gap-2">
              {topSurah.map((surah, index) => (
                <Badge
                  key={index}
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
                  {surah}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuranLastRead;
