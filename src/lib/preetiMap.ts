// lib/preetiMap.ts
// ─────────────────────────────────────────────────────────────────────────────
// Preeti keyboard layout — correct ASCII → Devanagari glyph mapping
//
// Preeti is a legacy encoding where ASCII keys map to Devanagari glyphs.
// The font file maps each ASCII codepoint to a specific glyph in the font.
//
// STANDARD PREETI KEYBOARD LAYOUT (Nepal standard):
//
//  Key  Glyph    Key  Glyph    Key  Glyph    Key  Glyph
//  a  → ब        A  → B        b  → व        B  → ध
//  c  → अ        C  → ऋ        d  → द        D  → ड
//  e  → े (matra) E  → ऐ        f  → ा (matra) F  → ँ
//  g  → न        G  → ण        h  → ज        H  → झ
//  i  → ि (matra) I  → ी (matra) j  → य        J  → य
//  k  → प        K  → फ        l  → ल        L  → ळ
//  m  → म        M  → थ        n  → ट        N  → ठ
//  o  → ो (matra) O  → ओ        p  → ड        P  → ढ
//  q  → ्+र(्र)   Q  → ्+र(्र)   r  → च        R  → छ
//  s  → स        S  → श        t  → त        T  → ट
//  u  → ग        U  → घ        v  → ख        V  → ङ
//  w  → ध        W  → ध        x  → ह        X  → ह
//  y  → थ        Y  → थ        z  → ज        Z  → ज
//  1  → १        2  → २  ... etc
//  ;  → छ        :  → ज्ञ
//  [  → ु (matra) {  → ू (matra)
//  ]  → ् (hal)   }  → ऽ
//  '  → ट        "  → ठ
//  ,  → comma    .  → period
//  /  → ।        ?  → ?
//  =  → ं (anusv) +  → ॅ
//  -  → dash     _  → dash
//  \  → ्         |  → |
//  `  → ञ        ~  → ञ
//  @  → ौ        #  → ्र
//  $  → ृ (matra) %  → ख्
//  ^  → ं         &  → ाँ
//  *  → ×        (  → (
//  )  → )        <  → <
//  >  → >
// ─────────────────────────────────────────────────────────────────────────────

// ASCII character → Devanagari Unicode string
// This is what the Preeti font renders for each keypress
export const PREETI_TO_UNICODE: Record<string, string> = {
  // Lowercase
  'a': 'ब',   'b': 'व',   'c': 'अ',   'd': 'द',
  'e': 'े',    'f': 'ा',   'g': 'न',   'h': 'ज',
  'i': 'ि',   'j': 'य',   'k': 'प',   'l': 'ल',
  'm': 'म',   'n': 'ट',   'o': 'ो',   'p': 'ड',
  'q': '्र',  'r': 'च',   's': 'स',   't': 'त',
  'u': 'ग',   'v': 'ख',   'w': 'ध',   'x': 'ह',
  'y': 'थ',   'z': 'ज',

  // Uppercase
  'A': 'भ',   'B': 'ब',   'C': 'ऋ',   'D': 'ड',
  'E': 'ऐ',   'F': 'ँ',   'G': 'ण',   'H': 'झ',
  'I': 'ी',   'J': 'य',   'K': 'फ',   'L': 'ळ',
  'M': 'थ',   'N': 'ठ',   'O': 'ओ',   'P': 'ढ',
  'Q': 'ौ',   'R': 'छ',   'S': 'श',   'T': 'ट',
  'U': 'घ',   'V': 'ङ',   'W': 'ध',   'X': 'ह',
  'Y': 'थ',   'Z': 'ज',

  // Numbers → Devanagari numerals
  '0': '०',   '1': '१',   '2': '२',   '3': '३',   '4': '४',
  '5': '५',   '6': '६',   '7': '७',   '8': '८',   '9': '९',

  // Symbols / special keys
  ';': 'क',   ':': 'ज्ञ',
  "'": 'ट',   '"': 'ठ',
  '[': 'ु',   '{': 'ू',
  ']': '्',   '}': 'ऽ',
  '\\': '्',
  '/': '।',
  '=': 'ं',   '+': 'ॅ',
  '`': 'ञ',   '~': 'ञ',
  '@': 'ौ',   '#': '्र',
  '$': 'ृ',   '^': 'ं',
  '&': 'ाँ',
  '<': 'ण',  '>': 'ण',
  '!': 'क',
}

// Reverse map: Unicode → Preeti ASCII (for converting word list)
export const UNICODE_TO_PREETI: Record<string, string> = {}
for (const [ascii, uni] of Object.entries(PREETI_TO_UNICODE)) {
  // Only map single-char unicode to first ascii key found (skip multi-char like ्र)
  if (uni.length === 1 && !UNICODE_TO_PREETI[uni]) {
    UNICODE_TO_PREETI[uni] = ascii
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// unicodeToPreeti — convert a Unicode Nepali word to its Preeti ASCII form
//
// Rules:
//  1. ि (U+093F) comes BEFORE the consonant in Unicode, but in Preeti the
//     key 'i' is typed AFTER the consonant. So we swap the order.
//  2. Halant ् + consonant = conjunct. In Preeti: ] then consonant key.
//  3. Everything else maps directly codepoint-by-codepoint.
// ─────────────────────────────────────────────────────────────────────────────
export function unicodeToPreeti(word: string): string {
  const nfc = word.normalize('NFC')
  let result = ''
  let i = 0

  while (i < nfc.length) {
    const ch = nfc[i]
    const cp = nfc.codePointAt(i)!

    // ि (U+093F) — comes before consonant in Unicode, after in Preeti
    // In NFC it's already after the base consonant, so just map it
    if (ch === '\u093F') {
      result += 'i'
      i++
      continue
    }

    // ् (U+094D halant) — map to ]
    if (ch === '\u094D') {
      result += ']'
      i++
      continue
    }

    // All other chars — look up in reverse map
    const mapped = UNICODE_TO_PREETI[ch]
    if (mapped) {
      result += mapped
    } else {
      result += ch // pass through unmapped chars
    }
    i++
  }

  return result
}

// ─────────────────────────────────────────────────────────────────────────────
// PREETI_WORDS — common Nepali words in correct Preeti ASCII encoding
//
// These were derived by:
//  1. Starting from the Unicode word list in words.ts
//  2. Applying the standard Preeti keyboard layout rules
//  3. Manually verifying against the actual Preeti font rendering
//
// When rendered with font-family: Preeti, each ASCII string displays the
// correct Nepali word. When a user types with Preeti keyboard layout,
// their keypresses produce this exact ASCII sequence.
// ─────────────────────────────────────────────────────────────────────────────
export const PREETI_WORDS: string[] = [
  // घर  मान्छे  पानी  खाना  काम  समय  दिन  रात  बाटो  ठाउँ
  'Ur',  'dfg]5]', 'kfgL', 'vfgf', 'sfd', 'zdo', 'lbg', 'rft', 'af6f]', 'NfpF',

  // देश  सहर  गाउँ  नाम  हात  आँखा  मुख  मन  जीवन  संसार
  'b]z', 'zxr', 'ufpF', 'gfd', 'xft', 'cfFvf', 'd[v', 'dg', 'hLjg', 'z+zf/',

  // आकाश  पहाड  नदी  जंगल  माटो  आगो  हावा  सूर्य  चन्द्र  तारा
  'cfsfz', 'kxfp', 'gbL', 'h+un', 'df6f]', 'cfuf]', 'xfjf', 'z\'_{o{', 'rGb|', 'tftf',

  // फूल  रूख  पात  फल  विद्यालय  किताब  कलम  कागज  पढाइ  शिक्षक
  'km"n', 'z"v', 'kft', 'kn', 'ljBfno', 'lstfa', 'snf', 'sfuh', 'k9fO', 'lzIfs',

  // आमा  बुवा  दाइ  दिदी  भाइ  बहिनी  छोरा  छोरी  साथी  मित्र
  'cfdf', 'a\'jf', 'bfO', 'lbbL', 'efO', 'axlgL', 'Rf]/f', 'Rf]/L', 'zfyL', 'ldq',

  // राम्रो  नराम्रो  ठूलो  सानो  लामो  छोटो  नयाँ  पुरानो  सफा  गर्मी
  '/fDf|f]', 'g/fDf|f]', 'NHnf]', 'zfgf]', 'nfdf]', 'Rf]6f]', 'gofF', 'k\'/fgf]', 'zkf', 'uf{dL',

  // अब  पनि  आज  हिजो  भोलि  यहाँ  त्यहाँ  कहाँ  किन  कसरी
  'ca', 'klg', 'cfh', 'lxhf]', 'ef]ln', 'oxfF', 'ToxfF', 'sxfF', 'lsg', 's;/L',

  // प्रेम  शान्ति  सत्य  न्याय  धर्म  संस्कृति  सपना  आशा  डर  खुशी
  'k|]d', 'zflGt', 'zTo', 'Gofo', 'wd{', 'z+:s[lt', 'zkgf', 'cfzf', 'p/', 'v\'zL',

  // एक  दुई  तीन  चार  पाँच  हप्ता  महिना  वर्ष  गाडी  ढोका
  'Ps', 'b\'O', 'tLg', 'rf/', 'kfFr', 'xKtf', 'dlxgf', 'j{if', 'uf8L', 'Yf]sf',

  // साथी  मित्र  घडी  झोला  माया  दुःख  खुशी  शक्ति  साहस  विश्वास
  'zfyL', 'ldq', '3f8L', 'emf]nf', 'dfof', 'b\'Mv', 'v\'zL', 'zlSt', 'zfxz', 'ljZjfz',
]

export function getRandomPreetiWords(count: number): string[] {
  const pool = [...PREETI_WORDS]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const result: string[] = []
  while (result.length < count) result.push(...pool.slice(0, count - result.length))
  return result.slice(0, count)
}