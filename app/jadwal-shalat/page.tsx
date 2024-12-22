"use client";
import { ParallaxProvider } from "react-scroll-parallax";

import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PrayerTimes from "@/components/prayer-times/prayer-times";

export default async function LandingPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <main className="sm:container flex flex-col sm:gap-4 py-4">
          <PrayerTimes />
        </main>
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}
