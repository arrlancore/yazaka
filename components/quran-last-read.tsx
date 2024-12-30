"use client";
import React from "react";
import { Book, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useQuranLastRead } from "@/hooks/useQuranLastRead";

const QuranLastRead = () => {
  const { lastRead } = useQuranLastRead();

  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-primary">
          Bacaan Qur'an
        </CardTitle>
        <Link href="/quran">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            Lainnya <ChevronRight size={16} className="ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {lastRead ? (
          <div className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-primary/5 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <Book className="text-primary" size={20} />
              <div>
                <div className="font-semibold">{lastRead.surahName}</div>
                <div className="text-xs text-muted-foreground">
                  Ayat {lastRead.ayatNumber}
                </div>
              </div>
            </div>
            <Link
              href={`/quran/surah/${lastRead.surahNumber}_${lastRead.surahName}#${lastRead.ayatNumber}`}
            >
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Lanjut
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Belum ada bacaan terakhir
          </div>
        )}

        {/* Commented out section for surah selection */}
      </CardContent>
    </Card>
  );
};

export default QuranLastRead;
