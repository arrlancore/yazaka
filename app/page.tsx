import TaskTracker from "@/components/task-tracker";
import AppList from "@/components/app-list";
import PrayerTimesCompact from "@/components/prayer-times/prayer-times-compact";
import NextPrayer from "@/components/prayer-times/next-prayer";
import { Metadata } from "next";
import {
  appDescription,
  appLocale,
  appSlogan,
  appUrl,
  brandName,
} from "@/config";
import QuranLastRead from "@/components/quran-last-read";
import HomepageWrapper from "@/components/homepage-wrapper";
import InstallPrompt from "@/components/pwa/InstallPrompt";

export const metadata: Metadata = {
  title: appSlogan + " | " + brandName,
  description: appDescription,
  openGraph: {
    title: appSlogan,
    description: appDescription,
    url: appUrl,
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${brandName} - ${appSlogan}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brandName} | ${appSlogan}`,
    description: appDescription,
    images: [`${appUrl}/images/landing-page-twitter.jpg`],
  },
  keywords: [
    "aplikasi Islami",
    "Al-Quran online",
    "jadwal shalat",
    "pengingat ibadah",
    "produktivitas Muslim",
    "arah kiblat",
    "beriman",
    "berilmu",
    "berkarya",
  ],
};

export default function LandingPage() {
  return (
    <HomepageWrapper>
      <main className="flex flex-col pb-4">
        <NextPrayer />
        <PrayerTimesCompact />
        <div className="px-4 space-y-4 sm:container sm:px-0">
          <InstallPrompt variant="card" />
          <AppList />
          <TaskTracker />
          <QuranLastRead />
        </div>
      </main>
    </HomepageWrapper>
  );
}
