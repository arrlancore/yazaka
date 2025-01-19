"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHafalanStore } from "@/lib/stores/hafalan-store";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  ListMusic,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Badge } from "./ui/badge";
import { memorizationStatusLabels } from "@/types/hafalan";
import { getSurahName } from "@/lib/quran-utils";
import AppHeader from "./AppHeader";

export default function HafalanQuranTargets() {
  const { targets, activeTargetId } = useHafalanStore();

  return (
    <Card className="border-none sm:border overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <AppHeader title="Daftar Target Hafalan" backHref="/hafalan-quran" />
      <CardContent className="p-4">
        {targets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Belum ada target hafalan
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {targets
              .sort((a, b) => {
                return b.createdAt.getTime() - a.createdAt.getTime();
              })
              .map((target) => {
                const targetSurah =
                  target.ayahRange.startSurah === target.ayahRange.endSurah
                    ? `${getSurahName(target.ayahRange.startSurah)} : ${target.ayahRange.startAyah} - ${target.ayahRange.endAyah}`
                    : `${getSurahName(target.ayahRange.startSurah)} : ${target.ayahRange.startAyah} ~ ${getSurahName(
                        target.ayahRange.endSurah
                      )} : ${target.ayahRange.endAyah}`;
                return (
                  <Card
                    key={target.id}
                    className={cn(
                      "flex flex-col p-4 rounded-2xl",
                      "bg-gradient-to-br from-card to-card/80",
                      "hover:from-primary/10 hover:to-primary/5",
                      "transition-all duration-300 ease-in-out",
                      "shadow-sm hover:shadow-md",
                      "transform hover:-translate-y-1"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <BookOpen size={20} className="text-primary mr-2" />
                        <h3 className="text-lg font-semibold">{targetSurah}</h3>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/hafalan-quran/target/${target.id}`}>
                          <ChevronRight size={20} />
                        </Link>
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <ProgressItem
                        icon={<ListMusic className="h-4 w-4 text-primary" />}
                        label="Mendengarkan"
                        progress={target.preparation.listeningCount ?? 0}
                        total={10}
                        unit="kali"
                      />
                      <ProgressItem
                        icon={<BookOpen className="h-4 w-4 text-primary" />}
                        label="Membaca"
                        progress={target.preparation.readingMinutes ?? 0}
                        total={40}
                        unit="menit"
                      />
                      <ProgressItem
                        icon={<Brain className="h-4 w-4 text-primary" />}
                        label="Menghafal"
                        progress={target.preparation.memorizationMinutes ?? 0}
                        total={20}
                        unit="menit"
                      />
                    </div>

                    {/* add label active target base on activeTargetId === target.id */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-primary">
                        {target.status === "IN_PROGRESS" ? (
                          <Badge>
                            {memorizationStatusLabels[target.status]}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {memorizationStatusLabels[target.status]}
                          </Badge>
                        )}
                      </div>

                      <span className="text-xs text-secondary-foreground">
                        Dibuat Pada:{" "}
                        {new Date(target.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ProgressItemProps {
  icon: React.ReactNode;
  label: string;
  progress: number;
  total: number;
  unit: string;
}

const ProgressItem: React.FC<ProgressItemProps> = ({
  icon,
  label,
  progress,
  total,
  unit,
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm items-center">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span>
          {progress} / {total} {unit}
        </span>
      </div>
    </div>
    <Progress value={(progress / total) * 100} className="bg-primary/20" />
  </div>
);
