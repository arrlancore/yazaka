"use client";
import React, { useState, useEffect } from "react";
import { MapPin, Timer, Settings, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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

const EnhancedPrayerWidget = () => {
  const { location, locationName } = useLocationWithName({});
  const { prayerTimes, prayerNames, nextPrayer, hijriDate, currentTime } =
    usePrayerTimesGlobal(location);

  const [timeRemaining, setTimeRemaining] = useState("--:--");
  const [progress, setProgress] = useState(0);
  const [urgencyLevel, setUrgencyLevel] = useState("normal");

  // Filter out sunrise for compact display
  const compactPrayerNames: { [key: string]: string } = Object.entries(
    prayerNames
  )
    .filter(([key]) => key !== "sunrise")
    .reduce((acc, [key, name]) => ({ ...acc, [key]: name }), {});

  const calculateTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.time || !currentTime) {
      return { remaining: "--:--", progressValue: 0, urgency: "normal" };
    }

    const cleanTime = nextPrayer.time
      .replace(/\s*\((WIB|WITA|WIT)\)\s*/, "")
      .trim();
    const [hours, minutes] = cleanTime.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return { remaining: "--:--", progressValue: 0, urgency: "normal" };
    }

    const prayerTime = new Date(currentTime);
    prayerTime.setHours(hours, minutes, 0, 0);

    let diff = prayerTime.getTime() - currentTime.getTime();
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
    const minutesRemaining = Math.floor(
      (diff % (1000 * 60 * 60)) / (1000 * 60)
    );
    const totalMinutes = hoursRemaining * 60 + minutesRemaining;

    // Calculate progress (assume 4-hour intervals between prayers for progress)
    const maxMinutes = 4 * 60;
    const progressValue = Math.max(
      0,
      Math.min(100, ((maxMinutes - totalMinutes) / maxMinutes) * 100)
    );

    let urgency = "normal";
    if (totalMinutes <= 5) urgency = "critical";
    else if (totalMinutes <= 15) urgency = "urgent";
    else if (totalMinutes <= 30) urgency = "warning";

    return {
      remaining: `${hoursRemaining.toString().padStart(2, "0")}:${minutesRemaining.toString().padStart(2, "0")}`,
      progressValue,
      urgency,
    };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const { remaining, progressValue, urgency } = calculateTimeRemaining();
      setTimeRemaining(remaining);
      setProgress(progressValue);
      setUrgencyLevel(urgency);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer, currentTime]);

  const getPrayerIcon = (prayer: string, size = 20) => {
    const iconProps = { size, className: "text-primary-foreground/90" };

    switch (prayer) {
      case "fajr":
        return <FajrDawnIcon {...iconProps} />;
      case "sunrise":
        return <SunriseIcon {...iconProps} />;
      case "dhuhr":
        return <SunIcon {...iconProps} />;
      case "asr":
        return <AfternoonSunIcon {...iconProps} />;
      case "maghrib":
        return <MagrbIcon {...iconProps} />;
      case "isha":
        return <IsyaIcon {...iconProps} />;
      default:
        return <SunIcon {...iconProps} />;
    }
  };

  if (!location || !prayerTimes) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Next Prayer Alert - Only show when urgent */}
      <AnimatePresence>
        {urgencyLevel !== "normal" && nextPrayer && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-2"
          >
            <Card
              className={cn(
                "border-l-4 rounded-l-none overflow-hidden",
                urgencyLevel === "warning" &&
                  "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
                urgencyLevel === "urgent" &&
                  "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20",
                urgencyLevel === "critical" &&
                  "border-l-red-500 bg-red-50 dark:bg-red-900/20"
              )}
            >
              <CardContent className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Timer
                      className={cn(
                        "w-5 h-5",
                        urgencyLevel === "warning" &&
                          "text-yellow-600 dark:text-yellow-400",
                        urgencyLevel === "urgent" &&
                          "text-orange-600 dark:text-orange-400",
                        urgencyLevel === "critical" &&
                          "text-red-600 dark:text-red-400"
                      )}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        Shalat {nextPrayer.name}
                      </span>
                      <span className="text-lg font-bold font-mono">
                        {timeRemaining}
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className={cn(
                        "h-1 mt-1",
                        urgencyLevel === "warning" && "[&>div]:bg-yellow-500",
                        urgencyLevel === "urgent" && "[&>div]:bg-orange-500",
                        urgencyLevel === "critical" && "[&>div]:bg-red-500"
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Prayer Times Widget */}
      <Card className="overflow-hidden shadow-sm bg-gradient-to-br from-primary/5 via-background to-primary/5 border-0 sm:border rounded-none sm:rounded-3xl">
        <CardContent className="p-0">
          {/* Header with location */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            {locationName && (
              <div className="flex items-center justify-center px-4 py-2 border-b border-primary-foreground/10">
                <MapPin className="w-4 h-4 mr-2 opacity-90" />
                <span className="text-sm font-medium">{locationName}</span>
              </div>
            )}

            {/* Prayer Times Grid */}
            <div className="grid grid-cols-5 gap-0">
              {Object.entries(compactPrayerNames).map(([key, name], index) => {
                const isNext = nextPrayer?.name === name;
                const prayerTime =
                  prayerTimes?.[key.charAt(0).toUpperCase() + key.slice(1)];

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 relative",
                      "hover:bg-primary-foreground/10 transition-colors",
                      isNext && "bg-primary-foreground/15"
                    )}
                  >
                    {isNext && (
                      <motion.div
                        className="absolute inset-0 bg-primary-foreground/5 rounded-lg"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}

                    <div className="mb-2">{getPrayerIcon(key, 18)}</div>

                    <span
                      className={cn(
                        "text-xs font-medium mb-1 text-center opacity-90",
                        isNext && "font-bold opacity-100"
                      )}
                    >
                      {name}
                    </span>

                    <span
                      className={cn(
                        "text-sm font-bold text-center font-mono",
                        isNext && "text-lg"
                      )}
                    >
                      {prayerTime?.substring(0, 5) ?? "--:--"}
                    </span>

                    {isNext && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer with date and actions */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
            <div className="flex flex-col">
              {currentTime && (
                <span className="text-xs text-muted-foreground">
                  {currentTime.toLocaleString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              )}
              {hijriDate && (
                <span className="text-xs text-muted-foreground font-arabic">
                  {hijriDate.split(",")[1]?.trim()}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="w-4 h-4" />
              </Button>
              {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="w-4 h-4" />
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPrayerWidget;
