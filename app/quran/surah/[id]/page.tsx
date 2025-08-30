import { Metadata } from "next";
import Footer from "@/components/footer";
import SurahDetail, { SurahDetailProps } from "@/components/surah-detail";
import { fetchQuranSuratByNumber } from "@/services/quranServices";
import { appLocale, appUrl, brandName } from "@/config";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

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
    verses: surah.verses.map((verse, i) => ({
      number: verse.number.inSurah,
      arabic: verse.text.arab,
      arabicTajweed: verse.text.arabTajweed,
      translation: verse.translation.id,
      transliteration: verse.text.transliteration.id,
      audioUrl: verse.audio.primary,
      meta: {
        juz: verse.meta.juz,
        page: verse.meta.page,
      },
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

  const surah = surahDetail.data;

  return (
    <>
      <MobilePage>
        <HeaderMobilePage
          title={`${surah.number}. ${surah.name.transliteration.id}`}
          subtitle={`${surah.name.short} • ${surah.name.translation.id}`}
          backUrl="/quran"
          rightContent={
            <>
              <div className="text-xs opacity-80">
                {surah.revelation.id} • {surah.numberOfVerses} Ayat
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/20"
              >
                <Book size={16} />
              </Button>
            </>
          }
        />
        <SurahDetail {...mapToSurahDetail(surahDetail.data)} />
      </MobilePage>
    </>
  );
}

export default SurahDetailPage;
