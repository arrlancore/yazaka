import { Metadata } from "next";
import AyatDetail, { AyatDetailProps } from "@/components/ayat-detail";
import {
  fetchAllQuranSurahs,
  fetchQuranSuratByNumber,
} from "@/services/quranServices";
import { surahsBahasa } from "@/content/quran/metadata";
import { appLocale, appUrl, brandName } from "@/config";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
    ayatNumber: string;
  }>;
}

// Every ayat of every surah is prerendered at build time (static export).
// Surah JSON is fetched once per surah and cached (see services/quranServices.ts),
// so this costs 114 API calls rather than one per ayat.
export async function generateStaticParams() {
  await fetchAllQuranSurahs();
  return surahsBahasa.flatMap((surah) =>
    Array.from({ length: surah.totalVerses }, (_, i) => ({
      id: `${surah.number}_${surah.name}`,
      ayatNumber: String(i + 1),
    }))
  );
}

export const dynamicParams = false;

// Generate metadata for SEO
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const [number, name] = params?.id?.split("_");
  const ayatNumber = parseInt(params.ayatNumber);

  try {
    const surahDetail: SurahDetailResponse = await fetchQuranSuratByNumber(
      parseInt(number)
    );
    const surahName = surahDetail.data.name.transliteration.id;
    const surahNameEn = surahDetail.data.name.transliteration.en;
    const verse = surahDetail.data.verses.find(
      (v) => v.number.inSurah === ayatNumber
    );

    if (!verse) {
      return {
        title: "Ayat Not Found",
      };
    }

    const title = `Ayat ${ayatNumber} - Surah ${surahName} (${surahNameEn}) | Quran Online`;
    const description = `${verse.translation.id.substring(0, 160)}... - Baca dan pahami ayat ${ayatNumber} dari Surah ${surahName} dengan terjemahan bahasa Indonesia.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${appUrl}/quran/surah/${params.id}/ayat/${ayatNumber}`,
        siteName: brandName,
        locale: appLocale,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      alternates: {
        canonical: `${appUrl}/quran/surah/${params.id}/ayat/${ayatNumber}`,
      },
    };
  } catch (error) {
    return {
      title: "Error Loading Ayat",
    };
  }
}

async function AyatDetailPage(props: PageProps) {
  const params = await props.params;
  const [number, name] = params?.id?.split("_");
  const ayatNumber = parseInt(params.ayatNumber);

  // Validate ayat number
  if (isNaN(ayatNumber) || ayatNumber < 1) {
    notFound();
  }

  try {
    const surahDetail: SurahDetailResponse = await fetchQuranSuratByNumber(
      parseInt(number)
    );

    const surah = surahDetail.data;

    // Check if ayat number is valid for this surah
    if (ayatNumber > surah.numberOfVerses) {
      notFound();
    }

    // Find the specific verse
    const verse = surah.verses.find((v) => v.number.inSurah === ayatNumber);

    if (!verse) {
      notFound();
    }

    // Map to AyatDetailProps
    const ayatDetailProps: AyatDetailProps = {
      surahNumber: surah.number,
      surahName: surah.name.transliteration.id,
      surahArabicName: surah.name.short,
      surahMeaning: surah.name.translation.id,
      totalVerses: surah.numberOfVerses,
      surahType: surah.revelation.id,
      verse: {
        number: verse.number.inSurah,
        arabic: verse.text.arab,
        arabicTajweed: verse.text.arabTajweed,
        translation: verse.translation.id,
        transliteration: verse.text.transliteration.id,
        audioUrl: verse.audio.primary,
      audioFallbacks: verse.audio.secondary,
        tafsir: verse.tafsir.id.long,
        meta: {
          juz: verse.meta.juz,
          page: verse.meta.page,
        },
      },
    };

    return (
      <>
        <MobilePage>
          <HeaderMobilePage
            title={`Ayat ${ayatNumber}`}
            subtitle={`${surah.name.short} • ${surah.name.transliteration.id}`}
            backUrl={`/quran/surah/${params.id}`}
            rightContent={
              <div className="text-xs opacity-80">
                {ayatNumber}/{surah.numberOfVerses}
              </div>
            }
          />
          <AyatDetail {...ayatDetailProps} />
        </MobilePage>
      </>
    );
  } catch (error) {
    console.error("Error fetching ayat:", error);
    notFound();
  }
}

export default AyatDetailPage;
