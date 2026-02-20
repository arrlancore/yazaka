import { ChecklistGroup } from "@/types/panduan";

export const checklistGroups: ChecklistGroup[] = [
  {
    id: "sahur",
    title: "Sahur",
    emoji: "🌙",
    items: [
      {
        id: "sahur-niat",
        label: "Niat puasa dalam hati",
        note: "Wajib. Boleh niat sebulan penuh di awal Ramadan, lebih utama diulang setiap malam.",
      },
      {
        id: "sahur-makan",
        label: "Makan sahur",
        note: "Sunnah muakkad — walau seteguk air. Waktu: setelah tengah malam hingga sebelum adzan Subuh.",
      },
      {
        id: "sahur-doa-makan",
        label: "Doa sebelum makan: بِسْمِ اللَّهِ",
      },
      {
        id: "sahur-tahajjud",
        label: "Shalat Tahajjud / Witir jika belum",
        note: "Minimal 1 rakaat witir sebelum Subuh.",
      },
      {
        id: "sahur-quran",
        label: "Membaca Al-Quran 30 menit",
        note: "Target 1 juz (21 halaman) per hari = khatam 1x di Ramadan.",
      },
      {
        id: "sahur-doa-kekuatan",
        label: "Doa memohon kekuatan ibadah",
      },
    ],
  },
  {
    id: "subuh-syuruk",
    title: "Subuh — Syuruk",
    emoji: "🌅",
    items: [
      {
        id: "subuh-jamaah",
        label: "Shalat Subuh berjamaah",
        note: "Di masjid bagi laki-laki — pahala = shalat sepanjang malam.",
      },
      {
        id: "subuh-duduk",
        label: "Duduk berdzikir setelah Subuh hingga matahari terbit",
        note: "Jangan langsung tidur — ini amalan agung yang sering terlupakan.",
      },
      {
        id: "subuh-shalat-syuruk",
        label: "Shalat 2 rakaat setelah matahari terbit",
        note: "Pahala = haji + umroh sempurna. (HR. Tirmidzi, shahih al-Albani)",
      },
      {
        id: "subuh-dzikir",
        label: "Dzikir pagi: Ayat Kursi, Al-Ikhlas/Al-Falaq/An-Nas (3x), istighfar 100x, shalawat 10x",
      },
      {
        id: "subuh-quran",
        label: "Baca Al-Quran / muraja'ah hafalan",
        note: "Dengan tartil dan tadabbur, bukan sekadar cepat.",
      },
      {
        id: "subuh-ghibah",
        label: "Jauhi ghibah, bohong, caci maki",
        note: "Ini merusak pahala puasa — bukan membatalkan.",
      },
      {
        id: "subuh-pandangan",
        label: "Menahan pandangan dari hal yang diharamkan",
      },
    ],
  },
  {
    id: "siang",
    title: "Siang (Dhuha — Ashar)",
    emoji: "☀️",
    items: [
      {
        id: "siang-dhuha",
        label: "Shalat Dhuha 2–8 rakaat",
        note: "Sunnah muakkad — sangat dianjurkan di Ramadan.",
      },
      {
        id: "siang-kerja",
        label: "Menyibukkan diri dengan pekerjaan / belajar ilmu syar'i",
      },
      {
        id: "siang-dzikir",
        label: "Dzikir siang / istighfar minimal 100x",
      },
      {
        id: "siang-dzuhur",
        label: "Shalat Dzuhur berjamaah",
      },
      {
        id: "siang-ashar",
        label: "Shalat Ashar berjamaah",
      },
      {
        id: "siang-tadabbur",
        label: "Tadabbur minimal 1 ayat per hari",
        note: "Lihat bagian 30 Ayat Pilihan.",
      },
      {
        id: "siang-niat",
        label: "Periksa niat: apakah hari ini ibadah karena Allah atau karena dilihat orang?",
        note: "Muhasabah ikhlas.",
      },
      {
        id: "siang-sia-sia",
        label: "Hindari perbuatan sia-sia",
        note: "Media sosial berlebihan, begadang tidak bermanfaat, hiburan yang melalaikan.",
      },
    ],
  },
  {
    id: "sore",
    title: "Sore (Menjelang Berbuka)",
    emoji: "🌆",
    items: [
      {
        id: "sore-persiapan",
        label: "Persiapkan buka puasa — dianjurkan kurma atau air",
        note: "Sunnah: berbuka dengan kurma ganjil atau air putih.",
      },
      {
        id: "sore-doa",
        label: "Perbanyak doa dari Ashar hingga adzan Maghrib",
        note: "Waktu paling mustajab — jangan lewatkan!",
      },
      {
        id: "sore-doa-buka",
        label: "Baca doa berbuka yang shahih saat adzan Maghrib",
        note: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ (HR. Abu Dawud 2357 — hasan)",
      },
      {
        id: "sore-segera-buka",
        label: "Segera berbuka saat adzan Maghrib",
        note: "Menunda berbuka makruh — ini Sunnah Nabi ﷺ.",
      },
      {
        id: "sore-sedekah",
        label: "Bersedekah / memberi makan orang berbuka",
        note: "Pahala = pahala orang yang berpuasa.",
      },
    ],
  },
  {
    id: "malam",
    title: "Malam (Maghrib — Isya — Tarawih)",
    emoji: "🌙",
    items: [
      {
        id: "malam-maghrib",
        label: "Shalat Maghrib berjamaah",
      },
      {
        id: "malam-kajian",
        label: "Baca Al-Quran / mendengar kajian setelah Maghrib",
      },
      {
        id: "malam-isya",
        label: "Shalat Isya berjamaah",
      },
      {
        id: "malam-tarawih",
        label: "Shalat Tarawih — ikuti imam sampai selesai",
        note: "11 rakaat (8+3 witir) atau 20+3. Siapa yang berdiri bersama imam hingga selesai, dicatat pahala shalat semalam suntuk. (HR. Tirmidzi — shahih)",
      },
      {
        id: "malam-dzikir",
        label: "Dzikir malam",
      },
      {
        id: "malam-evaluasi",
        label: "Evaluasi harian: amalan hari ini sudah ikhlas? Ada yang perlu diperbaiki besok?",
      },
    ],
  },
  {
    id: "10-malam-terakhir",
    title: "10 Malam Terakhir (Lailatul Qadar)",
    emoji: "✨",
    showOnlyIn10LastNights: true,
    items: [
      {
        id: "lailatul-itikaf",
        label: "I'tikaf di masjid jika mampu",
        note: "Sunnah Nabi ﷺ setiap 10 malam terakhir.",
      },
      {
        id: "lailatul-doa",
        label: "Perbanyak doa Lailatul Qadar",
        note: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي (HR. Tirmidzi 3513 — shahih)",
      },
      {
        id: "lailatul-hidupkan",
        label: "Hidupkan malam ganjil: 21, 23, 25, 27, 29",
        note: "Mandi, pakai wewangian, fokus ibadah semalam.",
      },
      {
        id: "lailatul-qiyam",
        label: "Shalat malam diperpanjang / qiyamullail",
      },
    ],
  },
];

export const getAllChecklistItemIds = (): string[] =>
  checklistGroups.flatMap((g) => g.items.map((i) => i.id));
