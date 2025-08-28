import { supabase } from '@/integrations/supabase/client'
import type { Database } from '@/integrations/supabase/types'
import fs from 'fs/promises'
import path from 'path'

type CatatanHSI = Database['public']['Tables']['catatan_hsi']['Row']

/**
 * Generate MDX frontmatter from database record
 */
export function generateMDXFrontmatter(record: CatatanHSI): string {
  const frontmatter = {
    title: `"${record.title}"`,
    ustad: `"${record.ustad}"`,
    publishedAt: `"${record.published_at}"`,
    summary: `"${record.summary}"`,
    audioSrc: record.audio_src ? `"${record.audio_src}"` : null,
    transcriptionSrc: `"transcription.txt"`,
    series: `"${record.series}"`,
    episode: record.episode,
    totalEpisodes: record.total_episodes,
    tags: `[${record.tags.map(tag => `"${tag}"`).join(', ')}]`,
    source: `"${record.source}"`
  }

  const frontmatterLines = Object.entries(frontmatter)
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => `${key}: ${value}`)

  return `---\n${frontmatterLines.join('\n')}\n---`
}

/**
 * Generate complete MDX file content
 */
export function generateMDXContent(record: CatatanHSI): string {
  const frontmatter = generateMDXFrontmatter(record)
  const content = record.content || record.transcription
  
  return `${frontmatter}\n\n${content}`
}

/**
 * Create directory structure and write MDX files
 */
export async function publishToMDX(record: CatatanHSI): Promise<void> {
  const contentDir = path.join(process.cwd(), 'content', 'catatan-hsi')
  const episodeDir = path.join(contentDir, record.slug)
  
  // Create directory if it doesn't exist
  await fs.mkdir(episodeDir, { recursive: true })
  
  // Write MDX file
  const mdxContent = generateMDXContent(record)
  await fs.writeFile(path.join(episodeDir, 'index.mdx'), mdxContent, 'utf-8')
  
  // Write transcription file
  await fs.writeFile(
    path.join(episodeDir, 'transcription.txt'), 
    record.transcription, 
    'utf-8'
  )
  
  console.log(`✅ Published ${record.slug} to MDX`)
}

/**
 * Update database record status after successful publishing
 */
export async function updatePublishStatus(id: string): Promise<void> {
  const { error } = await supabase
    .from('catatan_hsi')
    .update({ 
      status: 'published',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
  
  if (error) {
    throw new Error(`Failed to update status: ${error.message}`)
  }
}

/**
 * Complete publish workflow: MDX generation + status update
 */
export async function publishCatatanHSI(id: string): Promise<void> {
  // Get record from database
  const { data: record, error } = await supabase
    .from('catatan_hsi')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !record) {
    throw new Error(`Failed to fetch record: ${error?.message}`)
  }
  
  // Generate and write MDX files
  await publishToMDX(record)
  
  // Update status to published
  await updatePublishStatus(id)
}

/**
 * Generate slug from title and episode info
 */
export function generateSlug(series: string, episode: number): string {
  const seriesSlug = series.toLowerCase().replace(/\s+/g, '-')
  const episodeStr = episode.toString().padStart(2, '0')
  return `${seriesSlug}-halaqah-${episodeStr}`
}

/**
 * Import existing MDX file to database (for migration)
 */
export async function importMDXToDatabase(slug: string, createdBy: string): Promise<void> {
  const mdxPath = path.join(process.cwd(), 'content', 'catatan-hsi', slug, 'index.mdx')
  const transcriptionPath = path.join(process.cwd(), 'content', 'catatan-hsi', slug, 'transcription.txt')
  
  try {
    const mdxContent = await fs.readFile(mdxPath, 'utf-8')
    const transcription = await fs.readFile(transcriptionPath, 'utf-8')
    
    // Parse frontmatter (simple implementation)
    const frontmatterMatch = mdxContent.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/)
    if (!frontmatterMatch) {
      throw new Error('Invalid MDX format')
    }
    
    const frontmatterStr = frontmatterMatch[1]
    const content = frontmatterMatch[2].trim()
    
    // Parse frontmatter fields
    const frontmatter: Record<string, any> = {}
    frontmatterStr.split('\n').forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/)
      if (match) {
        const [, key, value] = match
        // Remove quotes and parse arrays
        if (value.startsWith('[') && value.endsWith(']')) {
          frontmatter[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, ''))
        } else {
          frontmatter[key] = value.replace(/"/g, '')
        }
      }
    })
    
    // Insert into database
    const { error } = await supabase
      .from('catatan_hsi')
      .insert({
        title: frontmatter.title,
        slug,
        transcription,
        content,
        ustad: frontmatter.ustad,
        published_at: frontmatter.publishedAt,
        summary: frontmatter.summary,
        audio_src: frontmatter.audioSrc,
        series: frontmatter.series,
        episode: parseInt(frontmatter.episode),
        total_episodes: parseInt(frontmatter.totalEpisodes),
        tags: frontmatter.tags || [],
        source: frontmatter.source || 'https://edu.hsi.id',
        status: 'published',
        created_by: createdBy
      })
    
    if (error) {
      throw new Error(`Failed to import ${slug}: ${error.message}`)
    }
    
    console.log(`✅ Imported ${slug} to database`)
    
  } catch (error) {
    console.error(`❌ Failed to import ${slug}:`, error)
    throw error
  }
}