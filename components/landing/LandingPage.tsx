import heroAnimation from "../../app/(landing-page)/assets/hero-animation.json";
import quizAnimation from "../../app/(landing-page)/assets/quiz-animation.json";
import chatbotAnimation from "../../app/(landing-page)/assets/chatbot-animation.json";
import rewardAnimation from "../../app/(landing-page)/assets/reward-animation.json";

// components/landing/LandingPage.tsx
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
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
  Sparkles,
} from "lucide-react";
import Lottie from "lottie-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BenefitCard = ({ icon: Icon, title, description }: BenefitCardProps) => (
  <div
    className={cn(
      "relative transform overflow-hidden rounded-2xl",
      "bg-card/80 backdrop-blur-sm p-6",
      "shadow-neumorphic transition-all duration-300"
    )}
  >
    <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-primary to-primary-light opacity-20" />
    <Icon className="mb-4 text-primary" size={36} />
    <h4 className="mb-2 text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
      {title}
    </h4>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

interface StatCardProps {
  icon: LucideIcon;
  count: string;
  label: string;
}

const StatCard = ({ icon: Icon, count, label }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={cn(
      "relative overflow-hidden rounded-2xl",
      "bg-card/80 backdrop-blur-sm p-6",
      "shadow-neumorphic transition-all duration-300",
      "text-center"
    )}
  >
    <motion.div
      className={cn(
        "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
        "bg-gradient-to-br from-primary to-primary-light",
        "shadow-neon"
      )}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.5 }}
    >
      <Icon className="text-primary-foreground" size={32} />
    </motion.div>
    <motion.h4
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="mb-2 text-3xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
    >
      {count}
    </motion.h4>
    <p className="text-xl text-muted-foreground">{label}</p>
  </motion.div>
);

export function LandingPageSections() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 pt-[64px]">
      <main className="space-y-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-between text-center md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2"
          >
            <h2 className="mx-auto mb-6 max-w-lg text-center text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="relative bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Petualangan
                <motion.span
                  className="absolute -right-8 -top-6"
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.span>
              </span>{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                Belajar yang Menyenangkan!
              </span>
            </h2>
            <p className="mb-8 text-xl sm:text-2xl text-muted-foreground">
              Ubah cara belajar siswa Anda dengan kuis interaktif dan chatbot
              cerdas
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative overflow-hidden rounded-xl px-8 py-4",
                "bg-gradient-to-r from-primary to-primary-light",
                "text-xl font-bold text-primary-foreground",
                "shadow-neon transition-all duration-300"
              )}
            >
              <span className="relative z-10">Mulai Petualangan</span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          <Parallax translateY={[-20, 20]} className="mt-8 md:mt-0 md:w-1/2">
            <div className="rounded-2xl p-4 bg-card">
              <Lottie
                animationData={heroAnimation}
                className="mx-auto w-full max-w-md"
              />
            </div>
          </Parallax>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-3 pt-12">
          {[
            {
              icon: Book,
              title: "Kuis Petualangan",
              desc: "Belajar sambil berpetualang dengan kuis interaktif yang menarik",
              animation: quizAnimation,
            },
            {
              icon: Bolt,
              title: "Chatbot Pintar",
              desc: "Asisten virtual yang siap membantu siswa belajar kapan saja",
              animation: chatbotAnimation,
            },
            {
              icon: Award,
              title: "Sistem Penghargaan",
              desc: "Motivasi siswa dengan lencana dan pencapaian yang menantang",
              animation: rewardAnimation,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={cn(
                "rounded-2xl bg-card p-6",
                "shadow-neumorphic transition-all duration-300"
              )}
            >
              <div className="mb-4 h-32">
                <Lottie
                  animationData={feature.animation}
                  className="h-full w-full"
                />
              </div>
              <h3 className="mb-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Benefits Section */}
        <section className="my-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-10 text-center text-4xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
          >
            Manfaat untuk Guru dan Siswa
          </motion.h3>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-1 w-full bg-primary/20">
                {[Mountain, Map, Compass, Flag].map((Icon, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2",
                      index === 0 && "left-0",
                      index === 1 && "left-1/3",
                      index === 2 && "left-2/3",
                      index === 3 && "right-0"
                    )}
                  >
                    <Icon size={80} className="text-primary/30" />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              <BenefitCard
                icon={Mountain}
                title="Petualangan Interaktif"
                description="Tingkatkan keterlibatan siswa dengan pembelajaran yang menarik."
              />
              <BenefitCard
                icon={Map}
                title="Peta Kemajuan"
                description="Pantau dan analisis perkembangan siswa dengan dashboard intuitif."
              />
              <BenefitCard
                icon={Compass}
                title="Eksplorasi Mandiri"
                description="Dorong siswa untuk mengeksplorasi pengetahuan secara mandiri."
              />
              <BenefitCard
                icon={Flag}
                title="Pencapaian Epik"
                description="Motivasi siswa dengan sistem penghargaan yang mengesankan."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <Parallax speed={5}>
          <section className="text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-6 text-4xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
            >
              Siap Memulai Petualangan?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-2xl text-muted-foreground"
            >
              Daftar sekarang dan dapatkan akses gratis selama 30 hari!
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "group relative overflow-hidden rounded-xl px-10 py-4",
                "bg-gradient-to-r from-primary to-primary-light",
                "text-xl font-bold text-primary-foreground",
                "shadow-neon transition-all duration-300"
              )}
            >
              <span className="relative z-10">Daftar Gratis</span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 2, opacity: 0.1 }}
              />
            </motion.button>
          </section>
        </Parallax>

        {/* Stats Section */}
        <section className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            { icon: User, count: "10,000+", label: "Guru Aktif" },
            { icon: MessageCircle, count: "1 Juta+", label: "Kuis Dijawab" },
            { icon: Award, count: "500,000+", label: "Pencapaian Diraih" },
          ].map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </section>
      </main>
    </div>
  );
}
