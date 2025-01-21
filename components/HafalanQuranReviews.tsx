import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Flame,
  Book,
  ThumbsUp,
  ThumbsDown,
  History,
  Trash,
} from "lucide-react";
import {
  Segment,
  Review,
  SurahDetail,
  useHafalanStore,
} from "@/lib/stores/hafalan-store";
import { getSurahName } from "@/lib/quran-utils";
import { calculateSurahSegments, surahsBahasa } from "@/content/quran/metadata";
import { memorizationStatusLabels } from "@/types/hafalan";
import AddSurahReviewForm from "./AddSurahReview";

const HafalanQuranReviews = () => {
  const {
    targets,
    memorizedSummary,
    updateMeta,
    addSurahDetail,
    updateSurahDetail,
    addReviewSegment,
  } = useHafalanStore();

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
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    segments.forEach((segment) => {
      segment.reviews?.forEach((review) => {
        // Check if the review is from today
        if (review.date.startsWith(today)) {
          if (!review.isSmooth) {
            review.notes.forEach((note) => {
              uniqueAyahsWithNotes.add(note.ayah);
            });
          }
        }
      });
    });

    const smoothAyahs = totalAyahs - uniqueAyahsWithNotes.size;
    const res = (smoothAyahs / totalAyahs) * 100;
    return res;
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

  const getListSurahsFromRange = (startSurah: number, endSurah: number) => {
    const list: number[] = [];

    for (let i = startSurah; i <= endSurah; i++) {
      list.push(i);
    }

    return list;
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

  return (
    <>
      <h2 className="text-xl pt-4">Review Hafalan</h2>
      {!memorizedSummary || memorizedSummary.surahDetails.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada surat untuk di review
        </p>
      ) : (
        <ScrollArea className="min-h-[200px] max-h-[600px] pr-4">
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
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold">
                              {surahData.name} - {surahData.arabicName}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              {surahData.totalVerses} ayat
                            </p>
                            {surah.lastReviewDate
                              ?.toISOString()
                              ?.startsWith(
                                new Date().toISOString().split("T")[0]
                              ) ? (
                              <div className="mt-2">
                                <Progress
                                  value={calculateProgress(
                                    surah.segments,
                                    surahData.totalVerses
                                  )}
                                  className="w-32"
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
                            ) : null}
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                getDaysSinceReview(
                                  getLastReview(surah.segments)
                                ) > 14
                                  ? "destructive"
                                  : getDaysSinceReview(
                                        getLastReview(surah.segments)
                                      ) > 7
                                    ? "outline"
                                    : "secondary"
                              }
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
                        {isRecentlyCreated(surah.createdAt.toISOString()) && (
                          <div className="mt-2">
                            <Badge
                              variant={
                                getTodayReviewCount(surah.segments) < 2
                                  ? "outline"
                                  : "default"
                              }
                            >
                              {getTodayReviewCount(surah.segments)} / 2 review
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {surahData.name} ({surahData.arabicName})
                      </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[600px] space-y-4">
                      {isRecentlyCreated(surah.createdAt.toISOString()) && (
                        <div className="mb-4">
                          <Badge
                            variant={
                              getTodayReviewCount(surah.segments) < 2
                                ? "outline"
                                : "default"
                            }
                          >
                            Review hari ini :{" "}
                            {getTodayReviewCount(surah.segments)} / 2
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
        </ScrollArea>
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
