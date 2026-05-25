// store/typingStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calcAccuracy, calcWpm } from '@/lib/scoring'
import { getRandomPreetiWords } from '@/lib/words'

export type Status = 'idle' | 'running' | 'finished'

interface TypingState {
  // Data
  words: string[]           // Preeti encoded words
  typedWord: string
  completedWords: string[]
  currentIndex: number
  errors: number
  correctCount: number
  wpm: number
  accuracy: number
  timeLeft: number
  duration: number
  status: Status
  
  // Actions
  setWords: (words: string[]) => void
  setTypedWord: (word: string) => void
  submitWord: () => void
  startGame: () => void
  resetGame: () => void
  setDuration: (duration: number) => void
  tick: () => void
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      // Initial state
      words: [],
      typedWord: '',
      completedWords: [],
      currentIndex: 0,
      errors: 0,
      correctCount: 0,
      wpm: 0,
      accuracy: 100,
      timeLeft: 60,
      duration: 60,
      status: 'idle',

      setWords: (words) => set({ words }),

      setTypedWord: (typedWord) => set({ typedWord }),

      setDuration: (duration) => {
        set({ duration, timeLeft: duration })
        get().resetGame()
      },

      submitWord: () => {
        const { 
          typedWord, words, currentIndex, errors, correctCount,
          completedWords, duration, timeLeft
        } = get()
        
        const trimmed = typedWord.trim()
        if (!trimmed) return
        
        const isCorrect = trimmed === words[currentIndex]
        const newErrors = isCorrect ? errors : errors + 1
        const newCorrect = isCorrect ? correctCount + 1 : correctCount
        const newIndex = currentIndex + 1
        const elapsed = Math.max(duration - timeLeft, 1)
        
        const newWpm = calcWpm(newCorrect, elapsed)
        const newAccuracy = calcAccuracy(newCorrect, newErrors)
        
        set({
          typedWord: '',
          currentIndex: newIndex,
          errors: newErrors,
          correctCount: newCorrect,
          completedWords: [...completedWords, trimmed],
          wpm: newWpm,
          accuracy: newAccuracy,
        })
        
        if (newIndex >= words.length) {
          set({ status: 'finished' })
        }
      },

      startGame: () => {
        const { duration, words } = get()
        if (words.length === 0) return
        set({ 
          status: 'running', 
          timeLeft: duration
        })
      },

      resetGame: () => {
        const { duration } = get()
        const words = getRandomPreetiWords(80)
        
        set({
          words,
          typedWord: '',
          completedWords: [],
          currentIndex: 0,
          errors: 0,
          correctCount: 0,
          wpm: 0,
          accuracy: 100,
          timeLeft: duration,
          status: 'idle',
        })
      },

      tick: () => {
        const { timeLeft, status, currentIndex, errors, duration, correctCount } = get()
        if (status !== 'running') return
        
        if (timeLeft <= 1) {
          const elapsed = duration
          const finalWpm = calcWpm(correctCount, elapsed)
          const finalAccuracy = calcAccuracy(correctCount, errors)
          set({
            status: 'finished',
            timeLeft: 0,
            wpm: finalWpm,
            accuracy: finalAccuracy,
          })
        } else {
          const newTimeLeft = timeLeft - 1
          const elapsed = duration - newTimeLeft
          const newWpm = calcWpm(correctCount, Math.max(elapsed, 1))
          
          set({ 
            timeLeft: newTimeLeft,
            wpm: newWpm,
          })
        }
      },
    }),
    {
      name: 'nepalitype-settings',
      partialize: (state) => ({ duration: state.duration }),
    }
  )
)