import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { combineTranscriptions, enhanceTranscription } from '@/lib/ai/openrouter';
import type { Database } from '@/integrations/supabase/types';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for server-side authentication
    const response = NextResponse.next();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
    }
    
    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { id, transcription } = body;

    if (!id || !transcription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Step 1: Combine/clean transcription
    console.log('Step 1: Combining transcription...');
    const combineResult = await combineTranscriptions({
      transcription: transcription.trim()
    });

    // Step 2: Enhance content and create article
    console.log('Step 2: Enhancing content...');
    const enhanceResult = await enhanceTranscription({
      combined_transcription: combineResult.combined_transcription
    });

    // Step 3: Update content in database with all enhanced data
    const { error: updateError } = await supabase
      .from('catatan_hsi')
      .update({
        // Update basic info with extracted data
        title: enhanceResult.extracted_title,
        slug: enhanceResult.extracted_title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim(),
        series: enhanceResult.extracted_series,
        ustad: enhanceResult.extracted_ustad,
        
        // Update content fields
        transcription: combineResult.combined_transcription,
        content: enhanceResult.enhanced_content,
        summary: enhanceResult.improved_summary,
        tags: enhanceResult.suggested_tags,
        
        // Set status to draft
        status: 'draft',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      enhancement: {
        combined_transcription: combineResult.combined_transcription,
        enhanced_content: enhanceResult.enhanced_content,
        improved_summary: enhanceResult.improved_summary,
        suggested_tags: enhanceResult.suggested_tags,
        extracted_title: enhanceResult.extracted_title,
        extracted_ustad: enhanceResult.extracted_ustad,
        extracted_series: enhanceResult.extracted_series
      }
    });

  } catch (error) {
    console.error('Quick enhancement API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Enhancement failed' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'Quick AI enhancement service is running' });
}