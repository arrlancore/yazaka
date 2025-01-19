"use client";

import { useState } from "react";
import {
  useHafalanStore,
  useActiveTarget,
  useTargetStatistics,
} from "@/lib/stores/hafalan-store";
import {
  LayoutGrid,
  ListMusic,
  BookOpen,
  Brain,
  Plus,
  Check,
  Timer,
  MapPin,
  OptionIcon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PeerReview } from "@/types/hafalan";
import TodayTargetCard from "./TodayTargetCard";
import AppHeader from "./AppHeader";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { surahsBahasa } from "@/content/quran/metadata";
import { useRouter } from "next/navigation";

export default function HafalanPage() {
  const router = useRouter();
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({
    startSurah: "",
    startAyah: "",
    endSurah: "",
    endAyah: "",
  });

  const activeTarget = useActiveTarget();
  const targetStatistics = useTargetStatistics(activeTarget?.id || "");
  const { targets, addTarget, updatePreparation, completeReview } =
    useHafalanStore();

  // Calculate today's target
  const todayTarget = activeTarget
    ? {
        id: activeTarget.id,
        ayahRange: activeTarget.ayahRange,
        progress: {
          listening: activeTarget.preparation.listeningCount,
          reading: activeTarget.preparation.readingMinutes,
          memorizing: activeTarget.preparation.memorizationMinutes,
        },
      }
    : null;

  // Get today's reviews
  const today = new Date();
  const todayReviews = activeTarget
    ? activeTarget.reviews
        .filter((review) => review.date.toDateString() === today.toDateString())
        .map((review) => {
          const latestPeerReview =
            review.peerReviews[review.peerReviews.length - 1];
          return {
            date: review.date,
            completed: review.completed,
            peerReview: latestPeerReview
              ? {
                  date: latestPeerReview.date,
                  peerId: latestPeerReview.peerId,
                  mistakes: latestPeerReview.mistakes,
                  feedback: latestPeerReview.feedback,
                  mushafahah: latestPeerReview.mushafahah,
                }
              : null,
            time: review.date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
        })
    : [];

  // Get recent achievements
  const recentAchievements = activeTarget
    ? activeTarget.achievements.slice(-3).map((achievement) => ({
        name: achievement.name,
        date: `${Math.floor((today.getTime() - achievement.unlockedAt.getTime()) / (1000 * 60 * 60 * 24))} hari yang lalu`,
      }))
    : [];

  // Function to handle adding a new target
  const handleAddTarget = () => {
    if (
      newTarget.startSurah &&
      newTarget.startAyah &&
      newTarget.endSurah &&
      newTarget.endAyah
    ) {
      addTarget({
        startSurah: parseInt(newTarget.startSurah),
        startAyah: parseInt(newTarget.startAyah),
        endSurah: parseInt(newTarget.endSurah),
        endAyah: parseInt(newTarget.endAyah),
      });
      setIsAddingTarget(false);
      setNewTarget({
        startSurah: "",
        startAyah: "",
        endSurah: "",
        endAyah: "",
      });
      router.push(`/hafalan-quran/targets`);
    } else {
      // You might want to show an error message here
      console.error("Please fill all fields");
    }
  };

  // Function to handle updating preparation progress
  const handleUpdatePreparation = (
    type: "listening" | "reading" | "memorizing",
    value: number
  ) => {
    if (activeTarget) {
      updatePreparation(activeTarget.id, type, value);
    }
  };

  return (
    <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <AppHeader title="Hafalan Quran" />

      {/* Main Content */}
      <CardContent className="p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card hover:bg-primary/5 transition-colors duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <LayoutGrid className="h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">Total Hafalan</p>
                <p className="text-2xl font-bold">
                  {activeTarget
                    ? activeTarget.statistics.totalAyahMemorized
                    : 0}
                </p>
                <p className="text-xs text-muted-foreground">Ayat</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card hover:bg-primary/5 transition-colors duration-300">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <Timer className="h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold">
                  {activeTarget ? activeTarget.statistics.currentStreak : 0}
                </p>
                <p className="text-xs text-muted-foreground">Hari</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Target */}
        <TodayTargetCard
          todayTarget={todayTarget}
          onUpdateProgress={(type, value) =>
            updatePreparation(todayTarget?.id!, type, value)
          }
        />

        {/* Add Target Button */}
        <div className="flex justify-center items-center">
          <Dialog open={isAddingTarget} onOpenChange={setIsAddingTarget}>
            <DialogTrigger aria-label="Tambahkan Target Hafalan" asChild>
              <Button
                title="Tambahkan Target Hafalan"
                onClick={() => setIsAddingTarget(true)}
                className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Target Hafalan Baru</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddTarget();
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startSurah" className="text-right">
                      Surah Awal
                    </Label>
                    <Select
                      onValueChange={(e) =>
                        setNewTarget({
                          ...newTarget,
                          startSurah: e,
                        })
                      }
                      value={newTarget.startSurah}
                    >
                      <SelectTrigger className="w-full col-span-3">
                        <SelectValue placeholder="Pilih Awal Surat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {surahsBahasa.map((surah) => (
                            <SelectItem
                              key={surah.number}
                              value={surah.number + ""}
                            >
                              {surah.name}, {surah.totalVerses} Ayat
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="startAyah" className="text-right">
                      Ayat Awal
                    </Label>
                    <Input
                      id="startAyah"
                      min={1}
                      max={286}
                      onFocus={(e) => e.target.select()}
                      type="number"
                      className="col-span-3"
                      value={newTarget.startAyah}
                      onChange={(e) =>
                        setNewTarget({
                          ...newTarget,
                          startAyah: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endSurah" className="text-right">
                      Surah Akhir
                    </Label>
                    <Select
                      onValueChange={(e) =>
                        setNewTarget({
                          ...newTarget,
                          endSurah: e,
                        })
                      }
                      value={newTarget.endSurah}
                    >
                      <SelectTrigger className="w-full col-span-3 min-w-[280px]">
                        <SelectValue placeholder="Pilih Awal Surat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {surahsBahasa.map((surah) => (
                            <SelectItem
                              key={surah.number}
                              value={surah.number + ""}
                            >
                              {surah.name}, {surah.totalVerses} Ayat
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="endAyah" className="text-right">
                      Ayat Akhir
                    </Label>
                    <Input
                      id="endAyah"
                      min={1}
                      max={286}
                      onFocus={(e) => e.target.select()}
                      type="number"
                      className="col-span-3"
                      value={newTarget.endAyah}
                      onChange={(e) =>
                        setNewTarget({
                          ...newTarget,
                          endAyah: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={
                      !newTarget.startSurah ||
                      !newTarget.startAyah ||
                      !newTarget.endSurah ||
                      !newTarget.endAyah
                    }
                    type="submit"
                  >
                    Tambah Target
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Today's Reviews */}
        {todayReviews.length ? (
          <Card className="bg-card hover:bg-primary/5 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-base">Review Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {todayReviews.map((review) => (
                  <li
                    key={review.date.getTime()}
                    className="flex justify-between items-center p-2 rounded-md bg-background"
                  >
                    <div>
                      <p className="font-medium">
                        {activeTarget?.ayahRange.startSurah}
                        Ayat {activeTarget?.ayahRange.startAyah} -
                        {activeTarget?.ayahRange.endSurah}
                        Ayat {activeTarget?.ayahRange.endAyah}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.time}
                      </p>
                    </div>
                    {review.completed ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Button size="sm" variant="outline">
                        Mulai
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {/* Recent Achievements */}
        {recentAchievements.length ? (
          <Card className="bg-card hover:bg-primary/5 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-base">Pencapaian Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recentAchievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 rounded-md bg-background"
                  >
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {achievement.date}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}
      </CardContent>
    </Card>
  );
}
