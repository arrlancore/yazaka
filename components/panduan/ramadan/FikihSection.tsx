"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FikihSection as FikihSectionType } from "@/types/panduan";
import { cn } from "@/lib/utils";

interface FikihSectionProps {
  section: FikihSectionType;
  defaultOpen?: boolean;
}

export default function FikihSection({
  section,
  defaultOpen = false,
}: FikihSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="rounded-none sm:rounded-xl border-x-0 sm:border-x shadow-none sm:shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="w-7 h-7 rounded-full flex items-center justify-center p-0 font-bold text-emerald-600 border-emerald-300"
          >
            {section.letter}
          </Badge>
          <span className="font-semibold text-sm">{section.title}</span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <CardContent className="px-4 pb-4 pt-0">
          {section.content && (
            <p className="text-sm text-muted-foreground mb-3 whitespace-pre-line leading-relaxed">
              {section.content}
            </p>
          )}

          {section.items && section.items.length > 0 && (
            <ul className="space-y-2 mb-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  {item.type === "membatalkan" && (
                    <Badge
                      variant="destructive"
                      className="text-xs mt-0.5 shrink-0 px-1.5"
                    >
                      Batal
                    </Badge>
                  )}
                  {item.type === "tidak-membatalkan" && (
                    <Badge
                      className="text-xs mt-0.5 shrink-0 px-1.5 bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                      Sah
                    </Badge>
                  )}
                  {item.type === "normal" && (
                    <span className="text-muted-foreground mt-1 shrink-0 text-xs">
                      {i + 1}.
                    </span>
                  )}
                  <span className="text-sm leading-snug">{item.label}</span>
                </li>
              ))}
            </ul>
          )}

          {section.hadith && (
            <blockquote
              className={cn(
                "border-l-2 border-emerald-400 pl-3 py-1 mt-3",
                "text-sm text-muted-foreground italic leading-relaxed"
              )}
            >
              {section.hadith}
            </blockquote>
          )}

          {section.notes?.map((note, i) => (
            <p key={i} className="text-xs text-muted-foreground/70 mt-2 italic">
              {note}
            </p>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
