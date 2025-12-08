'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc' // Ensure you installed react-icons

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) setErrorMsg(error.message)
  }

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      
      // Check role
      const { data: userProfile } = await supabase.from('users').select('role').eq('id', data.user.id).single()
      if (userProfile?.role === 'client') router.push('/client/dashboard')
      else if (userProfile?.role === 'freelancer') router.push('/freelancer/dashboard')
      else router.push('/')
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-50 z-[-1]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] z-[-1]"></div>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to access your workspace.</p>
        </div>

        {/* GOOGLE BUTTON */}
        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-50 transition-all mb-6 shadow-sm">
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white/0 text-slate-400">Or continue with email</span></div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Email</label>
            <input type="email" required className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Password</label>
            <input type="password" required className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg">
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{errorMsg}</div>}
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Don't have an account? <Link href="/signup" className="text-blue-600 font-bold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  )
}