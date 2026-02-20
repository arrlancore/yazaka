"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ChecklistItem as ChecklistItemType } from "@/types/panduan";
import { usePanduanStore } from "@/lib/stores/panduan-store";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChecklistItemProps {
  item: ChecklistItemType;
}

export default function ChecklistItem({ item }: ChecklistItemProps) {
  const toggleCheck = usePanduanStore((s) => s.toggleCheck);
  const checks = usePanduanStore((s) => s.checklist.checks);
  const date = usePanduanStore((s) => s.checklist.date);
  const [showNote, setShowNote] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const checked = date === today && !!checks[item.id];

  return (
    <div className="py-2">
      <div className="flex items-start gap-3">
        <Checkbox
          id={item.id}
          checked={checked}
          onCheckedChange={() => toggleCheck(item.id)}
          className="mt-0.5 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <label
            htmlFor={item.id}
            className={cn(
              "text-sm cursor-pointer leading-snug block",
              checked && "line-through text-muted-foreground"
            )}
          >
            {item.label}
          </label>
          {item.note && (
            <button
              onClick={() => setShowNote((v) => !v)}
              className="flex items-center gap-1 mt-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {showNote ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              Catatan
            </button>
          )}
          {item.note && showNote && (
            <p className="mt-1 text-xs text-muted-foreground/70 leading-relaxed italic">
              {item.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
