import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ListMusic,
  BookOpen,
  Brain,
  Minus,
  Plus,
  ChevronRight,
  List,
} from "lucide-react";
import {
  AyahRange,
  MemorizationStatus,
  memorizationStatusLabels,
} from "@/types/hafalan";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getSurahName } from "@/lib/quran-utils";

interface TodayTargetProps {
  todayTarget: {
    id: string; // Add this line
    ayahRange: AyahRange;
    progress: {
      listening: number;
      reading: number;
      memorizing: number;
    };
  } | null;
  onUpdateProgress: (
    type: "listening" | "reading" | "memorizing",
    value: number
  ) => void;
}

export const TodayTargetCard: React.FC<TodayTargetProps> = ({
  todayTarget,
  onUpdateProgress,
}) => {
  const router = useRouter();

  const handleNavigateToDetail = () => {
    if (todayTarget) {
      router.push(`/hafalan-quran/target/${todayTarget.id}`);
    }
  };
  const targetSurah =
    todayTarget?.ayahRange.startSurah === todayTarget?.ayahRange.endSurah
      ? `${getSurahName(todayTarget?.ayahRange.startSurah ?? 0)} : ${todayTarget?.ayahRange.startAyah} - ${todayTarget?.ayahRange.endAyah}`
      : `${getSurahName(todayTarget?.ayahRange.startSurah ?? 0)} : ${todayTarget?.ayahRange.startAyah} ~ ${getSurahName(
          todayTarget?.ayahRange.endSurah ?? 0
        )} : ${todayTarget?.ayahRange.endAyah}`;
  return (
    <Card className="bg-card hover:bg-primary/5 transition-colors duration-300">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base">Target Hari Ini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4 sm:gap-2">
          {todayTarget ? (
            <h3 className="font-medium">{targetSurah}</h3>
          ) : (
            <div className="w-full">
              <p className="text-muted-foreground">
                Belum ada target hari ini!
              </p>
              <p className="text-xs text-muted-foreground">
                Silahkan tambahkan target atau aktifkan target yang sudah ada.
              </p>
            </div>
          )}
          {todayTarget ? (
            <Badge variant="secondary" className="min-w-28">
              {memorizationStatusLabels["IN_PROGRESS"]}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-3">
          <ProgressItem
            icon={<ListMusic className="h-4 w-4 text-primary" />}
            label="Mendengarkan"
            progress={todayTarget?.progress.listening ?? 0}
            total={10}
            unit="kali"
            onUpdate={(value) => onUpdateProgress("listening", value)}
            hasTarget={!!todayTarget}
          />
          <ProgressItem
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            label="Membaca"
            progress={todayTarget?.progress.reading ?? 0}
            total={40}
            unit="menit"
            onUpdate={(value) => onUpdateProgress("reading", value)}
            hasTarget={!!todayTarget}
          />
          <ProgressItem
            icon={<Brain className="h-4 w-4 text-primary" />}
            label="Menghafal"
            progress={todayTarget?.progress.memorizing ?? 0}
            total={20}
            unit="menit"
            onUpdate={(value) => onUpdateProgress("memorizing", value)}
            hasTarget={!!todayTarget}
          />
        </div>

        {/* Add the navigation button */}
        {todayTarget ? (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleNavigateToDetail}
            disabled={!todayTarget}
          >
            Lihat Detail Target
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => router.push(`/hafalan-quran/targets`)}
          >
            <List className="mr-2 h-4 w-4" />
            Lihat Daftar Target
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

interface ProgressItemProps {
  icon: React.ReactNode;
  label: string;
  progress: number;
  total: number;
  unit: string;
  onUpdate: (value: number) => void;
  hasTarget: boolean;
}

const ProgressItem: React.FC<ProgressItemProps> = ({
  icon,
  label,
  progress,
  total,
  unit,
  onUpdate,
  hasTarget,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm items-center">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdate(Math.max(0, progress - 5))}
          disabled={progress <= 0 || !hasTarget}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span>
          {progress} / {total} {unit}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdate(Math.min(total, progress + 5))}
          disabled={progress >= total || !hasTarget}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <Progress value={(progress / total) * 100} className="bg-primary/20" />
  </div>
);

export default TodayTargetCard;
