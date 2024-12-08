"use client";

import { ParallaxProvider } from "react-scroll-parallax";

import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import QuranLastRead from "@/components/quran-last-read";
import TaskTracker from "@/components/task-tracker";
import NextPrayer from "@/components/next-prayer";
import AppList from "@/components/app-list";
import PrayerTimesCompact from "@/components/prayer-times-compact";

export default function LandingPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <main className="sm:container flex flex-col sm:gap-4">
          <NextPrayer />
          <PrayerTimesCompact />
          <AppList />
          <TaskTracker />
          <QuranLastRead />
        </main>
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}
