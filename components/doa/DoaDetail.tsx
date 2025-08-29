"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Share2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DoaItem } from "@/types/doa";

interface DoaDetailProps {
  doa: DoaItem;
}

const DoaDetail: React.FC<DoaDetailProps> = ({ doa }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    const textToCopy = `${doa.nama}\n\n${doa.ar}\n\n${doa.tr}\n\n${doa.idn}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: doa.nama,
          text: doa.idn,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: copy to clipboard
      handleCopyToClipboard();
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
              <h1 className="text-lg font-bold">{doa.nama}</h1>
              <p className="text-sm text-primary-foreground/80">{doa.grup}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/20"
              onClick={() => setIsFavorited(!isFavorited)}
            >
              <Heart
                size={20}
                className={isFavorited ? "fill-current text-red-300" : ""}
              />
            </Button>
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

      {/* Content */}
      <div className="mx-4 mt-4 space-y-6">
        {/* Tags */}
        {doa.tag && doa.tag.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {doa.tag.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Arabic Text */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Teks Arab</h2>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg">
              <p
                className="text-right text-3xl leading-loose"
                dir="rtl"
                style={{ fontFamily: "'Uthmanic Hafs', Arial" }}
              >
                {doa.ar}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Transliteration */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Bacaan Latin</h2>
          </CardHeader>
          <CardContent>
            <p className="text-lg italic leading-relaxed text-muted-foreground">
              {doa.tr}
            </p>
          </CardContent>
        </Card>

        {/* Indonesian Translation */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Arti</h2>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">{doa.idn}</p>
          </CardContent>
        </Card>

        {/* Source and Reference */}
        {doa.tentang && (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Dalil & Keterangan</h2>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="leading-relaxed whitespace-pre-line">
                  {doa.tentang}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pb-8">
          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            className="flex-1"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Salin Doa
              </>
            )}
          </Button>

          <Button onClick={handleShare} variant="default" className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>
    </>
  );
};

export default DoaDetail;
