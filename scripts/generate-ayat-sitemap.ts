// scripts/generate-ayat-sitemap.ts
import { writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";

const surahsBahasa = [
  {
    number: 1,
    name: "Al-Fatihah",
    arabicName: "الفاتحة",
    totalVerses: 7,
  },
  {
    number: 2,
    name: "Al-Baqarah",
    arabicName: "البقرة",
    totalVerses: 286,
  },
  {
    number: 3,
    name: "Ali 'Imran",
    arabicName: "آل عمران",
    totalVerses: 200,
  },
  {
    number: 4,
    name: "An-Nisa'",
    arabicName: "النساء",
    totalVerses: 176,
  },
  {
    number: 5,
    name: "Al-Ma'idah",
    arabicName: "المائدة",
    totalVerses: 120,
  },
  {
    number: 6,
    name: "Al-An'am",
    arabicName: "الأنعام",
    totalVerses: 165,
  },
  {
    number: 7,
    name: "Al-A'raf",
    arabicName: "الأعراف",
    totalVerses: 206,
  },
  {
    number: 8,
    name: "Al-Anfal",
    arabicName: "الأنفال",
    totalVerses: 75,
  },
  {
    number: 9,
    name: "At-Taubah",
    arabicName: "التوبة",
    totalVerses: 129,
  },
  {
    number: 10,
    name: "Yunus",
    arabicName: "يونس",
    totalVerses: 109,
  },
  {
    number: 11,
    name: "Hud",
    arabicName: "هود",
    totalVerses: 123,
  },
  {
    number: 12,
    name: "Yusuf",
    arabicName: "يوسف",
    totalVerses: 111,
  },
  {
    number: 13,
    name: "Ar-Ra'd",
    arabicName: "الرعد",
    totalVerses: 43,
  },
  {
    number: 14,
    name: "Ibrahim",
    arabicName: "ابراهيم",
    totalVerses: 52,
  },
  {
    number: 15,
    name: "Al-Hijr",
    arabicName: "الحجر",
    totalVerses: 99,
  },
  {
    number: 16,
    name: "An-Nahl",
    arabicName: "النحل",
    totalVerses: 128,
  },
  {
    number: 17,
    name: "Al-Isra'",
    arabicName: "الإسراء",
    totalVerses: 111,
  },
  {
    number: 18,
    name: "Al-Kahf",
    arabicName: "الكهف",
    totalVerses: 110,
  },
  {
    number: 19,
    name: "Maryam",
    arabicName: "مريم",
    totalVerses: 98,
  },
  {
    number: 20,
    name: "Taha",
    arabicName: "طه",
    totalVerses: 135,
  },
  {
    number: 21,
    name: "Al-Anbiya'",
    arabicName: "الأنبياء",
    totalVerses: 112,
  },
  {
    number: 22,
    name: "Al-Hajj",
    arabicName: "الحج",
    totalVerses: 78,
  },
  {
    number: 23,
    name: "Al-Mu'minun",
    arabicName: "المؤمنون",
    totalVerses: 118,
  },
  {
    number: 24,
    name: "An-Nur",
    arabicName: "النور",
    totalVerses: 64,
  },
  {
    number: 25,
    name: "Al-Furqan",
    arabicName: "الفرقان",
    totalVerses: 77,
  },
  {
    number: 26,
    name: "Asy-Syu'ara'",
    arabicName: "الشعراء",
    totalVerses: 227,
  },
  {
    number: 27,
    name: "An-Naml",
    arabicName: "النمل",
    totalVerses: 93,
  },
  {
    number: 28,
    name: "Al-Qasas",
    arabicName: "القصص",
    totalVerses: 88,
  },
  {
    number: 29,
    name: "Al-'Ankabut",
    arabicName: "العنكبوت",
    totalVerses: 69,
  },
  {
    number: 30,
    name: "Ar-Rum",
    arabicName: "الروم",
    totalVerses: 60,
  },
  {
    number: 31,
    name: "Luqman",
    arabicName: "لقمان",
    totalVerses: 34,
  },
  {
    number: 32,
    name: "As-Sajdah",
    arabicName: "السجدة",
    totalVerses: 30,
  },
  {
    number: 33,
    name: "Al-Ahzab",
    arabicName: "الأحزاب",
    totalVerses: 73,
  },
  {
    number: 34,
    name: "Saba'",
    arabicName: "سبإ",
    totalVerses: 54,
  },
  {
    number: 35,
    name: "Fatir",
    arabicName: "فاطر",
    totalVerses: 45,
  },
  {
    number: 36,
    name: "Yasin",
    arabicName: "يس",
    totalVerses: 83,
  },
  {
    number: 37,
    name: "As-Saffat",
    arabicName: "الصافات",
    totalVerses: 182,
  },
  {
    number: 38,
    name: "Sad",
    arabicName: "ص",
    totalVerses: 88,
  },
  {
    number: 39,
    name: "Az-Zumar",
    arabicName: "الزمر",
    totalVerses: 75,
  },
  {
    number: 40,
    name: "Gafir",
    arabicName: "غافر",
    totalVerses: 85,
  },
  {
    number: 41,
    name: "Fussilat",
    arabicName: "فصلت",
    totalVerses: 54,
  },
  {
    number: 42,
    name: "Asy-Syura",
    arabicName: "الشورى",
    totalVerses: 53,
  },
  {
    number: 43,
    name: "Az-Zukhruf",
    arabicName: "الزخرف",
    totalVerses: 89,
  },
  {
    number: 44,
    name: "Ad-Dukhan",
    arabicName: "الدخان",
    totalVerses: 59,
  },
  {
    number: 45,
    name: "Al-Jasiyah",
    arabicName: "الجاثية",
    totalVerses: 37,
  },
  {
    number: 46,
    name: "Al-Ahqaf",
    arabicName: "الأحقاف",
    totalVerses: 35,
  },
  {
    number: 47,
    name: "Muhammad",
    arabicName: "محمد",
    totalVerses: 38,
  },
  {
    number: 48,
    name: "Al-Fath",
    arabicName: "الفتح",
    totalVerses: 29,
  },
  {
    number: 49,
    name: "Al-Hujurat",
    arabicName: "الحجرات",
    totalVerses: 18,
  },
  {
    number: 50,
    name: "Qaf",
    arabicName: "ق",
    totalVerses: 45,
  },
  {
    number: 51,
    name: "Az-Zariyat",
    arabicName: "الذاريات",
    totalVerses: 60,
  },
  {
    number: 52,
    name: "At-Tur",
    arabicName: "الطور",
    totalVerses: 49,
  },
  {
    number: 53,
    name: "An-Najm",
    arabicName: "النجم",
    totalVerses: 62,
  },
  {
    number: 54,
    name: "Al-Qamar",
    arabicName: "القمر",
    totalVerses: 55,
  },
  {
    number: 55,
    name: "Ar-Rahman",
    arabicName: "الرحمن",
    totalVerses: 78,
  },
  {
    number: 56,
    name: "Al-Waqi'ah",
    arabicName: "الواقعة",
    totalVerses: 96,
  },
  {
    number: 57,
    name: "Al-Hadid",
    arabicName: "الحديد",
    totalVerses: 29,
  },
  {
    number: 58,
    name: "Al-Mujadalah",
    arabicName: "المجادلة",
    totalVerses: 22,
  },
  {
    number: 59,
    name: "Al-Hasyr",
    arabicName: "الحشر",
    totalVerses: 24,
  },
  {
    number: 60,
    name: "Al-Mumtahanah",
    arabicName: "الممتحنة",
    totalVerses: 13,
  },
  {
    number: 61,
    name: "As-Saff",
    arabicName: "سُورَةُ الصَّفِّ",
    totalVerses: 14,
  },
  {
    number: 62,
    name: "Al-Jumu'ah",
    arabicName: "سُورَةُ الجُمُعَةِ",
    totalVerses: 11,
  },
  {
    number: 63,
    name: "Al-Munafiqun",
    arabicName: "سُورَةُ المُنَافِقُونَ",
    totalVerses: 11,
  },
  {
    number: 64,
    name: "At-Tagabun",
    arabicName: "سُورَةُ التَّغَابُنِ",
    totalVerses: 18,
  },
  {
    number: 65,
    name: "At-Talaq",
    arabicName: "سُورَةُ الطَّلَاقِ",
    totalVerses: 12,
  },
  {
    number: 66,
    name: "At-Tahrim",
    arabicName: "سُورَةُ التَّحۡرِيمِ",
    totalVerses: 12,
  },
  {
    number: 67,
    name: "Al-Mulk",
    arabicName: "سُورَةُ المُلۡكِ",
    totalVerses: 30,
  },
  {
    number: 68,
    name: "Al-Qalam",
    arabicName: "سُورَةُ القَلَمِ",
    totalVerses: 52,
  },
  {
    number: 69,
    name: "Al-Haqqah",
    arabicName: "سُورَةُ الحَاقَّةِ",
    totalVerses: 52,
  },
  {
    number: 70,
    name: "Al-Ma'arij",
    arabicName: "سُورَةُ المَعَارِجِ",
    totalVerses: 44,
  },
  {
    number: 71,
    name: "Nuh",
    arabicName: "سُورَةُ نُوحٍ",
    totalVerses: 28,
  },
  {
    number: 72,
    name: "Al-Jinn",
    arabicName: "سُورَةُ الجِنِّ",
    totalVerses: 28,
  },
  {
    number: 73,
    name: "Al-Muzzammil",
    arabicName: "سُورَةُ المُزَّمِّلِ",
    totalVerses: 20,
  },
  {
    number: 74,
    name: "Al-Muddassir",
    arabicName: "سُورَةُ المُدَّثِّرِ",
    totalVerses: 56,
  },
  {
    number: 75,
    name: "Al-Qiyamah",
    arabicName: "سُورَةُ القِيَامَةِ",
    totalVerses: 40,
  },
  {
    number: 76,
    name: "Al-Insan",
    arabicName: "سُورَةُ الإِنسَانِ",
    totalVerses: 31,
  },
  {
    number: 77,
    name: "Al-Mursalat",
    arabicName: "سُورَةُ المُرۡسَلَاتِ",
    totalVerses: 50,
  },
  {
    number: 78,
    name: "An-Naba'",
    arabicName: "سُورَةُ النَّبَإِ",
    totalVerses: 40,
  },
  {
    number: 79,
    name: "An-Nazi'at",
    arabicName: "سُورَةُ النَّازِعَاتِ",
    totalVerses: 46,
  },
  {
    number: 80,
    name: "'Abasa",
    arabicName: "سُورَةُ عَبَسَ",
    totalVerses: 42,
  },
  {
    number: 81,
    name: "At-Takwir",
    arabicName: "سُورَةُ التَّكۡوِيرِ",
    totalVerses: 29,
  },
  {
    number: 82,
    name: "Al-Infitar",
    arabicName: "سُورَةُ الانفِطَارِ",
    totalVerses: 19,
  },
  {
    number: 83,
    name: "Al-Mutaffifin",
    arabicName: "سُورَةُ المُطَفِّفِينَ",
    totalVerses: 36,
  },
  {
    number: 84,
    name: "Al-Insyiqaq",
    arabicName: "سُورَةُ الانشِقَاقِ",
    totalVerses: 25,
  },
  {
    number: 85,
    name: "Al-Buruj",
    arabicName: "سُورَةُ البُرُوجِ",
    totalVerses: 22,
  },
  {
    number: 86,
    name: "At-Tariq",
    arabicName: "سُورَةُ الطَّارِقِ",
    totalVerses: 17,
  },
  {
    number: 87,
    name: "Al-A'la",
    arabicName: "سُورَةُ الأَعۡلَىٰ",
    totalVerses: 19,
  },
  {
    number: 88,
    name: "Al-Gasyiyah",
    arabicName: "سُورَةُ الغَاشِيَةِ",
    totalVerses: 26,
  },
  {
    number: 89,
    name: "Al-Fajr",
    arabicName: "سُورَةُ الفَجۡرِ",
    totalVerses: 30,
  },
  {
    number: 90,
    name: "Al-Balad",
    arabicName: "سُورَةُ البَلَدِ",
    totalVerses: 20,
  },
  {
    number: 91,
    name: "Asy-Syams",
    arabicName: "سُورَةُ الشَّمۡسِ",
    totalVerses: 15,
  },
  {
    number: 92,
    name: "Al-Lail",
    arabicName: "سُورَةُ اللَّيۡلِ",
    totalVerses: 21,
  },
  {
    number: 93,
    name: "Ad-Duha",
    arabicName: "سُورَةُ الضُّحَىٰ",
    totalVerses: 11,
  },
  {
    number: 94,
    name: "Asy-Syarh",
    arabicName: "سُورَةُ الشَّرۡحِ",
    totalVerses: 8,
  },
  {
    number: 95,
    name: "At-Tin",
    arabicName: "سُورَةُ التِّينِ",
    totalVerses: 8,
  },
  {
    number: 96,
    name: "Al-'Alaq",
    arabicName: "سُورَةُ العَلَقِ",
    totalVerses: 19,
  },
  {
    number: 97,
    name: "Al-Qadr",
    arabicName: "سُورَةُ القَدۡرِ",
    totalVerses: 5,
  },
  {
    number: 98,
    name: "Al-Bayyinah",
    arabicName: "سُورَةُ البَيِّنَةِ",
    totalVerses: 8,
  },
  {
    number: 99,
    name: "Az-Zalzalah",
    arabicName: "سُورَةُ الزَّلۡزَلَةِ",
    totalVerses: 8,
  },
  {
    number: 100,
    name: "Al-'Adiyat",
    arabicName: "سُورَةُ العَادِيَاتِ",
    totalVerses: 11,
  },
  {
    number: 101,
    name: "Al-Qari'ah",
    arabicName: "سُورَةُ القَارِعَةِ",
    totalVerses: 11,
  },
  {
    number: 102,
    name: "At-Takasur",
    arabicName: "سُورَةُ التَّكَاثُرِ",
    totalVerses: 8,
  },
  {
    number: 103,
    name: "Al-'Asr",
    arabicName: "سُورَةُ العَصۡرِ",
    totalVerses: 3,
  },
  {
    number: 104,
    name: "Al-Humazah",
    arabicName: "سُورَةُ الهُمَزَةِ",
    totalVerses: 9,
  },
  {
    number: 105,
    name: "Al-Fil",
    arabicName: "سُورَةُ الفِيلِ",
    totalVerses: 5,
  },
  {
    number: 106,
    name: "Quraisy",
    arabicName: "سُورَةُ قُرَيۡشٍ",
    totalVerses: 4,
  },
  {
    number: 107,
    name: "Al-Ma'un",
    arabicName: "سُورَةُ المَاعُونِ",
    totalVerses: 7,
  },
  {
    number: 108,
    name: "Al-Kausar",
    arabicName: "سُورَةُ الكَوۡثَرِ",
    totalVerses: 3,
  },
  {
    number: 109,
    name: "Al-Kafirun",
    arabicName: "سُورَةُ الكَافِرُونَ",
    totalVerses: 6,
  },
  {
    number: 110,
    name: "An-Nasr",
    arabicName: "سُورَةُ النَّصۡرِ",
    totalVerses: 3,
  },
  {
    number: 111,
    name: "Al-Lahab",
    arabicName: "سُورَةُ المَسَدِ",
    totalVerses: 5,
  },
  {
    number: 112,
    name: "Al-Ikhlas",
    arabicName: "سُورَةُ الإِخۡلَاصِ",
    totalVerses: 4,
  },
  {
    number: 113,
    name: "Al-Falaq",
    arabicName: "سُورَةُ الفَلَقِ",
    totalVerses: 5,
  },
  {
    number: 114,
    name: "An-Nas",
    arabicName: "سُورَةُ النَّاسِ",
    totalVerses: 6,
  },
];

const domain = "https://bekhair.org";

async function generateAyatSitemap() {
  try {
    console.log("🚀 Generating ayat sitemap...");

    // Use older date to make it look natural
    const quranBaseDate = new Date("2024-06-01");

    // Generate URLs for all ayat pages
    const ayatUrls: string[] = [];
    let totalAyat = 0;

    for (const surah of surahsBahasa) {
      for (let ayatNum = 1; ayatNum <= surah.totalVerses; ayatNum++) {
        // Stagger dates to look natural - different date for each ~100 ayats
        const ayatDate = new Date(quranBaseDate);
        ayatDate.setDate(quranBaseDate.getDate() + Math.floor(totalAyat / 100));

        ayatUrls.push(`
      <url>
        <loc>${domain}/quran/surah/${surah.number}_${encodeURIComponent(surah.name)}/ayat/${ayatNum}</loc>
        <lastmod>${ayatDate.toISOString()}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.7</priority>
      </url>
    `);
        totalAyat++;
      }
    }

    const sitemap = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <!-- Individual Ayat Pages -->
        ${ayatUrls.join("")}
      </urlset>
    `;

    const formatted = await prettier.format(sitemap, {
      parser: "html",
    });

    // Write the ayat sitemap
    await writeFile(
      path.join(process.cwd(), "public", "all-ayat-sitemap.xml"),
      formatted
    );

    console.log("✅ Ayat sitemap generated successfully!");
    console.log(`✅ Generated sitemap for ${totalAyat} individual ayat pages.`);
  } catch (error) {
    console.error("Error generating ayat sitemap:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

generateAyatSitemap();
