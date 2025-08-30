import { Metadata } from "next";
import { notFound } from "next/navigation";
import DoaGroupDetail from "@/components/doa/DoaGroupDetail";
import { appLocale, appUrl, brandName } from "@/config";
import { DoaItem, DoaGroup } from "@/types/doa";
import doaData from "@/content/doa/doa-collection.json";
import { generateGroupSlug } from "@/services/doaServices";

interface PageProps {
  params: {
    slug: string;
  };
}

// Build-time utility functions for group handling
const getDoaGroups = (): DoaGroup[] => {
  const typedData = doaData as { status: string; total: number; data: DoaItem[] };
  
  // Group doa by grup name
  const groupedDoa = typedData.data.reduce((acc, doa) => {
    if (!acc[doa.grup]) {
      acc[doa.grup] = [];
    }
    acc[doa.grup].push(doa);
    return acc;
  }, {} as Record<string, DoaItem[]>);

  // Convert to DoaGroup array
  return Object.entries(groupedDoa).map(([name, items]) => ({
    name,
    items,
    slug: generateGroupSlug(name)
  }));
};

const getGroupBySlug = (slug: string): DoaGroup | undefined => {
  const groups = getDoaGroups();
  return groups.find(group => group.slug === slug);
};

export async function generateStaticParams() {
  const groups = getDoaGroups();
  
  // Only generate params for dzikir groups (and other groups that have multiple items)
  return groups
    .filter(group => 
      group.name.toLowerCase().includes('dzikir') || 
      group.items.length > 3 // Groups with multiple doa
    )
    .map((group) => ({
      slug: group.slug,
    }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const group = getGroupBySlug(params.slug);
  
  if (!group) {
    return {
      title: "Grup doa tidak ditemukan",
    };
  }

  return {
    title: `${group.name} | Doa dan Dzikir`,
    description: `Kumpulan ${group.items.length} doa dalam grup ${group.name}. Baca secara berurutan untuk amalan yang lengkap.`,
    openGraph: {
      title: `${group.name} | Doa dan Dzikir`,
      description: `Kumpulan ${group.items.length} doa dalam grup ${group.name}. Baca secara berurutan untuk amalan yang lengkap.`,
      url: `${appUrl}/doa/grup/${params.slug}`,
      siteName: brandName,
      locale: appLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${group.name} | Doa dan Dzikir`,
      description: `Kumpulan ${group.items.length} doa dalam grup ${group.name}`,
    },
    keywords: [
      group.name,
      "dzikir",
      "doa grup",
      "amalan harian"
    ],
  };
}

async function DoaGroupDetailPage({ params }: PageProps) {
  const group = getGroupBySlug(params.slug);
  
  if (!group) {
    notFound();
  }

  return (
    <main className="max-w-2xl mx-auto mb-8 px-4 md:px-0">
      <DoaGroupDetail group={group} />
    </main>
  );
}

export default DoaGroupDetailPage;