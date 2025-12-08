import Image from 'next/image'
import Link from 'next/link'
// Importing real icons
import { FaApple, FaGooglePlay, FaInstagram, FaLinkedin, FaTwitter, FaFacebookF } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-900 z-50 relative pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16 border-b border-slate-800 pb-12">
          
          {/* Column 1: Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Company</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link href="/company/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link href="/founders" className="hover:text-blue-400">Leadership</Link></li>
              <li><Link href="/company/careers" className="hover:text-blue-400">Careers</Link></li>
              <li><Link href="/company/impact" className="hover:text-blue-400">Our Impact</Link></li>
            </ul>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4">Support</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link href="/support/help" className="hover:text-blue-400">Help Center</Link></li>
              <li><Link href="/support/trust" className="hover:text-blue-400">Trust & Safety</Link></li>
              <li><Link href="/support/contact" className="hover:text-blue-400">Contact Us</Link></li>
            </ul>
          </div>

           {/* Column 3: Links */}
           <div>
            <h4 className="font-bold text-sm text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><Link href="/legal/terms" className="hover:text-blue-400">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link href="/legal/ca-notice" className="hover:text-blue-400">CA Notice at Collection</Link></li>
              <li><Link href="/legal/accessibility" className="hover:text-blue-400">Accessibility</Link></li>
            </ul>
          </div>

          {/* Column 4 & 5 Combined: Apps & Social */}
          <div className="col-span-2">
            
            {/* Mobile App Buttons */}
            <h4 className="font-bold text-sm text-white mb-4">Mobile App</h4>
            <div className="flex flex-wrap gap-3 mb-8">
              <button className="flex items-center gap-3 bg-transparent border border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-800 transition group">
                <FaApple className="text-2xl text-white group-hover:text-gray-200" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 leading-none">Download on the</div>
                  <div className="text-sm font-bold text-white leading-tight">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 bg-transparent border border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-800 transition group">
                <FaGooglePlay className="text-xl text-white group-hover:text-gray-200" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 leading-none">Get it on</div>
                  <div className="text-sm font-bold text-white leading-tight">Google Play</div>
                </div>
              </button>
            </div>

            {/* Social Icons */}
            <h4 className="font-bold text-sm text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/skillbridge_ladder/" target="_blank" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition text-white">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-black transition text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition text-white">
                <FaFacebookF size={20} />
              </a>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-800 pt-8">
          <p className="text-xs text-slate-500">&copy; 2025 Skill Bridge Ladder Global Inc.</p>
          
          {/* Privacy Choices Toggle */}
          <div className="flex items-center gap-6">
            <Link href="/legal/privacy-choices" className="flex items-center gap-3 group cursor-pointer">
              <span className="text-xs font-bold text-slate-300 group-hover:text-white transition">Your Privacy Choices</span>
              {/* THE TOGGLE ICON */}
              <div className="relative w-10 h-5 bg-blue-600 rounded-full flex items-center px-0.5 shadow-inner">
                <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-5"></div>
                <div className="absolute left-1.5 text-[8px] text-white font-bold">✓</div>
                <div className="absolute right-1.5 text-[8px] text-blue-200 font-bold">✕</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}