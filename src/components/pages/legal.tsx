import { Section, SectionHeading } from '@/components/site/ui'
import { type Locale } from '@/lib/i18n'
import { legalPath } from '@/lib/routes'

/**
 * Aydınlatma metni ve gizlilik politikası.
 *
 * Metinler KVKK'nın aydınlatma yükümlülüğü için saydığı başlıkları izliyor: veri
 * sorumlusunun kimliği, işlenen veriler, amaçlar, hukuki sebep, aktarım, toplama
 * yöntemi, haklar ve başvuru yolu. Sitenin gerçek davranışı yazıldı: analitik
 * çerezsiz, harita tıklanana kadar yüklenmiyor, form dışında veri toplanmıyor.
 *
 * Bu metinler hukuk danışmanına okutulmadan nihai sayılmamalı; şirketin VERBİS
 * kaydı ve saklama süreleri netleştiğinde ilgili paragraflar güncellenmeli.
 */

type Block = { heading: string; body: string[]; list?: string[] }

const kvkk: Record<Locale, { title: string; lead: string; blocks: Block[] }> = {
  tr: {
    title: 'Kişisel Verilerin Korunması Aydınlatma Metni',
    lead: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, bu sitede toplanan kişisel verilerin nasıl işlendiğini açıklar.',
    blocks: [
      {
        heading: 'Veri sorumlusu',
        body: [
          'Veri sorumlusu, GUGA Bilişim Teknoloji Limited Şirketi’dir. Adres: Mehmet Akif Ersoy Mah. 292. Sk. No: 4/30, 06170 Yenimahalle/Ankara. E-posta: info@gugalabeltech.com. Telefon: +90 541 741 90 90.',
        ],
      },
      {
        heading: 'İşlenen kişisel veriler',
        body: ['Bu sitede yalnızca teklif formunu doldurduğunuzda kişisel veri toplanır:'],
        list: [
          'Kimlik: ad ve soyad',
          'İletişim: e-posta adresi, telefon numarası, ülke bilgisi',
          'Müşteri işlem: firma adı, talebinizde ilettiğiniz mesaj ve ürün bilgisi',
          'İşlem güvenliği: talebin gönderildiği sayfa adresi ve gönderim zamanı',
        ],
      },
      {
        heading: 'İşleme amaçları',
        body: ['Verileriniz şu amaçlarla işlenir:'],
        list: [
          'Teklif talebinizin karşılanması ve size dönüş yapılması',
          'Ürün ve teslim koşullarının belirlenmesi, teklif hazırlanması',
          'Sözleşme kurulması hâlinde sipariş ve sevkiyat sürecinin yürütülmesi',
          'Talep ve şikâyetlerin takibi, iletişim kayıtlarının tutulması',
        ],
      },
      {
        heading: 'Hukuki sebep',
        body: [
          'Verileriniz, Kanun’un 5. maddesinin ikinci fıkrasındaki “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve “veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması” hukuki sebeplerine dayanılarak işlenir. Ticari elektronik ileti gönderimi söz konusu olduğunda ayrıca açık rızanız alınır.',
        ],
      },
      {
        heading: 'Toplama yöntemi',
        body: [
          'Veriler, bu sitedeki teklif formunu doldurmanız yoluyla elektronik ortamda toplanır. Site ziyaretlerinde çerez kullanılmaz; ziyaret istatistikleri kişiyle ilişkilendirilmeyen, çerezsiz bir sayaçla tutulur.',
        ],
      },
      {
        heading: 'Aktarım',
        body: [
          'Verileriniz yurt içinde bulut altyapı ve e-posta hizmeti sağlayıcılarımıza, yalnızca hizmetin sağlanması amacıyla ve gerekli güvenlik önlemleri alınarak aktarılabilir. Talebiniz doğrultusunda ürün tedariki gerekiyorsa, iletişim bilgileriniz tedarik zincirindeki iş ortaklarımızla paylaşılabilir. Yasal yükümlülük hâlinde yetkili kamu kurumlarıyla paylaşım yapılır. Bunun dışında üçüncü kişilere aktarım yapılmaz, veriler pazarlama amacıyla satılmaz.',
        ],
      },
      {
        heading: 'Saklama süresi',
        body: [
          'Teklif talepleri, talebin sonuçlanmasından itibaren ticari ilişki kurulmadıysa iki yıl; ticari ilişki kurulduysa ilgili mevzuatın öngördüğü saklama süreleri boyunca saklanır. Süre dolduğunda veriler silinir veya anonim hâle getirilir.',
        ],
      },
      {
        heading: 'Haklarınız',
        body: ['Kanun’un 11. maddesi uyarınca veri sorumlusuna başvurarak şunları talep edebilirsiniz:'],
        list: [
          'Kişisel verinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme',
          'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
          'Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme',
          'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
          'Kanun’daki şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
          'Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
          'İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonuç ortaya çıkmasına itiraz etme',
          'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme',
        ],
      },
      {
        heading: 'Başvuru',
        body: [
          'Taleplerinizi, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’e uygun olarak yazılı biçimde şirket adresimize iletebilir veya info@gugalabeltech.com adresine e-posta ile gönderebilirsiniz. Başvurunuz en geç otuz gün içinde sonuçlandırılır.',
        ],
      },
    ],
  },
  en: {
    title: 'Personal Data Protection Notice',
    lead: 'How personal data collected on this site is processed under Turkish Law No. 6698 on the Protection of Personal Data.',
    blocks: [
      {
        heading: 'Data controller',
        body: [
          'The data controller is GUGA Bilişim Teknoloji Limited Şirketi. Address: Mehmet Akif Ersoy Mah. 292. Sk. No: 4/30, 06170 Yenimahalle/Ankara, Türkiye. Email: info@gugalabeltech.com. Phone: +90 541 741 90 90.',
        ],
      },
      {
        heading: 'Data we process',
        body: ['Personal data is collected only when you submit the quote form:'],
        list: [
          'Identity: first and last name',
          'Contact: email address, phone number, country',
          'Customer transaction: company name, the message and product interest you send us',
          'Transaction security: the page the request came from and the time of submission',
        ],
      },
      {
        heading: 'Purposes',
        body: ['Your data is processed to:'],
        list: [
          'Respond to your quote request',
          'Determine products and delivery terms and prepare an offer',
          'Run the order and shipping process if a contract follows',
          'Track requests and complaints and keep a record of correspondence',
        ],
      },
      {
        heading: 'Legal basis',
        body: [
          'Processing relies on Article 5(2) of the Law: that it is directly related to the conclusion or performance of a contract, and that it is necessary for the legitimate interests of the data controller. Separate explicit consent is obtained where commercial electronic messages are involved.',
        ],
      },
      {
        heading: 'How data is collected',
        body: [
          'Data is collected electronically through the quote form on this site. The site sets no cookies; visit statistics are kept with a cookieless counter that is not linked to individuals.',
        ],
      },
      {
        heading: 'Transfers',
        body: [
          'Data may be transferred to our cloud infrastructure and email service providers solely to deliver the service and under the required security measures. If your request requires product supply, your contact details may be shared with partners in the supply chain. Disclosure to public authorities is made where legally required. No other transfer takes place and data is never sold for marketing.',
        ],
      },
      {
        heading: 'Retention',
        body: [
          'Quote requests are kept for two years from conclusion where no commercial relationship follows, and for the periods required by applicable legislation where one does. Data is deleted or anonymised once the period ends.',
        ],
      },
      {
        heading: 'Your rights',
        body: ['Under Article 11 of the Law you may ask the data controller to:'],
        list: [
          'Learn whether your data is processed and request information about it',
          'Learn the purpose of processing and whether it is used accordingly',
          'Know the third parties to whom data is transferred at home or abroad',
          'Have incomplete or inaccurate data corrected',
          'Have data erased or destroyed within the conditions of the Law',
          'Have corrections and erasures notified to third parties the data was transferred to',
          'Object to a result against you produced solely by automated analysis',
          'Claim compensation for damage arising from unlawful processing',
        ],
      },
      {
        heading: 'How to apply',
        body: [
          'Send your request in writing to our company address, or by email to info@gugalabeltech.com. Requests are answered within thirty days at the latest.',
        ],
      },
    ],
  },
}

const privacy: Record<Locale, { title: string; lead: string; blocks: Block[] }> = {
  tr: {
    title: 'Gizlilik ve Çerez Politikası',
    lead: 'Bu sitenin ziyaretçi verisiyle nasıl çalıştığını, hangi üçüncü taraf hizmetleri kullandığını açıklar.',
    blocks: [
      {
        heading: 'Çerez kullanmıyoruz',
        body: [
          'Site, ziyaretçi tarayıcısına reklam veya takip çerezi bırakmaz. Ziyaret sayıları, kişiyle ilişkilendirilmeyen ve çerez kullanmayan kendi sayacımızla tutulur; bu kayıtta sayfa adresi, dil ve varsa yönlendiren site bilgisi bulunur. Bu nedenle sitede çerez izni penceresi yoktur.',
        ],
      },
      {
        heading: 'Yönetim paneli',
        body: [
          'Yalnızca şirket çalışanlarının eriştiği yönetim panelinde oturum çerezi kullanılır. Bu çerez ziyaretçiler için oluşmaz.',
        ],
      },
      {
        heading: 'Üçüncü taraf hizmetler',
        body: ['Sitede kullanılan dış hizmetler ve hangi durumda devreye girdikleri:'],
        list: [
          'Google Haritalar: iletişim sayfasındaki harita, siz “Haritayı göster” düğmesine basana kadar yüklenmez. Bastığınızda Google’a istek gider ve Google kendi politikası kapsamında veri işleyebilir.',
          'WhatsApp: sağ alttaki düğme yalnızca bir bağlantıdır; tıklamadığınız sürece WhatsApp ile bağlantı kurulmaz.',
          'Google Analytics: yalnızca panelde ölçüm kimliği tanımlıysa yüklenir. Tanımlı değilse hiçbir Google betiği çalışmaz.',
        ],
      },
      {
        heading: 'Form verileri',
        body: [
          'Teklif formuyla ilettiğiniz bilgiler şirketin veritabanında saklanır ve yetkili çalışanlara e-posta ile bildirilir. Bu verilerin işlenmesi hakkında ayrıntı için aydınlatma metnini okuyabilirsiniz.',
        ],
      },
      {
        heading: 'Güvenlik',
        body: [
          'Site ve yönetim paneli HTTPS üzerinden çalışır. Veritabanı ve dosya depolama erişimi yetkili hesaplarla sınırlıdır. Bir güvenlik sorunu fark ederseniz info@gugalabeltech.com adresine bildirin.',
        ],
      },
      {
        heading: 'Değişiklikler',
        body: [
          'Bu politika, sitede kullanılan hizmetler değiştiğinde güncellenir. Güncel sürüm her zaman bu sayfada yayımlanır.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy and Cookie Policy',
    lead: 'How this site handles visitor data and which third-party services it uses.',
    blocks: [
      {
        heading: 'We use no cookies',
        body: [
          'The site places no advertising or tracking cookies in your browser. Visit counts are kept with our own cookieless counter that is not linked to individuals; the record holds the page path, language and the referring site if any. This is why the site shows no cookie banner.',
        ],
      },
      {
        heading: 'Admin panel',
        body: [
          'A session cookie is used in the admin panel, which only company staff can reach. It is never created for visitors.',
        ],
      },
      {
        heading: 'Third-party services',
        body: ['External services used on the site and when they load:'],
        list: [
          'Google Maps: the map on the contact page does not load until you press “Show the map”. Pressing it sends a request to Google, which may process data under its own policy.',
          'WhatsApp: the button at the bottom right is only a link; no connection is made unless you click it.',
          'Google Analytics: loads only if a measurement ID is set in the panel. With no ID, no Google script runs.',
        ],
      },
      {
        heading: 'Form data',
        body: [
          'Information you send through the quote form is stored in the company database and notified to authorised staff by email. See the data protection notice for details of that processing.',
        ],
      },
      {
        heading: 'Security',
        body: [
          'The site and the admin panel run over HTTPS. Database and file storage access is limited to authorised accounts. If you notice a security issue, report it to info@gugalabeltech.com.',
        ],
      },
      {
        heading: 'Changes',
        body: ['This policy is updated when the services used on the site change. The current version is always published here.'],
      },
    ],
  },
}

const LegalPage = ({ locale, content, other }: { locale: Locale; content: (typeof kvkk)['tr']; other: { label: string; href: string } }) => (
  <Section>
    <div className="mx-auto max-w-3xl">
      <SectionHeading eyebrow={locale === 'tr' ? 'Yasal' : 'Legal'} title={content.title} as="h1" lead={content.lead} />
      <div className="mt-12 space-y-10">
        {content.blocks.map((block) => (
          <section key={block.heading}>
            <h2 className="text-h3 font-semibold">{block.heading}</h2>
            {block.body.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
            {block.list ? (
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
                {block.list.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden className="mt-1 text-signal-400">
                      ▸
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
      <p className="mt-12 border-t border-[var(--card-border)] pt-6 text-sm">
        <a href={other.href} className="text-signal-400 hover:underline">
          {other.label} →
        </a>
      </p>
    </div>
  </Section>
)

export const KvkkPage = ({ locale }: { locale: Locale }) => (
  <LegalPage
    locale={locale}
    content={kvkk[locale]}
    other={{
      label: locale === 'tr' ? 'Gizlilik ve Çerez Politikası' : 'Privacy and Cookie Policy',
      href: legalPath('privacy', locale),
    }}
  />
)

export const PrivacyPage = ({ locale }: { locale: Locale }) => (
  <LegalPage
    locale={locale}
    content={privacy[locale]}
    other={{
      label: locale === 'tr' ? 'Aydınlatma Metni' : 'Data Protection Notice',
      href: legalPath('kvkk', locale),
    }}
  />
)
