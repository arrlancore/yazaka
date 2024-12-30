import { useState, useEffect } from "react";

type LastRead = {
  surahNumber: number;
  ayatNumber: number;
  surahName: string;
} | null;

export const useQuranLastRead = () => {
  const [lastRead, setLastRead] = useState<LastRead>(null);

  useEffect(() => {
    // Load last read from localStorage on component mount
    const storedLastRead = localStorage.getItem("quranLastRead");
    if (storedLastRead) {
      const [surahNumber, surahName, ayatNumber] = storedLastRead.split(":");
      setLastRead({
        surahNumber: Number(surahNumber),
        surahName,
        ayatNumber: Number(ayatNumber),
      });
    }
  }, []);

  const updateLastRead = (
    surahNumber: number,
    surahName: string,
    ayatNumber: number
  ) => {
    const newLastRead = `${surahNumber}:${surahName}:${ayatNumber}`;
    localStorage.setItem("quranLastRead", newLastRead);
    setLastRead({ surahNumber, surahName, ayatNumber });
  };

  return { lastRead, updateLastRead };
};
