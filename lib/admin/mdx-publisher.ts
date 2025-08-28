import fs from 'fs/promises';
import path from 'path';
import type { Database } from '@/integrations/supabase/types';

type CatatanHSI = Database['public']['Tables']['catatan_hsi']['Row'];

interface MDXFrontmatter {
  title: string;
  slug: string;
  publishedAt: string;
  ustad: string;
  series: string;
  episode: number;
  totalEpisodes: number;
  summary: string;
  tags: string[];
  source: string;
  audioSrc?: string;
  status: 'published';
}

export async function publishToMDX(content: CatatanHSI): Promise<void> {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'catatan-hsi');
    
    // Ensure content directory exists
    try {
      await fs.access(contentDir);
    } catch {
      await fs.mkdir(contentDir, { recursive: true });
    }

    // Create MDX frontmatter
    const frontmatter: MDXFrontmatter = {
      title: content.title,
      slug: content.slug,
      publishedAt: content.published_at,
      ustad: content.ustad,
      series: content.series,
      episode: content.episode,
      totalEpisodes: content.total_episodes,
      summary: content.summary,
      tags: content.tags,
      source: content.source,
      audioSrc: content.audio_src || undefined,
      status: 'published'
    };

    // Generate MDX content
    const mdxContent = generateMDXContent(frontmatter, content.content || content.transcription);

    // Write to file
    const filename = `${content.slug}.mdx`;
    const filepath = path.join(contentDir, filename);
    
    await fs.writeFile(filepath, mdxContent, 'utf-8');
    
    console.log(`Successfully published MDX file: ${filepath}`);
  } catch (error) {
    console.error('Error publishing to MDX:', error);
    throw new Error(`Failed to publish MDX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateMDXContent(frontmatter: MDXFrontmatter, content: string): string {
  // Convert frontmatter to YAML
  const frontmatterYaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(item => `  - "${item}"`).join('\n')}`;
      } else if (typeof value === 'string') {
        return `${key}: "${value}"`;
      } else {
        return `${key}: ${value}`;
      }
    })
    .join('\n');

  return `---
${frontmatterYaml}
---

${content}
`;
}

export async function unpublishMDX(slug: string): Promise<void> {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'catatan-hsi');
    const filename = `${slug}.mdx`;
    const filepath = path.join(contentDir, filename);
    
    try {
      await fs.unlink(filepath);
      console.log(`Successfully unpublished MDX file: ${filepath}`);
    } catch (error) {
      // File might not exist, which is fine
      console.log(`MDX file not found or already deleted: ${filepath}`);
    }
  } catch (error) {
    console.error('Error unpublishing MDX:', error);
    throw new Error(`Failed to unpublish MDX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getAllMDXFiles(): Promise<string[]> {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'catatan-hsi');
    
    try {
      const files = await fs.readdir(contentDir);
      return files.filter(file => file.endsWith('.mdx'));
    } catch {
      // Directory doesn't exist yet
      return [];
    }
  } catch (error) {
    console.error('Error reading MDX files:', error);
    return [];
  }
}

export async function syncMDXFiles(allContent: CatatanHSI[]): Promise<void> {
  try {
    const existingFiles = await getAllMDXFiles();
    const publishedContent = allContent.filter(item => item.status === 'published');
    
    // Files that should exist
    const expectedFiles = publishedContent.map(item => `${item.slug}.mdx`);
    
    // Remove files for unpublished content
    const filesToRemove = existingFiles.filter(file => !expectedFiles.includes(file));
    for (const file of filesToRemove) {
      const slug = file.replace('.mdx', '');
      await unpublishMDX(slug);
    }
    
    // Create/update files for published content
    for (const content of publishedContent) {
      await publishToMDX(content);
    }
    
    console.log(`Synced ${publishedContent.length} MDX files`);
  } catch (error) {
    console.error('Error syncing MDX files:', error);
    throw error;
  }
}