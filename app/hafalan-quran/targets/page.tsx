import { Metadata } from "next";
import Header from "@/components/header";
import HafalanQuranTargets from "@/components/HafalanQuranTargets";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Daftar Target Hafalan Quran",
  description: "Lihat dan kelola semua target hafalan Quran Anda",
};

async function HafalanQuranTargetsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto mb-8">
        <HafalanQuranTargets />
      </main>
      <Footer />
    </>
  );
}

export default HafalanQuranTargetsPage;
