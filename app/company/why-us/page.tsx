'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaShieldAlt, FaUserCheck, FaRupeeSign, FaHeadset } from 'react-icons/fa'

export default function WhyUs() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* 1. GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-transparent to-slate-100/50"></div>
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        
        {/* HERO */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">The SkillBridge Difference</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Why the top 1% choose <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">SkillBridge.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            We aren't just another job board. We are the safest, fastest, and most transparent ecosystem built specifically for the Indian market.
          </p>
        </div>

        {/* REASON GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          
          {/* Card 1: Escrow */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-blue-500 transition-all duration-300 group">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-blue-600 group-hover:scale-110 transition">
              <FaShieldAlt />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Ironclad Escrow</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Trust is automated.</strong> When a client hires, the money is held safely by us. It is only released to the freelancer when the work is approved. Zero scams, zero non-payments.
            </p>
          </div>

          {/* Card 2: Verification */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-purple-500 transition-all duration-300 group">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-purple-600 group-hover:scale-110 transition">
              <FaUserCheck />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">ID-Verified Talent</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>No bots. No fakes.</strong> Every freelancer and client goes through identity verification. You know exactly who you are working with, every single time.
            </p>
          </div>

          {/* Card 3: No Hidden Fees */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-emerald-500 transition-all duration-300 group">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-emerald-600 group-hover:scale-110 transition">
              <FaRupeeSign />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">Zero Hidden Fees</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>Keep what you earn.</strong> We have the most transparent fee structure in the industry. No surprise withdrawal fees or currency conversion losses.
            </p>
          </div>

          {/* Card 4: Local Support */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-amber-500 transition-all duration-300 group">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6 text-amber-600 group-hover:scale-110 transition">
              <FaHeadset />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-900">24/7 India Support</h3>
            <p className="text-slate-600 leading-relaxed">
              <strong>We speak your language.</strong> Our support team is based in India, not a bot. If you have a dispute or a question, a real human helps you solve it instantly.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900 to-slate-900 opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Stop gambling with your career.</h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Join 10,000+ others who switched to the safer, faster way to work.
            </p>
            <Link href="/signup" className="inline-block px-10 py-4 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-105 transition hover:bg-blue-50">
              Get Started for Free
            </Link>
          </div>
        </div>

      </main>
    </div>
  )
}