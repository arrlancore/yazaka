"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { formatTime } from "@/lib/catatan-hsi/transcription";

interface AudioPlayerProps {
  audioSrc: string;
  onTimeUpdate?: (currentTime: number) => void;
  onSeek?: (time: number) => void;
}

export function AudioPlayer({ audioSrc, onTimeUpdate, onSeek }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleError = () => {
    setError("Audio failed to load");
    setIsLoading(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current || error) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle seek
  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(duration, percent * duration));

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  // External seek (for text clicks)
  useEffect(() => {
    const handleExternalSeek = (time: number) => {
      if (audioRef.current && time <= duration) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    // Expose seek function
    if (onSeek) {
      (window as any).seekAudio = handleExternalSeek;
    }

    return () => {
      if ((window as any).seekAudio) {
        delete (window as any).seekAudio;
      }
    };
  }, [duration, onSeek]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-red-600 text-sm">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        onCanPlay={handleCanPlay}
        preload="metadata"
        className="hidden"
      />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlayPause}
          disabled={isLoading || !!error}
          className="flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>

        <div className="flex-1">
          <div
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-emerald-500 transition-all duration-100"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}