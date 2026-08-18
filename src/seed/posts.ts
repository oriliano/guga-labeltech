/**
 * Seeds the five Bilgi Merkezi articles. The legacy site had these titles with no
 * body text, so the content here is written fresh.
 *
 * Run: NODE_ENV=development npx tsx src/seed/posts.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { slugify } from '../fields/slug'

type Block = { h?: string; p?: string; ul?: string[] }

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
            block.ul.map((item, index) =>
              node([text(item)], 'listitem', { value: index + 1 }),
            ),
            'list',
            { listType: 'bullet', start: 1, tag: 'ul' },
          ),
        ]
      return [node([text(block.p ?? '')])]
    }),
    'root',
  ),
})

const posts: {
  title: string
  excerpt: string
  publishedAt: string
  tags: string[]
  blocks: Block[]
}[] = [
  {
    title: 'RFID nedir, hangi işi gerçekten çözer',
    excerpt:
      'RFID bir sayım teknolojisi değil, bir görünürlük teknolojisi. Nerede fark yarattığını ve nerede barkodun hâlâ daha iyi olduğunu anlatıyoruz.',
    publishedAt: '2025-10-24',
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
  {
    title: 'NFC ile RFID aynı şey mi',
    excerpt:
      'NFC, RFID ailesinin bir üyesi. Ama menzil, standart ve kullanım amacı bakımından depo RFID’siyle akrabalıktan öte ortak yanı az.',
    publishedAt: '2025-10-24',
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
  {
    title: 'Impinj M800 nesli etiket seçiminde neyi değiştiriyor',
    excerpt:
      'Yeni nesil UHF çipin pratikteki karşılığı: daha küçük etiketle aynı okuma performansı, zor yüzeylerde daha az kör nokta.',
    publishedAt: '2025-11-02',
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
  {
    title: 'Endüstri 4.0’a ayak uydurmak: söylemi bırakıp neyi ölçeceğinize karar verin',
    excerpt:
      'Dijital dönüşüm projelerinin çoğu teknoloji seçiminde değil, hangi verinin toplanacağına karar verme aşamasında tıkanıyor.',
    publishedAt: '2025-11-04',
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
  {
    title: 'RFID projelerinde etiket seçimi: yüzey, mesafe, ortam',
    excerpt:
      'Aynı çip, farklı yüzeyde bambaşka davranır. Etiket seçerken sırasıyla bakılacak dört şeyi ve saha testinin nasıl yapıldığını anlatıyoruz.',
    publishedAt: '2025-11-20',
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
]

const main = async () => {
  const payload = await getPayload({ config })

  for (const post of posts) {
    const slug = slugify(post.title)
    const data = {
      title: post.title,
      excerpt: post.excerpt,
      body: body(post.blocks),
      tags: post.tags.map((tag) => ({ tag })),
      publishedAt: new Date(post.publishedAt).toISOString(),
      _status: 'published',
    }

    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, limit: 1, locale: 'tr' })
    if (existing.docs[0]) {
      await payload.update({ collection: 'posts', id: existing.docs[0].id, locale: 'tr', data: data as never })
      console.log(`updated: ${slug}`)
    } else {
      await payload.create({ collection: 'posts', locale: 'tr', data: { ...data, slug } as never })
      console.log(`created: ${slug}`)
    }
  }

  console.log(`done: ${posts.length} posts`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
