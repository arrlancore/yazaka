import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        neumorphic: "var(--shadow-neumorphic)",
        "neumorphic-inset": "var(--shadow-neumorphic-inset)",
        neon: "var(--shadow-neon)",
      },
      keyframes: {
        ellipsis: {
          "0%": { content: "." },
          "33%": { content: ".." },
          "66%": { content: "..." },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        ellipsis: "ellipsis 1.5s infinite",
        "spin-slow": "spin-slow 8s linear infinite",
        pulse: "pulse 4s infinite",
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: "100ch",
            color: theme("colors.foreground"),
            a: {
              color: theme("colors.primary.DEFAULT"),
              "&:hover": {
                color: theme("colors.primary.foreground"),
              },
            },
            h1: {
              color: theme("colors.foreground"),
            },
            h2: {
              color: theme("colors.foreground"),
            },
            h3: {
              color: theme("colors.foreground"),
            },
            h4: {
              color: theme("colors.foreground"),
            },
            h5: {
              color: theme("colors.foreground"),
            },
            h6: {
              color: theme("colors.foreground"),
            },
            strong: {
              color: theme("colors.foreground"),
            },
            code: {
              color: theme("colors.foreground"),
            },
            figcaption: {
              color: theme("colors.muted.foreground"),
            },
            blockquote: {
              color: theme("colors.muted.foreground"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
