"use client";

import { ParallaxProvider } from "react-scroll-parallax";

import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { QuizLandingPageSections } from "@/components/landing/QuizLandingPage";
import { QuizUI } from "@/components/quiz/QuizUI";
import { Question } from "@/types/quiz";

const dummyQuestions: Question[] = [
  {
    text: "Apa ibukota Indonesia?",
    type: "multiple-choice",
    options: ["Jakarta", "Surabaya", "Bandung", "Yogyakarta"],
    correctAnswer: "Jakarta",
  },
  {
    text: "Berapa jumlah provinsi di Indonesia pada tahun 2023?",
    type: "multiple-choice",
    options: ["31", "33", "34", "38"],
    correctAnswer: "38",
  },
  {
    text: "Siapa presiden pertama Indonesia?",
    type: "text-input",
    correctAnswer: "Soekarno",
  },
  {
    text: "Pulau terbesar di Indonesia adalah...",
    type: "multiple-choice",
    options: ["Jawa", "Sumatera", "Kalimantan", "Papua"],
    correctAnswer: "Kalimantan",
  },
  {
    text: "Apa nama mata uang Indonesia?",
    type: "multiple-choice",
    options: ["Rupiah", "Ringgit", "Peso", "Baht"],
    correctAnswer: "Rupiah",
  },
];

export default function LandingPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <QuizUI questions={dummyQuestions} />
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}
