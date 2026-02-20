import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import RamadanTabs from "@/components/panduan/ramadan/RamadanTabs";

export const metadata: Metadata = {
  title: "Panduan Ramadan | Checklist Harian, Fikih Puasa & Doa Shahih",
  description:
    "Panduan Ramadan lengkap berdasarkan Al-Qur'an dan Hadits Shahih: checklist ibadah harian, fikih puasa praktis, dalil terpercaya, keutamaan Ramadan, dan 30 ayat pilihan untuk tadabbur.",
  openGraph: {
    title: "Panduan Ramadan | Checklist Harian, Fikih Puasa & Doa Shahih",
    description:
      "Panduan Ramadan lengkap: checklist ibadah harian, fikih puasa, dalil & doa shahih, keutamaan, dan 30 ayat pilihan untuk tadabbur.",
    url: appUrl + "/panduan/ramadan",
    siteName: brandName,
    locale: appLocale,
    type: "website",
  },
  keywords: [
    "panduan ramadan",
    "checklist ramadan",
    "fikih puasa ramadan",
    "doa buka puasa shahih",
    "doa lailatul qadar",
    "keutamaan ramadan",
    "tadabbur al-quran",
    "puasa ramadan",
  ],
};

export default function PanduanRamadanPage() {
  return (
    <MobilePage>
      <HeaderMobilePage
        title="Panduan Ramadan"
        subtitle="Berdasarkan Al-Qur'an & Hadits Shahih"
        backUrl="/panduan"
      />
      <RamadanTabs />
    </MobilePage>
  );
}
