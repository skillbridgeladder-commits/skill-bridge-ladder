'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
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
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-slate-50 z-[-1]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] z-[-1]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] z-[-1]"></div>

      {/* GLASS CARD */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Enter your credentials to access your workspace.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-blue-600 hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50"
          >
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