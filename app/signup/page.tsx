'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('freelancer')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // We pass data here so Supabase knows their role if it's a new user
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    if (error) setMessage(error.message)
  }

  const handleSignup = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: role, full_name: fullName } },
      })
      if (error) throw error
      setMessage('Success! Check your email to confirm.')
    } catch (error: any) {
      setMessage('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans py-20">
      <div className="absolute inset-0 bg-slate-50 z-[-1]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] z-[-1]"></div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the future of freelancing today.</p>
        </div>

        {/* GOOGLE BUTTON */}
        <button onClick={handleGoogleSignup} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-50 transition-all mb-6 shadow-sm">
          <FcGoogle className="text-2xl" />
          Sign up with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white/0 text-slate-400">Or sign up with email</span></div>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Full Name</label>
            <input type="text" required className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Email</label>
            <input type="email" required className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Password</label>
            <input type="password" required className="w-full p-4 bg-white/50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* ROLE SELECTOR */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">I want to...</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setRole('freelancer')} className={`p-4 rounded-xl border-2 font-bold transition-all ${role === 'freelancer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}>Work 💻</button>
              <button type="button" onClick={() => setRole('client')} className={`p-4 rounded-xl border-2 font-bold transition-all ${role === 'client' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}>Hire 🤝</button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg mt-4">
            {loading ? 'Creating...' : 'Get Started'}
          </button>
          {message && <div className="p-3 bg-blue-50 text-blue-600 text-sm rounded-lg text-center font-medium">{message}</div>}
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm">
          Already a member? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  )
}