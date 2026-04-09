// Root layout with global fonts and dark theme configuration
import type { Metadata } from 'next'
import '../styles/globals.css'
import '../styles/tokens.css'

// Font placeholders - using system fonts as fallback
const bodoniModa = { variable: '--font-bodoni' }
const outfit = { variable: '--font-outfit' }
const spaceMono = { variable: '--font-space-mono' }

export const metadata: Metadata = {
  title: 'Crushed Studios - AI Video Generation',
  description: 'Create cinematic video content with AI-powered screenplay generation, storyboarding, and production tools.',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${bodoniModa.variable} ${outfit.variable} ${spaceMono.variable} bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  )
}
