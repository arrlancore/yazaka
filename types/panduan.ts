// Checklist types
export interface ChecklistItem {
  id: string;
  label: string;
  note?: string; // additional explanation (e.g., hadith reference)
}

export interface ChecklistGroup {
  id: string;
  title: string;
  emoji: string;
  items: ChecklistItem[];
  showOnlyIn10LastNights?: boolean; // for the "10 Malam Terakhir" group
}

// Fikih types
export interface FikihItem {
  label: string;
  type?: "membatalkan" | "tidak-membatalkan" | "normal";
}

export interface FikihSection {
  id: string;
  letter: string;
  title: string;
  content: string;
  items?: FikihItem[];
  hadith?: string;
  notes?: string[];
}

// Keutamaan types
export type KeutamaanType = "hadith" | "salaf-quote" | "salaf-example";

export interface KeutamaanItem {
  id: string;
  type: KeutamaanType;
  arabic?: string;
  translation: string;
  source: string;
  commentary?: string;
  subject?: string; // for salaf-example: the person's name
}

// Ayat Pilihan types
export type AyatCategory =
  | "kiamat-hisab"
  | "hati-lalai"
  | "penyesalan-neraka"
  | "kebesaran-allah"
  | "kematian-waktu"
  | "harapan-kerinduan";

export interface AyatCategoryInfo {
  id: AyatCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export interface AyatPilihan {
  number: number; // Day number in Ramadan (1-30)
  reference: string; // e.g., "QS. An-Nisa: 41"
  quranUrl: string;  // e.g., "/quran/surah/4_An-Nisaa#41"
  translation: string;
  tadabbur: string; // salaf story / usage notes
  category: AyatCategory;
}

// Panduan guide meta (for hub page)
export interface PanduanGuide {
  id: string;
  title: string;
  description: string;
  href: string;
  emoji: string;
  available: boolean;
}
