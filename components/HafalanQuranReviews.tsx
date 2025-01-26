import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Book,
  ThumbsUp,
  ThumbsDown,
  History,
  Trash,
  LinkIcon,
  CheckCheck,
} from "lucide-react";
import { Segment, useHafalanStore } from "@/lib/stores/hafalan-store";
import { calculateSurahSegments, surahsBahasa } from "@/content/quran/metadata";
import AddSurahReviewForm from "./AddSurahReview";
import Link from "next/link";
import { Tooltip, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const COUNT_REVIEW_REQUIRED = 2;

const HafalanQuranReviews = () => {
  const { memorizedSummary, addSurahDetail, addReviewSegment } =
    useHafalanStore();

  const [selectedSegment, setSelectedSegment] = useState<{
    surahId: number;
    segmentIndex: number;
  } | null>(null);
  const [reviewNote, setReviewNote] = useState<
    { ayah: number; note: string }[]
  >([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const getLastReview = (segments: Segment[]): string | null => {
    let lastDate: string | null = null;
    segments.forEach((segment) => {
      const segmentLastReview = segment.reviews
        ? segment.reviews[segment.reviews.length - 1]?.date
        : null;
      if (
        !lastDate ||
        (segmentLastReview && new Date(segmentLastReview) > new Date(lastDate))
      ) {
        lastDate = segmentLastReview;
      }
    });
    return lastDate;
  };

  const getDaysSinceReview = (lastReview: string | null): number => {
    if (!lastReview) return Infinity;
    const today = new Date();
    const review = new Date(lastReview);
    const diffTime = Math.abs(today.getTime() - review.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getSegmentStatus = (
    segment: Segment
  ): "unreviewed" | "smooth" | "needs-work" => {
    const lastReview = segment.reviews
      ? segment.reviews[segment.reviews.length - 1]
      : null;
    if (!lastReview) return "unreviewed";
    return lastReview.isSmooth ? "smooth" : "needs-work";
  };

  const calculateProgress = (
    segments: Segment[],
    totalAyahs: number
  ): number => {
    const uniqueAyahsWithNotes = new Set<number>();
    let hasReviews = false;

    segments.forEach((segment) => {
      if (segment.reviews && segment.reviews.length > 0) {
        hasReviews = true;
        // Get the latest review for this segment
        const latestReview = segment.reviews[segment.reviews.length - 1];

        if (!latestReview.isSmooth) {
          latestReview.notes.forEach((note) => {
            uniqueAyahsWithNotes.add(note.ayah);
          });
        }
      }
    });

    // If there are no reviews, return 0
    if (!hasReviews) {
      return 0;
    }

    const smoothAyahs = totalAyahs - uniqueAyahsWithNotes.size;
    const progress = (smoothAyahs / totalAyahs) * 100;
    return Math.round(progress);
  };

  // Check if a surah is recently created (within 7 days)
  const isRecentlyCreated = (createdDate: string): boolean => {
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = now.getTime() - created.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const getTodayReviewCount = (segments: Segment[]): number => {
    const today = new Date().toISOString().split("T")[0];

    if (segments.length === 0) return 0;

    if (segments.length === 1) {
      // For short surahs with a single segment
      return (
        segments[0].reviews?.filter((review) => review.date.startsWith(today))
          .length ?? 0
      );
    } else {
      // For longer surahs with multiple segments
      const reviewCountsPerSegment = segments.map(
        (segment) =>
          segment.reviews?.filter((review) => review.date.startsWith(today))
            .length ?? 0
      );

      // Find the minimum number of reviews across all segments
      const minReviews = Math.min(...reviewCountsPerSegment);

      // Check if all segments have been reviewed at least 'minReviews' times
      const allSegmentsReviewed = reviewCountsPerSegment.every(
        (count) => count >= minReviews
      );

      return allSegmentsReviewed ? minReviews : minReviews - 1;
    }
  };

  const formatLastReviewDate = (date: string | null): string => {
    if (!date) return "Belum ada review";
    return new Date(date).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleReview = (isSmooth: boolean) => {
    if (selectedSegment) {
      const newReview = {
        date: new Date().toISOString(),
        isSmooth,
        notes: reviewNote,
      };
      addReviewSegment(
        selectedSegment.surahId,
        selectedSegment.segmentIndex,
        newReview
      );
      setShowReviewDialog(false);
      setReviewNote([]);
      setSelectedSegment(null);
    }
  };

  const getTimeSinceReview = (
    lastReviewDate: string | null
  ): { value: number; unit: string } => {
    if (!lastReviewDate) return { value: 0, unit: "hari" };
    const now = new Date();
    const lastReview = new Date(lastReviewDate);
    const diffHours = Math.floor(
      (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 24) {
      return { value: diffHours > 0 ? diffHours : 1, unit: "jam" };
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return { value: diffDays, unit: "hari" };
    }
  };

  const handleAddSurahToReview = (surahNumber: number, startDate?: string) => {
    const surahDetail = memorizedSummary.surahDetails.find(
      (s) => s.surahNumber === surahNumber
    );
    if (!surahDetail) {
      const segments = calculateSurahSegments(
        surahNumber,
        surahsBahasa[surahNumber - 1].totalVerses
      );
      addSurahDetail({
        surahNumber: surahNumber,
        lastReviewDate: null,
        createdAt: startDate ? new Date(startDate) : new Date(),
        id: crypto.randomUUID(),
        segments: segments,
      });
    }
  };

  const getBadgeVariant = (
    segments: Segment[]
  ): "destructive" | "warning" | "secondary" => {
    const daysSinceLastReview = getDaysSinceReview(getLastReview(segments));

    if (daysSinceLastReview > 7) {
      return "destructive";
    } else if (daysSinceLastReview > 3) {
      return "warning";
    } else {
      return "secondary";
    }
  };

  return (
    <>
      <h2 className="text-xl pt-4">Review Hafalan</h2>
      {!memorizedSummary || memorizedSummary.surahDetails.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada surat untuk di review
        </p>
      ) : (
        <>
          {memorizedSummary.surahDetails
            .sort(
              (a, b) =>
                new Date(a.lastReviewDate || a.createdAt).getTime() -
                new Date(b.lastReviewDate || b.createdAt).getTime()
            )
            .map((surah) => {
              const surahData = surahsBahasa[surah.surahNumber - 1];
              return (
                <Dialog key={surah.id}>
                  <DialogTrigger asChild>
                    <Card className="mb-4 hover:bg-slate-50 cursor-pointer">
                      <CardContent className="p-4 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">
                              {surahData.name} - {surahData.arabicName}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              {surahData.totalVerses} ayat
                            </p>

                            <div className="mt-2">
                              <Progress
                                value={calculateProgress(
                                  surah.segments,
                                  surahData.totalVerses
                                )}
                                className={cn("w-32", {
                                  "bg-red-200":
                                    calculateProgress(
                                      surah.segments,
                                      surahData.totalVerses
                                    ) === 0,
                                  "bg-yellow-200":
                                    calculateProgress(
                                      surah.segments,
                                      surahData.totalVerses
                                    ) > 0 &&
                                    calculateProgress(
                                      surah.segments,
                                      surahData.totalVerses
                                    ) < 100,
                                  "bg-green-200":
                                    calculateProgress(
                                      surah.segments,
                                      surahData.totalVerses
                                    ) === 100,
                                })}
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {Math.round(
                                  calculateProgress(
                                    surah.segments,
                                    surahData.totalVerses
                                  )
                                )}
                                % lancar
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={getBadgeVariant(surah.segments)}
                              className="flex flex-col gap-1"
                            >
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {
                                  getTimeSinceReview(
                                    getLastReview(surah.segments)
                                  ).value
                                }{" "}
                                {
                                  getTimeSinceReview(
                                    getLastReview(surah.segments)
                                  ).unit
                                }
                              </div>
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-2">
                              {formatLastReviewDate(
                                surah.lastReviewDate?.toISOString() ?? null
                              )}
                            </div>
                          </div>
                        </div>
                        {isRecentlyCreated(surah.createdAt.toISOString()) ? (
                          <div className="mt-2">
                            {getTodayReviewCount(surah.segments) >=
                            COUNT_REVIEW_REQUIRED ? (
                              <div className="flex items-center text-green-500">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <CheckCheck className="w-5 h-5 mr-1" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="bg-primary-foreground text-sm">
                                        Review hari ini sudah diselesaikan
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="outline">
                                      {getTodayReviewCount(surah.segments)} /{" "}
                                      {COUNT_REVIEW_REQUIRED} review
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="bg-primary-foreground text-sm">
                                      {COUNT_REVIEW_REQUIRED -
                                        getTodayReviewCount(
                                          surah.segments
                                        )}{" "}
                                      review lagi diperlukan
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        ) : getTodayReviewCount(surah.segments) >= 1 ? (
                          <div className="flex items-center text-green-500">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <CheckCheck className="w-5 h-5 mr-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="bg-primary-foreground text-sm">
                                    Review hari ini sudah diselesaikan
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        ) : null}
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  {/* Review detail */}
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {surahData.name} ({surahData.arabicName})
                        <Link
                          className="inline-block ml-2"
                          href={`/quran/surah/${surahData.number}_${encodeURIComponent(surahData.name)}`}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Link>
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[600px] space-y-4">
                      {isRecentlyCreated(surah.createdAt.toISOString()) && (
                        <div className="mb-4">
                          <Badge
                            variant={
                              getTodayReviewCount(surah.segments) <
                              COUNT_REVIEW_REQUIRED
                                ? "outline"
                                : "default"
                            }
                          >
                            Review hari ini :{" "}
                            {getTodayReviewCount(surah.segments)} /{" "}
                            {COUNT_REVIEW_REQUIRED}
                          </Badge>
                        </div>
                      )}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Bagian Murojaah:</p>
                        <div className="grid grid-cols-1 gap-2 pb-8">
                          {surah.segments.map((segment, index) => {
                            const status = getSegmentStatus(segment);

                            return (
                              <div key={index} className="space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full flex justify-between items-center"
                                  onClick={() => {
                                    setSelectedSegment({
                                      surahId: surah.surahNumber,
                                      segmentIndex: index,
                                    });
                                    setShowReviewDialog(true);
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <Book className="w-4 h-4" />
                                    <span>
                                      Hal {segment.startPage}-{segment.endPage}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      Ayat {segment.startVerse}-
                                      {segment.endVerse}
                                    </span>
                                    {status === "smooth" && (
                                      <ThumbsUp className="w-4 h-4 text-green-500" />
                                    )}
                                    {status === "needs-work" && (
                                      <ThumbsDown className="w-4 h-4 text-red-500" />
                                    )}
                                  </div>
                                </Button>

                                {(segment.reviews?.length ?? 0) > 0 && (
                                  <div className="text-sm space-y-1 pl-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <History className="w-4 h-4" />
                                      <span>Riwayat Review:</span>
                                    </div>
                                    {(segment.reviews ?? [])
                                      .slice()
                                      .reverse()
                                      .map((review, rIndex) => (
                                        <div
                                          key={rIndex}
                                          className="pl-6 border-l-2 border-gray-200 pb-2"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span>
                                              {new Date(
                                                review.date
                                              ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                minute: "2-digit",
                                                hour: "2-digit",
                                              })}
                                            </span>
                                            {review.isSmooth ? (
                                              <ThumbsUp className="w-4 h-4 text-green-500" />
                                            ) : (
                                              <ThumbsDown className="w-4 h-4 text-red-500" />
                                            )}
                                          </div>
                                          {review.notes &&
                                            review.notes.length > 0 && (
                                              <div className="mt-1">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                  Catatan:
                                                </p>
                                                <ul className="list-disc pl-4">
                                                  {review.notes.map(
                                                    (note, noteIndex) => (
                                                      <li
                                                        key={noteIndex}
                                                        className="text-xs"
                                                      >
                                                        <span className="font-semibold">
                                                          Ayat {note.ayah}:
                                                        </span>{" "}
                                                        {note.note}
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            )}
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              );
            })}
        </>
      )}

      <AddSurahReviewForm onAdd={handleAddSurahToReview} />

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Hafalan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tambahkan Catatan
              </label>
              <div className="mt-1 space-y-2">
                {reviewNote.map((note, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={note.ayah}
                      onChange={(e) => {
                        const newNotes = [...reviewNote];
                        newNotes[index].ayah = parseInt(e.target.value);
                        setReviewNote(newNotes);
                      }}
                      max={286}
                      min={1}
                      className="w-20 px-2 py-1 border rounded text-sm"
                      placeholder="Ayat"
                      onFocus={(e) => e.target.select()}
                    />
                    <input
                      type="text"
                      value={note.note}
                      onChange={(e) => {
                        const newNotes = [...reviewNote];
                        newNotes[index].note = e.target.value;
                        setReviewNote(newNotes);
                      }}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      placeholder="Catatan"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        const newNotes = reviewNote.filter(
                          (_, i) => i !== index
                        );
                        setReviewNote(newNotes);
                      }}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setReviewNote([...reviewNote, { ayah: 0, note: "" }]);
                  }}
                >
                  Tambah Catatan
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleReview(false)}>
              Perlu Perbaikan
            </Button>
            <Button onClick={() => handleReview(true)}>Lancar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HafalanQuranReviews;
