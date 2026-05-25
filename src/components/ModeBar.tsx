// components/ModeBar.tsx
'use client'
import { useTypingStore } from '@/store/typingStore'

export function ModeBar() {
  const duration = useTypingStore(s => s.duration)
  const status = useTypingStore(s => s.status)
  const setDuration = useTypingStore(s => s.setDuration)
  const resetGame = useTypingStore(s => s.resetGame)

  const durations = [15, 30, 60, 120]

  const handleDurationChange = (d: number) => {
    setDuration(d)
    resetGame()
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3 border-b border-zinc-800">
      <div className="flex items-center gap-1">
        <span className="text-xs text-zinc-500 font-mono mr-2">समय</span>
        {durations.map(d => (
          <button
            key={d}
            onClick={() => handleDurationChange(d)}
            disabled={status === 'running'}
            className={`font-mono text-sm px-3 py-1 rounded-md transition-all duration-150
              ${duration === d 
                ? 'bg-amber-500/20 text-amber-400' 
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }
              ${status === 'running' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {d}
          </button>
        ))}
      </div>
      
      <div className="w-px h-5 bg-zinc-800" />
      
      <div className="flex items-center gap-2">
        <span className="font-preeti text-amber-400/80 text-sm">प्रीति</span>
        <span className="text-xs text-zinc-600">किबोर्ड लेआउट</span>
      </div>
    </div>
  )
}