"use client";

import { ParallaxProvider } from "react-scroll-parallax";

import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { QuizLandingPageSections } from "@/components/landing/QuizLandingPage";

export default function LandingPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <QuizLandingPageSections />
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}
