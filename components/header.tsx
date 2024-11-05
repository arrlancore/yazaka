import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { brand } from "@/config";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
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
          <nav className="flex gap-6">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-muted-foreground hover:text-foreground"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost">Sign In</Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
