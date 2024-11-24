"use client";
import {
  Book,
  Bolt,
  Award,
  User,
  MessageCircle,
  Mountain,
  Map,
  Compass,
  Flag,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";

import heroAnimation from "./assets/hero-animation.json";
import quizAnimation from "./assets/quiz-animation.json";
import chatbotAnimation from "./assets/chatbot-animation.json";
import rewardAnimation from "./assets/reward-animation.json";
import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LandingPageSections } from "@/components/landing/LandingPage";

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
}) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay,
    }}
  >
    {children}
  </motion.div>
);

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => (
  <div className="relative transform overflow-hidden rounded-2xl bg-white/40 p-6 shadow-xl backdrop-blur-sm transition duration-300 hover:shadow-2xl">
    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-amber-300 to-orange-300 opacity-50" />
    <Icon className="mb-4 text-amber-600" size={36} />
    <h4 className="mb-2 text-xl font-bold text-amber-800">{title}</h4>
    <p className="text-amber-700">{description}</p>
  </div>
);

interface StatCardProps {
  icon: LucideIcon;
  count: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, count, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="relative overflow-hidden rounded-2xl bg-white/30 p-6 text-center shadow-xl backdrop-blur-sm"
  >
    <motion.div
      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="text-white" size={32} />
    </motion.div>
    <motion.h4
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="mb-2 text-3xl font-bold text-amber-800"
    >
      {count}
    </motion.h4>
    <p className="text-xl text-amber-700">{label}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <ParallaxProvider>
      <PageContainer scrollable withContentTemplate={false}>
        <Header />
        <LandingPageSections />
        <Footer />
      </PageContainer>
    </ParallaxProvider>
  );
}
