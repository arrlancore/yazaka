"use client";

import { useState } from "react";
import {
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 *
 * @param title - The title of the shared content. e.g Cara menghemat listrik
 * @param description - The description of the shared content. e.g Bagikan artikel ini jika Anda merasa terbantu
 * @returns
 */
export default function ShareButtons({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [hasShared, setHasShared] = useState(false);
  const [showThanksBadge, setShowThanksBadge] = useState(false);

  const shareToSocial = (platform: string) => {
    try {
      if (!hasShared) {
        setHasShared(true);
        setShowThanksBadge(true);
        setTimeout(() => setShowThanksBadge(false), 3000);
      }

      const url = window.location.href;
      const shareText = `Bagaimana pandangan Anda tentang: ${title}? Sepertinya menarik.\n`;

      const shareLinks: any = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + "\n\n" + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      };

      const shareWindow = window.open(
        shareLinks[platform],
        "_blank",
        "noopener,noreferrer"
      );
      if (shareWindow) shareWindow.opener = null;
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopiedToast(true);
      if (!hasShared) {
        setHasShared(true);
        setShowThanksBadge(true);
        setTimeout(() => setShowThanksBadge(false), 3000);
      }
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      {/* Floating Thank You Badge */}
      {showThanksBadge && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className="bg-gradient-to-r from-primary/80 to-primary text-primary-foreground 
                        px-6 py-3 rounded-full shadow-lg animate-in fade-in slide-in-from-top-4
                        flex items-center gap-2"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Terima kasih telah berbagi! ✨</span>
          </div>
        </div>
      )}

      {/* Main Share Container */}
      <Card className="shadow-lg mt-8 max-w-screen-md mx-auto w-full">
        <CardContent className="p-4 space-y-4">
          {/* Share Message */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {/* Primary Share Button - WhatsApp */}
          <Button
            onClick={() => shareToSocial("whatsapp")}
            className={`w-full bg-green-500 hover:bg-green-600 text-white
                      transition-all duration-200 group`}
          >
            <MessageCircle
              className="mr-2 h-5 w-5 
                                  group-hover:animate-bounce"
            />
            <span>Bagikan via WhatsApp</span>
          </Button>

          {/* Secondary Share Options */}
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                name: "facebook",
                icon: Facebook,
                className: "bg-blue-600 hover:bg-blue-700",
                action: () => shareToSocial("facebook"),
              },
              {
                name: "twitter",
                icon: Twitter,
                className: "bg-sky-500 hover:bg-sky-600",
                action: () => shareToSocial("twitter"),
              },
              {
                name: "linkedin",
                icon: Linkedin,
                className: "bg-blue-700 hover:bg-blue-800",
                action: () => shareToSocial("linkedin"),
              },
              {
                name: "copy",
                icon: showCopiedToast ? Check : Copy,
                className: "bg-gray-600 hover:bg-gray-700",
                action: copyToClipboard,
              },
            ].map((btn) => (
              <Button
                key={btn.name}
                onClick={btn.action}
                variant="ghost"
                className={`${btn.className} p-3 h-auto
                          transition-all duration-200 
                          hover:scale-105 active:scale-95
                          text-white`}
                aria-label={`Share on ${btn.name}`}
              >
                <btn.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
