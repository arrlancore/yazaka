"use client";

import { useState, useEffect, ReactElement } from "react";
import { TranscriptionSegment } from "@/lib/catatan-hsi/types";
import { SynchronizedContent } from "./SynchronizedContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Volume2 } from "lucide-react";

interface CatatanContentTabsProps {
  content: ReactElement;
  transcription: TranscriptionSegment[];
  currentTime: number;
  onSeek?: (time: number) => void;
  isPlaying?: boolean;
}

export function CatatanContentTabs({ 
  content, 
  transcription, 
  currentTime, 
  onSeek,
  isPlaying 
}: CatatanContentTabsProps) {
  const [activeTab, setActiveTab] = useState("content");

  // Auto-switch to transcription when audio starts playing
  useEffect(() => {
    if (isPlaying && activeTab === "content") {
      setActiveTab("transcription");
    }
  }, [isPlaying, activeTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="content" className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Konten
        </TabsTrigger>
        <TabsTrigger value="transcription" className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Transkripsi
          {isPlaying && (
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="content" className="mt-0">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <article className="prose prose-gray max-w-none">
            {content}
          </article>
        </div>
      </TabsContent>

      <TabsContent value="transcription" className="mt-0">
        <SynchronizedContent
          segments={transcription}
          currentTime={currentTime}
          onSeek={onSeek}
        />
      </TabsContent>
    </Tabs>
  );
}