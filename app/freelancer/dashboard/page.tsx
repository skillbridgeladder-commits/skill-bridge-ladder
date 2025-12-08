'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getData() {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      // 2. Get Open Jobs (Feed)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (jobsData) setJobs(jobsData)

      // 3. Get My Active Proposals
      // @ts-ignore
      const { data: proposalData } = await supabase
        .from('proposals')
        .select('*, jobs(title)')
        .eq('freelancer_id', user.id)
      
      if (proposalData) setProposals(proposalData)

      setLoading(false)
    }
    getData()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Workspace...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Welcome, {user.user_metadata.full_name?.split(' ')[0]}!</h1>
            <p className="text-slate-500 mt-2">Here is what's happening today.</p>
          </div>
          <Link href="/find-work" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            Search More Jobs
          </Link>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-xl">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Active Proposals</div>
            <div className="text-4xl font-extrabold">{proposals.length}</div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Earnings</div>
            <div className="text-4xl font-extrabold text-slate-900">$0.00</div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Connects Left</div>
            <div className="text-4xl font-extrabold text-blue-600">20</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: JOB FEED */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Latest Jobs for You</h2>
            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                  <p className="text-slate-400">No jobs posted yet.</p>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition group">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">{job.title}</h3>
                        <p className="text-slate-500 mt-2 line-clamp-2 text-sm">{job.description}</p>
                        <div className="flex gap-3 mt-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">Fixed Price</span>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">${job.budget}</span>
                        </div>
                      </div>
                      
                      {/* LINK TO APPLY PAGE */}
                      <Link 
                        href={`/freelancer/apply/${job.id}`} 
                        className="bg-slate-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-600 transition shrink-0"
                      >
                        Apply Now
                      </Link>

                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: MY PROPOSALS */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">My Active Bids</h2>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm min-h-[300px]">
              {proposals.length === 0 ? (
                <p className="text-slate-400 text-sm text-center mt-10">You haven't applied to anything yet.</p>
              ) : (
                <div className="space-y-4">
                  {proposals.map((p) => (
                    <div key={p.id} className="border-b border-slate-50 pb-4 last:border-0">
                      <div className="font-bold text-slate-800 text-sm mb-1">{p.jobs?.title}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400">Bid: ${p.bid_amount}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          p.status === 'applied' ? 'bg-blue-50 text-blue-600' : 
                          p.status === 'hired' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {p.status}
                        </span>
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