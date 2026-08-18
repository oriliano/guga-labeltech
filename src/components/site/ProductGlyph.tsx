/**
 * Product photography does not exist yet, and a grey empty box reads as a broken
 * page. Until real photos arrive, each category gets a drawn mark: gold line work
 * on the brand green, in the same visual family as the logo.
 *
 * Drawn rather than generated as files so it stays sharp at any size and costs
 * nothing to ship. Delete a category here once its products carry real pictures.
 */

const CATEGORY_ART: Record<string, React.ReactNode> = {
  // El terminali, okuyucu, anten: gövde ve okuma hüzmesi
  hardware: (
    <>
      <rect x="128" y="46" width="64" height="98" rx="9" />
      <rect x="139" y="58" width="42" height="34" rx="3" />
      <path d="M139 104h42M139 116h42M139 128h24" />
      <path d="M200 62c9 9 9 25 0 34M212 52c15 15 15 39 0 54" />
    </>
  ),
  // RFID etiket: etiket gövdesi ve sarmal anten
  label: (
    <>
      <rect x="96" y="60" width="128" height="70" rx="8" />
      <rect x="110" y="74" width="100" height="42" rx="4" />
      <circle cx="160" cy="95" r="9" />
      <path d="M132 80c-12 9-12 21 0 30M188 80c12 9 12 21 0 30" />
    </>
  ),
  // Endüstriyel tag: sert gövde, montaj deliği
  'industrial-tag': (
    <>
      <path d="M112 66h74l26 29-26 29h-74z" />
      <circle cx="132" cy="95" r="9" />
      <path d="M158 82h34M158 95h34M158 108h22" />
      <path d="M96 74c-10 12-10 30 0 42" />
    </>
  ),
  // Endüstriyel etiket: katmanlar ve sıcaklık dalgaları
  'industrial-label': (
    <>
      <rect x="102" y="72" width="112" height="56" rx="6" />
      <path d="M112 62h112M122 52h112" />
      <path d="M118 92h44M118 106h64" />
      <path d="M182 92h20M182 106h20" />
    </>
  ),
  // Kart: gövde ve çip
  card: (
    <>
      <rect x="98" y="58" width="124" height="78" rx="9" />
      <rect x="114" y="76" width="30" height="24" rx="4" />
      <path d="M114 114h60M186 114h20" />
      <path d="M164 76c10 8 10 20 0 28M178 68c16 13 16 33 0 46" />
    </>
  ),
  // Ribon: makara ve şerit
  ribbon: (
    <>
      <ellipse cx="128" cy="95" rx="22" ry="40" />
      <path d="M128 55h64M128 135h64" />
      <ellipse cx="192" cy="95" rx="22" ry="40" />
      <path d="M150 95h20" />
    </>
  ),
  // Yaka ipi: kordon ve kart
  lanyard: (
    <>
      <path d="M130 44l24 44M190 44l-24 44" />
      <rect x="132" y="88" width="56" height="60" rx="7" />
      <path d="M148 104h24M148 118h24" />
      <circle cx="160" cy="88" r="6" />
    </>
  ),
  // Kütüphane: kitap sırtları ve etiket
  library: (
    <>
      <rect x="104" y="56" width="24" height="84" rx="4" />
      <rect x="134" y="66" width="24" height="74" rx="4" />
      <rect x="164" y="50" width="24" height="90" rx="4" />
      <rect x="194" y="72" width="24" height="68" rx="4" />
      <path d="M168 118h16v18h-16z" />
    </>
  ),
  // Perakende: fiyat etiketi ve okuma dalgası
  retail: (
    <>
      <path d="M96 92l48-48h40v40l-48 48z" />
      <circle cx="168" cy="60" r="7" />
      <path d="M196 78c9 9 9 25 0 34M208 68c15 15 15 39 0 54" />
    </>
  ),
}

const FALLBACK = CATEGORY_ART.label

export const ProductGlyph = ({ category, className = '' }: { category?: string | null; className?: string }) => (
  <div className={`relative flex items-center justify-center bg-ink-900 ${className}`}>
    <svg viewBox="0 0 320 180" role="presentation" aria-hidden className="h-full w-full">
      <defs>
        <linearGradient id="guga-glyph" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e3c96a" />
          <stop offset="55%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8a6a17" />
        </linearGradient>
        <pattern id="guga-grid" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" fill="#e3c96a" opacity="0.14" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill="url(#guga-grid)" />
      <g
        fill="none"
        stroke="url(#guga-glyph)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {(category && CATEGORY_ART[category]) || FALLBACK}
      </g>
    </svg>
  </div>
)
