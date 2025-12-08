'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaShieldAlt, FaRocket, FaHandshake, FaLightbulb } from 'react-icons/fa'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-transparent to-slate-100/50"></div>
      </div>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto w-full">
        
        {/* 1. HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-4 block">Who We Are</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight">
            Redefining the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Future of Work.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Skill Bridge Ladder is India's first career ecosystem designed to bridge the gap between ambitious students and growing startups.
          </p>
        </div>

        {/* 2. THE ORIGIN STORY */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="relative">
             {/* Decorative blob */}
            <div className="absolute top-10 left-10 w-full h-full bg-blue-100 rounded-[2rem] -z-10"></div>
            <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
              <h2 className="text-3xl font-bold mb-6">It started with a problem.</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                In 2024, our founder <strong>Veer Bhanushali</strong> noticed a massive disconnect. Thousands of talented students in India had skills—coding, design, writing—but no way to prove them. 
              </p>
              <p className="text-slate-600 leading-relaxed">
                On the other side, startups were desperate for talent but couldn't afford expensive agencies. There was no bridge between them.
              </p>
              <p className="text-slate-600 leading-relaxed font-bold text-blue-600">
                So, we built the ladder.
              </p>
            </div>
          </div>
          
          <div className="pl-0 md:pl-10">
            <h3 className="text-2xl font-bold mb-6">Our Timeline</h3>
            <ul className="space-y-8 border-l-2 border-slate-200 pl-8 relative">
              <li className="relative">
                <span className="absolute -left-[39px] w-5 h-5 bg-blue-600 rounded-full border-4 border-slate-50"></span>
                <div className="font-bold text-slate-900">The Idea</div>
                <p className="text-slate-500 text-sm">Veer sketches the concept of a "Trust-First" marketplace.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[39px] w-5 h-5 bg-purple-600 rounded-full border-4 border-slate-50"></span>
                <div className="font-bold text-slate-900">The Team Assembles</div>
                <p className="text-slate-500 text-sm">Mahek (HR) and Yash (Ops) join to build the infrastructure.</p>
              </li>
              <li className="relative">
                <span className="absolute -left-[39px] w-5 h-5 bg-emerald-600 rounded-full border-4 border-slate-50"></span>
                <div className="font-bold text-slate-900">Launch Day</div>
                <p className="text-slate-500 text-sm">Skill Bridge Ladder goes live, connecting the first 100 users.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. OUR CORE VALUES */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">What Drives Us</h2>
            <p className="text-slate-500 mt-4">The principles that guide every decision we make.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
              <FaShieldAlt className="text-4xl text-blue-500 mb-6 group-hover:scale-110 transition" />
              <h3 className="font-bold text-lg mb-2">Trust First</h3>
              <p className="text-sm text-slate-500">We verify every user. If we can't trust them, they aren't on our platform.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
              <FaRocket className="text-4xl text-purple-500 mb-6 group-hover:scale-110 transition" />
              <h3 className="font-bold text-lg mb-2">Limitless Growth</h3>
              <p className="text-sm text-slate-500">We don't cap your earnings. The harder you work, the higher you climb.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
              <FaHandshake className="text-4xl text-emerald-500 mb-6 group-hover:scale-110 transition" />
              <h3 className="font-bold text-lg mb-2">Fair Play</h3>
              <p className="text-sm text-slate-500">Transparent fees. No hidden costs. Contracts that protect both sides.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 group">
              <FaLightbulb className="text-4xl text-amber-500 mb-6 group-hover:scale-110 transition" />
              <h3 className="font-bold text-lg mb-2">Innovation</h3>
              <p className="text-sm text-slate-500">We constantly upgrade our tech to make hiring faster and easier.</p>
            </div>
          </div>
        </div>

        {/* 4. COMPARISON: OLD VS NEW */}
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-12 relative z-10">Why we are different.</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
            {/* The Old Way */}
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-bold text-slate-400 mb-6">The Old Way</h3>
              <ul className="space-y-4 text-left text-slate-300">
                <li className="flex gap-3">❌ High commission fees (20%+)</li>
                <li className="flex gap-3">❌ Fake profiles and bots</li>
                <li className="flex gap-3">❌ Unresponsive support</li>
              </ul>
            </div>

            {/* The Skill Bridge Way */}
            <div className="bg-blue-600 p-8 rounded-2xl shadow-2xl border border-blue-400 transform scale-105">
              <h3 className="text-xl font-bold text-white mb-6">The SkillBridge Way</h3>
              <ul className="space-y-4 text-left font-medium">
                <li className="flex gap-3">✅ Low, transparent fees</li>
                <li className="flex gap-3">✅ ID-Verified Talent</li>
                <li className="flex gap-3">✅ 24/7 Local Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold mb-6">Ready to join the future?</h3>
            <Link href="/signup" className="inline-block px-10 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:scale-105 transition">
                Create Your Free Account
            </Link>
        </div>

      </main>
    </div>
  )
}