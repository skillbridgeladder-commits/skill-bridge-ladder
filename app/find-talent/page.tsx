'use client'
import Link from 'next/link'

export default function FindTalent() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <main className="relative z-10 pt-36 pb-20 px-6 max-w-7xl mx-auto w-full">
        
        {/* HERO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Hire the best <span className="text-blue-600">Talent.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Post a job and get proposals from verified professionals in minutes.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-xl border border-slate-200 flex">
            <input 
              type="text" 
              placeholder="What skills are you looking for? (e.g. Logo Design)" 
              className="flex-grow bg-transparent px-6 py-3 outline-none text-slate-700 placeholder:text-slate-400"
            />
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="grid md:grid-cols-4 gap-6">
          {['Web Development', 'Graphic Design', 'Video Editing', 'Content Writing', 'Digital Marketing', 'App Dev', 'Data Entry', 'Virtual Assistant'].map((cat) => (
            <div key={cat} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-500 hover:shadow-md transition cursor-pointer group">
              <h3 className="font-bold text-slate-800 group-hover:text-blue-600">{cat}</h3>
              <p className="text-sm text-slate-400 mt-1">100+ Freelancers</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
            <p className="text-slate-500 mb-4">Don't want to search?</p>
            <Link href="/client/post-job" className="inline-block px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition">
                Post a Job for Free
            </Link>
        </div>

      </main>
    </div>
  )
}