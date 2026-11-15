import { fetchPrayerTimes } from "@/services/prayerTimesServices";
import { Location } from "@/types/prayerTypes";
import { useQuery } from "@tanstack/react-query";

const useFetchPrayerTime = (location: Location) =>
  useQuery({
    queryKey: ["prayerTimes", location],
    queryFn: () => fetchPrayerTimes(location.latitude, location.longitude),
    enabled: !!location.latitude && !!location.longitude,
  });

export default useFetchPrayerTime;
