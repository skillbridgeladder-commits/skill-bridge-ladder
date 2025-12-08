'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({ connects: 0, earnings: 0, bids: 0 })
  const [jobs, setJobs] = useState<any[]>([])
  const [proposals, setProposals] = useState<any[]>([])
  const [contracts, setContracts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function init() {
      // 1. Auth Check
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 2. Safety Check (Onboarding)
      const { data: profile } = await supabase
        .from('users')
        .select('onboarding_complete, credits')
        .eq('id', user.id)
        .single()

      if (!profile?.onboarding_complete) {
        router.replace('/onboarding')
        return
      }

      setUser(user)

      // 3. Load Jobs (Feed)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (jobsData) setJobs(jobsData)

      // 4. Load My Proposals & Stats
      // @ts-ignore
      const { data: proposalData } = await supabase
        .from('proposals')
        .select('*, jobs(title)')
        .eq('freelancer_id', user.id)
      
      if (proposalData) {
        setProposals(proposalData)
      }

      // 5. Load Contracts (Active & Completed)
      // @ts-ignore
      const { data: contractData } = await supabase
        .from('contracts')
        .select('*, jobs(title)')
        .eq('freelancer_id', user.id)
      
      if (contractData) {
        // Filter for Active display
        const activeContracts = contractData.filter((c: any) => c.status === 'active')
        setContracts(activeContracts)

        // Calculate Total Earnings (Sum of completed contracts)
        const totalEarnings = contractData
          .filter((c: any) => c.status === 'completed')
          .reduce((sum: number, current: any) => sum + (current.budget || 0), 0)

        // Update Stats
        setStats({
          connects: profile.credits || 0,
          bids: proposalData?.length || 0,
          earnings: totalEarnings
        })
      }

      setLoading(false)
    }
    init()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // FUNCTION: Submit Work (Sends Link to Chat)
  const handleSubmitWork = async (contract: any) => {
    const workLink = prompt("Please paste the link to your work (Google Drive, GitHub, Figma):");
    
    if (!workLink) return; // User cancelled

    if (!workLink.startsWith('http')) {
      alert("Please enter a valid URL starting with http:// or https://");
      return;
    }

    try {
      // Find the proposal ID to link the message
      const { data: proposal } = await supabase
          .from('proposals')
          .select('id')
          .eq('job_id', contract.job_id)
          .eq('freelancer_id', user.id)
          .single()

      if (proposal) {
          // Send message
          const { error } = await supabase.from('messages').insert({
              proposal_id: proposal.id,
              sender_id: user.id,
              content: `✅ WORK SUBMITTED:\n\n🔗 ${workLink}`,
              is_flagged: false
          })

          if (error) throw error
          alert("Success! Link sent to client chat.")
      } else {
        alert("Could not find linked proposal to send message.")
      }

    } catch (error: any) {
      alert("Error: " + error.message)
    }
  }

  // FUNCTION: Go to Chat (Finds the right proposal)
  const handleMessageClient = async (contract: any) => {
    const { data: proposal } = await supabase
        .from('proposals')
        .select('id')
        .eq('job_id', contract.job_id)
        .eq('freelancer_id', user.id)
        .single()
    
    if (proposal) {
      router.push(`/freelancer/proposal/${proposal.id}`)
    } else {
      alert("Chat room not found.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Workspace...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-8 pb-20 font-sans text-slate-900">
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

        {/* --- ACTIVE CONTRACTS SECTION --- */}
        {contracts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Active Contracts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {contracts.map((contract) => (
                <div key={contract.id} className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{contract.jobs?.title}</h3>
                        <p className="text-slate-400 text-xs">Started: {new Date(contract.start_date).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        ACTIVE
                      </span>
                    </div>

                    <div className="text-3xl font-extrabold mb-6">${contract.budget}</div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleSubmitWork(contract)}
                        className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200 transition shadow-lg"
                      >
                        Submit Work
                      </button>
                      <button 
                        onClick={() => handleMessageClient(contract)}
                        className="flex-1 bg-transparent border border-slate-600 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
                      >
                        Message Client
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Job Feed */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Recommended Jobs</h2>
            {jobs.length === 0 ? (
              <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">No jobs posted yet.</div>
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
                    <Link href={`/freelancer/apply/${job.id}`} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md">
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
                    <Link 
                      key={p.id} 
                      href={`/freelancer/proposal/${p.id}`} 
                      className="block border-b border-slate-50 pb-4 last:border-0 hover:bg-slate-50 transition p-2 rounded-lg"
                    >
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
                    </Link>
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