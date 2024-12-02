import {
  Timer,
  BookOpen,
  Brain,
  LucideIcon,
  Clock,
  Zap,
  ChartBar,
  Bot,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  index?: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  items,
  index = 0,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "rounded-3xl p-8",
        "bg-card/30 backdrop-blur-xl",
        "border border-border/50"
      )}
    >
      {/* Gradient orb effect */}
      <div
        className={cn(
          "absolute -right-12 -top-12 w-24 h-24",
          "rounded-full blur-3xl opacity-0",
          "bg-gradient-to-br from-primary to-primary-light",
          "group-hover:opacity-20 transition-opacity duration-500"
        )}
      />

      {/* Icon wrapper with modern effect */}
      <div
        className={cn(
          "relative mb-6 inline-flex",
          "p-4 rounded-2xl",
          "bg-gradient-to-br from-background/50 to-background/10",
          "border border-border/50"
        )}
      >
        <Icon
          className={cn(
            "w-8 h-8",
            "text-primary group-hover:text-primary-light",
            "transition-colors duration-300"
          )}
        />
      </div>

      {/* Title with gradient effect */}
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

      {/* Items list with modern bullets */}
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + idx * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start space-x-3 group/item"
          >
            <span
              className={cn(
                "mt-2 block w-1.5 h-1.5 rounded-full",
                "bg-primary/50 group-hover:bg-primary",
                "transition-colors duration-300"
              )}
            />
            <span
              className={cn(
                "text-muted-foreground group-hover/item:text-foreground",
                "transition-colors duration-300"
              )}
            >
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="relative py-20">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--primary)_0%,_transparent_70%)] opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_var(--primary-light)_0%,_transparent_70%)] opacity-5" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section header with animated underline */}
        <div className="relative mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={cn(
              "text-4xl font-bold",
              "bg-gradient-to-r from-primary via-primary-light to-primary",
              "bg-clip-text text-transparent",
              "mb-4"
            )}
          >
            Mengapa Guru Memilih Insperasi
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className={cn(
              "mx-auto w-24 h-1 rounded-full",
              "bg-gradient-to-r from-primary to-primary-light"
            )}
          />
        </div>

        {/* Features grid with improved spacing */}
        <div
          className={cn(
            "grid gap-8",
            "md:grid-cols-2 lg:grid-cols-3",
            "max-w-7xl mx-auto"
          )}
        >
          <FeatureCard
            icon={Timer}
            title="Hemat 10+ Jam per Minggu"
            items={[
              "Buat rencana semester dalam hitungan menit",
              "Pembuatan Modul Ajar otomatis",
              "Pembuatan dan penilaian kuis instan",
              "Pengelolaan kalender pintar",
            ]}
            index={0}
          />
          <FeatureCard
            icon={BookOpen}
            title="Pembelajaran Interaktif Jadi Mudah"
            items={[
              "Chatbot pintar untuk pendampingan siswa",
              "Materi pembelajaran yang menarik",
              "Pantau kemajuan secara real-time",
              "Alat penilaian yang bisa disesuaikan",
            ]}
            index={1}
          />
          <FeatureCard
            icon={Brain}
            title="Wawasan Pembelajaran Cerdas"
            items={[
              "Pantau kemajuan siswa tanpa ribet",
              "Identifikasi kesenjangan pembelajaran",
              "Laporan komprehensif otomatis",
              "Rekomendasi mengajar berbasis data",
            ]}
            index={2}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
