'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ connects: 20, earnings: 0, bids: 0 })
  const [jobs, setJobs] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      // 1. Check Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      // 2. Load Jobs (Feed)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5)
      if (jobsData) setJobs(jobsData)

      // 3. Load My Proposals (To count bids)
      // @ts-ignore
      const { data: proposalData } = await supabase
        .from('proposals')
        .select('*, jobs(title)')
        .eq('freelancer_id', user.id)
      
      if (proposalData) {
        setProposals(proposalData)
        setStats(prev => ({ ...prev, bids: proposalData.length }))
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Workspace...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-8 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Welcome, <span className="text-blue-600">{user.user_metadata.full_name}</span>
            </h1>
            <p className="text-slate-500 mt-1">Ready to work today?</p>
          </div>
          <div className="flex gap-4">
            <Link href="/find-work" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
              Find Work
            </Link>
            <button onClick={handleLogout} className="bg-white border border-slate-200 text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition">
              Log Out
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connects</span>
            <span className="text-4xl font-extrabold text-blue-600 mt-2">{stats.connects}</span>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Bids</span>
            <span className="text-4xl font-extrabold text-purple-600 mt-2">{stats.bids}</span>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Earnings</span>
            <span className="text-4xl font-extrabold text-emerald-600 mt-2">${stats.earnings}</span>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Job Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Recommended Jobs</h2>
            {jobs.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">No jobs found. Check back later!</div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{job.description}</p>
                      <div className="flex gap-2 mt-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">Fixed Price</span>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">${job.budget}</span>
                      </div>
                    </div>
                    <Link href={`/freelancer/apply/${job.id}`} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                      Apply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: My Proposals */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Active Bids</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-h-[300px]">
              {proposals.length === 0 ? (
                <p className="text-center text-slate-400 mt-10 text-sm">You haven't applied to anything yet.</p>
              ) : (
                <div className="space-y-4">
                  {proposals.map((p) => (
                    <div key={p.id} className="pb-4 border-b border-slate-50 last:border-0">
                      <div className="font-bold text-slate-800 text-sm">{p.jobs?.title}</div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-slate-400">Bid: ${p.bid_amount}</span>
                        <span className="text-xs font-bold text-blue-600 uppercase">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}