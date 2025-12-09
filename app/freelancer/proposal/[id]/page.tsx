'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ChatBox from '@/app/components/ChatBox'

export default function ProposalDetails() {
  const params = useParams()
  const proposalId = Array.isArray(params.id) ? params.id[0] : params.id
  
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('proposals')
        .select(`*, job:jobs (title, budget, client_id, clients:users(full_name))`)
        .eq('id', proposalId)
        .single()
      
      if (data) setProposal(data)
      setLoading(false)
    }
    fetchData()
  }, [proposalId])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Workroom...</div>
  if (!proposal) return <div className="p-10">Proposal not found</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/freelancer/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-600">← Back</Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{proposal.job.title}</h1>
          <div className="flex gap-4 mt-2 text-sm text-slate-500">
            <span>Client: <strong>{proposal.job.clients.full_name}</strong></span>
            <span>Bid: <strong>${proposal.bid_amount}</strong></span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
               proposal.status === 'hired' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>{proposal.status}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Status</h3>
              <div className="p-4 rounded-xl text-center mb-4 bg-slate-100 text-slate-600 font-bold uppercase text-sm">
                {proposal.status}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Cover Letter</h3>
              <p className="text-sm text-slate-600 italic whitespace-pre-wrap">{proposal.cover_letter}</p>
            </div>
          </div>

          <div className="md:col-span-2">
             <ChatBox proposalId={proposal.id} currentUserId={proposal.freelancer_id} status={proposal.status} />
          </div>
        </div>
      </div>
    </div>
  )
}