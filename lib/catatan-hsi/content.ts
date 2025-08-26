import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { CatatanData, CatatanMetadata } from './types';
import { parseTranscription } from './transcription';
import components from '@/lib/mdx/mdx-components';

const catatanDirectory = join(process.cwd(), 'content/catatan-hsi');

export function getAllCatatanSlugs(): string[] {
  try {
    return readdirSync(catatanDirectory);
  } catch {
    return [];
  }
}

export async function getCatatanBySlug(slug: string): Promise<CatatanData | null> {
  try {
    const fullPath = join(catatanDirectory, slug, 'index.mdx');
    const transcriptionPath = join(catatanDirectory, slug, 'transcription.txt');
    
    const fileContents = readFileSync(fullPath, 'utf8');
    const { data: metadata, content: rawContent } = matter(fileContents);
    
    let transcriptionText = '';
    try {
      transcriptionText = readFileSync(transcriptionPath, 'utf8');
    } catch {
      console.warn(`Transcription file not found for ${slug}`);
    }

    const transcription = transcriptionText ? parseTranscription(transcriptionText) : [];
    
    const mdxContent = await MDXRemote({
      source: rawContent,
      components: components,
    });

    return {
      slug,
      metadata: metadata as CatatanMetadata,
      content: mdxContent,
      transcription,
    };
  } catch (error) {
    console.error(`Error loading catatan ${slug}:`, error);
    return null;
  }
}

export async function getAllCatatan(): Promise<CatatanData[]> {
  const slugs = getAllCatatanSlugs();
  const catatanPromises = slugs.map(slug => getCatatanBySlug(slug));
  const catatanResults = await Promise.all(catatanPromises);
  
  return catatanResults
    .filter((catatan): catatan is CatatanData => catatan !== null)
    .sort((a, b) => {
      // Sort by series and episode
      if (a.metadata.series === b.metadata.series) {
        return a.metadata.episode - b.metadata.episode;
      }
      return a.metadata.series.localeCompare(b.metadata.series);
    });
}