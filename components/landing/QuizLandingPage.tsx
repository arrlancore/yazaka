import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Edit, Share2, FileDown, Repeat, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className={cn(
      "group relative overflow-hidden",
      "rounded-3xl p-8",
      "bg-card/30 backdrop-blur-xl",
      "border border-border/50",
      "hover:shadow-lg transition-all duration-300"
    )}
  >
    <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full blur-3xl opacity-0 bg-gradient-to-br from-primary to-primary-light group-hover:opacity-20 transition-opacity duration-500" />

    <div className="relative mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br from-background/50 to-background/10 border border-border/50">
      <Icon className="w-8 h-8 text-primary group-hover:text-primary-light transition-colors duration-300" />
    </div>

    <h3
      className={cn(
        "text-xl font-semibold mb-4",
        "bg-gradient-to-br from-foreground to-foreground/80",
        "bg-clip-text text-transparent",
        "group-hover:from-primary group-hover:to-primary-light",
        "transition-all duration-300"
      )}
    >
      {title}
    </h3>

    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
      {description}
    </p>
  </motion.div>
);

export const QuizLandingPageSections = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] overflow-hidden bg-background flex items-center">
        {/* Advanced gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_var(--primary)_0%,_transparent_50%)] opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_var(--primary-light)_0%,_transparent_50%)] opacity-20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--primary-dark)_0%,_transparent_50%)] opacity-30" />
        </div>

        {/* Grain effect */}
        <div className="absolute inset-0 opacity-10 sm:opacity-20 mix-blend-overlay">
          <svg
            viewBox="0 0 400 400"
            className="absolute h-full w-full opacity-30"
          >
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.80"
                numOctaves="4"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* Subtle grid */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--border)_0.5px,_transparent_0.5px)] bg-[size:16px_16px] sm:bg-[size:24px_24px]"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--border) 0.5px, transparent 0.5px)`,
          }}
        />

        {/* Content wrapper */}
        <div className="relative w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Premium badge */}
              <div className="mb-8 sm:mb-12 md:mb-16 inline-flex justify-center">
                <div className="relative isolate">
                  <div
                    className={cn(
                      "relative z-10 rounded-full",
                      "px-4 py-2 sm:px-6 sm:py-3",
                      "text-xs sm:text-sm text-foreground/80",
                      "backdrop-blur border border-border bg-card/5",
                      "shadow-neumorphic"
                    )}
                  >
                    <span className="relative z-20 flex items-center gap-2">
                      Platform Kuis Interaktif #1 di Indonesia
                    </span>
                  </div>
                  <div
                    className={cn(
                      "absolute -inset-px rounded-full",
                      "bg-gradient-to-r from-primary/50 via-primary-light/50 to-primary/50",
                      "opacity-20 blur-sm"
                    )}
                  />
                </div>
              </div>

              {/* Main heading */}
              <h1
                className={cn(
                  "text-4xl sm:text-6xl md:text-7xl",
                  "font-bold leading-tight tracking-tight",
                  "transition-all duration-300 mb-6"
                )}
              >
                <span
                  className={cn(
                    "block text-transparent bg-clip-text pb-2 sm:pb-4",
                    "bg-gradient-to-br from-primary via-primary-light to-primary/70"
                  )}
                >
                  Buat dan Bagikan Kuis dengan Mudah
                </span>
              </h1>

              {/* Description */}
              <p
                className={cn(
                  "text-xl sm:text-2xl md:text-3xl",
                  "leading-relaxed text-foreground/80 font-medium",
                  "max-w-3xl mx-auto transition-all duration-300 mb-10"
                )}
              >
                Dengan Insperasi,{" "}
                <span className="relative inline-flex items-center">
                  <span className="relative whitespace-nowrap">
                    Jadikan Pembelajaran Lebih Menyenangkan!
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 418 42"
                      className={cn(
                        "absolute -bottom-2 sm:-bottom-4 left-0",
                        "h-[.4em] sm:h-[.6em] w-full",
                        "fill-primary/40"
                      )}
                      preserveAspectRatio="none"
                    >
                      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                    </svg>
                  </span>
                </span>
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                className={cn(
                  "group relative",
                  "px-8 py-7",
                  "bg-primary hover:bg-primary-light",
                  "text-primary-foreground text-lg",
                  "rounded-2xl",
                  "transition-all overflow-hidden",
                  "shadow-neon hover:shadow-neon-hover"
                )}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Mulai Buat Kuis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div
                  className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-primary-light via-primary to-primary-light",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-12 leading-tight bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent"
          >
            Fitur Unggulan
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Edit}
              title="Pembuatan Kuis"
              description="Buat kuis dengan mudah menggunakan editor intuitif kami"
            />
            <FeatureCard
              icon={Repeat}
              title="Gunakan Kembali Template"
              description="Hemat waktu dengan menggunakan dan menyesuaikan template kuis yang sudah ada"
            />
            <FeatureCard
              icon={Share2}
              title="Bagikan ke Grup"
              description="Bagikan kuis Anda ke grup siswa atau kelas dengan cepat"
            />
            <FeatureCard
              icon={FileDown}
              title="Unduh sebagai PDF"
              description="Ekspor kuis Anda dalam format PDF untuk penggunaan offline"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 leading-tight bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Cara Kerja
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {[
              {
                step: "1",
                title: "Buat",
                description: "Buat kuis baru atau gunakan template",
              },
              {
                step: "2",
                title: "Sesuaikan",
                description: "Tambahkan pertanyaan dan atur pengaturan",
              },
              {
                step: "3",
                title: "Bagikan",
                description: "Bagikan ke grup atau unduh sebagai PDF",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Siap Membuat Kuis Interaktif?
          </h2>
          <p className="text-muted-foreground mb-8">
            Mulai buat dan bagikan kuis Anda hari ini dengan Insperasi
          </p>
          <Button size="lg" className="shadow-neon">
            Daftar Gratis Sekarang
          </Button>
        </div>
      </section>
    </div>
  );
};
