// components/WordDisplay.tsx
'use client'
import { useEffect, useRef } from 'react'
import { useTypingStore } from '@/store/typingStore'
import { diffWord } from '@/lib/scoring'

function CharSpan({ char, state }: { char: string; state: 'correct' | 'wrong' | 'extra' | 'pending' }) {
  const colors = {
    correct: 'text-amber-400',
    wrong: 'text-red-500 bg-red-500/10 rounded',
    extra: 'text-red-700 line-through',
    pending: 'text-zinc-600'
  }
  return <span className={`${colors[state]} transition-colors duration-75`}>{char}</span>
}

export function WordDisplay() {
  const words = useTypingStore(s => s.words)
  const currentIndex = useTypingStore(s => s.currentIndex)
  const typedWord = useTypingStore(s => s.typedWord)
  const completedWords = useTypingStore(s => s.completedWords)
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current
      const active = activeRef.current
      const scrollLeft = active.offsetLeft - container.offsetLeft
      if (scrollLeft > container.clientWidth * 0.7) {
        container.scrollTo({ left: scrollLeft - container.clientWidth * 0.3, behavior: 'smooth' })
      }
    }
  }, [currentIndex])

  return (
    <div 
      ref={containerRef}
      className="flex flex-wrap gap-x-3 gap-y-4 max-h-48 overflow-y-auto select-none cursor-text font-preeti text-2xl"
    >
      {words.map((word, wi) => {
        const isCurrent = wi === currentIndex
        const isPast = wi < currentIndex
        
        let charResults = null
        if (isCurrent) {
          charResults = diffWord(word, typedWord)
        } else if (isPast && completedWords[wi]) {
          charResults = diffWord(word, completedWords[wi])
        }
        
        return (
          <span
            key={wi}
            ref={isCurrent ? activeRef : undefined}
            className={`whitespace-nowrap leading-relaxed transition-all duration-100
              ${isCurrent ? 'border-b-2 border-amber-500 -mb-0.5' : ''}
              ${isPast ? 'opacity-60' : ''}
            `}
          >
            {charResults
              ? charResults.map((cr, ci) => <CharSpan key={ci} char={cr.char} state={cr.state} />)
              : [...word].map((ch, ci) => <span key={ci} className="text-zinc-600">{ch}</span>)
            }
          </span>
        )
      })}
    </div>
  )
}