"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Copy, Check, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DoaGroup } from "@/types/doa";
import DoaCard from "@/components/doa/DoaCard";
import { isGroupFavorite, toggleFavoriteGroup } from "@/services/doaServices";

interface DoaGroupDetailProps {
  group: DoaGroup;
}

const DoaGroupDetail: React.FC<DoaGroupDetailProps> = ({ group }) => {
  const [copied, setCopied] = useState(false);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isGroupFavorite(group.slug));
  }, [group.slug]);

  const handleCopyAllDoa = async () => {
    const allDoaText = group.items.map((doa, index) => 
      `${index + 1}. ${doa.nama}\n\n${doa.ar}\n\n${doa.tr}\n\n${doa.idn}\n\n---\n`
    ).join('\n');
    
    try {
      await navigator.clipboard.writeText(allDoaText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: group.name,
          text: `Kumpulan ${group.items.length} doa dalam ${group.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopyAllDoa();
    }
  };

  return (
    <>
      {/* Header */}
      <div
        className={cn(
          "sticky top-0 z-10 bg-gradient-to-r from-primary to-primary-light text-primary-foreground",
          "transition-all duration-300 px-4 py-3 shadow-md sm:rounded-t-[2rem]"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/doa">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-white/20"
              >
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold">{group.name}</h1>
              <p className="text-sm text-primary-foreground/80">
                {group.items.length} doa untuk dibaca berurutan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
              onClick={handleShare}
            >
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content - All Doa in Single Page */}
      <div className="mx-4 mt-4 space-y-8">
        {/* Introduction */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-sm">
                  {group.items.length} Doa
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Baca secara berurutan dari atas ke bawah
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label={fav ? "Hapus grup dari favorit" : "Tambah grup ke favorit"}
                onClick={() => {
                  const res = toggleFavoriteGroup(group.slug);
                  setFav(res);
                }}
              >
                <Heart className={`h-5 w-5 ${fav ? 'text-red-500 fill-red-500' : ''}`} />
              </Button>
            </div>
            <p className="text-muted-foreground">
              {group.name.toLowerCase().includes('pagi') 
                ? 'Bacaan dzikir yang dianjurkan dibaca setelah shalat Subuh hingga matahari terbit.'
                : group.name.toLowerCase().includes('petang')
                ? 'Bacaan dzikir yang dianjurkan dibaca setelah shalat Ashar hingga Maghrib.'
                : 'Kumpulan doa yang dianjurkan untuk dibaca secara berurutan.'
              }
            </p>
          </CardContent>
        </Card>

        {/* All Doa Items */}
        {group.items.map((doa, index) => (
          <DoaCard key={doa.id} index={index + 1} doa={doa} />
        ))}

        {/* Copy All Button */}
        <div className="pb-8">
          <Button 
            onClick={handleCopyAllDoa}
            variant="outline"
            className="w-full py-3"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Semua Doa Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Salin Semua Doa
              </>
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default DoaGroupDetail;