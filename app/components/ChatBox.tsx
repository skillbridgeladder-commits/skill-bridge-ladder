'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { checkMessageSafety } from '@/app/lib/moderation'

interface ChatBoxProps {
  proposalId: number;
  currentUserId: string;
  status: string;
}

export default function ChatBox({ proposalId, currentUserId, status }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const isLocked = status === 'applied';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isLocked) {
      setLoading(false)
      return
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: true })
      
      if (data) {
        setMessages(data)
        setLoading(false)
        scrollToBottom()
      }
    }
    fetchMessages()

    const channel = supabase
      .channel(`chat_${proposalId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `proposal_id=eq.${proposalId}` 
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new])
        scrollToBottom()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [proposalId, isLocked])

  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setError('')

    const security = checkMessageSafety(newMessage)
    if (!security.safe) {
      setError(`🛡️ Security Alert: ${security.reason}`)
      return;
    }

    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        proposal_id: proposalId,
        sender_id: currentUserId,
        content: newMessage
      })

    if (sendError) alert('Error: ' + sendError.message)
    else setNewMessage('')
  }

  if (isLocked) {
    return (
      <div className="h-96 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8">
        <span className="text-4xl mb-4">🔒</span>
        <h3 className="font-bold text-slate-700">Chat Locked</h3>
        <p className="text-slate-500 text-sm mt-2">Messages are enabled after the interview starts.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-slate-800">Secure Workroom</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
        {loading && <div className="text-center text-slate-400">Loading...</div>}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-sm ${msg.sender_id === currentUserId ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        {error && <div className="mb-2 text-xs text-red-600 font-bold">{error}</div>}
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={handleSend} className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-blue-600 transition">Send</button>
        </div>
      </div>
    </div>
  )
}