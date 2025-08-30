import React from "react";
import DoaHeader from "@/components/doa/DoaHeader";
import DoaTabs from "@/components/doa/DoaTabs";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";

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

const DoaPage = async () => {
  
  return (
    <main className="flex flex-col pb-4">
      <DoaHeader />
      <div className="px-4 space-y-4 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
        <DoaTabs />
      </div>
    </main>
  );
};

export default DoaPage;