import { useCallback, useEffect, useState } from "react";
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
  MoreVertical,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { renderTajweed } from "@/lib/renderTajweed";

interface VerseProps {
  number: number;
  arabic: string;
  transliteration: string;
  arabicTajweed?: string;
  translation?: string;
  tafsir?: string;
  audioUrl?: string;
  onBookmark?: (verseNumber: number) => void;
  onSetLastRead?: (verseNumber: number) => void;
  isBookmarked?: boolean;
  isLastRead?: boolean;
  onPlaying?: (isPlaying: boolean) => void;
  isWebKit: boolean;
}

const Verse = ({
  number,
  arabic,
  arabicTajweed,
  translation,
  transliteration,
  tafsir,
  audioUrl,
  onBookmark,
  onSetLastRead,
  onPlaying,
  isBookmarked = false,
  isLastRead = false,
  isWebKit = false,
}: VerseProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const loadAudio = useCallback(() => {
    if (audioUrl && !audio) {
      const newAudio = new Audio(audioUrl);
      newAudio.addEventListener("ended", () => {
        setIsPlaying(false);
        if (onPlaying) onPlaying(false);
      });
      setAudio(newAudio);
      return newAudio;
    }
    return audio;
  }, [audioUrl, audio, onPlaying]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", () => {
          setIsPlaying(false);
          if (onPlaying) onPlaying(false);
        });
      }
    };
  }, [audio, onPlaying]);

  const togglePlay = () => {
    const currentAudio = loadAudio();
    if (!currentAudio) return;

    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play();
    }
    setIsPlaying(!isPlaying);
    if (onPlaying) onPlaying(!isPlaying);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Ayat ${number}`,
        text: `${arabic}\n\n${translation || ""}`,
        url: window.location.href + `#${number}`,
      });
    }
  };

  const handleSetLastRead = () => {
    if (onSetLastRead) {
      onSetLastRead(number);
    }
  };

  return (
    <Card
      id={number + ""}
      className={`sm:mb-4 shadow-none sm:shadow-sm rounded-none sm:rounded backdrop-blur-sm border-0 sm:border sm:border-border relative
        ${
          number % 2 === 0
            ? "bg-slate-50/80 dark:bg-slate-800/30"
            : "bg-white/80  dark:bg-slate-900/20"
        }
        ${isLastRead ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
    >
      <CardContent className="p-3 sm:p-6">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleShare}>
                        Bagikan Ayat
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSetLastRead}>
                        Tandai Terakhir Dibaca
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>Opsi Lainnya</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Arabic Text */}
        {arabicTajweed ? (
          <div
            className="text-right text-muted-foreground mb-6 leading-loose select-none"
            style={{
              fontSize: "36px",
              lineHeight: 2,
              fontFamily: "Kitab, 'Scheherazade New', serif",
              direction: "rtl",
            }}
            dangerouslySetInnerHTML={{
              __html: renderTajweed(arabicTajweed, isWebKit),
            }}
          />
        ) : (
          <p
            className="text-right text-muted-foreground mb-6 leading-loose select-none"
            style={{
              fontSize: "36px",
              fontFamily: "'Uthmanic Hafs', 'Scheherazade New', serif",
              lineHeight: 2,
              direction: "rtl",
            }}
          >
            {arabic}
          </p>
        )}

        {/* Transliteration */}
        {transliteration && (
          <p className="text-sm text-muted-foreground/70 italic mb-2 leading-relaxed">
            {transliteration}
          </p>
        )}
        {/* Translation */}
        {translation && (
          <p className="text-muted-foreground leading-relaxed pt-4">
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
          <div className="absolute -top-3 left-4 bg-primary text-primary-foreground text-xs text-[10px] px-2 py-1 rounded-full">
            Terakhir Dibaca
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Verse;
