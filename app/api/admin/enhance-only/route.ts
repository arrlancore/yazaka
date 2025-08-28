import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { enhanceTranscription } from '@/lib/ai/openrouter';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Check authentication
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

    // Parse request body
    const body = await request.json();
    const { combined_transcription } = body;

    if (!combined_transcription) {
      return NextResponse.json({ error: 'Missing combined transcription' }, { status: 400 });
    }

    // Step 2: Enhance transcription and create content
    const enhancement = await enhanceTranscription({
      combined_transcription: combined_transcription.trim()
    });

    return NextResponse.json({
      success: true,
      ...enhancement  // Spread the enhancement object directly
    });

  } catch (error) {
    console.error('Enhancement API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Enhancement failed' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'Content enhancement service is running' });
}