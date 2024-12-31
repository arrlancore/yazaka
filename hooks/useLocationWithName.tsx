import { useEffect, useState } from "react";
import useFetchLocationName from "@/hooks/useFetchLocationName";
import { defaultLocation, requestLocation } from "@/lib/prayer-times-utils";
import { Location } from "@/types/prayerTypes";

export const useLocationWithName = (props: {
  onRequestGranted?: () => void;
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const { data: fetchedLocationName } = useFetchLocationName(
    location ?? defaultLocation
  );

  const request = () =>
    requestLocation((loc) => {
      setLocation(loc);
      if (props.onRequestGranted) {
        props.onRequestGranted();
      }
    });

  useEffect(() => {
    request();
  }, []);

  return { location, locationName: fetchedLocationName, request };
};
