/**
 * Rewrites the sixteen solution pages in both locales.
 *
 * The legacy site had nine long, repetitive pages and seven that were empty apart
 * from a title. Everything here is written fresh, with short slugs and titles.
 *
 * The `outcomes` field is deliberately left untouched: those tiles are for real
 * project numbers, and inventing them would make the whole page untrustworthy.
 *
 * Run: NODE_ENV=development npx tsx src/seed/solutions.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

type Cap = { t: string; d: string }
type Side = { title: string; sector: string; excerpt: string; problem: string[]; caps: Cap[] }
type Entry = { slug: string; integrations?: string[]; tr: Side; en: Side }

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
  {
    slug: 'rfid-depo-yonetimi',
    integrations: ['SAP', 'Logo', 'Netsis', 'WMS', 'Excel'],
    tr: {
      title: 'RFID ile depo yönetimi',
      sector: 'Depo',
      excerpt:
        'Mal kabulden sevkiyata kadar her hareketi kaydeden, sayımı haftalık yapılabilir hale getiren depo kurgusu.',
      problem: [
        'Depoda kaybolan zaman genelde ürünü aramakla geçer. Kayıt sistemde şu rafta der, ürün başka rafta durur. Sapma büyüdükçe herkes sisteme değil kendi hafızasına güvenmeye başlar.',
        'RFID bu döngüyü kapıdan başlayarak kırar. Palet kapıdan geçerken okunur, yerleştirme sırasında raf ile eşleşir, sayımda el terminaliyle koridor taranır. Kayıt insanın hatırlamasına bağlı olmaktan çıkar.',
      ],
      caps: [
        {
          t: 'Kapıda otomatik mal kabul',
          d: 'Giriş kapısına kurulan okuyucular gelen paletleri tek geçişte okur, irsaliye ile karşılaştırır ve eksik kalemi anında bildirir.',
        },
        {
          t: 'Raf ve konum eşleştirme',
          d: 'Raflara yerleştirilen etiketler sayesinde ürün hangi koridorda, hangi gözde duruyor kayıt altına alınır. Arama süresi ortadan kalkar.',
        },
        {
          t: 'El terminaliyle hızlı sayım',
          d: 'Koridor taranarak sayım yapılır, kutu açılmaz, ürün elle tutulmaz. Sayım artık yılda iki kez değil, haftada bir yapılabilir bir işe döner.',
        },
        {
          t: 'Sevkiyat doğrulama',
          d: 'Çıkış kapısında yüklenen ürünler siparişle karşılaştırılır. Yanlış ürün yüklendiğinde araç hareket etmeden uyarı verilir.',
        },
        {
          t: 'ERP ve WMS entegrasyonu',
          d: 'Okunan her hareket mevcut sisteminize yazılır. Ayrı bir ekranda biriken, kimsenin bakmadığı ikinci bir stok tablosu oluşmaz.',
        },
      ],
    },
    en: {
      title: 'RFID warehouse management',
      sector: 'Warehousing',
      excerpt:
        'Every movement recorded from goods-in to dispatch, and stocktaking that becomes a weekly job instead of a yearly ordeal.',
      problem: [
        'Time lost in a warehouse is mostly time spent looking for things. The system says one rack, the item sits on another. As the gap widens, people stop trusting the system and start trusting their memory.',
        'RFID breaks that loop at the door. The pallet is read as it passes through, matched to a rack location when it is put away, and picked up again when an operator walks the aisle with a handheld. The record no longer depends on anyone remembering.',
      ],
      caps: [
        {
          t: 'Automated goods-in',
          d: 'Readers at the inbound door read a full pallet in one pass, compare it against the delivery note and flag a missing line immediately.',
        },
        {
          t: 'Rack and location mapping',
          d: 'Tagged rack positions record which aisle and which bay an item is stored in, so searching stops being part of the job.',
        },
        {
          t: 'Fast cycle counting',
          d: 'An operator walks the aisle with a handheld. No carton is opened, no item is handled. Counting becomes something you can do weekly.',
        },
        {
          t: 'Dispatch verification',
          d: 'Outbound items are checked against the order at the door, so a wrong load is caught before the vehicle leaves.',
        },
        {
          t: 'ERP and WMS integration',
          d: 'Every read is written into the system you already run, instead of piling up in a second stock table nobody opens.',
        },
      ],
    },
  },
  {
    slug: 'rfid-lojistik-yonetimi',
    integrations: ['TMS', 'ERP', 'Araç takip sistemleri'],
    tr: {
      title: 'RFID ile lojistik ve sevkiyat takibi',
      sector: 'Lojistik',
      excerpt: 'Palet, konteyner ve gönderinin hangi araçta, hangi noktada olduğunu kayıt altına alan sevkiyat görünürlüğü.',
      problem: [
        'Lojistikte en pahalı soru şudur: gönderi şu an nerede. Cevap telefonla aranarak bulunuyorsa, o bilgi hem geç hem eksiktir.',
        'Yükleme ve boşaltma noktalarına konulan okuyucular bu soruyu otomatik cevaplar. Hangi paletin hangi araca yüklendiği, aracın hangi noktadan geçtiği elle giriş yapılmadan kaydedilir.',
      ],
      caps: [
        {
          t: 'Yükleme doğrulama',
          d: 'Araca yüklenen paletler sevk emriyle karşılaştırılır. Eksik ya da yanlış palet kapıda yakalanır.',
        },
        {
          t: 'Kapı geçiş kayıtları',
          d: 'Depo, aktarma merkezi ve müşteri sahasındaki geçişler zaman damgasıyla kaydedilir, sevkiyat geçmişi kendiliğinden oluşur.',
        },
        {
          t: 'Taşıma kabı takibi',
          d: 'Geri dönüşlü palet, kasa ve konteyner gibi taşıma kaplarının kimde kaldığı izlenir. Kayıp kap maliyeti görünür hale gelir.',
        },
        {
          t: 'Teslimat kanıtı',
          d: 'Teslim noktasında yapılan okuma, hangi kalemin ne zaman teslim edildiğine dair kayıt bırakır. İtiraz durumunda tartışma veriye döner.',
        },
      ],
    },
    en: {
      title: 'RFID logistics and shipment tracking',
      sector: 'Logistics',
      excerpt: 'A record of which pallet went on which vehicle and where it has been, without anyone typing it in.',
      problem: [
        'The most expensive question in logistics is where a shipment is right now. If the answer comes from phoning around, it arrives late and incomplete.',
        'Readers at loading and unloading points answer it automatically. Which pallet went onto which vehicle, and which gate it passed through, gets recorded without manual entry.',
      ],
      caps: [
        {
          t: 'Load verification',
          d: 'Pallets loaded onto a vehicle are checked against the dispatch order, so a missing or wrong pallet is caught at the door.',
        },
        {
          t: 'Gate events',
          d: 'Passes at the warehouse, the cross-dock and the customer site are time-stamped, and the shipment history builds itself.',
        },
        {
          t: 'Returnable asset tracking',
          d: 'Pallets, crates and containers that are supposed to come back are traced to whoever still holds them, which makes the cost of losses visible.',
        },
        {
          t: 'Proof of delivery',
          d: 'A read at the delivery point records what arrived and when, so a dispute becomes a data question rather than an argument.',
        },
      ],
    },
  },
  {
    slug: 'rfid-perakende-yonetimi',
    integrations: ['POS', 'E-ticaret', 'ERP'],
    tr: {
      title: 'RFID ile perakende ve mağaza yönetimi',
      sector: 'Perakende',
      excerpt: 'Mağaza stok doğruluğunu haftalık sayımla ayakta tutan, raf boşluğunu ve kayıp satışı azaltan kurgu.',
      problem: [
        'Mağazada stok doğruluğu düşünce iki şey birden olur: müşteri aradığı ürünü bulamaz, online sipariş mağazadan karşılanamaz. İkisi de doğrudan ciro kaybıdır.',
        'RFID ile sayım kısa sürdüğü için sık yapılabilir. Sapma büyümeden yakalanır, depo ile satış alanı arasındaki fark görünür hale gelir.',
      ],
      caps: [
        {
          t: 'Haftalık envanter',
          d: 'Tüm mağaza el terminaliyle taranır. Sayım gün içinde, mağaza açıkken yapılabilecek bir işe dönüşür.',
        },
        {
          t: 'Raf boşluğu tespiti',
          d: 'Depoda olup rafta olmayan ürünler listelenir. Satış alanına çıkarılmayı bekleyen stok görünür olur.',
        },
        {
          t: 'Kasada hızlı okuma',
          d: 'Birden fazla ürün aynı anda okunur, tek tek barkod okutma adımı kalkar, kuyruk süresi düşer.',
        },
        {
          t: 'Omnichannel stok',
          d: 'Mağaza stoğu online kanala güvenle açılır. Mağazadan al ve mağazadan gönder süreçleri doğru stok verisiyle çalışır.',
        },
      ],
    },
    en: {
      title: 'RFID retail and store operations',
      sector: 'Retail',
      excerpt: 'Weekly counts that keep store stock accuracy up, and fewer empty shelf positions behind lost sales.',
      problem: [
        'When store stock accuracy drops, two things happen at once: the customer cannot find the item, and online orders cannot be fulfilled from that store. Both are lost revenue.',
        'Because an RFID count is quick, it can be frequent. Discrepancies get caught while they are small, and the gap between the stockroom and the sales floor becomes visible.',
      ],
      caps: [
        {
          t: 'Weekly inventory',
          d: 'The whole store is scanned with a handheld, during opening hours, without closing the floor.',
        },
        {
          t: 'Shelf gap detection',
          d: 'Items that exist in the stockroom but not on the shelf are listed, so replenishment stops depending on someone noticing.',
        },
        {
          t: 'Faster checkout',
          d: 'Several items read at once removes the one-by-one barcode step and shortens the queue.',
        },
        {
          t: 'Omnichannel stock',
          d: 'Store stock can be exposed to online channels with confidence, which is what click and collect and ship-from-store actually depend on.',
        },
      ],
    },
  },
  {
    slug: 'rfid-tekstil-yonetimi',
    integrations: ['ERP', 'Üretim takip sistemleri'],
    tr: {
      title: 'RFID ile tekstil takibi',
      sector: 'Tekstil',
      excerpt: 'Üretimden mağazaya, otel ve hastane çamaşırhanesinden kiralama operasyonuna kadar tekstil ürününün izlenmesi.',
      problem: [
        'Tekstilde parça sayısı yüksek, birim değeri düşüktür. Tek tek barkod okutmak bu yüzden hem yavaş hem anlamsızdır.',
        'Dokuma ya da dikilen RFID etiketi ürünle birlikte yaşar. Yıkamaya, ütüye ve uzun kullanıma dayanacak şekilde üretildiğinde tek bir etiket ürünün tüm ömrünü kaydeder.',
      ],
      caps: [
        {
          t: 'Toplu okuma',
          d: 'Koli ya da çamaşır arabası içindeki yüzlerce parça açılmadan sayılır.',
        },
        {
          t: 'Yıkama ve kullanım geçmişi',
          d: 'Otel ve hastane tekstilinde her parçanın kaç yıkama gördüğü kaydedilir. Değişim zamanı tahminle değil veriyle belirlenir.',
        },
        {
          t: 'Kiralama ve zimmet takibi',
          d: 'İş elbisesi ve üniformada hangi parçanın kimde olduğu izlenir, dönmeyen parça görünür olur.',
        },
        {
          t: 'Üretim aşaması takibi',
          d: 'Kesimden paketlemeye kadar partinin hangi aşamada olduğu okunur, darboğaz oluşan istasyon belirlenir.',
        },
      ],
    },
    en: {
      title: 'RFID for textiles',
      sector: 'Textiles',
      excerpt:
        'Tracking a garment from production to store, and linen from the laundry through every wash cycle of its working life.',
      problem: [
        'Textile operations carry a high piece count at a low unit value, which is exactly the case where scanning barcodes one at a time makes no sense.',
        'A woven or sewn-in RFID tag lives with the product. Built to survive washing, ironing and years of handling, one tag records the whole life of the item.',
      ],
      caps: [
        { t: 'Bulk reading', d: 'Hundreds of pieces inside a carton or a laundry trolley are counted without unpacking.' },
        {
          t: 'Wash and usage history',
          d: 'For hotel and hospital linen, each piece carries its own wash count, so replacement is decided from data rather than guesswork.',
        },
        {
          t: 'Rental and issue tracking',
          d: 'For workwear and uniforms, who holds which piece is recorded, and pieces that never come back become visible.',
        },
        {
          t: 'Production stage tracking',
          d: 'Reads from cutting through to packing show where a batch currently sits and which station is the bottleneck.',
        },
      ],
    },
  },
  {
    slug: 'rfid-medikal-yonetimi',
    integrations: ['HBYS', 'Bakım yönetim sistemleri'],
    tr: {
      title: 'RFID ile medikal ekipman takibi',
      sector: 'Sağlık',
      excerpt: 'Cihaz, ekipman ve sarf malzemesinin konumunu, bakım durumunu ve kullanım geçmişini kayıt altına alan sistem.',
      problem: [
        'Hastanede bir cihazın aranarak bulunması, o cihazın kullanılmadığı her dakika demektir. Pahalı ekipman çoğu tesiste ihtiyaç duyulduğu anda değil, bulunabildiği anda kullanılır.',
        'Etiketlenen ekipmanın hangi katta, hangi bölümde olduğu kayıt altına alınır. Bakım ve kalibrasyon tarihleri cihazın kendi kaydına bağlanır.',
      ],
      caps: [
        {
          t: 'Ekipman konumu',
          d: 'Cihazın en son hangi bölümde okunduğu görülür. Arama süresi kısalır, aynı cihazdan gereğinden fazla satın alma ihtiyacı azalır.',
        },
        {
          t: 'Bakım ve kalibrasyon',
          d: 'Her cihazın bakım tarihi ve kalibrasyon geçmişi kaydedilir, süresi dolan cihaz için uyarı üretilir.',
        },
        {
          t: 'Sarf malzemesi ve miat',
          d: 'Stok seviyesi ve son kullanma tarihi izlenir, miadı yaklaşan malzeme önce kullanılacak şekilde listelenir.',
        },
        {
          t: 'Zimmet ve sorumluluk',
          d: 'Ekipmanın hangi bölüme zimmetli olduğu kayıtlıdır, devir işlemleri okumayla yapılır.',
        },
      ],
    },
    en: {
      title: 'RFID for medical equipment',
      sector: 'Healthcare',
      excerpt: 'Location, maintenance status and usage history for devices, equipment and consumables.',
      problem: [
        'Every minute spent looking for a device in a hospital is a minute that device is not in use. In most facilities expensive equipment gets used when it can be found, not when it is needed.',
        'Tagged equipment reports which floor and which department it was last read in, and maintenance and calibration dates attach to the device record itself.',
      ],
      caps: [
        {
          t: 'Equipment location',
          d: 'You can see where a device was last read, which shortens search time and reduces the urge to buy a third one of something you already own two of.',
        },
        {
          t: 'Maintenance and calibration',
          d: 'Service dates and calibration history are held per device, with alerts when a due date passes.',
        },
        {
          t: 'Consumables and expiry',
          d: 'Stock levels and expiry dates are tracked, and items closest to expiry are listed to be used first.',
        },
        {
          t: 'Assignment and accountability',
          d: 'Which department holds a piece of equipment is recorded, and transfers are done with a read rather than a form.',
        },
      ],
    },
  },
  {
    slug: 'rfid-kuyum-yonetimi',
    integrations: ['POS', 'Kuyum yazılımları'],
    tr: {
      title: 'RFID ile kuyum ve mücevher takibi',
      sector: 'Kuyum',
      excerpt: 'Vitrin, kasa ve şube arasındaki her hareketi kaydeden, günlük sayımı dakikalar meselesine indiren sistem.',
      problem: [
        'Kuyumda envanter sayımı hem sık yapılması gereken hem de en çok zaman alan iştir. Her parça tek tek elden geçer, vitrin kapanır, personel başka iş yapamaz.',
        'Her parçaya takılan etiket sayesinde vitrin kapatılmadan sayım yapılabilir. Ürünün hangi vitrinde, hangi kasada ya da hangi şubede olduğu kayıtlıdır.',
      ],
      caps: [
        {
          t: 'Günlük vitrin sayımı',
          d: 'Vitrin ve kasa içeriği el terminaliyle taranır. Açılış ve kapanış sayımı günlük rutine girer.',
        },
        {
          t: 'Şubeler arası transfer',
          d: 'Gönderilen ve teslim alınan parçalar okumayla eşleştirilir, transfer sırasında kaybolan parça anında belli olur.',
        },
        {
          t: 'Vitrin çıkış uyarısı',
          d: 'Kapıya kurulan okuyucular, satışı yapılmadan çıkarılan parçayı algılar ve uyarı üretir.',
        },
        {
          t: 'Parça bazlı kimlik',
          d: 'Her ürün tekil numarayla izlenir, aynı model iki parça birbirine karışmaz.',
        },
      ],
    },
    en: {
      title: 'RFID for jewellery retail',
      sector: 'Jewellery',
      excerpt: 'Every movement between display, safe and branch recorded, and a daily count that takes minutes.',
      problem: [
        'In jewellery, stocktaking is both the task that has to happen most often and the one that costs the most time. Every piece is handled individually while the display stays closed.',
        'With a tag on each piece the count can run without closing the display, and the system holds which cabinet, safe or branch the item is in.',
      ],
      caps: [
        {
          t: 'Daily display count',
          d: 'Cabinet and safe contents are scanned with a handheld, so opening and closing counts fit into the daily routine.',
        },
        {
          t: 'Branch transfers',
          d: 'Pieces sent and received are matched by reads, so anything lost in transit shows up at once.',
        },
        {
          t: 'Unsold exit alert',
          d: 'Readers at the door detect a piece leaving without a sale and raise an alert.',
        },
        {
          t: 'Item-level identity',
          d: 'Each piece carries a unique number, so two items of the same model never get confused with each other.',
        },
      ],
    },
  },
  {
    slug: 'rfid-demirbas-yonetimi',
    integrations: ['ERP', 'Muhasebe yazılımları'],
    tr: {
      title: 'RFID ile demirbaş ve sabit kıymet takibi',
      sector: 'Demirbaş',
      excerpt: 'Zimmet, yer değiştirme ve yıllık sayım süreçlerini kayıt altına alan sabit kıymet yönetimi.',
      problem: [
        'Demirbaş sayımı çoğu kurumda yılda bir yapılır ve haftalar sürer. Sayım bittiğinde listede olup ortada olmayan kalemler için kimse net bir cevap veremez.',
        'Etiketlenen demirbaşlar oda oda taranarak sayılır. Zimmet değişikliği ve yer değiştirme, olduğu anda kaydedilir.',
      ],
      caps: [
        {
          t: 'Oda bazlı hızlı sayım',
          d: 'Bir odadaki tüm demirbaşlar kapıdan girilerek okunur. Yıllık sayım haftalar yerine günler sürer.',
        },
        {
          t: 'Zimmet yönetimi',
          d: 'Hangi kalemin hangi personele ya da hangi birime zimmetli olduğu kayıtlıdır, devir işlemi okumayla yapılır.',
        },
        {
          t: 'Yer değiştirme geçmişi',
          d: 'Demirbaşın bina ve kat içinde nereye taşındığı kaydedilir, kayıp kalemlerin izi sürülebilir.',
        },
        {
          t: 'Muhasebe uyumu',
          d: 'Sayım sonucu sabit kıymet listesiyle karşılaştırılır, fark raporu doğrudan üretilir.',
        },
      ],
    },
    en: {
      title: 'RFID fixed asset tracking',
      sector: 'Fixed assets',
      excerpt: 'Assignment, relocation and annual audits recorded as they happen instead of reconstructed once a year.',
      problem: [
        'In most organisations the asset count happens once a year and takes weeks. When it ends, nobody can explain the items that are on the list but not in the building.',
        'Tagged assets are counted room by room, and changes of custody or location are recorded at the moment they happen.',
      ],
      caps: [
        {
          t: 'Room-level counting',
          d: 'Walking into a room reads everything in it, which turns a multi-week audit into a matter of days.',
        },
        {
          t: 'Custody management',
          d: 'Which employee or department holds an item is on record, and handovers are done with a read.',
        },
        {
          t: 'Relocation history',
          d: 'Movements between buildings and floors are logged, so a missing item has a trail rather than a mystery.',
        },
        {
          t: 'Finance reconciliation',
          d: 'Count results are compared against the fixed asset register and the variance report comes out directly.',
        },
      ],
    },
  },
  {
    slug: 'rfid-personel-takip',
    integrations: ['İK yazılımları', 'PDKS', 'Erişim kontrol sistemleri'],
    tr: {
      title: 'RFID ile personel ve erişim yönetimi',
      sector: 'Personel',
      excerpt: 'Giriş çıkış kayıtları, yetkili alan erişimi ve saha güvenliği için kart ve bileklik tabanlı kurgu.',
      problem: [
        'Personel giriş çıkışının elle tutulduğu yerde iki sorun birden yaşanır: puantaj tartışması ve acil durumda kimin içeride olduğunun bilinmemesi.',
        'Kart ya da bilekliğe entegre etiket, geçişleri otomatik kaydeder. Yetkisiz alana giriş denemesi anında görünür.',
      ],
      caps: [
        {
          t: 'Giriş çıkış kaydı',
          d: 'Turnike ve kapı geçişleri otomatik yazılır, puantaj verisi tartışmadan çıkar.',
        },
        {
          t: 'Yetkili alan kontrolü',
          d: 'Kimin hangi bölüme girebileceği tanımlanır, yetkisiz geçiş denemesi kayıt altına alınır.',
        },
        {
          t: 'Acil durum listesi',
          d: 'Tahliye anında binada kimin bulunduğu listelenir. Toplanma alanında sayım yapılabilir.',
        },
        {
          t: 'Ziyaretçi yönetimi',
          d: 'Geçici kart ile ziyaretçi geçişleri izlenir, kart teslim edilmediğinde uyarı üretilir.',
        },
      ],
    },
    en: {
      title: 'RFID workforce and access management',
      sector: 'Workforce',
      excerpt: 'Attendance records, restricted area access and site safety, built on cards and wristbands.',
      problem: [
        'Where attendance is recorded by hand, two problems follow: payroll disputes, and no reliable answer to who is inside the building during an emergency.',
        'A tag inside a card or wristband records passes automatically, and an attempt to enter a restricted area shows up immediately.',
      ],
      caps: [
        {
          t: 'Attendance records',
          d: 'Turnstile and door events are written automatically, which takes payroll data out of the realm of argument.',
        },
        {
          t: 'Restricted area control',
          d: 'Who may enter which area is defined centrally, and unauthorised attempts are logged.',
        },
        {
          t: 'Evacuation list',
          d: 'During an evacuation the system lists who is still inside, and a roll call can be run at the assembly point.',
        },
        {
          t: 'Visitor management',
          d: 'Temporary cards track visitor movement, with an alert when a card is not handed back.',
        },
      ],
    },
  },
  {
    slug: 'rfid-otopark-arac-yonetimi',
    integrations: ['Bariyer sistemleri', 'Filo yönetimi'],
    tr: {
      title: 'RFID ile otopark ve araç geçiş yönetimi',
      sector: 'Otopark',
      excerpt: 'Bariyerde durmadan geçiş, yetkili araç tanımlama ve filo hareketlerinin kaydı.',
      problem: [
        'Bariyerde kart okutmak için duran her araç kuyruk üretir. Yoğun saatlerde bu kuyruk site girişini ya da fabrika kapısını tıkar.',
        'Araç camına yapıştırılan UHF etiket birkaç metreden okunur. Yetkili araç için bariyer araç yavaşlamadan açılır, yetkisiz geçiş denemesi kaydedilir.',
      ],
      caps: [
        {
          t: 'Durmadan geçiş',
          d: 'Etiket birkaç metreden okunur, sürücü camı açmaz, kuyruk oluşmaz.',
        },
        {
          t: 'Yetki tanımlama',
          d: 'Hangi aracın hangi kapıdan, hangi saatlerde geçebileceği tanımlanır.',
        },
        {
          t: 'Filo hareket kaydı',
          d: 'Aracın sahaya giriş ve çıkış saatleri kaydedilir, kullanım raporu otomatik üretilir.',
        },
        {
          t: 'Ziyaretçi ve geçici araç',
          d: 'Süreli etiketle geçici araç tanımlanır, süre dolduğunda yetki kendiliğinden kapanır.',
        },
      ],
    },
    en: {
      title: 'RFID parking and vehicle access',
      sector: 'Parking',
      excerpt: 'Barrier access without stopping, authorised vehicle identification and a record of fleet movements.',
      problem: [
        'Every vehicle that has to stop and present a card at a barrier creates a queue, and at peak hours that queue blocks the entrance.',
        'A UHF tag on the windscreen reads from several metres. The barrier opens for an authorised vehicle without it slowing down, and unauthorised attempts are logged.',
      ],
      caps: [
        { t: 'Drive-through access', d: 'The tag reads from a distance, so nobody winds a window down and no queue forms.' },
        { t: 'Access rules', d: 'Which vehicle may use which gate, and at which hours, is defined centrally.' },
        {
          t: 'Fleet movement log',
          d: 'Site entry and exit times are recorded per vehicle and utilisation reports come out of that log.',
        },
        {
          t: 'Visitor and temporary vehicles',
          d: 'Time-limited tags cover temporary vehicles, and access closes itself when the period ends.',
        },
      ],
    },
  },
  {
    slug: 'soguk-zincir-takibi',
    integrations: ['ERP', 'Kalite yönetim sistemleri'],
    tr: {
      title: 'Soğuk zincir sıcaklık takibi',
      sector: 'Soğuk zincir',
      excerpt: 'Sıcaklık kaydeden etiketler ve IoT sensörlerle depodan teslimata kadar zincirin kesintisiz belgelenmesi.',
      problem: [
        'Soğuk zincirde asıl risk, sıcaklığın bir noktada yükselip kimsenin fark etmemesidir. Ürün göründüğü kadar sağlamdır, ama kayıt yoksa bunu kanıtlayamazsınız.',
        'Sıcaklık kaydeden RFID etiketleri ve sensörler taşıma boyunca ölçüm yapar. Teslimatta etiket okunur, sıcaklık geçmişi rapora dönüşür.',
      ],
      caps: [
        {
          t: 'Taşıma boyunca ölçüm',
          d: 'Etiket belirli aralıklarla sıcaklık kaydeder. Zincirin hangi aşamasında sapma olduğu sonradan görülebilir.',
        },
        {
          t: 'Eşik aşımı uyarısı',
          d: 'Tanımlanan sıcaklık aralığı aşıldığında kayıt işaretlenir, ilgili kişiye bildirim gider.',
        },
        {
          t: 'Teslimatta belge',
          d: 'Alıcı tarafında okuma yapılır ve o gönderiye ait sıcaklık geçmişi rapor olarak üretilir.',
        },
        {
          t: 'Depo içi izleme',
          d: 'Soğuk oda ve dondurucularda IoT sensörlerle sürekli ölçüm yapılır, arıza erken fark edilir.',
        },
      ],
    },
    en: {
      title: 'Cold chain temperature monitoring',
      sector: 'Cold chain',
      excerpt:
        'Temperature-logging tags and IoT sensors that document the chain end to end, from the cold room to the delivery point.',
      problem: [
        'The real risk in a cold chain is a temperature excursion nobody notices. The product may well be fine, but without a record you cannot prove it.',
        'Temperature-logging RFID tags and sensors measure throughout transport. At delivery the tag is read and the history turns into a report.',
      ],
      caps: [
        {
          t: 'Measurement in transit',
          d: 'The tag logs temperature at set intervals, so you can see afterwards at which stage the excursion happened.',
        },
        {
          t: 'Threshold alerts',
          d: 'When the defined range is exceeded the record is flagged and a notification goes out.',
        },
        {
          t: 'Documentation at delivery',
          d: 'A read at the receiving end produces the temperature history for that specific shipment.',
        },
        {
          t: 'In-facility monitoring',
          d: 'IoT sensors measure cold rooms and freezers continuously, so equipment faults are noticed early.',
        },
      ],
    },
  },
  {
    slug: 'akilli-medikal-kabin',
    integrations: ['HBYS', 'Stok yönetimi'],
    tr: {
      title: 'Akıllı medikal kabin',
      sector: 'Sağlık',
      excerpt: 'İçindeki malzemeyi kendisi sayan, kim ne aldı kaydeden ve stok azaldığında haber veren kabin sistemi.',
      problem: [
        'Klinik alanlarda sarf malzemesi dolabı çoğu zaman kimin ne aldığı bilinmeden boşalır. Kritik malzemenin bittiği, ihtiyaç anında fark edilir.',
        'Kabin içine yerleştirilen okuyucu, kapak her kapandığında içeriği sayar. Personel kartıyla açtığı için hangi malzemeyi kimin aldığı da kayda geçer.',
      ],
      caps: [
        {
          t: 'Otomatik içerik sayımı',
          d: 'Kapak kapandığında kabin kendi envanterini okur, elle sayım gerekmez.',
        },
        {
          t: 'Kullanıcı bazlı kayıt',
          d: 'Kabini açan personel kartla tanımlanır, alınan malzeme kişiyle eşleşir.',
        },
        {
          t: 'Kritik seviye uyarısı',
          d: 'Malzeme tanımlı eşiğin altına düştüğünde ilgili birime bildirim gider.',
        },
        {
          t: 'Miat kontrolü',
          d: 'Son kullanma tarihi yaklaşan malzeme raporlanır, kabinden önce o parça kullanılacak şekilde uyarı verilir.',
        },
      ],
    },
    en: {
      title: 'Smart medical cabinet',
      sector: 'Healthcare',
      excerpt: 'A cabinet that counts its own contents, records who took what, and reports when stock runs low.',
      problem: [
        'In clinical areas a supply cabinet usually empties without anyone knowing who took what, and a critical item is found to be missing at the moment it is needed.',
        'A reader inside the cabinet counts the contents every time the door closes, and because staff open it with a card, the withdrawal is tied to a person.',
      ],
      caps: [
        { t: 'Automatic content count', d: 'Closing the door triggers a read of everything inside. No manual counting.' },
        { t: 'Per-user records', d: 'The staff card identifies who opened the cabinet and what left with them.' },
        { t: 'Low stock alerts', d: 'When an item drops below its threshold, a notification goes to the responsible team.' },
        {
          t: 'Expiry control',
          d: 'Items approaching expiry are reported and flagged to be used before newer stock.',
        },
      ],
    },
  },
  {
    slug: 'uhf-rfid-alet-yonetimi',
    integrations: ['Bakım yönetim sistemleri', 'ERP'],
    tr: {
      title: 'El aleti ve ekipman yönetimi',
      sector: 'Üretim',
      excerpt: 'Alet dolabından çıkan her parçanın kimde olduğunu ve geri dönüp dönmediğini kayda geçiren sistem.',
      problem: [
        'Alet kaybı çoğu üretim tesisinde küçük bir kalem gibi görünür, ama vardiya başında alet arayan bir ekibin kaybettiği zaman küçük değildir.',
        'Etiketlenen aletler dolaptan çıkarken ve geri konurken okunur. Vardiya sonunda eksik parça listesi kendiliğinden çıkar.',
      ],
      caps: [
        {
          t: 'Zimmet ve iade takibi',
          d: 'Aletin kimde olduğu kayıtlıdır, iade edilmeyen parça vardiya sonunda listelenir.',
        },
        {
          t: 'Dolap sayımı',
          d: 'Alet dolabı toplu okunur, tek tek kontrol gerekmez.',
        },
        {
          t: 'Kalibrasyon takibi',
          d: 'Ölçüm aletlerinin kalibrasyon tarihi izlenir, süresi dolan alet kullanıma kapatılır.',
        },
        {
          t: 'Kritik alan kontrolü',
          d: 'Havacılık ve gıda gibi alanlarda sahada alet unutulmasına karşı çıkış sayımı yapılır.',
        },
      ],
    },
    en: {
      title: 'Tool and equipment management',
      sector: 'Manufacturing',
      excerpt: 'A record of which tool left the crib, who took it, and whether it came back.',
      problem: [
        'Tool loss looks like a small budget line in most plants. The time a crew spends hunting for a tool at shift start is not small.',
        'Tagged tools are read out of and back into the crib, and the list of missing items appears by itself at the end of the shift.',
      ],
      caps: [
        {
          t: 'Issue and return tracking',
          d: 'Who holds a tool is on record, and anything not returned is listed when the shift ends.',
        },
        { t: 'Crib counting', d: 'The whole cabinet is read at once instead of item by item.' },
        {
          t: 'Calibration tracking',
          d: 'Calibration dates are held per measuring tool, and an overdue tool is taken out of service.',
        },
        {
          t: 'Foreign object control',
          d: 'In aviation and food environments an exit count guards against a tool being left behind in the work area.',
        },
      ],
    },
  },
  {
    slug: 'hastane-rtls-takip',
    integrations: ['HBYS', 'Hemşire çağrı sistemleri'],
    tr: {
      title: 'Hastanede gerçek zamanlı konum takibi',
      sector: 'Sağlık',
      excerpt: 'RTLS altyapısıyla ekipmanın, personelin ve gerektiğinde hastanın anlık konumunun izlenmesi.',
      problem: [
        'Klasik RFID bir noktadan geçişi kaydeder. Hastanede ise sorunun cevabı çoğu zaman "şu an nerede" olur, "en son nereden geçti" değil.',
        'RTLS altyapısı bunun için kurulur. Tavana yerleştirilen okuyucular, etiketli varlığın konumunu sürekli günceller.',
      ],
      caps: [
        {
          t: 'Anlık ekipman konumu',
          d: 'Pompa, monitör ve tekerlekli sandalye gibi taşınabilir ekipman harita üzerinde görülür.',
        },
        {
          t: 'Personel güvenliği',
          d: 'Riskli bölümlerde çalışan personel için yardım çağrısı butonu konumla birlikte iletilir.',
        },
        {
          t: 'Hasta güvenliği',
          d: 'Yenidoğan ve bilişsel destek gereken hastalarda tanımlı alan dışına çıkış uyarı üretir.',
        },
        {
          t: 'Yoğunluk analizi',
          d: 'Bölümler arası hareket verisi toplanır, darboğaz oluşan alanlar görünür hale gelir.',
        },
      ],
    },
    en: {
      title: 'Hospital real-time location tracking',
      sector: 'Healthcare',
      excerpt: 'RTLS infrastructure for the live position of equipment, staff and, where needed, patients.',
      problem: [
        'Standard RFID records a passage through a point. In a hospital the question is usually where something is right now, not where it was last seen.',
        'That is what RTLS is for. Ceiling-mounted readers keep updating the position of a tagged asset continuously.',
      ],
      caps: [
        {
          t: 'Live equipment position',
          d: 'Mobile equipment such as pumps, monitors and wheelchairs appears on a floor map.',
        },
        {
          t: 'Staff safety',
          d: 'In higher-risk departments a duress call carries the caller location with it.',
        },
        {
          t: 'Patient safety',
          d: 'For newborns and patients needing cognitive support, leaving a defined area raises an alert.',
        },
        {
          t: 'Flow analysis',
          d: 'Movement data between departments shows where congestion actually builds up.',
        },
      ],
    },
  },
  {
    slug: 'perakende-rtls-takip',
    integrations: ['POS', 'Mağaza yönetim sistemleri'],
    tr: {
      title: 'Perakendede AoA ve RTLS tavan takibi',
      sector: 'Perakende',
      excerpt: 'Tavana kurulan AoA antenleriyle ürünün mağaza içindeki konumunu sürekli izleyen ileri seviye kurgu.',
      problem: [
        'El terminaliyle sayım mağaza stoğunu doğru tutar ama ürünün gün içinde nereye gittiğini göstermez. Denenip yanlış rafa bırakılan ürün, sistemde var görünüp müşteri için yok hükmündedir.',
        'AoA yani geliş açısı ölçen antenler tavana kurulur ve etiketin mağaza içindeki konumunu sürekli hesaplar. Sayım bir işlem olmaktan çıkıp arka planda çalışan bir servise döner.',
      ],
      caps: [
        {
          t: 'Sürekli envanter',
          d: 'Sayım için personel görevlendirilmez, stok verisi gün boyu güncel kalır.',
        },
        {
          t: 'Yanlış yerleşim tespiti',
          d: 'Ait olmadığı reyonda duran ürün belirlenir, düzeltme listesi üretilir.',
        },
        {
          t: 'Deneme kabini analizi',
          d: 'Hangi ürünün kaç kez denendiği ve satışa dönüp dönmediği ölçülür.',
        },
        {
          t: 'Kayıp önleme',
          d: 'Ödeme yapılmadan çıkışa yönelen ürün hareketi tespit edilir.',
        },
      ],
    },
    en: {
      title: 'AoA and RTLS ceiling tracking for retail',
      sector: 'Retail',
      excerpt:
        'Ceiling-mounted angle-of-arrival antennas that track where an item sits on the shop floor, continuously.',
      problem: [
        'Handheld counting keeps store stock accurate but says nothing about where an item moved during the day. A garment tried on and left on the wrong rail exists in the system and does not exist for the customer.',
        'Angle-of-arrival antennas mounted in the ceiling calculate tag position continuously. Counting stops being a task and becomes a background service.',
      ],
      caps: [
        { t: 'Continuous inventory', d: 'Nobody is assigned to count, and stock data stays current through the day.' },
        {
          t: 'Misplacement detection',
          d: 'Items sitting in the wrong department are identified and put on a correction list.',
        },
        {
          t: 'Fitting room analytics',
          d: 'How often an item is tried on, and whether that turns into a sale, becomes measurable.',
        },
        { t: 'Loss prevention', d: 'Item movement towards an exit without a sale is detected.' },
      ],
    },
  },
  {
    slug: 'havacilik-bakim-takip',
    integrations: ['Bakım yönetim sistemleri', 'ERP'],
    tr: {
      title: 'Havacılık bakım ekipmanı takibi',
      sector: 'Havacılık',
      excerpt: 'Bakım aletlerinin, ground support ekipmanının ve kalibrasyon süreçlerinin kayıt altına alınması.',
      problem: [
        'Havacılıkta alet takibi bir verimlilik meselesi değil, doğrudan emniyet meselesidir. Sahada unutulan tek bir alet ciddi sonuç doğurabilir.',
        'Etiketlenen ekipman iş öncesi ve sonrası sayılır. Kalibrasyon süresi dolmuş alet kullanıma kapatılır, kayıt her aşamada tutulur.',
      ],
      caps: [
        {
          t: 'İş öncesi ve sonrası sayım',
          d: 'Alet setinin eksiksiz döndüğü okumayla doğrulanır, eksik parça iş bitmeden fark edilir.',
        },
        {
          t: 'Kalibrasyon ve sertifika',
          d: 'Her aletin kalibrasyon tarihi ve sertifika bilgisi kayıtlıdır, süresi dolan alet uyarı üretir.',
        },
        {
          t: 'Ground support ekipmanı',
          d: 'Apron üzerindeki ekipmanın konumu ve kullanım süresi izlenir.',
        },
        {
          t: 'Denetim kaydı',
          d: 'Kim, hangi aleti, hangi işte kullandı bilgisi denetim için raporlanabilir durumda tutulur.',
        },
      ],
    },
    en: {
      title: 'Aviation maintenance equipment tracking',
      sector: 'Aviation',
      excerpt: 'Tool control, ground support equipment and calibration records, kept in a form an auditor can read.',
      problem: [
        'In aviation, tool control is not an efficiency question. It is a safety one, and a single tool left behind in a work area can have serious consequences.',
        'Tagged equipment is counted before and after the job. Tools past their calibration date are taken out of service, and the record follows every stage.',
      ],
      caps: [
        {
          t: 'Pre and post job counts',
          d: 'A read confirms the tool set came back complete, and a missing item is caught before the job is signed off.',
        },
        {
          t: 'Calibration and certificates',
          d: 'Calibration dates and certificate data are held per tool, with alerts on expiry.',
        },
        { t: 'Ground support equipment', d: 'Position and utilisation of equipment on the apron are tracked.' },
        {
          t: 'Audit trail',
          d: 'Who used which tool on which job stays reportable for audit purposes.',
        },
      ],
    },
  },
  {
    slug: 'mobil-cihaz-yonetimi',
    integrations: ['MDM platformları', 'ERP', 'İK yazılımları'],
    tr: {
      title: 'Mobil cihaz ve el terminali yönetimi',
      sector: 'BT',
      excerpt: 'El terminali, tablet ve barkod yazıcısının zimmetini, konumunu ve şarj durumunu takip eden kurgu.',
      problem: [
        'Depo ve mağazada el terminalleri vardiya arasında kaybolur, şarj istasyonuna dönmez, arızalı cihaz bildirilmeden bir kenarda bekler. Kaç cihazın gerçekten kullanımda olduğunu kimse bilmez.',
        'Cihazlara takılan etiket ile zimmet, konum ve dönüş takibi yapılır. Bu, yazılım tarafındaki MDM çözümünün göremediği fiziksel katmanı kapatır.',
      ],
      caps: [
        {
          t: 'Vardiya zimmeti',
          d: 'Cihazı hangi personelin aldığı kaydedilir, vardiya sonunda iade edilmeyen cihaz listelenir.',
        },
        {
          t: 'Şarj istasyonu takibi',
          d: 'İstasyona dönmeyen cihaz belirlenir, ertesi vardiya şarjsız cihazla başlamaz.',
        },
        {
          t: 'Arıza ve servis geçmişi',
          d: 'Cihaz bazlı arıza kaydı tutulur, sık arızalanan model görünür hale gelir.',
        },
        {
          t: 'Envanter doğruluğu',
          d: 'Sahadaki cihaz sayısı fiziksel sayımla doğrulanır, satın alma kararı gerçek veriyle verilir.',
        },
      ],
    },
    en: {
      title: 'Mobile device and handheld management',
      sector: 'IT',
      excerpt: 'Custody, location and charging status for handhelds, tablets and label printers.',
      problem: [
        'In warehouses and stores, handhelds disappear between shifts, never make it back to the charging dock, and faulty units sit unreported in a drawer. Nobody knows how many devices are genuinely in use.',
        'A tag on the device covers custody, location and return. That is the physical layer a software MDM platform cannot see.',
      ],
      caps: [
        {
          t: 'Shift custody',
          d: 'Which member of staff took a device is recorded, and anything not returned is listed at shift end.',
        },
        {
          t: 'Charging dock tracking',
          d: 'Devices that did not return to a dock are identified, so the next shift does not start on empty batteries.',
        },
        {
          t: 'Fault and service history',
          d: 'Faults are logged per device, which makes a consistently failing model visible.',
        },
        {
          t: 'Inventory accuracy',
          d: 'The device count in the field is verified physically, so purchasing decisions rest on real numbers.',
        },
      ],
    },
  },
]

const main = async () => {
  const payload = await getPayload({ config })

  // The legacy import created these with long, sentence-length slugs. Clear them out
  // so the rewritten set owns the section cleanly.
  const existing = await payload.find({ collection: 'solutions', limit: 200, locale: 'tr', depth: 0 })
  const keep = new Set(entries.map((entry) => entry.slug))
  for (const doc of existing.docs) {
    if (!keep.has(doc.slug as string)) {
      await payload.delete({ collection: 'solutions', id: doc.id })
      console.log(`removed legacy: ${doc.slug}`)
    }
  }

  let order = 10
  for (const entry of entries) {
    const side = (data: Side) => ({
      title: data.title,
      sector: data.sector,
      excerpt: data.excerpt,
      problem: richText(data.problem),
      capabilities: data.caps.map((cap) => ({ title: cap.t, description: cap.d })),
      integrations: entry.integrations?.map((name) => ({ name })),
      order,
      featured: order <= 60,
      _status: 'published',
    })

    const found = await payload.find({
      collection: 'solutions',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      locale: 'tr',
    })

    const id =
      found.docs[0]?.id ??
      (await payload.create({ collection: 'solutions', locale: 'tr', data: { ...side(entry.tr), slug: entry.slug } as never }))
        .id

    await payload.update({ collection: 'solutions', id, locale: 'tr', data: side(entry.tr) as never })
    await payload.update({ collection: 'solutions', id, locale: 'en', data: side(entry.en) as never })
    console.log(`seeded tr+en: ${entry.slug}`)
    order += 10
  }

  console.log(`done: ${entries.length} solutions in 2 locales`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
