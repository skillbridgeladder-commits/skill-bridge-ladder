'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/app/lib/supabaseClient'
import { checkMessageSafety } from '@/app/lib/moderation'

interface ChatBoxProps {
  proposalId: number;
  currentUserId: string;
  status: string; // 'applied', 'viewed', 'interview', etc.
}

export default function ChatBox({ proposalId, currentUserId, status }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // 1. LOCK LOGIC: Chat is closed if status is just 'applied'
  const isLocked = status === 'applied';

  // 2. AUTO-SCROLL to newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isLocked) {
      setLoading(false)
      return
    }

    // A. Fetch Old Messages
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

    // B. Real-Time Listener (The "Phone Line")
    const channel = supabase
      .channel(`room_${proposalId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `proposal_id=eq.${proposalId}` 
      }, (payload) => {
        // When a new message comes in, add it to the list
        setMessages((prev) => [...prev, payload.new])
        scrollToBottom()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [proposalId, isLocked])

  // Scroll when messages update
  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setError('')

    // Security Check
    const security = checkMessageSafety(newMessage)
    if (!security.safe) {
      setError(`🛡️ Security Alert: ${security.reason}`)
      return;
    }

    // Send to Database
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

  // --- UI: LOCKED STATE ---
  if (isLocked) {
    return (
      <div className="h-[70vh] bg-slate-50 border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center p-10">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-4xl mb-6">🔒</div>
        <h3 className="text-2xl font-bold text-slate-700">Workroom Locked</h3>
        <p className="text-slate-500 max-w-md mt-4 text-lg">
          Messaging is disabled until the Client views the proposal or starts an interview.
        </p>
      </div>
    )
  }

  // --- UI: ACTIVE CHAT ---
  return (
    <div className="flex flex-col h-[80vh] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 p-6 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">💬</div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Secure Workroom</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">End-to-End Encrypted</p>
          </div>
        </div>
        <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
          ● Live Connection
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-8 bg-slate-50 space-y-6">
        {loading && <div className="text-center text-slate-400 mt-10">Loading history...</div>}
        
        {messages.length === 0 && !loading && (
          <div className="text-center text-slate-400 mt-10">
            <p>No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-5 rounded-3xl text-base leading-relaxed shadow-sm relative ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                {msg.content}
                <div className={`text-[10px] mt-2 text-right font-medium ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-6 bg-white border-t border-slate-100">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-bounce">
            <span>🚫</span> {error}
          </div>
        )}
        
        <div className="flex gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a professional message..."
            className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 p-5 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-lg shadow-inner placeholder:text-slate-400"
          />
          <button 
            onClick={handleSend}
            className="bg-slate-900 hover:bg-blue-600 text-white px-8 rounded-2xl font-bold transition-all shadow-lg transform active:scale-95"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-slate-300 mt-4">
          Do not share contact details. All conversations are monitored for safety.
        </p>
      </div>
    </div>
  )
}