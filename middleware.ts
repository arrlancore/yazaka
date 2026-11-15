import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Without Supabase config (e.g. a deploy built without the NEXT_PUBLIC_SUPABASE_*
  // variables) skip session refresh instead of failing every request.
  if (!supabaseUrl || !supabaseAnonKey) {
    if (
      request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.includes('/auth')
    ) {
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired - this is crucial for server-side auth
  const { data: { user } } = await supabase.auth.getUser()

  // Optional: Redirect logic for admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.includes('/auth')) {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/auth', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}