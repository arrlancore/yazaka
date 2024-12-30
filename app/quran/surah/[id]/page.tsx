import { Metadata } from "next";
import Footer from "@/components/footer";
import SurahDetail, { SurahDetailProps } from "@/components/surah-detail";
import { fetchQuranSuratByNumber } from "@/services/quranServices";
import { appLocale, appUrl, brandName } from "@/config";

const mapToSurahDetail = (surah: Surah): SurahDetailProps => {
  return {
    number: surah.number,
    name: surah.name.transliteration.id,
    arabicName: surah.name.short,
    meaning: surah.name.translation.id,
    totalVerses: surah.numberOfVerses,
    type: surah.revelation.id,
    preBismillah: surah.preBismillah
      ? {
          text: {
            arab: surah.preBismillah.text.arab,
            transliteration: surah.preBismillah.text.transliteration.en,
          },
          translation: {
            id: surah.preBismillah.translation.id,
          },
        }
      : undefined,
    verses: surah.verses.map((verse) => ({
      number: verse.number.inSurah,
      arabic: verse.text.arab,
      translation: verse.translation.id,
      transliteration: verse.text.transliteration.en,
      audioUrl: verse.audio.primary,
    })),
  };
};
interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const [number, name] = params?.id?.split("_");
  const surahDetail: SurahDetailResponse = await fetchQuranSuratByNumber(
    parseInt(number)
  );
  const surahName = surahDetail.data.name.transliteration.id;
  const surahNameEn = surahDetail.data.name.transliteration.en;

  return {
    title: `Surah ${surahName} (${surahNameEn}) | Quran Online`,
    description: `Baca Surah ${surahName} (${surahNameEn}) secara online dengan terjemahan bahasa Indonesia. Surah ke-${number} dalam Al-Quran.`,
    openGraph: {
      title: `Surah ${surahName} (${surahNameEn}) | Quran Online`,
      description: `Baca Surah ${surahName} (${surahNameEn}) secara online dengan terjemahan bahasa Indonesia. Surah ke-${number} dalam Al-Quran.`,
      url: `${appUrl}/quran/surah/${params.id}`,
      siteName: brandName,
      locale: appLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Surah ${surahName} (${surahNameEn}) | Quran Online`,
      description: `Baca Surah ${surahName} (${surahNameEn}) secara online dengan terjemahan bahasa Indonesia. Surah ke-${number} dalam Al-Quran.`,
    },
  };
}
async function SurahDetailPage({ params }: PageProps) {
  const [number, name] = params?.id?.split("_");
  const surahDetail: SurahDetailResponse = await fetchQuranSuratByNumber(
    parseInt(number)
  );
  return (
    <>
      <main className="max-w-2xl mx-auto mb-8">
        <SurahDetail {...mapToSurahDetail(surahDetail.data)} />
      </main>
      <Footer />
    </>
  );
}

export default SurahDetailPage;
