// utils/hafalan/schedule.ts

export const scheduleUtils = {
  generateReviewSchedule(startDate: Date): ReviewSchedule[] {
    const reviewDates: Date[] = [];

    // First 7 consecutive days
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      reviewDates.push(date);
    }

    // Weekly reviews on day 14, 21, and 28
    [14, 21, 28].forEach((day) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      reviewDates.push(date);
    });

    return reviewDates.map((date) => ({
      date,
      completed: false,
      peerReviews: [],
    }));
  },

  getNextReview(target: MemorizationTarget): Date | null {
    const pendingReview = target.reviews
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .find((r) => !r.completed);
    return pendingReview?.date || null;
  },

  // Helper to get review progress description
  getReviewProgress(target: MemorizationTarget): string {
    const completedCount = target.reviews.filter((r) => r.completed).length;
    return `${completedCount}/10 reviews completed`;
  },

  // Helper to check if daily reviews are complete
  isDailyReviewsComplete(target: MemorizationTarget): boolean {
    const firstWeekReviews = target.reviews.filter((r) => {
      const diffDays = Math.floor(
        (r.date.getTime() - target.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays < 7;
    });
    return firstWeekReviews.every((r) => r.completed);
  },

  // Helper to check if weekly reviews are complete
  isWeeklyReviewsComplete(target: MemorizationTarget): boolean {
    const weeklyReviews = target.reviews.filter((r) => {
      const diffDays = Math.floor(
        (r.date.getTime() - target.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 7;
    });
    return weeklyReviews.every((r) => r.completed);
  },
};

export const statisticsUtils = {
  calculateStatistics(targets: MemorizationTarget[]): Statistics {
    const stats: Statistics = {
      totalAyahMemorized: 0,
      averageReviewScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      reviewCompletion: 0,
      weeklyProgress: [],
    };

    // Calculate total ayah memorized
    stats.totalAyahMemorized = targets.reduce((total, target) => {
      if (
        target.status === "MUTQIN" ||
        target.status === "MEMORIZED_SELF_REVIEW" ||
        target.status === "MEMORIZED_TEACHER_REVIEW"
      ) {
        const ayahCount =
          target.ayahRange.endSurah - target.ayahRange.startSurah === 0
            ? target.ayahRange.endAyah - target.ayahRange.startAyah + 1
            : target.ayahRange.endAyah; // TODO: Need to handle multi-surah ranges
        return total + ayahCount;
      }
      return total;
    }, 0);

    // Calculate review completion
    const totalReviews = targets.reduce((sum, t) => sum + t.reviews.length, 0);
    const completedReviews = targets.reduce(
      (sum, t) => sum + t.reviews.filter((r) => r.completed).length,
      0
    );
    stats.reviewCompletion = totalReviews
      ? (completedReviews / totalReviews) * 100
      : 0;

    return stats;
  },

  updateWeeklyProgress(target: MemorizationTarget): void {
    const currentWeek = new Date().toISOString().slice(0, 10);
    const weekProgress = target.statistics.weeklyProgress.find(
      (w) => w.week === currentWeek
    );

    if (weekProgress) {
      weekProgress.ayahCount++;
      weekProgress.reviewCount = target.reviews.filter(
        (r) => r.completed
      ).length;
    } else {
      target.statistics.weeklyProgress.push({
        week: currentWeek,
        ayahCount: 1,
        reviewCount: 0,
      });
    }
  },
};

// utils/hafalan/achievements.ts

export const achievementUtils = {
  checkAchievements(target: MemorizationTarget): Achievement[] {
    const newAchievements: Achievement[] = [];

    // Check for milestones
    if (
      target.statistics.totalAyahMemorized >= 100 &&
      !target.achievements.some((a) => a.name === "Century Memorizer")
    ) {
      newAchievements.push({
        id: crypto.randomUUID(),
        name: "Century Memorizer",
        description: "Memorized 100 ayahs",
        unlockedAt: new Date(),
        type: "MILESTONE",
      });
    }

    // Check for streaks
    if (
      target.statistics.currentStreak >= 7 &&
      !target.achievements.some((a) => a.name === "Week Warrior")
    ) {
      newAchievements.push({
        id: crypto.randomUUID(),
        name: "Week Warrior",
        description: "Maintained a 7-day streak",
        unlockedAt: new Date(),
        type: "STREAK",
      });
    }

    return newAchievements;
  },
};

// utils/hafalan/factory.ts
import {
  MemorizationTarget,
  AyahRange,
  MemorizationStatus,
  ReviewSchedule,
  Statistics,
  Achievement,
  AchievementRule,
} from "@/types/hafalan";

export const createNewTarget = (ayahRange: AyahRange): MemorizationTarget => {
  return {
    id: crypto.randomUUID(),
    ayahRange,
    status: "PLANNED" as MemorizationStatus,
    preparation: {
      listeningCount: 0,
      readingMinutes: 0,
      memorizationMinutes: 0,
      recordings: [],
      tajweed: {
        rules: [],
        lastChecked: new Date(),
      },
      understanding: {
        translation: "",
        briefTafsir: "",
        keywords: [],
        notes: [],
        lastStudied: new Date(),
      },
      lastUpdated: new Date(),
    },
    logs: [],
    reviews: [],
    notes: [],
    achievements: [],
    statistics: {
      totalAyahMemorized: 0,
      averageReviewScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      reviewCompletion: 0,
      weeklyProgress: [],
    },
    teacherAssignments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const DAILY_MINIMUM_REVIEW_COUNT = 3;

export const MINIMUM_LISTENING_COUNT = 10;
export const MINIMUM_READING_MINUTES = 40;
export const MINIMUM_MEMOIZATION_MINUTES = 20;

// Predefined achievement rules
export const ACHIEVEMENT_RULES: AchievementRule[] = [
  // Streak Achievements
  {
    id: "STREAK_1",
    name: "Permulaan Indah",
    description:
      "Alhamdulillah! Kamu konsisten 1 hari. Bismillah untuk seterusnya!",
    type: "STREAK",
    threshold: 1,
  },
  {
    id: "STREAK_3",
    name: "Tiga Hari Beruntun",
    description: "MasyaAllah, 3 hari berturut-turut! Semangat terus ya!",
    type: "STREAK",
    threshold: 3,
  },
  {
    id: "STREAK_7",
    name: "Seminggu Penuh Berkah",
    description: "Subhanallah, seminggu penuh! Konsistensimu luar biasa!",
    type: "STREAK",
    threshold: 7,
  },
  {
    id: "STREAK_21",
    name: "Tiga Pekan Istiqomah",
    description: "MasyaAllah Tabarakallah! 21 hari konsisten, kamu hebat!",
    type: "STREAK",
    threshold: 21,
  },
  {
    id: "STREAK_30",
    name: "Bulan Penuh Hikmah",
    description: "Allahu Akbar! Sebulan penuh tanpa jeda. Keren banget!",
    type: "STREAK",
    threshold: 30,
  },
  {
    id: "STREAK_50",
    name: "Lima Puluh Hari Bersinar",
    description: "50 hari berturut-turut! SubhanAllah, istiqomahmu luar biasa!",
    type: "STREAK",
    threshold: 50,
  },
  {
    id: "STREAK_100",
    name: "Seratus Hari Penuh Makna",
    description:
      "100 hari! MasyaAllah, kamu benar-benar teladan dalam konsistensi!",
    type: "STREAK",
    threshold: 100,
  },
  {
    id: "STREAK_250",
    name: "Perjalanan 250 Hari",
    description: "250 hari! Allahu Akbar, semoga menjadi amal jariyah untukmu!",
    type: "STREAK",
    threshold: 250,
  },
  {
    id: "STREAK_500",
    name: "Setengah Ribu Hari Berkah",
    description: "500 hari! SubhanAllah, sungguh prestasi yang menakjubkan!",
    type: "STREAK",
    threshold: 500,
  },
  {
    id: "STREAK_1000",
    name: "Seribu Hari Penuh Hikmah",
    description:
      "1000 hari! MasyaAllah Tabarakallah, kamu inspirasi bagi semua!",
    type: "STREAK",
    threshold: 1000,
  },

  // Milestone Achievements (Ayah Count)
  {
    id: "AYAH_7",
    name: "Tujuh Permata Pertama",
    description: "Subhanallah, 7 ayat telah kamu hafal. Awal yang baik!",
    type: "MILESTONE",
    threshold: 7,
  },
  {
    id: "AYAH_21",
    name: "Cahaya 21 Ayat",
    description: "21 ayat! MasyaAllah, hafalanmu semakin bertambah!",
    type: "MILESTONE",
    threshold: 21,
  },
  {
    id: "AYAH_30",
    name: "Tiga Puluh Mutiara",
    description: "30 ayat, Alhamdulillah! Terus bersinar!",
    type: "MILESTONE",
    threshold: 30,
  },
  {
    id: "AYAH_50",
    name: "Setengah Ratus Ayat",
    description: "50 ayat, SubhanAllah! Semoga berkah selalu menyertaimu!",
    type: "MILESTONE",
    threshold: 50,
  },
  {
    id: "AYAH_100",
    name: "Seratus Ayat Bercahaya",
    description: "100 ayat! MasyaAllah, koleksi mutiaramu semakin berharga!",
    type: "MILESTONE",
    threshold: 100,
  },
  {
    id: "AYAH_250",
    name: "Perempat Jalan Menuju Cahaya",
    description: "250 ayat! Allahu Akbar, seperempat jalan menuju hafiz Quran!",
    type: "MILESTONE",
    threshold: 250,
  },
  {
    id: "AYAH_500",
    name: "Setengah Perjalanan Qurani",
    description: "500 ayat! SubhanAllah, kamu sudah di tengah perjalanan!",
    type: "MILESTONE",
    threshold: 500,
  },
  {
    id: "AYAH_1000",
    name: "Seribu Ayat Terukir",
    description:
      "1000 ayat! MasyaAllah Tabarakallah, sungguh pencapaian luar biasa!",
    type: "MILESTONE",
    threshold: 1000,
  },

  // Quality Achievements
  {
    id: "QUALITY_FIRST_REVIEW",
    name: "Langkah Awal Murojaah",
    description: "Alhamdulillah, murojaah pertamamu sukses! Pertahankan ya!",
    type: "QUALITY",
    threshold: 1,
  },
  {
    id: "QUALITY_PERFECT_REVIEW",
    name: "Murojaah Gemilang",
    description: "MasyaAllah, murojaah tanpa kesalahan! Kamu luar biasa!",
    type: "QUALITY",
    threshold: 100,
  },
  {
    id: "QUALITY_5_PERFECT",
    name: "Lima Bintang Murojaah",
    description:
      "Subhanallah, 5 kali murojaah sempurna! Hafalanmu kokoh sekali!",
    type: "QUALITY",
    threshold: 5,
  },
  {
    id: "QUALITY_10_CONSECUTIVE",
    name: "Sepuluh Langkah Konsisten",
    description:
      "10 murojaah berturut-turut dengan nilai tinggi! MasyaAllah, luar biasa!",
    type: "QUALITY",
    threshold: 10,
  },
];
