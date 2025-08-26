import { ReactElement } from 'react';

export interface TranscriptionSegment {
  startTime: number;
  text: string;
}

export interface CatatanMetadata {
  title: string;
  ustad: string;
  publishedAt: string;
  summary: string;
  audioSrc: string;
  transcriptionSrc: string;
  series: string;
  episode: number;
  totalEpisodes: number;
  tags: string[];
  source: string;
}

export interface CatatanData {
  slug: string;
  metadata: CatatanMetadata;
  content: ReactElement;
  transcription: TranscriptionSegment[];
}