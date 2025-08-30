import TargetHafalanDetail from "@/components/TargetHafalanDetail";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TargetDetailPage({ params }: PageProps) {
  const targetId = params.id;

  return (
    <>
      <MobilePage>
        <HeaderMobilePage
          title="Detail Target"
          backUrl="/hafalan-quran/targets"
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
            <TargetHafalanDetail targetId={targetId} />
          </div>
        </main>
      </MobilePage>
    </>
  );
}
