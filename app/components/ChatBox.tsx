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
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  // Lock chat if status is just 'applied'
  const isLocked = status === 'applied'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isLocked) {
      setLoading(false)
      return
    }

    let isMounted = true

    // 1. Fetch History
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('created_at', { ascending: true })
      
      if (error) console.error('Error fetching messages:', error)
      
      if (isMounted && data) {
        setMessages(data)
        setLoading(false)
        setTimeout(scrollToBottom, 200)
      }
    }
    fetchMessages()

    // 2. Real-time Listener
    const channel = supabase
      .channel(`room_${proposalId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `proposal_id=eq.${proposalId}` 
      }, (payload) => {
        if (isMounted) {
          setMessages((prev) => [...prev, payload.new])
          setTimeout(scrollToBottom, 100)
        }
      })
      .subscribe()

    return () => { 
      isMounted = false
      supabase.removeChannel(channel) 
    }
  }, [proposalId, isLocked])

  const handleSend = async () => {
    if (!newMessage.trim()) return

    // Security Check
    const security = checkMessageSafety(newMessage)
    if (!security.safe) {
      alert(`🛡️ Security Alert: ${security.reason}`)
      return
    }

    // Send to DB
    const { error } = await supabase.from('messages').insert({
      proposal_id: proposalId,
      sender_id: currentUserId,
      content: newMessage
    })

    if (error) {
      alert('Failed to send: ' + error.message)
    } else {
      setNewMessage('')
    }
  }

  // Helper to make links clickable
  const renderContent = (text: string) => {
    if (!text) return "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold text-yellow-300 break-all hover:text-white">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  if (isLocked) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-slate-50 border rounded-2xl text-slate-400">
        <span className="text-3xl mb-2">🔒</span>
        <p>Chat Locked until interview starts.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-slate-800">Secure Workroom</span>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-4">
        {loading && <div className="text-center text-xs text-slate-400">Loading history...</div>}
        
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          // Check if it's a system message (Work Submission)
          const isSystem = msg.content && msg.content.includes("✅ WORK SUBMITTED");
          
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                isSystem ? 'bg-emerald-600 text-white border-emerald-500' :
                isMe ? 'bg-blue-600 text-white rounded-br-none' : 
                'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                {renderContent(msg.content)}
                <div className={`text-[10px] mt-1 text-right opacity-70`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button onClick={handleSend} className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-blue-600 transition">
          Send
        </button>
      </div>
    </div>
  )
}