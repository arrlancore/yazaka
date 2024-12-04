"use client";

import { ParallaxProvider } from "react-scroll-parallax";

import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PrayerTimes from "@/components/prayer-times";
import QuranLastRead from "@/components/quran-last-read";

export default function LandingPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <PrayerTimes />
        <QuranLastRead />
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}
