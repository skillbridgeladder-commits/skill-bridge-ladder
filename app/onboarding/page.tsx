'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'
import Image from 'next/image'

export default function Onboarding() {
  const [step, setStep] = useState(1) // 1: Role, 2: Info, 3: Photo
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  // --- FORM STATE ---
  const [role, setRole] = useState('')
  // Shared
  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  // Freelancer
  const [jobTitle, setJobTitle] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [experience, setExperience] = useState('Intermediate')
  // Client
  const [companyName, setCompanyName] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('1-10')

  // 1. CHECK USER STATUS
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
        // If done, force them to dashboard
        if (profile.role === 'client') router.replace('/client/dashboard')
        else router.replace('/freelancer/dashboard')
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  // 2. HANDLE PHOTO UPLOAD
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  // 3. SUBMIT EVERYTHING
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      // A. Upload Photo (If selected)
      let avatarUrl = null
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}-${Math.random()}.${fileExt}`
        
        // Upload to 'avatars' bucket
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile)

        if (uploadError) throw uploadError
        
        // Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)
        
        avatarUrl = publicUrlData.publicUrl
      }

      // B. Prepare Data
      const skillsArray = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(s => s.length > 0) : []

      const profileData = {
        id: user.id, // CRITICAL: Required for upsert
        email: user.email, // Ensure email is saved
        full_name: user.user_metadata.full_name || 'New User',
        role,
        bio,
        avatar_url: avatarUrl,
        onboarding_complete: true,
        // Client Fields
        company_name: role === 'client' ? companyName : null,
        website: role === 'client' ? website : null,
        industry: role === 'client' ? industry : null,
        company_size: role === 'client' ? companySize : null,
        // Freelancer Fields
        job_title: role === 'freelancer' ? jobTitle : null,
        hourly_rate: role === 'freelancer' && hourlyRate ? parseFloat(hourlyRate) : null,
        experience_level: role === 'freelancer' ? experience : null,
        portfolio_url: role === 'freelancer' ? portfolio : null,
        skills: role === 'freelancer' ? skillsArray : null,
        updated_at: new Date().toISOString(),
      }

      // C. Save to DB (Using UPSERT to fix "Row violations")
      const { error: dbError } = await supabase
        .from('users')
        .upsert(profileData)

      if (dbError) throw dbError

      // D. Redirect
      router.refresh()
      if (role === 'client') router.replace('/client/dashboard')
      else router.replace('/freelancer/dashboard')

    } catch (error: any) {
      alert('Error: ' + error.message)
      setSaving(false)
    }
  }

  // Emergency Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500 bg-slate-50">Checking Profile...</div>

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-3xl w-full bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100 relative z-10">
        
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-8">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
        </div>

        {/* --- STEP 1: ROLE SELECTION --- */}
        {step === 1 && (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold mb-4">Join as a Client or Freelancer</h1>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <button onClick={() => { setRole('freelancer'); setStep(2) }} className="p-8 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 text-left transition group">
                <span className="text-4xl">💻</span>
                <h3 className="text-xl font-bold mt-4 group-hover:text-blue-600">I am a Freelancer</h3>
                <p className="text-sm text-slate-500 mt-2">I want to find work and build my career.</p>
              </button>
              <button onClick={() => { setRole('client'); setStep(2) }} className="p-8 rounded-2xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 text-left transition group">
                <span className="text-4xl">🤝</span>
                <h3 className="text-xl font-bold mt-4 group-hover:text-purple-600">I am a Client</h3>
                <p className="text-sm text-slate-500 mt-2">I want to hire talent for my projects.</p>
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: PROFESSIONAL DETAILS --- */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{role === 'client' ? 'Company Details' : 'Professional Info'}</h2>
            <div className="space-y-5">
              
              {/* FREELANCER SPECIFIC */}
              {role === 'freelancer' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Your Professional Title</label>
                    <input type="text" className="w-full p-3 border rounded-xl" placeholder="e.g. Senior Full Stack Developer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1">Hourly Rate ($)</label>
                      <input type="number" className="w-full p-3 border rounded-xl" placeholder="25" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1">Experience Level</label>
                      <select className="w-full p-3 border rounded-xl bg-white" value={experience} onChange={e => setExperience(e.target.value)}>
                        <option>Entry Level</option>
                        <option>Intermediate</option>
                        <option>Expert</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Skills (Comma Separated)</label>
                    <input type="text" className="w-full p-3 border rounded-xl" placeholder="React, Node.js, Design" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} />
                  </div>
                </>
              )}

              {/* CLIENT SPECIFIC */}
              {role === 'client' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Company Name</label>
                    <input type="text" className="w-full p-3 border rounded-xl" placeholder="Acme Corp" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1">Industry</label>
                      <input type="text" className="w-full p-3 border rounded-xl" placeholder="Tech / Healthcare" value={industry} onChange={e => setIndustry(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1">Company Size</label>
                      <select className="w-full p-3 border rounded-xl bg-white" value={companySize} onChange={e => setCompanySize(e.target.value)}>
                        <option>1-10</option>
                        <option>11-50</option>
                        <option>50+</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Website (Optional)</label>
                    <input type="url" className="w-full p-3 border rounded-xl" placeholder="https://..." value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>
                </>
              )}

              {/* BIO (Both) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1">Overview / Bio</label>
                <textarea rows={4} className="w-full p-3 border rounded-xl" placeholder="Tell us about yourself..." value={bio} onChange={e => setBio(e.target.value)} />
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="text-slate-500 font-bold">Back</button>
                <button onClick={() => setStep(3)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold">Next Step</button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: PHOTO UPLOAD --- */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Upload your {role === 'client' ? 'Company Logo' : 'Profile Photo'}</h2>
            <p className="text-slate-500 mb-8 text-sm">Please upload a professional image.</p>

            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Preview" fill className="object-cover" />
                ) : (
                  <span className="text-4xl text-slate-300">📷</span>
                )}
              </div>
              
              <label className="cursor-pointer bg-white border border-slate-200 px-6 py-2 rounded-full font-bold shadow-sm hover:bg-slate-50 transition">
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                Choose Image
              </label>
            </div>

            <div className="flex justify-between pt-10 border-t border-slate-100 mt-10">
              <button onClick={() => setStep(2)} className="text-slate-500 font-bold">Back</button>
              <button 
                onClick={handleSubmit} 
                disabled={saving}
                className="bg-green-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition shadow-lg"
              >
                {saving ? 'Creating Profile...' : 'Finish & Go to Dashboard'}
              </button>
            </div>
          </div>
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