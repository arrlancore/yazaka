import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import DoaHeader from "@/components/doa/DoaHeader";
import DoaTabs from "@/components/doa/DoaTabs";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import { renderMd } from "@/hooks/common";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Doa dan Dzikir | Kumpulan Doa Harian dan Situasional",
  description:
    "Akses 227+ doa dan dzikir harian dengan mudah. Doa sehari-hari, situasional, dengan teks Arab, transliterasi, dan terjemahan bahasa Indonesia.",
  openGraph: {
    title: "Doa dan Dzikir | Kumpulan Doa Harian dan Situasional",
    description:
      "Kumpulan lengkap doa dan dzikir untuk kehidupan sehari-hari. Akses mudah, teks Arab dengan transliterasi dan terjemahan Indonesia.",
    url: appUrl + "/doa",
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/images/doa-online-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Doa dan Dzikir Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Doa dan Dzikir | Kumpulan Doa Harian dan Situasional",
    description:
      "Akses 227+ doa dan dzikir dengan teks Arab, transliterasi, dan terjemahan. Mudah digunakan kapan saja, di mana saja.",
    images: [`${appUrl}/images/doa-online-twitter.jpg`],
  },
  keywords: [
    "doa harian",
    "dzikir",
    "doa islam",
    "doa sehari-hari",
    "doa situasional",
    "doa bahasa indonesia",
    "teks arab doa"
  ],
};

const introContent = `
    # Kumpulan Doa dan Dzikir 🤲

    ## Bismillah, Assalamu'alaikum Warahmatullahi Wabarakatuh

    Alhamdulillah, kami hadirkan kumpulan doa dan dzikir untuk membantu Anda dalam berbagai situasi kehidupan sehari-hari. Semoga dapat mendekatkan kita kepada Allah SWT dan memudahkan dalam mengamalkan sunnah Rasulullah SAW.

    ## Fitur-fitur Doa

    - 🤲 Kumpulan 227+ doa dan dzikir lengkap
    - 📖 Teks Arab dengan harakat yang jelas
    - 🔤 Transliterasi latin untuk memudahkan bacaan
    - 📝 Terjemahan bahasa Indonesia
    - 📚 Dalil hadith dan referensi yang shahih
    - 🔍 Pencarian cerdas berdasarkan situasi
    - ⭐ Favorit untuk doa yang sering dibaca

    Mari kita perbanyak berdo'a dan berdzikir kepada Allah SWT. Semoga bermanfaat dan mendatangkan keberkahan dalam hidup kita.

    Jazakumullahu Khairan.
    `;

const DoaPage = async () => {
  const intro = await renderMd(introContent);
  
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto mb-8">
        <DoaHeader />
        <DoaTabs />
        {intro && (
          <Card className="p-8 my-12 container max-w-3xl">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {intro}
            </div>
          </Card>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DoaPage;