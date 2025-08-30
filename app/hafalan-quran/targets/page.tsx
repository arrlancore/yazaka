import { Metadata } from "next";
import HafalanQuranTargets from "@/components/HafalanQuranTargets";

export const metadata: Metadata = {
  title: "Daftar Target Hafalan Quran",
  description: "Lihat dan kelola semua target hafalan Quran Anda",
};

async function HafalanQuranTargetsPage() {
  return (
    <main className="max-w-2xl mx-auto mb-8 px-4 md:px-0">
      <HafalanQuranTargets />
    </main>
  );
}

export default HafalanQuranTargetsPage;
