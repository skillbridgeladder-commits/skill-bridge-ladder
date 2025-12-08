'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'

export default function PostJob() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [budgetType, setBudgetType] = useState('Fixed Price') // Fixed or Hourly
  const [experience, setExperience] = useState('Intermediate')
  const [skills, setSkills] = useState('') // Comma separated string

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("You must be logged in.")

      // 2. Prepare Skills Array (Convert string "React, CSS" to ["React", "CSS"])
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0)

      // 3. Insert into Database
      const { error } = await supabase
        .from('jobs')
        .insert({
          client_id: user.id,
          title,
          description,
          budget: parseFloat(budget),
          budget_type: budgetType,
          experience_level: experience,
          skills: skillsArray,
          status: 'open',
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // 4. Success
      router.push('/client/dashboard')

    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Post a New Job</h1>
            <p className="text-slate-500">Reach thousands of verified freelancers in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Job Title</label>
              <input 
                type="text" 
                required 
                className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold text-lg placeholder:font-normal bg-white"
                placeholder="e.g. Build a React Dashboard"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
              <textarea 
                required 
                rows={6}
                className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 leading-relaxed bg-white"
                placeholder="Describe the project details, deliverables, and requirements..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Two Column Row */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Budget */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Budget ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    required 
                    className="w-full pl-8 p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold bg-white"
                    placeholder="500"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                  />
                </div>
              </div>

              {/* Budget Type */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Payment Type</label>
                <select 
                  className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                  value={budgetType}
                  onChange={e => setBudgetType(e.target.value)}
                >
                  <option>Fixed Price</option>
                  <option>Hourly Rate</option>
                </select>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Experience Level</label>
                <select 
                  className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                >
                  <option>Entry Level</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Required Skills</label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                  placeholder="React, CSS, Node.js"
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button type="button" onClick={() => router.back()} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition">
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Job Now'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}