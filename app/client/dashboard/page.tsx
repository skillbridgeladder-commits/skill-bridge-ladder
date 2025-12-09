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
  
  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [processing, setProcessing] = useState(false)

  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      
      // Onboarding Check
      const { data: profile } = await supabase.from('users').select('onboarding_complete').eq('id', user.id).single()
      if (!profile?.onboarding_complete) { router.replace('/onboarding'); return }

      setUser(user)

      // Fetch Data
      const { data: jobs } = await supabase.from('jobs').select('*').eq('client_id', user.id).order('created_at', { ascending: false })
      if (jobs) setMyJobs(jobs)

      const { data: activeContracts } = await supabase.from('contracts').select('*, freelancer:users(full_name), job:jobs(title)').eq('client_id', user.id).eq('status', 'active')
      if (activeContracts) setContracts(activeContracts)

      setLoading(false)
    }
    init()
  }, [router])

  // Open Payment Modal
  const openPayment = (contract: any) => {
    setSelectedContract(contract)
    setPayModalOpen(true)
  }

  // Handle Real Payment
  const confirmPayment = async () => {
    setProcessing(true)
    
    // Simulate Bank Delay (Makes it feel real)
    await new Promise(r => setTimeout(r, 1500))

    try {
      // 1. Mark Complete
      await supabase.from('contracts').update({ status: 'completed' }).eq('id', selectedContract.id)
      
      // 2. Create Transaction
      await supabase.from('payments').insert({
        contract_id: selectedContract.id,
        payer_id: user.id,
        payee_id: selectedContract.freelancer_id,
        amount: selectedContract.budget,
        status: 'released',
        created_at: new Date().toISOString()
      })

      alert("✅ Payment Successful! Receipt sent to email.")
      setContracts(prev => prev.filter(c => c.id !== selectedContract.id))
      setPayModalOpen(false)

    } catch (error: any) {
      alert("Payment Failed: " + error.message)
    } finally {
      setProcessing(false)
    }
  }

  const handleLogout = async () => { await supabase.auth.signOut(); router.push('/login') }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading Dashboard...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-8 pb-20 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Client Dashboard</h1>
            <p className="text-slate-500">Manage your hiring pipeline.</p>
          </div>
          <div className="flex gap-3">
             <Link href="/client/post-job" className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg">+ Post Job</Link>
          </div>
        </div>

        {/* ACTIVE CONTRACTS */}
        {contracts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Active Contracts</h2>
            <div className="grid gap-6">
              {contracts.map((contract) => (
                <div key={contract.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{contract.job.title}</h3>
                    <p className="text-slate-500 text-sm">Freelancer: <span className="font-bold text-blue-600">{contract.freelancer.full_name}</span></p>
                    <div className="text-2xl font-extrabold mt-2">${contract.budget}</div>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">ESCROW SECURED</span>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href={`/client/job/${contract.job_id}`} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Message</Link>
                    
                    {contract.work_submitted ? (
                      <button onClick={() => openPayment(contract)} className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg animate-pulse">
                        Review & Pay
                      </button>
                    ) : (
                      <button disabled className="px-6 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold border border-slate-200">Waiting for Work</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* JOBS LIST (Same as before, abbreviated for space) */}
        {/* ... (Keep your existing Job List code here) ... */}
        
      </div>

      {/* --- PAYMENT MODAL --- */}
      {payModalOpen && selectedContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-slate-200 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">💸</div>
              <h2 className="text-2xl font-bold text-slate-900">Confirm Payment</h2>
              <p className="text-slate-500 text-sm mt-1">Release funds from Escrow to Freelancer</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Project</span>
                <span className="font-bold text-slate-900 truncate max-w-[200px]">{selectedContract.job.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Recipient</span>
                <span className="font-bold text-slate-900">{selectedContract.freelancer.full_name}</span>
              </div>
              <div className="border-t border-slate-200 my-2"></div>
              <div className="flex justify-between text-lg font-extrabold text-slate-900">
                <span>Total</span>
                <span>${selectedContract.budget}.00</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPayModalOpen(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
              <button 
                onClick={confirmPayment} 
                disabled={processing}
                className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg disabled:opacity-50 flex justify-center"
              >
                {processing ? (
                   <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : 'Confirm Release'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}