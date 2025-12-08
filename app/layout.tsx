import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar' // Import your new Navbar
import Footer from './components/Footer' // Import your new Footer

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skill Bridge Ladder',
  description: 'The #1 Freelancing Platform in India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 1. Navbar is here, so it shows on every page */}
        <Navbar />
        
        {/* 2. This {children} part is where your Page content goes */}
        <div className="pt-20"> 
          {children}
        </div>

        {/* 3. Footer is here, so it shows on every page */}
        <Footer />
      </body>
    </html>
  )
}