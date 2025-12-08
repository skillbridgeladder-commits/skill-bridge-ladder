'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [myJobs, setMyJobs] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_complete')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_complete) {
        router.replace('/onboarding')
        return
      }

      setUser(user)

      // Fetch Jobs
      // @ts-ignore
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*, proposals(count)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
      
      if (jobsData) setMyJobs(jobsData)

      // Fetch Active Contracts
      // @ts-ignore
      const { data: contractsData } = await supabase
        .from('contracts')
        .select('*, freelancer:users(full_name), job:jobs(title)')
        .eq('client_id', user.id)
        .eq('status', 'active')
      
      if (contractsData) setContracts(contractsData)

      setLoading(false)
    }
    init()
  }, [router])

  const handleComplete = async (contractId: number) => {
    if(!confirm("Are you sure you want to release payment and finish the job?")) return;
    
    const { error } = await supabase
      .from('contracts')
      .update({ status: 'completed' })
      .eq('id', contractId)

    if (error) {
      alert("Error: " + error.message)
    } else {
      alert("Payment Released! Job Completed.")
      setContracts(prev => prev.filter(c => c.id !== contractId))
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-8 pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Hello, <span className="text-purple-600">{user.user_metadata.full_name}</span>
            </h1>
            <p className="text-slate-500 mt-1">Manage your hiring pipeline.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/client/post-job" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
              + Post New Job
            </Link>
            <button onClick={handleLogout} className="bg-white border border-slate-200 text-red-500 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition">
              Log Out
            </button>
          </div>
        </div>

        {/* ACTIVE CONTRACTS */}
        {contracts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Active Contracts</h2>
            <div className="grid gap-6">
              {contracts.map((contract) => (
                <div key={contract.id} className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{contract.job?.title}</h3>
                    <p className="text-slate-400 text-sm">Freelancer: <span className="text-white font-bold">{contract.freelancer?.full_name}</span></p>
                    <div className="text-3xl font-extrabold mt-4 text-emerald-400">${contract.budget}</div>
                    <p className="text-xs text-slate-500 mt-1">Escrow Secured</p>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full md:w-auto">
                    {/* FIXED MESSAGE BUTTON */}
                    <Link 
                      href={`/client/job/${contract.job_id}`} 
                      className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition text-center"
                    >
                      Message Freelancer
                    </Link>

                    <button 
                      onClick={() => handleComplete(contract.id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-900/20"
                    >
                      Approve Work & Pay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JOB LIST */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">Your Job Postings</h2>
        <div className="space-y-4">
          {myJobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400 mb-4">You haven't posted any jobs yet.</p>
              <Link href="/client/post-job" className="text-blue-600 font-bold hover:underline">Create your first job</Link>
            </div>
          ) : (
            myJobs.map((job) => {
               const proposalCount = job.proposals && job.proposals[0] ? job.proposals[0].count : 0;
               return (
                <div key={job.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {job.status}
                    </span>
                    <p className="text-slate-500 text-sm mt-2">Posted on {new Date(job.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">{proposalCount}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Applicants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-900">${job.budget}</div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Budget</div>
                    </div>
                    <Link href={`/client/job/${job.id}`} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg font-bold text-sm hover:bg-slate-200">
                      Manage
                    </Link>
                  </div>
                </div>
               )
            })
          )}
        </div>

      </div>
    </div>
  )
}