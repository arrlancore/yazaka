import { fetchLocationName } from "@/services/prayerTimesServices";
import { Location } from "@/types/prayerTypes";
import { useQuery } from "react-query";

const useFetchLocationName = (location: Location) =>
  useQuery(
    ["locationName", location],
    () => fetchLocationName(location.latitude, location.longitude),
    { enabled: !!location.latitude && !!location.longitude }
  );

export default useFetchLocationName;
