import { Metadata } from "next";
import HafalanQuranTargets from "@/components/HafalanQuranTargets";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Daftar Target Hafalan Quran",
  description: "Lihat dan kelola semua target hafalan Quran Anda",
};

async function HafalanQuranTargetsPage() {
  return (
    <>
      <MobilePage>
        <HeaderMobilePage
          title="Target Hafalan"
          backUrl="/hafalan-quran"
          rightContent={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
            >
              <Search size={20} />
            </Button>
          }
        />
        <main className="flex flex-col pb-4">
          <div className="px-4 space-y-4 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
            <HafalanQuranTargets />
          </div>
        </main>
      </MobilePage>
    </>
  );
}

export default HafalanQuranTargetsPage;
