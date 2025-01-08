// types/hafalan.ts

// 1. Core Data Types
interface Surah {
  id: number;
  name: string;
  arabicName: string;
  totalAyah: number;
  juz: number[];
}

interface AyahRange {
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

// 2. Memorization Status
type MemorizationStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "MEMORIZED_SELF_REVIEW"
  | "MEMORIZED_TEACHER_REVIEW"
  | "MUTQIN"
  | "NEEDS_REVIEW";

export const memorizationStatusLabels: Record<MemorizationStatus, string> = {
  PLANNED: "Direncanakan",
  IN_PROGRESS: "Sedang Dihafal",
  MEMORIZED_SELF_REVIEW: "Hafal Dengan Murajaah Mandiri",
  MEMORIZED_TEACHER_REVIEW: "Hafal Dengan Murajaah Guru",
  MUTQIN: "Mutqin",
  NEEDS_REVIEW: "Perlu Di Murajaah",
};

// 3. Tracking Related Types
interface TajweedTracking {
  rules: {
    ruleName: string;
    mastered: boolean;
    mistakes: {
      date: Date;
      description: string;
    }[];
  }[];
  lastChecked: Date;
}

interface UnderstandingTracking {
  translation: string;
  briefTafsir: string;
  keywords: string[];
  notes: string[];
  lastStudied: Date;
}

interface RecordingSession {
  id: string;
  audioUrl: string;
  date: Date;
  duration: number;
  teacherFeedback?: string;
}

interface PreparationTracking {
  listeningCount: number;
  readingMinutes: number;
  memorizationMinutes: number;
  recordings: RecordingSession[];
  tajweed: TajweedTracking;
  understanding: UnderstandingTracking;
  lastUpdated: Date;
}

// 4. Review Related Types
type PeerReviewSlotTime = "Pagi" | "Siang" | "Malam";
interface PeerReview {
  date: Date;
  peerId: string;
  mistakes: string;
  feedback: string;
  mushafahah: boolean;
  slot?: PeerReviewSlotTime;
}

interface ReviewSchedule {
  date: Date;
  completed: boolean;
  peerReviews: PeerReview[];
}

// 5. Achievement and Statistics
// Keep the existing Achievement interface
interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  type: "MILESTONE" | "STREAK" | "QUALITY";
}

// Add this new type for achievement rules
interface AchievementRule {
  id: string;
  name: string;
  description: string;
  type: "MILESTONE" | "STREAK" | "QUALITY";
  threshold: number;
}

interface Statistics {
  totalAyahMemorized: number;
  averageReviewScore: number;
  currentStreak: number;
  longestStreak: number;
  reviewCompletion: number;
  weeklyProgress: {
    week: string;
    ayahCount: number;
    reviewCount: number;
  }[];
}

// 6. Main Target Type
interface MemorizationTarget {
  id: string;
  ayahRange: AyahRange;
  status: MemorizationStatus;
  preparation: PreparationTracking;
  logs: MemorizationProgressLog[]; // Note: MemorizationLog type needs to be defined
  reviews: ReviewSchedule[];
  lastReviewDate?: Date;
  notes: string[];
  achievements: Achievement[];
  statistics: Statistics;
  teacherAssignments: {
    date: Date;
    instructions: string;
    completed: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// types/hafalan.ts

// Add missing MemorizationLog type
interface MemorizationProgressLog {
  id: string;
  date: Date;
  ayahRange: AyahRange;
  duration?: number;
  notes?: string;
}

// Re-export all types including the new one
export type {
  Surah,
  AyahRange,
  MemorizationStatus,
  TajweedTracking,
  UnderstandingTracking,
  RecordingSession,
  PreparationTracking,
  PeerReview,
  ReviewSchedule,
  Achievement,
  Statistics,
  MemorizationTarget,
  MemorizationProgressLog, // Add new type to exports
  AchievementRule,
  PeerReviewSlotTime,
};

// Note: We might also need some helper types for specific use cases
export type TimeSlot = "morning" | "afternoon" | "evening";

export type AchievementType = "MILESTONE" | "STREAK" | "QUALITY";

export type ActivityType = "LISTENING" | "READING" | "MEMORIZING" | "REVIEW";

// This type is useful for form handling
export type NewTargetInput = Omit<
  MemorizationTarget,
  | "id"
  | "status"
  | "preparation"
  | "logs"
  | "reviews"
  | "achievements"
  | "statistics"
  | "createdAt"
  | "updatedAt"
> & {
  status?: MemorizationStatus;
};
