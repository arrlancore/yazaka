import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Book, Compass, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DuaIcon,
  PrayerScheduleIcon,
  QiblaCompassIcon,
  QuranIcon,
} from "./app-list-icons";

interface AppItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

const apps: AppItem[] = [
  {
    name: "Jadwal Shalat",
    icon: <PrayerScheduleIcon size={40} />,
    href: "/jadwal-shalat",
  },
  { name: "Qur'an", icon: <QuranIcon size={40} />, href: "/quran" },
  {
    name: "Arah Kiblat",
    icon: <QiblaCompassIcon size={40} />,
    href: "/arah-kiblat",
  },
  { name: "Doa", icon: <DuaIcon size={40} />, href: "/doa" },
];

const AppList = () => {
  return (
    <div className="container border-none sm:border max-w-md mx-auto overflow-hidden transition-all duration-300 bg-none text-foreground rounded-[0] sm:rounded-[2rem] p-0">
      <CardContent className="px-6 py-3 sm:py-6">
        <div className="flex gap-2 justify-between">
          {apps.map((app) => (
            <Link key={app.href} href={app.href}>
              <div className="flex flex-col gap-2 items-center justify-center hover:opacity-80">
                {app.icon}
                <span className="text-xs font-medium text-center">
                  {app.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default AppList;
