// lib/stores/hafalan-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MemorizationTarget,
  AyahRange,
  MemorizationStatus,
  ReviewSchedule,
  PeerReview,
  MemorizationProgressLog,
} from "@/types/hafalan";
import {
  scheduleUtils,
  statisticsUtils,
  achievementUtils,
  DAILY_MINIMUM_REVIEW_COUNT,
} from "@/lib/utils/hafalan";

export interface Review {
  date: string;
  isSmooth: boolean;
  notes: { ayah: number; note: string }[];
}

export interface Segment {
  startPage: number;
  endPage: number;
  startVerse: number;
  endVerse: number;
  reviews?: Review[];
}

export interface SurahDetail {
  surahNumber: number;
  createdAt: Date;
  lastReviewDate: Date | null;
  onGoing?: [number, number][];
  segments: Segment[];
  id: string;
}

interface MemorizedSummary {
  meta: {
    totalAyahMemorized: number;
    totalSurahsMemorized: number;
    lastReviewDate: Date | null;
    reviewStreak: {
      current: number;
      longest: number;
    };
  };
  surahDetails: SurahDetail[];
}

interface HafalanState {
  memorizedSummary: {
    meta: {
      totalAyahMemorized: number;
      totalSurahsMemorized: number;
      lastReviewDate: Date | null;
      reviewStreak: {
        current: number;
        longest: number;
      };
    };
    surahDetails: SurahDetail[];
  };
  targets: MemorizationTarget[];
  activeTargetId: string | null;
  // Actions for targets
  addTarget: (ayahRange: AyahRange) => void;
  updateTarget: (target: MemorizationTarget) => void;
  removeTarget: (id: string) => void;
  setActiveTarget: (id: string | null) => void;
  // Actions for preparation tracking
  updatePreparation: (
    targetId: string,
    type: "listening" | "reading" | "memorizing",
    value: number
  ) => void;
  // Actions for reviews
  addReview: (targetId: string, review: ReviewSchedule) => void;
  completeReview: (
    targetId: string,
    reviewDate: Date,
    peerReview: PeerReview
  ) => void;
  // Actions for status
  updateStatus: (targetId: string, status: MemorizationStatus) => void;
  addLog: (targetId: string, log: MemorizationProgressLog) => void;

  updateMeta: (meta: Partial<MemorizedSummary["meta"]>) => void;
  addSurahDetail: (surahDetail: SurahDetail) => void;
  updateSurahDetail: (
    surahNumber: number,
    updates: Partial<SurahDetail>
  ) => void;
  addReviewSegment: (
    surahNumber: number,
    segmentIndex: number,
    review: Review
  ) => void;
}

export const useHafalanStore = create<HafalanState>()(
  persist(
    (set, get) => ({
      memorizedSummary: {
        meta: {
          totalAyahMemorized: 0,
          totalSurahsMemorized: 0,
          lastReviewDate: null,
          reviewStreak: {
            current: 0,
            longest: 0,
          },
        },
        surahDetails: [],
      },
      targets: [],
      activeTargetId: null,

      addTarget: (ayahRange) =>
        set((state) => {
          const newTarget: MemorizationTarget = {
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
            lastReviewDate: undefined,
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

          return { targets: [...state.targets, newTarget] };
        }),

      updateTarget: (updatedTarget) =>
        set((state) => ({
          targets: state.targets.map((target) =>
            target.id === updatedTarget.id ? updatedTarget : target
          ),
        })),

      removeTarget: (id) =>
        set((state) => ({
          targets: state.targets.filter((target) => target.id !== id),
          activeTargetId:
            state.activeTargetId === id ? null : state.activeTargetId,
        })),

      addLog: (targetId, log) => {
        set((state) => ({
          targets: state.targets.map((target) =>
            target.id === targetId
              ? { ...target, logs: [...target.logs, log] }
              : target
          ),
        }));
      },

      setActiveTarget: (id) =>
        set((state) => {
          if (id === null) {
            return { activeTargetId: null };
          }

          const updatedTargets = state.targets.map((target) => {
            if (target.id === id && target.status === "PLANNED") {
              return {
                ...target,
                status: "IN_PROGRESS" as MemorizationStatus,
                updatedAt: new Date(),
              };
            }
            return target;
          });

          return {
            activeTargetId: id,
            targets: updatedTargets,
          };
        }),
      // Add the missing addReview action
      addReview: (targetId, review) =>
        set((state) => ({
          targets: state.targets.map((target) => {
            if (target.id !== targetId) return target;

            return {
              ...target,
              reviews: [...target.reviews, review],
              updatedAt: new Date(),
            };
          }),
        })),

      updatePreparation: (targetId, type, value) =>
        set((state) => ({
          targets: state.targets.map((target) => {
            if (target.id !== targetId) return target;

            const preparation = { ...target.preparation };
            switch (type) {
              case "listening":
                preparation.listeningCount = value;
                break;
              case "reading":
                preparation.readingMinutes = value;
                break;
              case "memorizing":
                preparation.memorizationMinutes = value;
                break;
            }
            preparation.lastUpdated = new Date();

            // Check for status update based on preparation progress
            let status = target.status;
            if (
              preparation.listeningCount >= 10 &&
              preparation.readingMinutes >= 40 &&
              preparation.memorizationMinutes >= 20
            ) {
              status = "IN_PROGRESS" as MemorizationStatus;
            }

            return {
              ...target,
              preparation,
              status,
              updatedAt: new Date(),
            };
          }),
        })),

      completeReview: (targetId, reviewDate, peerReview) =>
        set((state) => ({
          targets: state.targets.map((target) => {
            if (target.id !== targetId) return target;

            const reviews = target.reviews.map((review) => {
              if (review.date.getTime() === reviewDate.getTime()) {
                const peerReviews = [...review.peerReviews, peerReview];
                const completed =
                  peerReviews.length >= DAILY_MINIMUM_REVIEW_COUNT;
                return {
                  ...review,
                  completed,
                  peerReviews,
                };
              }
              return review;
            });

            // Update statistics
            const statistics = statisticsUtils.calculateStatistics([
              {
                ...target,
                reviews,
              },
            ]);

            // Check for new achievements
            const newAchievements = achievementUtils.checkAchievements({
              ...target,
              reviews,
              statistics,
            });

            return {
              ...target,
              reviews,
              statistics,
              achievements: [...target.achievements, ...newAchievements],
              lastReviewDate: new Date(),
              updatedAt: new Date(),
            };
          }),
        })),

      updateStatus: (targetId, status) =>
        set((state) => ({
          targets: state.targets.map((target) => {
            if (target.id === targetId) {
              let updatedTarget = { ...target, status, updatedAt: new Date() };

              // Check if status is changing from IN_PROGRESS to MEMORIZED_SELF_REVIEW
              if (
                target.status === "IN_PROGRESS" &&
                status === "MEMORIZED_SELF_REVIEW"
              ) {
                // Generate new review schedule
                const newReviews = scheduleUtils.generateReviewSchedule(
                  new Date()
                );
                updatedTarget = {
                  ...updatedTarget,
                  reviews: [...updatedTarget.reviews, ...newReviews],
                };
              }

              return updatedTarget;
            }
            return target;
          }),
        })),
      updateMeta: (meta) =>
        set((state) => ({
          memorizedSummary: {
            ...state.memorizedSummary,
            meta: { ...state.memorizedSummary.meta, ...meta },
          },
        })),
      addSurahDetail: (surahDetail) => {
        set((state) => ({
          memorizedSummary: {
            ...state.memorizedSummary,
            surahDetails: [...state.memorizedSummary.surahDetails, surahDetail],
          },
        }));
      },
      updateSurahDetail: (surahNumber, updates) =>
        set((state) => ({
          memorizedSummary: {
            ...state.memorizedSummary,
            surahDetails: state.memorizedSummary.surahDetails.map((detail) =>
              detail.surahNumber === surahNumber
                ? { ...detail, ...updates }
                : detail
            ),
          },
        })),
      addReviewSegment: (surahNumber, segmentIndex, review) =>
        set((state) => ({
          memorizedSummary: {
            ...state.memorizedSummary,
            surahDetails: state.memorizedSummary.surahDetails.map((detail) =>
              detail.surahNumber === surahNumber
                ? {
                    ...detail,
                    segments: detail.segments.map((segment, index) =>
                      index === segmentIndex
                        ? {
                            ...segment,
                            reviews: [...(segment.reviews || []), review],
                          }
                        : segment
                    ),
                    lastReviewDate: new Date(),
                  }
                : detail
            ),
          },
        })),
    }),
    {
      name: "hafalan-storage",
      version: 1,
      storage: {
        getItem: (name: string) => {
          const item = localStorage.getItem(name);
          if (!item) return null;

          const parsed = JSON.parse(item);

          // Parse dates in the targets array
          if (parsed.state && Array.isArray(parsed.state.targets)) {
            parsed.state.targets = parsed.state.targets.map(
              (target: MemorizationTarget) => ({
                ...target,
                createdAt: new Date(target.createdAt),
                updatedAt: new Date(target.updatedAt),
                preparation: {
                  ...target.preparation,
                  lastUpdated: new Date(target.preparation.lastUpdated),
                  tajweed: {
                    ...target.preparation.tajweed,
                    lastChecked: new Date(
                      target.preparation.tajweed.lastChecked
                    ),
                  },
                  understanding: {
                    ...target.preparation.understanding,
                    lastStudied: new Date(
                      target.preparation.understanding.lastStudied
                    ),
                  },
                },
                reviews: target.reviews.map((review: ReviewSchedule) => ({
                  ...review,
                  date: new Date(review.date),
                })),
                lastReviewDate: target.lastReviewDate
                  ? new Date(target.lastReviewDate)
                  : undefined,
              })
            );
          }

          if (parsed.state && parsed.state.memorizedSummary) {
            parsed.state.memorizedSummary.meta = {
              ...parsed.state.memorizedSummary.meta,
              lastReviewDate: parsed.state.memorizedSummary.meta?.lastReviewDate
                ? new Date(parsed.state.memorizedSummary.meta.lastReviewDate)
                : null,
            };

            parsed.state.memorizedSummary.surahDetails =
              parsed.state.memorizedSummary.surahDetails.map(
                (detail: SurahDetail) => ({
                  ...detail,
                  createdAt: new Date(detail.createdAt),
                  lastReviewDate: detail.lastReviewDate
                    ? new Date(detail.lastReviewDate)
                    : null,
                })
              );
          }

          return parsed;
        },
        setItem: (name: string, value: unknown) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);

// Selectors
export const useActiveTarget = () =>
  useHafalanStore((state) =>
    state.targets.find((t) => t.id === state.activeTargetId)
  );

export const useTargetStatistics = (targetId: string) =>
  useHafalanStore(
    (state) => state.targets.find((t) => t.id === targetId)?.statistics
  );
