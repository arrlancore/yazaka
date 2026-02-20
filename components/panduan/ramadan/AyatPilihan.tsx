"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ayatCategories, getAyatByCategory } from "@/data/panduan/ramadan-ayat";
import { AyatCategory } from "@/types/panduan";
import AyatCard from "./AyatCard";
export default function AyatPilihan() {
  const [activeCategory, setActiveCategory] = useState<AyatCategory>(
    "kiamat-hisab"
  );

  return (
    <div className="space-y-2">
      <div className="px-4 pt-2 pb-1">
        <p className="text-xs text-muted-foreground italic">
          30 ayat pilihan untuk tadabbur. Baca dengan tartil dan renungkan —
          lebih utama mengulang satu ayat hingga menangis daripada khatam cepat
          tanpa tadabbur.
        </p>
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as AyatCategory)}
      >
        <div className="overflow-x-auto scrollbar-none px-4">
          <TabsList className="inline-flex h-9 w-max gap-1 bg-muted/60 p-1 mb-1">
            {ayatCategories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="text-xs px-3 whitespace-nowrap"
              >
                {cat.shortLabel}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {ayatCategories.map((cat) => {
          const ayats = getAyatByCategory(cat.id);
          return (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="px-4 py-2 bg-muted/30 border-y border-border">
                <p className="text-xs font-semibold text-muted-foreground">
                  {cat.description}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {ayats.length} ayat pilihan
                </p>
              </div>
              <div className="px-4">
                {ayats.map((ayat) => (
                  <AyatCard key={ayat.number} ayat={ayat} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
