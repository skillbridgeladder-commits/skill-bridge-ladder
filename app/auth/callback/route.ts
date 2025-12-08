import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Default to /onboarding if no specific destination is set
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const cookieStore = await cookies() // Await is required in Next.js 15+

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // This catch block handles cases where setAll is called 
              // from a context where cookies cannot be set (safe to ignore)
            }
          },
        },
      }
    )
    
    // Securely exchange the Google Code for a User Session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If login failed, send them back to login page
  return NextResponse.redirect(`${origin}/login?error=AuthCodeError`)
}