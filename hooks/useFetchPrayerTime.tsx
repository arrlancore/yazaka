import { fetchPrayerTimes } from "@/services/prayerTimesServices";
import { Location } from "@/types/prayerTypes";
import { useQuery } from "react-query";

const useFetchPrayerTime = (location: Location) =>
  useQuery(
    ["prayerTimes", location],
    () => fetchPrayerTimes(location.latitude, location.longitude),
    { enabled: !!location.latitude && !!location.longitude }
  );

export default useFetchPrayerTime;
