"use client";

import { useState } from "react";
import { CatatanData } from "@/lib/catatan-hsi/types";
import { AudioPlayer } from "./AudioPlayer";
import { SynchronizedContent } from "./SynchronizedContent";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, User, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface CatatanPageProps {
  catatan: CatatanData;
}

export function CatatanPage({ catatan }: CatatanPageProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const { metadata, transcription } = catatan;
  
  const audioSrc = `/audio/catatan-hsi/${metadata.audioSrc}`;

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {metadata.series}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Episode {metadata.episode}/{metadata.totalEpisodes}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {metadata.level}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {metadata.title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {metadata.summary}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{metadata.ustad}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{metadata.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(metadata.publishedAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(metadata.duration / 60)} minutes</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {metadata.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Audio Player - Sticky */}
        <div className="sticky top-4 z-10">
          <AudioPlayer
            audioSrc={audioSrc}
            onTimeUpdate={handleTimeUpdate}
            onSeek={handleSeek}
          />
        </div>

        {/* Synchronized Content */}
        <SynchronizedContent
          segments={transcription}
          currentTime={currentTime}
          onSeek={handleSeek}
        />

        {/* Source Citation */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <Separator className="mb-4" />
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Source: </span>
              <Link 
                href={metadata.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
              >
                {metadata.source}
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="text-xs text-gray-500">
              Last updated: {new Date(metadata.publishedAt).toLocaleDateString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}