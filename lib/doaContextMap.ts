import { DoaContextMap } from "@/types/doa";

// Context mapping untuk semantic search berdasarkan PRD
export const doaContextMap: DoaContextMap = {
  "waktu": {
    "pagi|subuh|bangun|fajar": [], // Will be populated dynamically
    "siang|dzuhur|makan|tengah_hari": [],
    "sore|ashar|petang": [],
    "malam|maghrib|isya|tidur": []
  },
  "aktivitas": {
    "makan|makanan|minum|minuman": [],
    "wc|toilet|buang_air|istinja": [],
    "perjalanan|safar|bepergian|travel|jalan": [],
    "keluar|keluar_rumah|berangkat": [],
    "masuk|masuk_rumah|pulang|rumah": [],
    "wudhu|ablusi|bersuci": [],
    "sholat|salat|sembahyang": [],
    "belajar|sekolah|kuliah|ujian": [],
    "kerja|bekerja|kantor|usaha": []
  },
  "perasaan": {
    "takut|khawatir|cemas|gelisah": [],
    "sedih|susah|duka|berduka": [],
    "sakit|penyakit|kesehatan|sehat": [],
    "senang|gembira|bahagia|sukacita": [],
    "marah|emosi|kesal": [],
    "stress|tertekan|beban": []
  },
  "cuaca": {
    "hujan|gerimis|badai|petir": [],
    "panas|terik|siang": [],
    "angin|topan|ribut": [],
    "dingin|sejuk": []
  },
  "tempat": {
    "rumah|home|tempat_tinggal": [],
    "masjid|mushola|surau": [],
    "pasar|toko|belanja": [],
    "kendaraan|mobil|motor|pesawat": [],
    "kamar_mandi|wc|toilet": [],
    "sekolah|kampus|universitas": []
  },
  "orang": {
    "orang_tua|ayah|ibu|keluarga": [],
    "anak|putra|putri|keturunan": [],
    "suami|istri|pasangan": [],
    "teman|sahabat|kawan": [],
    "tetangga|lingkungan": [],
    "musuh|lawan|yang_menyakiti": []
  },
  "kondisi": {
    "susah|sulit|masalah|ujian|cobaan": [],
    "mudah|lancar|berkah|rezeki": [],
    "sehat|kuat|bugar": [],
    "lemah|sakit|letih": [],
    "kaya|mampu|berkecukupan": [],
    "miskin|susah|kekurangan": []
  }
};

// Keywords untuk natural language processing
export const naturalLanguageKeywords = {
  // Time-related
  "ketika": ["saat", "waktu", "pada_saat"],
  "sebelum": ["sebelum", "mau", "akan"],
  "sesudah": ["setelah", "habis", "usai"],
  
  // Action-related  
  "mau": ["akan", "hendak", "ingin"],
  "lagi": ["sedang", "tengah"],
  "sudah": ["telah", "selesai"],
  
  // Feeling-related
  "merasa": ["rasa", "perasaan"],
  "takut": ["khawatir", "cemas", "was-was"],
  "senang": ["gembira", "bahagia", "suka"],
  "sedih": ["duka", "susah", "kecewa"]
};

// Function to populate context map with doa IDs based on tags and content
export const populateContextMap = (doaList: any[]) => {
  const contextMap = JSON.parse(JSON.stringify(doaContextMap)); // Deep copy
  
  doaList.forEach((doa) => {
    const searchableText = [
      doa.nama,
      doa.grup,
      doa.idn,
      ...doa.tag
    ].join(' ').toLowerCase();

    // Check each context category
    Object.keys(contextMap).forEach((category) => {
      Object.keys(contextMap[category]).forEach((pattern) => {
        const keywords = pattern.split('|');
        
        // Check if any keyword matches
        const hasMatch = keywords.some(keyword => 
          searchableText.includes(keyword.replace('_', ' '))
        );
        
        if (hasMatch) {
          contextMap[category][pattern].push(doa.id);
        }
      });
    });
  });
  
  return contextMap;
};