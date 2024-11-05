"use client";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import Link from "next/link";
import { brand } from "@/config";

export function BlogHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-2">
        <Link href="/">
          <h1 className="text-xl md:text-2xl font-extrabold">
            <span>{brand.title}</span>
            {brand.domain && (
              <span className="bg-gradient-to-tr from-primary to-primary-foreground bg-clip-text text-transparent">
                .{brand.domain}
              </span>
            )}
          </h1>
        </Link>
        <div className="flex items-center space-x-2">
          <Link href="/blog">
            <Button variant="ghost">Blog</Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
