"use client";
import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Cloud,
  ChevronRight,
  Coffee,
} from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className="container max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[2rem] p-0">
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

const MagrbIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    style={{ background: "transparent" }} // Add this for debugging
    {...props}
  >
    <defs>
      <radialGradient id="sunset-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="coral" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#FF4500" />
      </radialGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="sun-shadow">
        <feDropShadow
          dx={0}
          dy={2}
          floodColor="rgba(0,0,0,0.3)"
          stdDeviation={2}
        />
      </filter>
    </defs>

    <circle cx={50} cy={50} r={48} fill="url(#sunset-gradient)" />

    <circle cx={50} cy={60} r={18} fill="gold" filter="url(#sun-shadow)" />

    <g clipPath="url(#circle-clip)">
      <path fill="#FF8C00" d="M0 75q25-10 50 0t50 0v25H0Z" opacity={0.8} />
      <path fill="tomato" d="M0 85q25-10 50 0t50 0v15H0Z" opacity={0.7} />
    </g>
  </svg>
);

const IsyaIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <radialGradient id="night-sky-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#1a237e" /> // Deep blue
        <stop offset="100%" stopColor="#000051" /> // Very dark blue
      </radialGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="moon-glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Night sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#night-sky-gradient)" />

    {/* Stars */}
    <g clipPath="url(#circle-clip)">
      {[...Array(20)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100}
          cy={Math.random() * 100}
          r={Math.random() * 0.8 + 0.2}
          fill="white"
          opacity={Math.random() * 0.5 + 0.5}
        />
      ))}
    </g>

    {/* Crescent moon */}
    <path
      d="M65,40 A20,20 0 1,1 65,60 A15,15 0 1,0 65,40"
      fill="#FFF9C4"
      filter="url(#moon-glow)"
    />

    {/* Horizon waves */}
    <g clipPath="url(#circle-clip)">
      <path fill="#3949ab" d="M0 80q25-5 50 0t50 0v20H0Z" opacity={0.6} /> //
      Slightly lighter blue
      <path fill="#1a237e" d="M0 85q25-5 50 0t50 0v15H0Z" opacity={0.8} /> //
      Darker blue
    </g>
  </svg>
);
const FajrDawnIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <linearGradient id="dawn-sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1a237e" /> {/* Deep blue for night sky */}
        <stop offset="40%" stopColor="#3949ab" /> {/* Lighter blue */}
        <stop offset="70%" stopColor="#9fa8da" /> {/* Light blue */}
        <stop offset="100%" stopColor="#ffcdd2" /> {/* Pinkish for dawn */}
      </linearGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="star-glow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Dawn sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#dawn-sky-gradient)" />

    <g clipPath="url(#circle-clip)">
      {/* Stars (fewer and dimmer than night) */}
      {[...Array(10)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100}
          cy={Math.random() * 40} // Only in the upper part of the sky
          r={Math.random() * 0.6 + 0.2}
          fill="white"
          opacity={Math.random() * 0.3 + 0.2} // Dimmer stars
          filter="url(#star-glow)"
        />
      ))}

      {/* Crescent moon (smaller and higher) */}
      <path
        d="M75,25 A8,8 0 1,1 75,33 A6,6 0 1,0 75,25"
        fill="#FFF9C4"
        opacity={0.7} // Slightly faded
      />

      {/* Sun peeking from the horizon */}
      <circle cx={50} cy={85} r={15} fill="#FFD54F" />

      {/* Horizon with subtle waves */}
      <path fill="#7986cb" d="M0 75q25-3 50 0t50 0v25H0Z" opacity={0.4} />
      <path fill="#5c6bc0" d="M0 80q25-3 50 0t50 0v20H0Z" opacity={0.5} />
    </g>
  </svg>
);
const SunriseIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <linearGradient
        id="sunrise-sky-gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#FFB74D" /> {/* Light orange */}
        <stop offset="40%" stopColor="#FFF176" /> {/* Light yellow */}
        <stop offset="100%" stopColor="#E1F5FE" /> {/* Very light blue */}
      </linearGradient>
      <clipPath id="sunrise-circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
      <filter id="sun-glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Sunrise sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#sunrise-sky-gradient)" />

    <g clipPath="url(#sunrise-circle-clip)">
      {/* Sun rising from the horizon */}
      <circle cx={50} cy={75} r={20} fill="#FFD54F" filter="url(#sun-glow)" />

      {/* Subtle sun rays */}
      {[...Array(8)].map((_, i) => (
        <line
          key={i}
          x1={50}
          y1={75}
          x2={50 + Math.cos((i * Math.PI) / 4) * 30}
          y2={75 + Math.sin((i * Math.PI) / 4) * 30}
          stroke="#FFD54F"
          strokeWidth={2}
          opacity={0.6}
        />
      ))}

      {/* Horizon with subtle waves */}
      <path fill="#FFB74D" d="M0 85q25-3 50 0t50 0v15H0Z" opacity={0.6} />
      <path fill="#FFA726" d="M0 90q25-2 50 0t50 0v10H0Z" opacity={0.7} />
    </g>
  </svg>
);
const SunIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" /> {/* Bright yellow */}
        <stop offset="100%" stopColor="#FFA500" /> {/* Orange */}
      </radialGradient>
      <linearGradient id="sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" /> {/* Sky blue */}
        <stop offset="100%" stopColor="#E0F7FA" /> {/* Light blue */}
      </linearGradient>
      <filter id="sun-glow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
    </defs>

    <g clipPath="url(#circle-clip)">
      {/* Sky background */}
      <circle cx={50} cy={50} r={48} fill="url(#sky-gradient)" />

      {/* Sun */}
      <circle
        cx={50}
        cy={50}
        r={20}
        fill="url(#sun-gradient)"
        filter="url(#sun-glow)"
      />

      {/* Improved sun rays */}
      <g opacity="0.7">
        {[...Array(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const innerRadius = 22;
          const outerRadius = 35;
          const x1 = 50 + Math.cos(angle) * innerRadius;
          const y1 = 50 + Math.sin(angle) * innerRadius;
          const x2 = 50 + Math.cos(angle) * outerRadius;
          const y2 = 50 + Math.sin(angle) * outerRadius;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#FFD54F"
              strokeWidth={i % 2 === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Wave-like clouds */}
      <path
        d="M0 75 Q25 65, 50 75 T100 75 V100 H0 Z"
        fill="#EFFFFE"
        opacity={0.6}
      />
      <path
        d="M0 80 Q25 70, 50 80 T100 80 V100 H0 Z"
        fill="#EFFFFE"
        opacity={0.8}
      />
    </g>
  </svg>
);
const AfternoonSunIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={props.size}
    height={props.size}
    {...props}
  >
    <defs>
      <linearGradient
        id="afternoon-sky-gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#FFB74D" /> {/* Light orange */}
        <stop offset="100%" stopColor="#FFECB3" /> {/* Very light orange */}
      </linearGradient>
      <radialGradient id="afternoon-sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD54F" /> {/* Bright yellow */}
        <stop offset="100%" stopColor="#FFA726" /> {/* Orange */}
      </radialGradient>
      <clipPath id="circle-clip">
        <circle cx={50} cy={50} r={48} />
      </clipPath>
    </defs>

    {/* Sky background */}
    <circle cx={50} cy={50} r={48} fill="url(#afternoon-sky-gradient)" />

    {/* Clipped content */}
    <g clipPath="url(#circle-clip)">
      {/* Simple sun */}
      <circle cx={50} cy={75} r={15} fill="url(#afternoon-sun-gradient)" />

      {/* Horizon with subtle waves */}
      <path fill="#FFB74D" d="M0 85q25-3 50 0t50 0v15H0Z" opacity={0.4} />
      <path fill="#FFA726" d="M0 90q25-2 50 0t50 0v10H0Z" opacity={0.5} />
    </g>
  </svg>
);
