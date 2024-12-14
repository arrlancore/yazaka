"use client";
import { ParallaxProvider } from "react-scroll-parallax";
import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SurahDetail from "@/components/surah-detail";

function SurahDetailPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <main className="sm:container flex flex-col sm:gap-4">
          <SurahDetail />
        </main>
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}

export default SurahDetailPage;
