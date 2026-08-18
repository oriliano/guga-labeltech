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
