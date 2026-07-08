import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Anton, Caveat, Permanent_Marker, Space_Grotesk } from 'next/font/google'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
})

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-marker',
})

export const metadata: Metadata = {
  title: 'Sanjay Pandey — Full-Stack Developer',
  description:
    'Portfolio of Sanjay Pandey, third-year B.Tech Mathematics & Computing student at JIIT Noida. Full-stack developer, LeetCode Knight, builder of production web apps.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#060b18',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${anton.variable} ${spaceGrotesk.variable} ${caveat.variable} ${permanentMarker.variable}`}
    >
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
