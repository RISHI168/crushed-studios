// Root layout with global fonts and dark theme configuration
import type { Metadata } from 'next'
import { Bodoni_Moda, Outfit, Space_Mono } from 'next/font/google'
import '../styles/globals.css'
import '../styles/tokens.css'

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  weight: ['400', '500', '700'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  weight: ['400', '700'],
})

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
