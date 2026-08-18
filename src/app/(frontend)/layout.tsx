import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { localeFromRequest } from '@/lib/request'

import './styles.css'

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
    <html lang={locale} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
