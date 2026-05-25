// lib/scoring.ts
export function calcWpm(correctWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) return 0
  return Math.round((correctWords / elapsedSeconds) * 60)
}

export function calcAccuracy(correct: number, errors: number): number {
  const total = correct + errors
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

export type CharState = 'correct' | 'wrong' | 'extra' | 'pending'

export interface CharResult {
  char: string
  state: CharState
}

function graphemes(str: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('ne', { granularity: 'grapheme' })
    return [...seg.segment(str)].map((s) => s.segment)
  }
  return [...str]
}

export function diffWord(target: string, typed: string): CharResult[] {
  const targetChars = [...target]
  const typedChars = [...typed]

  const results: CharResult[] = targetChars.map((char, i) => {
    if (i >= typedChars.length) {
      return { char, state: 'pending' }
    }
    return {
      char,
      state: typedChars[i] === char ? 'correct' : 'wrong',
    }
  })

  const extras = typedChars.slice(targetChars.length)
  extras.forEach((char) => results.push({ char, state: 'extra' }))

  return results
}