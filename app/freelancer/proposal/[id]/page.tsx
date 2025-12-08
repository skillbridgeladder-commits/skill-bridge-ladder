'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ChatBox from '@/app/components/ChatBox'

export default function ProposalDetails() {
  const params = useParams()
  const proposalId = params.id
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      // Get Proposal + Job + Client Info
      const { data } = await supabase
        .from('proposals')
        .select(`
          *,
          job:jobs (
            title,
            budget,
            client_id,
            clients:users ( full_name )
          )
        `)
        .eq('id', proposalId)
        .single()
      
      if (data) setProposal(data)
      setLoading(false)
    }
    fetchData()
  }, [proposalId])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Workroom...</div>

  if (!proposal) return <div className="min-h-screen flex items-center justify-center">Proposal not found</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-28 px-6 pb-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <Link href="/freelancer/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-600">← Back to Dashboard</Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{proposal.job.title}</h1>
          <div className="flex gap-3 mt-2 text-sm">
            <span className="text-slate-500">Client: <strong>{proposal.job.clients.full_name}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Your Bid: <strong>${proposal.bid_amount}</strong></span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* LEFT: STATUS CARD */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Status</h3>
              
              <div className={`p-4 rounded-xl text-center mb-4 ${
                proposal.status === 'hired' ? 'bg-green-100 text-green-700' :
                proposal.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                <span className="text-xl block mb-1">
                  {proposal.status === 'applied' ? '🕒' : 
                   proposal.status === 'viewed' ? '👀' :
                   proposal.status === 'interview' ? '🎤' : 
                   proposal.status === 'hired' ? '🎉' : '📄'}
                </span>
                <span className="font-bold uppercase text-sm">{proposal.status}</span>
              </div>

              <div className="text-xs text-slate-500 leading-relaxed text-center">
                {proposal.status === 'applied' && "Waiting for client to view your proposal."}
                {proposal.status === 'viewed' && "Client has seen your proposal!"}
                {proposal.status === 'interview' && "You are in the interview stage! Check the chat."}
                {proposal.status === 'hired' && "Congratulations! You have been hired."}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Cover Letter</h3>
              <p className="text-sm text-slate-600 italic">"{proposal.cover_letter}"</p>
            </div>
          </div>

          {/* RIGHT: CHAT ROOM */}
          <div className="md:col-span-2">
             <ChatBox 
                proposalId={proposal.id} 
                currentUserId={proposal.freelancer_id} 
                status={proposal.status} 
              />
          </div>

        </div>
      </div>
    </div>
  )
}