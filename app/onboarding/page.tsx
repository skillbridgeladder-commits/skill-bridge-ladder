'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'

export default function Onboarding() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [role, setRole] = useState('')
  const router = useRouter()

  // Form Fields
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [skillsInput, setSkillsInput] = useState('')

  useEffect(() => {
    async function checkUser() {
      // 1. Check Session (Faster than getUser)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      // 2. Fetch User Profile to check Role & Status
      const { data: profile, error } = await supabase
        .from('users')
        .select('role, onboarding_complete')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      // 3. Logic: Where should they go?
      if (profile?.onboarding_complete) {
        // If they already finished this step, kick them to the dashboard
        if (profile.role === 'client') router.replace('/client/dashboard')
        else router.replace('/freelancer/dashboard')
      } else {
        // If not finished, show the form
        setRole(profile?.role)
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Prepare Data
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)

    const updates = {
      bio,
      website: website || null,
      company_name: role === 'client' ? companyName : null,
      portfolio_url: role === 'freelancer' ? website : null,
      skills: role === 'freelancer' ? skillsArray : null,
      onboarding_complete: true, // IMPORTANT: This stops them from seeing this page again
    }

    // Save to Database
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
    } else {
      // Success! Go to dashboard
      if (role === 'client') router.push('/client/dashboard')
      else router.push('/freelancer/dashboard')
    }
  }

  // Emergency Logout (In case they get stuck)
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold bg-slate-50">Loading Profile Setup...</div>

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50 relative z-10">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Complete Your Profile</h1>
          <p className="text-slate-500">Tell us a bit more about {role === 'client' ? 'your company' : 'your skills'}.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Bio (For Everyone) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {role === 'client' ? 'Company Description' : 'Short Bio'}
            </label>
            <textarea 
              required 
              rows={3}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={role === 'client' ? "We are a tech startup..." : "I am a Full Stack Developer..."}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Client Fields */}
          {role === 'client' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Website</label>
                <input type="url" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://acme.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </>
          )}

          {/* Freelancer Fields */}
          {role === 'freelancer' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skills (Comma Separated)</label>
                <input type="text" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="React, Python, Design" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Portfolio Link</label>
                <input type="url" required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://myportfolio.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </>
          )}

          <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg disabled:opacity-50">
            {saving ? 'Saving...' : 'Finish Setup'}
          </button>

        </form>

        {/* Safety Escape Hatch */}
        <div className="mt-6 text-center">
          <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-600 underline">
            Log out (Use different account)
          </button>
        </div>

      </div>
    </div>
  )
}