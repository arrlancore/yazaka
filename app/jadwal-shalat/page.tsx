import PrayerTimes from "@/components/prayer-times/prayer-times";
import { Metadata } from "next";
import { appLocale, appUrl, brandName } from "@/config";
import { renderMd } from "@/hooks/common";
import { Card } from "@/components/ui/card";

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

const introContent = `
    # Pengenalan Jadwal Shalat Online 🕌

    ## Assalamu'alaikum Warahmatullahi Wabarakatuh

    Alhamdulillah, kami senang dapat menghadirkan aplikasi jadwal shalat online ini untuk Anda. Semoga aplikasi ini dapat membantu kita semua dalam menjalankan ibadah shalat tepat waktu di tengah kesibukan sehari-hari.

    ## Fitur-fitur Aplikasi

    - 🕰️ Jadwal shalat akurat untuk kota Anda
    - 🌅 Informasi waktu subuh, syuruq, dzuhur, ashar, maghrib, dan isya
    - 📍 Deteksi lokasi otomatis (dengan izin)
    - 🔔 Pengingat waktu shalat (segera hadir)
    - 📅 Kalender Hijriah


    Kami berharap aplikasi ini dapat membantu kita semua untuk lebih disiplin dalam menjalankan shalat. Semoga dengan kemudahan ini, kita bisa meningkatkan kualitas ibadah kita sehari-hari.

    Mari kita jaga shalat kita bersama-sama. Semoga bermanfaat dan membawa keberkahan bagi kita semua.

    Jazakumullahu Khairan.
  `;

export default async function JadwalShalatPage() {
  const intro = await renderMd(introContent);

  return (
    <main className="flex flex-col pb-4">
      <div className="px-0 sm:container sm:px-4">
        <PrayerTimes />
      </div>
      {intro && (
        <Card className="p-8 my-12 mx-4 border-none shadow-none rounded-none sm:container sm:mx-auto sm:max-w-md sm:border sm:shadow-sm sm:rounded-2xl">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {intro}
          </div>
        </Card>
      )}
    </main>
  );
}
