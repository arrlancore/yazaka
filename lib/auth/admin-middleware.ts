import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/integrations/supabase/types';

export async function adminMiddleware(request: NextRequest) {
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

  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect to auth page
  if (!session) {
    return NextResponse.redirect(new URL('/admin/auth', request.url));
  }

  // Check if user has admin role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response;
}

export function createAdminRoute(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const middlewareResponse = await adminMiddleware(request);
    
    // If middleware returns a redirect, return it
    if (middlewareResponse.status !== 200) {
      return middlewareResponse;
    }

    // Otherwise, proceed with the original handler
    return handler(request, context);
  };
}