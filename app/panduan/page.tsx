import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import PanduanHub from "@/components/panduan/PanduanHub";

export const metadata: Metadata = {
  title: "Panduan Ibadah Islam | Ramadan, Qurban, Umrah, Haji",
  description:
    "Panduan ibadah Islam berdasarkan Al-Qur'an dan Hadits Shahih. Checklist harian, fikih praktis, dalil terpercaya, dan keutamaan ibadah.",
  openGraph: {
    title: "Panduan Ibadah Islam | Ramadan, Qurban, Umrah, Haji",
    description:
      "Panduan ibadah Islam berdasarkan Al-Qur'an dan Hadits Shahih. Checklist harian, fikih praktis, dalil terpercaya.",
    url: appUrl + "/panduan",
    siteName: brandName,
    locale: appLocale,
    type: "website",
  },
  keywords: [
    "panduan ramadan",
    "panduan puasa",
    "fikih puasa",
    "checklist ramadan",
    "doa ramadan",
    "panduan ibadah",
  ],
};

export default function PanduanPage() {
  return (
    <MobilePage>
      <HeaderMobilePage
        title="Panduan Ibadah"
        subtitle="Berdasarkan Al-Qur'an & Hadits Shahih"
        backUrl="/"
      />
      <PanduanHub />
    </MobilePage>
  );
}
