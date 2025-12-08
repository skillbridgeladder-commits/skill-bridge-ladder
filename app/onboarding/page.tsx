'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'

export default function Onboarding() {
  const [step, setStep] = useState(1) // Step 1: Role, Step 2: Details
  const [role, setRole] = useState('') 
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // Form Fields
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [skillsInput, setSkillsInput] = useState('')

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role, onboarding_complete')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_complete) {
        // If done, go to dashboard
        if (profile.role === 'client') router.replace('/client/dashboard')
        else router.replace('/freelancer/dashboard')
      } else {
        // Not done yet
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setStep(2) // Go to next step
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0)

    const updates = {
      role: role, // CRITICAL: Save the role here
      bio,
      website: website || null,
      company_name: role === 'client' ? companyName : null,
      portfolio_url: role === 'freelancer' ? website : null,
      skills: role === 'freelancer' ? skillsArray : null,
      onboarding_complete: true, // Mark as done
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      alert('Error: ' + error.message)
      setSaving(false)
    } else {
      // Refresh router to ensure middleware sees the update
      router.refresh()
      
      // Redirect
      if (role === 'client') router.replace('/client/dashboard')
      else router.replace('/freelancer/dashboard')
    }
  }

  // Emergency Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 relative z-10">
        
        {/* STEP 1: CHOOSE ROLE */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4">How do you want to use SkillBridge?</h1>
            <p className="text-slate-500 mb-10">Choose your primary role. This helps us customize your experience.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => handleRoleSelect('freelancer')}
                className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition group text-left"
              >
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">I want to Work</h3>
                <p className="text-sm text-slate-500 mt-2">Find jobs, bid on projects, and earn money.</p>
              </button>

              <button 
                onClick={() => handleRoleSelect('client')}
                className="p-8 rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition group text-left"
              >
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700">I want to Hire</h3>
                <p className="text-sm text-slate-500 mt-2">Post jobs, interview talent, and build your team.</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMPLETE PROFILE */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 mb-4">← Change Role</button>
              <h2 className="text-2xl font-bold text-slate-900">Complete your {role === 'client' ? 'Client' : 'Freelancer'} Profile</h2>
            </div>

            {/* BIO */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                {role === 'client' ? 'Company Description' : 'Short Bio'}
              </label>
              {/* FIX: Added 'text-slate-900' to make text visible */}
              <textarea 
                required 
                rows={3} 
                className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400"
                placeholder={role === 'client' ? "We are a tech startup..." : "I am a Full Stack Developer..."}
                value={bio} 
                onChange={(e) => setBio(e.target.value)} 
              />
            </div>

            {/* CLIENT FIELDS */}
            {role === 'client' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                  {/* FIX: Added 'text-slate-900' */}
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400" 
                    placeholder="Acme Corp" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Website</label>
                  <input 
                    type="url" 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400" 
                    placeholder="https://acme.com" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                  />
                </div>
              </>
            ) : (
              <>
                {/* FREELANCER FIELDS */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skills</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400" 
                    placeholder="React, Design" 
                    value={skillsInput} 
                    onChange={(e) => setSkillsInput(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Portfolio</label>
                  <input 
                    type="url" 
                    required 
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder:text-slate-400" 
                    placeholder="https://mywork.com" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg disabled:opacity-50">
              {saving ? 'Saving...' : 'Finish Setup'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-600 underline">
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}