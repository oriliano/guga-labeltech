import Image from 'next/image'

import { Section, SectionHeading, StatTile } from '@/components/site/ui'
import { CERTIFICATES, CERTIFIER, formatDate } from '@/lib/certificates'
import { type Locale } from '@/lib/i18n'
import { ABOUT_IMAGE, DISTRIBUTORSHIP_CERTIFICATE } from '@/lib/imagery'
import { imageUrl } from '@/lib/media'

/**
 * Kurumsal sayfa. Bölümler ve metinler firmanın eski sitesindeki kurumsal
 * sayfayla aynı: hakkımızda, vizyon, misyon, neden GUGA, kalite politikası,
 * sertifikalar. İngilizcesi ayrıca yazıldı.
 */

const VISION = {
  tr: 'RFID ve IoT teknolojilerinde yerli üretim gücüyle küresel ölçekte rekabet eden bir teknoloji markası olmak. Depo, üretim ve lojistik sektörlerinde tam izlenebilirlik ve operasyonel mükemmellik sağlayan çözümler geliştirerek işletmelerin dijital dönüşüm yolculuğuna yön veren bir inovasyon şirketi haline gelmek.',
  en: 'To be a technology brand that competes globally on Turkish-made production in RFID and IoT. To become an innovation company that shapes digital transformation by building solutions for full traceability and operational excellence across warehousing, manufacturing and logistics.',
}

const MISSION = {
  tr: [
    'Sürecin her adımında veri temelli görünürlük, verimlilik ve kontrol sağlayan akıllı sistemler sunmak.',
    'Endüstriyel dayanıklılığı yüksek, yerli mühendislikle geliştirilen RFID donanım ve yazılım çözümleriyle rekabet gücünü artırmak.',
    'Teknolojide dışa bağımlılığı azaltarak Türkiye’nin dijital endüstri altyapısına katma değer sağlamak.',
    'Ar-Ge çalışmalarıyla Endüstri 4.0 ve IoT ekosisteminde öncü çözümler üretmek.',
    'Her projede kalite, güvenilirlik ve sürdürülebilirlikten ödün vermeden uzun vadeli iş ortaklıkları kurmak.',
  ],
  en: [
    'Deliver systems that give data-driven visibility, efficiency and control at every step of a process.',
    'Raise competitiveness with industrially durable RFID hardware and software developed by Turkish engineering.',
    'Reduce dependence on imported technology and add value to Turkey’s digital industrial base.',
    'Produce leading solutions in the Industry 4.0 and IoT ecosystem through R&D.',
    'Build long-term partnerships without compromising on quality, reliability or sustainability.',
  ],
}

const REASONS = {
  tr: [
    {
      title: 'Yerli üretim, uluslararası standart',
      body: 'RFID donanım, etiket ve kart çözümlerini kendi mühendislik ekibimizle geliştiriyoruz; üretimden entegrasyona kadar her aşamayı aynı çatı altında yönetiyoruz.',
    },
    {
      title: 'Saha deneyimine dayalı çözümler',
      body: 'Ürünler sahadaki ihtiyaca göre tasarlanır. Her donanım ve yazılım endüstriyel dayanıklılık, zorlu ortam koşulları ve sürekli çalışma için test edilir.',
    },
    {
      title: 'Uçtan uca entegrasyon',
      body: 'Donanım, etiket ve yazılım aynı çatı altında geliştirildiği için sistemler tek merkezden ve ölçeklenebilir biçimde çalışır.',
    },
    {
      title: 'Ar-Ge odaklı yaklaşım',
      body: 'Teknolojiyi tüketen değil üreten bir firmayız. Her yeni ürün kendi Ar-Ge çalışmalarımızdan çıkan özgün tasarımlarla ortaya çıkar.',
    },
    {
      title: 'Müşteriye özel kurgu',
      body: 'Her işletmenin ihtiyacı farklıdır. Süreçlere özel çözümler geliştirir, uzun vadeli teknik destek ve danışmanlık veririz.',
    },
    {
      title: 'Geleceğe hazır teknoloji',
      body: 'Endüstri 4.0 ve IoT ekosistemine uyumlu portföy: akıllı veri yönetimi, otomatik izlenebilirlik ve gerçek zamanlı görünürlük.',
    },
  ],
  en: [
    {
      title: 'Turkish-made, to international standards',
      body: 'RFID hardware, labels and cards are developed by our own engineering team, with every stage from production to integration handled in house.',
    },
    {
      title: 'Solutions grounded in field experience',
      body: 'Products are designed around what the field needs. Every piece of hardware and software is tested for industrial durability, harsh conditions and continuous operation.',
    },
    {
      title: 'End-to-end integration',
      body: 'Hardware, labels and software are developed under one roof, so systems run from a single centre and scale without friction.',
    },
    {
      title: 'An R&D-led approach',
      body: 'We produce technology rather than merely consume it. Every new product comes out of original designs from our own R&D work.',
    },
    {
      title: 'Configured per customer',
      body: 'Every business works differently. We build solutions around existing processes and provide long-term technical support and consultancy.',
    },
    {
      title: 'Ready for what comes next',
      body: 'A portfolio aligned with Industry 4.0 and IoT: smart data management, automatic traceability and real-time visibility.',
    },
  ],
}

const POLICY = {
  tr: [
    'Sektörel gelişmeleri izleyerek ürün ve hizmet kalitesini sürekli iyileştirmek.',
    'Tüm ürün ve yazılımlarda kalite, güvenilirlik ve sürekliliği esas almak.',
    'TS ISO/IEC 27001 Bilgi Güvenliği Yönetim Sistemi ilkelerine uyum göstermek.',
    'Risk ve fırsat analizlerini düzenli gözden geçirip uygunsuzlukların önüne geçmek.',
    'Yasal mevzuata, etik değerlere ve şeffaf yönetim anlayışına bağlı kalmak.',
    'Çalışanların eğitimine, motivasyonuna ve iş sağlığı güvenliğine öncelik vermek.',
    'Çevre bilincini paydaşlarla birlikte yaygınlaştırmak.',
    'Sosyal sorumluluk bilinciyle topluma değer katan projelerde yer almak.',
  ],
  en: [
    'Track sector developments and keep improving product and service quality.',
    'Treat quality, reliability and continuity as the basis of every product and software release.',
    'Comply with the principles of the TS ISO/IEC 27001 information security management system.',
    'Review risk and opportunity analyses regularly to prevent non-conformities.',
    'Stay bound to legislation, ethical values and transparent management.',
    'Prioritise staff training, motivation and occupational health and safety.',
    'Spread environmental awareness together with our stakeholders.',
    'Take part in projects that add value to society.',
  ],
}

const filled = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback

export const AboutPage = ({
  locale,
  settings,
  content,
}: {
  locale: Locale
  settings: any
  content?: any
}) => {
  const introParagraphs = content?.introParagraphs?.length
    ? content.introParagraphs.map((item: any) => item.text).filter(Boolean)
    : [
        locale === 'tr'
          ? 'GUGA LABELTECH, RFID ve IoT teknolojileri alanında faaliyet gösteren bir teknoloji firmasıdır. Etiket, kart ve donanım üretiminde çözümler sunarak işletmelerin üretim, izleme ve yönetim süreçlerini dijitalleştirir.'
          : 'GUGA LABELTECH works in RFID and IoT technologies. We manufacture labels, cards and hardware, and digitalise the production, tracking and management processes of the businesses we work with.',
        locale === 'tr'
          ? 'Her sektöre özel ürün ve hizmetlerle uçtan uca çözüm sunarken kalite, hız ve sürdürülebilirliği esas alırız. Yerli Ar-Ge gücümüz sayesinde teknolojik bağımsızlığı destekler, satış sonrası teknik desteği önceliğimiz sayarız.'
          : 'We deliver end-to-end solutions per sector, with quality, speed and sustainability as the basis. Our in-house R&D supports technological independence, and after-sales technical support is a priority rather than an afterthought.',
        locale === 'tr'
          ? 'GUGALABELTECH® markası Türk Patent ve Marka Kurumu tarafından tescillenmiştir. Çevreye duyarlı üretim, ulusal ve uluslararası kalite standartlarına uygun çalışma ve etik iş anlayışı firmanın çalışma biçimini belirler.'
          : 'GUGALABELTECH® is registered with the Turkish Patent and Trademark Office. Environmentally aware production, compliance with national and international quality standards and an ethical approach shape how the company works.',
      ]
  const stats = content?.stats?.length
    ? content.stats
    : [
        { metric: 'RFID', label: locale === 'tr' ? 'Etiket ve donanım üretimi' : 'Tag and hardware production' },
        { metric: 'IoT', label: locale === 'tr' ? 'Sensör ve veri toplama' : 'Sensors and data capture' },
        { metric: 'RTLS', label: locale === 'tr' ? 'Gerçek zamanlı konumlama' : 'Real-time location' },
        { metric: 'ERP', label: locale === 'tr' ? 'WMS ve ERP entegrasyonu' : 'WMS and ERP integration' },
      ]
  const missionItems = content?.mission?.items?.length
    ? content.mission.items.map((item: any) => item.text).filter(Boolean)
    : MISSION[locale]
  const reasons = content?.reasons?.items?.length ? content.reasons.items : REASONS[locale]
  const policyItems = content?.policy?.items?.length
    ? content.policy.items.map((item: any) => item.text).filter(Boolean)
    : POLICY[locale]
  const certificates = content?.certificates?.length
    ? content.certificates
        .filter((certificate: any) => certificate.enabled !== false)
        .map((certificate: any) => {
          const fallback = CERTIFICATES.find((item) => item.number === certificate.number)
          return {
            standard: certificate.standard,
            title: filled(certificate.title, fallback?.title[locale] ?? certificate.standard),
            number: certificate.number ?? '',
            validUntil: certificate.validUntil ?? fallback?.validUntil,
            image: imageUrl(certificate.image, certificate.existingImage ?? fallback?.image),
          }
        })
        .filter((certificate: any) => certificate.image)
    : CERTIFICATES.map((certificate) => ({
        ...certificate,
        title: certificate.title[locale],
      }))
  const heroImage = imageUrl(content?.heroImage, ABOUT_IMAGE) as string
  const distributorshipImage = imageUrl(content?.distributorship?.image, DISTRIBUTORSHIP_CERTIFICATE) as string

  return (
  <>
    <Section>
      <Image
        src={heroImage}
        alt=""
        width={1400}
        height={620}
        priority
        className="mb-10 aspect-[21/9] w-full rounded-xl object-cover"
      />
      <SectionHeading
        eyebrow={filled(content?.heroEyebrow, locale === 'tr' ? 'Kurumsal tanıtım' : 'Company profile')}
        title={filled(content?.heroTitle, locale === 'tr' ? 'Hakkımızda' : 'About us')}
        as="h1"
        lead={filled(content?.heroLead, settings?.tagline ?? '') || undefined}
      />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="prose-guga max-w-none">
          {introParagraphs.map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {stats.map((stat: any, index: number) => (
            <StatTile key={`${stat.metric}-${index}`} metric={stat.metric} label={stat.label} />
          ))}
        </div>
      </div>
    </Section>

    <Section tone="tint">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{filled(content?.vision?.eyebrow, locale === 'tr' ? 'Vizyonumuz' : 'Our vision')}</p>
          <h2 className="mt-3 text-h2 font-semibold">
            {filled(
              content?.vision?.title,
              locale === 'tr' ? 'Yerli üretim gücüyle küresel ölçekte rekabet' : 'Competing globally on Turkish-made production',
            )}
          </h2>
          <span aria-hidden className="rule-gold mt-5" />
          <p className="mt-5 leading-relaxed text-muted">{filled(content?.vision?.body, VISION[locale])}</p>
        </div>

        <div>
          <p className="eyebrow">{filled(content?.mission?.eyebrow, locale === 'tr' ? 'Misyonumuz' : 'Our mission')}</p>
          <h2 className="mt-3 text-h2 font-semibold">
            {filled(content?.mission?.title, locale === 'tr' ? 'Veriye dayalı görünürlük ve kontrol' : 'Visibility and control, built on data')}
          </h2>
          <span aria-hidden className="rule-gold mt-5" />
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-muted">
            {missionItems.map((item: string) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-1 text-signal-400">
                  ▸
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>

    <Section>
      <SectionHeading
        eyebrow={filled(content?.reasons?.eyebrow, locale === 'tr' ? 'Fark' : 'Difference')}
        title={filled(content?.reasons?.title, locale === 'tr' ? 'Neden GUGA LABELTECH?' : 'Why GUGA LABELTECH?')}
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reasons.map((item: any) => (
          <div key={item.title} className="card-surface p-7">
            <h3 className="text-h3 font-semibold">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </Section>

    <Section tone="tint">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow">{filled(content?.policy?.eyebrow, locale === 'tr' ? 'Politika' : 'Policy')}</p>
          <h2 className="mt-3 text-h2 font-semibold">
            {filled(content?.policy?.title, locale === 'tr' ? 'Kalite ve yönetim sistemi politikamız' : 'Quality and management system policy')}
          </h2>
          <span aria-hidden className="rule-gold mt-5" />
          <p className="mt-5 text-sm leading-relaxed text-muted">
            {filled(
              content?.policy?.body,
              locale === 'tr'
                ? 'GUGA Bilişim Teknoloji Ltd. Şti. olarak bilişim ve Endüstri 4.0 teknolojileri alanında çalışırken güncel teknolojileri kullanmayı, yeniliğe açık kalmayı ve kesintisiz, güvenilir çözümler sunmayı temel ilke sayıyoruz. ISO 9001:2015 Kalite Yönetim Sistemi standartlarını bir amaç değil, sürdürülebilir başarıya ulaşmada bir araç olarak görüyoruz.'
                : 'At GUGA Bilişim Teknoloji Ltd. Şti. we treat current technology, openness to change and uninterrupted, dependable solutions as basic principles in information technology and Industry 4.0. We regard ISO 9001:2015 quality management standards as a means to sustainable results rather than an end in themselves.',
            )}
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {policyItems.map((item: string) => (
            <li key={item} className="card-surface flex gap-3 p-5 text-sm leading-relaxed text-muted">
              <span aria-hidden className="mt-1 text-signal-400">
                ▸
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>

    <Section>
      <SectionHeading
        eyebrow={filled(content?.certificateEyebrow, locale === 'tr' ? 'Belgeler' : 'Certification')}
        title={filled(content?.certificateTitle, locale === 'tr' ? 'Sertifikalarımız' : 'Our certificates')}
        lead={filled(
          content?.certificateLead,
          locale === 'tr'
            ? `${CERTIFIER.name} tarafından düzenlendi, ${CERTIFIER.accreditation} akreditasyonu ile. Geçerlilik durumu belgelendirme kuruluşunun sitesinden doğrulanabilir.`
            : `Issued by ${CERTIFIER.name} under accreditation ${CERTIFIER.accreditation}. Validity can be verified on the certification body's website.`,
        )}
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {certificates.map((certificate: any) => (
          <a
            key={`${certificate.number}-${certificate.standard}`}
            href={certificate.image}
            target="_blank"
            rel="noopener noreferrer"
            className="card-surface lift group flex flex-col overflow-hidden hover:border-signal-500/40 hover:lift-hover"
          >
            <div className="flex aspect-[3/4] items-center justify-center bg-[var(--page-bg)] p-2">
              <Image
                src={certificate.image}
                alt={`${certificate.standard} — ${certificate.title}`}
                width={1100}
                height={1556}
                className="h-full w-full rounded-md border border-[var(--card-border)] object-contain"
              />
            </div>
            <div className="flex flex-1 flex-col p-4 text-center">
              <p className="eyebrow">{certificate.standard}</p>
              <h3 className="mt-2 text-sm font-semibold leading-snug">{certificate.title}</h3>
              <dl className="mt-3 space-y-1 text-[11px] text-muted">
                {certificate.number ? <div className="flex justify-center gap-1.5">
                  <dt>{locale === 'tr' ? 'Belge no' : 'Certificate no'}</dt>
                  <dd className="font-medium">{certificate.number}</dd>
                </div> : null}
                {certificate.validUntil ? <div className="flex justify-center gap-1.5">
                  <dt>{locale === 'tr' ? 'Geçerlilik' : 'Valid until'}</dt>
                  <dd className="font-medium">{formatDate(certificate.validUntil, locale)}</dd>
                </div> : null}
              </dl>
              <span className="mt-3 text-[11px] font-medium text-signal-400">
                {locale === 'tr' ? 'Belgeyi büyüt' : 'Open the certificate'} →
              </span>
            </div>
          </a>
        ))}
      </div>
    </Section>

    <Section tone="tint">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="card-surface p-7">
          <p className="eyebrow">{filled(content?.trademark?.eyebrow, locale === 'tr' ? 'Tescilli marka' : 'Registered trademark')}</p>
          <h3 className="mt-3 text-h3 font-semibold">{filled(content?.trademark?.title, 'GUGALABELTECH®')}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {filled(
              content?.trademark?.body,
              locale === 'tr'
                ? 'GUGALABELTECH®, GUGA Bilişim Teknoloji’nin Türk Patent ve Marka Kurumu tarafından tescillenmiş markasıdır. RFID etiket, otomatik tanıma sistemleri, IoT cihazları ve RTLS yazılımları bu marka altında geliştirilir.'
                : 'GUGALABELTECH® is a trademark of GUGA Bilişim Teknoloji, registered with the Turkish Patent and Trademark Office. RFID labels, automatic identification systems, IoT devices and RTLS software are developed under it.',
            )}
          </p>
        </div>
        <div className="card-surface overflow-hidden">
          <div className="p-7">
            <p className="eyebrow">{filled(content?.distributorship?.eyebrow, locale === 'tr' ? 'Distribütörlük' : 'Distributorship')}</p>
            <h3 className="mt-3 text-h3 font-semibold">{filled(content?.distributorship?.title, 'TENHANYUN')}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {filled(
                content?.distributorship?.body,
                locale === 'tr'
                  ? 'Guangzhou Tenhanyun Technology Co. Ltd. tarafından Türkiye yetkili distribütörü olarak atandık. Yetki UHF pasif RFID sabit okuyucu, entegre okuyucu, el terminali ve endüstriyel donanımı kapsıyor; satış, pazarlama ve satış sonrası desteği içeriyor. Belge 16 Ocak 2026 tarihinden itibaren süresiz geçerli.'
                  : 'Guangzhou Tenhanyun Technology Co. Ltd. appointed us as its authorised distributor in Turkey. The appointment covers UHF passive RFID fixed and integrated readers, handheld terminals and industrial-grade hardware, including sales, marketing and after-sales support. The certificate is effective 16 January 2026 for an unlimited period.',
              )}
            </p>
          </div>
          <a
            href={distributorshipImage}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border-t border-[var(--card-border)] bg-ink-950/60 p-5"
          >
            <Image
              src={distributorshipImage}
              alt={locale === 'tr' ? 'TENHANYUN distribütörlük belgesi' : 'TENHANYUN distributorship certificate'}
              width={1200}
              height={849}
              className="w-full rounded-lg border border-[var(--card-border)] transition group-hover:brightness-110"
            />
            <span className="mt-3 block text-xs font-medium text-signal-400">
              {locale === 'tr' ? 'Belgeyi büyüt' : 'Open the certificate'} →
            </span>
          </a>
        </div>
      </div>
    </Section>
  </>
  )
}
