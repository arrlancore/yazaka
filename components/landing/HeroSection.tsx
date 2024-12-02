import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background flex items-center">
      {/* Advanced gradient background - adjusted for mobile */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_var(--primary)_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_var(--primary-light)_0%,_transparent_50%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--primary-dark)_0%,_transparent_50%)] opacity-30" />
      </div>

      {/* Grain effect - reduced opacity on mobile */}
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

      {/* Subtle grid - adjusted size for mobile */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--border)_0.5px,_transparent_0.5px)] bg-[size:16px_16px] sm:bg-[size:24px_24px]"
        style={{
          backgroundImage: `radial-gradient(circle at center, var(--border) 0.5px, transparent 0.5px)`,
        }}
      />

      {/* Content wrapper with improved mobile padding */}
      <div className="relative w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Premium badge - mobile optimized */}
            <div className="mb-8 sm:mb-12 md:mb-16 inline-flex">
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
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r from-primary/20 via-primary-light/20 to-primary/20",
                        "opacity-0 transition duration-500 group-hover:opacity-100"
                      )}
                    />
                  </span>
                  <span className="relative z-20 flex items-center gap-2">
                    Platform Pendamping Guru #1 di Indonesia
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

            {/* Main heading - responsive text sizes */}
            <div className="relative">
              <h1
                className={cn(
                  "text-[3.5rem] sm:text-7xl md:text-[8.5rem]",
                  "font-bold leading-none tracking-tight",
                  "transition-all duration-300"
                )}
              >
                <span
                  className={cn(
                    "block text-transparent bg-clip-text pb-2 sm:pb-4",
                    "bg-gradient-to-br from-primary via-primary-light to-primary/70"
                  )}
                >
                  Insperasi
                </span>
              </h1>
            </div>

            {/* Description - adjusted for mobile */}
            <div className="mt-6 sm:mt-8 mb-10 sm:mb-16">
              <p
                className={cn(
                  "text-xl sm:text-3xl md:text-[2.5rem]",
                  "leading-tight text-foreground/80 font-medium",
                  "max-w-3xl transition-all duration-300"
                )}
              >
                Mengajar Lebih Mudah,{" "}
                <span className="relative inline-flex items-center">
                  <span className="relative whitespace-nowrap">
                    Belajar Lebih Menyenangkan!
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
            </div>

            {/* CTAs - stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Button
                size="lg"
                className={cn(
                  "group relative w-full sm:w-auto",
                  "px-6 sm:px-8 py-6 sm:py-7",
                  "bg-primary hover:bg-primary-light",
                  "text-primary-foreground text-base sm:text-lg",
                  "rounded-xl sm:rounded-2xl",
                  "transition-all overflow-hidden",
                  "shadow-neon hover:shadow-neon-hover"
                )}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div
                  className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-primary-light via-primary to-primary-light",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  )}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "w-full sm:w-auto",
                  "px-6 sm:px-8 py-6 sm:py-7",
                  "bg-transparent text-base sm:text-lg",
                  "rounded-xl sm:rounded-2xl",
                  "border-border hover:bg-card/5",
                  "text-foreground transition-all duration-200",
                  "shadow-neumorphic hover:shadow-neumorphic-inset"
                )}
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>

            {/* Decorative lines - hidden on mobile */}
            <div className="hidden sm:block">
              <div className="absolute -top-8 right-16 w-px h-32 bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="absolute -top-8 right-32 w-px h-24 bg-gradient-to-b from-transparent via-border to-transparent" />
              <div className="absolute -top-8 right-48 w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
