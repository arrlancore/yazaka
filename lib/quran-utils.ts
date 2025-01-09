import { quranMeta, surahsBahasa } from "@/content/quran/metadata";

interface MetaInfo {
  newPage?: number;
  newJuz?: number;
}

export function shouldRenderMetaInfo(
  surahNumber: number,
  ayahNumber: number,
  currentPage: number,
  currentJuz: number
): boolean {
  const currentVersePage = getPageNumber(surahNumber, ayahNumber);
  const nextAyahNumber = ayahNumber + 1;
  const nextAyahInSurah = isAyahInSurah(surahNumber, nextAyahNumber);

  let nextVersePage: number | null = null;

  if (nextAyahInSurah) {
    nextVersePage = getPageNumber(surahNumber, nextAyahNumber);
  } else {
    // If the next ayah is not in the current surah, check the first ayah of the next surah
    const nextSurahNumber = surahNumber + 1;
    if (nextSurahNumber <= 114) {
      // There are 114 surahs in total
      nextVersePage = getPageNumber(nextSurahNumber, 1);
    }
  }

  // Check if the page changes
  if (currentVersePage !== nextVersePage && nextVersePage !== null) {
    return true;
  }

  // TODO: Implement similar logic for Juz rendering
  // ... (rest of the function remains the same)

  return false;
}

function isAyahInSurah(surahNumber: number, ayahNumber: number): boolean {
  const surah = quranMeta.surahs.references.find(
    (s) => s.number === surahNumber
  );

  return ayahNumber > 0 && ayahNumber <= surah!.numberOfAyahs;
}

export function getPageNumber(
  surahNumber: number,
  ayahNumber: number
): number | null {
  const pageIndex = quranMeta.pages.references.findIndex(
    (ref) => ref.surah === surahNumber && ref.ayah === ayahNumber
  );

  return pageIndex !== -1 ? pageIndex + 1 : null;
}

export function getJuzNumber(
  surahNumber: number,
  ayahNumber: number
): number | null {
  const juzIndex = quranMeta.juzs.references.findIndex(
    (ref) => ref.surah === surahNumber && ref.ayah === ayahNumber
  );

  return juzIndex !== -1 ? juzIndex + 1 : null;
}

export function getSurahName(surahNumber: number): string {
  const surah = surahsBahasa[surahNumber - 1];

  return surah?.name || "";
}
