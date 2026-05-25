// hooks/useTimer.ts
import { useEffect } from 'react'
import { useTypingStore } from '@/store/typingStore'

export function useTimer() {
  const status = useTypingStore(s => s.status)
  const tick = useTypingStore(s => s.tick)

  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [status, tick])
}