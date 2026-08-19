import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import type { ReactNode } from 'react'

import { localeFromRequest } from '@/lib/request'

import './styles.css'

// Arayüz Inter ile, başlıklar logodaki klasik serifle aynı ailede duruyor.
const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans-loaded', display: 'swap' })
const display = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  variable: '--font-display-loaded',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'GUGA LABELTECH — RFID, etiket ve IoT çözümleri',
    template: '%s · GUGA LABELTECH',
  },
  description:
    'RFID etiket, okuyucu ve el terminali üretimi, IoT ve RTLS yazılımları. Depo, perakende, tekstil, sağlık ve lojistik için uçtan uca izlenebilirlik.',
  openGraph: {
    siteName: 'GUGA LABELTECH',
    type: 'website',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'GUGA LABELTECH' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.jpg'],
  },
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const locale = await localeFromRequest()

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
