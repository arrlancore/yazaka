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
import { useLocationWithName } from "./useLocationWithName";

interface PrayerTimesState {
  location?: Location;
  nextPrayer: Prayer | null;
  currentTime: Date;
  hijriDate: string;
  prayerTimesData: any; // Replace 'any' with the actual type from useFetchPrayerTime
  locationName: string;
  setLocation: (location: Location) => void;
  setNextPrayer: (prayer: Prayer | null) => void;
  setCurrentTime: (time: Date) => void;
  setHijriDate: (date: string) => void;
  setPrayerTimesData: (data: any) => void; // Replace 'any' with the actual type
  setLocationName: (name: string) => void;
}

export const usePrayerTimesStore = create<PrayerTimesState>((set) => ({
  location: defaultLocation,
  nextPrayer: null,
  currentTime: new Date(),
  hijriDate: "",
  prayerTimesData: null,
  locationName: "",
  setLocation: (location) => set({ location }),
  setNextPrayer: (prayer) => set({ nextPrayer: prayer }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setHijriDate: (date) => set({ hijriDate: date }),
  setPrayerTimesData: (data) => set({ prayerTimesData: data }),
  setLocationName: (name) => set({ locationName: name }),
}));

const prayerNames: { [key: string]: string } = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export const usePrayerTimesGlobal = () => {
  const {
    nextPrayer,
    currentTime,
    hijriDate,
    prayerTimesData,
    setLocation,
    setNextPrayer,
    setCurrentTime,
    setHijriDate,
    setPrayerTimesData,
  } = usePrayerTimesStore();

  const { location, locationName } = useLocationWithName();
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
    locationName,
    setLocation,
    requestLocation,
    prayerNames,
  };
};
