'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ApplyJob() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id

  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Form Data
  const [bid, setBid] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function getJobDetails() {
      // 1. Get Job Info
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select('*, clients:users(full_name)')
        .eq('id', jobId)
        .single()
      
      if (error) {
        alert("Job not found!")
        router.push('/find-work')
      } else {
        setJob(jobData)
      }
      setLoading(false)
    }
    getJobDetails()
  }, [jobId, router])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    // 2. Check if already applied
    const { data: existing } = await supabase
        .from('proposals')
        .select('id')
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id)
        .single()

    if (existing) {
        setErrorMsg("You have already applied to this job.")
        setSubmitting(false)
        return
    }

    // 3. Submit Proposal
    const { error: submitError } = await supabase
      .from('proposals')
      .insert({
        job_id: jobId,
        freelancer_id: user.id,
        bid_amount: parseFloat(bid),
        cover_letter: coverLetter,
        status: 'applied' // Default status
      })

    if (submitError) {
      setErrorMsg(submitError.message)
      setSubmitting(false)
    } else {
      // Success! Redirect to dashboard
      router.push('/freelancer/dashboard?success=true')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Job Details...</div>

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER: JOB SUMMARY */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-8">
          <Link href="/find-work" className="text-sm text-slate-400 hover:text-blue-600 mb-4 inline-block">← Back to Job Search</Link>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
          <div className="flex gap-4 text-sm text-slate-500 font-medium mb-6">
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">Budget: ${job.budget}</span>
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full">Client: {job.clients?.full_name || 'Verified Client'}</span>
          </div>
          <p className="text-slate-600 leading-relaxed">{job.description}</p>
        </div>

        {/* PROPOSAL FORM */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit Your Proposal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Bid Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Bid ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">$</span>
                <input 
                  type="number" 
                  required
                  className="w-full pl-8 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold text-slate-900"
                  placeholder={job.budget}
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">Includes SkillBridge Service Fee (10%)</p>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Cover Letter</label>
              <textarea 
                required
                rows={6}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
                placeholder="Explain why you are the best fit for this job..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/find-work" className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition">Cancel</Link>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send Proposal'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}