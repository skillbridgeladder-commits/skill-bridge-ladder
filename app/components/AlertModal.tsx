'use client'

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'error' | 'success' | 'warning';
  onClose: () => void;
}

export default function AlertModal({ isOpen, title, message, type = 'error', onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all scale-100 border border-white/50">
        
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto ${
          type === 'error' ? 'bg-red-100 text-red-500' : 
          type === 'success' ? 'bg-green-100 text-green-500' : 'bg-amber-100 text-amber-500'
        }`}>
          {type === 'error' ? '🚫' : type === 'success' ? '✅' : '⚠️'}
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-500 leading-relaxed mb-8">{message}</p>
          
          <button 
            onClick={onClose}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
              type === 'error' ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 
              type === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-200' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
            }`}
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  )
}