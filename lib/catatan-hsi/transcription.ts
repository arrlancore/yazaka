import { TranscriptionSegment } from './types';

export function parseTranscription(text: string): TranscriptionSegment[] {
  const regex = /\((\d+):(\d+)\)\s*([\s\S]*?)(?=\(\d+:\d+\)|$)/g;
  const segments: TranscriptionSegment[] = [];
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
}

export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}