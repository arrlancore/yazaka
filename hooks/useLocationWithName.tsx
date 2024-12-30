import { useEffect } from "react";
import { usePrayerTimesStore } from "@/hooks/usePrayerTimes";
import useFetchLocationName from "@/hooks/useFetchLocationName";
import { defaultLocation, requestLocation } from "@/lib/prayer-times-utils";
import { Location } from "@/types/prayerTypes";

export const useLocationWithName = () => {
  const {
    location,
    setLocationName,
    setLocation,
    isLocationRequested,
    setIsLocationRequested,
  } = usePrayerTimesStore();
  const { data: fetchedLocationName } = useFetchLocationName(
    location ?? defaultLocation
  );

  const onRequestLocation = (loc: Location) => {
    setIsLocationRequested(true);
    setLocation(loc);
  };

  useEffect(() => {
    requestLocation(onRequestLocation);
  }, [setLocation]);

  useEffect(() => {
    if (fetchedLocationName) {
      setLocationName(fetchedLocationName);
    }
  }, [fetchedLocationName, setLocationName]);

  return { location, locationName: fetchedLocationName, isLocationRequested };
};
