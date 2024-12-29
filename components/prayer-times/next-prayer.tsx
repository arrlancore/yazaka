"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, Timer } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  AfternoonSunIcon,
  FajrDawnIcon,
  IsyaIcon,
  MagrbIcon,
  SunIcon,
  SunriseIcon,
} from "./prayer-icons";
import { useState, useEffect } from "react";
import { usePrayerTimesGlobal } from "@/hooks/usePrayerTimes";

const NextPrayer = () => {
  const { nextPrayer, currentTime } = usePrayerTimesGlobal();
  const [timeRemaining, setTimeRemaining] = useState("-- : --");
  const [urgencyLevel, setUrgencyLevel] = useState("low");

  const calculateTimeRemaining = () => {
    if (!nextPrayer || !nextPrayer.time) {
      return "-- : --";
    }

    const cleanTime = nextPrayer.time
      .replace(/\s*\((WIB|WITA|WIT)\)\s*/, "")
      .trim();
    const [hours, minutes] = cleanTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
      return "-- : --";
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

    return `${hoursRemaining.toString().padStart(2, "0")}:${minutesRemaining.toString().padStart(2, "0")}`;
  };
  const updateUrgencyLevel = (remaining: string) => {
    const [hours, minutes] = remaining.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes <= 3) {
      setUrgencyLevel("critical");
    } else if (totalMinutes <= 15) {
      setUrgencyLevel("urgent");
    } else if (totalMinutes <= 30) {
      setUrgencyLevel("normal");
    } else {
      setUrgencyLevel("low");
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      updateUrgencyLevel(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer, currentTime]);

  if (!nextPrayer) {
    return null;
  }

  if (urgencyLevel === "low") return null;

  return (
    <Card
      className={cn(
        "overflow-hidden border-none sm:border bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg max-w-md w-full mx-auto rounded-[0] sm:rounded-[2rem] transition-all duration-300",
        urgencyLevel === "urgent" && "!bg-orange-100 dark:!bg-orange-900/30",
        urgencyLevel === "critical" && "!bg-red-100 dark:!bg-red-900/30"
      )}
    >
      <CardContent className="px-4 py-2 flex items-center gap-2">
        <Timer
          className={cn(
            "w-4 h-4",
            urgencyLevel === "urgent" && "text-orange-500",
            urgencyLevel === "critical" && "text-red-500"
          )}
        />
        <p
          className={cn(
            "text-sm",
            urgencyLevel === "urgent" && "text-orange-500",
            urgencyLevel === "critical" && "text-red-500"
          )}
        >
          Shalat selanjutnya: <strong>{nextPrayer.name}</strong> dalam{" "}
          {timeRemaining}
        </p>
      </CardContent>
    </Card>
  );
};

export default NextPrayer;
