import Header from "@/components/header";
import Footer from "@/components/footer";
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
        url: `${appUrl}/images/landing-page-og.jpg`,
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
    <>
      <Header />
      <main className="sm:container flex flex-col sm:gap-4">
        <NextPrayer />
        <PrayerTimesCompact />
        <AppList />
        <TaskTracker />
        <QuranLastRead />
      </main>
      <Footer />
    </>
  );
}
