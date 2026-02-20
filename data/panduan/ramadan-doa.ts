import { DoaItem } from "@/types/doa";

// Doa items shaped as DoaItem for direct use with DoaCard component.
// Grouped by context via the 'grup' field.

export const doaRamadan: DoaItem[] = [
  {
    slug: "doa-berbuka-puasa",
    nama: "Doa Berbuka Puasa",
    grup: "Berbuka",
    order: 1,
    ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    tr: "Dzahabaz zhama'u wabtallatil 'uruqu wa tsabatal ajru insyaa-Allah.",
    idn: "Telah hilang rasa haus, urat-urat telah basah, dan pahala telah ditetapkan insya Allah.",
    tentang:
      "HR. Abu Dawud no. 2357 — hasan (Al-Albani)\n\n⚠️ Koreksi penting: Doa \"Allahumma laka shumtu wa bika aamantu wa 'ala rizqika afthartu\" adalah DHAIF. Al-Albani mendhaifkan dalam Irwa'ul Ghalil 4/38. Gunakan doa di atas.\n\nSetelah membaca doa ini, perbanyak doa bebas untuk urusan dunia dan akhirat — ini lebih utama.",
    tag: ["berbuka", "iftar", "ramadan"],
  },
  {
    slug: "doa-lailatul-qadar",
    nama: "Doa Lailatul Qadar",
    grup: "Lailatul Qadar",
    order: 1,
    ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    tr: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni.",
    idn: "Ya Allah, sesungguhnya Engkau Maha Pemaaf, mencintai pemberian maaf, maka maafkanlah aku.",
    tentang:
      "HR. Tirmidzi no. 3513 & Ibnu Majah no. 3850 — shahih\n\nDoa ini diajarkan Nabi ﷺ kepada Aisyah radhiyallahu 'anha ketika beliau bertanya doa apa yang paling utama dibaca di Lailatul Qadar.",
    tag: ["lailatul-qadar", "10-malam-terakhir", "ramadan"],
  },
  {
    slug: "doa-sebelum-makan",
    nama: "Doa Sebelum Makan",
    grup: "Makan & Minum",
    order: 1,
    ar: "بِسْمِ اللَّهِ",
    tr: "Bismillah.",
    idn: "Dengan nama Allah.",
    tentang:
      "HR. Muslim\n\nJika lupa di awal, baca saat ingat:\n\nبِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ\n(Bismillaahi awwalahu wa aakhirahu)\n\"Dengan nama Allah di awal dan akhirnya.\"\n(HR. Abu Dawud no. 3767 — shahih)",
    tag: ["makan", "sahur"],
  },
  {
    slug: "doa-setelah-makan",
    nama: "Doa Setelah Makan",
    grup: "Makan & Minum",
    order: 2,
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلاَ قُوَّةٍ",
    tr: "Alhamdulillaahil ladzii ath'amanii haadzaa wa razaqaniihi min ghairi hawlin minnii wa laa quwwatin.",
    idn: "Segala puji bagi Allah yang telah memberi makan ini kepadaku dan memberikan rezeki kepadaku tanpa daya dan kekuatan dariku.",
    tentang: "HR. Tirmidzi no. 3458 — hasan",
    tag: ["makan", "sahur"],
  },
  {
    slug: "doa-qunut-witir",
    nama: "Doa Qunut Witir",
    grup: "Witir & Tarawih",
    order: 1,
    ar: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ وَبَارِكْ لِي فِيمَا أَعْطَيْتَ وَقِنِي شَرَّ مَا قَضَيْتَ فَإِنَّكَ تَقْضِي وَلاَ يُقْضَى عَلَيْكَ وَإِنَّهُ لاَ يَذِلُّ مَنْ وَالَيْتَ وَلاَ يَعِزُّ مَنْ عَادَيْتَ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
    tr: "Allahummahdini fiiman hadayta wa 'aafinii fiiman 'aafayta wa tawallaniy fiiman tawallayta wa baarik lii fiimaa a'thayta wa qinii syarra maa qadhayta fa innaka taqdhii wa laa yuqdhaa 'alayka wa innahu laa yadzillu man waalayta wa laa ya'izzu man 'aadayta tabaarakta rabbanaa wa ta'aalayta.",
    idn: "Ya Allah, berilah aku petunjuk di antara orang-orang yang Engkau beri petunjuk, berilah aku keselamatan di antara orang-orang yang Engkau selamatkan, jadikanlah aku pelindungmu di antara orang-orang yang Engkau lindungi, berkahilah aku pada apa yang Engkau berikan, lindungilah aku dari keburukan apa yang Engkau tetapkan. Sesungguhnya Engkau yang menetapkan dan tidak ada yang menetapkan atas-Mu. Sesungguhnya tidak akan hina orang yang Engkau lindungi dan tidak akan mulia orang yang Engkau musuhi. Maha Suci Engkau wahai Rabb kami dan Maha Tinggi.",
    tentang: "HR. Abu Dawud no. 1425, Tirmidzi no. 464 — shahih",
    tag: ["witir", "qunut", "tarawih", "ramadan"],
  },
  {
    slug: "dzikir-pagi-ayat-kursi",
    nama: "Dzikir Pagi: Ayat Kursi",
    grup: "Dzikir Pagi & Petang",
    order: 1,
    ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ",
    tr: "Allahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khudzuhuu sinatuw wa laa nawm, lahuu maa fissamaawaati wa maa fil ardh...",
    idn: "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi...",
    tentang:
      "QS. Al-Baqarah: 255\n\nBarangsiapa membacanya pagi dan petang, tidak ada yang menghalanginya dari surga kecuali kematian. (HR. Nasa'i — shahih)\n\nDibaca 1x pagi dan 1x petang.",
    tag: ["dzikir", "pagi", "petang", "ayat-kursi"],
  },
  {
    slug: "istighfar-harian",
    nama: "Istighfar",
    grup: "Dzikir Pagi & Petang",
    order: 2,
    ar: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    tr: "Astaghfirullaaha wa atuubu ilayhi.",
    idn: "Aku memohon ampun kepada Allah dan aku bertaubat kepada-Nya.",
    tentang: "Minimal 100x per hari.\n\nNabi ﷺ beristighfar lebih dari 70 kali dalam sehari. (HR. Bukhari)",
    tag: ["dzikir", "istighfar", "taubat"],
  },
  {
    slug: "doa-pertemuan-ramadan",
    nama: "Doa Memohon Pertemuan Ramadan",
    grup: "Doa Khusus Ramadan",
    order: 1,
    ar: "اللَّهُمَّ سَلِّمْنِي إِلَى رَمَضَانَ وَسَلِّمْ لِي رَمَضَانَ وَتَسَلَّمْهُ مِنِّي مُتَقَبَّلاً",
    tr: "Allahumma sallimni ilaa Ramadhan, wa sallim lii Ramadhan, wa tasallamhu minni mutaqabbalan.",
    idn: "Ya Allah, antarkanlah aku kepada Ramadan, antarkanlah Ramadan kepadaku, dan terimalah amalanku di bulan Ramadan.",
    tentang:
      "Doa salaf — diriwayatkan dari Yahya bin Abi Katsir\n\nPara salaf sangat bersemangat menyambut Ramadan dan berdoa 6 bulan sebelumnya agar dipertemukan dengan Ramadan. (Lathaif Ma'arif: 148)",
    tag: ["ramadan", "menyambut", "salaf"],
  },
];

export const getDoaByGrup = (): Record<string, DoaItem[]> => {
  return doaRamadan.reduce(
    (acc, doa) => {
      if (!acc[doa.grup]) acc[doa.grup] = [];
      acc[doa.grup].push(doa);
      return acc;
    },
    {} as Record<string, DoaItem[]>
  );
};
