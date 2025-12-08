'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { checkMessageSafety } from '@/app/lib/moderation'
import Image from 'next/image'

interface ChatBoxProps {
  proposalId: number;
  currentUserId: string;
  status: string; // 'applied', 'viewed', 'interview_round_1', etc.
}

export default function ChatBox({ proposalId, currentUserId, status }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // 1. Check if Chat should be LOCKED
  const isLocked = status === 'applied';

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isLocked) return;

    // Fetch History
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: true })
      
      if (data) {
        setMessages(data)
        scrollToBottom()
      }
    }
    fetchMessages()

    // Real-time Subscription
    const channel = supabase
      .channel(`chat_${proposalId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `proposal_id=eq.${proposalId}` }, (payload) => {
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

    // 1. RUN SECURITY CHECK
    const security = checkMessageSafety(newMessage)
    if (!security.safe) {
      setError(`🛡️ Security Alert: ${security.reason}`)
      return;
    }

    // 2. SEND MESSAGE
    const { error: sendError } = await supabase
      .from('messages')
      .insert({
        proposal_id: proposalId,
        sender_id: currentUserId,
        content: newMessage
      })

    if (sendError) {
      alert('Failed to send: ' + sendError.message)
    } else {
      setNewMessage('')
    }
  }

  // --- RENDER LOCKED STATE ---
  if (isLocked) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center h-[500px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-3xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-slate-700">Messaging Locked</h3>
        <p className="text-slate-500 max-w-sm mt-2">
          To protect both parties, messaging is only enabled after the Client has viewed your proposal or started an interview.
        </p>
      </div>
    )
  }

  // --- RENDER CHAT UI ---
  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">💬</div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Secure Workroom</h3>
            <p className="text-xs text-slate-400">End-to-end encrypted</p>
          </div>
        </div>
        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          ● Online
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}>
                {msg.content}
                <div className={`text-[10px] mt-2 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {error && (
          <div className="mb-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
            <span>🚫</span> {error}
          </div>
        )}
        
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="bg-slate-900 hover:bg-blue-600 text-white px-6 rounded-xl font-bold transition-colors shadow-lg"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-slate-300 mt-3">
          All conversations are monitored for safety and security.
        </p>
      </div>
    </div>
  )
}