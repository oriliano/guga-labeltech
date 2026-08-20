/**
 * Seeds the five Bilgi Merkezi articles in both locales. The legacy site had these
 * titles with no body text, so the content here is written fresh; the English
 * version is a rewrite rather than a literal translation.
 *
 * Both locales are written through Payload, so every field stays editable in the
 * admin panel afterwards.
 *
 * Run: NODE_ENV=development npx tsx src/seed/posts.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { slugify } from '../fields/slug'

type Block = { h?: string; p?: string; ul?: string[] }
type Content = { title: string; excerpt: string; tags: string[]; blocks: Block[] }

const node = (children: unknown[], type = 'paragraph', extra: Record<string, unknown> = {}) => ({
  type,
  format: '',
  indent: 0,
  version: 1,
  direction: 'ltr' as const,
  children,
  ...extra,
})

const text = (value: string) => ({
  type: 'text',
  text: value,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const body = (blocks: Block[]) => ({
  root: node(
    blocks.flatMap((block) => {
      if (block.h) return [node([text(block.h)], 'heading', { tag: 'h2' })]
      if (block.ul)
        return [
          node(
            block.ul.map((item, index) => node([text(item)], 'listitem', { value: index + 1 })),
            'list',
            { listType: 'bullet', start: 1, tag: 'ul' },
          ),
        ]
      return [node([text(block.p ?? '')])]
    }),
    'root',
  ),
})

const posts: { publishedAt: string; tr: Content; en: Content }[] = [
  {
    publishedAt: '2025-10-24',
    tr: {
      title: 'RFID nedir, hangi işi gerçekten çözer',
      excerpt:
        'RFID bir sayım teknolojisi değil, bir görünürlük teknolojisi. Nerede fark yarattığını ve nerede barkodun hâlâ daha iyi olduğunu anlatıyoruz.',
      tags: ['RFID', 'Temeller'],
      blocks: [
        {
          p: 'RFID, bir nesneye takılan etiketin radyo dalgasıyla okunmasıdır. Etiketin içinde küçük bir çip ve bir anten vardır. Okuyucu sinyal gönderir, etiket o sinyalden aldığı enerjiyle kimliğini geri yollar. Pil yok, kablo yok, görüş hattı yok.',
        },
        {
          p: 'Barkodla arasındaki asıl fark burada. Barkodu okutmak için elinize alıp kameraya göstermeniz gerekir. RFID etiketini okumak için kutuyu açmanız bile gerekmez. Bir palet dolusu ürünü tek geçişte okuyabilirsiniz.',
        },
        { h: 'Frekans seçimi işin yarısı' },
        {
          p: 'RFID tek bir teknoloji değil, üç ayrı frekans ailesi. Hangisini seçtiğiniz projenin nasıl çalışacağını belirler.',
        },
        {
          ul: [
            'LF (125-134 kHz): birkaç santimetre menzil, metale ve sıvıya karşı en dayanıklısı. Hayvan küpelerinde ve erişim kontrolünde yaygın.',
            'HF (13,56 MHz): on santimetre civarı menzil. Kütüphane kitapları, kartlar, NFC uygulamaları burada.',
            'UHF (860-960 MHz, Türkiye ve Avrupa için 865-868 MHz): birkaç metreden on metreye kadar menzil, saniyede yüzlerce etiket okuma. Depo, perakende ve lojistiğin kullandığı bant bu.',
          ],
        },
        {
          p: 'Depoda envanter sayacaksanız UHF dışında bir seçenek zaten yok. Ama aynı UHF etiketi bir su şişesinin üstüne yapıştırdığınızda okunma mesafesi ciddi biçimde düşer, çünkü sıvı radyo dalgasını yutar. Metal de sinyali yansıtır. Bu iki durum için ayrı etiket tasarımları üretilir.',
        },
        { h: 'Sayım süresi değil, sayım sıklığı' },
        {
          p: 'RFID projelerini satarken en çok kullanılan cümle "sayım süresi kısalıyor" oluyor. Doğru ama eksik. Asıl değişen şey şu: sayım artık ayda bir yapılan bir angarya olmaktan çıkıp haftada bir, hatta günde bir yapılabilir hâle geliyor.',
        },
        {
          p: 'Stok doğruluğunu belirleyen şey sayımın hızı değil, iki sayım arasındaki süre. Altı ayda bir sayan bir mağazanın kaydı, sayımdan bir hafta sonra yine bozulmaya başlar. Her hafta sayan bir mağaza sapmayı büyümeden yakalar.',
        },
        { h: 'RFID ne zaman doğru cevap değildir' },
        {
          p: 'Ürün başına maliyet düşükse ve ürün sayısı çok değilse RFID pahalı kalır. Etiketin kendisi ucuzdur, ama etiketleme süreci, okuyucu altyapısı ve yazılım entegrasyonu bir maliyettir. Günde otuz koli sevk eden bir işletmede barkod hâlâ daha akıllı bir tercihtir.',
        },
        {
          p: 'Bir de ortam meselesi var. Yoğun metal rafların arasında, sıvı dolu kaplarla, birbirine değen yüzlerce etiketle çalışıyorsanız okuma başarısı laboratuvardaki gibi olmaz. Bu yüzden ciddi bir projeye başlamadan önce saha testi yapılır. Kaç etiket okunuyor, hangi açıda okunmuyor, hangi rafta kör nokta var, bunlar önceden ölçülür.',
        },
        { h: 'Nereden başlanır' },
        {
          p: 'En iyi başlangıç, tek bir sürecin tek bir noktasıdır. Depo çıkışında sevkiyat doğrulaması gibi. Küçük, ölçülebilir, yanlış giderse geri dönülebilir. Orada çalıştığını gördükten sonra girişe, sayıma ve raf yönetimine yayarsınız.',
        },
        {
          p: 'Projeye hangi soruyla başladığınız da önemli. "RFID kuralım" değil, "hangi veriyi göremiyorum ve göremediğim için bana neye mal oluyor" sorusuyla başlayın. İkinci sorunun cevabı varsa teknoloji seçimi zaten kolaylaşır.',
        },
      ],
    },
    en: {
      title: 'What RFID actually solves',
      excerpt:
        'RFID is not a counting technology, it is a visibility technology. Here is where it earns its cost and where barcodes are still the better answer.',
      tags: ['RFID', 'Basics'],
      blocks: [
        {
          p: 'An RFID tag is a small chip with an antenna. The reader sends out a signal, the tag harvests energy from it and sends its identity back. No battery, no cable, no line of sight.',
        },
        {
          p: 'That last part is the real difference from barcodes. To scan a barcode you have to pick the item up and present it to the scanner. To read an RFID tag you do not even have to open the box. A full pallet can be read in one pass.',
        },
        { h: 'Frequency is half the decision' },
        {
          p: 'RFID is not one technology. It is three frequency families, and the one you pick decides how the whole project behaves.',
        },
        {
          ul: [
            'LF (125-134 kHz): a few centimetres of range and the best tolerance for metal and liquid. Common in livestock tags and access control.',
            'HF (13.56 MHz): around ten centimetres. Library books, cards and NFC applications live here.',
            'UHF (860-960 MHz, 865-868 MHz in Europe and Türkiye): several metres of range and hundreds of tags per second. This is the band warehousing, retail and logistics use.',
          ],
        },
        {
          p: 'If you are counting warehouse inventory, UHF is the only realistic option. But put that same UHF tag on a water bottle and the read range collapses, because liquid absorbs the wave. Metal reflects it. Both cases need tags designed specifically for them.',
        },
        { h: 'Not counting speed, counting frequency' },
        {
          p: 'The usual sales line is that RFID shortens stocktaking. True, but it misses the point. What really changes is that a count stops being a monthly ordeal and becomes something you can do weekly, or daily.',
        },
        {
          p: 'Stock accuracy is not driven by how fast a count runs. It is driven by the gap between two counts. A store that counts twice a year drifts out of accuracy within a week of counting. A store that counts weekly catches the drift while it is still small.',
        },
        { h: 'When RFID is the wrong answer' },
        {
          p: 'If your unit margins are thin and your item count is low, RFID stays expensive. The tag itself is cheap, but tagging as a process, reader infrastructure and software integration all cost money. A business shipping thirty cartons a day is still better served by barcodes.',
        },
        {
          p: 'Then there is the environment. Between dense metal racking, liquid-filled containers and hundreds of tags touching each other, read rates will not match the lab. This is why a serious project starts with a site test: how many tags read, at which angle they stop reading, which shelf has a dead spot. You measure that before you buy anything.',
        },
        { h: 'Where to start' },
        {
          p: 'The best first project is one point in one process. Shipment verification at the outbound door, for instance. Small, measurable, reversible if it goes wrong. Once it works there, you extend it to inbound, to cycle counting, to shelf management.',
        },
        {
          p: 'The question you start with matters too. Not "let us install RFID" but "which data am I blind to, and what is that blindness costing me". If you can answer the second one, the technology choice gets easy.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-10-24',
    tr: {
      title: 'NFC ile RFID aynı şey mi',
      excerpt:
        'NFC, RFID ailesinin bir üyesi. Ama menzil, standart ve kullanım amacı bakımından depo RFID’siyle akrabalıktan öte ortak yanı az.',
      tags: ['NFC', 'RFID'],
      blocks: [
        {
          p: 'Kısa cevap: NFC bir RFID türü. Uzun cevap, ikisini birbirinin yerine kullanmaya kalkınca ortaya çıkan sorunlarla ilgili.',
        },
        {
          p: 'NFC, 13,56 MHz HF bandında çalışır. Yani RFID’nin HF ailesinin içindedir. Farkı, iki yönlü iletişim kurabilmesi ve telefonların bu bandı desteklemesi.',
        },
        { h: 'Menzil bir kusur değil, tasarım tercihi' },
        {
          p: 'NFC’nin okuma mesafesi birkaç santimetredir. İlk bakışta zayıflık gibi görünür. Değil. Temassız ödemede kartınızın yanlışlıkla üç metre öteden okunmasını istemezsiniz. Kısa menzil burada güvenlik sağlar.',
        },
        {
          p: 'UHF RFID ise tam tersini ister. Kapıdan geçen paleti okuması, rafın iki metre ötesindeki ürünü görmesi gerekir. Aynı etiketi ödeme kartında kullanamazsınız, çünkü yanınızdan geçen biri onu okuyabilir.',
        },
        { h: 'Pratikte hangisi nerede' },
        {
          ul: [
            'NFC: ürün doğrulama, dijital ürün pasaportu, telefonla okutulan kampanya etiketleri, erişim kartları, temassız ödeme.',
            'UHF RFID: envanter sayımı, sevkiyat doğrulama, demirbaş takibi, mağaza raf yönetimi, tekstil ve kuyum sayımı.',
          ],
        },
        {
          p: 'Ayrım şuradan da yapılabilir: okumayı kim yapacak. Müşteri kendi telefonuyla okuyacaksa NFC gerekir, çünkü hiçbir telefonda UHF okuyucu yok. Okumayı personel el terminaliyle ya da kapıdaki sabit okuyucu yapacaksa UHF’ye geçersiniz.',
        },
        { h: 'İkisini birden kullanmak' },
        {
          p: 'Bazı projelerde ürünün üstünde iki etiket birden bulunur. Tekstilde bunu görüyoruz: UHF etiket depo ve mağaza sayımını yapar, ürünün içine dikilen NFC etiket müşterinin telefonuyla orijinallik doğrulamasına ve bakım bilgisine hizmet eder.',
        },
        {
          p: 'Maliyeti artırır, ama iki farklı sorunu çözer. Aynı etiketten ikisini birden beklemek yerine, hangi soruyu kimin soracağına bakıp karar vermek daha sağlıklı.',
        },
        { h: 'Karar verirken sorulacak üç soru' },
        {
          p: 'Kaç metreden okunacak. Kim okuyacak, personel mi tüketici mi. Aynı anda kaç etiket okunacak. Bu üç sorunun cevabı frekansı neredeyse tek başına belirler. Gerisi etiket tasarımı ve montaj detayıdır.',
        },
      ],
    },
    en: {
      title: 'Is NFC the same thing as RFID',
      excerpt:
        'NFC belongs to the RFID family. Beyond that shared ancestry it has little in common with the RFID used on a warehouse floor.',
      tags: ['NFC', 'RFID'],
      blocks: [
        {
          p: 'Short answer: NFC is a kind of RFID. The longer answer is about what breaks when you try to use one in place of the other.',
        },
        {
          p: 'NFC runs at 13.56 MHz, inside the HF branch of RFID. What sets it apart is two-way communication and the fact that phones support the band.',
        },
        { h: 'Short range is a design choice, not a weakness' },
        {
          p: 'NFC reads over a few centimetres. That looks like a limitation until you think about payment. You do not want your card read from three metres away by someone walking past. Here the short range is the security feature.',
        },
        {
          p: 'UHF RFID needs the opposite. It has to read the pallet moving through a doorway and the item two metres deep on a shelf. You would not put that tag on a payment card for exactly the reason above.',
        },
        { h: 'Where each one belongs' },
        {
          ul: [
            'NFC: product authentication, digital product passports, phone-tappable campaign tags, access cards, contactless payment.',
            'UHF RFID: inventory counting, shipment verification, asset tracking, shelf management, textile and jewellery stocktaking.',
          ],
        },
        {
          p: 'Another way to decide: ask who does the reading. If the customer reads it with their own phone, you need NFC, because no phone has a UHF reader. If your staff read it with a handheld, or a fixed reader does it at the door, you are in UHF territory.',
        },
        { h: 'Using both' },
        {
          p: 'Some projects carry two tags on one product. Textiles show this well. A UHF tag handles warehouse and store counting, while an NFC tag sewn into the garment serves the customer who wants to verify authenticity or read care instructions with a phone.',
        },
        {
          p: 'It costs more, and it solves two separate problems. That is healthier than expecting one tag to do both jobs badly.',
        },
        { h: 'Three questions before you choose' },
        {
          p: 'From how far will it be read. Who reads it, staff or consumer. How many tags at once. Those three answers pick the frequency almost by themselves. Everything after that is tag design and mounting detail.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-11-02',
    tr: {
      title: 'Impinj M800 nesli etiket seçiminde neyi değiştiriyor',
      excerpt:
        'Yeni nesil UHF çipin pratikteki karşılığı: daha küçük etiketle aynı okuma performansı, zor yüzeylerde daha az kör nokta.',
      tags: ['Impinj', 'UHF', 'Etiket'],
      blocks: [
        {
          p: 'Bir RFID etiketinin performansını iki şey belirler: anten tasarımı ve içindeki çip. Anteni etiketi üreten firma tasarlar, çipi ise birkaç üretici yapar. Impinj bunların en yaygını, M800 de güncel nesli.',
        },
        { h: 'Hassasiyet neden bu kadar önemli' },
        {
          p: 'Çipin okuma hassasiyeti, etiketin uyanmak için ne kadar az enerjiye ihtiyaç duyduğunu gösterir. Değer dBm cinsinden verilir ve negatiftir. Sayı ne kadar küçükse, yani mutlak değeri ne kadar büyükse, etiket o kadar az sinyalle çalışır.',
        },
        {
          p: 'Bunun sahadaki karşılığı üç şekilde görünür. Aynı okuyucu gücüyle daha uzaktan okursunuz. Aynı mesafede daha küçük antenli, yani daha küçük etiket kullanabilirsiniz. Ya da sinyalin zayıfladığı zor konumlarda, rafın arkasında ve kutunun içinde kalan ürünlerde okuma kaybınız azalır.',
        },
        {
          p: 'Üçüncüsü en çok işe yarayanı. Envanter sayımında sorun genelde ortalama okuma mesafesi değil, hiç okunamayan yüzde birkaçtır. O yüzde, sayımı tekrar ettiren şeydir.',
        },
        { h: 'Küçük etiket, dar alan' },
        {
          p: 'M800 nesliyle gelen ikinci pratik kazanç, çipin fiziksel olarak küçülmesi. Bu, etiket üreticisine tasarımda yer açar. Kuyumda halkanın içine sığacak etiket, tekstilde dikişe giren dar bant, elektronikte küçük kartın üstüne yapışan tag gibi işlerde alan her zaman sıkışıktır.',
        },
        {
          p: 'Bizim ürettiğimiz endüstriyel taglerde bu fark doğrudan görünüyor. Metal üzerinde çalışan taglerde anten tasarımı zaten kısıtlıdır, çipin daha az enerjiyle uyanması o kısıtın altından kalkmayı kolaylaştırır.',
        },
        { h: 'Seri ve modeller arasındaki farkı datasheet’ten okuyun' },
        {
          p: 'M800 tek bir çip değil, birkaç modelden oluşan bir seri. Kullanıcı belleği, EPC alanı uzunluğu ve hassasiyet değerleri modele göre değişir. Projede kaç karakterlik seri numarası yazacağınızı biliyorsanız, hangi modelin yeteceğini de bilirsiniz.',
        },
        {
          p: 'Kesin rakamları üreticinin güncel teknik föyünden alın. Bir önceki nesille kıyaslayan tabloların çoğu belirli bir test antenine ve belirli bir ortama göre ölçülmüştür, sizin sahanızda birebir çıkmaz.',
        },
        { h: 'Çipi değiştirmek her sorunu çözmez' },
        {
          p: 'Okuma sorununuz varsa ilk bakılacak yer çip değil. Etiketin yapıştığı yüzey, okuyucu anteninin açısı, güç ayarı ve etiketlerin birbirine ne kadar yakın durduğu genelde daha belirleyicidir. Yanlış yüzeye yapıştırılmış iyi bir etiket, doğru yüzeye yapıştırılmış sıradan bir etiketten kötü çalışır.',
        },
        {
          p: 'Yeni nesil çipi, doğru kurulmuş bir sistemin üstüne koyduğunuzda kazanç sağlarsınız. Kurulum hatasını kapatmak için kullanırsanız para harcar, sorunu çözmezsiniz.',
        },
      ],
    },
    en: {
      title: 'What the Impinj M800 generation changes about tag selection',
      excerpt:
        'What a newer UHF chip buys you in practice: the same read performance from a smaller tag, and fewer dead spots on difficult surfaces.',
      tags: ['Impinj', 'UHF', 'Tags'],
      blocks: [
        {
          p: 'Two things decide how an RFID tag performs: the antenna design and the chip inside it. The tag manufacturer designs the antenna. The chip comes from one of a handful of silicon vendors, and Impinj is the most widely used of them. M800 is their current generation.',
        },
        { h: 'Why sensitivity matters more than range figures' },
        {
          p: 'Read sensitivity tells you how little energy the tag needs in order to wake up. It is quoted in dBm and it is negative. The lower the number, the less signal the tag needs.',
        },
        {
          p: 'On site that shows up three ways. You read from further away at the same reader power. You fit the same read distance into a smaller antenna, which means a smaller tag. Or you lose fewer reads in the awkward positions where signal is already weak, at the back of a shelf or inside a packed carton.',
        },
        {
          p: 'The third one matters most. In a stocktake the problem is rarely average read distance. It is the few percent that never read at all, and that is what forces a second pass.',
        },
        { h: 'A smaller die buys design room' },
        {
          p: 'The other practical gain in this generation is physical: the chip is smaller, which gives the tag designer room to work. In jewellery a tag has to fit inside a ring label. In textiles it has to survive inside a narrow sewn band. In electronics it sits on a small card. Space is always tight.',
        },
        {
          p: 'We see the difference clearly in the industrial tags we manufacture. On-metal tags already work under a constrained antenna design, so a chip that wakes on less energy makes that constraint easier to live with.',
        },
        { h: 'Read the datasheet for the model, not the family' },
        {
          p: 'M800 is a series, not a single part. User memory, EPC field length and sensitivity vary between models. If you know how long your serial numbers need to be, you already know which model is enough.',
        },
        {
          p: 'Take exact figures from the manufacturer current datasheet. Most comparison tables were measured with a specific test antenna in a specific environment, and they will not reproduce exactly on your floor.',
        },
        { h: 'A better chip does not fix a bad install' },
        {
          p: 'If you have a read problem, the chip is not the first place to look. The surface the tag sits on, the angle of the reader antenna, the power setting and how tightly tags are packed together usually matter more. A good tag on the wrong surface performs worse than an ordinary tag on the right one.',
        },
        {
          p: 'Put a newer chip on top of a correctly built system and you gain. Use it to paper over an installation mistake and you have spent money without solving anything.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-11-04',
    tr: {
      title: 'Endüstri 4.0’a ayak uydurmak: söylemi bırakıp neyi ölçeceğinize karar verin',
      excerpt:
        'Dijital dönüşüm projelerinin çoğu teknoloji seçiminde değil, hangi verinin toplanacağına karar verme aşamasında tıkanıyor.',
      tags: ['Endüstri 4.0', 'Dijital dönüşüm'],
      blocks: [
        {
          p: 'Endüstri 4.0 başlığı altında anlatılanların çoğu doğru ama kullanışsız. Makinelerin birbiriyle konuşması, verinin gerçek zamanlı akması, karar süreçlerinin otomatikleşmesi. Hepsi doğru. Hiçbiri pazartesi sabahı ne yapacağınızı söylemiyor.',
        },
        { h: 'Önce görülemeyeni bulun' },
        {
          p: 'Üretimde ya da depoda bir sorun yaşandığında sorulan ilk soru genelde şudur: bu ne zaman oldu. Cevabı bilmiyorsanız, orada toplanmamış bir veri var demektir.',
        },
        {
          p: 'Örnekler somut. Kalıp hangi vardiyada değişti. Palet depoya girdikten sonra hangi rafta durdu. Cihaz son kalibrasyondan sonra kaç saat çalıştı. Bu soruların cevabı çoğu tesiste bir yerlerde vardır ama kâğıtta, Excel’de ya da birinin aklındadır. Sistemde değildir.',
        },
        { h: 'Otomatik tanıma, dönüşümün en ucuz basamağı' },
        {
          p: 'Veri toplamanın en pahalı yolu insana yazdırmaktır. Hem yavaştır hem hatalıdır hem de yoğun günlerde ilk atlanan iş olur. RFID, barkod ve sensörler bu yüzden dijital dönüşümün ilk basamağıdır: kaydı insandan alıp sürece gömerler.',
        },
        {
          p: 'Bir kapının altından geçen palet kendi kaydını oluşturuyorsa, o kaydın doğruluğu vardiyanın yoğunluğuna bağlı değildir. Fark burada.',
        },
        { h: 'Entegrasyon olmadan veri, rapor olmadan entegrasyon işe yaramaz' },
        {
          p: 'Topladığınız verinin ERP ya da WMS tarafına bağlanmaması, projelerin en sık takıldığı yer. Ayrı bir ekranda duran, kimsenin bakmadığı bir RFID paneli kısa sürede terk edilir.',
        },
        {
          p: 'Bunun tersi de doğru. Veriyi ERP’ye akıtıp kimsenin okumadığı bir tabloya çevirirseniz de aynı yere varırsınız. Kimin hangi kararı bu veriye bakarak vereceğini baştan yazın. Depo müdürü sabah hangi ekrana bakacak, hangi eşiğin aşılması kime bildirim gidecek.',
        },
        { h: 'Küçük başlayın, ama ölçerek başlayın' },
        {
          p: 'Pilot proje seçerken iki kriter yeter: sonucu sayıyla ifade edilebilsin ve altı haftada bitsin. Sayıyla ifade edilemiyorsa başarısını kimse savunamaz. Altı ayda bitiyorsa, biterken kurumun önceliği değişmiş olur.',
        },
        {
          p: 'Pilotun öncesinde mevcut durumu ölçün. Sayım ne kadar sürüyor, stok sapması yüzde kaç, kayıp demirbaş sayısı ne. Bu rakamlar yoksa proje sonunda "iyileşti" demekten öteye gidemezsiniz ve bir sonraki bütçeyi alamazsınız.',
        },
        { h: 'Teknoloji kararı en son verilir' },
        {
          p: 'Hangi frekans, hangi etiket, hangi okuyucu. Bunlar önemli sorular ama sıradaki son sorular. Önce hangi kararın hangi veriye ihtiyacı olduğunu netleştirin. Teknoloji seçimi ondan sonra neredeyse kendiliğinden çıkar.',
        },
      ],
    },
    en: {
      title: 'Industry 4.0: drop the slogan, decide what you will measure',
      excerpt:
        'Most digital transformation projects stall long before the technology choice. They stall at deciding which data is worth collecting.',
      tags: ['Industry 4.0', 'Digital transformation'],
      blocks: [
        {
          p: 'Most of what gets written under the Industry 4.0 banner is true and useless. Machines talking to each other, data flowing in real time, decisions becoming automated. All correct. None of it tells you what to do on Monday morning.',
        },
        { h: 'Start with what you cannot see' },
        {
          p: 'When something goes wrong on a production line or in a warehouse, the first question is usually when it happened. If nobody can answer, you have found data that is not being collected.',
        },
        {
          p: 'The examples are concrete. Which shift changed the die. Which rack did the pallet end up on after it was received. How many hours has the machine run since its last calibration. In most facilities the answers exist somewhere, but on paper, in a spreadsheet, or in one person head. Not in a system.',
        },
        { h: 'Automatic identification is the cheapest step' },
        {
          p: 'The most expensive way to collect data is to have a person type it. It is slow, it is error-prone, and it is the first task dropped on a busy day. RFID, barcodes and sensors are the first rung of the ladder for that reason: they move the record off the person and into the process.',
        },
        {
          p: 'If a pallet passing through a doorway creates its own record, the accuracy of that record no longer depends on how busy the shift was. That is the whole point.',
        },
        { h: 'Data without integration, integration without a report' },
        {
          p: 'The most common place these projects stall is the connection to ERP or WMS. An RFID dashboard sitting on its own screen, which nobody opens, gets abandoned within months.',
        },
        {
          p: 'The reverse fails too. Pipe the data into ERP and let it land in a table nobody reads, and you end up in the same place. Write down in advance who makes which decision from this data. Which screen does the warehouse manager open in the morning, and who gets notified when a threshold is crossed.',
        },
        { h: 'Start small, but start with a baseline' },
        {
          p: 'Two criteria are enough when picking a pilot: the result can be stated as a number, and it finishes within six weeks. If it cannot be stated as a number, nobody can defend it later. If it takes six months, the organisation priorities will have moved by the time it lands.',
        },
        {
          p: 'Measure the current state before you begin. How long a count takes, what the stock discrepancy percentage is, how many assets are unaccounted for. Without those numbers all you can say at the end is that things improved, and that does not win the next budget.',
        },
        { h: 'The technology decision comes last' },
        {
          p: 'Which frequency, which tag, which reader. Good questions, and the last ones to ask. Get clear first on which decision needs which data. After that the technology choice tends to make itself.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-11-20',
    tr: {
      title: 'RFID projelerinde etiket seçimi: yüzey, mesafe, ortam',
      excerpt:
        'Aynı çip, farklı yüzeyde bambaşka davranır. Etiket seçerken sırasıyla bakılacak dört şeyi ve saha testinin nasıl yapıldığını anlatıyoruz.',
      tags: ['Etiket', 'Proje', 'RFID'],
      blocks: [
        {
          p: 'RFID projelerinin başarısızlık sebeplerini sıralasak, listenin başında yanlış etiket seçimi olur. Okuyucu iyidir, yazılım çalışır, ama etiketler okunmaz. Sebebi genelde tek bir cümleyle özetlenir: etiket, yapıştığı yüzeye göre seçilmemiştir.',
        },
        { h: 'Yüzey, her şeyden önce gelir' },
        {
          p: 'Radyo dalgası metalden yansır, sıvıda soğurulur. Bu iki madde UHF RFID’nin doğal düşmanı. Standart bir etiketi doğrudan metale yapıştırırsanız okunmaz, yarım santim boşluk bıraksanız bile performans dalgalanır.',
        },
        {
          p: 'Çözüm, metal üzerinde çalışacak şekilde tasarlanmış taglerdir. Bunlar metali antenin bir parçası gibi kullanır. Bizim ürettiğimiz endüstriyel taglerin bir kısmı bu iş için, milimetre ölçeğinde gövdelerle üretiliyor. Karton ve tekstil için ise ince, esnek, ucuz etiketler yeterlidir.',
        },
        { h: 'Mesafe ve açı' },
        {
          p: 'Etiketin kaç metreden okunacağı anten boyutunu belirler. Küçük etiket, küçük anten, kısa menzil. Bunu değiştiremezsiniz, fizik.',
        },
        {
          p: 'Açı da en az mesafe kadar önemli. Etiket okuyucu antenine dik bakıyorsa en iyi sonucu alırsınız. Rafta rastgele duran ürünlerde bu garanti edilemez, o yüzden ya çift kutuplu anten kullanılır ya da etiket ürüne sabit bir yönde monte edilir. Tekstilde askının yönü, kuyumda kutunun içindeki konum bu yüzden konuşulur.',
        },
        { h: 'Ortam koşulları' },
        {
          p: 'Etiketin ömrünü belirleyen şey okuma değil, yaşadığı ortam. Sorulacak sorular şunlar: sıcaklık aralığı ne, yıkanacak mı, kimyasala maruz kalacak mı, güneş görecek mi, kaç yıl dayanması gerekiyor.',
        },
        {
          ul: [
            'Otel ve hastane tekstili: yüzlerce yıkama döngüsüne ve ütü sıcaklığına dayanmalı.',
            'Soğuk zincir: yapışkanın düşük sıcaklıkta tutunması ayrı bir problem, oda sıcaklığında test edilen etiket dondurucuda düşer.',
            'Dış saha ve demirbaş: UV dayanımı ve darbe koruması öne çıkar.',
            'Üretim hattı: yağ, toz ve sürtünme etiketi fiziksel olarak yıpratır.',
          ],
        },
        { h: 'Adet ve maliyet' },
        {
          p: 'Etiket birim fiyatı, adet arttıkça projenin en büyük kalemine dönüşür. Yılda beş bin demirbaş etiketliyorsanız birkaç kuruş fark önemsizdir. Yılda iki milyon ürün etiketliyorsanız aynı fark bütçeyi belirler.',
        },
        {
          p: 'Buradaki tuzak, ucuz etikete inip okuma başarısını düşürmek. Yüzde bir okunamama, iki milyon üründe yirmi bin eksik kayıt demek. Etiket maliyetinden kazandığınızı sayım tekrarında geri verirsiniz.',
        },
        { h: 'Saha testi olmadan karar vermeyin' },
        {
          p: 'Doğru yöntem şu: iki ya da üç aday etiketi gerçek ürüne, gerçek yüzeye, gerçek ambalajla uygulayın. Sonra sahada okuyun. Laboratuvarda değil, rafın kendisinde, dolu kutuyla, yanında diğer etiketlerle.',
        },
        {
          p: 'Ölçtüğünüz şey ortalama mesafe olmasın. Yüz etiketten kaçının ilk geçişte okunduğuna bakın. Doksan sekiz ile yüz arasındaki fark, günlük operasyonda hissedilen tek fark.',
        },
        {
          p: 'Bu testi biz proje başlangıcında yapıyoruz ve sonucu müşteriyle paylaşıyoruz. Etiket seçimi tahminle yapılırsa, hatası sonradan binlerce ürünün yeniden etiketlenmesiyle ödenir.',
        },
      ],
    },
    en: {
      title: 'Choosing an RFID tag: surface, distance, environment',
      excerpt:
        'The same chip behaves completely differently on a different surface. Here are the four things to check in order, and how a proper site test is run.',
      tags: ['Tags', 'Projects', 'RFID'],
      blocks: [
        {
          p: 'Rank the reasons RFID projects fail and the wrong tag sits at the top of the list. The reader is fine, the software works, but the tags do not read. The cause usually fits in one sentence: the tag was not chosen for the surface it is mounted on.',
        },
        { h: 'Surface comes first' },
        {
          p: 'Radio waves reflect off metal and get absorbed by liquid. Those two materials are the natural enemies of UHF RFID. Stick a standard label straight onto metal and it will not read. Leave half a centimetre of air and performance still swings.',
        },
        {
          p: 'The answer is a tag designed to work on metal, which uses the metal as part of its antenna. Some of the industrial tags we manufacture are built for exactly this, in millimetre-scale housings. For cardboard and textiles a thin, flexible, inexpensive label is enough.',
        },
        { h: 'Distance and angle' },
        {
          p: 'Required read distance sets antenna size. Small tag, small antenna, short range. You cannot argue with that one, it is physics.',
        },
        {
          p: 'Angle matters as much as distance. A tag facing the reader antenna squarely gives the best result, and items sitting at random on a shelf never guarantee that. So you either use a circularly polarised antenna or mount the tag in a fixed orientation on the product. This is why hanger direction gets discussed in textiles, and position inside the box in jewellery.',
        },
        { h: 'Environment' },
        {
          p: 'What limits a tag lifetime is not reading, it is where it lives. The questions to ask: what temperature range, will it be washed, will it meet chemicals, will it sit in sunlight, how many years does it need to last.',
        },
        {
          ul: [
            'Hotel and hospital linen: must survive hundreds of wash cycles and ironing temperatures.',
            'Cold chain: adhesive behaviour at low temperature is its own problem, and a label tested at room temperature will fall off in a freezer.',
            'Outdoor and fixed assets: UV resistance and impact protection come first.',
            'Production lines: oil, dust and abrasion wear the tag out physically.',
          ],
        },
        { h: 'Volume and cost' },
        {
          p: 'Unit tag price becomes the largest line in the budget as volume grows. Tagging five thousand assets a year makes a few cents irrelevant. Tagging two million items a year makes the same few cents decisive.',
        },
        {
          p: 'The trap is dropping to a cheaper tag and losing read rate. One percent of missed reads across two million items is twenty thousand missing records. Whatever you saved on tags, you give back in repeated counts.',
        },
        { h: 'Do not decide without a site test' },
        {
          p: 'The right method is simple. Take two or three candidate tags, apply them to the real product, on the real surface, in the real packaging. Then read them where the work happens: on the actual shelf, in a full carton, surrounded by other tags. Not on a lab bench.',
        },
        {
          p: 'Do not measure average read distance. Measure how many of a hundred tags read on the first pass. The gap between ninety-eight and a hundred is the only gap daily operations will feel.',
        },
        {
          p: 'We run this test at the start of a project and share the numbers with the customer. When tag selection is guesswork, the mistake gets paid for later by relabelling thousands of items.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-12-01',
    tr: {
      title: 'Termal transfer ribon seçimi: wax, wax-resin, resin',
      excerpt:
        'Yanlış ribon önce baskı kalitesini, sonra etiketin dayanımını bozar. Üç ribon türü arasındaki farkı ve hangisinin nerede kullanılacağını anlatıyoruz.',
      tags: ['Ribon', 'Baskı'],
      blocks: [
        {
          p: 'Bir barkod yazıcısı üç parçadan oluşur: yazıcı kafası, etiket rulosu, ribon. Üçü birbirine uymazsa baskı bozulur. Ribon genelde en son düşünülen parçadır, ama sonucu en çok o belirler.',
        },
        { h: 'Üç ribon türü, üç farklı iş' },
        {
          p: 'Ribonun üstündeki mürekkep tabakası üç farklı yapıda üretilir. Hangisini seçtiğiniz etiketin nereye yapıştığına ve ne kadar dayanması gerektiğine bağlıdır.',
        },
        {
          ul: [
            'Wax (balmumu): en ucuzu, en düşük dayanımı. Kağıt etikette ve kısa ömürlü sevkiyat etiketinde yeterli.',
            'Wax-resin: kağıt ve sentetik yüzeyde çalışır, çizilmeye orta düzeyde dayanır. Depo ve lojistik etiketlerinde en çok kullanılan tür budur.',
            'Resin (reçine): sentetik (PP, PE, PET) etikette kullanılır, kimyasala, sürtünmeye ve yüksek sıcaklığa dayanır. Endüstriyel ve demirbaş etiketinde tercih edilir.',
          ],
        },
        {
          p: 'Kural basit görünür ama sık atlanır: kağıt etikete resin ribon sürerseniz baskı dökülür. Sentetik etikete wax ribon sürerseniz mürekkep yüzeye tutunmaz, ilk sürtünmede silinir. Etiket malzemesi ile ribon türü aynı ailede olmalı.',
        },
        { h: 'Yazıcı kafası neden önemli' },
        {
          p: 'Ribon üreticileri formülü baskı kafasının enerji ayarına göre hazırlar. Aynı resin ribon bir markanın yazıcısında net çıkarken başkasında bulanık çıkabilir. Yazıcı değiştirirken ribonu da küçük partide test etmeden büyük siparişe geçmeyin.',
        },
        {
          p: 'Kafa sıcaklığı (density) ayarı da sonucu değiştirir. Düşük ayar soluk baskı verir, yüksek ayar kafayı erken yıpratır ve ribonun arka kaplamasını delip yapışmasına yol açabilir.',
        },
        { h: 'Genişlik israfı, gözden kaçan kalem' },
        {
          p: 'Ribon eninin etiket eninden geniş seçilmesi sık yapılan bir hatadır. Kullanılmayan kısım da tüketilir. Etiket eninize en yakın ribon genişliğini seçmek, yıllık tüketimde gözle görülür fark yaratır.',
        },
        { h: 'Karar verirken sorulacak sorular' },
        {
          p: 'Etiket kaç yıl okunabilir kalmalı. Dışarıda mı kalacak, güneş görecek mi. Elle mi silinecek, kimyasalla mı temizlenecek. Bu üç sorunun cevabı ribon türünü neredeyse tek başına belirler; gerisi yazıcı markasına göre ince ayardır.',
        },
      ],
    },
    en: {
      title: 'Choosing thermal transfer ribbon: wax, wax-resin, resin',
      excerpt:
        'The wrong ribbon ruins print quality first and label durability second. Here is what separates the three ribbon types and where each one belongs.',
      tags: ['Ribbon', 'Printing'],
      blocks: [
        {
          p: 'A barcode printer has three parts: the print head, the label stock, and the ribbon. If any one of them is mismatched the print suffers. Ribbon is usually the part people think about last, and the one that decides the result most.',
        },
        { h: 'Three ribbon types, three different jobs' },
        {
          p: 'The ink layer on a ribbon comes in three formulations. Which one you need depends on what the label is stuck to and how long it has to last.',
        },
        {
          ul: [
            'Wax: cheapest, least durable. Fine for paper labels and short-lived shipping labels.',
            'Wax-resin: works on paper and synthetic stock, holds up reasonably to scuffing. This is the type most warehouse and logistics labels use.',
            'Resin: for synthetic stock (PP, PE, PET), resists chemicals, abrasion and high temperature. Used on industrial and long-life asset labels.',
          ],
        },
        {
          p: 'The rule sounds obvious but gets skipped often: put resin on paper stock and the print flakes off. Put wax on synthetic stock and the ink never bonds, it wipes off on the first pass of a hand. Label stock and ribbon type have to come from the same family.',
        },
        { h: 'Why the print head matters' },
        {
          p: 'Ribbon makers tune their formula to a print head energy setting. The same resin ribbon can print crisp on one printer brand and soft on another. When you switch printers, test the ribbon on a small run before ordering a large one.',
        },
        {
          p: 'Head temperature (darkness setting) changes the result too. Too low gives a faint print. Too high wears the head out early, and can burn through the ribbon back-coat until it sticks to the head.',
        },
        { h: 'Width waste is the cost nobody checks' },
        {
          p: 'Ordering ribbon wider than the label is a common mistake. The unused width still gets consumed. Matching ribbon width to label width makes a visible difference in annual ribbon spend.',
        },
        { h: 'Three questions before you order' },
        {
          p: 'How many years does the label need to stay readable. Will it sit outdoors, in sunlight. Will it be wiped by hand or cleaned with chemicals. Those three answers pick the ribbon type almost by themselves; everything else is fine-tuning for the printer brand.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-12-08',
    tr: {
      title: 'RFID okuyucu seçimi: el terminali mi, sabit kapı mı',
      excerpt:
        'Aynı etiketi farklı okuyucular çok farklı okur. Okuyucu seçerken bakılacak dört şey ve hangi işte hangisinin doğru olduğu.',
      tags: ['Okuyucu', 'RFID'],
      blocks: [
        {
          p: 'Bir RFID projesinde etiket kadar okuyucu da işi belirler. Aynı etiket, el terminaliyle bir sonuç verir, tavana monte sabit okuyucuyla başka bir sonuç. İkisi farklı işler için tasarlanmıştır, birinin yerine öbürünü koymak sık yapılan hatadır.',
        },
        { h: 'El terminali: kişinin gittiği yere gider' },
        {
          p: 'El terminali, operatörün elinde raflar arasında dolaşarak sayım yaptığı cihazdır. Menzili birkaç metreyle sınırlıdır ama esnekliği yüksektir; rafın hangi katını taradığınızı siz seçersiniz.',
        },
        {
          p: 'Doğru kullanım alanı, düzenli sayımlar ve nokta kontrollerdir. Mağazada haftalık stok sayımı, depoda rastgele denetim, kuyumda vitrin sayımı buraya girer. Personel eğitimi kısa sürer, cihaz maliyeti de sabit sisteme göre düşüktür.',
        },
        { h: 'Sabit kapı okuyucu: geçen her şeyi kaydeder' },
        {
          p: 'Kapıya monte edilen anten, o kapıdan geçen her etiketi otomatik okur. Kimse cihazı elle yönlendirmez, kayıt kendiliğinden oluşur. Depo giriş-çıkışı, sevkiyat doğrulama, personel geçiş takibi bu kuruluma girer.',
        },
        {
          p: 'Zorluğu kurulumdadır. Anten sayısı, açısı ve gücü kapı genişliğine göre ayarlanmalı, aksi hâlde bir kenardan geçen palet okunmaz. İlk kurulumda saha testi yapılmadan bu ayarlar tahminle bırakılırsa, sistem "bazen kaçırıyor" sorunuyla anılır.',
        },
        { h: 'Masaüstü okuyucu: yazma ve doğrulama işi' },
        {
          p: 'Etiketleme hattında ya da paketleme masasında kullanılan küçük, kısa menzilli okuyucular üçüncü kategoridir. İşleri sayım değil, yeni basılan etiketi yazıp anında doğrulamaktır. Hatalı etiket bu aşamada yakalanmazsa, sahaya çıktıktan sonra maliyeti çok daha yüksek olur.',
        },
        { h: 'Anten sayısı ve güç ayarı' },
        {
          p: 'Sabit okuyucularda bir cihaza birden fazla anten bağlanabilir. Kapının iki yanına birer anten koymak, tek antenle bırakmaktan daha güvenilir okuma sağlar, çünkü etiketin okuyucuya bakış açısı değişse bile ikinci anten onu görür.',
        },
        {
          p: 'Güç ayarı da tuzak barındırır. Gücü yükseltmek okuma mesafesini artırır ama komşu kapıdaki ya da rafta beklemeyen üründeki etiketi de okumaya başlayabilir. Amaç en uzak okuma değil, doğru bölgeyi net okumaktır.',
        },
        { h: 'Karar nasıl verilir' },
        {
          p: 'Soru şudur: kayıt insanın harekete geçmesiyle mi oluşacak, yoksa üründen bağımsız otomatik mi oluşmalı. Birincisi el terminali, ikincisi sabit okuyucu ister. Çoğu olgun kurulumda ikisi bir arada çalışır: sabit okuyucu günlük hareketi otomatik kaydeder, el terminali ay sonunda doğrulama sayımı yapar.',
        },
      ],
    },
    en: {
      title: 'Choosing an RFID reader: handheld or fixed gate',
      excerpt:
        'The same tag reads differently depending on the reader. Four things to check before you choose, and which job each reader type actually fits.',
      tags: ['Readers', 'RFID'],
      blocks: [
        {
          p: 'In an RFID project the reader shapes the outcome as much as the tag does. The same tag gives one result with a handheld and a different one with a ceiling-mounted fixed reader. They are built for different jobs, and using one in place of the other is a common mistake.',
        },
        { h: 'Handheld: goes where the person goes' },
        {
          p: 'A handheld reader is what an operator carries between racks to count. Its range is limited to a few metres, but it is flexible: you decide which shelf level you are scanning.',
        },
        {
          p: 'It fits scheduled counts and spot checks: weekly stock counts in a store, random audits in a warehouse, a display case count in a jewellery shop. Staff training is short, and the hardware costs less than a fixed installation.',
        },
        { h: 'Fixed gate reader: logs everything that passes' },
        {
          p: 'An antenna mounted at a doorway reads every tag that passes through automatically, with nobody aiming the device. Warehouse inbound and outbound, shipment verification, staff access logging all fall into this setup.',
        },
        {
          p: 'The hard part is the install. Antenna count, angle and power need to be tuned to the doorway width, or a pallet passing along one edge goes unread. Skip the site test at install and the system earns a reputation for "sometimes missing reads".',
        },
        { h: 'Desktop reader: the writing and verification job' },
        {
          p: 'Small, short-range readers used on a labelling line or a packing table are a third category. Their job is not counting, it is writing a freshly printed tag and verifying it on the spot. Catch a bad tag here and it costs little. Miss it and the cost shows up much later, in the field.',
        },
        { h: 'Antenna count and power setting' },
        {
          p: 'A fixed reader can drive more than one antenna. Placing one on each side of a doorway is more reliable than a single antenna, because the second one still sees a tag whose orientation changed relative to the first.',
        },
        {
          p: 'Power setting hides its own trap. Turning it up extends read range, but it can also start reading tags on a neighbouring door or on stock sitting nearby that was never meant to be counted. The goal is not the longest possible range, it is a clean read of the intended zone.',
        },
        { h: 'How to decide' },
        {
          p: 'The question is whether the record should be created by a person acting, or automatically regardless of who is around. The first calls for a handheld, the second for a fixed reader. Most mature installations run both: the fixed reader logs daily movement automatically, and the handheld does a verification count at month end.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-12-15',
    tr: {
      title: 'Kuyumda RFID: sayım ve güvenlik aynı etikette',
      excerpt:
        'Kuyum sektöründe RFID’yi öne çıkaran şey hız değil, ürün başına düşen değer. Küçük etiket, sıkı bütçe, ama kayıp toleransı sıfır.',
      tags: ['Kuyum', 'RFID'],
      blocks: [
        {
          p: 'Bir tekstil mağazasında bir ürünün kaybolması stok raporunu bozar. Bir kuyumcuda bir ürünün kaybolması doğrudan zarar demektir. Bu fark, kuyum sektöründeki RFID projelerinin diğer sektörlerden neden farklı kurulduğunu açıklar.',
        },
        { h: 'Ürün küçük, etiket daha da küçük olmalı' },
        {
          p: 'Bir yüzüğün içine, bir kolyenin ucuna ya da bir küpenin arkasına sığacak etiket birkaç milimetre kare olmak zorundadır. Bu boyutta bir antenin okuma mesafesi de kısalır; kuyum RFID’sinde genelde birkaç santimetreyle onlarca santimetre arası bir menzil beklenir, koridorun öbür ucundan okuma beklenmez.',
        },
        {
          p: 'Kısa menzil burada bir kusur değildir. Vitrin çekmecesinin içindeki elli ürünü tek tek değil, çekmeceyi el terminaliyle taratarak saymak amaçlanır. Menzilin kısa olması komşu vitrindeki ürünün karışmasını da engeller.',
        },
        { h: 'Sayım sıklığı, kuyumda güvenliğin bir parçasıdır' },
        {
          p: 'Fiziksel sayım kuyumda zaten yapılan bir iştir, RFID onu hızlandırır. Ama asıl kazanç, sayımın sıklaşabilmesidir. Elle sayım günde bir kez yapılabilirken, RFID ile vardiya değişiminde beş dakikada tam sayım mümkün olur. Kayıp, oluştuğu gün fark edilir; bir haftalık gecikme olmaz.',
        },
        {
          p: 'Bu, hırsızlığı önlemez ama tespit süresini kısaltır. Kısa tespit süresi hem kayıp ürünün izini sürmeyi kolaylaştırır hem de personel arasında sorumluluğu netleştirir: hangi vardiyada eksik oluştuğu bellidir.',
        },
        { h: 'Etiketleme süreci ayrı bir titizlik ister' },
        {
          p: 'Değerli bir ürüne etiket takmak, ürünü değiştirmeden yapılmalıdır. Çoğu kuyum etiketi ürünün kendisine değil, ürünün asıldığı karta ya da poşete iliştirilir; ayrılabilir etiketler satış anında kolayca çıkarılır ama sayım sırasında ürünle birlikte sayılır.',
        },
        {
          p: 'Etiket-ürün eşleşmesinin doğru kaydedilmesi kritik. Yanlış eşleşen tek bir etiket, sayım sonucunu değil, envanter kaydının tamamını şüpheli hâle getirir. Bu yüzden etiketleme aşamasında ikinci bir doğrulama okuması yapılır.',
        },
        { h: 'Maliyet nereye gider' },
        {
          p: 'Kuyumda etiket birim fiyatı ürün değerine göre önemsizdir; sorun etiket sayısı değil, sistemin doğruluğudur. Bütçenin büyük kısmı etikete değil, doğru okuyucuya ve doğru sayım disiplinine gider. Ucuz bir etiketle yüzde birkaçlık okuma kaybı, kuyumda tekstildeki gibi "yeniden sayarız" ile kapatılamaz; kayıp, ürünün kendisi olabilir.',
        },
      ],
    },
    en: {
      title: 'RFID in jewellery: counting and security on the same tag',
      excerpt:
        'What makes RFID worth it in jewellery is not speed, it is value per item. A tiny tag, a tight budget, and zero tolerance for loss.',
      tags: ['Jewellery', 'RFID'],
      blocks: [
        {
          p: 'In a clothing store, a missing item throws off a stock report. In a jewellery store, a missing item is a direct loss. That difference explains why RFID projects in jewellery get built differently from other sectors.',
        },
        { h: 'A small product needs an even smaller tag' },
        {
          p: 'A tag that fits inside a ring, at the end of a necklace, or behind an earring has to measure a few square millimetres. At that size the antenna shrinks too, so jewellery RFID typically expects a range from a few centimetres to a few tens of centimetres, not a read from across the room.',
        },
        {
          p: 'Short range is not a flaw here. The goal is to sweep a display drawer of fifty items with a handheld, not to read across the store. Short range also keeps a neighbouring case from being read by accident.',
        },
        { h: 'Count frequency is part of jewellery security' },
        {
          p: 'Physical counting already happens in jewellery, RFID just speeds it up. The real gain is how often it can happen. A manual count might run once a day. With RFID a full count at shift change takes five minutes. A loss gets noticed the day it happens, not a week later.',
        },
        {
          p: 'That does not prevent theft, but it shortens detection time. A short detection window makes it easier to trace a missing item, and it makes accountability clear: which shift the shortfall appeared in is on record.',
        },
        { h: 'Tagging needs its own care' },
        {
          p: 'Tagging a valuable item has to happen without altering it. Most jewellery tags attach to the card or pouch the item is displayed on rather than the item itself. Removable tags come off easily at the point of sale, but during a count they still need to be read alongside the item they belong to.',
        },
        {
          p: 'Getting the tag-to-item pairing recorded correctly is critical. One mismatched tag does not just skew a single count, it puts the whole inventory record in doubt. That is why a second verification read happens at the tagging stage.',
        },
        { h: 'Where the budget actually goes' },
        {
          p: 'Unit tag cost barely registers against item value in jewellery. The real issue is not tag count, it is system accuracy. Most of the budget goes to the right reader and the right counting discipline, not the tag itself. A cheap tag with a few percent read loss cannot be shrugged off with "we will count again" the way it can in textiles; the loss might be the item itself.',
        },
      ],
    },
  },
  {
    publishedAt: '2025-12-22',
    tr: {
      title: 'Soğuk zincirde RFID: sıcaklık takibi neden ayrı bir problem',
      excerpt:
        'Soğuk zincirde etiketin okunması yetmez, düşmeden ve doğru sıcaklığı kaydederek okunması gerekir. Bu ikisi aynı etikette çakışan iki ayrı gereksinim.',
      tags: ['Soğuk zincir', 'RFID'],
      blocks: [
        {
          p: 'Oda sıcaklığında mükemmel yapışan bir etiket, dondurucuya girdiğinde birkaç gün içinde kalkabilir. Soğuk zincir RFID’sinde ilk atlanan konu budur: etiket seçimi sıcaklığa göre değil, yapışkanın davranışına göre yapılır.',
        },
        { h: 'Yapışkan, çipten önce test edilir' },
        {
          p: 'Standart akrilik yapışkanlar düşük sıcaklıkta sertleşir ve tutunma gücünü kaybeder. Soğuk zincir etiketleri kauçuk esaslı ya da özel formüle edilmiş yapışkanlarla üretilir; bunlar donma sıcaklığında da esnekliğini korur.',
        },
        {
          p: 'Test oda sıcaklığında yapılırsa yanıltıcı sonuç verir. Doğru test, etiketi hedef sıcaklıkta (örneğin -18°C) belirli bir süre bekletip sonra yapışma gücünü ölçmektir. Etiket tedarikçisinden bu veriyi datasheet üzerinde isteyin, laboratuvar koşulunda değil sahada doğrulayın.',
        },
        { h: 'Nem, soğuk zincirin gizli düşmanı' },
        {
          p: 'Soğuk odadan çıkan bir ürün yüzeyinde anlık yoğuşma oluşur. Bu nem hem yapışkanı hem de etiketin baskısını etkiler, özellikle giriş-çıkışı sık olan ürünlerde. Nem dayanımı düşük bir kağıt etiket birkaç giriş-çıkış döngüsünde okunamaz hâle gelir.',
        },
        { h: 'RFID mi, sıcaklık sensörü mü, ikisi birden mi' },
        {
          p: 'Standart bir UHF RFID etiketi kimlik bilgisini taşır, sıcaklığı ölçmez. Sıcaklık verisi isteniyorsa sensörlü etiket ya da ayrı bir veri kaydedici (data logger) gerekir. İkisini karıştırmamak önemlidir: "RFID takıyoruz, sıcaklığı da görürüz" beklentisi, sensör olmadan karşılanmaz.',
        },
        {
          p: 'Sensörlü RFID etiketleri daha pahalıdır ve daha büyük gövde gerektirir, çünkü küçük bir batarya ya da enerji hasadı devresi taşırlar. Her ürüne değil, palet ya da koli düzeyinde örnekleme mantığıyla kullanılmaları çoğu projede yeterlidir.',
        },
        { h: 'Okuma noktası sıcaklık geçişinde olmalı' },
        {
          p: 'Soğuk zincirde en kritik bilgi, ürünün ne zaman soğuk zincir dışına çıktığıdır. Bu yüzden okuyucular soğuk odaya değil, soğuk odanın giriş ve çıkış kapılarına yerleştirilir. Zincirin kırıldığı an, o an değil kapıdan geçiş anıdır ve kayıt orada tutulur.',
        },
        { h: 'Projeye başlamadan önce' },
        {
          p: 'Etiketi hedef sıcaklıkta test edin, oda sıcaklığında değil. Sıcaklık verisi gerekip gerekmediğine baştan karar verin, projenin ortasında sensöre geçmek pahalıdır. Okuma noktalarını ürünün durduğu yere değil, sıcaklığın değiştiği kapılara yerleştirin.',
        },
      ],
    },
    en: {
      title: 'RFID in the cold chain: why temperature tracking is a separate problem',
      excerpt:
        'In the cold chain a tag has to do more than read. It has to stay stuck and, if temperature matters, record it correctly. Those are two separate requirements colliding on one label.',
      tags: ['Cold chain', 'RFID'],
      blocks: [
        {
          p: 'A label that sticks perfectly at room temperature can lift off within days inside a freezer. This is the first thing cold chain RFID projects get wrong: tag selection needs to follow adhesive behaviour, not temperature alone.',
        },
        { h: 'Adhesive gets tested before the chip does' },
        {
          p: 'Standard acrylic adhesives stiffen at low temperature and lose their grip. Cold chain labels use rubber-based or specially formulated adhesives that stay flexible at freezing temperatures.',
        },
        {
          p: 'A test run at room temperature gives a misleading result. The correct test holds the label at the target temperature, say -18°C, for a set period and then measures adhesion. Ask the label supplier for this figure on the datasheet, and verify it on site rather than trusting lab conditions alone.',
        },
        { h: 'Moisture is the cold chain hidden enemy' },
        {
          p: 'A product coming out of cold storage picks up instant condensation on its surface. That moisture affects both the adhesive and the print, especially on items that move in and out of cold storage repeatedly. A paper label with poor moisture resistance becomes unreadable after a few such cycles.',
        },
        { h: 'RFID, a temperature sensor, or both' },
        {
          p: 'A standard UHF RFID tag carries identity, not temperature. If temperature data is required you need a sensor tag or a separate data logger. Do not conflate the two: expecting "we tagged it, so we will see the temperature too" without a sensor never gets met.',
        },
        {
          p: 'Sensor-equipped RFID tags cost more and need a larger housing, because they carry a small battery or an energy-harvesting circuit. Applying them at pallet or carton level as a sample, rather than on every item, is enough for most projects.',
        },
        { h: 'Read points belong at the temperature transition' },
        {
          p: 'The most critical piece of information in a cold chain is when a product left the cold chain. That is why readers get placed at the doors of a cold room, not inside it. The moment the chain breaks is not a moment inside storage, it is the moment of passing through a door, and that is where the record needs to be kept.',
        },
        { h: 'Before the project starts' },
        {
          p: 'Test the label at the target temperature, not at room temperature. Decide up front whether temperature data is actually needed; switching to a sensor mid-project is expensive. Place read points at the doors where temperature changes, not where the product happens to sit.',
        },
      ],
    },
  },
]

const main = async () => {
  const payload = await getPayload({ config })

  for (const post of posts) {
    const slug = slugify(post.tr.title)
    const shared = { publishedAt: new Date(post.publishedAt).toISOString(), _status: 'published' }

    const localeData = (content: Content) => ({
      title: content.title,
      excerpt: content.excerpt,
      body: body(content.blocks),
      tags: content.tags.map((tag) => ({ tag })),
      ...shared,
    })

    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, locale: 'tr' })
    const id = existing.docs[0]?.id

    if (id) {
      await payload.update({ collection: 'posts', id, locale: 'tr', data: localeData(post.tr) as never })
    } else {
      const created = await payload.create({
        collection: 'posts',
        locale: 'tr',
        data: { ...localeData(post.tr), slug } as never,
      })
      existing.docs[0] = created as never
    }

    const targetId = id ?? (existing.docs[0] as { id: number | string }).id
    await payload.update({ collection: 'posts', id: targetId, locale: 'en', data: localeData(post.en) as never })
    console.log(`seeded tr+en: ${slug}`)
  }

  console.log(`done: ${posts.length} posts in 2 locales`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
