'use client'
import Image from 'next/image'

export default function Founders() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* 1. BACKGROUND PATTERN */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-transparent to-slate-100/50"></div>
      </div>

      {/* Note: No <Navbar> here because it comes from the Global Layout now! */}

      {/* 2. MAIN CONTENT */}
      <main className="relative z-10 pt-24 md:pt-28 pb-20 px-4 md:px-6 max-w-7xl mx-auto flex-grow w-full">
        
        {/* HERO HEADER */}
        <div className="text-center mb-16 md:mb-28 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            The Executive Team
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 mb-6 md:mb-8 tracking-tight leading-tight">
            Built by a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-blue-600 to-purple-600">Founder</span>. <br/>
            Powered by <span className="underline decoration-blue-200 decoration-4 underline-offset-4">Partners</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            One visionary leader joined by two strategic partners. Together, they are constructing the digital infrastructure for India's future.
          </p>
        </div>

        {/* --- FOUNDER CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start relative mb-20">
          
          {/* DECORATIVE BLURS */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-[80px] -z-10 hidden md:block"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-[80px] -z-10 hidden md:block"></div>

          {/* === 1. VEER BHANUSHALI (THE FOUNDER) === */}
          <div className="group relative z-20">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-400 to-blue-600 opacity-0 group-hover:opacity-100 transition duration-700 rounded-[2rem] blur"></div>
            
            <div className="relative h-full bg-white rounded-[2rem] overflow-hidden shadow-xl md:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col transform md:group-hover:-translate-y-3">
              <div className="h-72 md:h-80 relative overflow-hidden bg-slate-100">
                <Image src="/veer.png" alt="Veer Bhanushali" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-6 text-white">
                    <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded mb-2 inline-block shadow-lg">FOUNDER</div>
                    <h3 className="text-2xl md:text-3xl font-bold">Veer</h3>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-10 flex-1 flex flex-col relative">
                <div className="absolute -top-8 right-8 bg-blue-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shadow-blue-600/30">
                  👑
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Veer Bhanushali</h2>
                <p className="text-blue-600 text-xs font-black uppercase tracking-wider mb-4 md:mb-6">CEO & Visionary</p>
                <p className="text-slate-600 text-sm leading-6 md:leading-7 mb-6 md:mb-8 border-l-2 border-blue-200 pl-4">
                  "I didn't want to just build a company; I wanted to build a legacy. As the initiative taker, I ensure every step we take is a step forward for India."
                </p>
                <div className="mt-auto border-t border-slate-100 pt-4 md:pt-6">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Role</span>
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Strategy & Vision Lead</p>
                </div>
              </div>
            </div>
          </div>

          {/* === 2. MAHEK KAPDI (CO-FOUNDER) === */}
          <div className="group relative z-10 md:mt-16"> 
            <div className="absolute -inset-1 bg-gradient-to-b from-rose-400 to-purple-600 opacity-0 group-hover:opacity-100 transition duration-700 rounded-[2rem] blur"></div>
            
            <div className="relative h-full bg-white rounded-[2rem] overflow-hidden shadow-lg md:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col transform md:group-hover:-translate-y-2">
              <div className="h-64 md:h-72 relative overflow-hidden bg-slate-100">
                <Image src="/mahek.png" alt="Mahek Kapdi" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent opacity-50"></div>
                <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold">Mahek</h3>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-10 flex-1 flex flex-col relative">
                <div className="absolute -top-6 right-8 bg-white border border-gray-100 text-rose-500 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg">
                  👨‍💼
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Mahek Kapdi</h2>
                <p className="text-rose-600 text-xs font-black uppercase tracking-wider mb-4 md:mb-6">Co-Founder & HR</p>
                <p className="text-slate-600 text-sm leading-6 md:leading-7 mb-6 md:mb-8">
                  The heart of the operation. Mahek manages the people, the accounts, and the culture. He ensures that as we grow, we stay human.
                </p>
                <div className="mt-auto border-t border-slate-100 pt-4 md:pt-6">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Role</span>
                  <p className="font-semibold text-slate-800 text-sm md:text-base">People & Finance</p>
                </div>
              </div>
            </div>
          </div>

          {/* === 3. YASH HADIYA (CO-FOUNDER) === */}
          <div className="group relative z-10 md:mt-8">
            <div className="absolute -inset-1 bg-gradient-to-b from-emerald-400 to-cyan-600 opacity-0 group-hover:opacity-100 transition duration-700 rounded-[2rem] blur"></div>
            
            <div className="relative h-full bg-white rounded-[2rem] overflow-hidden shadow-lg md:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col transform md:group-hover:-translate-y-2">
              <div className="h-64 md:h-72 relative overflow-hidden bg-slate-100">
                <Image src="/yash.png" alt="Yash Hadiya" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent opacity-50"></div>
                <div className="absolute bottom-4 left-6 text-white">
                    <h3 className="text-xl md:text-2xl font-bold">Yash</h3>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-10 flex-1 flex flex-col relative">
                <div className="absolute -top-6 right-8 bg-white border border-gray-100 text-emerald-500 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-lg">
                  ⚙️
                </div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Yash Hadiya</h2>
                <p className="text-emerald-600 text-xs font-black uppercase tracking-wider mb-4 md:mb-6">Co-Founder & Ops</p>
                <p className="text-slate-600 text-sm leading-6 md:leading-7 mb-6 md:mb-8">
                  The backbone of stability. Yash runs the daily checks, real-time planning, and ensures the platform is bug-free and efficient.
                </p>
                <div className="mt-auto border-t border-slate-100 pt-4 md:pt-6">
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Role</span>
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Operations Lead</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Note: No <Footer> here because it comes from the Global Layout now! */}

    </div>
  )
}