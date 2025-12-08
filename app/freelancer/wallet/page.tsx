'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'

export default function Wallet() {
  const [payments, setPayments] = useState<any[]>([])
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    async function getWallet() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch all payments received
      const { data } = await supabase
        .from('payments')
        .select('*, contracts(jobs(title))')
        .eq('payee_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setPayments(data)
        // Calculate Total Balance
        const total = data.reduce((sum, p) => sum + p.amount, 0)
        setBalance(total)
      }
    }
    getWallet()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 pt-32 px-6 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        <Link href="/freelancer/dashboard" className="text-sm font-bold text-slate-400 hover:text-slate-600">← Back to Dashboard</Link>
        
        <h1 className="text-3xl font-extrabold mt-4 mb-8">My Wallet</h1>

        {/* BALANCE CARD */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] p-10 text-white shadow-2xl mb-12">
          <p className="text-blue-100 font-bold uppercase tracking-widest text-sm mb-2">Total Earnings</p>
          <div className="text-6xl font-extrabold mb-8">${balance.toFixed(2)}</div>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
            Withdraw Funds
          </button>
        </div>

        {/* TRANSACTION LIST */}
        <h2 className="text-xl font-bold mb-6">Transaction History</h2>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-10 text-center text-slate-400">No transactions yet.</div>
          ) : (
            payments.map((p) => (
              <div key={p.id} className="p-6 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition">
                <div>
                  <div className="font-bold text-slate-900">{p.contracts?.jobs?.title || "Project Payment"}</div>
                  <div className="text-xs text-slate-500">{new Date(p.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-600">+${p.amount}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase">{p.status}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}