import { useState, useEffect } from "react";
import axios from "axios";

interface PrayerTime {
  [key: string]: string;
}

interface Prayer {
  name: string;
  time: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

export const usePrayerTimes = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (location.latitude === 0 || location.longitude === 0) return;

      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/calendar?latitude=${location.latitude}&longitude=${location.longitude}&method=20`
        );

        const today = response.data.data[currentTime.getDate() - 1];
        setPrayerTimes(today.timings);
      } catch (error) {
        console.error("Failed to fetch prayer times", error);
      }
    };

    if (location.latitude && location.longitude) {
      fetchPrayerTimes();
    }
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      findNextPrayer(now);
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes]);

  const findNextPrayer = (now: Date) => {
    const times = prayerTimes;
    if (!times || Object.keys(times).length === 0) return;

    const prayers: Prayer[] = [
      { name: "Subuh", time: times.Fajr || "" },
      { name: "Terbit", time: times.Sunrise || "" },
      { name: "Dzuhur", time: times.Dhuhr || "" },
      { name: "Ashar", time: times.Asr || "" },
      { name: "Maghrib", time: times.Maghrib || "" },
      { name: "Isya", time: times.Isha || "" },
    ];

    const currentHourMinute = now.getHours() * 60 + now.getMinutes();

    const nextPrayerObj =
      prayers.find((prayer) => {
        if (!prayer.time) return false;
        const cleanTime = prayer.time.replace(/\s*\(WIB\)\s*/, "").trim();
        const [hours, minutes] = cleanTime.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) return false;
        const prayerMinutes = hours * 60 + minutes;
        return prayerMinutes > currentHourMinute;
      }) || prayers[0];

    setNextPrayer(nextPrayerObj);
  };

  useEffect(() => {
    const defaultLocation: Location = {
      latitude: -6.2146,
      longitude: 106.8451,
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setLocation(defaultLocation);
        }
      );
    } else {
      setLocation(defaultLocation);
    }
  }, []);

  return { nextPrayer, currentTime };
};
