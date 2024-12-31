"use client";
import React from "react";
import { MapPin, Sun } from "lucide-react";
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
import { usePrayerTimesGlobal } from "@/hooks/usePrayerTimes";
import RequestLocation from "../request-location";
import { useLocationWithName } from "@/hooks/useLocationWithName";

const PrayerTimes = () => {
  const { locationName, location, request } = useLocationWithName({
    onRequestGranted: () => setIsLocationRequested(true),
  });

  const {
    prayerTimes,
    prayerNames,
    nextPrayer,
    currentTime,
    hijriDate,
    requestLocation,
    isLocationRequested,
    setIsLocationRequested,
  } = usePrayerTimesGlobal(location);

  return (
    <Card className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      {isLocationRequested ? (
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-primary-foreground">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Jadwal Shalat</h2>
              <Button
                variant="ghost"
                onClick={() => request()}
                className="text-xs p-2 rounded-full hover:bg-white/20"
              >
                <MapPin size={18} />
              </Button>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-bold">
                {currentTime?.toLocaleString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-xl opacity-80">WIB</span>
            </div>
            <div className="mt-2 text-sm opacity-80">
              {currentTime?.toLocaleString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {hijriDate && (
              <div className="text-sm opacity-70">{hijriDate} H</div>
            )}
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
            {prayerNames &&
              Object.entries(prayerNames).map(([key, name]) => (
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
                    {prayerTimes?.[
                      key.charAt(0).toUpperCase() + key.slice(1)
                    ]?.substring(0, 5) ?? "-"}
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
      ) : (
        <RequestLocation
          isRequested={isLocationRequested}
          request={() => request()}
        />
      )}
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
