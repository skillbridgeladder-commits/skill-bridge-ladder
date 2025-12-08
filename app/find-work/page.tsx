'use client'
import Link from 'next/link'

export default function FindWork() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <main className="relative z-10 pt-36 pb-20 px-6 max-w-7xl mx-auto w-full">
        
        {/* HERO */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Find work that <br/> <span className="text-emerald-600">matters.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-8">
              Browse thousands of jobs in tech, design, marketing, and more.
            </p>
            <div className="flex gap-4">
               <input 
                type="text" 
                placeholder="Search jobs..." 
                className="bg-white px-6 py-4 rounded-xl border border-slate-200 shadow-sm w-full md:w-96 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition">
                Search
              </button>
            </div>
          </div>
          
          {/* STAT CARD */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 rotate-2">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">New Jobs Today</div>
            <div className="text-6xl font-extrabold text-slate-900">482</div>
          </div>
        </div>

        {/* JOB LIST (Mock Data) */}
        <div className="space-y-4">
          {[1, 2, 3].map((job) => (
            <div key={job} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500 transition cursor-pointer flex justify-between items-center group">
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600">Frontend Developer for Startup</h3>
                <p className="text-slate-500 mt-1">Remote • Fixed Price • Expert Level</p>
              </div>
              <span className="text-lg font-bold text-slate-900">$500</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}