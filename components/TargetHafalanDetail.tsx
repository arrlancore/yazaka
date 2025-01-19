"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  BookOpen,
  ListMusic,
  Brain,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getSurahName } from "@/lib/quran-utils";
import { useHafalanStore } from "@/lib/stores/hafalan-store";
import {
  MemorizationProgressLog,
  memorizationStatusLabels,
} from "@/types/hafalan";
import ReviewScheduleSection from "./ReviewScheduleSection";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { AddLogForm, LogList } from "./MemorizationLogs";
import {
  MINIMUM_LISTENING_COUNT,
  MINIMUM_MEMOIZATION_MINUTES,
  MINIMUM_READING_MINUTES,
} from "@/lib/utils/hafalan";
import AppHeader from "./AppHeader";
import { Alert } from "./ui/alert";
import { useRouter } from "next/navigation";

interface TargetHafalanDetailProps {
  targetId: string;
}

const TargetHafalanDetail: React.FC<TargetHafalanDetailProps> = ({
  targetId,
}) => {
  const {
    targets,
    activeTargetId,
    setActiveTarget,
    updatePreparation,
    updateStatus,
    removeTarget,
  } = useHafalanStore();
  const target = targets.find((t) => t.id === targetId);
  const [showAddLogForm, setShowAddLogForm] = useState(false);
  const router = useRouter();

  const handleDeleteTarget = () => {
    if (targetId) {
      removeTarget(targetId);
      // After successful deletion, navigate to the targets page
      router.push("/hafalan-quran/targets");
    }
  };

  const handleActivityUpdate = (
    type: "listening" | "reading" | "memorizing",
    newValue: number
  ) => {
    if (!target) return;

    updatePreparation(targetId, type, newValue);
  };

  if (!targetId || !target) {
    return (
      <div className="flex items-center justify-center h-full text-center text-primary-foreground">
        <div className="w-[200px] h-[200px] rounded-full bg-primary-light/50 transition-all duration-300 transform hover:scale-110">
          <BookOpen size={200} />
        </div>
        <p className="mt-4 text-lg font-semibold">Target not found</p>
      </div>
    );
  }

  const disableUpdateStatusToMemorized =
    target.preparation.readingMinutes < MINIMUM_READING_MINUTES ||
    target.preparation.memorizationMinutes < MINIMUM_MEMOIZATION_MINUTES ||
    target.preparation.listeningCount < MINIMUM_LISTENING_COUNT;

  const targetSurah =
    target.ayahRange.startSurah === target.ayahRange.endSurah
      ? `${getSurahName(target.ayahRange.startSurah)} : ${target.ayahRange.startAyah} - ${target.ayahRange.endAyah}`
      : `${getSurahName(target.ayahRange.startSurah)} : ${target.ayahRange.startAyah} ~ ${getSurahName(
          target.ayahRange.endSurah
        )} : ${target.ayahRange.endAyah}`;

  return (
    <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <AppHeader
        title="Detail Target Hafalan"
        backHref="/hafalan-quran/targets"
      />
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Target Hafalan</h3>
            <p className="text-muted-foreground">{targetSurah}</p>
          </div>

          <div className="flex justify-start">
            <Link
              href={`/quran/surah/${target.ayahRange.startSurah}_${encodeURIComponent(getSurahName(target.ayahRange.startSurah))}#${target.ayahRange.startAyah}`}
              passHref
            >
              <Button variant="outline" size="sm" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Buka Qur'an
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Aktivitas Persiapan</h3>
          <ActivityItem
            icon={<ListMusic className="h-5 w-5 text-primary" />}
            label="Mendengarkan"
            value={target.preparation.listeningCount}
            unit="kali"
            editable={target.status === "IN_PROGRESS"}
            onUpdate={(newValue) => handleActivityUpdate("listening", newValue)}
          />
          <ActivityItem
            icon={<BookOpen className="h-5 w-5 text-primary" />}
            label="Membaca"
            value={target.preparation.readingMinutes}
            unit="menit"
            editable={target.status === "IN_PROGRESS"}
            onUpdate={(newValue) => handleActivityUpdate("reading", newValue)}
          />
          <ActivityItem
            icon={<Brain className="h-5 w-5 text-primary" />}
            label="Menghafal"
            value={target.preparation.memorizationMinutes}
            unit="menit"
            editable={target.status === "IN_PROGRESS"}
            onUpdate={(newValue) =>
              handleActivityUpdate("memorizing", newValue)
            }
          />

          {target.status === "PLANNED" ? (
            <Alert className="text-muted-foreground text-sm">
              Silahkan klik tombol "Aktifkan Target" untuk memulai hafalan ini.
            </Alert>
          ) : null}

          {disableUpdateStatusToMemorized && target.status === "IN_PROGRESS" ? (
            <Alert className="text-muted-foreground text-sm">
              Untuk menghafal disarankan setidaknya sudah mendengarkan bacaan
              dari qori yang baik {MINIMUM_LISTENING_COUNT} kali, sudah membaca
              berulang kali selama {MINIMUM_READING_MINUTES} menit, dan
              menghafalkan nya selama {MINIMUM_MEMOIZATION_MINUTES} menit.
              Setelah itu tombol "Selesai Menghafal" akan diaktifkan.
            </Alert>
          ) : null}

          {target.status === "MEMORIZED_SELF_REVIEW" ? (
            <Alert className="text-muted-foreground text-sm">
              Selanjutnya disarankan anda melakukan setoran hafalan kepada
              seorang guru atau orang lain yang bisa membetulkan bacaan anda.
              Jika sudah selesai tambahkan review dan klik tombol "Selesai
              Setoran"
            </Alert>
          ) : null}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Status</h3>
          <Badge variant="secondary" className="text-sm">
            {memorizationStatusLabels[target.status]}
          </Badge>

          {!activeTargetId && target.status === "PLANNED" ? (
            <Button
              className="ml-4"
              onClick={() => setActiveTarget(target.id)}
              size="sm"
            >
              Aktifkan Target
            </Button>
          ) : null}

          {activeTargetId && target.status === "IN_PROGRESS" && (
            <Button
              className="ml-4"
              disabled={disableUpdateStatusToMemorized}
              onClick={() => {
                setActiveTarget(null);
                updateStatus(targetId, "MEMORIZED_SELF_REVIEW");
              }}
              size="sm"
            >
              Selesai Menghafal
            </Button>
          )}
          {target.status === "MEMORIZED_SELF_REVIEW" && (
            <Button
              className="ml-4"
              onClick={() => {
                setActiveTarget(null);
                updateStatus(targetId, "MEMORIZED_TEACHER_REVIEW");
              }}
              size="sm"
            >
              Selesai Setoran
            </Button>
          )}
        </div>
        {/* logs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Catatan Progress</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddLogForm(!showAddLogForm)}
            >
              {showAddLogForm ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah
                </>
              )}
            </Button>
          </div>
          {showAddLogForm && (
            <AddLogForm
              targetId={targetId}
              onAddLog={(log) => {
                setShowAddLogForm(false);
                updatePreparation(
                  targetId,
                  "memorizing",
                  target.preparation.memorizationMinutes + (log.duration ?? 0)
                );
              }}
              rangesSurah={[
                target.ayahRange.startSurah,
                target.ayahRange.endSurah,
              ]}
            />
          )}
          <LogList logs={target.logs} />
        </div>
        {/* review */}
        {target.reviews.length ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Jadwal Murajaah</h3>
            <ReviewScheduleSection
              targetId={targetId}
              reviews={target.reviews}
            />
          </div>
        ) : null}

        {/* add button to delete the target with confirmation dialog */}
        <div className="flex justify-end mt-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Target
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus target
                  hafalan Anda secara permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTarget}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  editable: boolean;
  onUpdate: (newValue: number) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  label,
  value,
  unit,
  editable,
  onUpdate,
}) => (
  <div
    className={cn(
      "flex items-center justify-between p-4 rounded-lg",
      "bg-gradient-to-br from-card to-card/80",
      "hover:from-primary/10 hover:to-primary/5",
      "transition-all duration-300 ease-in-out",
      "shadow-sm hover:shadow-md"
    )}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onUpdate(Math.max(0, value - 5))}
        disabled={!editable}
      >
        -
      </Button>
      <span>
        {value} {unit}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onUpdate(value + 5)}
        disabled={!editable}
      >
        +
      </Button>
    </div>
  </div>
);

export default TargetHafalanDetail;
