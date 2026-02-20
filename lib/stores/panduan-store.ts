import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChecklistState {
  date: string; // "YYYY-MM-DD"
  checks: Record<string, boolean>;
}

interface PanduanState {
  checklist: ChecklistState;
  toggleCheck: (itemId: string) => void;
  isChecked: (itemId: string) => boolean;
  getGroupProgress: (
    itemIds: string[]
  ) => { checked: number; total: number };
  getTotalProgress: (
    allItemIds: string[]
  ) => { checked: number; total: number };
  resetChecklist: () => void;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export const usePanduanStore = create<PanduanState>()(
  persist(
    (set, get) => ({
      checklist: {
        date: getToday(),
        checks: {},
      },

      toggleCheck: (itemId) =>
        set((state) => {
          const today = getToday();
          const isNewDay = state.checklist.date !== today;
          const checks = isNewDay
            ? {}
            : { ...state.checklist.checks };
          checks[itemId] = !checks[itemId];
          return { checklist: { date: today, checks } };
        }),

      isChecked: (itemId) => {
        const state = get();
        const today = getToday();
        if (state.checklist.date !== today) return false;
        return !!state.checklist.checks[itemId];
      },

      getGroupProgress: (itemIds) => {
        const state = get();
        const today = getToday();
        if (state.checklist.date !== today) {
          return { checked: 0, total: itemIds.length };
        }
        const checked = itemIds.filter(
          (id) => !!state.checklist.checks[id]
        ).length;
        return { checked, total: itemIds.length };
      },

      getTotalProgress: (allItemIds) => {
        const state = get();
        const today = getToday();
        if (state.checklist.date !== today) {
          return { checked: 0, total: allItemIds.length };
        }
        const checked = allItemIds.filter(
          (id) => !!state.checklist.checks[id]
        ).length;
        return { checked, total: allItemIds.length };
      },

      resetChecklist: () =>
        set({ checklist: { date: getToday(), checks: {} } }),
    }),
    {
      name: "panduan-storage",
    }
  )
);
