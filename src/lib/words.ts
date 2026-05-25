// lib/words.ts
// Preeti encoded Nepali words - these are what users will type

export const PREETI_WORD_POOL: string[] = [
  // Basic words
  'Ur', 'dfg]5]', 'kfgL', 'vfgf', 'sfd', 'zdo', 'lbg', 'rft', 'af6f]', 'NfpF',
  'b]z', 'zxr', 'ufpF', 'gfd', 'xft', 'cfFvf', 'd[v', 'dg', 'hLjg', 'z+zf/',
  'cfsfz', 'kxfp', 'gbL', 'h+un', 'df6f]', 'cfuf]', 'xfjf', 'z\'_{o{', 'rGb|', 'tftf',
  'km"n', 'z"v', 'kft', 'kn', 'ljBfno', 'lstfa', 'snf', 'sfuh', 'k9fO', 'lzIfs',
  'cfdf', 'a\'jf', 'bfO', 'lbbL', 'efO', 'axlgL', 'Rf]/f', 'Rf]/L', 'zfyL', 'ldq',
  
  // More words
  '/fDf|f]', 'g/fDf|f]', 'NHnf]', 'zfgf]', 'nfdf]', 'Rf]6f]', 'gofF', 'k\'/fgf]', 'zkf', 'uf{dL',
  'ca', 'klg', 'cfh', 'lxhf]', 'ef]ln', 'oxfF', 'ToxfF', 'sxfF', 'lsg', 's;/L',
  'k|]d', 'zflGt', 'zTo', 'Gofo', 'wd{', 'z+:s[lt', 'zkgf', 'cfzf', 'p/', 'v\'zL',
  'Ps', 'b\'O', 'tLg', 'rf/', 'kfFr', 'xKtf', 'dlxgf', 'j{if', 'uf8L', 'Yf]sf',
  'zfyL', 'ldq', '3f8L', 'emf]nf', 'dfof', 'b\'Mv', 'v\'zL', 'zlSt', 'zfxz', 'ljZjfz',
  
  // Verbs
  'hfg]', 'cfpg]', 'vfg]', 'lng]', 's]bg]', '7fpg]', ']/fg]', 'k9g]', 'lnOG]', 'n]vg]',
  'ufpg]', 'l;4g]', 'lgs]', 'kfpg]', 'dfqg]', 'b]vfg]', 'd]/fg]', 'lhg]', 'l36g]', 'd\'n]sg]',
  
  // Adjectives
  'k|yd', 'a\'em]', 'a\'Fbf', ';\'emf]', 'o;f]', 'c;f]', 'cfwfl/t', 'c:yf', 'k|ltjif{', 'k|foL',
  'ljsf;', 'ljk/]', 'cToGt', 'nfu]', 'l;d]t', 'xfn]', 'a\'faL', 'ufpF8f]', 'cfOk', 'uf]i7',
  
  // Numbers
  'Ps', 'b\'O', 'tLg', 'rf/', 'kfFr', '5', 'tLg', 'cf7', 'cf7', 'b\'O',
  'lhNnf', 'ufp]G8fNnf', 'a\'9L', 'ltLt', 'k|f}]nL', 'ljBfnL', 'aLnf', 'tfn', 'dlxgf', 'j{if',
]

export function getRandomPreetiWords(count: number): string[] {
  const pool = [...PREETI_WORD_POOL]
  
  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  
  const result: string[] = []
  while (result.length < count) {
    result.push(...pool.slice(0, count - result.length))
  }
  return result.slice(0, count)
}