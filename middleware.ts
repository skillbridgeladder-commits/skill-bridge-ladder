import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. If not logged in, block access to dashboards
  if (!user && request.nextUrl.pathname.startsWith('/client')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (!user && request.nextUrl.pathname.startsWith('/freelancer')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If logged in, CHECK ROLE (The Security Wall)
  if (user) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    
    // If a Freelancer tries to go to Client area -> Kick them out
    if (request.nextUrl.pathname.startsWith('/client') && profile?.role !== 'client') {
      return NextResponse.redirect(new URL('/freelancer/dashboard', request.url))
    }
    // If a Client tries to go to Freelancer area -> Kick them out
    if (request.nextUrl.pathname.startsWith('/freelancer') && profile?.role !== 'freelancer') {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/client/:path*', '/freelancer/:path*', '/login', '/signup'],
}