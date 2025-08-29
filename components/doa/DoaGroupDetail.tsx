"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DoaGroup } from "@/types/doa";

interface DoaGroupDetailProps {
  group: DoaGroup;
}

const DoaGroupDetail: React.FC<DoaGroupDetailProps> = ({ group }) => {
  const [copied, setCopied] = useState(false);

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
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="default" className="text-sm">
                {group.items.length} Doa
              </Badge>
              <span className="text-sm text-muted-foreground">
                Baca secara berurutan dari atas ke bawah
              </span>
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
          <Card key={doa.id} className="border-l-4 border-l-muted">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-lg font-bold min-w-[40px] justify-center">
                      {index + 1}
                    </Badge>
                    <h2 className="text-xl font-bold">{doa.nama}</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {doa.tag.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Arabic Text */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p 
                  className="text-right text-3xl leading-loose" 
                  dir="rtl"
                  style={{ fontFamily: "'Uthmanic Hafs', Arial" }}
                >
                  {doa.ar}
                </p>
              </div>

              {/* Transliteration */}
              <div className="p-4 border rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Bacaan Latin:</h4>
                <p className="text-lg italic leading-relaxed">
                  {doa.tr}
                </p>
              </div>

              {/* Indonesian Translation */}
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Artinya:</h4>
                <p className="text-lg leading-relaxed">
                  {doa.idn}
                </p>
              </div>

              {/* Source and Reference */}
              {doa.tentang && (
                <details className="p-4 border rounded-lg">
                  <summary className="cursor-pointer font-semibold text-sm text-muted-foreground hover:text-foreground">
                    Dalil & Keterangan
                  </summary>
                  <div className="mt-3 prose prose-sm dark:prose-invert max-w-none">
                    <p className="leading-relaxed whitespace-pre-line text-sm">
                      {doa.tentang}
                    </p>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
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