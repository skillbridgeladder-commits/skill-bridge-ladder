'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ChatBox from '@/app/components/ChatBox'

export default function JobManager() {
  const params = useParams()
  const router = useRouter()
  // Handle array or string param safely
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id

  const [job, setJob] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // 1. Get Job Details
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()
      
      if (!jobData) return

      setJob(jobData)

      // 2. Get Applicants (with their profiles)
      const { data: proposalData } = await supabase
        .from('proposals')
        .select('*, freelancer:users(*)')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (proposalData) setProposals(proposalData)
      setLoading(false)
    }
    fetchData()
  }, [jobId])

  const updateStatus = async (status: string) => {
    if (!selectedProposal) return

    // 1. Update the Proposal Status
    const { error } = await supabase
      .from('proposals')
      .update({ status })
      .eq('id', selectedProposal.id)

    if (error) {
      alert('Error updating status: ' + error.message)
      return
    }

    // 2. IF HIRING: Create a Contract & Close Job
    if (status === 'hired') {
      
      // A. Create Contract
      const { error: contractError } = await supabase
        .from('contracts')
        .insert({
          job_id: job.id,
          client_id: job.client_id,
          freelancer_id: selectedProposal.freelancer_id,
          budget: selectedProposal.bid_amount, // Use the agreed bid amount
          status: 'active'
        })

      if (contractError) {
        alert('Error creating contract: ' + contractError.message)
        return
      }

      // B. Close the Job (So no one else applies)
      await supabase
        .from('jobs')
        .update({ status: 'closed' })
        .eq('id', job.id)
      
      alert(`🎉 Success! You have hired ${selectedProposal.freelancer.full_name}. Contract Started.`)
      router.push('/client/dashboard') // Go back to dashboard
    } else {
      // Just update UI for other stages (Interview, Viewed, etc.)
      setProposals(proposals.map(p => p.id === selectedProposal.id ? { ...p, status } : p))
      setSelectedProposal({ ...selectedProposal, status })
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Applicants...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto h-[85vh] flex flex-col">
        
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <Link href="/client/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-600">← Back to Dashboard</Link>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{job.title}</h1>
            <div className="flex gap-4 mt-2 text-sm font-medium text-slate-500">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">{job.budget_type}</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">${job.budget}</span>
              <span className={`px-3 py-1 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {job.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-extrabold text-slate-900">{proposals.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applicants</div>
          </div>
        </div>

        {/* MAIN WORKSPACE (Split View) */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          
          {/* LEFT: APPLICANT LIST */}
          <div className="w-full md:w-1/3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-y-auto">
            {proposals.length === 0 ? (
              <div className="p-10 text-center text-slate-400">No applicants yet.</div>
            ) : (
              proposals.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => setSelectedProposal(p)}
                  className={`p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${selectedProposal?.id === p.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900">{p.freelancer?.full_name || 'Freelancer'}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                      p.status === 'applied' ? 'bg-slate-100 text-slate-500' :
                      p.status === 'hired' ? 'bg-green-100 text-green-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{p.freelancer?.job_title || 'Expert'}</p>
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="font-bold text-emerald-600">${p.bid_amount} Bid</span>
                    <span className="text-slate-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: DETAILS & CHAT */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            {selectedProposal ? (
              <>
                {/* CANDIDATE HEADER */}
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-2xl overflow-hidden relative">
                      {selectedProposal.freelancer?.avatar_url ? (
                        <img src={selectedProposal.freelancer.avatar_url} alt="Ava" className="object-cover w-full h-full" />
                      ) : "👤"}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{selectedProposal.freelancer?.full_name}</h2>
                      <p className="text-sm text-slate-500">{selectedProposal.freelancer?.email}</p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Move Stages) */}
                  <div className="flex gap-2">
                    {selectedProposal.status === 'applied' && (
                      <button onClick={() => updateStatus('viewed')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50">Mark Viewed</button>
                    )}
                    {selectedProposal.status !== 'hired' && (
                      <button onClick={() => updateStatus('interview')} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700">Interview</button>
                    )}
                    {selectedProposal.status === 'interview' && (
                      <button onClick={() => updateStatus('hired')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-lg shadow-green-200">HIRE NOW</button>
                    )}
                    {selectedProposal.status === 'hired' && (
                      <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-xs font-bold border border-green-200">HIRED ✅</span>
                    )}
                  </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-8">
                  
                  {/* COVER LETTER */}
                  <div className="mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cover Letter</h3>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      {selectedProposal.cover_letter}
                    </p>
                  </div>

                  {/* CHAT SYSTEM */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Workroom Chat</h3>
                    <ChatBox 
                      proposalId={selectedProposal.id} 
                      currentUserId={job.client_id} 
                      status={selectedProposal.status} 
                    />
                  </div>

                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <span className="text-6xl mb-4">👈</span>
                <p>Select a candidate to view details</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}