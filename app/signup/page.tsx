'use client'
import { useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('freelancer')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-slate-50 z-[-1]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] z-[-1]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] z-[-1]"></div>

      {/* GLASS CARD */}
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Join the future of freelancing today.</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Full Name</label>
            <input type="text" required className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Email</label>
            <input type="email" required className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Password</label>
            <input type="password" required className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">I want to...</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${role === 'freelancer' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
              >
                Work 💻
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${role === 'client' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
              >
                Hire 🤝
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all shadow-md disabled:opacity-50 mt-4">
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