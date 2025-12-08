'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ClientDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return <div className="p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-600">Client Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Log Out
          </button>
        </div>
        
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <h2 className="text-xl font-bold">Welcome, {user.user_metadata.full_name}!</h2>
          <p className="text-gray-600">You are here to: <strong>Hire Talent</strong></p>
        </div>

        <div className="mt-8">
          <button className="bg-black text-white text-lg px-6 py-3 rounded-lg hover:bg-gray-800">
            + Post a New Job
          </button>
        </div>
      </div>
    </div>
  )
}