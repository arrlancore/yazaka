import Header from "@/components/header";
import Footer from "@/components/footer";
import PrayerTimes from "@/components/prayer-times/prayer-times";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";

export const metadata: Metadata = {
  title: "Jadwal Shalat | Waktu Shalat Akurat untuk Kota Anda",
  description:
    "Dapatkan jadwal shalat terbaru dan akurat untuk kota Anda. Fitur lengkap termasuk waktu imsak, subuh, dzuhur, ashar, maghrib, dan isya.",
  openGraph: {
    title: "Jadwal Shalat Akurat | Waktu Ibadah Tepat",
    description:
      "Temukan jadwal shalat terkini untuk kota Anda. Informasi waktu shalat yang tepat dan mudah diakses untuk membantu ibadah harian Anda.",
    url: appUrl + "/jadwal-shalat",
    siteName: brandName,
    locale: appLocale,
    type: "website",
    images: [
      {
        url: `${appUrl}/images/prayer-times-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Jadwal Shalat Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jadwal Shalat | Waktu Ibadah Tepat untuk Setiap Muslim",
    description:
      "Akses jadwal shalat akurat untuk kota Anda. Lengkap dengan waktu imsak, subuh, dzuhur, ashar, maghrib, dan isya.",
    images: [`${appUrl}/images/prayer-times-twitter.jpg`],
  },
  keywords: [
    "jadwal shalat",
    "waktu shalat",
    "jadwal solat",
    "waktu solat",
    "prayer times",
    "islamic prayer schedule",
  ],
};

export default async function JadwalShalatPage() {
  return (
    <>
      <Header />
      <main className="sm:container flex flex-col sm:gap-4 py-4">
        <PrayerTimes />
      </main>
      <Footer />
    </>
  );
}
