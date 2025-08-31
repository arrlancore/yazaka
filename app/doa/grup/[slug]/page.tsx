import { Metadata } from "next";
import { notFound } from "next/navigation";
import DoaGroupDetail from "@/components/doa/DoaGroupDetail";
import { appLocale, appUrl, brandName } from "@/config";
import { DoaItem, DoaGroup } from "@/types/doa";
import { getAllGroups, generateGroupSlug } from "@/lib/doa-utils";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PageProps {
  params: {
    slug: string;
  };
}

const getGroupBySlug = async (slug: string): Promise<DoaGroup | undefined> => {
  const groups = await getAllGroups();
  return groups.find(group => group.slug === slug);
};

export async function generateStaticParams() {
  const groups = await getAllGroups();
  
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
  const group = await getGroupBySlug(params.slug);
  
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
  const group = await getGroupBySlug(params.slug);
  
  if (!group) {
    notFound();
  }

  return (
    <MobilePage>
      <HeaderMobilePage
        title={group.name}
        backUrl="/doa"
        rightContent={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/20"
          >
            <Search size={20} />
          </Button>
        }
      />
      <main className="flex flex-col pb-4">
        <div className="px-4 space-y-4 sm:container sm:px-0 sm:max-w-2xl sm:mx-auto">
          <DoaGroupDetail group={group} />
        </div>
      </main>
    </MobilePage>
  );
}

export default DoaGroupDetailPage;