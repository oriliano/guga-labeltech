/**
 * Seeds Referanslar and Projeler as DRAFTS in both locales.
 *
 * The customer has not supplied the real case content yet, so nothing here is
 * published and no client name, country or metric is filled in: those fields
 * stay empty on purpose and are completed in the panel. What is written here is
 * the scope of work GUGA already does for that sector, taken from the matching
 * solution page, so the editor only has to add the specifics and hit publish.
 *
 * Safe to re-run: records are matched by slug and updated in place. Records that
 * an editor has already published are left alone.
 *
 * Run: npx tsx src/seed/cases.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

type Side = { title: string; sector: string; excerpt: string; challenge: string; approach: string }
type Case = { slug: string; solution?: string; tr: Side; en: Side }

const references: Case[] = [
  {
    slug: 'depo-ve-dagitim-merkezi-rfid-uygulamasi',
    solution: 'depo-ve-lojistik',
    tr: {
      title: 'Depo ve dağıtım merkezinde RFID uygulaması',
      sector: 'Depo',
      excerpt:
        'Mal kabulden sevkiyata kadar koli ve palet hareketinin RFID ile kayıt altına alındığı bir depo uygulaması.',
      challenge:
        'Sayım elle yapıldığı için uzun sürüyor, stok kaydı ile raftaki miktar arasındaki fark ancak sayım sonunda görülüyordu. Yanlış sevkiyat müşteriden geri dönünce fark ediliyordu.',
      approach:
        'Koli ve paletler UHF etiketle tanımlandı, mal kabul ve sevkiyat kapılarına sabit okuyucu, saha ekibine el terminali verildi. Okumalar mevcut stok sistemine aktarıldı, sayım tek kişiyle yapılır hale geldi.',
    },
    en: {
      title: 'RFID in a warehouse and distribution centre',
      sector: 'Warehousing',
      excerpt:
        'A warehouse deployment where every carton and pallet movement is recorded with RFID, from goods-in through to dispatch.',
      challenge:
        'Counting was manual and slow, and the gap between the stock record and what sat on the rack only surfaced at the end of a count. Mis-picked shipments came to light when the customer sent them back.',
      approach:
        'Cartons and pallets were tagged with UHF labels, fixed readers went on the goods-in and dispatch doors, and the floor team got handhelds. Reads feed the existing stock system and a count is now a one-person job.',
    },
  },
  {
    slug: 'magaza-zincirinde-rfid-stok-sayimi',
    solution: 'rfid-perakende-yonetimi',
    tr: {
      title: 'Mağaza zincirinde RFID stok sayımı',
      sector: 'Perakende',
      excerpt: 'Mağaza stoğunun el terminaliyle düzenli sayıldığı, reyon ve depo farkının izlendiği uygulama.',
      challenge:
        'Sayım seyrek yapıldığı için mağaza stoğu ile sistem stoğu arasındaki fark büyüyordu. Reyonda görünmeyen ama depoda duran ürün satılamıyordu.',
      approach:
        'Ürünler kaynakta RFID etiketle işaretlendi, mağaza ekibi el terminaliyle haftalık sayım yapmaya başladı. Reyon ve depo stoğu ayrı ayrı görüldüğü için eksik ürün aynı gün rafa çıkarılıyor.',
    },
    en: {
      title: 'RFID stock counts across a retail chain',
      sector: 'Retail',
      excerpt: 'Store stock counted on a regular cycle with handhelds, with the shop floor and back room tracked separately.',
      challenge:
        'Counts were infrequent, so the gap between store stock and system stock kept growing. Items sitting in the back room could not be sold because nobody knew they were there.',
      approach:
        'Items are tagged at source, and store teams count weekly with a handheld. Shop floor and back room are reported separately, so a missing size goes back on the rail the same day.',
    },
  },
  {
    slug: 'tekstil-uretiminde-rfid-takibi',
    solution: 'rfid-tekstil-yonetimi',
    tr: {
      title: 'Tekstil üretiminde RFID takibi',
      sector: 'Tekstil',
      excerpt: 'Dikilebilir RFID etiketle üretim, paketleme ve sevkiyat aşamalarının izlendiği uygulama.',
      challenge:
        'Parti bazında ilerleyen üretimde hangi modelin hangi aşamada olduğu ancak sorularak öğreniliyordu. Sevkiyat kolisinin içeriği açılmadan doğrulanamıyordu.',
      approach:
        'Ürüne dikilen RFID etiket üretim hattındaki okuma noktalarından geçtikçe aşama kaydı oluşuyor. Koli sevkiyat kapısında açılmadan okunuyor, eksik ürün sevkiyattan önce görülüyor.',
    },
    en: {
      title: 'RFID tracking in textile production',
      sector: 'Textiles',
      excerpt: 'Sewn-in RFID labels used to follow production, packing and dispatch.',
      challenge:
        'Production ran in batches and the only way to find out which style was at which stage was to ask. A dispatch carton could not be verified without opening it.',
      approach:
        'The sewn-in label is read at points along the line, which builds a stage record per garment. Cartons are read at the dispatch door without being opened, so a short pick is caught before the truck leaves.',
    },
  },
  {
    slug: 'hastanede-medikal-ekipman-takibi',
    solution: 'rfid-medikal-yonetimi',
    tr: {
      title: 'Hastanede medikal ekipman takibi',
      sector: 'Sağlık',
      excerpt: 'Taşınabilir medikal cihazların kat ve servis bazında RFID ile takip edildiği uygulama.',
      challenge:
        'Taşınabilir cihaz servisler arasında dolaştığı için aranan cihaz bulunamıyor, bakım ve kalibrasyon tarihleri takip edilemiyordu.',
      approach:
        'Cihazlara metal yüzeye uygun RFID tag takıldı, kat çıkışlarına okuma noktası kondu. Teknik ekip el terminaliyle servis taraması yapıyor, bakım tarihi yaklaşan cihaz listeden düşüyor.',
    },
    en: {
      title: 'Medical equipment tracking in a hospital',
      sector: 'Healthcare',
      excerpt: 'Portable medical devices tracked by floor and ward with RFID.',
      challenge:
        'Portable devices moved between wards, so staff could not find the one they needed, and service and calibration dates went untracked.',
      approach:
        'Devices carry on-metal RFID tags and read points sit at the floor exits. The technical team sweeps a ward with a handheld, and anything due for service shows up on the list.',
    },
  },
  {
    slug: 'kuyum-magazasinda-rfid-sayim',
    solution: 'rfid-kuyum-yonetimi',
    tr: {
      title: 'Kuyum mağazasında RFID sayım',
      sector: 'Kuyum',
      excerpt: 'Vitrin ve kasadaki ürünün gün başında ve gün sonunda RFID ile sayıldığı uygulama.',
      challenge:
        'Küçük ve yüksek değerli ürünün elle sayımı hem uzun sürüyor hem de vitrin kapalı kalıyordu. Gün sonu farkı kayıtla eşleşmediğinde geriye dönük arama gerekiyordu.',
      approach:
        'Ürün etiketleri RFID tag ile değiştirildi, sayım el terminaliyle vitrin açılmadan yapılıyor. Gün başı ve gün sonu sayımı karşılaştırılarak eksik ürün aynı gün tespit ediliyor.',
    },
    en: {
      title: 'RFID counting in a jewellery store',
      sector: 'Jewellery',
      excerpt: 'Display and safe stock counted with RFID at open and close.',
      challenge:
        'Counting small, high-value items by hand took a long time and kept the display closed. When the end-of-day figure did not match the record, the search went backwards through the day.',
      approach:
        'Price tags were replaced with RFID tags and counting is done with a handheld without opening the display. Comparing the open and close counts surfaces a missing piece the same day.',
    },
  },
  {
    slug: 'kurumsal-demirbas-sayimi',
    solution: 'rfid-demirbas-yonetimi',
    tr: {
      title: 'Kurumsal demirbaş sayımı',
      sector: 'Demirbaş',
      excerpt: 'Bina ve kat bazında demirbaş sayımının RFID etiketle yapıldığı uygulama.',
      challenge:
        'Yıllık demirbaş sayımı birkaç haftaya yayılıyor, zimmet kayıtları taşınan eşyayla birlikte güncellenmiyordu.',
      approach:
        'Demirbaşlar barkod yerine RFID etiketle işaretlendi, sayım oda oda el terminaliyle yapılıyor. Zimmet kaydı sayım sırasında güncelleniyor, kat değiştiren eşya listede görünüyor.',
    },
    en: {
      title: 'Fixed asset counting across offices',
      sector: 'Fixed assets',
      excerpt: 'Asset counts done per building and per floor with RFID labels.',
      challenge:
        'The annual asset count stretched across weeks, and assignment records were not updated when something was moved.',
      approach:
        'Assets carry RFID labels instead of barcodes and each room is swept with a handheld. Assignment records are corrected during the count, so anything that changed floors shows up.',
    },
  },
  {
    slug: 'personel-gecis-ve-erisim-yonetimi',
    solution: 'rfid-personel-takip',
    tr: {
      title: 'Personel geçiş ve erişim yönetimi',
      sector: 'Personel',
      excerpt: 'Kart ve yaka ipiyle personel geçişinin ve kısıtlı alan erişiminin yönetildiği uygulama.',
      challenge:
        'Kısıtlı alanlara girişte kayıt tutulmuyor, yüklenici personelinin hangi alanda bulunduğu bilinmiyordu.',
      approach:
        'Personel ve yüklenici kartları RFID kartla değiştirildi, kısıtlı alan kapılarına okuyucu takıldı. Geçiş kaydı vardiya raporuna bağlandı.',
    },
    en: {
      title: 'Workforce access and entry management',
      sector: 'Workforce',
      excerpt: 'Staff movement and restricted-area access handled with RFID cards and lanyards.',
      challenge:
        'Entry to restricted areas was not logged, and nobody could say which area a contractor was working in.',
      approach:
        'Staff and contractor badges were replaced with RFID cards and readers went on the restricted doors. Entry records feed the shift report.',
    },
  },
  {
    slug: 'soguk-zincirde-sicaklik-takibi',
    solution: 'soguk-zincir-takibi',
    tr: {
      title: 'Soğuk zincirde sıcaklık takibi',
      sector: 'Soğuk zincir',
      excerpt: 'Sıcaklık kaydı tutan etiketlerle depo ve nakliye aşamasının izlendiği uygulama.',
      challenge:
        'Ürün sıcaklığı yalnızca kapı geçişlerinde ölçülüyor, nakliye sırasında yaşanan sapma teslimatta anlaşılıyordu.',
      approach:
        'Palet ve kolilere sıcaklık kaydı tutan RFID etiket takıldı, okuma noktaları depo kapılarına kondu. Sapma yaşayan sevkiyat teslimattan önce ayrıştırılıyor.',
    },
    en: {
      title: 'Temperature tracking across the cold chain',
      sector: 'Cold chain',
      excerpt: 'Storage and transport monitored with temperature-logging labels.',
      challenge:
        'Product temperature was only measured at door crossings, so an excursion during transport only came to light on delivery.',
      approach:
        'Pallets and cartons carry temperature-logging RFID labels and read points sit on the warehouse doors. A shipment that went out of range is pulled aside before it is delivered.',
    },
  },
]

const projects: Case[] = [
  {
    slug: 'havacilik-bakim-ekipman-takibi-projesi',
    solution: 'havacilik-bakim-takip',
    tr: {
      title: 'Havacılık bakım ekipmanı takibi',
      sector: 'Havacılık',
      excerpt: 'Bakım hangarındaki alet ve yer destek ekipmanının RFID ile takip edildiği proje.',
      challenge:
        'Bakım sonrası alet sayımı elle yapılıyor, eksik alet uçak teslim edilmeden önce aranıyordu. Yer destek ekipmanının hangi hangarda olduğu telsizle soruluyordu.',
      approach:
        'Aletler ve ekipman metal yüzeye uygun tagla işaretlendi, hangar kapılarına ve alet dolaplarına okuyucu kondu. Dolap kapandığında eksik alet listesi çıkıyor.',
    },
    en: {
      title: 'Aviation maintenance equipment tracking',
      sector: 'Aviation',
      excerpt: 'Tools and ground support equipment in a maintenance hangar tracked with RFID.',
      challenge:
        'Tool counts after maintenance were manual, and a missing tool was hunted for before the aircraft could be released. Finding a piece of ground equipment meant asking over the radio.',
      approach:
        'Tools and equipment carry on-metal tags, with readers on the hangar doors and in the tool cabinets. Closing a cabinet produces the list of what is missing.',
    },
  },
  {
    slug: 'otopark-arac-gecis-projesi',
    solution: 'rfid-otopark-arac-yonetimi',
    tr: {
      title: 'Otopark ve araç geçiş projesi',
      sector: 'Otopark',
      excerpt: 'Araç camına takılan UHF etiketle bariyer geçişinin otomatikleştirildiği proje.',
      challenge:
        'Bariyerde kart okutmak için durmak gereken noktada sabah saatlerinde kuyruk oluşuyordu. Ziyaretçi ile abone araç ayrımı elle yapılıyordu.',
      approach:
        'Abone araçlara cam etiketi takıldı, bariyere uzun mesafe okuyan UHF okuyucu ve anten kondu. Araç durmadan geçiyor, ziyaretçi kolu ayrı çalışıyor.',
    },
    en: {
      title: 'Car park and vehicle access project',
      sector: 'Parking',
      excerpt: 'Barrier access automated with a windscreen UHF tag.',
      challenge:
        'Having to stop and present a card at the barrier created a morning queue, and telling visitors apart from permit holders was a manual job.',
      approach:
        'Permit vehicles carry a windscreen tag and the barrier got a long-range UHF reader and antenna. Permit holders drive through without stopping and the visitor lane runs separately.',
    },
  },
  {
    slug: 'el-aleti-ve-kalibrasyon-takibi-projesi',
    solution: 'uhf-rfid-alet-yonetimi',
    tr: {
      title: 'El aleti ve kalibrasyon takibi',
      sector: 'Üretim',
      excerpt: 'Üretim sahasındaki el aletlerinin zimmet ve kalibrasyon tarihiyle birlikte izlendiği proje.',
      challenge:
        'Alet vardiya arasında el değiştirdiği için zimmet kaydı tutmuyordu. Kalibrasyon tarihi geçmiş alet sahada kullanılabiliyordu.',
      approach:
        'Aletlere küçük gövdeli metal tag takıldı, alet dolabı okuyuculu hale getirildi. Kalibrasyon tarihi geçen alet dolaptan çıkarken uyarı üretiyor.',
    },
    en: {
      title: 'Hand tool and calibration tracking',
      sector: 'Manufacturing',
      excerpt: 'Shop-floor hand tools tracked together with who holds them and when they are next due for calibration.',
      challenge:
        'Tools changed hands between shifts, so the assignment record did not hold, and a tool past its calibration date could still be used on the floor.',
      approach:
        'Tools carry small on-metal tags and the tool cabinet was fitted with a reader. Taking out a tool that is past its calibration date raises a warning.',
    },
  },
  {
    slug: 'hastane-rtls-konum-takibi-projesi',
    solution: 'hastane-rtls-takip',
    tr: {
      title: 'Hastanede gerçek zamanlı konum takibi',
      sector: 'Sağlık',
      excerpt: 'Kat planı üzerinde cihaz ve yatak konumunun izlendiği RTLS projesi.',
      challenge:
        'Kapı geçişi bazlı takip cihazın hangi odada olduğunu göstermiyordu. Acil durumda cihaz aramak zaman kaybettiriyordu.',
      approach:
        'Kat tavanına RTLS okuyucuları kondu, cihazlar aktif etiketle işaretlendi. Konum kat planı üzerinde görünüyor, oda seviyesinde arama yapılabiliyor.',
    },
    en: {
      title: 'Real-time location tracking in a hospital',
      sector: 'Healthcare',
      excerpt: 'An RTLS project showing device and bed location on the floor plan.',
      challenge:
        'Door-crossing tracking did not say which room a device was in, and searching for one during an emergency cost time.',
      approach:
        'RTLS readers were installed in the ceiling and devices carry active tags. Location shows on the floor plan and can be searched down to the room.',
    },
  },
  {
    slug: 'magaza-rtls-tavan-takibi-projesi',
    solution: 'perakende-rtls-takip',
    tr: {
      title: 'Mağazada AoA ve RTLS tavan takibi',
      sector: 'Perakende',
      excerpt: 'Tavana monte okuyucularla mağaza içi ürün konumunun izlendiği proje.',
      challenge:
        'Haftalık sayım stok farkını kapatıyor ama ürünün yanlış reyona konduğu gün içinde fark edilmiyordu.',
      approach:
        'Tavana AoA anteni ve okuyucu kondu, RFID etiketli ürünün konumu mağaza planında izleniyor. Yanlış reyondaki ürün gün içinde listeye düşüyor.',
    },
    en: {
      title: 'AoA and ceiling RTLS in a store',
      sector: 'Retail',
      excerpt: 'In-store item location tracked with ceiling-mounted readers.',
      challenge:
        'A weekly count closed the stock gap, but an item put back on the wrong fixture went unnoticed during the day.',
      approach:
        'AoA antennas and readers were installed in the ceiling and tagged items are followed on the store plan. Anything on the wrong fixture appears on the list during the day.',
    },
  },
  {
    slug: 'el-terminali-filo-yonetimi-projesi',
    solution: 'mobil-cihaz-yonetimi',
    tr: {
      title: 'El terminali filo yönetimi',
      sector: 'BT',
      excerpt: 'Saha ekibindeki el terminallerinin zimmet, sürüm ve arıza takibinin yapıldığı proje.',
      challenge:
        'Cihazlar şubeler arasında dolaştığı için hangi cihazın kimde olduğu bilinmiyor, sürüm güncellemesi cihaz cihaz yapılıyordu.',
      approach:
        'Cihazlar envantere alındı ve merkezi yönetim yazılımına bağlandı. Zimmet, sürüm ve arıza kaydı tek listeden görülüyor.',
    },
    en: {
      title: 'Handheld fleet management',
      sector: 'IT',
      excerpt: 'Handheld terminals in the field tracked for assignment, software version and faults.',
      challenge:
        'Devices moved between branches, so nobody knew who held which one, and updates were applied device by device.',
      approach:
        'Devices were added to an inventory and connected to central management software. Assignment, version and fault history are read from one list.',
    },
  },
]

const main = async () => {
  const payload = await getPayload({ config })

  const solutionId = async (slug?: string) => {
    if (!slug) return undefined
    const found = await payload.find({ collection: 'solutions', where: { slug: { equals: slug } }, limit: 1, locale: 'tr' })
    return found.docs[0]?.id
  }

  const seed = async (collection: 'references' | 'projects', entries: Case[]) => {
    let order = 10
    for (const entry of entries) {
      const related = await solutionId(entry.solution)
      const localeData = (side: Side) => ({
        title: side.title,
        sector: side.sector,
        excerpt: side.excerpt,
        challenge: side.challenge,
        approach: side.approach,
        relatedSolution: related,
        order,
        _status: 'draft',
      })

      const existing = await payload.find({
        collection,
        where: { slug: { equals: entry.slug } },
        limit: 1,
        locale: 'tr',
        draft: true,
      })
      const found = existing.docs[0] as { id: number | string; _status?: string } | undefined

      // Bir editör kaydı yayına aldıysa üzerine yazmıyoruz; taslak metin yalnızca
      // başlangıç noktası.
      if (found?._status === 'published') {
        console.log(`skipped (published): ${collection}/${entry.slug}`)
        order += 10
        continue
      }

      const id =
        found?.id ??
        (
          await payload.create({
            collection,
            locale: 'tr',
            draft: true,
            data: { ...localeData(entry.tr), slug: entry.slug } as never,
          })
        ).id

      if (found?.id) {
        await payload.update({ collection, id, locale: 'tr', draft: true, data: localeData(entry.tr) as never })
      }
      await payload.update({ collection, id, locale: 'en', draft: true, data: localeData(entry.en) as never })
      console.log(`seeded tr+en draft: ${collection}/${entry.slug}`)
      order += 10
    }
  }

  await seed('references', references)
  await seed('projects', projects)

  console.log(`done: ${references.length} references + ${projects.length} projects as drafts`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
