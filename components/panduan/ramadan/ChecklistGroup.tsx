"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ChecklistGroup as ChecklistGroupType } from "@/types/panduan";
import { usePanduanStore } from "@/lib/stores/panduan-store";
import ChecklistItem from "./ChecklistItem";

interface ChecklistGroupProps {
  group: ChecklistGroupType;
  defaultOpen?: boolean;
}

export default function ChecklistGroup({
  group,
  defaultOpen = false,
}: ChecklistGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const checks = usePanduanStore((s) => s.checklist.checks);
  const date = usePanduanStore((s) => s.checklist.date);
  const itemIds = group.items.map((i) => i.id);
  const total = itemIds.length;
  const today = new Date().toISOString().slice(0, 10);
  const checked =
    date === today ? itemIds.filter((id) => !!checks[id]).length : 0;
  const allDone = checked === total;

  return (
    <Card className="rounded-none sm:rounded-xl border-x-0 sm:border-x shadow-none sm:shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{group.emoji}</span>
          <div>
            <p className="font-semibold text-sm">{group.title}</p>
            {allDone && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Selesai ✓
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              allDone
                ? "border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                : "text-muted-foreground"
            }
          >
            {checked}/{total}
          </Badge>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </div>
      </button>

      {open && (
        <CardContent className="px-4 pb-4 pt-0 divide-y divide-border">
          {group.items.map((item) => (
            <ChecklistItem key={item.id} item={item} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
