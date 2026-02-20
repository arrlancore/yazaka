"use client";

import { useState } from "react";
import Link from "next/link";
import { AyatPilihan } from "@/types/panduan";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, BookOpen, ExternalLink } from "lucide-react";

interface AyatCardProps {
  ayat: AyatPilihan;
}

export default function AyatCard({ ayat }: AyatCardProps) {
  const [showTadabbur, setShowTadabbur] = useState(false);

  return (
    <div className="py-4 border-b border-border last:border-0">
      <Link href={ayat.quranUrl} className="block mb-2 group">
        <div className="flex items-start gap-3">
          <Badge
            variant="outline"
            className="shrink-0 min-w-[28px] h-7 flex items-center justify-center text-xs font-bold text-emerald-600 border-emerald-300"
          >
            {ayat.number}
          </Badge>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
              {ayat.reference}
              <BookOpen className="h-3.5 w-3.5 opacity-60" />
            </div>
            <span className="inline-block mt-1 text-xs text-muted-foreground/60">
              Hari ke-{ayat.number} Ramadan
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90 pl-9 mt-2">
          {ayat.translation}
        </p>
      </Link>

      <div className="flex items-center justify-between pl-9 mt-1">
        <button
          onClick={() => setShowTadabbur((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        >
        {showTadabbur ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
          Tadabbur & Kisah Salaf
        </button>

        <Link
          href={ayat.quranUrl}
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Baca
        </Link>
      </div>

      {showTadabbur && (
        <div className="mt-2 pl-9 pr-2">
          <div className="border-l-2 border-amber-400 pl-3 py-1">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {ayat.tadabbur}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
