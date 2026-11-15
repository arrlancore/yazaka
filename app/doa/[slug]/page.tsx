import { Metadata } from "next";
import { notFound } from "next/navigation";
import DoaDetail from "@/components/doa/DoaDetail";
import { appLocale, appUrl, brandName } from "@/config";
import { DoaItem } from "@/types/doa";
import { getAllDoa, getDoaBySlug } from "@/lib/doa-utils";
import MobilePage from "@/components/ui/mobile-page";
import DoaDetailHeader from "@/components/doa/DoaDetailHeader";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const allDoa = await getAllDoa();
  
  return allDoa.map((doa) => ({
    slug: doa.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const doa = await getDoaBySlug(params.slug);

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

async function DoaDetailPage(props: PageProps) {
  const params = await props.params;
  const doa = await getDoaBySlug(params.slug);

  if (!doa) {
    notFound();
  }

  return (
    <MobilePage>
      <DoaDetailHeader title={doa.nama} />
      <main className="flex flex-col pb-4">
        <div className="px-4 space-y-4 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
          <DoaDetail doa={doa} />
        </div>
      </main>
    </MobilePage>
  );
}

export default DoaDetailPage;