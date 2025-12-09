'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()

  // Check Login Status
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        // Fetch Profile for Avatar
        const { data } = await supabase
          .from('users')
          .select('avatar_url, role')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login' // Hard refresh to clear state
  }

  const dashboardLink = profile?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'

  return (
    <nav className="absolute w-full z-50 top-0 left-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10 md:w-12 md:h-12">
             <Image src="/logo.png" alt="Logo" fill className="object-contain rounded-full" />
          </div>
          <span className="text-lg md:text-2xl font-bold tracking-tight text-slate-900 leading-none">
            SkillBridge<span className="text-blue-600">Ladder</span>
          </span>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6">
          
          {/* Public Links (Always Visible) */}
          <div className="hidden md:flex items-center gap-6 font-bold text-sm text-slate-500">
            <Link href="/company/about" className="hover:text-blue-600">About</Link>
            <Link href="/find-work" className="hover:text-blue-600">Find Work</Link>
          </div>

          {/* DYNAMIC SECTION */}
          {user ? (
            // LOGGED IN: Show Avatar & Dropdown
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <span className="text-sm font-bold text-slate-700 hidden md:block">My Account</span>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden relative">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt="User" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                  )}
                </div>
              </button>

              {/* DROPDOWN MENU */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-xs font-bold text-slate-400 uppercase">Signed In</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                  </div>
                  <Link href={dashboardLink} className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600">Dashboard</Link>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600">My Profile</Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600">Settings</Link>
                  <div className="border-t border-slate-50 mt-2">
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold">Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // NOT LOGGED IN: Show Buttons
            <div className="flex items-center gap-3">
               <Link href="/login" className="hidden md:block px-5 py-2.5 rounded-full text-slate-900 text-sm font-bold hover:bg-slate-100 transition">
                Log In
              </Link>
               <Link href="/signup" className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 transition shadow-lg">
                Sign Up
              </Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}