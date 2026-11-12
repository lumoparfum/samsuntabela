"""Kurumsal alt sayfalari uretir: hakkimizda.html ve hastane-tabela-ve-yonlendirme.html.

Sablon ve ortak parcalar scripts/referans-uret.py'den gelir (sayfa_yaz, kart, isletme_ref, GRUPLAR, GRUP_FOTO).
Metinler sitedeki mevcut bilgilerden ve eski sitenin (uzmantabela.com) sahibin yazdigi Hakkimizda yazisindan
alindi (12 Kas 2026). Uydurma sayi/iddia yok: makine adedi, proje yili gibi dogrulanmamis bilgiler yazilmadi.
Kullanim: python scripts/kurumsal-sayfalar.py   (once referans-uret.py calisabilir; sira onemli degil)
"""
import importlib.util, os, html

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location("ref", os.path.join(KOK, "scripts", "referans-uret.py"))
ref = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(ref)
SITE, e = ref.SITE, ref.e

CSS_EK = """
    <style>
        /* ===== KURUMSAL SAYFALAR (scripts/kurumsal-sayfalar.py) ===== */
        html body .kur-metin { max-width: 760px; }
        html body .kur-metin h2 { font-size: 1.4rem; font-weight: 700; color: #1d1d1f; margin: 40px 0 12px; text-transform: none; letter-spacing: -.01em; border: 0; padding: 0; text-align: left; }
        html body .kur-metin p { font-size: 17px; line-height: 1.7; color: #3a3a3c; margin: 0 0 14px; }
        html body .kur-metin ul.madde { margin: 0 0 14px; padding: 0; list-style: none; }
        html body .kur-metin ul.madde li { font-size: 16px; line-height: 1.55; color: #3a3a3c; padding: 9px 0; border-bottom: 1px solid #f0f0f2; }
        html body .kur-metin ul.madde li strong { color: #1d1d1f; }
        html body .kur-metin a { color: #1d1d1f; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        html body .kur-isler { margin: 8px 0 8px; }
        html body dl.kur-kunye { margin: 0; display: grid; grid-template-columns: 170px 1fr; max-width: 760px; }
        html body dl.kur-kunye dt, html body dl.kur-kunye dd { margin: 0; padding: 11px 0; border-bottom: 1px solid #e5e5ea; font-size: 16px; }
        html body dl.kur-kunye dt { color: #6e6e73; }
        html body dl.kur-kunye dd { color: #1d1d1f; }
        html body dl.kur-kunye a { color: #1d1d1f; font-weight: 600; text-decoration: none; }
        html body .kur-sss details { border-bottom: 1px solid #e5e5ea; max-width: 760px; }
        html body .kur-sss summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; gap: 16px; padding: 18px 0; font-weight: 600; font-size: 17px; color: #1d1d1f; }
        html body .kur-sss summary::-webkit-details-marker { display: none; }
        html body .kur-sss summary::after { content: "+"; color: #6e6e73; font-weight: 400; font-size: 22px; line-height: 1; transition: transform .2s; }
        html body .kur-sss details[open] summary::after { transform: rotate(45deg); }
        html body .kur-sss details p { margin: 0 0 18px; font-size: 16px; line-height: 1.65; color: #3a3a3c; }
        @media (max-width: 768px) {
            html body .kur-metin p { font-size: 16px; }
            html body dl.kur-kunye { grid-template-columns: 1fr; }
            html body dl.kur-kunye dt { padding: 12px 0 0; border-bottom: 0; font-size: 13px; }
            html body dl.kur-kunye dd { padding: 2px 0 12px; }
            html body .kur-sss summary { font-size: 16px; }
        }
    </style>"""

WA = ('<div class="ref-alt"><p>{metin}</p><a class="wa" href="https://wa.me/905079605049" target="_blank" rel="noopener" '
      "onclick=\"gtag('event','whatsapp_tiklama',{{'sayfa':'{sayfa}'}});\"><i class=\"fab fa-whatsapp\" aria-hidden=\"true\"></i>WhatsApp'tan yazın</a></div>")


def yol(ad):
    return f'<p class="yol"><a href="/">Ana sayfa</a> › {e(ad)}</p>'


def kirinti(ad, url):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Ana sayfa", "item": SITE},
        {"@type": "ListItem", "position": 2, "name": ad, "item": url}]}


def hakkimizda(galeri):
    dosya = "hakkimizda.html"; url = SITE + dosya
    baslik = "Hakkımızda: 1973'ten Beri Bafra'da Tabela | Uzman Reklam"
    aciklama = ("1973'te Remzi Toraman'ın kurduğu atölye, bugün Abdurrahman Toraman yönetiminde "
                "Bafra'da tasarım, üretim ve montajı tek elden yapan tabela imalat merkezi.")
    atolye = [("Harf ve kompozit imalatı", "atolye-kutu-harf-kompozit-imalat.webp"), ("CNC router ile kesim", "cnc-router-lazer-kesim-imalat.webp"),
              ("Işıklı totem imalatı", "anzel-egitim-kurumlari-isikli-totem-imalati.webp"), ("Kendi ekibimizle montaj", "atakum-kompozit-totem-montaji.webp")]
    atolye_html = "".join(
        f'<figure><img src="galeri/k/{d}" alt="{html.escape(galeri[d]["alt"])}" width="640" height="480" loading="lazy" decoding="async">'
        f'<figcaption><strong>{e(ad)}</strong><span>Bafra atölyemiz</span></figcaption></figure>' for ad, d in atolye)
    stok = [("Kesim folyosu renk stoğu", "folyo-renk-stogu"), ("Orafol ve Frimpeks folyolar", "orafol-frimpeks-folyo-stogu"),
            ("Branda ve vinil ruloları", "branda-vinil-rulo-deposu"), ("Alüminyum kompozit paneller", "aluminyum-kompozit-panel-stogu"),
            ("Pleksi ve forex levhalar", "pleksi-forex-levha-stogu"), ("Depoya malzeme girişi", "depoya-malzeme-girisi")]
    stok_html = "".join(
        f'<figure><img src="images/atolye/{d}-k.webp" alt="Uzman Reklam Bafra atölyesi: {e(ad).lower()}" width="640" height="480" loading="lazy" decoding="async">'
        f'<figcaption><strong>{e(ad)}</strong><span>Bafra deposu</span></figcaption></figure>' for ad, d in stok)
    icerik = f"""<main class="ref-sayfa">
  <header class="ref-ust">
    {yol("Hakkımızda")}
    <h1>Hakkımızda</h1>
    <p>Uzman Reklam, 1973'te Remzi Toraman'ın açtığı küçük bir tabela atölyesinden, bugün Bafra'da tasarım, üretim ve montajı tek elden yapan bir tabela imalat merkezine dönüştü.</p>
    <ul class="ref-sayilar">
      <li><strong>1973</strong>Kuruluş</li>
      <li><strong>2. kuşak</strong>Aile işletmesi</li>
      <li><strong>Bafra</strong>Kendi atölyemiz</li>
    </ul>
  </header>
  <div class="kur-metin">
    <h2>1973'ten bugüne</h2>
    <p>Kurucumuz Remzi Toraman'ın el işçiliğine dayalı tabela ustalığı zamanla ailenin işi oldu ve markamızın temelini oluşturdu.</p>
    <p>İkinci kuşaktan Abdurrahman Toraman çocukluğunu atölyede geçirdi, mesleğin bütün inceliklerini burada öğrendi ve 2000'li yıllarda işletmenin yönetimini devraldı. Bu dönemde yapılan yatırımlarla bölgesel bir atölye, profesyonel bir üretim tesisine dönüştü.</p>
    <h2>Bugün ne yapıyoruz?</h2>
    <p>Tasarımı, üretimi ve montajı kendi bünyemizde yapıyoruz; işi aracıya ya da fasona vermiyoruz.</p>
    <ul class="madde">
      <li><strong>Kutu harf ve krom harf tabela</strong> · ışıklı ve ışıksız, paslanmaz ve pleksi</li>
      <li><strong>Totem ve cephe</strong> · totem tabela, kompozit cephe kaplama, bina giydirme</li>
      <li><strong>Yönlendirme sistemleri</strong> · hastane, kamu binası, AVM ve fabrika için kat, birim ve zemin yönlendirme</li>
      <li><strong>Erişilebilirlik</strong> · hissedilebilir yüzey ve Braille kabartma levha</li>
      <li><strong>Bayi tabelaları</strong> · marka kurumsal kimlik kılavuzuna uygun seri üretim</li>
      <li><strong>Baskı ve kesim</strong> · dijital baskı, araç giydirme, CNC ve lazer kesim</li>
    </ul>
    <h2>Kimler için çalışıyoruz?</h2>
    <p>Ağırlıklı olarak devlet kurumları, devlet ve özel hastaneler, kurumsal firmalar, ulusal markaların bayileri ve inşaat-ticaret sektörü için çalışıyoruz. Tabela yaptığımız kurum ve markaların listesi <a href="referanslar.html">Referanslarımız</a> sayfasında; hastane işlerimiz <a href="hastane-tabela-ve-yonlendirme.html">Hastane tabelası ve yönlendirme</a> sayfasında.</p>
    <h2>Atölyemiz</h2>
    <p>Bafra Emirefendi Mahallesi'ndeki atölyemizde harf kesiminden kaynağa, boyadan LED montajına kadar bütün işler yapılıyor; sahadaki montajı da kendi ekibimiz yapıyor.</p>
  </div>
  <div class="ref-isler kur-isler">{atolye_html}</div>
  <div class="kur-metin">
    <h2>Malzeme stoğumuz</h2>
    <p>İşi bekletmemek için malzemeyi stokta tutuyoruz: Orafol, Frimpeks ve Softmark folyolar, dijital baskı branda ve vinil ruloları, alüminyum kompozit paneller, pleksi ve forex levhalar.</p>
  </div>
  <div class="ref-isler kur-isler">{stok_html}</div>
  <div class="kur-metin">
    <h2>Aile şirketimiz: Toraman Matbaa</h2>
    <p>Ailemizin ikinci üretim kolu Toraman Matbaa, İstanbul Topkapı'da endüstriyel baskı tesisidir. Türkiye genelindeki matbaalar, ajanslar ve kurumsal firmalar için etiket, ambalaj, karton kutu, katalog ve broşür üretir; yurt dışına da ihracat yapar. <a href="https://toramanmatbaa.com" target="_blank" rel="noopener">toramanmatbaa.com</a></p>
    <h2>Künye</h2>
  </div>
  <dl class="kur-kunye">
    <dt>Firma</dt><dd>Uzman Reklam (Google'da: Uzman Reklam Tabela)</dd>
    <dt>Kurucu</dt><dd>Remzi Toraman, 1973</dd>
    <dt>Firma sahibi</dt><dd>Abdurrahman Toraman</dd>
    <dt>Adres</dt><dd>Emirefendi Mh. Çizmeli 2. Sk. No:33, 55400 Bafra / Samsun</dd>
    <dt>Çalışma saatleri</dt><dd>Pazartesi-Cuma 09:00-19:00 · Cumartesi 09:00-15:00 · Pazar kapalı</dd>
    <dt>Telefon</dt><dd><a href="tel:+905322204649">0532 220 46 49</a></dd>
    <dt>WhatsApp</dt><dd><a href="https://wa.me/905079605049" target="_blank" rel="noopener">0507 960 50 49</a> (fotoğraf, ölçü ve teklif)</dd>
    <dt>Vergi</dt><dd>Bafra V.D. · 8560266150</dd>
  </dl>
  {WA.format(metin="İşiniz için fotoğraf ya da ölçü gönderin; keşif ve teklifle dönelim.", sayfa="hakkimizda")}
</main>
"""
    sema = {"@context": "https://schema.org", "@graph": [
        {"@type": "AboutPage", "@id": url, "url": url, "name": "Hakkımızda", "description": aciklama, "inLanguage": "tr",
         "isPartOf": {"@id": SITE + "#site"}, "about": ref.isletme_ref(), "mainEntity": {"@id": SITE + "#isletme"}},
        kirinti("Hakkımızda", url)]}
    ref.sayfa_yaz(dosya, baslik, aciklama, sema, icerik, "Hakkımızda", CSS_EK, ust_gorsel=False)
    print(dosya)


def hastane(galeri):
    dosya = "hastane-tabela-ve-yonlendirme.html"; url = SITE + dosya
    baslik = "Hastane Tabelası ve Yönlendirme Sistemleri | Uzman Reklam"
    aciklama = ("Hastaneler için giriş takı, ışıklı kutu harf, totem, poliklinik ve kat yönlendirme, "
                "hissedilebilir yüzey, Braille levha. Bafra'daki atölyemizde üretim, montaj.")
    hastaneler = [x.split(" — ")[0] for x in ref.GRUPLAR[1][2]]
    isler = [
        ("Giriş takı ve dış cephe", "gerze-devlet-hastanesi-giris-takisi.webp"),
        ("Işıklı kutu harf", "sinop-devlet-hastanesi-isikli-kutu-harf.webp"),
        ("Totem ve yol yönlendirme", "medibafra-isikli-totem-tabela.webp"),
        ("Acil servis yönlendirmesi", "acil-giris-yonlendirme-totemi.webp"),
        ("Poliklinik, kat ve oda levhaları", "yonlendirme-oda-kapi-levhasi.webp"),
        ("Zemin yönlendirme şeridi", "yonlendirme-zemin-serit-hastane.webp"),
        ("Hissedilebilir yüzey", "hissedilebilir-zemin-hastane-danisma.webp"),
        ("Resepsiyon ve iç mekan", "medibafra-hastanesi-resepsiyon-yonlendirme.webp"),
        ("Cam folyo", "cam-folyo-hastane-kapi.webp"),
        ("Bina giydirme ve billboard", "medical-park-atakum-bina-cephe-giydirme.webp"),
    ]
    kartlar = "".join(
        f'<figure><img src="galeri/k/{d}" alt="{html.escape(galeri[d]["alt"])}" width="640" height="480" loading="lazy" decoding="async">'
        f'<figcaption><strong>{e(ad)}</strong><span>{e(galeri[d]["baslik"])}</span></figcaption></figure>' for ad, d in isler)
    sss = [
        ("Hangi hastanelerde çalıştınız?",
         "Tabela ve yönlendirme yaptığımız hastane ve sağlık kurumlarından bazıları: " + ", ".join(hastaneler) + "."),
        ("Hissedilebilir yüzey ve Braille levha yapıyor musunuz?",
         "Evet. Görme engelli bireyler için yönlendirici (çizgili) ve uyarıcı (noktalı) hissedilebilir yüzey kaplamaları, oda, kat ve WC için "
         "Braille kabartma levhalar, dokunmatik kabartmalı kat planları üretiyor ve uyguluyoruz. Uygulamadan önce güzergah planını kurumla birlikte çıkarıyoruz."),
        ("Yönlendirme projesine nasıl başlıyorsunuz?",
         "Önce binayı yerinde geziyor, hasta ve ziyaretçi akışını izliyoruz. Girişteki kat planı panosundan son odadaki kapı levhasına kadar "
         "kesintisiz bir yönlendirme zinciri kuruyor; levhaların yerini, renk kodunu ve yazısını buna göre belirliyoruz."),
        ("Keşif için hastaneye geliyor musunuz?",
         "Evet. Samsun ve Karadeniz'deki hastane ve sağlık kuruluşları için ücretsiz keşif yapıyoruz. Proje dosyanızı ya da fotoğrafları "
         "WhatsApp'tan (0507 960 50 49) gönderirseniz keşif günü teklif hazır olur."),
    ]
    sss_html = "".join(f"<details><summary>{e(s)}</summary><p>{e(c)}</p></details>" for s, c in sss)
    icerik = f"""<main class="ref-sayfa">
  <header class="ref-ust">
    {yol("Hastane tabelası ve yönlendirme")}
    <h1>Hastane tabelası ve yönlendirme sistemleri</h1>
    <p>Devlet ve özel hastaneler, tıp merkezleri ve sağlık kurumları için girişteki tabeladan son odadaki kapı levhasına kadar bütün işaretlemeyi Bafra'daki atölyemizde üretiyor, kendi ekibimizle monte ediyoruz.</p>
    <ul class="ref-sayilar">
      <li><strong>{len(hastaneler)}</strong>Hastane ve sağlık kurumu</li>
      <li><strong>1973</strong>Kuruluş</li>
      <li><strong>Karadeniz</strong>Keşif ve montaj</li>
    </ul>
  </header>
  <div class="kur-metin"><h2>Hastanelerde yaptığımız işler</h2></div>
  <div class="ref-isler kur-isler">{kartlar}</div>
  <div class="kur-metin">
    <ul class="madde">
      <li><strong>Dış cephe</strong> · giriş takı, ışıklı kutu harf, kompozit cephe, bina giydirme</li>
      <li><strong>Bahçe ve otopark</strong> · totem, yol ve otopark yönlendirme, acil servis yönlendirmesi</li>
      <li><strong>Bina içi</strong> · kat planı ve bina tanıtım panoları, duvar ve tavan yön levhaları (içeriği sonradan değiştirilebilen modüler sistem), poliklinik ve kapı levhaları</li>
      <li><strong>Zemin</strong> · renk kodlu yönlendirme şeritleri; hasta rengi takip ederek gideceği bölüme ulaşır</li>
      <li><strong>Erişilebilirlik</strong> · hissedilebilir yüzey, Braille kabartma levha, engelli WC ve otopark levhaları, merdiven uyarı bantları</li>
      <li><strong>Cam ve iç mekan</strong> · cam folyo ve kumlama, iç mekan ışıklı pano, acil çıkış ve iş güvenliği levhaları</li>
    </ul>
    <h2>Nasıl çalışıyoruz?</h2>
    <p>Yönlendirme projelerinde önce binayı yerinde geziyor, insan akışını izliyoruz. Levhayı nereye asacağınıza karar vermek, levhayı üretmekten daha önemlidir. Tasarım, üretim ve montaj tek elden yürür; arada aracı yoktur.</p>
    <h2>Çalıştığımız hastaneler</h2>
    <ul class="madde">{"".join(ref.isim_li(x) for x in ref.GRUPLAR[1][2])}</ul>
    <p>Kamu kurumları, AVM'ler ve markalar dahil tam liste: <a href="referanslar.html">Referanslarımız</a>.</p>
    <h2>Sık sorulan sorular</h2>
  </div>
  <div class="kur-sss">{sss_html}</div>
  {WA.format(metin="Hastaneniz için proje dosyanızı ya da fotoğrafları gönderin; keşif ve teklifle dönelim.", sayfa="hastane")}
</main>
"""
    sema = {"@context": "https://schema.org", "@graph": [
        {"@type": "Service", "@id": url + "#hizmet", "name": "Hastane tabelası ve yönlendirme sistemleri", "url": url,
         "serviceType": "Hastane tabela, yönlendirme ve erişilebilirlik ürünleri imalatı ve montajı", "description": aciklama,
         "provider": ref.isletme_ref(), "areaServed": [{"@type": "AdministrativeArea", "name": "Karadeniz Bölgesi"},
                                                        {"@type": "City", "name": "Samsun"}, {"@type": "City", "name": "Sinop"},
                                                        {"@type": "City", "name": "Ordu"}, {"@type": "City", "name": "Trabzon"}]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": s, "acceptedAnswer": {"@type": "Answer", "text": c}} for s, c in sss]},
        kirinti("Hastane tabelası ve yönlendirme", url)]}
    ref.sayfa_yaz(dosya, baslik, aciklama, sema, icerik, "Hastane tabelası ve yönlendirme", CSS_EK)
    print(dosya)


if __name__ == "__main__":
    g = ref.galeri_oku()
    hakkimizda(g)
    hastane(g)
