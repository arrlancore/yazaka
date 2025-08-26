"use client";

import { useEffect, useState, useRef } from "react";
import { TranscriptionSegment } from "@/lib/catatan-hsi/types";
import { formatTime } from "@/lib/catatan-hsi/transcription";

interface SynchronizedContentProps {
  segments: TranscriptionSegment[];
  currentTime: number;
  onSeek?: (time: number) => void;
}

export function SynchronizedContent({ segments, currentTime, onSeek }: SynchronizedContentProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize refs array when segments change
  useEffect(() => {
    segmentRefs.current = segmentRefs.current.slice(0, segments.length);
  }, [segments]);

  // Find current active segment based on audio time
  useEffect(() => {
    const activeIndex = segments.findIndex((segment, index) => {
      const nextSegment = segments[index + 1];
      return (
        currentTime >= segment.startTime &&
        (!nextSegment || currentTime < nextSegment.startTime)
      );
    });

    setCurrentSegmentIndex(activeIndex);
  }, [currentTime, segments]);

  // Auto-scroll to active segment
  useEffect(() => {
    if (currentSegmentIndex >= 0 && segmentRefs.current[currentSegmentIndex]) {
      segmentRefs.current[currentSegmentIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentSegmentIndex]);

  // Handle click to jump to time
  const jumpToTime = (time: number) => {
    onSeek?.(time);
    // Also use global seek function if available (for audio player integration)
    if ((window as any).seekAudio) {
      (window as any).seekAudio(time);
    }
  };

  if (segments.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-6">
        <p className="text-gray-500 text-center">Transkripsi tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Transkripsi Tersinkronisasi
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {segments.map((segment, index) => (
          <div
            key={index}
            ref={(el) => {
              segmentRefs.current[index] = el;
            }}
            onClick={() => jumpToTime(segment.startTime)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
              index === currentSegmentIndex
                ? "bg-emerald-100 border-l-4 border-emerald-500 text-emerald-900 font-medium shadow-md"
                : "bg-white hover:bg-gray-100 text-gray-700"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded shrink-0">
                {formatTime(segment.startTime)}
              </span>
              <p className="flex-1 leading-relaxed text-sm">
                {segment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {segments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Klik pada segmen teks mana pun untuk melompat ke bagian audio tersebut. 
            Segmen yang aktif akan otomatis di-scroll ke tampilan saat audio diputar.
          </p>
        </div>
      )}
    </div>
  );
}