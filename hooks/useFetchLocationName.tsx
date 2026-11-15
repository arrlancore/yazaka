import { fetchLocationName } from "@/services/prayerTimesServices";
import { Location } from "@/types/prayerTypes";
import { useQuery } from "@tanstack/react-query";

const useFetchLocationName = (location: Location) =>
  useQuery({
    queryKey: ["locationName", location],
    queryFn: () => fetchLocationName(location.latitude, location.longitude),
    enabled: !!location.latitude && !!location.longitude,
  });

export default useFetchLocationName;
