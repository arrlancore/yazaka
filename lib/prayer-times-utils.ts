import { Location, Prayer } from "@/types/prayerTypes";

export const defaultLocation: Location = {
  // central Jakarta
  latitude: -6.2146,
  longitude: 106.8451,
};

export const prayerNames: { [key: string]: string } = {
  fajr: "Subuh",
  sunrise: "Terbit",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
};

export const requestLocation = (setLocation: any) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // Fallback to default location
        setLocation(defaultLocation);
      }
    );
  } else {
    setLocation(defaultLocation);
  }
};

const dayMapping: { [key: string]: string } = {
  "Al Ahad": "Ahad",
  "Al Ithnayn": "Isnain",
  "Ath Thulatha": "Tsulatsa",
  "Al Arba'a": "Arbi'a",
  "Al Khamis": "Khamis",
  "Al Jumu'ah": "Jumu'ah",
  "As Sabt": "Sabt",
};

const monthsHijri: string[] = [
  "Muharram",
  "Safar",
  "Rabi'ul Awal",
  "Rabi'ul Akhir",
  "Jumadil Awal",
  "Jumadil Akhir",
  "Rajab",
  "Sya'ban",
  "Ramadhan",
  "Syawal",
  "Dzulqa'dah",
  "Dzulhijjah",
];

export const formatHijriDate = (hijriData: any): string => {
  const dayName = dayMapping[hijriData.weekday.en] || hijriData.weekday.en;
  const monthName =
    monthsHijri[parseInt(hijriData.month.number) - 1] || hijriData.month.en;

  return `${dayName}, ${hijriData.day} ${monthName} ${hijriData.year}`;
};

export const findNextPrayer = (now: Date, times: any): Prayer | null => {
  if (!times || Object.keys(times).length === 0) return null;

  const prayers: Prayer[] = [
    { name: "Subuh", time: times.Fajr || "" },
    { name: "Terbit", time: times.Sunrise || "" },
    { name: "Dzuhur", time: times.Dhuhr || "" },
    { name: "Ashar", time: times.Asr || "" },
    { name: "Maghrib", time: times.Maghrib || "" },
    { name: "Isya", time: times.Isha || "" },
  ];

  const currentHourMinute = now.getHours() * 60 + now.getMinutes();

  return (
    prayers.find((prayer) => {
      if (!prayer.time) return false;
      const cleanTime = prayer.time.replace(/\s*\(WIB\)\s*/, "").trim();
      const [hours, minutes] = cleanTime.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return false;
      const prayerMinutes = hours * 60 + minutes;
      return prayerMinutes > currentHourMinute;
    }) || prayers[0]
  );
};

export const createPrayerTimeUpdater = (
  setCurrentTime: (time: Date) => void,
  setNextPrayer: (prayer: Prayer | null) => void,
  prayerTimesData: any
) => {
  return () => {
    const now = new Date();
    setCurrentTime(now);
    const nextPrayer = findNextPrayer(now, prayerTimesData.timings);
    setNextPrayer(nextPrayer);
  };
};
