// components/StatsBar.tsx
'use client'
import { useTypingStore } from '@/store/typingStore'

export function StatsBar() {
  const wpm = useTypingStore(s => s.wpm)
  const accuracy = useTypingStore(s => s.accuracy)
  const timeLeft = useTypingStore(s => s.timeLeft)
  const errors = useTypingStore(s => s.errors)
  const status = useTypingStore(s => s.status)

  const stats = [
    { label: 'wpm', value: wpm, format: (v: number) => `${v}` },
    { label: 'शुद्धता', value: accuracy, format: (v: number) => `${v}%` },
    { label: 'गल्ती', value: errors, format: (v: number) => `${v}` },
    { label: 'समय', value: timeLeft, format: (v: number) => `${v}s` },
  ]

  if (status === 'idle') {
    return (
      <div className="flex justify-center gap-8 py-4">
        <span className="font-preeti text-zinc-500 text-lg">{`k|f]u gk'ufpg'x'Fb} 5`}</span>
      </div>
    )
  }

  return (
    <div className="flex justify-center gap-8 py-4">
      {stats.map(({ label, value, format }) => (
        <div key={label} className="text-center">
          <div className="font-mono text-3xl font-light text-amber-400 tabular-nums">
            {format(value)}
          </div>
          <div className="font-preeti text-xs text-zinc-500 uppercase tracking-wider">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}