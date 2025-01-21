import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

import { surahsBahasa } from "@/content/quran/metadata";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddSurahFormProps {
  onAdd: (surahId: number, startDate?: string) => void;
}
const AddSurahReviewForm: React.FC<AddSurahFormProps> = ({ onAdd }) => {
  const [selectedSurah, setSelectedSurah] = useState<number>();
  const [startDate, setStartDate] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSurah) return;

    onAdd(selectedSurah, startDate || new Date().toISOString().split("T")[0]);

    // Reset form
    setSelectedSurah(undefined);
    setStartDate("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 pt-8"
    >
      <div className="min-w-[140px] max-w-[140px]">
        <Select
          onValueChange={(e) => {
            if (parseInt(e) === selectedSurah) {
              setSelectedSurah(undefined);
              return;
            }
            setSelectedSurah(parseInt(e));
          }}
          value={selectedSurah ? selectedSurah?.toString() : undefined}
        >
          <SelectTrigger className="w-full col-span-3">
            <SelectValue placeholder="Pilih Surat.." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {surahsBahasa.map((surah) => (
                <SelectItem key={surah.number} value={surah.number + ""}>
                  {surah.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-auto"
        placeholder="Tanggal Mulai (Opsional)"
      />

      <Button type="submit" size="icon" disabled={!selectedSurah}>
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default AddSurahReviewForm;
