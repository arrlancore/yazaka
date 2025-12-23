import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import MobilePage from "@/components/ui/mobile-page";
import HeaderMobilePage from "@/components/ui/header-mobile-page";

export default function AyatLoading() {
  return (
    <MobilePage>
      <HeaderMobilePage
        title="Memuat..."
        subtitle="Mohon tunggu"
        backUrl="/quran"
      />
      <Card className="border-none sm:border transition-all duration-300 bg-gradient-to-br from-primary/10 via-background to-primary/10 shadow-none sm:shadow-lg text-foreground rounded-b-[2rem] p-0">
        <CardContent className="p-0">
          {/* Surah Info Header */}
          <div className="bg-primary/5 p-4 text-center border-b space-y-2">
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>

          {/* Verse Content */}
          <div className="bg-background p-4 space-y-4">
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                {/* Verse Header */}
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>

                {/* Arabic Text */}
                <Skeleton className="h-24 w-full" />

                {/* Transliteration */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                {/* Translation */}
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>

            {/* Meta Information */}
            <div className="p-3 bg-primary/10 rounded flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-card p-4 flex justify-between items-center">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </MobilePage>
  );
}
