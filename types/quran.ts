interface QuranMeta {
  /** Information about the total number of ayahs (verses) in the Quran */
  ayahs: {
    /** The total count of ayahs in the Quran */
    count: number;
  };

  /** Information about surahs (chapters) in the Quran */
  surahs: {
    /** The total number of surahs in the Quran */
    count: number;
    /** Detailed information about each surah */
    references: {
      number: number;
      name: string;
      englishName: string;
      englishNameTranslation: string;
      numberOfAyahs: number;
      revelationType: string;
    }[];
  };

  /** Information about sajdas (prostrations) in the Quran */
  sajdas: {
    /** The total number of sajdas in the Quran */
    count: number;
    /** Details of each sajda, including its location and type */
    references: {
      surah: number;
      ayah: number;
      recommended: boolean;
      obligatory: boolean;
    }[];
  };

  /** Information about rukus (sections) in the Quran */
  rukus: {
    /** The total number of rukus in the Quran */
    count: number;
    /** The starting point of each ruku */
    references: {
      surah: number;
      ayah: number;
    }[];
  };

  /** Information about pages in the Quran */
  pages: {
    /** The total number of pages in the Quran */
    count: number;
    /** The starting point of each page */
    references: {
      surah: number;
      ayah: number;
    }[];
  };

  /** Information about manzils (seventh parts) in the Quran */
  manzils: {
    /** The total number of manzils in the Quran */
    count: number;
    /** The starting point of each manzil */
    references: {
      surah: number;
      ayah: number;
    }[];
  };

  /** Information about hizb quarters in the Quran */
  hizbQuarters: {
    /** The total number of hizb quarters in the Quran */
    count: number;
    /** The starting point of each hizb quarter */
    references: {
      surah: number;
      ayah: number;
    }[];
  };

  /** Information about juz (parts) in the Quran */
  juzs: {
    /** The total number of juzs in the Quran */
    count: number;
    /** The starting point of each juz */
    references: {
      surah: number;
      ayah: number;
    }[];
  };
}

interface Surah {
  number: number;
  sequence: number;
  numberOfVerses: number;
  name: {
    short: string;
    long: string;
    transliteration: {
      en: string;
      id: string;
    };
    translation: {
      en: string;
      id: string;
    };
  };
  revelation: {
    arab: string;
    en: string;
    id: string;
  };
  tafsir: {
    id: string;
  };
  preBismillah?: {
    text: {
      arab: string;
      transliteration: {
        en: string;
      };
    };
    translation: {
      en: string;
      id: string;
    };
    audio: {
      primary: string;
      secondary: string[];
    };
  };
  verses: Verse[];
}

interface Verse {
  number: {
    inQuran: number;
    inSurah: number;
  };
  meta: {
    juz: number;
    page: number;
    manzil: number;
    ruku: number;
    hizbQuarter: number;
    sajda: {
      recommended: boolean;
      obligatory: boolean;
    };
  };
  text: {
    arab: string;
    arabTajweed?: string;
    transliteration: {
      en: string;
      id: string;
    };
  };
  translation: {
    en: string;
    id: string;
  };
  audio: {
    primary: string;
    secondary: string[];
  };
  tafsir: {
    id: {
      short: string;
      long: string;
    };
  };
}

interface SurahDetailResponse extends QuranResponse<Surah> {}
