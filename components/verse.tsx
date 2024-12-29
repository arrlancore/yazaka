import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Bookmark,
  BookmarkCheck,
  Book,
  Share2,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";

interface VerseProps {
  number: number;
  arabic: string;
  translation?: string;
  tafsir?: string;
  audioUrl?: string;
  onBookmark?: (verseNumber: number) => void;
  onSetLastRead?: (verseNumber: number) => void;
  isBookmarked?: boolean;
  isLastRead?: boolean;
}

const Verse = ({
  number,
  arabic,
  translation,
  tafsir,
  audioUrl,
  onBookmark,
  onSetLastRead,
  isBookmarked = false,
  isLastRead = false,
}: VerseProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [audio] = useState(audioUrl ? new Audio(audioUrl) : null);

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ayat ${number}`,
        text: `${arabic}\n\n${translation || ""}`,
        url: window.location.href,
      });
    }
  };

  return (
    <Card
      className={`mb-4 bg-white/80 dark:bg-[#2A2A2A] backdrop-blur-sm border-border relative
        ${isLastRead ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
    >
      <CardContent className="p-6">
        {/* Verse Header */}
        <div className="flex justify-between items-center mb-6">
          {/* Verse Number */}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
            {number}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              {audioUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPlaying ? "Pause Audio" : "Play Audio"}
                  </TooltipContent>
                </Tooltip>
              )}

              {onBookmark && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => onBookmark(number)}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bagikan Ayat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Arabic Text */}
        <p
          className="text-right mb-6 leading-loose select-none"
          style={{
            fontSize: "32px",
            fontFamily: "'Uthmanic Hafs', 'Scheherazade New', serif",
            lineHeight: 2,
          }}
        >
          {arabic}
        </p>

        {/* Translation */}
        {translation && (
          <p className="text-muted-foreground leading-relaxed pt-4 border-t border-border">
            {translation}
          </p>
        )}

        {/* Tafsir Section */}
        {tafsir && (
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-between text-muted-foreground"
              onClick={() => setShowTafsir(!showTafsir)}
            >
              <div className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                <span>Tafsir</span>
              </div>
              {showTafsir ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showTafsir && (
              <div className="mt-4 text-sm text-muted-foreground">{tafsir}</div>
            )}
          </div>
        )}

        {/* Last Read Indicator */}
        {isLastRead && (
          <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            Last Read
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Verse;
