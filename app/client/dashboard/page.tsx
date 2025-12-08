'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [myJobs, setMyJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')
      setUser(user)

      // Fetch jobs posted by THIS client
      const { data } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
      
      if (data) setMyJobs(data)
      setLoading(false)
    }
    getData()
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">Client Dashboard</h1>
            <p className="text-slate-500 mt-2">Manage your hiring pipeline.</p>
          </div>
          <Link href="/client/post-job" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
            + Post a New Job
          </Link>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Total Spent</div>
            <div className="text-4xl font-extrabold text-slate-900">$0.00</div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Active Hires</div>
            <div className="text-4xl font-extrabold text-slate-900">0</div>
          </div>
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">Open Jobs</div>
            <div className="text-4xl font-extrabold text-blue-600">{myJobs.length}</div>
          </div>
        </div>

        {/* MY JOBS LIST */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Job Postings</h2>
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {myJobs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 mb-4">You haven't posted any jobs yet.</p>
              <Link href="/client/post-job" className="text-blue-600 font-bold hover:underline">Post your first job</Link>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-6">Job Title</th>
                  <th className="p-6">Budget</th>
                  <th className="p-6">Date Posted</th>
                  <th className="p-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="p-6 font-bold text-slate-900">{job.title}</td>
                    <td className="p-6 font-medium text-slate-600">${job.budget}</td>
                    <td className="p-6 text-slate-500 text-sm">{new Date(job.created_at).toLocaleDateString()}</td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">{job.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}