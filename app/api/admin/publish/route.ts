import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Check auth
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await request.json();

    // Get content from DB
    const { data: content, error: fetchError } = await supabase
      .from('catatan_hsi')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (!content.audio_src) {
      return NextResponse.json({ error: 'Audio source is required' }, { status: 400 });
    }

    // GitHub API setup
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;
    const githubBranch = process.env.GITHUB_BRANCH || 'main';
    
    if (!githubToken || !githubRepo) {
      return NextResponse.json({ error: 'GitHub credentials not configured' }, { status: 500 });
    }

    // Prepare files using latest content
    const indexMdx = `---
title: "${latestContent.title}"
ustad: "${latestContent.ustad}"
publishedAt: "${latestContent.published_at}"
summary: "${latestContent.summary}"
audioSrc: "${latestContent.audio_src}"
transcriptionSrc: "transcription.txt"
series: "${latestContent.series}"
episode: ${latestContent.episode}
totalEpisodes: ${latestContent.total_episodes}
tags: [${latestContent.tags.map(tag => `"${tag}"`).join(', ')}]
source: "${latestContent.source}"
---

${latestContent.content}`;

    // First update DB status to published
    const { error: updateError } = await supabase
      .from('catatan_hsi')
      .update({ 
        status: 'published',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`);
    }

    // Get latest version after update
    const { data: latestContent, error: fetchError } = await supabase
      .from('catatan_hsi')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !latestContent) {
      throw new Error('Failed to fetch updated content');
    }

    // Then create files on GitHub
    const baseUrl = `https://api.github.com/repos/${githubRepo}/contents/content/catatan-hsi/${latestContent.slug}`;
    
    const headers = {
      'Authorization': `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Create index.mdx
    const indexResponse = await fetch(`${baseUrl}/index.mdx`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Publish: ${latestContent.title}`,
        content: Buffer.from(indexMdx).toString('base64'),
        branch: githubBranch,
        author: {
          name: process.env.GITHUB_AUTHOR_NAME || 'Bekhair Admin',
          email: process.env.GITHUB_AUTHOR_EMAIL || 'admin@bekhair.com'
        }
      })
    });

    if (!indexResponse.ok) {
      const error = await indexResponse.text();
      throw new Error(`GitHub API error: ${indexResponse.status} ${error}`);
    }

    // Create transcription.txt
    const transcriptionResponse = await fetch(`${baseUrl}/transcription.txt`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Publish transcription: ${latestContent.title}`,
        content: Buffer.from(latestContent.transcription).toString('base64'),
        branch: githubBranch,
        author: {
          name: process.env.GITHUB_AUTHOR_NAME || 'Bekhair Admin',
          email: process.env.GITHUB_AUTHOR_EMAIL || 'admin@bekhair.com'
        }
      })
    });

    if (!transcriptionResponse.ok) {
      const error = await transcriptionResponse.text();
      throw new Error(`GitHub API error: ${transcriptionResponse.status} ${error}`);
    }

    return NextResponse.json({ success: true, slug: latestContent.slug });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json({ error: 'Failed to publish' }, { status: 500 });
  }
}