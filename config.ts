export const brand = {
  title: "Bekhair",
  domain: "",
};
export const brandName = `${brand.title}${brand.domain}`;

// app
export const appVersion = "1.1.3";
export const appSlogan = "Jangan Tunda Berbuat Baik";
export const appTitle = `${appSlogan} | ${brandName}`;
export const appDescription =
  "Aplikasi yang memadukan spiritualitas Islam dengan produktivitas modern. Jadilah Muslim yang sukses di dunia dan akhirat dengan bantuan fitur-fitur kami yang praktis.";
export const appUrl = "https://bekhair.org";
export const appLocale = "id_ID";

// blog
export const blogTitle = "Blog";
export const blogDescription = `Latest news, insights, and tutorials from the ${brand.title}.${brand.domain} team.`;
export const blogUrl = appUrl + "blog";
export const defaultAuthor = "Tim Redaksi";

export const URLS = {
  // Build-time only (static export). Override with the QURAN_API_URL env var
  // when running `npm run build`; defaults to the production Quran API Worker.
  get quranApi() {
    return (
      process.env.QURAN_API_URL || "https://quran-api.arrlancore.workers.dev"
    ).replace(/\/+$/, "");
  },
};

// Analytics
export const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID;
