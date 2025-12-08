'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'

export default function JobManager({ params }: { params: { id: string } }) {
  const [proposals, setProposals] = useState<any[]>([])

  useEffect(() => {
    const fetchProposals = async () => {
      const { data } = await supabase
        .from('proposals')
        .select('*, freelancers:users(full_name, email)')
        .eq('job_id', params.id)
        .order('created_at', { ascending: false })
      if (data) setProposals(data)
    }
    fetchProposals()
  }, [params.id])

  const updateStatus = async (proposalId: number, newStatus: string) => {
    // Update the database
    await supabase.from('proposals').update({ status: newStatus }).eq('id', proposalId)
    // Update UI instantly
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: newStatus } : p))
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Manage Applicants</h1>

      <div className="grid gap-4">
        {proposals.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            
            {/* Candidate Info */}
            <div>
              <h3 className="font-bold text-lg">{p.freelancers.full_name}</h3>
              <p className="text-slate-500 text-sm">Bid: ${p.bid_amount}</p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase">
                Current Stage: {p.status.replace('_', ' ')}
              </div>
            </div>

            {/* ACTION BUTTONS (The Hiring Pipeline) */}
            <div className="flex gap-2">
              {p.status === 'applied' && (
                <button onClick={() => updateStatus(p.id, 'viewed')} className="px-4 py-2 bg-slate-200 rounded-lg text-xs font-bold hover:bg-slate-300">Mark Viewed</button>
              )}
              {p.status === 'viewed' && (
                <button onClick={() => updateStatus(p.id, 'interview_round_1')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200">Start Round 1</button>
              )}
              {p.status === 'interview_round_1' && (
                <button onClick={() => updateStatus(p.id, 'final_call')} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200">Move to Final Call</button>
              )}
              {p.status === 'final_call' && (
                <button onClick={() => updateStatus(p.id, 'hired')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700">HIRE NOW</button>
              )}
              
              {/* Message Button (Only enabled if viewed/interviewing) */}
              {p.status !== 'applied' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Message</button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}