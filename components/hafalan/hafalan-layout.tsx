import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HafalanHeader } from "./hafalan-header";
import Footer from "@/components/footer";

interface HafalanLayoutProps {
  children: ReactNode;
}

export function HafalanLayout({ children }: HafalanLayoutProps) {
  return (
    <Card className="container border-none sm:border max-w-2xl mx-auto overflow-hidden transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-lg text-foreground rounded-[0] sm:rounded-[2rem] p-0 mb-16">
      <HafalanHeader />
      <CardContent className="p-4 space-y-6">{children}</CardContent>
      <Footer />
    </Card>
  );
}
