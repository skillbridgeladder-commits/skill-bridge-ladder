'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function MyProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setProfile(data)
      setLoading(false)
    }
    getProfile()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading Profile...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* PROFILE CARD */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden relative">
          
          {/* Header Background */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          <div className="px-10 pb-10">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-6">
              
              {/* AVATAR */}
              <div className="relative w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-4xl">👤</div>
                )}
              </div>

              {/* NAME & ROLE */}
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold text-slate-900">{profile?.full_name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-slate-500 font-medium">{profile?.role === 'client' ? 'Client Account' : profile?.job_title || 'Freelancer'}</span>
                  {profile?.onboarding_complete && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">✔ Verified</span>
                  )}
                </div>
              </div>

              {/* EDIT BUTTON */}
              <Link href="/onboarding" className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm">
                Edit Profile
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mt-10">
              
              {/* LEFT COLUMN: INFO */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">About</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{profile?.bio || "No bio added yet."}</p>
                </div>

                {profile?.role === 'freelancer' && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills?.map((skill: string) => (
                        <span key={skill} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm">
                          {skill}
                        </span>
                      )) || <span className="text-slate-400">No skills listed.</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: STATS */}
              <div className="space-y-6">
                
                {profile?.role === 'freelancer' && (
                  <>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase">Hourly Rate</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-1">${profile?.hourly_rate || 0}/hr</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase">Experience</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">{profile?.experience_level || 'N/A'}</div>
                    </div>
                  </>
                )}

                {profile?.role === 'client' && (
                  <>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase">Company</div>
                      <div className="text-lg font-bold text-slate-900 mt-1">{profile?.company_name || 'N/A'}</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-xs font-bold text-slate-400 uppercase">Website</div>
                      <a href={profile?.website} target="_blank" className="text-blue-600 font-bold mt-1 block truncate hover:underline">
                        {profile?.website || 'N/A'}
                      </a>
                    </div>
                  </>
                )}

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase">Email</div>
                  <div className="text-sm font-bold text-slate-900 mt-1 truncate">{profile?.email}</div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}