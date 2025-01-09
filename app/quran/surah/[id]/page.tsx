import { Metadata } from "next";
import Footer from "@/components/footer";
import SurahDetail, { SurahDetailProps } from "@/components/surah-detail";
import { fetchQuranSuratByNumber } from "@/services/quranServices";
import { appLocale, appUrl, brandName } from "@/config";

const mapToSurahDetail = (surah: Surah): SurahDetailProps => {
  const tj = [
    {
      number: 6231,
      text: "قُلْ أَعُوذُ بِرَبِّ [h:14683[ٱ][l[ل][g[نّ][p[َا]سِ",
      numberInSurah: 1,
      juz: 30,
      manzil: 7,
      page: 604,
      ruku: 556,
      hizbQuarter: 240,
      sajda: false,
    },
    {
      number: 6232,
      text: "مَلِكِ [h:14684[ٱ][l[ل][g[نّ][p[َا]سِ",
      numberInSurah: 2,
      juz: 30,
      manzil: 7,
      page: 604,
      ruku: 556,
      hizbQuarter: 240,
      sajda: false,
    },
    {
      number: 6233,
      text: "إِلَ[n[ـٰ]هِ [h:14685[ٱ][l[ل][g[نّ][p[َا]سِ",
      numberInSurah: 3,
      juz: 30,
      manzil: 7,
      page: 604,
      ruku: 556,
      hizbQuarter: 240,
      sajda: false,
    },
    {
      number: 6234,
      text: "مِ[f:14679[ن ش]َرِّ [h:14686[ٱ]لْوَسْوَاسِ [h:14687[ٱ]لْخَ[g[نّ][p[َا]سِ",
      numberInSurah: 4,
      juz: 30,
      manzil: 7,
      page: 604,
      ruku: 556,
      hizbQuarter: 240,
      sajda: false,
    },
    {
      number: 6235,
      text: "ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ [h:14688[ٱ][l[ل][g[نّ][p[َا]سِ",
      numberInSurah: 5,
      juz: 30,
      manzil: 7,
      page: 604,
      ruku: 556,
      hizbQuarter: 240,
      sajda: false,
    },
    {
      number: 6236,
      text: "مِنَ [h:6531[ٱ]لْجِ[g[نّ]َةِ وَ[h:824[ٱ][l[ل][g[نّ][p[َا]سِ",
      numberInSurah: 6,
      juz: 30,
      manzil: 7,
      page: 604,
      ruku: 556,
      hizbQuarter: 240,
      sajda: false,
    },
  ];
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
      transliteration: verse.text.transliteration.en,
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
