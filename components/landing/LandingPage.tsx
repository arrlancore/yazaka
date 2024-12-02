import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Clock,
  Book,
  BarChart,
  Zap,
  Star,
  Smartphone,
  Target,
  Sparkles,
  CheckCircle,
  Timer,
  BookOpen,
  Brain,
  Crown,
  MessageSquare,
} from "lucide-react";
import Lottie from "lottie-react";
import heroAnimation from "../../app/(landing-page)/assets/hero-animation.json";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ModernHeroSection from "./HeroSection";
import FeaturesSection from "./FeaturesSection";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}
const FeatureCard = ({ icon: Icon, title, items }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={cn(
      "relative overflow-hidden rounded-3xl",
      "bg-gradient-to-br from-background/80 to-background/40",
      "backdrop-blur-lg p-6",
      "border border-border/50",
      "shadow-neumorphic transition-all duration-300"
    )}
  >
    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
    <Icon className="h-10 w-10 text-primary mb-4" />
    <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">
      {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          {item}
        </li>
      ))}
    </ul>
  </motion.div>
);

export const LandingPageSections = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <ModernHeroSection />

      {/* Features Grid */}
      <FeaturesSection />

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Pilih Paket Yang Sesuai
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="relative overflow-hidden">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <CardContent className="p-6">
                <Star className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Gratis untuk Guru</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Akses penuh fitur dasar
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Pembuatan Modul Ajar tanpa batas
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Pemantauan kemajuan dasar
                  </li>
                </ul>
                <Button className="w-full">Mulai Gratis</Button>
              </CardContent>
            </Card>
            <Card className="relative overflow-hidden border-primary">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
              <CardContent className="p-6">
                <Crown className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4">Fitur Premium</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Pendampingan AI canggih
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Pembuatan konten tanpa batas
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Analisis mendalam
                  </li>
                </ul>
                <Button variant="default" className="w-full shadow-neon">
                  Coba Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Bergabung dengan 1000+ Guru Pengguna Insperasi
          </h2>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardContent className="p-8">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-6" />
              <p className="text-lg italic mb-6">
                "Insperasi mengubah total cara saya mengelola kelas. Sekarang
                saya punya lebih banyak waktu untuk fokus mengajar, bukan
                mengurus administrasi."
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="font-bold">Ibu Sarah</span>
                <span className="text-muted-foreground">Guru Kelas 4 SD</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-t from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Siap Mengajar Lebih Efektif?
          </h2>
          <p className="text-muted-foreground mb-8">
            Wujudkan pembelajaran yang lebih efektif bersama Insperasi
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="shadow-neon">
              Mulai Sekarang
            </Button>
            <Button size="lg" variant="outline">
              Hubungi Tim Kami
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
