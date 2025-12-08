'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import Link from 'next/link'
import { FaSearch, FaFilter, FaMapMarkerAlt, FaClock, FaDollarSign, FaCheckCircle } from 'react-icons/fa'

export default function FindWork() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    // Fetch Jobs with Client Data
    const { data } = await supabase
      .from('jobs')
      .select(`
        *,
        clients:users ( full_name, total_hires )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (data) setJobs(data)
    setLoading(false)
  }

  // Filter Logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filter ? job.budget_type === filter : true // Example filter logic
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* 1. PREMIUM HEADER SECTION */}
      <div className="bg-slate-900 pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Find work that <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">inspires you.</span>
          </h1>
          
          {/* SEARCH BAR (Fixed Invisible Text) */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex items-center max-w-3xl border border-slate-700">
            <div className="pl-4 text-slate-400"><FaSearch className="text-xl" /></div>
            <input 
              type="text" 
              placeholder="Search by title, skill, or keyword..." 
              className="flex-grow p-4 outline-none text-lg text-slate-900 placeholder:text-slate-400 font-medium bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hidden md:block">
              Search Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        
        {/* 2. SIDEBAR FILTERS (Sticky) */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg">
              <FaFilter className="text-blue-600" /> Filters
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Project Type</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-600 group-hover:text-blue-600 transition">Fixed Price</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group mt-2">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-slate-600 group-hover:text-blue-600 transition">Hourly</span>
                </label>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Experience</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-2 h-2 bg-emerald-400 rounded-full"></span> Entry Level</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> Intermediate</div>
                  <div className="flex items-center gap-2 text-sm text-slate-600"><span className="w-2 h-2 bg-purple-400 rounded-full"></span> Expert</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. JOB FEED LIST */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              {loading ? 'Searching...' : `${filteredJobs.length} Jobs Found`}
            </h2>
            <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-600 outline-none focus:border-blue-500">
              <option>Newest First</option>
              <option>Highest Budget</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl"></div>)}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all group relative overflow-hidden">
                
                {/* Status Badge */}
                <div className="absolute top-0 right-0 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-bl-2xl">
                  OPEN
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                      {job.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 text-xs md:text-sm text-slate-500 mb-4 font-medium">
                      <span className="flex items-center gap-1"><FaDollarSign /> Fixed Price</span>
                      <span className="flex items-center gap-1"><FaMapMarkerAlt /> Remote</span>
                      <span className="flex items-center gap-1"><FaClock /> Posted 2h ago</span>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Design'].map((tag) => (
                        <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Side: Budget & Apply */}
                  <div className="flex flex-col items-end gap-6 min-w-[140px]">
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-slate-900">${job.budget}</div>
                      <div className="text-xs text-slate-400 font-medium">Est. Budget</div>
                    </div>
                    
                    <Link href={`/freelancer/apply/${job.id}`} className="w-full bg-slate-900 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg transform active:scale-95">
                      Apply Now
                    </Link>

                    {/* Client Verification Status */}
                    {job.clients?.total_hires > 0 && (
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <FaCheckCircle /> Payment Verified
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}