import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-100 overflow-hidden">
      
      {/* 1. GLOBAL BACKGROUND (Same as Founders Page) */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-slate-50"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px] opacity-40"></div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="pt-20 pb-32 px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">The #1 Platform in India</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
            Work without <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500">Limits.</span> <br />
            Hire without <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500">Fear.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join the ecosystem where ambition meets opportunity. Verified talent, secure payments, and a ladder to your success.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/signup" className="group relative px-10 py-4 bg-slate-900 text-white text-lg font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1">
              Find Work
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-bounce">FREE</span>
            </Link>
            <Link href="/signup" className="px-10 py-4 bg-white text-blue-600 border border-slate-200 text-lg font-bold rounded-2xl hover:border-blue-600 hover:shadow-lg transition-all hover:-translate-y-1">
              Hire Talent
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURE CARDS (Glass Effect) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6">🛡️</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">100% Secure</h3>
            <p className="text-slate-500 leading-relaxed">Payments are held in Escrow. Money is only released when you are happy with the work.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
             <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6">🚀</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Verified Talent</h3>
            <p className="text-slate-500 leading-relaxed">Every freelancer passes a skill check. No bots, no fakes, just pure talent.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/60 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
             <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6">⚡</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Fast Hiring</h3>
            <p className="text-slate-500 leading-relaxed">Post a job and get proposals in minutes. Chat instantly and start working today.</p>
          </div>

        </div>
      </section>
    </div>
  )
}