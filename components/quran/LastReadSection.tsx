"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { useQuranLastRead } from "@/hooks/useQuranLastRead";
import Link from "next/link";

const LastReadSection = () => {
  const { lastRead } = useQuranLastRead();

  if (!lastRead) {
    return null; // Or you could return a component suggesting to start reading
  }

  return (
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
                <div className="text-lg font-semibold">
                  {lastRead.surahName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ayat {lastRead.ayatNumber}
                </div>
              </div>
            </div>
            <Link
              href={`/quran/surah/${lastRead.surahNumber}_${lastRead.surahName}#${lastRead.ayatNumber}`}
              passHref
            >
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastReadSection;
