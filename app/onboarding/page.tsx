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
        router.replace('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role, onboarding_complete')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_complete) {
        if (profile.role === 'client') router.replace('/client/dashboard')
        else router.replace('/freelancer/dashboard')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole)
    setStep(2)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Convert skills string "React, Node" -> Array ["React", "Node"]
    // Default to empty array if blank
    const skillsArray = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0) : []

    const updates = {
      role: role,
      bio,
      // Website is now optional (only saved if not empty)
      website: website || null,
      company_name: role === 'client' ? companyName : null,
      // Portfolio is optional too if you prefer
      portfolio_url: role === 'freelancer' ? website : null,
      skills: role === 'freelancer' ? skillsArray : null,
      onboarding_complete: true,
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (error) {
      alert('Error saving profile: ' + error.message)
      setSaving(false)
    } else {
      router.refresh()
      if (role === 'client') router.replace('/client/dashboard')
      else router.replace('/freelancer/dashboard')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white text-black font-bold">Checking Profile...</div>

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-2xl w-full bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 relative z-10">
        
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Choose your Role</h1>
            <p className="text-slate-500 mb-10">Are you hiring or working?</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => handleRoleSelect('freelancer')} className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition text-left">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-bold text-slate-900">Freelancer</h3>
                <p className="text-sm text-slate-500">I want to find work</p>
              </button>

              <button onClick={() => handleRoleSelect('client')} className="p-8 rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition text-left">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-slate-900">Client</h3>
                <p className="text-sm text-slate-500">I want to hire talent</p>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Finish your Profile</h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Short Bio</label>
              <textarea required rows={3} className="w-full p-4 border rounded-xl text-black bg-white" 
                value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>

            {role === 'client' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                  <input type="text" required className="w-full p-4 border rounded-xl text-black bg-white" 
                    value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Website (Optional)</label>
                  <input type="url" className="w-full p-4 border rounded-xl text-black bg-white" 
                    value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Skills</label>
                  <input type="text" required className="w-full p-4 border rounded-xl text-black bg-white" 
                    placeholder="React, Design" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Portfolio (Optional)</label>
                  <input type="url" className="w-full p-4 border rounded-xl text-black bg-white" 
                    placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </>
            )}

            <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-blue-600 transition">
              {saving ? 'Saving...' : 'Finish Setup'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-600 underline">
            Log out (Use different account)
          </button>
        </div>
      </div>
    </div>
  )
}