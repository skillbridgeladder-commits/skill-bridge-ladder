'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FaBell } from 'react-icons/fa' // Ensure you have react-icons installed

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Notification State
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // 1. Get Profile
        const { data: prof } = await supabase.from('users').select('*').eq('id', user.id).single()
        setProfile(prof)

        // 2. Get Notifications
        fetchNotifications(user.id)

        // 3. Listen for New Notifications (Real-time)
        const channel = supabase
          .channel('realtime_notifs')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
            setNotifications(prev => [payload.new, ...prev])
            // Play a sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3')
            audio.play().catch(()=>{})
          })
          .subscribe()

        return () => { supabase.removeChannel(channel) }
      }
    }
    init()
  }, [])

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false) // Only show unread
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) setNotifications(data)
  }

  const markRead = async (id: number, link: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
    setShowNotifs(false)
    if(link) router.push(link)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const dashboardLink = profile?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard'

  return (
    <nav className="absolute w-full z-50 top-0 left-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
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
          
          <div className="hidden md:flex items-center gap-6 font-bold text-sm text-slate-500">
            <Link href="/company/about" className="hover:text-blue-600">About</Link>
            <Link href="/find-work" className="hover:text-blue-600">Find Work</Link>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              
              {/* NOTIFICATION BELL */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition relative"
                >
                  <FaBell className="text-lg" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* NOTIFICATION DROPDOWN */}
                {showNotifs && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-fade-in-up overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">Notifications</span>
                      <button onClick={() => setNotifications([])} className="text-xs text-blue-600 font-bold hover:underline">Clear All</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">No new notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markRead(n.id, n.link)}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                          >
                            <p className="text-sm text-slate-800 font-medium">{n.content}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* USER MENU */}
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md overflow-hidden relative">
                    {profile?.avatar_url ? (
                      <Image src={profile.avatar_url} alt="User" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">👤</div>
                    )}
                  </div>
                </button>

                {/* USER DROPDOWN */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in-up z-50">
                    <div className="px-4 py-2 border-b border-slate-50">
                      <p className="text-xs font-bold text-slate-400 uppercase">Signed In</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <Link href={dashboardLink} className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600">Dashboard</Link>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-600">My Profile</Link>
                    <div className="border-t border-slate-50 mt-2">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-bold">Sign Out</button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3">
               <Link href="/login" className="hidden md:block px-5 py-2.5 rounded-full text-slate-900 text-sm font-bold hover:bg-slate-100 transition">Log In</Link>
               <Link href="/signup" className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-blue-600 transition shadow-lg">Sign Up</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  )
}