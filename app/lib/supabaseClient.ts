import { createClient } from '@supabase/supabase-js'

// 1. We use the 'NEXT_PUBLIC_' prefix so the browser can actually read it
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. Create the connection
export const supabase = createClient(supabaseUrl, supabaseKey)