"use client";
import { useEffect } from "react";
import { create } from "zustand";
import {
  createPrayerTimeUpdater,
  defaultLocation,
  formatHijriDate,
  requestLocation,
} from "@/lib/prayer-times-utils";
import { Location, Prayer } from "@/types/prayerTypes";
import useFetchPrayerTime from "@/hooks/useFetchPrayerTime";

interface PrayerTimesState {
  nextPrayer: Prayer | null;
  currentTime: Date;
  hijriDate: string;
  prayerTimesData: any; // Replace 'any' with the actual type from useFetchPrayerTime
  locationName: string;
  isLocationRequested: boolean;
  setNextPrayer: (prayer: Prayer | null) => void;
  setCurrentTime: (time: Date) => void;
  setHijriDate: (date: string) => void;
  setPrayerTimesData: (data: any) => void; // Replace 'any' with the actual type
  setLocationName: (name: string) => void;
  setIsLocationRequested: (requested: boolean) => void;
}

export const usePrayerTimesStore = create<PrayerTimesState>((set) => ({
  location: defaultLocation,
  nextPrayer: null,
  currentTime: new Date(),
  hijriDate: "",
  prayerTimesData: null,
  locationName: "",
  isLocationRequested: false,
  setNextPrayer: (prayer) => set({ nextPrayer: prayer }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setHijriDate: (date) => set({ hijriDate: date }),
  setPrayerTimesData: (data) => set({ prayerTimesData: data }),
  setLocationName: (name) => set({ locationName: name }),
  setIsLocationRequested: (requested) =>
    set({ isLocationRequested: requested }),
}));

const prayerNames: { [key: string]: string } = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export const usePrayerTimesGlobal = (location: Location | null) => {
  const {
    nextPrayer,
    currentTime,
    hijriDate,
    prayerTimesData,
    setNextPrayer,
    setCurrentTime,
    setHijriDate,
    setPrayerTimesData,
    setIsLocationRequested,
    isLocationRequested,
  } = usePrayerTimesStore();

  const { data: fetchedPrayerTimesData } = useFetchPrayerTime(
    location ?? defaultLocation
  );

  useEffect(() => {
    if (fetchedPrayerTimesData) {
      setPrayerTimesData(fetchedPrayerTimesData);
      setHijriDate(formatHijriDate(fetchedPrayerTimesData.date.hijri));

      const updatePrayerTime = createPrayerTimeUpdater(
        setCurrentTime,
        setNextPrayer,
        fetchedPrayerTimesData
      );
      const timer = setInterval(updatePrayerTime, 1000);

      return () => clearInterval(timer);
    }
  }, [
    fetchedPrayerTimesData,
    setPrayerTimesData,
    setHijriDate,
    setCurrentTime,
    setNextPrayer,
  ]);

  return {
    prayerTimes: prayerTimesData?.timings,
    nextPrayer,
    currentTime,
    hijriDate,
    location,
    requestLocation,
    prayerNames,
    isLocationRequested,
    setIsLocationRequested,
  };
};
