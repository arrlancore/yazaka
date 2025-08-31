import Fuse from "fuse.js";
import { DoaItem, DoaSearchResult } from "@/types/doa";

// --- IMPROVEMENT 1: Enhanced Synonym Dictionary ---
// More synonyms are added, especially for 'makan' and 'tidur', to create a stronger semantic link.
const synonymMap: Record<string, string[]> = {
  // Time-related
  pagi: ["subuh", "fajar", "dini hari", "bangun tidur"],
  siang: ["dzuhur", "tengah hari", "makan siang"],
  sore: ["ashar", "petang", "menjelang malam"],
  malam: ["maghrib", "isya", "sebelum tidur", "mau tidur"],

  // Activities
  makan: [
    "makanan",
    "minum",
    "santap",
    "hidangan",
    "lapar",
    "haus",
    "sarapan",
    "buka puasa",
    "sahur",
  ],
  tidur: ["mengantuk", "bangun", "terjaga"],
  sholat: ["salat", "sembahyang", "ibadah"],
  perjalanan: ["safar", "bepergian", "travel", "mudik"],
  belajar: ["sekolah", "kuliah", "pendidikan", "ujian", "ilmu"],

  // Emotions & States
  takut: ["khawatir", "cemas", "gelisah", "was-was"],
  sedih: ["duka", "susah", "kecewa", "galau"],
  senang: ["gembira", "bahagia", "suka cita"],
  sakit: ["penyakit", "tidak sehat", "kurang sehat", "sembuh"],

  // Conditions
  susah: ["sulit", "masalah", "kesulitan", "ujian", "cobaan", "kesempitan"],
  mudah: ["lancar", "dimudahkan", "dipermudah", "kelapangan"],
  rezeki: ["rizki", "berkah", "rejeki", "penghasilan", "harta"],

  // Places
  rumah: ["tempat tinggal", "kediaman", "rumah tangga"],
  masjid: ["mushola", "surau", "tempat ibadah"],
  kamar: ["bilik", "ruang"],

  // People
  orangtua: ["ayah", "ibu", "bapak", "mama", "papa", "kedua orang tua"],
  anak: ["putra", "putri", "keturunan", "buah hati"],
  keluarga: ["sanak saudara", "famili", "kerabat"],
};

// --- IMPROVEMENT 2: Refined Context Categories and Weights ---
// The weight for 'aktivitas' is increased to make it the most influential category.
const contextCategories = {
  aktivitas: {
    weight: 1.5, // Increased weight to prioritize actions like 'makan' or 'tidur'
    patterns: [
      "makan|makanan|minum|minuman|santap|lapar|haus",
      "wc|toilet|buang air|kamar mandi",
      "perjalanan|safar|bepergian|travel|mudik",
      "keluar|keluar rumah|berangkat|pergi",
      "masuk|masuk rumah|pulang|kembali",
      "wudhu|ablusi|bersuci|berwudhu",
      "sholat|salat|sembahyang|ibadah",
      "belajar|sekolah|kuliah|ujian|pendidikan",
      "kerja|bekerja|kantor|usaha|pekerjaan",
      "tidur|bangun|mengantuk",
    ],
  },
  waktu: {
    weight: 0.9,
    patterns: [
      "pagi|subuh|bangun|fajar|dini hari",
      "siang|dzuhur|makan siang|tengah hari",
      "sore|ashar|petang|menjelang malam",
      "malam|maghrib|isya",
    ],
  },
  perasaan: {
    weight: 0.8,
    patterns: [
      "takut|khawatir|cemas|gelisah|was-was",
      "sedih|susah|duka|kecewa|galau",
      "sakit|penyakit|tidak sehat|kurang sehat",
      "senang|gembira|bahagia|suka cita",
      "marah|emosi|kesal|jengkel",
      "stress|tertekan|beban|lelah",
    ],
  },
  kondisi: {
    weight: 0.7,
    patterns: [
      "susah|sulit|masalah|kesulitan|ujian|cobaan",
      "mudah|lancar|dimudahkan|dipermudah",
      "sehat|kuat|bugar|segar",
      "lemah|sakit|letih|capek",
      "kaya|mampu|berkecukupan|berkah",
      "miskin|susah|kekurangan|tidak mampu",
    ],
  },
};

export class DoaSearchEngine {
  private fuse!: Fuse<DoaItem>;
  private doaList: DoaItem[];
  private contextIndex: Map<string, Set<string>> = new Map();

  constructor(doaList: DoaItem[]) {
    this.doaList = doaList;
    this.initializeFuse();
    this.buildContextIndex();
  }

  private initializeFuse() {
    // --- IMPROVEMENT 3: Stricter Fuse.js Configuration ---
    // Threshold is lowered for more precision. Weights for 'nama' and 'tag' are increased.
    const fuseOptions = {
      keys: [
        { name: "nama", weight: 1.2 },
        { name: "tag", weight: 0.8 },
        { name: "idn", weight: 0.8 },
        { name: "grup", weight: 0.6 },
        { name: "ar", weight: 0.2 },
        { name: "tr", weight: 0.3 },
      ],
      threshold: 0.3, // Lowered from 0.4 to make matching stricter
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true,
    };

    this.fuse = new Fuse(this.doaList, fuseOptions);
  }

  private buildContextIndex() {
    this.doaList.forEach((doa) => {
      const searchableText = [doa.nama, doa.grup, doa.idn, ...(doa.tag || [])]
        .join(" ")
        .toLowerCase();

      Object.entries(contextCategories).forEach(([category, { patterns }]) => {
        patterns.forEach((pattern) => {
          const keywords = pattern.split("|");
          if (keywords.some((keyword) => searchableText.includes(keyword))) {
            const key = `${category}:${pattern}`;
            if (!this.contextIndex.has(key)) {
              this.contextIndex.set(key, new Set());
            }
            this.contextIndex.get(key)!.add(doa.slug);
          }
        });
      });

      const words = searchableText.match(/\b(\w+)\b/g) || [];
      words.forEach((word) => {
        if (word.length > 2) {
          const key = `word:${word}`;
          if (!this.contextIndex.has(key)) {
            this.contextIndex.set(key, new Set());
          }
          this.contextIndex.get(key)!.add(doa.slug);
        }
      });
    });
  }

  private expandQuery(query: string): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const expandedTerms = new Set<string>(words);

    words.forEach((word) => {
      for (const [key, synonyms] of Object.entries(synonymMap)) {
        if (key === word || synonyms.includes(word)) {
          expandedTerms.add(key);
          synonyms.forEach((syn) => expandedTerms.add(syn));
        }
      }
    });

    return Array.from(expandedTerms);
  }

  // --- IMPROVEMENT 4: Standardized Scoring (Lower is Better) ---
  // This method now returns a "distance" score (0=perfect, 1=no match) to be consistent with Fuse.js.
  private getContextualMatches(query: string): Map<string, number> {
    const expandedTerms = this.expandQuery(query);
    const matches = new Map<string, number>();

    Object.entries(contextCategories).forEach(
      ([category, { weight, patterns }]) => {
        patterns.forEach((pattern) => {
          const keywords = pattern.split("|");
          const matchCount = keywords.filter((keyword) =>
            expandedTerms.some((term) => term.includes(keyword))
          ).length;

          if (matchCount > 0) {
            const key = `${category}:${pattern}`;
            const slugs = this.contextIndex.get(key) || new Set();

            // Calculate relevance (0-1, higher is better) and convert to distance (0-1, lower is better)
            const relevanceScore = (matchCount / keywords.length) * weight;
            const distanceScore = Math.max(0, 1 - relevanceScore); // Ensure score is not negative

            slugs.forEach((slug) => {
              const currentScore = matches.get(slug) || 1.0; // Default to worst score
              matches.set(slug, Math.min(currentScore, distanceScore)); // Keep the best (lowest) score
            });
          }
        });
      }
    );

    expandedTerms.forEach((term) => {
      if (term.length > 2) {
        const slugs = this.contextIndex.get(`word:${term}`) || new Set();
        slugs.forEach((slug) => {
          const currentScore = matches.get(slug) || 1.0;
          // Direct word match gets a very good (low) score.
          matches.set(slug, Math.min(currentScore, 0.1));
        });
      }
    });

    return matches;
  }

  public search(query: string): DoaSearchResult[] {
    if (!query || query.length < 2) return [];

    const fuseResults = this.fuse.search(query);
    const fuzzyMatches = new Map<string, number>();
    fuseResults.forEach((result) => {
      // Fuse score is already "lower is better"
      fuzzyMatches.set(result.item.slug, result.score || 1.0);
    });

    const contextualMatches = this.getContextualMatches(query);

    // --- IMPROVEMENT 5: Refined Combined Scoring Logic ---
    // The final score now heavily favors the contextual score over the fuzzy score.
    const combinedScores = new Map<string, number>();
    const allSlugs = new Set([
      ...fuzzyMatches.keys(),
      ...contextualMatches.keys(),
    ]);

    allSlugs.forEach((slug) => {
      const fuzzyScore = fuzzyMatches.get(slug) || 1.0; // Default to worst score
      const contextScore = contextualMatches.get(slug) || 1.0; // Default to worst score

      // Weighted average: 60% context, 40% fuzzy. This ensures semantic relevance is prioritized.
      const combinedScore = contextScore * 0.6 + fuzzyScore * 0.4;
      combinedScores.set(slug, combinedScore);
    });

    const results: DoaSearchResult[] = [];
    combinedScores.forEach((score, slug) => {
      const doa = this.doaList.find((d) => d.slug === slug);
      if (doa) {
        results.push({ item: doa, score });
      }
    });

    // Sort by the combined score in ascending order (lower is better)
    return results.sort((a, b) => a.score - b.score).slice(0, 20);
  }

  public getSuggestions(partialQuery: string, limit: number = 5): string[] {
    if (partialQuery.length < 1) return [];

    const suggestions = new Set<string>();
    const lowerQuery = partialQuery.toLowerCase();

    // Prioritize suggesting primary keywords from the synonym map
    Object.keys(synonymMap).forEach((key) => {
      if (key.startsWith(lowerQuery)) {
        suggestions.add(key);
      }
    });

    this.doaList.forEach((doa) => {
      const words = doa.nama.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        if (word.startsWith(lowerQuery) && word.length > 2) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }
}
