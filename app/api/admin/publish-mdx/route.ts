import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { publishToMDX, unpublishMDX } from '@/lib/admin/mdx-publisher';
import type { Database } from '@/integrations/supabase/types';

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for server-side authentication
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get content from database
    const { data: content, error: fetchError } = await supabase
      .from('catatan_hsi')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    if (action === 'publish') {
      // Validate content is ready for publishing
      if (!content.content || content.content.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Content must be enhanced before publishing' 
        }, { status: 400 });
      }

      // Publish to MDX
      await publishToMDX(content);

      // Update status in database
      const { error: updateError } = await supabase
        .from('catatan_hsi')
        .update({
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        message: 'Content published successfully',
        slug: content.slug
      });

    } else if (action === 'unpublish') {
      // Unpublish MDX
      await unpublishMDX(content.slug);

      // Update status in database
      const { error: updateError } = await supabase
        .from('catatan_hsi')
        .update({
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      return NextResponse.json({
        success: true,
        message: 'Content unpublished successfully'
      });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('MDX publishing API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Publishing failed' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'MDX publishing service is running' });
}