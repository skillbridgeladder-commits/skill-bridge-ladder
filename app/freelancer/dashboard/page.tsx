'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function FreelancerDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login') // Kick them out if not logged in
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
          <h1 className="text-3xl font-bold text-blue-600">Freelancer Dashboard</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Log Out
          </button>
        </div>
        
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <h2 className="text-xl font-bold">Welcome, {user.user_metadata.full_name}!</h2>
          <p className="text-gray-600">Your current role: <strong>Freelancer</strong></p>
          <p className="mt-2">Credits: 0 (You need credits to apply for jobs)</p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Find Work</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center text-gray-400">
            Job Feed will appear here...
          </div>
        </div>
      </div>
    </div>
  )
}