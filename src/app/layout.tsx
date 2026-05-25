import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { 
  title: 'nepalitype - प्रीति कीबोर्ड टाइपिङ अभ्यास',
  description: 'Nepali typing practice with Preeti keyboard layout'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne">
      <body>
        {children}
        </body>
    </html>
  )
}