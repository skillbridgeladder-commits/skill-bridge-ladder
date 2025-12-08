'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getData() {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      // 2. Get Open Jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open') // Fix: Matches your DB enum 'open' (lowercase)
        .order('created_at', { ascending: false })
      
      if (jobsData) setJobs(jobsData)
      setLoading(false)
    }
    getData()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Workspace...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Welcome back, {user.user_metadata.full_name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 mt-2">You have <span className="text-blue-600 font-bold">12 Connects</span> available to apply.</p>
          </div>
          <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-full font-bold hover:bg-slate-50 transition">View Profile</button>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-200">
            <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-1">Total Earnings</div>
            <div className="text-4xl font-extrabold">$0.00</div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Active Jobs</div>
            <div className="text-4xl font-extrabold text-slate-900">0</div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Proposals Sent</div>
            <div className="text-4xl font-extrabold text-slate-900">0</div>
          </div>
        </div>

        {/* JOB FEED */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommended for you</h2>
        <div className="grid gap-4">
          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400">No jobs posted yet. Be the first when they arrive!</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition group cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">{job.title}</h3>
                    <p className="text-slate-500 mt-2 line-clamp-2 max-w-2xl">{job.description}</p>
                    <div className="flex gap-3 mt-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Fixed Price</span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Remote</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">${job.budget}</div>
                    <button className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition">Apply Now</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}