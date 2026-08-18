/**
 * Rewrites the product catalogue in both locales.
 *
 * The legacy import (src/seed/run.ts) split the old category pages on model
 * codes, which produced fragments: half sentences, the same model repeated three
 * times, and pages that yielded no products at all. Everything here is written
 * fresh against the real model codes and product names from those pages.
 *
 * `specs` carries only figures that appear literally in the source material:
 * dimensions, weight, read range, frequency, chip, IP rating, temperature range.
 * Where the old site never published a number, the array is left empty on
 * purpose. An invented spec table is worse than a missing one, because an export
 * customer will quote it back at us.
 *
 * `images` and `datasheets` are untouched: media has not been migrated off the
 * legacy CDN yet (roadmap A3).
 *
 * Run: NODE_ENV=development npx tsx src/seed/products.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { PRODUCT_CATEGORIES } from '../collections/Products'

type Category = (typeof PRODUCT_CATEGORIES)[number]['value']
type Spec = { label: string; value: string }
type Side = { title: string; excerpt: string; body: string[]; specs: Spec[]; highlights: string[] }
type Entry = { slug: string; model?: string; category: Category; featured?: boolean; tr: Side; en: Side }

const para = (value: string) => ({
  type: 'paragraph',
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children: [{ type: 'text', text: value, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
})

const richText = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map(para),
  },
})

const entries: Entry[] = [
  // ---------------------------------------------------------------- donanım
  {
    slug: 'guga-ty850-rfid-el-terminali',
    model: 'GugaTY850',
    category: 'hardware',
    featured: true,
    tr: {
      title: 'RFID El Terminali',
      excerpt: 'Depo ve mağaza sayımı için UHF el terminali. Koridoru yürüyerek yüzlerce etiketi tek geçişte okur.',
      body: [
        'Sayımın maliyeti kaç kişinin kaç saat ayırdığıyla ölçülür. El terminali bu işi tek operatöre ve tek geçişe indirir: koridor yürünür, raf içeriği okunur, kutu açılmaz.',
        'Aynı cihaz mal kabul, yerleştirme, sayım ve sevkiyat doğrulamasında kullanılır. Okunan veri WMS ya da ERP tarafına aktarıldığı için kimsenin bakmadığı ikinci bir stok tablosu oluşmaz.',
      ],
      specs: [],
      highlights: [
        'Tek geçişte toplu okuma',
        'Mal kabulden sevkiyata kadar tek cihaz',
        'WMS ve ERP tarafına veri aktarımı',
        'Toz, nem ve titreşimin olduğu sahalar için üretilir',
      ],
    },
    en: {
      title: 'RFID Handheld Terminal',
      excerpt: 'A UHF handheld for warehouse and store counts. Walk the aisle and hundreds of tags are read in one pass.',
      body: [
        'The cost of a stocktake is people multiplied by hours. A handheld cuts it to one operator and one pass: the aisle gets walked, the rack gets read, nothing is unpacked.',
        'The same device covers goods-in, put-away, counting and dispatch checks. Reads go straight into your WMS or ERP, so no second stock table piles up on the side.',
      ],
      specs: [],
      highlights: [
        'Bulk reads in a single pass',
        'One device from goods-in to dispatch',
        'Reads written into WMS and ERP',
        'Built for sites with dust, damp and vibration',
      ],
    },
  },
  {
    slug: 'guga-ty624-4-port-sabit-uhf-okuyucu',
    model: 'GugaTY624',
    category: 'hardware',
    featured: true,
    tr: {
      title: '4 Port Sabit UHF Okuyucu',
      excerpt: 'Kapı, konveyör ve tünel okuma noktaları için dört anten portlu sabit UHF okuyucu.',
      body: [
        'Sabit okuyucu, insanın okutmayı hatırlamasına bağlı olmayan tek kurgudur. Palet kapıdan geçer, okuma kendiliğinden olur.',
        'Dört anten portu bir kapıyı iki taraftan ya da iki dar geçişi tek cihazla kapatmaya yeter. Okuma alanını asıl belirleyen anten yerleşimi olduğu için açı, güç ve tetikleme mantığı her saha için ayrı ayarlanır.',
      ],
      specs: [
        { label: 'Anten portu', value: '4' },
        { label: 'Bant', value: 'UHF' },
      ],
      highlights: [
        'Dört anten portuyla geniş okuma alanı',
        'Kapı, konveyör ve tünel uygulamaları',
        'Port başına bağımsız tetikleme',
      ],
    },
    en: {
      title: '4-Port Fixed UHF Reader',
      excerpt: 'A fixed UHF reader with four antenna ports, for dock doors, conveyors and tunnel read points.',
      body: [
        'A fixed reader is the only setup that does not depend on someone remembering to scan. The pallet passes the door and the read happens on its own.',
        'Four antenna ports cover one door from both sides, or two narrow passages from a single unit. Antenna placement is what shapes the read zone, so angle, power and trigger logic are set per site.',
      ],
      specs: [
        { label: 'Antenna ports', value: '4' },
        { label: 'Band', value: 'UHF' },
      ],
      highlights: [
        'Wide read zone from four antenna ports',
        'Dock door, conveyor and tunnel applications',
        'Independent triggering per port',
      ],
    },
  },
  {
    slug: 'guga-ty628-8-port-sabit-uhf-okuyucu',
    model: 'GugaTY628',
    category: 'hardware',
    tr: {
      title: '8 Port Sabit UHF Okuyucu',
      excerpt: 'Birden fazla kapıyı ya da uzun bir hattı tek cihazdan yöneten sekiz portlu sabit okuyucu.',
      body: [
        'Her kapı için ayrı okuyucu almak yerine anten sayısını artırmak çoğu tesiste daha ucuza gelir. Sekiz port, yan yana duran çıkış kapılarını ya da uzun bir konveyör hattını tek cihaza bağlar.',
        'Portlar bağımsız yönetildiği için hangi antenin ne zaman tetikleneceği ayrı tanımlanabilir. Yüksek trafikli sevkiyat kapılarında ve palet tünellerinde kullanılıyor.',
      ],
      specs: [
        { label: 'Anten portu', value: '8' },
        { label: 'Bant', value: 'UHF' },
      ],
      highlights: [
        'Sekiz anten portu',
        'Birden fazla kapı tek cihazdan yönetilir',
        'Port başına bağımsız tetikleme',
        'Yüksek trafikli sevkiyat noktaları için',
      ],
    },
    en: {
      title: '8-Port Fixed UHF Reader',
      excerpt: 'An eight-port fixed reader that runs several doors, or one long line, from a single unit.',
      body: [
        'Adding antennas usually costs less than adding readers. Eight ports connect a row of outbound doors, or a long conveyor run, to one device.',
        'Ports are managed independently, so which antenna fires and when is defined separately for each. It is the unit for high-traffic dispatch doors and pallet tunnels.',
      ],
      specs: [
        { label: 'Antenna ports', value: '8' },
        { label: 'Band', value: 'UHF' },
      ],
      highlights: [
        'Eight antenna ports',
        'Several doors run from one unit',
        'Independent triggering per port',
        'Suited to high-traffic dispatch points',
      ],
    },
  },
  {
    slug: 'guga-th320n-uhf-anten',
    model: 'GugaTH320N',
    category: 'hardware',
    tr: {
      title: 'UHF Anten',
      excerpt: 'Sabit okuyucularla çalışan UHF anten. Okuma alanının nerede başlayıp nerede bittiğini asıl belirleyen parça.',
      body: [
        'Bir RFID kurulumunun başarısı çoğu zaman okuyucuda değil antende belirlenir. Kazanç, polarizasyon ve montaj açısı, kapıdan geçen paletin okunup okunmayacağını doğrudan etkiler.',
        'Kapı çerçevesi, tavan ve konveyör kenarı gibi noktalara monte edilir. Aynı okuyucuya bağlı birden fazla anten, okuma alanını komşu koridora taşırmadan genişletmek için kullanılır.',
      ],
      specs: [],
      highlights: [
        'Sabit okuyucu kurulumları için',
        'Kapı, tavan ve konveyör montajı',
        'Okuma alanını komşu alana taşırmadan genişletir',
      ],
    },
    en: {
      title: 'UHF Antenna',
      excerpt: 'A UHF antenna for fixed reader installations. It is what actually decides where the read zone starts and stops.',
      body: [
        'Most RFID installations are won or lost at the antenna, not the reader. Gain, polarisation and mounting angle decide whether the pallet passing the door gets read.',
        'It mounts on door frames, ceilings and the side of a conveyor. Several antennas on one reader widen the read zone without spilling it into the next aisle.',
      ],
      specs: [],
      highlights: [
        'For fixed reader installations',
        'Door, ceiling and conveyor mounting',
        'Widens the read zone without spilling into adjacent areas',
      ],
    },
  },

  // ----------------------------------------------------------- rfid etiket
  {
    slug: 'guga1001-rfid-tekstil-etiketi',
    model: 'Guga1001',
    category: 'label',
    featured: true,
    tr: {
      title: 'RFID Tekstil Etiketi',
      excerpt: 'Giysiye dikilen ya da ısıyla uygulanan dokuma RFID etiketi. Ürünle birlikte yıkanır, ürünle birlikte yaşar.',
      body: [
        'Tekstilde etiket ürünün görünen yüzünün parçasıdır. Dokuma etiket bunu bozmadan çalışır: bakım etiketinin arkasına dikilir, dışarıdan fark edilmez, marka etiketiyle aynı kumaş hissini verir.',
        'Aynı etiket üretimde parti takibi, depoda sayım ve mağazada envanter için okunur. Ürün iade geldiğinde de aynı numara okunur, hangi partiden çıktığı kayıtta durur.',
      ],
      specs: [
        { label: 'Boyut', value: 'İhtiyaca göre özelleştirilebilir, standart dokuma ölçüleri' },
        { label: 'Malzeme', value: 'Polyester, naylon veya dokuma saten kumaş' },
        { label: 'Kişiselleştirme', value: 'Renkli logo, marka adı, seri numarası, barkod ve QR kod baskısı' },
      ],
      highlights: [
        'Dikişle ya da ısıyla uygulanır',
        'Renkli logo ve seri numarası basılabilir',
        'Üretimden mağazaya tek numarayla izlenir',
        'Orijinallik doğrulaması için tekil kimlik',
      ],
    },
    en: {
      title: 'RFID Textile Label',
      excerpt: 'A woven RFID label, sewn in or heat-applied. It washes with the garment and lasts as long as the garment does.',
      body: [
        'In textiles the label is part of what the customer sees. A woven tag works without disturbing that: it sits behind the care label, stays invisible from outside, and feels like the brand label next to it.',
        'The same tag is read for batch control in production, for counting in the warehouse and for inventory in store. When an item comes back as a return, the same number identifies the batch it came from.',
      ],
      specs: [
        { label: 'Size', value: 'Customisable, standard woven dimensions' },
        { label: 'Material', value: 'Polyester, nylon or woven satin' },
        { label: 'Personalisation', value: 'Colour logo, brand name, serial number, barcode and QR printing' },
      ],
      highlights: [
        'Sewn in or heat-applied',
        'Colour logo and serial number printing',
        'One identity from production to store',
        'Unique ID for authenticity checks',
      ],
    },
  },
  {
    slug: 'guga4318-rfid-demirbas-ve-depo-etiketi',
    model: 'Guga4318',
    category: 'label',
    tr: {
      title: 'RFID Demirbaş ve Depo Etiketi',
      excerpt: 'Esnek antenli, ince ve hafif RFID etiket. Uzun okuma mesafesi gereken depo ve demirbaş uygulamaları için.',
      body: [
        'Esnek anten tasarımı etiketi ince tutar. Kutu yüzeyine, dosya sırtına ya da demirbaş plakasının yanına yapıştırıldığında kabarma yapmaz, kullanım sırasında takılmaz.',
        'İnce olması menzilden ödün vermek anlamına gelmiyor. Koridorda el terminaliyle ya da kapı antenleriyle okunacak kadar mesafe verdiği için toplu sayım mümkün oluyor.',
      ],
      specs: [],
      highlights: [
        'İnce ve hafif profil',
        'Esnek anten tasarımı',
        'Toplu sayım için uzun okuma mesafesi',
        'Depo, demirbaş ve genel etiketleme',
      ],
    },
    en: {
      title: 'RFID Asset and Warehouse Label',
      excerpt: 'A thin, light label with a flexible antenna, for asset and warehouse work that needs range.',
      body: [
        'The flexible antenna keeps the label thin. Stuck on a carton, a file spine or next to an asset plate, it does not bubble up and does not catch on anything in handling.',
        'Thin does not mean short range here. It reads far enough to be picked up by a handheld down the aisle or by antennas at a door, which is what makes bulk counting work.',
      ],
      specs: [],
      highlights: [
        'Thin, lightweight profile',
        'Flexible antenna design',
        'Range that supports bulk counting',
        'Warehouse, fixed asset and general labelling',
      ],
    },
  },
  {
    slug: 'guga5434-rfid-tekstil-ve-hazir-giyim-etiketi',
    model: 'Guga5434',
    category: 'label',
    tr: {
      title: 'RFID Tekstil ve Hazır Giyim Etiketi',
      excerpt: 'Hazır giyim ve moda perakendesi için RFID etiket. Hammaddeden iadeye kadar aynı numarayla takip.',
      body: [
        'Bir gömlek fabrikadan çıkıp mağaza rafına gelene kadar en az beş elden geçiyor. Her aşamada elle sayım yapılırsa hata birikir. Etiket okunduğunda kayıt kendiliğinden oluşur.',
        'Hammadde, yarı mamul, bitmiş ürün, sevkiyat, mağaza ve iade adımları aynı tekil numara üzerinden bağlanır. Marka için bunun karşılığı, hangi partinin nerede olduğunu telefonla sormadan görebilmek.',
      ],
      specs: [],
      highlights: [
        'Hızlı toplu okuma',
        'Tedarik zincirinin her adımında aynı kimlik',
        'İade sürecinde parti doğrulama',
        'Moda ve hazır giyim operasyonları için',
      ],
    },
    en: {
      title: 'RFID Apparel Label',
      excerpt: 'An RFID label for apparel and fashion retail, carrying one identity from raw material to returns.',
      body: [
        'A shirt passes through at least five pairs of hands between the factory and the shop floor. Count it manually at each step and the errors compound. Read the tag and the record writes itself.',
        'Raw material, work in progress, finished goods, shipping, store and returns all hang off the same unique number. For the brand that means knowing where a batch is without phoning anyone.',
      ],
      specs: [],
      highlights: [
        'Fast bulk reading',
        'One identity across every supply chain step',
        'Batch verification on returns',
        'Built for fashion and apparel operations',
      ],
    },
  },
  {
    slug: 'guga6826-rfid-kuyum-etiketi',
    model: 'Guga6826',
    category: 'label',
    tr: {
      title: 'RFID Kuyum Etiketi',
      excerpt: 'Kuyum, saat ve gözlük için küçük boyutlu RFID etiket. Vitrin sayımını dakikalar meselesine indirir.',
      body: [
        'Kuyumda sayım her gün yapılması gereken ve her gün ertelenen iştir. Vitrin ve kasa içeriği el terminaliyle tarandığında parçalar tek tek elden geçmez, sayım açılış ve kapanış rutinine sığar.',
        'Etiket küçük ve ince olduğu için ürünün görünümünü bozmaz. Üzerine firma logosu, barkod ve ürün bilgisi basılabilir. Her parça kendi tekil numarasıyla kayıtta durur, aynı modelden iki parça birbirine karışmaz.',
      ],
      specs: [],
      highlights: [
        'Vitrin ve kasa sayımı toplu okumayla',
        'Parça bazlı tekil kimlik',
        'Logo, barkod ve ürün bilgisi baskısı',
        'Mevcut kuyum yazılımlarıyla uyumlu',
      ],
    },
    en: {
      title: 'RFID Jewellery Label',
      excerpt: 'A small-format RFID label for jewellery, watches and eyewear. It turns the display count into a few minutes of work.',
      body: [
        'Stocktaking in jewellery is the job that should happen daily and gets postponed daily. Scan the cabinet and the safe with a handheld and nothing is handled piece by piece, so the count fits into opening and closing routines.',
        'The label is small and thin enough not to change how a piece looks. Logo, barcode and product data can be printed on it, and each piece keeps its own unique number, so two items of the same model never get mixed up.',
      ],
      specs: [],
      highlights: [
        'Cabinet and safe counted in bulk',
        'Unique identity per piece',
        'Logo, barcode and product data printing',
        'Works with existing jewellery software',
      ],
    },
  },
  {
    slug: 'guga9654-rfid-arac-cam-etiketi',
    model: 'Guga9654',
    category: 'label',
    featured: true,
    tr: {
      title: 'RFID Araç Cam Etiketi',
      excerpt: 'Araç ön camına içeriden yapıştırılan pasif UHF etiket. Bariyerde durmadan geçiş için.',
      body: [
        'Bariyerde kart okutmak için duran her araç kuyruk üretir. Cam etiketi metrelerce mesafeden okunduğu için sürücü camı açmaz, araç yavaşlar ama durmaz.',
        'Etiket camın iç yüzüne yapıştırılır, böylece yağmur ve yıkama etiketi doğrudan etkilemez. Sökülmeye çalışıldığında zarar görecek şekilde üretildiği için başka araca taşınamaz. Abonelikli otopark ve yetkili araç kurgularında asıl önemli olan da bu.',
      ],
      specs: [
        { label: 'Teknoloji', value: 'Pasif UHF' },
        { label: 'Okuma mesafesi', value: '4-10 metre, bazı sistemlerde 12 metreye kadar' },
        { label: 'Çalışma sıcaklığı', value: '-40 °C ile +70 °C arası' },
        { label: 'Uygulama', value: 'Ön cama içeriden yapıştırma' },
        { label: 'Güvenlik', value: 'Sökülmeye çalışıldığında okunmaz hale gelen tamper yapısı' },
        { label: 'Kimlik', value: 'Etiket başına benzersiz EPC numarası' },
      ],
      highlights: [
        'Bariyerde durmadan geçiş',
        'Sökülünce kullanılamaz hale gelen tamper yapısı',
        'Pil ve bakım gerektirmez',
        'Otopark otomasyonu ve güvenlik yazılımlarıyla entegrasyon',
      ],
    },
    en: {
      title: 'RFID Windscreen Tag',
      excerpt: 'A passive UHF tag applied to the inside of the windscreen, for barrier access without stopping.',
      body: [
        'Every vehicle that stops to present a card at a barrier builds a queue. A windscreen tag reads from several metres, so nobody winds a window down and the vehicle slows without stopping.',
        'The tag sits on the inside of the glass, out of the rain and away from the car wash. It is built to fail if someone tries to peel it off, which is the point in subscription parking and authorised vehicle schemes.',
      ],
      specs: [
        { label: 'Technology', value: 'Passive UHF' },
        { label: 'Read range', value: '4-10 m, up to 12 m on some systems' },
        { label: 'Operating temperature', value: '-40 °C to +70 °C' },
        { label: 'Application', value: 'Applied to the inside of the windscreen' },
        { label: 'Security', value: 'Tamper construction that stops reading when removed' },
        { label: 'Identity', value: 'Unique EPC number per tag' },
      ],
      highlights: [
        'Barrier access without stopping',
        'Tamper construction that fails on removal',
        'No battery, no maintenance',
        'Integrates with parking automation and security software',
      ],
    },
  },
  {
    slug: 'guga7320-rfid-demirbas-etiketi',
    model: 'Guga7320',
    category: 'label',
    tr: {
      title: 'RFID Demirbaş Etiketi',
      excerpt: 'Demirbaş, tekstil ve hazır giyim uygulamaları için gelişmiş anten tasarımlı RFID etiket.',
      body: [
        'Demirbaş sayımı yılda bir yapılıp haftalarca sürüyorsa sonucunu kimse ciddiye almaz. Etiketlenmiş demirbaş oda oda okunarak sayıldığında aynı iş günler içinde biter.',
        'Aynı etiket giyim ve tekstil hatlarında da kullanılıyor. Gelişmiş anten tasarımı kutu içindeki ya da raf arkasındaki ürünün de okunmasını sağladığı için sayımda ürünü elden geçirmek gerekmiyor.',
      ],
      specs: [],
      highlights: [
        'Oda bazlı hızlı sayım',
        'Kutu açmadan okuma',
        'Pasif teknoloji, pil ve bakım yok',
        'Demirbaş ve hazır giyim uygulamaları',
      ],
    },
    en: {
      title: 'RFID Fixed Asset Label',
      excerpt: 'An RFID label with an enhanced antenna design, for fixed assets, textiles and apparel.',
      body: [
        'An asset count that happens once a year and drags on for weeks convinces nobody. Tagged assets are read room by room, and the same job finishes in days.',
        'The same label runs on apparel and textile lines. The antenna design reads items inside a carton or behind a rack, so counting does not mean handling stock.',
      ],
      specs: [],
      highlights: [
        'Fast room-by-room counting',
        'Reads without opening cartons',
        'Passive, so no battery and no maintenance',
        'Fixed asset and apparel applications',
      ],
    },
  },
  {
    slug: 'guga1010-rfid-lojistik-etiketi',
    model: 'Guga1010',
    category: 'label',
    tr: {
      title: 'RFID Lojistik Etiketi',
      excerpt: 'Her yönden okunabilen lojistik etiketi. Palet kapıdan nasıl geçerse geçsin okunur.',
      body: [
        'Palet kapıdan geçerken kimse etiketin yönünü ayarlamaz. Omnidirectional anten tasarımı bu yüzden önemli: etiket antene dik de baksa, yan da dursa okuma başarısı düşmez.',
        'Depo giriş çıkışı, aktarma merkezi ve araç yüklemesi gibi hızın yüksek olduğu noktalarda kullanılıyor. Okunan veri WMS tarafına yazıldığı için sevkiyat kaydı elle giriş beklemez.',
      ],
      specs: [
        { label: 'Okuma yönü', value: 'Omnidirectional, her yönden okuma' },
        { label: 'Teknoloji', value: 'Pasif RFID' },
      ],
      highlights: [
        'Her yönden okuma',
        'Kapı ve konveyör geçişlerinde yüksek okuma başarısı',
        'WMS ve lojistik yazılımlarıyla uyumlu',
        'Pasif yapı, bakım gerektirmez',
      ],
    },
    en: {
      title: 'RFID Logistics Label',
      excerpt: 'An omnidirectional logistics label. However the pallet goes through the door, it gets read.',
      body: [
        'Nobody straightens a label before a pallet rolls through a door. That is why the omnidirectional antenna matters: facing the reader or turned sideways, the read rate holds.',
        'It is used where throughput is high, at inbound and outbound doors, cross-docks and vehicle loading. Reads are written into the WMS, so the dispatch record does not wait on manual entry.',
      ],
      specs: [
        { label: 'Read orientation', value: 'Omnidirectional' },
        { label: 'Technology', value: 'Passive RFID' },
      ],
      highlights: [
        'Reads from any orientation',
        'High read rate at doors and on conveyors',
        'Works with WMS and logistics software',
        'Passive construction, no maintenance',
      ],
    },
  },

  // ----------------------------------------------------- endüstriyel tag
  {
    slug: 'guga050405-metal-uzeri-rfid-tag',
    model: 'Guga050405',
    category: 'industrial-tag',
    tr: {
      title: 'Ø5 mm Metal Üzeri RFID Tag',
      excerpt: 'Çapı 5 mm olan, metal üzerinde çalışan endüstriyel tag. Ürün gamımızın en küçük anti-metal modeli.',
      body: [
        'Metal, RFID için zor bir yüzeydir: sinyali yansıtır ve etiketi okunmaz hale getirir. Anti-metal tasarım bu sorunu çözer, ama çoğu modelde çözümün bedeli boyuttur.',
        'Bu tag 5 mm çapa sığıyor. Alet sapına açılan bir deliğe, kalıp üzerindeki bir yuvaya ya da küçük bir bağlantı elemanına yerleşir. EPC alanı kullanıcı tarafından programlanabildiği için kendi numaralandırma düzeninizi kurabilirsiniz.',
      ],
      specs: [
        { label: 'Boyut', value: 'Ø5 mm, 4 mm yükseklik' },
        { label: 'Frekans', value: 'UHF 865-928 MHz' },
        { label: 'Hafıza', value: 'Kullanıcı tarafından programlanabilir EPC alanı' },
        { label: 'Montaj yüzeyi', value: 'Metal, anti-metal yapı' },
      ],
      highlights: [
        'Dar yuvalara sığan kompakt gövde',
        'Metal yüzeyde okuma',
        'Programlanabilir EPC alanı',
        'Alet ve makine bakım takibi',
      ],
    },
    en: {
      title: 'Ø5 mm On-Metal RFID Tag',
      excerpt: 'A 5 mm industrial tag that works on metal. The smallest on-metal model in the range.',
      body: [
        'Metal is a hard surface for RFID: it reflects the signal and kills the read. On-metal designs solve that, and in most models the price of the fix is size.',
        'This one fits into 5 mm. It sits in a hole drilled in a tool handle, a recess in a die, or on a small fitting. The EPC area is user-programmable, so your own numbering scheme carries straight over.',
      ],
      specs: [
        { label: 'Dimensions', value: 'Ø5 mm, 4 mm height' },
        { label: 'Frequency', value: 'UHF 865-928 MHz' },
        { label: 'Memory', value: 'User-programmable EPC area' },
        { label: 'Mounting surface', value: 'Metal, on-metal construction' },
      ],
      highlights: [
        'Compact body for tight recesses',
        'Reads on metal surfaces',
        'Programmable EPC area',
        'Tool and machine maintenance tracking',
      ],
    },
  },
  {
    slug: 'guga060304-anti-metal-rfid-tag',
    model: 'Guga060304',
    category: 'industrial-tag',
    tr: {
      title: '6 x 3 mm Anti-Metal RFID Tag',
      excerpt: 'Küçük metal aletlerin takibi için anti-metal tag. Yaklaşık bir metre okuma mesafesi verir.',
      body: [
        'Alet dolabındaki her parçayı numaralandırmak istiyorsanız etiketin alete zarar vermeden oturması gerekir. 6 x 3 mm gövde pense sapına, anahtar başına ya da kalıp kenarına yerleşir.',
        'Suya dayanıklı yapısı yıkanan ve yağlı ortamda kalan aletler için önemli. Çarpışma önleyici tasarımı sayesinde aynı anda okunan çok sayıda tag birbirini bastırmaz, dolap sayımı tek okumaya iner.',
      ],
      specs: [
        { label: 'Boyut', value: '6 x 3 mm, 4 mm kalınlık' },
        { label: 'Okuma mesafesi', value: 'Yaklaşık 0,9 metre' },
        { label: 'Montaj yüzeyi', value: 'Metal, anti-metal yapı' },
        { label: 'Koruma', value: 'Suya dayanıklı' },
      ],
      highlights: [
        'Metal alet ve ekipman üzerinde çalışır',
        'Suya dayanıklı gövde',
        'Toplu okumada çarpışma önleme',
        'Lojistik, depo ve erişim kontrolü uygulamaları',
      ],
    },
    en: {
      title: '6 x 3 mm On-Metal RFID Tag',
      excerpt: 'An on-metal tag for tracking small metal tools, with a read range of roughly one metre.',
      body: [
        'To number every item in a tool crib, the tag has to sit on the tool without getting in the way. A 6 x 3 mm body fits on a plier handle, a spanner head or the edge of a die.',
        'Water resistance matters for tools that get washed down or live in oil. Anti-collision behaviour means a crib full of tags does not drown itself out, so the whole cabinet counts in one read.',
      ],
      specs: [
        { label: 'Dimensions', value: '6 x 3 mm, 4 mm thick' },
        { label: 'Read range', value: 'Approximately 0.9 m' },
        { label: 'Mounting surface', value: 'Metal, on-metal construction' },
        { label: 'Protection', value: 'Water resistant' },
      ],
      highlights: [
        'Works on metal tools and equipment',
        'Water-resistant body',
        'Anti-collision for bulk reads',
        'Logistics, warehousing and access control',
      ],
    },
  },
  {
    slug: 'guga060302-ultra-kucuk-rfid-tag',
    model: 'Guga060302',
    category: 'industrial-tag',
    tr: {
      title: '6 x 3 x 2 mm Ultra Küçük RFID Tag',
      excerpt: 'Yarım gramın altında, 6 x 3 x 2 mm ölçülerinde ultra küçük metal tag.',
      body: [
        'Ağırlığı 0,2 gram. Takıldığı parçanın dengesini ya da kullanımını etkilemeyecek kadar az. Laptop kasasına, el aletine ya da geri dönebilen metal konteynere takıldığında fark edilmiyor.',
        'Metal yüzeye monte edildiğinde sabit okuyucuyla 0,85 metreye kadar okunur. Üretim hattı ekipmanı ve BT envanteri gibi parça sayısının yüksek, boş alanın dar olduğu yerlerde kullanılıyor.',
      ],
      specs: [
        { label: 'Boyut', value: '6 x 3 x 2 mm' },
        { label: 'Ağırlık', value: '0,2 gram' },
        { label: 'Okuma mesafesi', value: 'Metal yüzeyde sabit okuyucuyla 0,85 metreye kadar' },
        { label: 'Montaj yüzeyi', value: 'Metal' },
      ],
      highlights: [
        'Ultra küçük gövde, 0,2 gram ağırlık',
        'Metal yüzey uyumlu',
        'BT ekipmanı ve üretim hattı envanteri',
        'Geri dönebilen metal konteyner takibi',
      ],
    },
    en: {
      title: '6 x 3 x 2 mm Ultra-Small RFID Tag',
      excerpt: 'An ultra-small on-metal tag measuring 6 x 3 x 2 mm and weighing well under half a gram.',
      body: [
        'It weighs 0.2 grams. That is light enough not to change how the tagged item balances or handles, whether it goes on a laptop chassis, a hand tool or a returnable metal container.',
        'Mounted on metal, it reads up to 0.85 m with a fixed reader. It suits places with a high item count and very little spare surface: production line equipment and IT inventory in particular.',
      ],
      specs: [
        { label: 'Dimensions', value: '6 x 3 x 2 mm' },
        { label: 'Weight', value: '0.2 g' },
        { label: 'Read range', value: 'Up to 0.85 m on metal with a fixed reader' },
        { label: 'Mounting surface', value: 'Metal' },
      ],
      highlights: [
        'Ultra-small body at 0.2 g',
        'Designed for metal surfaces',
        'IT equipment and production line inventory',
        'Returnable metal container tracking',
      ],
    },
  },
  {
    slug: 'guga100402-metal-alet-tag',
    model: 'Guga100402',
    category: 'industrial-tag',
    tr: {
      title: '10 x 4 mm Metal Alet Tag',
      excerpt: 'Küçük metal alet ve BT ekipmanı takibi için 10 x 4 mm boyutunda tag.',
      body: [
        'Laptop, sunucu ve el aleti envanterini tutmak, o parçaların üzerine kalıcı bir kimlik koymayı gerektirir. Barkod etiketi sürtünmeyle silinir, metal üzerinde çalışan bir tag silinmez.',
        '10 x 4 mm gövde dar alanlara sığar. Araç tanımlama, küçük alet yönetimi ve BT envanteri bu modelin en çok kullanıldığı yerler. Ölçü ve baskı tarafında özel üretim talepleri karşılanabiliyor.',
      ],
      specs: [
        { label: 'Boyut', value: '10 x 4 mm' },
        { label: 'Ağırlık', value: '0,5 gram' },
        { label: 'Montaj yüzeyi', value: 'Metal' },
      ],
      highlights: [
        'Dar alanlara entegre edilebilir',
        'Metal yüzeyde kararlı okuma',
        'BT ekipmanı ve araç tanımlama',
        'Özel üretim ve kişiselleştirme',
      ],
    },
    en: {
      title: '10 x 4 mm Metal Tool Tag',
      excerpt: 'A 10 x 4 mm tag for tracking small metal tools and IT equipment.',
      body: [
        'Keeping an inventory of laptops, servers and hand tools means putting a permanent identity on each one. A printed barcode wears off with handling. An on-metal tag does not.',
        'The 10 x 4 mm body drops into tight spaces. Vehicle identification, small tool management and IT asset registers are where it gets used most. Custom sizes and printing can be quoted.',
      ],
      specs: [
        { label: 'Dimensions', value: '10 x 4 mm' },
        { label: 'Weight', value: '0.5 g' },
        { label: 'Mounting surface', value: 'Metal' },
      ],
      highlights: [
        'Fits into tight installation spaces',
        'Stable reads on metal',
        'IT equipment and vehicle identification',
        'Custom production and personalisation',
      ],
    },
  },
  {
    slug: 'guga361303-varlik-takip-tag',
    model: 'Guga361303',
    category: 'industrial-tag',
    tr: {
      title: '36 x 13 mm Varlık Takip Tag',
      excerpt: 'Hastane ve saha envanteri için UHF tag. Araç ve alet takibinde 4,7 metreye kadar okunur.',
      body: [
        'Hastanede bir infüzyon pompasını aramak, o pompanın kullanılmadığı her dakika demek. Etiketlenen ekipmanın en son hangi bölümde okunduğu kayıtta durduğunda arama süresi kısalır.',
        'İlaç dolabı, alet seti ve taşınabilir cihaz için kullanılıyor. 4,7 metreye kadar okuma mesafesi, koridorda ya da kapı geçişinde yapılan okumaların da işe yaraması anlamına geliyor.',
      ],
      specs: [
        { label: 'Boyut', value: '36 x 13 mm' },
        { label: 'Kalınlık', value: '3,5 mm' },
        { label: 'Ağırlık', value: '3,5 gram' },
        { label: 'Okuma mesafesi', value: 'Araç ve alet takibinde 4,7 metreye kadar' },
        { label: 'Frekans', value: 'UHF' },
      ],
      highlights: [
        'Uzun okuma mesafesi',
        'Hastane ekipmanı ve ilaç dolabı takibi',
        'Bakım planlaması için kullanım kaydı',
        'Alet ve araç takibi',
      ],
    },
    en: {
      title: '36 x 13 mm Asset Tracking Tag',
      excerpt: 'A UHF tag for hospital and field inventory, reading up to 4.7 m on vehicle and tool tracking.',
      body: [
        'Hunting for an infusion pump is a minute that pump is not treating anyone. Once the department where a tagged device was last read is on record, the hunt gets shorter.',
        'It goes on drug cabinets, tool sets and mobile devices. With 4.7 m of range, a read taken from the corridor or at a doorway still lands, so nobody has to walk up to the device to log it.',
      ],
      specs: [
        { label: 'Dimensions', value: '36 x 13 mm' },
        { label: 'Thickness', value: '3.5 mm' },
        { label: 'Weight', value: '3.5 g' },
        { label: 'Read range', value: 'Up to 4.7 m on vehicle and tool tracking' },
        { label: 'Frequency', value: 'UHF' },
      ],
      highlights: [
        'Long read range',
        'Hospital equipment and drug cabinet tracking',
        'Usage records for maintenance planning',
        'Tool and vehicle tracking',
      ],
    },
  },
  {
    slug: 'guga660403-ince-anti-metal-rfid-tag',
    model: 'Guga660403',
    category: 'industrial-tag',
    tr: {
      title: 'İnce Formlu Anti-Metal RFID Tag',
      excerpt: 'Boru, makine ve BT ekipmanı gibi dar montaj alanları için ince gövdeli anti-metal UHF tag.',
      body: [
        'Her metal parçada etiket için düz ve geniş bir yüzey bulunmaz. Boru gövdesi, makine kasası kenarı ve raf profili gibi yerlerde ince ve uzun bir form gerekir.',
        'Bu tag o boşluğa göre tasarlandı. Metal yüzeyle temas ettiğinde okuma performansı düşmez, zorlu endüstriyel ortamda uzun süre çalışır.',
      ],
      specs: [
        { label: 'Frekans', value: 'UHF' },
        { label: 'Montaj yüzeyi', value: 'Metal, anti-metal yapı' },
      ],
      highlights: [
        'Dar montaj alanlarına uygun ince gövde',
        'Metal yüzeyde kararlı okuma',
        'Endüstriyel ortamda uzun ömür',
        'Boru, makine ve BT ekipmanı takibi',
      ],
    },
    en: {
      title: 'Slim On-Metal RFID Tag',
      excerpt: 'A slim on-metal UHF tag for tight mounting positions: pipework, machine housings and IT equipment.',
      body: [
        'Not every metal part offers a flat, generous surface for a tag. Pipe bodies, machine housing edges and rack profiles need a long, narrow form instead.',
        'This tag was built for that gap. Read performance holds when it sits directly on metal, and it survives long service in rough industrial conditions.',
      ],
      specs: [
        { label: 'Frequency', value: 'UHF' },
        { label: 'Mounting surface', value: 'Metal, on-metal construction' },
      ],
      highlights: [
        'Slim body for tight mounting positions',
        'Stable reads on metal',
        'Long service life in industrial environments',
        'Pipework, machinery and IT equipment',
      ],
    },
  },
  {
    slug: 'guga702003-atex-sertifikali-rfid-tag',
    model: 'Guga702003',
    category: 'industrial-tag',
    featured: true,
    tr: {
      title: '70 x 20 mm ATEX Sertifikalı RFID Tag',
      excerpt: 'ATEX sertifikalı, metal yüzeyde 10,3 metreye kadar okunan uzun menzilli endüstriyel tag.',
      body: [
        'Patlayıcı ortam sınıflandırması olan tesislerde her ekipmanın sertifikası sorulur. Bu tag ATEX sertifikalı, dolayısıyla kimya ve petrokimya sahalarında kullanılabiliyor.',
        'Metal yüzeye monte edildiğinde sabit okuyucuyla 10,3 metreye kadar okunuyor. Konteyner, büyük ekipman ve depo varlıklarının kapı geçişinde okunması için fazlasıyla yeterli bir mesafe.',
      ],
      specs: [
        { label: 'Boyut', value: '70 x 20 mm' },
        { label: 'Kalınlık', value: '3,6 mm' },
        { label: 'Ağırlık', value: '11,0 gram' },
        { label: 'Okuma mesafesi', value: 'Sabit okuyucuyla 10,3 metreye kadar' },
        { label: 'Sertifika', value: 'ATEX' },
        { label: 'Standart', value: 'EPC C1G2, ISO 18000-6C' },
      ],
      highlights: [
        'ATEX sertifikalı',
        'Metal üzerinde uzun okuma mesafesi',
        'EPC C1G2 ve ISO 18000-6C uyumlu',
        'Konteyner ve büyük ekipman takibi',
      ],
    },
    en: {
      title: '70 x 20 mm ATEX Certified RFID Tag',
      excerpt: 'An ATEX certified long-range industrial tag, reading up to 10.3 m on metal.',
      body: [
        'On a site with a hazardous area classification, every piece of equipment gets asked for its certificate. This tag is ATEX certified, which is what lets it into chemical and petrochemical plants.',
        'Mounted on metal it reads up to 10.3 m with a fixed reader. That is more than enough range to pick up containers, large equipment and warehouse assets as they pass a gate.',
      ],
      specs: [
        { label: 'Dimensions', value: '70 x 20 mm' },
        { label: 'Thickness', value: '3.6 mm' },
        { label: 'Weight', value: '11.0 g' },
        { label: 'Read range', value: 'Up to 10.3 m with a fixed reader' },
        { label: 'Certification', value: 'ATEX' },
        { label: 'Standard', value: 'EPC C1G2, ISO 18000-6C' },
      ],
      highlights: [
        'ATEX certified',
        'Long read range on metal',
        'EPC C1G2 and ISO 18000-6C compliant',
        'Container and heavy equipment tracking',
      ],
    },
  },
  {
    slug: 'guga902003-uzun-menzilli-rfid-tag',
    model: 'Guga902003',
    category: 'industrial-tag',
    featured: true,
    tr: {
      title: '90 x 20 mm Uzun Menzilli RFID Tag',
      excerpt: 'IP68 korumalı, 10,8 metreye kadar okunan anti-metal tag. Araç takibi ve otopark yönetimi için.',
      body: [
        'Açık alanda çalışan bir etiket için asıl sınav yağmur ve tozdur. IP68 koruma sınıfı bu iki koşulu da kapsıyor, tag araç şasisine ya da dış saha ekipmanına takıldığında mevsim değişimi bir şeyi bozmuyor.',
        '10,8 metrelik okuma mesafesi, bariyer önünde durmayan araç geçişleri için yeterli. Montaj için üç seçenek var: yüksek performanslı yapıştırıcı, perçin deliği ya da kablo bağı.',
      ],
      specs: [
        { label: 'Boyut', value: '90 x 20 mm' },
        { label: 'Okuma mesafesi', value: 'En fazla 10,8 metre' },
        { label: 'Çalışma frekansı', value: '902-928 MHz (ABD) veya 865-868 MHz (AB)' },
        { label: 'Entegre çip', value: 'Alien Higgs-3' },
        { label: 'Koruma sınıfı', value: 'IP68' },
        { label: 'Montaj', value: 'Yüksek performanslı yapıştırıcı, perçin deliği veya kablo bağı' },
      ],
      highlights: [
        'IP68 koruma sınıfı',
        'Bariyerde durmadan geçiş için uzun menzil',
        'Alien Higgs-3 çip',
        'Üç farklı montaj seçeneği',
      ],
    },
    en: {
      title: '90 x 20 mm Long Range RFID Tag',
      excerpt: 'An IP68 on-metal tag reading up to 10.8 m, for vehicle tracking and parking management.',
      body: [
        'For a tag that lives outdoors, rain and dust are the real test. An IP68 rating covers both, so fitting it to a vehicle chassis or yard equipment does not turn into a seasonal problem.',
        'A 10.8 m read range is enough for vehicles that never stop at the barrier. Three mounting options are available: high-performance adhesive, a rivet hole, or a cable tie.',
      ],
      specs: [
        { label: 'Dimensions', value: '90 x 20 mm' },
        { label: 'Read range', value: 'Up to 10.8 m' },
        { label: 'Operating frequency', value: '902-928 MHz (US) or 865-868 MHz (EU)' },
        { label: 'Integrated chip', value: 'Alien Higgs-3' },
        { label: 'Ingress protection', value: 'IP68' },
        { label: 'Mounting', value: 'High-performance adhesive, rivet hole or cable tie' },
      ],
      highlights: [
        'IP68 rated',
        'Range that supports drive-through barrier access',
        'Alien Higgs-3 chip',
        'Three mounting options',
      ],
    },
  },

  // ------------------------------------------------ endüstriyel etiketler
  {
    slug: 'yapiskansiz-yuksek-sicaklik-etiketi',
    category: 'industrial-label',
    featured: true,
    tr: {
      title: 'Yapışkansız Yüksek Sıcaklık Etiketi',
      excerpt: 'Külçe, kütük ve profil gibi ısıl işlem gören ürünler için yapışkansız etiket. 800 °C sıcaklığa kadar dayanır.',
      body: [
        'Haddehanede ya da dökümhanede yapışkanlı etiket tutunmaz. Yüzey sıcak, çoğu zaman kirli ve tozlu. Yapıştırıcı ilk temasta bozulur.',
        'Bu etiketler yapışkan içermez. Ürüne asılarak, telle geçirilerek ya da mekanik olarak sabitlenir. Özel kompozit yapısı 400 ile 800 °C arasında formunu korur, baskı yüksek ısıda bile okunabilir kalır.',
      ],
      specs: [
        { label: 'Sıcaklık dayanımı', value: '400-800 °C' },
        { label: 'Uygulama', value: 'Asma, tel geçirme veya mekanik sabitleme' },
        { label: 'Yapışkan', value: 'Yok' },
        { label: 'Baskı', value: 'Termal transfer' },
        { label: 'Ürün kodları', value: 'SPT 7070, PST 7030, PST 7040, PST 7050, APT 7000, PMT 7060, AUT 7080, HCT 7090' },
      ],
      highlights: [
        '400-800 °C arası sıcaklık dayanımı',
        'UV, kimyasal ve mekanik etkilere direnç',
        'Yırtılmaya karşı yüksek mukavemet',
        'Külçe, kütük, levha, rulo ve profil için',
      ],
    },
    en: {
      title: 'Adhesive-Free High Temperature Tag',
      excerpt: 'An adhesive-free tag for heat-treated products such as billets, blooms and profiles. Rated to 800 °C.',
      body: [
        'In a rolling mill or a foundry an adhesive label has nothing to hold on to. The surface is hot, usually dirty and dusty, and the adhesive fails on first contact.',
        'These tags carry no adhesive at all. They are hung, wired through, or mechanically fixed to the product. The composite structure holds its form between 400 and 800 °C, and the print stays readable through the heat.',
      ],
      specs: [
        { label: 'Temperature resistance', value: '400-800 °C' },
        { label: 'Application', value: 'Hung, wired through or mechanically fixed' },
        { label: 'Adhesive', value: 'None' },
        { label: 'Printing', value: 'Thermal transfer' },
        { label: 'Part codes', value: 'SPT 7070, PST 7030, PST 7040, PST 7050, APT 7000, PMT 7060, AUT 7080, HCT 7090' },
      ],
      highlights: [
        'Rated for 400-800 °C',
        'Resistant to UV, chemicals and mechanical stress',
        'High tear strength',
        'For billets, blooms, plate, coil and profiles',
      ],
    },
  },
  {
    slug: 'yapiskanli-yuksek-sicaklik-etiketi',
    category: 'industrial-label',
    tr: {
      title: 'Yapışkanlı Yüksek Sıcaklık Etiketi',
      excerpt: 'Metal, lastik, beton ve pürüzlü yüzeyler için 150-600 °C arasında çalışan yapışkanlı endüstriyel etiket.',
      body: [
        'Yüksek ısıda etiketin kalkması ya da baskının silinmesi izlenebilirliği bitirir. Parça hatta devam eder, kimliği kaybolur.',
        'Endüstriyel akrilik ve kauçuk bazlı yapıştırıcılar, ısıyla temas eden yüzeyde bile etiketi iz bırakmadan yerinde tutar. Yağlı, kirli ve pürüzlü yüzeylerde de tutunur. Termal transfer baskı yüksek ısı altında okunabilirliğini korur.',
      ],
      specs: [
        { label: 'Sıcaklık dayanımı', value: '150-600 °C' },
        { label: 'Malzeme', value: 'Poliimid, alüminyum, polipropilen veya polyester' },
        { label: 'Yapıştırıcı', value: 'Endüstriyel akrilik ya da kauçuk bazlı' },
        { label: 'Baskı', value: 'Termal transfer' },
        { label: 'Uygun yüzeyler', value: 'Metal, kauçuk, HDPE, PP, beton, pürüzlü ve düşük yüzey enerjili malzemeler' },
        { label: 'Ürün kodları', value: 'PSL 3030, PSL 3050, PSL 3060, PML 6061, AUL 6050, AUL 6055' },
      ],
      highlights: [
        '150-600 °C arası stabil performans',
        'Düşük yüzey enerjili malzemelerde güçlü tutunma',
        'Yağ, solvent, su ve UV direnci',
        'Yırtılmaz film yapısı',
      ],
    },
    en: {
      title: 'High Temperature Adhesive Label',
      excerpt: 'An adhesive industrial label rated 150-600 °C for metal, rubber, concrete and rough surfaces.',
      body: [
        'When a label lifts under heat, or the print burns off, traceability ends there. The part carries on down the line without an identity.',
        'Industrial acrylic and rubber-based adhesives hold the label in place on heated surfaces and lift cleanly without residue. They also grip oily, dirty and rough surfaces, and thermal transfer print stays readable through the heat.',
      ],
      specs: [
        { label: 'Temperature resistance', value: '150-600 °C' },
        { label: 'Material', value: 'Polyimide, aluminium, polypropylene or polyester' },
        { label: 'Adhesive', value: 'Industrial acrylic or rubber based' },
        { label: 'Printing', value: 'Thermal transfer' },
        { label: 'Suitable surfaces', value: 'Metal, rubber, HDPE, PP, concrete, rough and low surface energy materials' },
        { label: 'Part codes', value: 'PSL 3030, PSL 3050, PSL 3060, PML 6061, AUL 6050, AUL 6055' },
      ],
      highlights: [
        'Stable performance from 150 to 600 °C',
        'Strong grip on low surface energy materials',
        'Resists oil, solvents, water and UV',
        'Tear-resistant film construction',
      ],
    },
  },
  {
    slug: 'guclu-yapiskanli-endustriyel-etiket',
    category: 'industrial-label',
    tr: {
      title: 'Güçlü Yapışkanlı Endüstriyel Etiket',
      excerpt: 'Tozlu, pürüzlü ve yağlı yüzeylerde tutunan güçlü yapışkanlı endüstriyel etiket ailesi.',
      body: [
        'Bir etiketin düşmesi çoğu zaman etiketin kalitesinden değil, yapıştırıldığı yüzeyden kaynaklanır. Toz, yağ ve pürüz yapıştırıcının temas alanını düşürür.',
        'Bu ailede yapıştırıcı seçimi yüzeye göre yapılıyor. Sıcak ve soğuk etiketleme için farklı formüller var; hangi yüzeye hangisinin uygulanacağı, ortamın koşullarına bakılarak belirleniyor.',
      ],
      specs: [
        { label: 'Uygun yüzeyler', value: 'Tozlu, pürüzlü ve yağlı yüzeyler' },
        { label: 'Ürün kodları', value: 'HDL 5250, PPL 5150, PPL 5200, PPL 5210' },
      ],
      highlights: [
        'Zorlu yüzeylerde maksimum tutunma',
        'Sıcak ve soğuk etiketleme için farklı yapışkan seçenekleri',
        'Tozlu, yağlı ve pürüzlü ortamlarda uzun süreli dayanım',
      ],
    },
    en: {
      title: 'High-Tack Industrial Label',
      excerpt: 'A high-tack industrial label family that holds on dusty, rough and oily surfaces.',
      body: [
        'A label that falls off usually says more about the surface than the label. Dust, oil and roughness all cut down the area the adhesive can actually touch.',
        'In this family the adhesive is chosen for the surface. Separate formulations cover hot and cold application, and which one goes on which surface is decided from the conditions on site.',
      ],
      specs: [
        { label: 'Suitable surfaces', value: 'Dusty, rough and oily surfaces' },
        { label: 'Part codes', value: 'HDL 5250, PPL 5150, PPL 5200, PPL 5210' },
      ],
      highlights: [
        'Maximum grip on difficult surfaces',
        'Separate adhesives for hot and cold application',
        'Long service life in dusty, oily and rough conditions',
      ],
    },
  },

  // ----------------------------------------------------------------- kart
  {
    slug: 'pvc-kart-cipsiz',
    category: 'card',
    tr: {
      title: 'PVC Kart (Çipsiz)',
      excerpt: 'Baskılı ya da baskısız PVC kart. Manyetik şerit, imza paneli, kabartma ve hologram seçenekleriyle.',
      body: [
        'Her uygulama çip istemiyor. Ziyaretçi kartı, sadakat kartı ve hediye kartı çoğu zaman barkod ya da manyetik şeritle çalışır, çip maliyeti gereksiz kalır.',
        'Baskı, laminasyon ve kesim aşamalarının hepsi tek elden yürüdüğü için küçük adetli işler de milyon adetlik siparişler de aynı hattan çıkıyor. Hologram, imza paneli ve kabartma sipariş bazında ekleniyor.',
      ],
      specs: [
        { label: 'Kart tipleri', value: 'Düz beyaz, baskılı, renkli ve şeffaf PVC' },
        { label: 'Yüzey işlemleri', value: 'Mat veya parlak laminasyon, hologram, imza paneli, kabartma' },
        { label: 'Veri taşıyıcı', value: 'QR kod, barkod, manyetik şerit (LoCo / HiCo)' },
      ],
      highlights: [
        'LoCo ve HiCo manyetik şerit seçenekleri',
        'Hologram, imza paneli ve kabartma',
        'Mat ve parlak laminasyon',
        'Küçük adetten milyon adede ölçeklenir',
      ],
    },
    en: {
      title: 'PVC Card (Non-Chip)',
      excerpt: 'Printed or blank PVC cards, with magnetic stripe, signature panel, embossing and hologram options.',
      body: [
        'Not every application needs a chip. Visitor badges, loyalty cards and gift cards usually run on a barcode or a magnetic stripe, and paying for silicon adds nothing.',
        'Printing, lamination and die-cutting run in-house, so a hundred cards and a million cards come off the same line. Holograms, signature panels and embossing are added per order.',
      ],
      specs: [
        { label: 'Card types', value: 'Plain white, printed, coloured and clear PVC' },
        { label: 'Surface finishes', value: 'Matt or gloss lamination, hologram, signature panel, embossing' },
        { label: 'Data carrier', value: 'QR code, barcode, magnetic stripe (LoCo / HiCo)' },
      ],
      highlights: [
        'LoCo and HiCo magnetic stripe options',
        'Hologram, signature panel and embossing',
        'Matt and gloss lamination',
        'Scales from short runs to million-unit orders',
      ],
    },
  },
  {
    slug: 'lf-rfid-kart',
    category: 'card',
    tr: {
      title: 'LF RFID Kart (125 kHz)',
      excerpt: 'Geçiş kontrolü ve personel devam sistemleri için 125 kHz LF kart.',
      body: [
        'LF kartlar eski teknoloji ama hâlâ yaygın. Fabrika turnikelerinin ve kapı okuyucularının büyük kısmı bu bantta çalışıyor, dolayısıyla kart yenileme ihtiyacı sürüyor.',
        'EM4100 ve EM4200 salt okunur çalışır. EM4305 yazılabilir, T5577 ise mevcut kart düzeninize uyacak şekilde programlanabilir. Hangi çipin uygun olduğunu sahadaki okuyucunun beklentisi belirler.',
      ],
      specs: [
        { label: 'Frekans', value: '125-128 kHz' },
        { label: 'Çip seçenekleri', value: 'EM4100, EM4200, EM4305 (yazılabilir), T5577 (klonlanabilir), Temic' },
      ],
      highlights: [
        'Mevcut geçiş sistemleriyle uyum',
        'Yazılabilir ve programlanabilir çip seçenekleri',
        'Personel devam ve kapı geçiş uygulamaları',
      ],
    },
    en: {
      title: 'LF RFID Card (125 kHz)',
      excerpt: 'A 125 kHz LF card for access control and time and attendance systems.',
      body: [
        'LF is old technology and still everywhere. A large share of factory turnstiles and door readers work on this band, so the demand for replacement cards has not gone away.',
        'EM4100 and EM4200 are read-only. EM4305 is writable, and T5577 can be programmed to match the card scheme you already run. Which chip fits is decided by what the installed readers expect.',
      ],
      specs: [
        { label: 'Frequency', value: '125-128 kHz' },
        { label: 'Chip options', value: 'EM4100, EM4200, EM4305 (writable), T5577 (clonable), Temic' },
      ],
      highlights: [
        'Compatible with installed access systems',
        'Writable and programmable chip options',
        'Time and attendance and door access',
      ],
    },
  },
  {
    slug: 'hf-rfid-kart',
    category: 'card',
    featured: true,
    tr: {
      title: 'HF RFID Kart (13,56 MHz)',
      excerpt: 'NFC uyumlu 13,56 MHz kartlar. MIFARE, NTAG ve ICODE ailelerinden çip seçenekleriyle.',
      body: [
        'Kurumsal kimlik, otel kapısı, ulaşım ve ödeme uygulamalarının çoğu 13,56 MHz üzerinde çalışıyor. Bu bandın farkı, kart üzerinde veri tutabilmek ve o veriyi şifreleyebilmek.',
        'DESFire EV2 ve EV3 gibi çipler kimlik doğrulama ve şifreleme desteği verir. NTAG serisi telefondan okunabildiği için sadakat ve bilgilendirme uygulamalarında kullanılıyor. Çip kodlaması üretim sırasında yapılabiliyor.',
      ],
      specs: [
        { label: 'Frekans', value: '13,56 MHz' },
        {
          label: 'Çip seçenekleri',
          value: 'MIFARE Ultralight, Classic 1K/4K, DESFire EV1/EV2/EV3, MIFARE Plus, NTAG213/215/216, ICODE SLIX/SLIX2',
        },
        { label: 'Standart', value: 'ISO 14443A, ISO 15693' },
      ],
      highlights: [
        'NFC telefonlarla okunabilen NTAG seçenekleri',
        'DESFire ile şifreli kimlik doğrulama',
        'ISO 14443A ve ISO 15693 uyumu',
        'Üretim sırasında çip kodlama',
      ],
    },
    en: {
      title: 'HF RFID Card (13.56 MHz)',
      excerpt: 'NFC-compatible 13.56 MHz cards, with chip options across the MIFARE, NTAG and ICODE families.',
      body: [
        'Corporate ID, hotel doors, transit and payment mostly sit on 13.56 MHz. What separates this band is that the card can hold data, and that data can be encrypted.',
        'Chips such as DESFire EV2 and EV3 bring authentication and encryption. The NTAG range reads from a phone, which is why it shows up in loyalty and information applications. Chip encoding can be done during production.',
      ],
      specs: [
        { label: 'Frequency', value: '13.56 MHz' },
        {
          label: 'Chip options',
          value: 'MIFARE Ultralight, Classic 1K/4K, DESFire EV1/EV2/EV3, MIFARE Plus, NTAG213/215/216, ICODE SLIX/SLIX2',
        },
        { label: 'Standards', value: 'ISO 14443A, ISO 15693' },
      ],
      highlights: [
        'NTAG options readable from NFC phones',
        'Encrypted authentication with DESFire',
        'ISO 14443A and ISO 15693 compliant',
        'Chip encoding during production',
      ],
    },
  },
  {
    slug: 'uhf-rfid-kart',
    category: 'card',
    tr: {
      title: 'UHF RFID Kart (860-960 MHz)',
      excerpt: 'Uzun mesafeden okunan RAIN RFID kartlar. Otopark, saha girişi ve araç tanımlama için.',
      body: [
        'HF kartı okutmak için okuyucuya değdirmeniz gerekir. UHF kart metrelerce mesafeden okunur, bu da kapıda durmadan geçişi mümkün kılar.',
        'Personel kartının aynı zamanda otopark kartı olması bu bandın en yaygın kullanımı. Impinj, Alien ve NXP çipleri arasındaki seçim, hedeflenen okuma mesafesine ve mevcut okuyucu altyapısına göre yapılıyor.',
      ],
      specs: [
        { label: 'Frekans', value: '860-960 MHz' },
        { label: 'Standart', value: 'EPC Gen2 / ISO 18000 (RAIN RFID)' },
        { label: 'Çip seçenekleri', value: 'Impinj Monza serisi, Alien Higgs serisi, NXP Ucode serisi' },
      ],
      highlights: [
        'Metrelerce mesafeden okuma',
        'EPC Gen2 (RAIN RFID) uyumu',
        'Personel ve araç geçişini tek kartta birleştirme',
      ],
    },
    en: {
      title: 'UHF RFID Card (860-960 MHz)',
      excerpt: 'Long-range RAIN RFID cards for parking, site entry and vehicle identification.',
      body: [
        'An HF card has to touch the reader. A UHF card reads from metres away, which is what makes walk-through and drive-through access possible.',
        'The most common use of this band is turning the staff badge into the parking permit as well. The choice between Impinj, Alien and NXP chips comes down to the range you need and the readers already installed.',
      ],
      specs: [
        { label: 'Frequency', value: '860-960 MHz' },
        { label: 'Standard', value: 'EPC Gen2 / ISO 18000 (RAIN RFID)' },
        { label: 'Chip options', value: 'Impinj Monza, Alien Higgs, NXP Ucode' },
      ],
      highlights: [
        'Reads from several metres',
        'EPC Gen2 (RAIN RFID) compliant',
        'One card for staff access and vehicle entry',
      ],
    },
  },
  {
    slug: 'hibrit-ve-kombi-kart',
    category: 'card',
    tr: {
      title: 'Hibrit ve Kombi Kart',
      excerpt: 'İki teknolojiyi tek kartta birleştiren çözümler. Eski sistemi kapatmadan yeni sisteme geçmek için.',
      body: [
        'Kurumların çoğu geçiş sistemini bir gecede değiştiremez. Eski okuyucular LF, yeni yatırım UHF olur; personelin iki kart taşıması ise kimseyi memnun etmez.',
        'Çift frekanslı kart bu geçişi çözüyor. Aynı kart eski turnikede LF, yeni otopark kapısında UHF olarak okunuyor. Manyetik şerit ve temaslı çip kombinasyonları da aynı mantıkla, mevcut altyapıyı korumak için kullanılıyor.',
      ],
      specs: [
        {
          label: 'Kombinasyonlar',
          value: 'RFID + manyetik şerit, RFID + temaslı çip, dual interface (temaslı ve temassız)',
        },
        { label: 'Çift frekans', value: 'LF + HF, LF + UHF, HF + UHF' },
      ],
      highlights: [
        'LF + HF, LF + UHF ve HF + UHF kombinasyonları',
        'Dual interface temaslı ve temassız kart',
        'Manyetik şeritle birlikte kullanım',
        'Sistem geçişinde tek kartla devam',
      ],
    },
    en: {
      title: 'Hybrid and Combi Card',
      excerpt: 'Two technologies on one card, so a new system can be introduced without switching the old one off.',
      body: [
        'Few organisations can replace an access system overnight. The old readers are LF, the new investment is UHF, and asking staff to carry two cards pleases nobody.',
        'A dual-frequency card removes that problem. The same card reads as LF at the old turnstile and as UHF at the new parking gate. Magnetic stripe and contact chip combinations exist for the same reason: keeping the installed base alive.',
      ],
      specs: [
        {
          label: 'Combinations',
          value: 'RFID + magnetic stripe, RFID + contact chip, dual interface (contact and contactless)',
        },
        { label: 'Dual frequency', value: 'LF + HF, LF + UHF, HF + UHF' },
      ],
      highlights: [
        'LF + HF, LF + UHF and HF + UHF combinations',
        'Dual interface contact and contactless card',
        'Magnetic stripe alongside RFID',
        'One card through a system migration',
      ],
    },
  },
  {
    slug: 'ozel-amacli-kartlar',
    category: 'card',
    tr: {
      title: 'Özel Amaçlı Kart',
      excerpt: 'Personel kimliğinden otel anahtar kartına kadar kullanım senaryosuna göre üretilen kartlar.',
      body: [
        'Kartın hangi teknolojiyle çalışacağını kullanım senaryosu belirler. Otel kapısı ile şarj istasyonu aynı kartı istemez, birinde kısa mesafeli temassız okuma yeterken diğerinde farklı bir altyapı uyumu gerekir.',
        'Kimlik kartlarında fotoğraf, isim ve barkod baskısı öne çıkar. Sadakat kartlarında numara ve QR, ulaşım ve ödeme kartlarında ise ilgili sistemin çip gereksinimi belirleyicidir. Tasarım ve kodlama bu gereksinimlere göre yapılıyor.',
      ],
      specs: [
        {
          label: 'Kart tipleri',
          value:
            'Personel kimlik, öğrenci, otel anahtar kartı, üyelik ve sadakat, hediye, ulaşım, sağlık, ödeme, şarj istasyonu',
        },
      ],
      highlights: [
        'Fotoğraflı personel ve öğrenci kimlik kartı',
        'Otel anahtar kartı ve üyelik kartı',
        'Kişiselleştirilmiş numaralandırma ve baskı',
      ],
    },
    en: {
      title: 'Application-Specific Card',
      excerpt: 'Cards built around the use case, from staff ID to hotel key cards.',
      body: [
        'The use case decides the technology. A hotel door and an EV charging point do not want the same card: one needs short-range contactless, the other has to match a different infrastructure.',
        'ID cards are mostly about photo, name and barcode printing. Loyalty cards need numbering and a QR code, while transit and payment cards are driven by the chip the host system requires. Design and encoding follow from that.',
      ],
      specs: [
        {
          label: 'Card types',
          value: 'Staff ID, student, hotel key card, membership and loyalty, gift, transit, health, payment, EV charging',
        },
      ],
      highlights: [
        'Photo ID for staff and students',
        'Hotel key cards and membership cards',
        'Personalised numbering and printing',
      ],
    },
  },
  {
    slug: 'endustriyel-dayanikli-kart',
    category: 'card',
    tr: {
      title: 'Endüstriyel ve Dayanıklı Kart',
      excerpt: 'Üretim sahasında ve zorlu ortamlarda kullanılmak üzere ABS, PET ve metal gövdeli kartlar.',
      body: [
        'Standart PVC kart ofiste yıllarca dayanır. Aynı kart boya kabininde ya da yıkama hattında birkaç haftada bozulur.',
        'ABS ve PETG gövdeler mekanik zorlanmaya, metal kartlar ise ısıya daha iyi dayanıyor. Kimyasal teması olan hatlar için ayrı malzeme seçenekleri var; hangisinin uygun olduğu ortamın sıcaklığına ve maruz kaldığı maddeye göre belirleniyor.',
      ],
      specs: [
        { label: 'Malzeme seçenekleri', value: 'ABS, PET / PETG, metal' },
        { label: 'Dayanım', value: 'Yüksek ısıya ve kimyasallara dayanıklı seçenekler' },
      ],
      highlights: [
        'ABS, PET/PETG ve metal gövde seçenekleri',
        'Yüksek ısıya dayanıklı RFID kart',
        'Kimyasal teması olan ortamlar için malzeme seçimi',
      ],
    },
    en: {
      title: 'Industrial and Durable Card',
      excerpt: 'ABS, PET and metal cards built for production floors and demanding environments.',
      body: [
        'A standard PVC card survives years in an office. The same card in a paint booth or on a wash line is finished in weeks.',
        'ABS and PETG bodies take mechanical stress better, metal cards take heat better. Separate materials cover lines with chemical exposure, and the choice follows from the temperature and the substances involved.',
      ],
      specs: [
        { label: 'Material options', value: 'ABS, PET / PETG, metal' },
        { label: 'Durability', value: 'High temperature and chemical resistant variants' },
      ],
      highlights: [
        'ABS, PET/PETG and metal bodies',
        'High temperature resistant RFID card',
        'Material selection for chemical exposure',
      ],
    },
  },
  {
    slug: 'ozel-tasarim-ve-kesim-kart',
    category: 'card',
    tr: {
      title: 'Özel Tasarım ve Kesim Kart',
      excerpt: 'Standart kart ölçüsüne sığmayan işler için özel kesim, anahtarlık ve kırılabilir kart formları.',
      body: [
        'Bazı uygulamalar kartı cüzdanda değil anahtarlıkta ister. Bazıları ise tek karttan üç parça çıkarmak ister: biri cüzdana, biri anahtarlığa, biri dosyaya.',
        'Kesim kalıbı ve delik yeri sipariş bazında belirleniyor. Yaka ipiyle taşınacak kartlarda delik konumu, yoyo aparat ve klips uyumu için önceden planlanıyor.',
      ],
      specs: [
        {
          label: 'Formlar',
          value: 'Mini kart, anahtarlık (keyfob), üçe kırılan kart, A4/A5 boyut, yuvarlak ve oval, delikli, özel ölçü kesim',
        },
      ],
      highlights: [
        'Anahtarlık ve mini kart formları',
        'Üçe kırılan kart',
        'Özel ölçü ve kesim',
        'Yaka ipi ve klips uyumlu delik konumu',
      ],
    },
    en: {
      title: 'Custom Shape and Die-Cut Card',
      excerpt: 'Custom die-cuts, key fobs and break-apart cards for jobs the standard card format does not cover.',
      body: [
        'Some applications want the card on a key ring rather than in a wallet. Others want three pieces out of one card: one for the wallet, one for the keys, one for the file.',
        'Die shape and hole position are set per order. For cards carried on a lanyard, the hole is placed in advance to work with yoyo reels and clips.',
      ],
      specs: [
        {
          label: 'Formats',
          value: 'Mini card, key fob, three-part break-apart card, A4/A5, round and oval, punched, custom die-cut',
        },
      ],
      highlights: [
        'Key fob and mini card formats',
        'Three-part break-apart card',
        'Custom sizes and die-cutting',
        'Hole position matched to lanyards and clips',
      ],
    },
  },

  // ---------------------------------------------------------------- ribon
  {
    slug: 'guga20250001-wax-ribon',
    model: 'GUGA20250001',
    category: 'ribbon',
    tr: {
      title: 'Wax Ribon',
      excerpt: 'Kağıt etiketlerde günlük etiketleme için ekonomik wax ribon.',
      body: [
        'Depoda birkaç gün rafta duracak bir kolinin etiketi için yüksek dayanım şart değil. Wax ribon bu iş için en düşük maliyetli seçenek.',
        'Kağıt etiket üzerinde net baskı verir ve hafif sürtünmeye dayanır. Kimyasal temas ya da uzun süreli dış ortam söz konusuysa wax/resin veya resin tarafına geçmek gerekir.',
      ],
      specs: [
        { label: 'Tip', value: 'Wax' },
        { label: 'Uygun etiket', value: 'Kağıt etiket' },
        { label: 'Ölçü', value: 'Talebe göre en ve sarım boyu' },
      ],
      highlights: [
        'Kağıt etiketlerde net baskı',
        'Düşük maliyetli günlük kullanım',
        'İstenen en ve sarım boyunda üretim',
      ],
    },
    en: {
      title: 'Wax Ribbon',
      excerpt: 'An economical wax ribbon for everyday labelling on paper stock.',
      body: [
        'A carton that will sit on a rack for a few days does not need a durable print. For that job wax is the cheapest thing that works properly.',
        'It prints cleanly on paper labels and stands up to light abrasion. Once chemicals or long outdoor exposure enter the picture, the answer is wax/resin or resin.',
      ],
      specs: [
        { label: 'Type', value: 'Wax' },
        { label: 'Label stock', value: 'Paper labels' },
        { label: 'Sizing', value: 'Width and roll length to order' },
      ],
      highlights: [
        'Clean print on paper labels',
        'Low cost for everyday use',
        'Made to the width and roll length you need',
      ],
    },
  },
  {
    slug: 'guga20250002-wax-resin-ribon',
    model: 'GUGA20250002',
    category: 'ribbon',
    tr: {
      title: 'Wax/Resin Ribon',
      excerpt: 'Kağıt ve sentetik etiketlerde çalışan, orta düzey sürtünme ve kimyasal direnci olan ribon.',
      body: [
        'Wax ile resin arasındaki boşluğu dolduruyor. Maliyeti wax tarafına yakın, dayanımı resin tarafına yaklaşıyor.',
        'Hem kağıt hem sentetik etiketle kullanılabilmesi, tek tip ribonla farklı işleri karşılamak isteyen operasyonlar için önemli. Orta seviyede sürtünme ve kimyasal etkiye direnç gösterir.',
      ],
      specs: [
        { label: 'Tip', value: 'Wax/Resin' },
        { label: 'Uygun etiket', value: 'Kağıt ve sentetik etiket' },
        { label: 'Ölçü', value: 'Talebe göre en ve sarım boyu' },
      ],
      highlights: [
        'Hem kağıt hem sentetik etikette kullanım',
        'Sürtünme ve kimyasal direnç',
        'Uzun ömürlü ve net baskı',
      ],
    },
    en: {
      title: 'Wax/Resin Ribbon',
      excerpt: 'A ribbon for paper and synthetic stock, with mid-range abrasion and chemical resistance.',
      body: [
        'It fills the gap between wax and resin. The cost sits closer to wax, the durability closer to resin.',
        'Running on both paper and synthetic labels matters for operations that would rather stock one ribbon than three. It holds up against moderate abrasion and chemical contact.',
      ],
      specs: [
        { label: 'Type', value: 'Wax/Resin' },
        { label: 'Label stock', value: 'Paper and synthetic labels' },
        { label: 'Sizing', value: 'Width and roll length to order' },
      ],
      highlights: [
        'Works on paper and synthetic stock',
        'Abrasion and chemical resistance',
        'Durable, sharp print',
      ],
    },
  },
  {
    slug: 'guga20250003-resin-ribon',
    model: 'GUGA20250003',
    category: 'ribbon',
    tr: {
      title: 'Resin Ribon',
      excerpt: 'Sentetik etiketlerde ısıya, sürtünmeye ve kimyasallara karşı en dayanıklı baskı.',
      body: [
        'Etiketin okunması gereken süre yıllarla ölçülüyorsa resin dışında bir seçenek kalmıyor. Baskı sentetik yüzeye kimyasal olarak bağlanır ve sürtünmeyle silinmez.',
        'Endüstriyel varlık etiketleri, kimyasal maruziyeti olan hatlar ve dış ortamda kalan etiketler bu ribonla basılıyor.',
      ],
      specs: [
        { label: 'Tip', value: 'Resin' },
        { label: 'Uygun etiket', value: 'Sentetik etiket' },
        { label: 'Ölçü', value: 'Talebe göre en ve sarım boyu' },
      ],
      highlights: [
        'Yüksek ısı ve kimyasal direnci',
        'Sürtünmeye karşı silinmeyen baskı',
        'Endüstriyel ve dış ortam kullanımı',
      ],
    },
    en: {
      title: 'Resin Ribbon',
      excerpt: 'The most durable print available on synthetic stock: heat, abrasion and chemical resistant.',
      body: [
        'When the label has to stay readable for years, resin is the only option left. The print bonds chemically to the synthetic surface and does not rub away.',
        'Industrial asset tags, lines with chemical exposure and anything living outdoors get printed with this ribbon.',
      ],
      specs: [
        { label: 'Type', value: 'Resin' },
        { label: 'Label stock', value: 'Synthetic labels' },
        { label: 'Sizing', value: 'Width and roll length to order' },
      ],
      highlights: [
        'High heat and chemical resistance',
        'Print that does not rub off',
        'Industrial and outdoor use',
      ],
    },
  },
  {
    slug: 'guga20250004-renkli-ribon',
    model: 'GUGA20250004',
    category: 'ribbon',
    tr: {
      title: 'Renkli Ribon',
      excerpt: 'Ürün sınıflandırma, uyarı ve promosyon etiketleri için renkli ribon.',
      body: [
        'Renk, depoda okumadan ayırt etmeye yarar. Kırmızı etiket karantina, sarı etiket kontrol bekliyor demekse operatör barkoda bakmadan doğru rafı bulur.',
        'Renkli ribonlar wax, wax/resin ve resin türlerinde üretiliyor. Yani dayanım seviyesinden ödün vermeden renk kullanılabiliyor.',
      ],
      specs: [
        { label: 'Tip', value: 'Wax, wax/resin ve resin seçenekleriyle' },
        { label: 'Uygun etiket', value: 'Kağıt ve sentetik etiket' },
        { label: 'Ölçü', value: 'Talebe göre en ve sarım boyu' },
      ],
      highlights: [
        'Wax, wax/resin ve resin türlerinde renk seçeneği',
        'Ürün sınıflandırma ve uyarı etiketleri',
        'Kağıt ve sentetik etiketle uyumlu',
      ],
    },
    en: {
      title: 'Coloured Ribbon',
      excerpt: 'Coloured ribbon for product classification, warning labels and promotional print.',
      body: [
        'Colour lets people sort without reading. If a red label means quarantine and a yellow one means awaiting inspection, the operator finds the right rack without scanning anything.',
        'Coloured ribbons are produced in wax, wax/resin and resin, so colour does not cost you durability.',
      ],
      specs: [
        { label: 'Type', value: 'Available in wax, wax/resin and resin' },
        { label: 'Label stock', value: 'Paper and synthetic labels' },
        { label: 'Sizing', value: 'Width and roll length to order' },
      ],
      highlights: [
        'Colour across wax, wax/resin and resin',
        'Product classification and warning labels',
        'Works with paper and synthetic stock',
      ],
    },
  },

  // ------------------------------------------------------------ yaka ipi
  {
    slug: 'tek-kancali-yaka-ipi',
    category: 'lanyard',
    tr: {
      title: 'Tek Kancalı Yaka İpi',
      excerpt: 'Kurumsal renk ve logoya göre üretilen tek kancalı yaka ipi.',
      body: [
        'Yaka ipi küçük bir üründür ama her gün her personelin üzerinde durur. Rengi ve baskısı, kurumsal kimliğin en çok görünen parçalarından biri.',
        'Tek kanca kartın serbest dönmesine izin verdiği için kartı okuyucuya yaklaştırmak kolaydır. Ziyaretçi ve etkinlik kullanımında en yaygın tercih.',
      ],
      specs: [
        { label: 'Kanca', value: 'Tek kanca' },
        { label: 'Baskı', value: 'Kurumsal logo ve renklere göre özel baskı' },
      ],
      highlights: [
        'Kurumsal logo ve renkle özel baskı',
        'Personel, ziyaretçi ve etkinlik kullanımı',
        'Kart kılıfı ve yoyo aparatla uyumlu',
      ],
    },
    en: {
      title: 'Single-Clip Lanyard',
      excerpt: 'A single-clip lanyard printed to your corporate colours and logo.',
      body: [
        'A lanyard is a small item that every member of staff wears every day. Its colour and print end up being one of the most visible pieces of a corporate identity.',
        'A single clip lets the card swing freely, which makes it easy to present to a reader. It is the usual choice for visitors and events.',
      ],
      specs: [
        { label: 'Clip', value: 'Single clip' },
        { label: 'Printing', value: 'Custom print to corporate logo and colours' },
      ],
      highlights: [
        'Custom print in your logo and colours',
        'Staff, visitor and event use',
        'Works with card holders and yoyo reels',
      ],
    },
  },
  {
    slug: 'cift-kancali-yaka-ipi',
    category: 'lanyard',
    tr: {
      title: 'Çift Kancalı Yaka İpi',
      excerpt: 'Kartın düz ve okunur durmasını sağlayan çift kancalı yaka ipi.',
      body: [
        'Tek kancada kart döner, fotoğraf ters kalır. Çift kanca kartı iki noktadan tuttuğu için kart hep düz durur.',
        'Fotoğraflı personel kimliği ve ziyaretçi kartı gibi görsel kontrolün önemli olduğu yerlerde tercih ediliyor. Renk, desen ve baskı seçenekleri tek kancalıyla aynı.',
      ],
      specs: [
        { label: 'Kanca', value: 'Çift kanca' },
        { label: 'Baskı', value: 'Kurumsal logo ve renklere göre özel baskı' },
      ],
      highlights: [
        'Kart iki noktadan tutulur, ters dönmez',
        'Fotoğraflı kimlik kartları için',
        'Kurumsal baskı seçenekleri',
      ],
    },
    en: {
      title: 'Double-Clip Lanyard',
      excerpt: 'A double-clip lanyard that keeps the card flat and readable.',
      body: [
        'On a single clip the card spins and the photo ends up facing backwards. Two clips hold the card at two points, so it stays flat.',
        'It is the choice wherever visual checks matter: photo ID for staff, visitor badges at reception. Colour, pattern and print options match the single-clip version.',
      ],
      specs: [
        { label: 'Clip', value: 'Double clip' },
        { label: 'Printing', value: 'Custom print to corporate logo and colours' },
      ],
      highlights: [
        'Card held at two points, never turns over',
        'Suited to photo ID cards',
        'Full corporate print options',
      ],
    },
  },
  {
    slug: 'pvc-yaka-karti-85x54mm',
    category: 'lanyard',
    tr: {
      title: 'PVC Yaka Kartı 85 x 54 mm',
      excerpt: 'Standart kart ölçüsünde PVC yaka kartı. Kılıf, yoyo aparat ve okuyucularla uyumlu.',
      body: [
        '85 x 54 mm, geçiş kartı okuyucularının ve kart kılıflarının tasarlandığı standart ölçü. Kılıf, yoyo aparat ve cüzdan gözü hep bu ölçüye göre üretilir.',
        'Baskılı ya da baskısız üretilebilir. Aynı kart RFID çipli olarak da hazırlanabildiği için kimlik kartı ile geçiş kartı tek parçada birleşir.',
      ],
      specs: [
        { label: 'Ölçü', value: '85 x 54 mm' },
        { label: 'Malzeme', value: 'PVC' },
      ],
      highlights: [
        'Standart 85 x 54 mm ölçü',
        'Kılıf ve yoyo aparatla uyumlu',
        'Çipli ya da çipsiz üretim',
      ],
    },
    en: {
      title: 'PVC Badge Card 85 x 54 mm',
      excerpt: 'A PVC badge card in the standard format, matched to holders, yoyo reels and readers.',
      body: [
        '85 x 54 mm is the format access readers and card holders were designed around. Holders, yoyo reels and wallet slots are all built to it.',
        'It can be printed or left blank, and the same card can be produced with an RFID chip, which merges the ID badge and the access card into one item.',
      ],
      specs: [
        { label: 'Size', value: '85 x 54 mm' },
        { label: 'Material', value: 'PVC' },
      ],
      highlights: [
        'Standard 85 x 54 mm format',
        'Fits holders and yoyo reels',
        'Available with or without a chip',
      ],
    },
  },
  {
    slug: 'a5-pvc-yaka-karti',
    category: 'lanyard',
    tr: {
      title: 'A5 PVC Yaka Kartı',
      excerpt: 'Uzaktan okunması gereken etkinlik ve saha kartları için A5 boyutunda PVC yaka kartı.',
      body: [
        'Fuar, kongre ve şantiye girişinde kartın uzaktan görünmesi gerekir. Standart kart ölçüsü bunun için küçük kalıyor.',
        'A5 kart isim, kurum ve yetki bilgisini uzaktan okunacak büyüklükte taşır. Renk kodlamasıyla birlikte kullanıldığında kimin hangi alana girebileceği bakışta anlaşılır.',
      ],
      specs: [
        { label: 'Ölçü', value: 'A5' },
        { label: 'Malzeme', value: 'PVC' },
      ],
      highlights: [
        'Uzaktan okunabilen büyük format',
        'Etkinlik ve saha girişi için',
        'Renk kodlamasına uygun baskı',
      ],
    },
    en: {
      title: 'A5 PVC Badge Card',
      excerpt: 'An A5 PVC badge card for events and site entry, where the badge has to be readable from a distance.',
      body: [
        'At a trade fair, a conference or a construction site gate, the badge has to be legible from several metres. The standard card format is too small for that.',
        'An A5 card carries name, organisation and clearance at a size people can read across a room. Combined with colour coding, who belongs where becomes obvious at a glance.',
      ],
      specs: [
        { label: 'Size', value: 'A5' },
        { label: 'Material', value: 'PVC' },
      ],
      highlights: [
        'Large format, readable from a distance',
        'For events and site entry',
        'Print layout suited to colour coding',
      ],
    },
  },

  // ------------------------------------------------------ kütüphane & arşiv
  {
    slug: 'guga1257-rfid-kutuphane-etiketi',
    model: 'Guga1257',
    category: 'library',
    featured: true,
    tr: {
      title: 'RFID Kütüphane Etiketi',
      excerpt: 'Kitap ve arşiv materyali için RFID etiket. Ödünç verme, iade ve sayımı tek okumaya indirir.',
      body: [
        'Kütüphane otomasyonunda darboğaz genellikle bankodur. Her kitabın barkodunu bulup okutmak zaman alır, iade kuyruğu da buradan büyür.',
        'RFID etiketle birden fazla materyal aynı anda okunur. Raf sayımı koridor taranarak yapılıyor, kapı antenleri ise ödünç işlemi yapılmamış materyali çıkışta yakalıyor. Şarap arşivi ve özel koleksiyon gibi raf düzeninin kritik olduğu alanlarda da aynı kurgu kullanılıyor.',
      ],
      specs: [
        { label: 'Frekans seçenekleri', value: 'HF 13,56 MHz veya UHF 866-868 MHz' },
        { label: 'Kimlik', value: 'Etiket başına benzersiz ID' },
        { label: 'Güvenlik', value: 'Kapı antenleriyle izinsiz çıkış kontrolü' },
      ],
      highlights: [
        'Ödünç verme ve iadede tek okuma',
        'Aynı anda birden fazla materyal okuma',
        'Kapı antenleriyle hırsızlık önleme',
        'Kütüphane otomasyon sistemleriyle entegrasyon',
      ],
    },
    en: {
      title: 'RFID Library Label',
      excerpt: 'An RFID label for books and archive material, turning issue, return and stocktaking into a single read.',
      body: [
        'The bottleneck in library automation is usually the desk. Finding and scanning a barcode on every item takes time, and the return queue grows out of exactly that.',
        'With RFID, several items are read at once. Shelf counting is done by walking the aisle, and antennas at the door catch material leaving without being issued. The same setup covers wine archives and special collections, where shelf order matters as much as it does in a library.',
      ],
      specs: [
        { label: 'Frequency options', value: 'HF 13.56 MHz or UHF 866-868 MHz' },
        { label: 'Identity', value: 'Unique ID per label' },
        { label: 'Security', value: 'Unauthorised exit detection with door antennas' },
      ],
      highlights: [
        'One read for issue and return',
        'Several items read simultaneously',
        'Theft prevention with door antennas',
        'Integrates with library management systems',
      ],
    },
  },
  {
    slug: 'kitap-toplama-ve-dagitma-arabasi',
    category: 'library',
    tr: {
      title: 'Kitap Toplama ve Dağıtma Arabası',
      excerpt: 'Kütüphane, okul ve arşivde kitap taşımak için metal gövdeli araba.',
      body: [
        'Kütüphanede kitap raftan çıkar, banko önünde birikir ve tekrar rafa döner. Bu döngüde araba, personelin gün içinde en çok dokunduğu ekipmandır.',
        'Metal gövde yoğun kullanıma dayanır, sessiz döner tekerlekler okuma salonunda gürültü çıkarmaz. Raf ve bölme düzeni sınıflandırma yöntemine göre seçiliyor.',
      ],
      specs: [
        { label: 'Gövde', value: 'Metal' },
        { label: 'Tekerlek', value: 'Sessiz döner tekerlek' },
        { label: 'Düzen', value: 'Farklı raf ve bölme seçenekleri' },
      ],
      highlights: [
        'Yoğun kullanıma uygun metal gövde',
        'Sessiz döner tekerlek',
        'Farklı raf ve bölme seçenekleri',
        'Ergonomik tutma kolları',
      ],
    },
    en: {
      title: 'Book Collection and Distribution Trolley',
      excerpt: 'A steel-bodied trolley for moving books in libraries, schools and archives.',
      body: [
        'In a library a book leaves the shelf, piles up at the desk and goes back again. The trolley is the piece of equipment staff touch most across that cycle.',
        'The metal body takes heavy use, and quiet swivel castors keep the reading room quiet. Shelf and compartment layout is chosen to match how the collection is sorted.',
      ],
      specs: [
        { label: 'Body', value: 'Steel' },
        { label: 'Castors', value: 'Quiet swivel castors' },
        { label: 'Layout', value: 'Shelf and compartment options' },
      ],
      highlights: [
        'Steel body built for heavy use',
        'Quiet swivel castors',
        'Shelf and compartment options',
        'Ergonomic handles',
      ],
    },
  },
  {
    slug: 'dosya-toplama-ve-dagitma-arabasi',
    category: 'library',
    tr: {
      title: 'Dosya Toplama ve Dağıtma Arabası',
      excerpt: 'Ofis, hastane ve arşivde evrak taşımak için raflı metal araba.',
      body: [
        'Hastane arşivinde ya da kamu kurumunda evrak gün boyu birimler arasında dolaşır. Elde taşınan dosya düşer, karışır ve kaybolur.',
        'Raflı ya da bölmeli yapı dosyaların birim bazında ayrılmasını sağlar. Sağlam metal gövde yoğun tempoda uzun süre kullanılabilir, sessiz tekerlekler koridorda sorun çıkarmaz.',
      ],
      specs: [
        { label: 'Gövde', value: 'Metal' },
        { label: 'Tekerlek', value: 'Sessiz döner tekerlek' },
        { label: 'Düzen', value: 'Raflı veya bölmeli' },
      ],
      highlights: [
        'Dosyaları birim bazında ayırmaya uygun bölmeler',
        'Sağlam metal yapı',
        'Ergonomik kol ve sessiz tekerlek',
        'Ofis, hastane ve arşiv kullanımı',
      ],
    },
    en: {
      title: 'File Collection and Distribution Trolley',
      excerpt: 'A shelved steel trolley for moving paperwork in offices, hospitals and archives.',
      body: [
        'In a hospital archive or a public office, paperwork circulates between departments all day. Files carried by hand get dropped, mixed up and lost.',
        'Shelves or compartments keep files separated by department. The steel frame survives a heavy tempo, and quiet castors keep it from being a nuisance in a corridor.',
      ],
      specs: [
        { label: 'Body', value: 'Steel' },
        { label: 'Castors', value: 'Quiet swivel castors' },
        { label: 'Layout', value: 'Shelved or compartmented' },
      ],
      highlights: [
        'Compartments that separate files by department',
        'Solid steel construction',
        'Ergonomic handles and quiet castors',
        'Office, hospital and archive use',
      ],
    },
  },
  {
    slug: 'kitap-ve-dosya-destegi',
    category: 'library',
    tr: {
      title: 'Kitap ve Dosya Desteği',
      excerpt: 'Raf ve masa üzerinde kitapların dik durmasını sağlayan metal destek.',
      body: [
        'Yarısı boşalmış bir rafta kitaplar yana yatar. Sırtları okunmaz hale gelir, kapakları eğilir.',
        'Metal destek kitapları dik tutar. Kaymayı önleyen tabanı sayesinde rafta yerinden oynamaz. Kütüphane dışında ofis ve ev kullanımı için de uygun.',
      ],
      specs: [
        { label: 'Malzeme', value: 'Metal' },
        { label: 'Taban', value: 'Kaymayı önleyen taban' },
      ],
      highlights: [
        'Kitapları dik ve düzenli tutar',
        'Kaymayı önleyen taban',
        'Uzun ömürlü metal yapı',
      ],
    },
    en: {
      title: 'Book and File Support',
      excerpt: 'A metal support that keeps books upright on shelves and desks.',
      body: [
        'On a half-empty shelf books lean over. Spines become unreadable and covers bend out of shape.',
        'A metal support holds them upright, and a non-slip base keeps it from shifting on the shelf. It works as well in an office or at home as it does in a library.',
      ],
      specs: [
        { label: 'Material', value: 'Steel' },
        { label: 'Base', value: 'Non-slip base' },
      ],
      highlights: [
        'Keeps books upright and ordered',
        'Non-slip base',
        'Durable steel construction',
      ],
    },
  },
  {
    slug: 'kart-kilifi-yoyo-aparat-ve-klips',
    category: 'library',
    tr: {
      title: 'Kart Kılıfı, Yoyo Aparat ve Klips',
      excerpt: 'Personel ve ziyaretçi kartlarını koruyan kılıflar ve taşıma aksesuarları.',
      body: [
        'Kart kırılınca ya da çizilince yenisi basılır. Kartın kendisi ucuz olabilir ama kişiselleştirme, kodlama ve dağıtım süreci ucuz değildir.',
        'Kılıf kartı günlük yıpranmadan korur. Yoyo aparat kartı uzatıp geri çekmeyi sağladığı için turnikede ipi boyundan çıkarma adımı ortadan kalkar. Kılıflar RFID ve manyetik kartlarla uyumlu, okunabilirliği engellemiyor.',
      ],
      specs: [
        { label: 'Kılıf malzemeleri', value: 'Şeffaf plastik, sert PVC, esnek silikon' },
        { label: 'Kullanım yönü', value: 'Yatay ve dikey' },
        { label: 'Uyumluluk', value: 'Askı ipi, yoyo aparat ve klips' },
      ],
      highlights: [
        'Şeffaf plastik, sert PVC ve silikon kılıf seçenekleri',
        'Yatay ve dikey kullanım',
        'Yoyo aparatla turnikede hızlı okutma',
        'RFID ve manyetik kartlarla uyumlu',
      ],
    },
    en: {
      title: 'Card Holders, Yoyo Reels and Clips',
      excerpt: 'Holders and carrying accessories that protect staff and visitor cards.',
      body: [
        'When a card cracks or gets scratched, a new one is printed. The card itself may be cheap. Personalising, encoding and distributing it is not.',
        'A holder keeps the card out of daily wear. A yoyo reel lets it be pulled out and released, so nobody has to lift a lanyard over their head at a turnstile. The holders work with RFID and magnetic cards without blocking the read.',
      ],
      specs: [
        { label: 'Holder materials', value: 'Clear plastic, rigid PVC, flexible silicone' },
        { label: 'Orientation', value: 'Landscape and portrait' },
        { label: 'Compatibility', value: 'Lanyards, yoyo reels and clips' },
      ],
      highlights: [
        'Clear plastic, rigid PVC and silicone holders',
        'Landscape and portrait use',
        'Yoyo reels for fast presentation at turnstiles',
        'Compatible with RFID and magnetic cards',
      ],
    },
  },

  // ----------------------------------------------------------- perakende
  {
    slug: 'rfid-kasa-okuyucu',
    category: 'retail',
    tr: {
      title: 'RFID Kasa Okuyucu',
      excerpt: 'Kasada birden fazla ürünü aynı anda okuyan masaüstü UHF okuyucu.',
      body: [
        'Kasada geçen sürenin çoğu barkod aramakla geçer. Ürün ters duruyorsa çevirirsiniz, etiket buruşmuşsa düzeltirsiniz. RFID bu adımları kaldırıyor: ürünler tezgâha bırakılır, hepsi bir seferde okunur.',
        'Kompakt masaüstü gövde mevcut kasa tezgâhına sığar ve POS yazılımıyla entegre çalışır. Depo ve lojistik tarafında paket doğrulama için de kullanılıyor.',
      ],
      specs: [
        { label: 'Tip', value: 'Masaüstü okuyucu' },
        { label: 'Bant', value: 'UHF' },
      ],
      highlights: [
        'Birden fazla ürünü tek seferde okuma',
        'Mevcut POS sistemleriyle entegrasyon',
        'Kompakt masaüstü kurulum',
        'Kasa kuyruğunu kısaltır',
      ],
    },
    en: {
      title: 'RFID Point-of-Sale Reader',
      excerpt: 'A desktop UHF reader that picks up a whole basket at the till in one go.',
      body: [
        'Most of the time spent at a till goes on hunting for barcodes. The item is upside down, so you turn it. The label is creased, so you flatten it. RFID removes those steps: the items go on the counter and all of them are read at once.',
        'The compact desktop unit fits the counter you already have and integrates with your POS software. The same reader is used for parcel verification in warehousing and logistics.',
      ],
      specs: [
        { label: 'Type', value: 'Desktop reader' },
        { label: 'Band', value: 'UHF' },
      ],
      highlights: [
        'Reads several items in one pass',
        'Integrates with existing POS systems',
        'Compact desktop installation',
        'Shortens the queue at the till',
      ],
    },
  },
  {
    slug: 'rfid-self-check-kasa-sistemi',
    category: 'retail',
    featured: true,
    tr: {
      title: 'RFID Self-Check Kasa Sistemi',
      excerpt: 'Müşterinin ürünleri kasa alanına bırakıp kendi ödemesini yaptığı self-check sistemi.',
      body: [
        'Self-check kasalar barkodla çalıştığında müşteri her ürünü tek tek okutur, biri okunmazsa personel çağırır. Kuyruk kısalmaz, sadece yer değiştirir.',
        'RFID etiketli ürünler kasa alanına bırakıldığında hepsi aynı anda okunur. Müşteri ürünleri çevirmez, personel çağırmaz. Ödeme adımı saniyelerle ölçülür hale gelir.',
      ],
      specs: [],
      highlights: [
        'Sepetin tamamı tek okumada',
        'Kasa kuyruğunu kısaltır',
        'Hatalı okuma ve fiyatlandırma riskini azaltır',
        'Personel ihtiyacını dengeler',
      ],
    },
    en: {
      title: 'RFID Self-Checkout System',
      excerpt: 'A self-checkout where the customer sets the basket down and pays, with no scanning step.',
      body: [
        'Barcode self-checkouts make the customer scan every item, then call an assistant when one refuses to read. The queue does not get shorter. It just moves.',
        'With RFID the whole basket is read the moment it is set down. Nothing gets turned around, nobody gets called over, and payment becomes a matter of seconds.',
      ],
      specs: [],
      highlights: [
        'Whole basket read at once',
        'Shorter checkout queues',
        'Fewer misreads and pricing errors',
        'Staffing balanced across the floor',
      ],
    },
  },
  {
    slug: 'rfid-kapi-gecis-ve-alarm-sistemi',
    category: 'retail',
    tr: {
      title: 'RFID Kapı Geçiş ve Alarm Sistemi',
      excerpt: 'Çıkış kapısında ödemesi yapılmamış ürünü algılayan RFID alarm sistemi.',
      body: [
        'Klasik güvenlik kapısı sadece bir şeyin geçtiğini söyler. RFID kapısı hangi ürünün geçtiğini söyler, çünkü her etiketin kendi numarası vardır.',
        'Satış kaydı olmayan bir etiket kapıdan geçtiğinde sesli ve görsel uyarı devreye girer. Aynı kurgu depo ve üretim çıkışlarında da kullanılıyor, yetkisiz malzeme çıkışı kayıt altına alınıyor.',
      ],
      specs: [],
      highlights: [
        'Hangi ürünün geçtiğini ürün bazında bildirir',
        'Sesli ve görsel alarm',
        'Mağaza, depo ve üretim çıkışlarında kullanım',
        'Kayıp ve kaçak kayıtlarını görünür kılar',
      ],
    },
    en: {
      title: 'RFID Exit Gate and Alarm System',
      excerpt: 'An RFID gate that detects unpaid items leaving through the exit.',
      body: [
        'A conventional security gate tells you something went through. An RFID gate tells you what went through, because every tag carries its own number.',
        'When a tag with no sale against it passes the gate, an audible and visual alarm fires. The same setup guards warehouse and production exits, logging unauthorised material movements.',
      ],
      specs: [],
      highlights: [
        'Identifies the specific item that passed',
        'Audible and visual alarm',
        'Retail, warehouse and production exits',
        'Makes shrinkage visible as data',
      ],
    },
  },
  {
    slug: 'rfid-entegreli-konveyor-sistemi',
    category: 'retail',
    tr: {
      title: 'RFID Entegreli Konveyör Sistemi',
      excerpt: 'Konveyör hattı üzerinde ürünleri okuyup doğru lokasyona yönlendiren RFID entegrasyonu.',
      body: [
        'Dağıtım merkezinde ayrıştırma hattı durursa arkasındaki her şey durur. Elle okutma hem yavaştır hem hataya açıktır.',
        'Hat üzerine yerleştirilen okuyucular ürünü geçerken tanır ve yönlendirme kararını sisteme bırakır. Operatör müdahalesi azaldıkça hız artıyor, yanlış rotaya giden koli sayısı düşüyor.',
      ],
      specs: [],
      highlights: [
        'Hat üzerinde temassız tanıma',
        'Otomatik yönlendirme',
        'Depo süreçlerinde tam izlenebilirlik',
        'Yoğun hacimli dağıtım merkezleri için',
      ],
    },
    en: {
      title: 'RFID Conveyor Integration',
      excerpt: 'Readers on the conveyor line that identify items in motion and route them to the right location.',
      body: [
        'When the sortation line stops in a distribution centre, everything behind it stops too. Manual scanning is both slow and error-prone.',
        'Readers along the line identify items as they pass and hand the routing decision to the system. Less operator intervention means more throughput and fewer cartons sent down the wrong lane.',
      ],
      specs: [],
      highlights: [
        'Contactless identification in motion',
        'Automatic routing',
        'Full traceability across warehouse processes',
        'Built for high-volume distribution centres',
      ],
    },
  },
  {
    slug: 'rfid-perakende-uhf-etiketi',
    category: 'retail',
    tr: {
      title: 'RFID Perakende UHF Etiketi',
      excerpt: 'Tekstil, ayakkabı ve aksesuar ürünlerine uygulanan UHF perakende etiketi.',
      body: [
        'Mağaza stok doğruluğu düştüğünde iki şey birden olur: müşteri aradığını bulamaz, online sipariş mağazadan karşılanamaz. İkisi de doğrudan ciro kaybıdır.',
        'UHF etiketle sayım koridoru yürüyerek yapılıyor, bu yüzden haftada bir tekrarlanabiliyor. Aynı etiket tedarik zinciri boyunca okunduğu için ürünün üretimden mağazaya kadar izi kayıtta duruyor.',
      ],
      specs: [{ label: 'Bant', value: 'UHF' }],
      highlights: [
        'Aynı anda çok sayıda ürün okuma',
        'Haftalık envanter sayımı',
        'Tekstil, ayakkabı ve aksesuara uygulanabilir',
        'Tedarik zinciri boyunca izlenebilirlik',
      ],
    },
    en: {
      title: 'RFID Retail UHF Label',
      excerpt: 'A UHF retail label applied to apparel, footwear and accessories.',
      body: [
        'When store stock accuracy drops, two things happen at once: the customer cannot find the item, and online orders cannot be fulfilled from that store. Both are lost revenue.',
        'A UHF count is done by walking the aisle, which is why it can happen weekly. The same label is read throughout the supply chain, so the trail from production to shop floor stays on record.',
      ],
      specs: [{ label: 'Band', value: 'UHF' }],
      highlights: [
        'Many items read simultaneously',
        'Weekly inventory counts',
        'Applies to apparel, footwear and accessories',
        'Traceability across the supply chain',
      ],
    },
  },
]

const main = async () => {
  const payload = await getPayload({ config })

  // The legacy import split category pages on model codes and produced fragments:
  // half sentences, the same model three times over. Clear anything not in this
  // file so the catalogue is exactly what is written here.
  const existing = await payload.find({ collection: 'products', limit: 500, locale: 'tr', depth: 0 })
  const keep = new Set(entries.map((entry) => entry.slug))
  for (const doc of existing.docs) {
    if (!keep.has(doc.slug as string)) {
      await payload.delete({ collection: 'products', id: doc.id })
      console.log(`removed legacy: ${doc.slug}`)
    }
  }

  let order = 10
  for (const entry of entries) {
    const side = (data: Side) => ({
      title: data.title,
      model: entry.model,
      category: entry.category,
      excerpt: data.excerpt,
      body: richText(data.body),
      specs: data.specs.map((spec) => ({ label: spec.label, value: spec.value })),
      highlights: data.highlights.map((text) => ({ text })),
      order,
      featured: entry.featured ?? false,
      _status: 'published',
    })

    const found = await payload.find({
      collection: 'products',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      locale: 'tr',
    })

    const id =
      found.docs[0]?.id ??
      (await payload.create({ collection: 'products', locale: 'tr', data: { ...side(entry.tr), slug: entry.slug } as never }))
        .id

    await payload.update({ collection: 'products', id, locale: 'tr', data: side(entry.tr) as never })
    await payload.update({ collection: 'products', id, locale: 'en', data: side(entry.en) as never })
    console.log(`seeded tr+en: ${entry.slug}`)
    order += 10
  }

  console.log(`done: ${entries.length} products in 2 locales`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
