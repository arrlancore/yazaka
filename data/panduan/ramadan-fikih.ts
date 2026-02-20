import { FikihSection } from "@/types/panduan";

export const fikihSections: FikihSection[] = [
  {
    id: "syarat-wajib",
    letter: "A",
    title: "Syarat Wajib Puasa",
    content:
      "Puasa Ramadan wajib bagi yang memenuhi syarat: Muslim, berakal, baligh, mampu, dan tidak dalam keadaan safar/sakit berat. Wanita yang haid atau nifas tidak berpuasa dan wajib qadha.",
  },
  {
    id: "rukun-puasa",
    letter: "B",
    title: "Rukun Puasa",
    content: "",
    items: [
      {
        label:
          "Niat — wajib dilakukan setiap malam untuk puasa esok hari. Dianjurkan diniatkan setelah Isya atau saat sahur. Boleh niat sebulan penuh di awal Ramadan.",
        type: "normal",
      },
      {
        label:
          "Menahan diri dari pembatal puasa — dari terbit fajar (adzan Subuh) hingga terbenam matahari (adzan Maghrib).",
        type: "normal",
      },
    ],
  },
  {
    id: "pembatal-puasa",
    letter: "C",
    title: "Pembatal Puasa",
    content: "Yang membatalkan puasa dan wajib qadha:",
    items: [
      { label: "Makan dan minum dengan sengaja", type: "membatalkan" },
      {
        label: "Jimak (hubungan suami-istri) — wajib qadha dan kafarat",
        type: "membatalkan",
      },
      { label: "Muntah dengan sengaja", type: "membatalkan" },
      { label: "Haid atau nifas", type: "membatalkan" },
      { label: "Murtad (keluar dari Islam)", type: "membatalkan" },
    ],
  },
  {
    id: "tidak-membatalkan",
    letter: "D",
    title: "Yang Tidak Membatalkan Puasa",
    content: "Puasa tetap sah meski melakukan hal-hal berikut:",
    items: [
      {
        label: "Makan/minum lupa (tidak sengaja) — lanjutkan puasa",
        type: "tidak-membatalkan",
      },
      {
        label: "Berkumur-kumur saat wudhu — asal tidak ditelan",
        type: "tidak-membatalkan",
      },
      {
        label: "Suntikan yang bukan berupa makanan/obat",
        type: "tidak-membatalkan",
      },
      { label: "Mimpi basah", type: "tidak-membatalkan" },
      {
        label: "Penggunaan obat tetes mata/telinga (khilaf ulama)",
        type: "tidak-membatalkan",
      },
      {
        label:
          "Ciuman suami-istri — selama mampu menahan diri (tidak sampai jimak)",
        type: "tidak-membatalkan",
      },
    ],
    hadith:
      "Yang membatalkan puasa bukan hanya makan dan minum, tapi juga perilaku. Puasa tetap sah secara hukum, namun pahala bisa berkurang.",
  },
  {
    id: "mengurangi-pahala",
    letter: "E",
    title: "Hal yang Mengurangi Pahala (Bukan Membatalkan)",
    content:
      "Puasa tetap sah tapi pahala berkurang bahkan bisa hilang seluruhnya: ghibah, bohong dan berkata kotor, melihat yang haram, perbuatan sia-sia berlebihan.",
    hadith:
      '"Barangsiapa yang tidak meninggalkan ucapan dusta dan mengamalkannya, maka Allah tidak butuh ia meninggalkan makan dan minumnya." (HR. Bukhari no. 1903)',
  },
  {
    id: "sahur",
    letter: "F",
    title: "Sahur",
    content:
      "Hukum: Sunnah muakkad. Waktu: setelah tengah malam hingga adzan Subuh. Dianjurkan mengakhirkan sahur. Boleh makan/minum sampai adzan berkumandang.",
    hadith:
      '"Makan sahurlah kalian, karena sesungguhnya dalam sahur terdapat keberkahan." (HR. Bukhari no. 1923 & Muslim no. 1095)',
  },
  {
    id: "berbuka",
    letter: "G",
    title: "Berbuka",
    content:
      "Hukum: Wajib segera berbuka saat adzan Maghrib — menunda berbuka makruh. Sunnahnya: berbuka dengan kurma ganjil (1, 3, 5) atau air putih sebelum shalat Maghrib.",
    hadith:
      '"Manusia senantiasa dalam kebaikan selama mereka menyegerakan berbuka." (HR. Bukhari no. 1957 & Muslim no. 1098)',
  },
  {
    id: "qadha-puasa",
    letter: "H",
    title: "Qadha Puasa",
    content:
      "Wajib bagi yang meninggalkan puasa karena uzur (sakit, safar, haid, nifas). Boleh dibayar kapan saja sebelum Ramadan berikutnya. Jika tidak mampu sama sekali (sakit kronis/lansia), boleh fidyah: memberi makan 1 orang miskin per hari yang ditinggalkan.",
  },
  {
    id: "itikaf",
    letter: "I",
    title: "I'tikaf",
    content:
      "I'tikaf adalah berdiam di masjid dengan niat beribadah. Hukum: sunnah — wajib bila disertai nazar. Sunnah pada 10 malam terakhir Ramadan.\n\nSyarat i'tikaf: Islam, berakal, tamyiz (±7 tahun), niat, di masjid, suci dari junub/haid/nifas. Tidak disyaratkan harus berpuasa saat i'tikaf (pendapat yang dikuatkan Syekh Ibnu Baz).\n\nYang membatalkan i'tikaf: Keluar masjid tanpa kebutuhan mendesak, berhubungan badan, hilang akal, haid/nifas bagi wanita, murtad.\n\nYang dibolehkan saat i'tikaf: Keluar untuk kebutuhan mendesak, makan/minum/tidur di masjid (jaga kebersihan), berbicara untuk kebutuhan, menyisir rambut dan memakai wewangian.",
  },
];
