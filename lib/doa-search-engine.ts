import Fuse from 'fuse.js';
import { DoaItem, DoaSearchResult } from '@/types/doa';

// Enhanced synonym dictionary for semantic search
const synonymMap: Record<string, string[]> = {
  // Time-related
  pagi: ['subuh', 'fajar', 'dini hari', 'bangun tidur'],
  siang: ['dzuhur', 'tengah hari', 'makan siang'],
  sore: ['ashar', 'petang', 'menjelang malam'],
  malam: ['maghrib', 'isya', 'sebelum tidur', 'mau tidur'],
  
  // Activities
  makan: ['makanan', 'minum', 'santap', 'hidangan'],
  sholat: ['salat', 'sembahyang', 'ibadah'],
  perjalanan: ['safar', 'bepergian', 'travel', 'mudik'],
  belajar: ['sekolah', 'kuliah', 'pendidikan', 'ujian'],
  
  // Emotions & States
  takut: ['khawatir', 'cemas', 'gelisah', 'was-was'],
  sedih: ['duka', 'susah', 'kecewa', 'galau'],
  senang: ['gembira', 'bahagia', 'suka cita'],
  sakit: ['penyakit', 'tidak sehat', 'kurang sehat'],
  
  // Conditions
  susah: ['sulit', 'masalah', 'kesulitan', 'ujian', 'cobaan'],
  mudah: ['lancar', 'dimudahkan', 'dipermudah'],
  rezeki: ['rizki', 'berkah', 'rejeki', 'penghasilan'],
  
  // Places
  rumah: ['tempat tinggal', 'kediaman', 'rumah tangga'],
  masjid: ['mushola', 'surau', 'tempat ibadah'],
  kamar: ['bilik', 'ruang'],
  
  // People
  orangtua: ['ayah', 'ibu', 'bapak', 'mama', 'papa'],
  anak: ['putra', 'putri', 'keturunan', 'buah hati'],
  keluarga: ['sanak saudara', 'famili', 'clan']
};

// Context categories with weighted keywords
const contextCategories = {
  waktu: {
    weight: 0.9,
    patterns: [
      'pagi|subuh|bangun|fajar|dini hari',
      'siang|dzuhur|makan siang|tengah hari',
      'sore|ashar|petang|menjelang malam',
      'malam|maghrib|isya|tidur|sebelum tidur'
    ]
  },
  aktivitas: {
    weight: 1.0,
    patterns: [
      'makan|makanan|minum|minuman|santap',
      'wc|toilet|buang air|kamar mandi',
      'perjalanan|safar|bepergian|travel|mudik',
      'keluar|keluar rumah|berangkat|pergi',
      'masuk|masuk rumah|pulang|kembali',
      'wudhu|ablusi|bersuci|berwudhu',
      'sholat|salat|sembahyang|ibadah',
      'belajar|sekolah|kuliah|ujian|pendidikan',
      'kerja|bekerja|kantor|usaha|pekerjaan'
    ]
  },
  perasaan: {
    weight: 0.8,
    patterns: [
      'takut|khawatir|cemas|gelisah|was-was',
      'sedih|susah|duka|kecewa|galau',
      'sakit|penyakit|tidak sehat|kurang sehat',
      'senang|gembira|bahagia|suka cita',
      'marah|emosi|kesal|jengkel',
      'stress|tertekan|beban|lelah'
    ]
  },
  kondisi: {
    weight: 0.7,
    patterns: [
      'susah|sulit|masalah|kesulitan|ujian|cobaan',
      'mudah|lancar|dimudahkan|dipermudah',
      'sehat|kuat|bugar|segar',
      'lemah|sakit|letih|capek',
      'kaya|mampu|berkecukupan|berkah',
      'miskin|susah|kekurangan|tidak mampu'
    ]
  }
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
    const fuseOptions = {
      keys: [
        { name: 'nama', weight: 1.0 },
        { name: 'idn', weight: 0.9 },
        { name: 'grup', weight: 0.7 },
        { name: 'tag', weight: 0.5 },
        { name: 'ar', weight: 0.3 },
        { name: 'tr', weight: 0.4 }
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      findAllMatches: true
    };
    
    this.fuse = new Fuse(this.doaList, fuseOptions);
  }

  private buildContextIndex() {
    this.doaList.forEach(doa => {
      const searchableText = [
        doa.nama,
        doa.grup,
        doa.idn,
        ...(doa.tag || [])
      ].join(' ').toLowerCase();

      // Index by context categories
      Object.entries(contextCategories).forEach(([category, { patterns }]) => {
        patterns.forEach(pattern => {
          const keywords = pattern.split('|');
          const hasMatch = keywords.some(keyword =>
            searchableText.includes(keyword.replace('_', ' '))
          );
          
          if (hasMatch) {
            const key = `${category}:${pattern}`;
            if (!this.contextIndex.has(key)) {
              this.contextIndex.set(key, new Set());
            }
            this.contextIndex.get(key)!.add(doa.slug);
          }
        });
      });

      // Index individual important words for direct matching
      const words = searchableText.split(/\s+/);
      words.forEach(word => {
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
    const expandedTerms = new Set<string>();
    
    words.forEach(word => {
      expandedTerms.add(word);
      
      // Add synonyms
      Object.entries(synonymMap).forEach(([key, synonyms]) => {
        if (word.includes(key) || synonyms.some(syn => word.includes(syn))) {
          expandedTerms.add(key);
          synonyms.forEach(syn => expandedTerms.add(syn));
        }
      });
    });
    
    return Array.from(expandedTerms);
  }

  private getContextualMatches(query: string): Map<string, number> {
    const expandedTerms = this.expandQuery(query);
    const matches = new Map<string, number>();

    // Check context patterns
    Object.entries(contextCategories).forEach(([category, { weight, patterns }]) => {
      patterns.forEach(pattern => {
        const keywords = pattern.split('|');
        const matchCount = keywords.filter(keyword =>
          expandedTerms.some(term => 
            term.includes(keyword.replace('_', ' ')) || 
            keyword.replace('_', ' ').includes(term)
          )
        ).length;

        if (matchCount > 0) {
          const key = `${category}:${pattern}`;
          const slugs = this.contextIndex.get(key) || new Set();
          const score = (matchCount / keywords.length) * weight;
          
          slugs.forEach(slug => {
            const currentScore = matches.get(slug) || 0;
            matches.set(slug, Math.max(currentScore, score));
          });
        }
      });
    });

    // Check direct word matches
    expandedTerms.forEach(term => {
      if (term.length > 2) {
        const key = `word:${term}`;
        const slugs = this.contextIndex.get(key) || new Set();
        
        slugs.forEach(slug => {
          const currentScore = matches.get(slug) || 0;
          matches.set(slug, Math.max(currentScore, 0.6));
        });
      }
    });

    return matches;
  }

  public search(query: string): DoaSearchResult[] {
    if (!query || query.length < 2) return [];

    // Get fuzzy search results
    const fuseResults = this.fuse.search(query);
    const fuzzyMatches = new Map<string, number>();
    
    fuseResults.forEach(result => {
      fuzzyMatches.set(result.item.slug, result.score || 1);
    });

    // Get contextual matches
    const contextualMatches = this.getContextualMatches(query);

    // Combine results with scoring
    const combinedMatches = new Map<string, DoaSearchResult>();
    const processedSlugs = new Set<string>();

    // Process contextual matches (higher priority)
    contextualMatches.forEach((contextScore, slug) => {
      const doa = this.doaList.find(d => d.slug === slug);
      if (doa) {
        const fuzzyScore = fuzzyMatches.get(slug) || 0.8;
        const combinedScore = Math.min(contextScore * 0.3 + fuzzyScore * 0.7, 0.95);
        
        combinedMatches.set(slug, {
          item: doa,
          score: combinedScore
        });
        processedSlugs.add(slug);
      }
    });

    // Process remaining fuzzy matches
    fuzzyMatches.forEach((fuzzyScore, slug) => {
      if (!processedSlugs.has(slug)) {
        const doa = this.doaList.find(d => d.slug === slug);
        if (doa) {
          combinedMatches.set(slug, {
            item: doa,
            score: fuzzyScore
          });
        }
      }
    });

    // Sort by relevance and return top results
    return Array.from(combinedMatches.values())
      .sort((a, b) => a.score - b.score)
      .slice(0, 20);
  }

  // Method to get search suggestions based on partial input
  public getSuggestions(partialQuery: string, limit: number = 5): string[] {
    if (partialQuery.length < 1) return [];

    const suggestions = new Set<string>();
    const lowerQuery = partialQuery.toLowerCase();

    // Add category-based suggestions
    Object.keys(synonymMap).forEach(key => {
      if (key.startsWith(lowerQuery) || lowerQuery.includes(key.substring(0, 2))) {
        suggestions.add(key);
      }
    });

    // Add common phrases from doa names
    this.doaList.forEach(doa => {
      const words = doa.nama.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.startsWith(lowerQuery) && word.length > 2) {
          suggestions.add(word);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }
}