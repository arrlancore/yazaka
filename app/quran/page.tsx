"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Dummy data for surahs (you should replace this with actual data)
const surahs = [
  { number: 1, name: "Al-Fatihah", arabicName: "الفاتحة", totalVerses: 7 },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", totalVerses: 286 },
  { number: 3, name: "Ali 'Imran", arabicName: "آل عمران", totalVerses: 200 },
  // ... add more surahs
];

const topSurah = [
  "Al-Fatihah",
  "Al-Kahf",
  "Al-Mulk",
  "Al-Waqi'ah",
  "Yasin",
  "Ar-Rahman",
];

const QuranPage = () => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      {/* Sticky Header */}
      <div
        className={cn(
          "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
          "transition-all duration-300 px-4 py-2 shadow-md sm:rounded-t-[2rem]"
        )}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Al-Qur'an</h1>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/20"
          >
            <Search size={20} />
          </Button>
        </div>
      </div>

      {/* Last Read Section */}
      <Card className="mb-4 bg-gradient-to-r rounded-t-none from-primary/10 to-primary-light/10">
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
          {/* Popular Surahs Section */}
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Sering dibaca:
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
        </CardContent>
      </Card>

      {/* Surah List */}
      <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg text-foreground rounded-b-[2rem] p-0">
        <CardContent className="p-0">
          <div className="bg-background">
            {surahs.map((surah) => (
              <Link href={`/surah/${surah.number}`} key={surah.number}>
                <div className="flex justify-between items-center p-4 border-b border-border hover:bg-primary/5 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary">
                      {surah.number}
                    </div>
                    <div>
                      <h2 className="font-semibold">{surah.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {surah.arabicName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {surah.totalVerses} Ayat
                    </span>
                    <ChevronRight size={16} className="text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuranPage;
