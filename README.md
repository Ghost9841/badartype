# nepalitype — setup guide

## File placement

```
your-next-app/
├── public/
│   └── fonts/
│       └── Preeti.ttf          ← PUT THE FONT HERE (not in /app)
├── app/
│   ├── globals.css             ← copy from outputs
│   ├── layout.tsx              ← add font className here (see below)
│   └── page.tsx                ← copy from outputs
├── lib/
│   ├── words.ts                ← copy from outputs
│   ├── scoring.ts              ← copy from outputs
│   └── preetiMap.ts            ← copy from outputs
├── tailwind.config.ts          ← copy from outputs
└── postcss.config.js           ← already in your project
```

## 1. Copy the font

```bash
mkdir -p public/fonts
cp Preeti.ttf public/fonts/
```

## 2. Install dependencies

```bash
npm install zustand
npm install -D tailwindcss @tailwindcss/typography
```

## 3. app/layout.tsx — add Google Font

```tsx
import type { Metadata } from 'next'
import { Noto_Serif_Devanagari } from 'next/font/google'
import './globals.css'

const noto = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['300', '400', '600'],
  variable: '--font-noto-devanagari',
})

export const metadata: Metadata = { title: 'nepalitype' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne" className={noto.variable}>
      <body>{children}</body>
    </html>
  )
}
```

Then in tailwind.config.ts change the nepali font to use the CSS variable:

```ts
nepali: ['var(--font-noto-devanagari)', 'serif'],
```

## 4. globals.css — remove the @import line

Once you're using next/font/google (step 3), delete this line from globals.css:

```css
@import url('https://fonts.googleapis.com/css2?...');
```

next/font handles loading and is faster + self-hosted.

## 5. Preeti mode — important note

Preeti uses legacy ASCII-to-glyph mapping. The user must have their OS/browser
input method set to **Preeti keyboard layout** for the characters to match.

The word list in `preetiMap.ts` contains pre-encoded ASCII strings. When rendered
with `font-family: Preeti`, they display as correct Nepali text.

To add more Preeti words: type them in Notepad/Word with Preeti font selected,
copy the ASCII result, paste into the PREETI_WORDS array.

## 6. Run

```bash
npm run dev
```