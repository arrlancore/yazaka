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
  duration: number;
  location: string;
  series: string;
  episode: number;
  totalEpisodes: number;
  tags: string[];
  level: string;
  source: string;
}

export interface CatatanData {
  slug: string;
  metadata: CatatanMetadata;
  content: string;
  transcription: TranscriptionSegment[];
}