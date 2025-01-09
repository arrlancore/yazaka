import { useHafalanStore } from "@/lib/stores/hafalan-store";
import { MemorizationProgressLog } from "@/types/hafalan";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { surahsBahasa } from "@/content/quran/metadata";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "./ui/select";
import { Input } from "./ui/input";
import { getSurahName } from "@/lib/quran-utils";

export const AddLogForm: React.FC<{
  targetId: string;
  rangesSurah: [number, number];
  onAddLog?: (log: MemorizationProgressLog) => void;
}> = ({ targetId, rangesSurah, onAddLog }) => {
  const [startAyah, setStartAyah] = useState(0);
  const [endAyah, setEndAyah] = useState(0);
  const [startSurah, setStartSurah] = useState(0);
  const [endSurah, setEndSurah] = useState(0);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const { addLog } = useHafalanStore();

  const surahList = surahsBahasa.filter(
    (surah) => surah.number >= rangesSurah[0] && surah.number <= rangesSurah[1]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MemorizationProgressLog = {
      id: Date.now().toString(),
      date: new Date(),
      ayahRange: {
        startAyah,
        endAyah,
        startSurah,
        endSurah,
      },
      duration: parseInt(duration),
      notes,
    };
    addLog(targetId, newLog);
    // Reset form
    setStartAyah(0);
    setEndAyah(0);
    setDuration("");
    setNotes("");
    setStartSurah(0);
    setEndSurah(0);

    // callback
    onAddLog && onAddLog(newLog);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* Select Start Surah */}
        <div className="flex items-center gap-1">
          <Select
            onValueChange={(value) => {
              setStartSurah(parseInt(value));
              if (rangesSurah[0] === rangesSurah[1]) {
                setEndSurah(parseInt(value));
              }
            }}
            value={startSurah ? startSurah + "" : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Awal Surat" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {surahList.map((surah) => (
                  <SelectItem key={surah.number} value={surah.number + ""}>
                    {surah.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Ayat Awal"
            value={startAyah}
            onChange={(e) => setStartAyah(parseInt(e.target.value))}
            required
            min={1}
            max={286}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Select End Surah */}
        <div className="flex items-center gap-1">
          <Select
            onValueChange={(value) => {
              setEndSurah(parseInt(value));
            }}
            value={endSurah ? endSurah + "" : undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Akhir Surat" />
            </SelectTrigger>
            <SelectContent>
              {surahList.map((surah) => (
                <SelectItem key={surah.number} value={surah.number + ""}>
                  {surah.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Ayat Akhir"
            value={endAyah}
            onChange={(e) => setEndAyah(parseInt(e.target.value))}
            required
            min={1}
            max={286}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <Input
          type="number"
          placeholder="Durasi (menit)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <textarea
          placeholder="Catatan..."
          className="p-2 text-sm"
          value={notes}
          rows={3}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button
          disabled={!startSurah || !startAyah || !endSurah || !endAyah}
          type="submit"
        >
          Simpan
        </Button>
      </div>
    </form>
  );
};

export const LogList: React.FC<{ logs: MemorizationProgressLog[] }> = ({
  logs,
}) => {
  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <Card key={log.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">
                Surat {getSurahName(log.ayahRange.startSurah)} Ayat{" "}
                {log.ayahRange.startAyah} - Surat{" "}
                {getSurahName(log.ayahRange.endSurah)} Ayat{" "}
                {log.ayahRange.endAyah}
              </p>
              <p className="text-sm text-muted-foreground">
                {log.duration} menit
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(log.date).toLocaleDateString("id-ID")}
            </p>
          </div>
          {log.notes && <p className="mt-2 text-sm">{log.notes}</p>}
        </Card>
      ))}

      {logs.length === 0 ? (
        <p className="text-sm text-center text-muted-foreground">
          Belum ada catatan hafalan
        </p>
      ) : null}
    </div>
  );
};
