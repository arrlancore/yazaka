"use client";

import { usePanduanStore } from "@/lib/stores/panduan-store";
import { getAllChecklistItemIds } from "@/data/panduan/ramadan-checklist";
import { cn } from "@/lib/utils";

export default function ChecklistProgress() {
  const checks = usePanduanStore((s) => s.checklist.checks);
  const date = usePanduanStore((s) => s.checklist.date);
  const allIds = getAllChecklistItemIds();
  const today = new Date().toISOString().slice(0, 10);
  const total = allIds.length;
  const checked =
    date === today ? allIds.filter((id) => !!checks[id]).length : 0;
  const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="px-4 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl mb-4 mx-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Amalan Hari Ini
          </p>
          <p className="text-xs text-muted-foreground">
            {checked} dari {total} amalan selesai
          </p>
        </div>
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-emerald-100 dark:text-emerald-900"
            />
            <circle
              cx="28"
              cy="28"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - percentage / 100)}`}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-500",
                percentage === 100
                  ? "text-emerald-500"
                  : "text-emerald-400 dark:text-emerald-500"
              )}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
            {percentage}%
          </span>
        </div>
      </div>

      {percentage === 100 && (
        <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium mt-1">
          Masya Allah! Semua amalan hari ini selesai 🌟
        </p>
      )}
    </div>
  );
}
