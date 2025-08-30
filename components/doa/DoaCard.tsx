"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Book, Share2, Copy, Check } from "lucide-react";
import { DoaItem } from "@/types/doa";

interface DoaCardProps {
  index: number;
  doa: DoaItem;
}

const DoaCard: React.FC<DoaCardProps> = ({ index, doa }) => {
  const [showSource, setShowSource] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `${doa.nama}\n\n${doa.ar}\n\n${doa.tr}\n\n${doa.idn}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: doa.nama,
          text: `${doa.ar}\n\n${doa.idn}`,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <Card
      className={`sm:mb-4 shadow-none sm:shadow-sm rounded-none sm:rounded border-0 sm:border sm:border-border relative bg-white/80 dark:bg-slate-900/20`}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-lg font-bold min-w-[40px] justify-center">
              {index}
            </Badge>
            <div>
              <h2 className="text-xl font-bold leading-tight">{doa.nama}</h2>
              {doa.tag?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {doa.tag.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Arabic */}
        <p
          className="text-right text-foreground/80 mb-6 leading-loose select-none"
          style={{
            fontSize: "32px",
            fontFamily: "var(--font-scheherazade), var(--font-noto-naskh), 'Uthmanic Hafs', serif",
            lineHeight: 2,
            direction: "rtl",
          }}
        >
          {doa.ar}
        </p>

        {/* Latin transliteration */}
        {doa.tr && (
          <p className="text-sm text-muted-foreground/70 italic mb-2 leading-relaxed">
            {doa.tr}
          </p>
        )}

        {/* Indonesian translation */}
        {doa.idn && (
          <p className="text-muted-foreground leading-relaxed pt-4">
            {doa.idn}
          </p>
        )}

        {/* Source / Dalil collapsible */}
        {doa.tentang && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between text-muted-foreground"
              onClick={() => setShowSource(!showSource)}
            >
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Dalil & Keterangan</span>
              </div>
              {showSource ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {showSource && (
              <div className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                {doa.tentang}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoaCard;
