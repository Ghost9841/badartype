// app/page.tsx
'use client'
import { useEffect } from 'react'
import { useTypingStore } from '@/store/typingStore'
import { WordDisplay } from '@/components/WordDisplay'
import { StatsBar } from '@/components/StatsBar'
import { ModeBar } from '@/components/ModeBar'
import { TypingArena } from '@/components/TypingArena'
import { ResultsModal } from '@/components/ResultsModal'
import { useTimer } from '@/hooks/useTimer'

function Header() {
  return (
    <header className="flex items-center justify-between py-6 border-b border-zinc-800/50">
      <div className="flex items-baseline gap-2">
        <span className="font-preeti text-4xl text-amber-400">g</span>
        <span className="font-mono text-sm font-light text-zinc-500 tracking-tight">nepalitype</span>
      </div>
      <div className="flex gap-3">
        <span className="font-preeti text-xs text-zinc-600">प्रीति किबोर्ड</span>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="flex flex-wrap justify-center gap-4 text-xs text-zinc-600 py-6 border-t border-zinc-800/50 mt-8">
      <span>प्रीति कीबोर्ड लेआउट</span>
      <span>•</span>
      <span>Space → अर्को शब्द</span>
      <span>•</span>
      <span>Esc/Tab → रिसेट</span>
      <span>•</span>
      <span>नेपाली टाइपिङ अभ्यास</span>
    </footer>
  )
}

export default function HomePage() {
  const resetGame = useTypingStore(s => s.resetGame)
  const setWords = useTypingStore(s => s.setWords)

  useTimer()

  // Initialize words on client side only
  useEffect(() => {
    const { getRandomPreetiWords } = require('@/lib/words')
    const words = getRandomPreetiWords(80)
    setWords(words)
    resetGame()
  }, [setWords, resetGame])

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault()
        resetGame()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [resetGame])

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100">
      <div className="max-w-5xl mx-auto px-6">
        <Header />
        
        <div className="py-8 space-y-6">
          <ModeBar />
          <StatsBar />
          
          <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800/50 backdrop-blur-sm">
            <WordDisplay />
            <TypingArena />
          </div>
        </div>
        
        <Footer />
        <ResultsModal />
      </div>
    </main>
  )
}