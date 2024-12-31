"use client";
import React from "react";
import { MapPin, Sun } from "lucide-react";
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
import { useLocationWithName } from "@/hooks/useLocationWithName";

const PrayerTimesCompact = () => {
  const { location, locationName } = useLocationWithName({});
  const { prayerTimes, prayerNames, nextPrayer, hijriDate, currentTime } =
    usePrayerTimesGlobal(location);

  const compactPrayerNames: {
    [key: string]: string;
  } = Object.entries(prayerNames)
    .filter(([key]) => key !== "sunrise")
    .reduce((acc, [key, name]) => ({ ...acc, [key]: name }), {});

  if (!location) return null;

  return (
    <Card className="p-0 shadow-sm container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 text-foreground rounded-[0] sm:rounded-[2rem]">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-light p-0 sm:p-1 text-primary-foreground">
          {locationName && (
            <div className="flex items-center justify-center text-xs space-x-1 py-1">
              <MapPin size={10} className="text-secondary" />
              <span className="text-center">{locationName}</span>
            </div>
          )}

          <div className="grid grid-cols-5 gap-1 p-0">
            {Object.entries(compactPrayerNames).map(([key, name]) => (
              <div
                key={key}
                className={cn(
                  "flex flex-col items-center justify-center p-1 sm:p-2"
                )}
              >
                <span
                  className={cn(
                    "text-xs font-normal text-center text-secondary",
                    nextPrayer?.name === name
                      ? "font-bold opacity-100"
                      : "opacity-80"
                  )}
                >
                  {name}
                </span>
                <span
                  className={cn(
                    "text-sm text-center text-secondary",
                    nextPrayer?.name === name
                      ? "font-bold opacity-100"
                      : "opacity-80"
                  )}
                >
                  {prayerTimes?.[
                    key.charAt(0).toUpperCase() + key.slice(1)
                  ]?.substring(0, 5) ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <div className="flex justify-between items-center px-4 sm:px-6 py-1 text-muted-foreground">
        {currentTime && (
          <span className="text-xs text-left">
            {currentTime?.toLocaleString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {hijriDate && (
          <span className="text-xs text-right">
            {hijriDate?.split(",")[1].trim()}
          </span>
        )}
      </div>
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

export default PrayerTimesCompact;
