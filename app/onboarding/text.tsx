'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'

export default function Onboarding() {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Form Fields
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [skillsInput, setSkillsInput] = useState('') // For comma separated skills

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      
      // Fetch their role from the database
      const { data: profile } = await supabase
        .from('users')
        .select('role, onboarding_complete')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_complete) {
        // If already done, skip to dashboard
        if (profile.role === 'client') router.push('/client/dashboard')
        else router.push('/freelancer/dashboard')
      } else {
        setRole(profile?.role)
        setLoading(false)
      }
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Convert comma string "React, Node, CSS" into array ["React", "Node", "CSS"]
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)

    const updates = {
      bio,
      website: website || null, // store null if empty
      company_name: role === 'client' ? companyName : null,
      portfolio_url: role === 'freelancer' ? website : null,
      skills: role === 'freelancer' ? skillsArray : null,
      onboarding_complete: true, // IMPORTANT: Mark as done
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      alert('Error saving profile: ' + error.message)
      setSaving(false)
    } else {
      // Redirect to the correct dashboard
      if (role === 'client') router.push('/client/dashboard')
      else router.push('/freelancer/dashboard')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-blue-100">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-xl p-10 rounded-[2rem] shadow-2xl border border-white/50 relative z-10">
        
        <div className="text-center mb-10">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">
            {role === 'client' ? 'Client Profile' : 'Freelancer Profile'}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            One last step! <br/> Tell us about {role === 'client' ? 'your company' : 'your skills'}.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. BIO (For Everyone) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              {role === 'client' ? 'Company Description' : 'Short Bio'}
            </label>
            <textarea 
              required 
              rows={3}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder={role === 'client' ? "We are a tech startup..." : "I am a Full Stack Developer..."}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* 2. CLIENT SPECIFIC FIELDS */}
          {role === 'client' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="Acme Corp"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Website</label>
                <input 
                  type="url" 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://acme.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </>
          )}

          {/* 3. FREELANCER SPECIFIC FIELDS */}
          {role === 'freelancer' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skills (Comma Separated)</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="React, Logo Design, Python, SEO"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Portfolio Link</label>
                <input 
                  type="url" 
                  required 
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="https://myportfolio.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:scale-[1.02] transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? 'Saving Profile...' : 'Complete Profile & Go to Dashboard'}
          </button>

        </form>
      </div>
    </div>
  )
}