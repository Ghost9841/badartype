// components/TypingArena.tsx
'use client'
import { useRef, useCallback, useEffect } from 'react'
import { useTypingStore } from '@/store/typingStore'

export function TypingArena() {
  const inputRef = useRef<HTMLInputElement>(null)
  const composingRef = useRef(false)
  
  const status = useTypingStore(s => s.status)
  const typedWord = useTypingStore(s => s.typedWord)
  const setTypedWord = useTypingStore(s => s.setTypedWord)
  const submitWord = useTypingStore(s => s.submitWord)
  const startGame = useTypingStore(s => s.startGame)
  const resetGame = useTypingStore(s => s.resetGame)

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  useEffect(() => {
    focusInput()
  }, [focusInput])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'idle') startGame()
    const value = e.target.value
    
    if (!composingRef.current && (value.endsWith(' ') || value.endsWith('\n'))) {
      submitWord()
    } else {
      setTypedWord(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (composingRef.current) return
    
    if (e.key === ' ') {
      e.preventDefault()
      if (typedWord.trim()) submitWord()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      submitWord()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      resetGame()
      focusInput()
    } else if (e.key === 'Tab') {
      e.preventDefault()
      resetGame()
      focusInput()
    }
  }

  return (
    <div className="relative w-full min-h-15" onClick={focusInput}>
      <input
        ref={inputRef}
        type="text"
        value={typedWord}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => { composingRef.current = true }}
        onCompositionEnd={(e) => {
          composingRef.current = false
          setTypedWord((e.target as HTMLInputElement).value)
        }}
        disabled={status === 'finished'}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text"
        aria-label="Typing input"
      />
      
      {status === 'idle' && (
        <div className="text-center py-4">
          <p className="font-preeti text-zinc-500 text-xl animate-pulse">
            g k|f]u u/]/ k|f]u'xf];\
          </p>
          <p className="text-xs text-zinc-600 mt-2">टाइप गर्न सुरु गर्नुहोस्</p>
        </div>
      )}
    </div>
  )
}