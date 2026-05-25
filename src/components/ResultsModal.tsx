// components/ResultsModal.tsx
'use client'
import { useEffect } from 'react'
import { useTypingStore } from '@/store/typingStore'

export function ResultsModal() {
  const status = useTypingStore(s => s.status)
  const wpm = useTypingStore(s => s.wpm)
  const accuracy = useTypingStore(s => s.accuracy)
  const errors = useTypingStore(s => s.errors)
  const correctCount = useTypingStore(s => s.correctCount)
  const duration = useTypingStore(s => s.duration)
  const resetGame = useTypingStore(s => s.resetGame)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (status === 'finished' && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
        resetGame()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [status, resetGame])

  if (status !== 'finished') return null

  const getRating = () => {
    if (wpm >= 70 && accuracy >= 95) return { emoji: '🏆', text: 'उत्कृष्ट!', color: 'text-yellow-400' }
    if (wpm >= 45 && accuracy >= 90) return { emoji: '🎯', text: 'राम्रो!', color: 'text-green-400' }
    if (wpm >= 25) return { emoji: '👍', text: 'राम्रो प्रयास', color: 'text-blue-400' }
    return { emoji: '💪', text: 'अभ्यास जारी राख्नुहोस्', color: 'text-zinc-400' }
  }

  const rating = getRating()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <span className="text-6xl mb-2 block">{rating.emoji}</span>
          <h2 className={`text-2xl font-preeti ${rating.color}`}>{rating.text}</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center">
            <div className="font-mono text-4xl font-light text-amber-400 tabular-nums">
              {wpm}
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">WPM</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-4xl font-light text-amber-400 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">शुद्धता</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-light text-green-400 tabular-nums">
              {correctCount}
            </div>
            <div className="text-xs text-zinc-500">सही</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-light text-red-400 tabular-nums">
              {errors}
            </div>
            <div className="text-xs text-zinc-500">गल्ती</div>
          </div>
        </div>
        
        <button
          onClick={resetGame}
          className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-mono text-sm py-3 rounded-lg transition-all duration-150"
        >
          फेरि खेल्नुहोस् ⏎
        </button>
        
        <p className="text-center text-xs text-zinc-600 mt-4">
          Enter, Space, or Escape to continue
        </p>
      </div>
    </div>
  )
}