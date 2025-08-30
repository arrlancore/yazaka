import { Metadata } from "next";
import { notFound } from "next/navigation";
import DoaDetail from "@/components/doa/DoaDetail";
import { appLocale, appUrl, brandName } from "@/config";
import { DoaItem } from "@/types/doa";
// Import JSON directly for build-time access
import doaData from "@/content/doa/doa-collection.json";

interface PageProps {
  params: {
    slug: string;
  };
}

// Utility functions for build-time use
const generateDoaSlugBuildTime = (doa: DoaItem): string => {
  return doa.nama
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const getDoaBySlugBuildTime = (slug: string): DoaItem | undefined => {
  const typedData = doaData as { status: string; total: number; data: DoaItem[] };
  return typedData.data.find(doa => generateDoaSlugBuildTime(doa) === slug);
};

export async function generateStaticParams() {
  const typedData = doaData as { status: string; total: number; data: DoaItem[] };
  
  return typedData.data.map((doa) => ({
    slug: generateDoaSlugBuildTime(doa),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const doa = getDoaBySlugBuildTime(params.slug);
  
  if (!doa) {
    return {
      title: "Doa tidak ditemukan",
    };
  }

  return {
    title: `${doa.nama} | Doa dan Dzikir`,
    description: `${doa.nama} - ${doa.idn.substring(0, 150)}...`,
    openGraph: {
      title: `${doa.nama} | Doa dan Dzikir`,
      description: `${doa.nama} - ${doa.idn.substring(0, 150)}...`,
      url: `${appUrl}/doa/${params.slug}`,
      siteName: brandName,
      locale: appLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${doa.nama} | Doa dan Dzikir`,
      description: `${doa.nama} - ${doa.idn.substring(0, 150)}...`,
    },
    keywords: [
      doa.nama,
      ...doa.tag,
      "doa islam",
      "dzikir",
      "doa harian"
    ],
  };
}

async function DoaDetailPage({ params }: PageProps) {
  const doa = getDoaBySlugBuildTime(params.slug);
  
  if (!doa) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto mb-8 px-4 md:px-0">
      <DoaDetail doa={doa} />
    </main>
  );
}

export default DoaDetailPage;