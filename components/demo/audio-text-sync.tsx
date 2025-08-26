import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Upload, FileText, Volume2 } from "lucide-react";

const AudioTextPlayer = () => {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [textData, setTextData] = useState<Array<{startTime: number; text: string}>>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  // Parse text with timestamps
  const parseTimestampText = (text: string) => {
    const regex = /\((\d+):(\d+)\)\s*([^(]*?)(?=\(\d+:\d+\)|$)/g;
    const segments = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const timeInSeconds = minutes * 60 + seconds;
      const content = match[3].trim();

      if (content) {
        segments.push({
          startTime: timeInSeconds,
          text: content,
        });
      }
    }

    return segments.sort((a, b) => a.startTime - b.startTime);
  };

  // Handle audio file upload
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      const url = URL.createObjectURL(file);
      setAudioFile(url);

      // Reset state
      setIsPlaying(false);
      setCurrentTime(0);
      setCurrentSegmentIndex(-1);
    }
  };

  // Handle text file upload
  const handleTextUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        const parsedData = parseTimestampText(text);
        setTextData(parsedData);
        setCurrentSegmentIndex(-1);
      };
      reader.readAsText(file);
    }
  };

  // Update current time and find active segment
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const interval = setInterval(() => {
        const time = audioRef.current!.currentTime;
        setCurrentTime(time);

        // Find current segment
        const activeIndex = textData.findIndex((segment, index) => {
          const nextSegment = textData[index + 1];
          return (
            time >= segment.startTime &&
            (!nextSegment || time < nextSegment.startTime)
          );
        });

        setCurrentSegmentIndex(activeIndex);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isPlaying, textData]);

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio events
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentSegmentIndex(-1);
  };

  // Seek to specific time
  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Click on text segment to jump to that time
  const jumpToTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Audio Text Synchronized Player
          </h1>

          {/* Upload Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Upload Audio File
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Choose Audio File
                </button>
                {audioFile && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Audio file loaded
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Text File
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleTextUpload}
                  ref={textInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => textInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Choose Text File
                </button>
                {textData.length > 0 && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Text file loaded ({textData.length} segments)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {audioFile && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <audio
                ref={audioRef}
                src={audioFile}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                className="hidden"
              />

              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={togglePlayPause}
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>

                <div className="flex-1">
                  <div
                    className="w-full h-2 bg-gray-300 rounded-full cursor-pointer overflow-hidden"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-blue-500 transition-all duration-100"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text Display */}
          {textData.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Synchronized Text
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {textData.map((segment, index) => (
                  <div
                    key={index}
                    onClick={() => jumpToTime(segment.startTime)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      index === currentSegmentIndex
                        ? "bg-blue-100 border-l-4 border-blue-500 text-blue-900 font-medium shadow-md"
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded">
                        {formatTime(segment.startTime)}
                      </span>
                      <p className="flex-1 leading-relaxed">{segment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {(!audioFile || textData.length === 0) && (
            <div className="text-center text-gray-600 mt-8">
              <p className="mb-2">
                Please upload both an audio file and a text file to get started.
              </p>
              <p className="text-sm">
                Text format: (0:02) Your text here (0:06) Next segment...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioTextPlayer;
