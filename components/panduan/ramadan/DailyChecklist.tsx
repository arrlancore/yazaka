"use client";

import { checklistGroups } from "@/data/panduan/ramadan-checklist";
import ChecklistGroup from "./ChecklistGroup";
import ChecklistProgress from "./ChecklistProgress";

export default function DailyChecklist() {
  return (
    <div className="space-y-0.5">
      <ChecklistProgress />

      <div className="space-y-0.5">
        {checklistGroups.map((group, i) => (
          <ChecklistGroup
            key={group.id}
            group={group}
            defaultOpen={i === 0}
          />
        ))}
      </div>

      <div className="px-4 py-4 mt-2">
        <blockquote className="border-l-2 border-muted pl-3 text-xs text-muted-foreground/70 italic leading-relaxed">
          &quot;Para salaf tidak membuang waktu Ramadan walau sedetik. Malam untuk
          qiyam, siang untuk puasa, tilawah, dan dzikir.&quot;
        </blockquote>
      </div>
    </div>
  );
}
