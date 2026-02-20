import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

const guides = [
  {
    id: "ramadan",
    title: "Panduan Ramadan",
    description:
      "Checklist harian, fikih puasa, dalil & doa shahih, keutamaan, dan 30 ayat pilihan untuk tadabbur.",
    emoji: "🌙",
    href: "/panduan/ramadan",
    available: true,
    badge: "Tersedia",
  },
  {
    id: "qurban",
    title: "Panduan Qurban",
    description: "Panduan lengkap ibadah qurban sesuai sunnah.",
    emoji: "🐑",
    href: "/panduan/qurban",
    available: false,
    badge: "Segera Hadir",
  },
  {
    id: "umrah",
    title: "Panduan Umrah",
    description: "Tata cara umrah, doa-doa, dan persiapan ibadah.",
    emoji: "🕌",
    href: "/panduan/umrah",
    available: false,
    badge: "Segera Hadir",
  },
  {
    id: "haji",
    title: "Panduan Haji",
    description: "Manasik haji lengkap dengan dalil dan penjelasan.",
    emoji: "🕋",
    href: "/panduan/haji",
    available: false,
    badge: "Segera Hadir",
  },
];

export default function PanduanHub() {
  const [ramadan, ...upcoming] = guides;

  return (
    <div className="px-4 py-4 space-y-4">
      {/* Featured: Ramadan */}
      <Link href={ramadan.href}>
        <Card className="border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-3xl">{ramadan.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-base">{ramadan.title}</h2>
                    <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-xs">
                      {ramadan.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {ramadan.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {[
                      "Checklist Harian",
                      "Fikih Puasa",
                      "Dalil & Doa",
                      "30 Ayat Tadabbur",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Coming soon: 2-column grid */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Segera Hadir
        </p>
        <div className="grid grid-cols-2 gap-3">
          {upcoming.map((guide) => (
            <Card
              key={guide.id}
              className="opacity-60 cursor-not-allowed border-dashed"
            >
              <CardContent className="p-4">
                <span className="text-2xl block mb-2">{guide.emoji}</span>
                <p className="font-semibold text-sm">{guide.title}</p>
                <Badge variant="outline" className="text-xs mt-2">
                  {guide.badge}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
