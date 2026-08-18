import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'GUGA LABELTECH — RFID, etiket ve IoT çözümleri',
    template: '%s · GUGA LABELTECH',
  },
  description:
    'RFID etiket, okuyucu ve el terminali üretimi, IoT ve RTLS yazılımları. Depo, perakende, tekstil, sağlık ve lojistik için uçtan uca izlenebilirlik.',
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="tr" suppressHydrationWarning>
    <body>{children}</body>
  </html>
)

export default RootLayout
