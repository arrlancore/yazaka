"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Sun } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AfternoonSunIcon,
  FajrDawnIcon,
  IsyaIcon,
  MagrbIcon,
  SunIcon,
  SunriseIcon,
} from "./prayer-icons";

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

const PrayerTimes = () => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [locationName, setLocationName] = useState("Jakarta, Indonesia");
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hijriDate, setHijriDate] = useState("");
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  const dayMapping: { [key: string]: string } = {
    Sunday: "Ahad",
    Monday: "Isnain",
    Tuesday: "Tsulatsa",
    Wednesday: "Arbi'a",
    Thursday: "Khamis",
    Friday: "Jumu'ah",
    Saturday: "Sabt",
  };

  const prayerNames: { [key: string]: string } = {
    fajr: "Subuh",
    sunrise: "Terbit",
    dhuhr: "Dzuhur",
    asr: "Ashar",
    maghrib: "Maghrib",
    isha: "Isya",
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

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );

      const address = response.data.address;
      let locationText = "";

      if (address.city) {
        locationText = address.city;
      } else if (address.town) {
        locationText = address.town;
      } else if (address.municipality) {
        locationText = address.municipality;
      } else if (address.county) {
        locationText = address.county;
      } else if (address.state) {
        locationText = address.state;
      }

      if (address.state && locationText !== address.state) {
        locationText += `, ${address.state}`;
      }

      setLocationName(locationText || "Lokasi Tidak Diketahui");
    } catch (error) {
      console.error("Gagal mendapatkan nama lokasi", error);
      setLocationName("Lokasi Tidak Diketahui");
    }
  };

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/calendar?latitude=${location.latitude}&longitude=${location.longitude}&method=20`
        );

        const today = response.data.data[currentTime.getDate() - 1];
        setPrayerTimes(today.timings);

        const hijriData = today.date.hijri;
        const gregorianWeekday = today.date.gregorian.weekday.en;
        const hijriWeekday = dayMapping[gregorianWeekday] || gregorianWeekday;
        const formattedHijri = `${hijriWeekday}, ${hijriData.day} ${monthsHijri[parseInt(hijriData.month.number) - 1]} ${hijriData.year}`;
        setHijriDate(formattedHijri);
      } catch (error) {
        console.error("Gagal mengambil waktu shalat", error);
      }
    };

    if (location.latitude && location.longitude) {
      fetchPrayerTimes();
      fetchLocationName(location.latitude, location.longitude);
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

  const requestLocation = (
    onSuccess: (location: Location) => void,
    onError: () => void
  ) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          setIsLocationLoaded(true);
          onSuccess(newLocation);
        },
        (error) => {
          console.warn(`Gagal mendapatkan lokasi: ${error.message}`);
          onError();
        }
      );
    } else {
      console.warn("Geolocation tidak didukung");
      onError();
    }
  };

  useEffect(() => {
    const defaultLocation: Location = {
      latitude: -6.2146,
      longitude: 106.8451,
    };

    requestLocation(
      (location) => {
        console.log("Lokasi berhasil didapatkan:", location);
      },
      () => {
        setLocation(defaultLocation);
        setIsLocationLoaded(true);
        console.log("Menggunakan lokasi default:", defaultLocation);
      }
    );
  }, []);

  const formatTime = (timeString: string | undefined): string => {
    return timeString ? timeString : "-";
  };

  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-primary-foreground">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Jadwal Shalat</h2>
            <Button
              variant="ghost"
              onClick={() =>
                requestLocation(
                  () => {},
                  () => {}
                )
              }
              className="text-xs p-2 rounded-full hover:bg-white/20"
            >
              <MapPin size={18} />
            </Button>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-bold">
              {currentTime.toLocaleString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="text-xl opacity-80">WIB</span>
          </div>
          <div className="mt-2 text-sm opacity-80">
            {currentTime.toLocaleString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {hijriDate && <div className="text-sm opacity-70">{hijriDate} H</div>}
        </div>

        {/* Next Prayer */}
        {nextPrayer && (
          <div className="bg-card p-4 flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">
                Shalat selanjutnya
              </span>
              <h3 className="text-xl font-bold text-primary">
                {nextPrayer.name}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">{nextPrayer.time}</span>
            </div>
          </div>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-background">
          {Object.entries(prayerNames).map(([key, name]) => (
            <div
              key={key}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl",
                "bg-gradient-to-br from-card to-card/80",
                "hover:from-primary/10 hover:to-primary/5",
                "transition-all duration-300 ease-in-out",
                "shadow-sm hover:shadow-md",
                "transform hover:-translate-y-1"
              )}
            >
              <div className="mb-2 p-2 rounded-full bg-primary/10">
                {getPrayerIcon(key, {
                  size: 32,
                  className: "text-primary",
                })}
              </div>
              <span className="text-xs font-medium text-center text-muted-foreground">
                {name}
              </span>
              <span className="text-sm font-bold text-center text-primary">
                {formatTime(
                  prayerTimes?.[
                    key.charAt(0).toUpperCase() + key.slice(1)
                  ]?.substring(0, 5)
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Location */}
        <div className="p-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <MapPin size={16} className="text-primary" />
          <span>{locationName}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const getPrayerIcon = (
  prayer: string,
  props: { size?: number; className?: string } = {}
) => {
  const { size = 64, className = "" } = props;
  switch (prayer) {
    case "fajr":
      return (
        <FajrDawnIcon size={size} className={cn("text-primary", className)} />
      );
    case "sunrise":
      return (
        <SunriseIcon size={size} className={cn("text-primary", className)} />
      );
    case "dhuhr":
      return <SunIcon size={size} className={cn("text-primary", className)} />;
    case "asr":
      return (
        <AfternoonSunIcon
          size={size}
          className={cn("text-primary", className)}
        />
      );
    case "maghrib":
      return (
        <MagrbIcon size={size} className={cn("text-primary", className)} />
      );
    case "isha":
      return <IsyaIcon size={size} className={cn("text-primary", className)} />;
    default:
      return <Sun size={size} className={cn("text-primary", className)} />;
  }
};

export default PrayerTimes;
