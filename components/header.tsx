"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { brand } from "@/config";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    // { href: "#features", label: "Features" },
    // { href: "#pricing", label: "Pricing" },
    // { href: "#about", label: "About" },
    // { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg shadow-md"
          : "bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="px-4 sm:container flex h-16 items-center justify-between">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <Link href="/">
            <h1 className="relative text-xl md:text-2xl font-extrabold">
              <span>{brand.title}</span>
              {brand.domain && (
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  {brand.domain}
                </span>
              )}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative text-muted-foreground transition-colors",
                  "hover:text-foreground",
                  "after:absolute after:bottom-0 after:left-0",
                  "after:h-0.5 after:w-0",
                  "after:bg-gradient-to-r after:from-primary after:to-primary-light",
                  "after:transition-all after:duration-300",
                  "hover:after:w-full"
                )}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-colors"
            >
              Sign In
            </Button>
            <Button
              className={cn(
                "bg-gradient-to-r from-primary to-primary-light",
                "text-primary-foreground shadow-neon",
                "hover:shadow-none transition-shadow"
              )}
            >
              Get Started
            </Button>
            <ModeToggle />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <nav className="container py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 p-4">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
                <Button
                  className={cn(
                    "w-full justify-start",
                    "bg-gradient-to-r from-primary to-primary-light",
                    "text-primary-foreground shadow-neon",
                    "hover:shadow-none transition-shadow"
                  )}
                >
                  Get Started
                </Button>
                <div className="flex justify-end">
                  <ModeToggle />
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
