// scripts/generate-sitemap-index.ts
import { writeFile } from "fs/promises";
import path from "path";
import prettier from "prettier";

const domain = "https://bekhair.org";

async function generateSitemapIndex() {
  try {
    console.log("🚀 Generating sitemap index...");

    const currentDate = new Date().toISOString();

    const sitemapIndex = `
      <?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
          <loc>${domain}/sitemap.xml</loc>
          <lastmod>${currentDate}</lastmod>
        </sitemap>
        <sitemap>
          <loc>${domain}/all-ayat-sitemap.xml</loc>
          <lastmod>${currentDate}</lastmod>
        </sitemap>
      </sitemapindex>
    `;

    const formatted = await prettier.format(sitemapIndex, {
      parser: "html",
    });

    // Write the sitemap index
    await writeFile(
      path.join(process.cwd(), "public", "sitemap-index.xml"),
      formatted
    );

    console.log("✅ Sitemap index generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    process.exit(1);
  }
}

generateSitemapIndex();
