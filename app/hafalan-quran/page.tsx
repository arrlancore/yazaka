import PageContainer from "@/components/layout/page-container";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { appLocale, appUrl, brandName } from "@/config";
import { Metadata } from "next";
import QiblaFinder from "@/components/QiblaFinder";
import { renderMd } from "@/hooks/common";
import { Card } from "@/components/ui/card";
import HafalanQuran from "@/components/HafalanQuranPrototype";

export const metadata: Metadata = {
  title: "Aplikasi Hafalan Quran Tracker",
};

const introContent = `
    # Aplikasi Hafalan Quran Tracker 🧭

    Jazakumullahu Khairan.
  `;

async function HafalanQuranPage() {
  const intro = await renderMd(introContent);

  return (
    <>
      <Header />
      <main className="sm:container flex flex-col sm:gap-4 py-4">
        <HafalanQuran />
        {intro && (
          <Card className="p-8 my-12 container max-w-xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {intro}
            </div>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
}

export default HafalanQuranPage;
