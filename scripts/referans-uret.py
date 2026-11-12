"""referanslar.html sayfasini uretir (Referanslarimiz: kurum ve marka listesi + secili isler).

Tek kaynak bu dosyadaki GRUPLAR ve ONE_CIKAN listeleri. Kurum adlari YAZI olarak sayfada durur ki
Google ve yapay zeka aramalari okuyabilsin (eski sitede yalniz resim icindeydi).
Kaynak: eski site uzmantabela.com "Referanslarimiz" logo gorselleri + galeri.json + site metinleri (12 Kas 2026).

Her grubun altinda o gruba ait galeri fotograflari (GRUP_FOTO); mobilde yana kaydirilir.
Sablon: index.html'in <head> stili, ust menusu, ortak iletisim blogu (ILETISIM) ve WhatsApp dugmesi.
Tekrar calistirilinca sayfayi bastan uretir. Kullanim: python scripts/referans-uret.py
"""
import io, os, re, json, html

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://samsuntabela.tr/"
URL = SITE + "referanslar.html"
BASLIK = "Referanslar: Hastane, Kamu, Marka Tabelaları | Uzman Reklam"
ACIKLAMA = ("1973'ten beri Bafra'daki atölyemizde ürettiğimiz tabelalar: Sağlık Bakanlığı, TOKİ, "
            "devlet hastaneleri, Medical Park, Liv Hospital, Piazza AVM ve onlarca marka.")
assert '"' not in ACIKLAMA and len(ACIKLAMA) <= 160

# (baslik, aciklama, [isimler]) — isim yaninda kisa is notu varsa "Ad — not"
GRUPLAR = [
    ("Kamu kurumları ve üniversiteler",
     "Resmi kurumların bina, birim ve yönlendirme tabelaları.",
     ["T.C. Sağlık Bakanlığı", "TOKİ (Toplu Konut İdaresi) — şantiye bilgi ve yönlendirme levhaları",
      "Devlet Opera ve Balesi Genel Müdürlüğü", "Sinop Üniversitesi",
      "Samsun Büyükşehir Belediyesi SASKİ — şantiye bilgi levhaları",
      "Fatsa Atatürk Parkı — özel tasarım totem", "Asarcık Spor Salonu — çatı kutu harf",
      "Atakum Olimpik Yüzme Havuzu — iç mekan panoları"]),
    ("Hastaneler ve sağlık kuruluşları",
     "Giriş takıları, ışıklı kutu harf, totem, poliklinik ve kat yönlendirmeleri, hissedilebilir zemin. Ayrıntı: hastane tabelası ve yönlendirme sayfamız.",
     ["Sinop Atatürk Devlet Hastanesi — ışıklı kutu harf", "Gerze Devlet Hastanesi — giriş takı, pilon ve kompozit cephe",
      "Boyabat 75. Yıl Devlet Hastanesi", "Bafra Ağız ve Diş Sağlığı Merkezi",
      "Medical Park (Atakum, Ordu, VM Medical Park) — bina giydirme, billboard, totem, yol yönlendirme, ışıklı ve krom harf",
      "Liv Hospital Samsun — paslanmaz kutu harf", "Medibafra Hastanesi — cephe giydirme, totem, resepsiyon yönlendirme",
      "Dünyagöz — ışıklı totem", "FBM Tıp Merkezi"]),
    ("AVM, holding ve kurumsal firmalar",
     "Büyük ölçekli cephe, çatı ve totem işleri.",
     ["Piazza AVM — dev totem ve cam folyo", "Metro Holding", "Yatırım Finansman — kompozit cephe",
      "İş Bankası Menkul Değerler — birim levhaları", "Güneş Sigorta", "Borsan Kablo", "Renaissance Construction",
      "Sarp Group", "Plan Yapı", "Borkonut", "Yaşamkent — krom harf", "Burger King — iç mekan duvar baskısı",
      "Entek Elektrik — ışıklı kutu harf", "ESPA Toz Boya — fabrika cephesi kutu harf",
      "Recepoğlu — kompozit cephe ve kutu harf", "Toros", "Gruma", "Akyürek İnşaat", "Yunus Yapı — fuar standı"]),
    ("Bayi ve mağaza tabelaları",
     "Marka kurumsal kimlik kılavuzuna birebir uygun, seri üretim bayi tabelaları.",
     ["Karaca / Karaca Home", "Pedo", "RodiMood", "Penti", "Baymak", "Husqvarna", "Stihl", "Ramsey", "Kip",
      "Festival Halı", "Sanat Halı", "Dilek Halı", "Gümüşsuyu Halı", "Modasen", "Decofree", "Daphne", "Peri",
      "Lovelet", "Bebito", "Mad Wolf", "Mobilya Kent", "Simpa", "Erpen", "Dekorraf", "Araz",
      "Tozlu.com ve M.B.T Tekstil", "BTM Mağazaları", "Jival Pırlanta — krom harf vitrin"]),
    ("Bafra ve Samsun'daki işletmeler",
     "Esnafın tabelası, vitrini ve aracı.",
     ["Turan Usta Pidesi — krom harf ve LED cephe", "Balkaymak", "Özlem Ballı Kaymak — satış standı",
      "Özlem Dondurma — fantazi ışıklı tabela", "Neva Restaurant", "Pınar Lokantası", "Bafra Bakliyat Pirinç",
      "Kardağ Karadeniz Gıda", "Ova Piliç Market", "Doğan Makina — krom harf", "Erdem Süzen Tarım — cephe tabelası",
      "Açı Eğitim Kurumları — cam giydirme", "Cömert Mobilya — araç giydirme", "Model Kuaför", "Ayıntap Grafik", "Sonkart"]),
]

# sayfadaki gosterim sirasi (GRUPLAR indeksleri): once hastaneler, sonra kamu (ChatGPT denetimi onerisi, 12 Kas 2026)
SIRA = [1, 0, 2, 3, 4]

# her grubun fotograflari (galeri.json dosya adlari; baslik ve alt yazi galeriden gelir), GRUPLAR ile ayni sirada
GRUP_FOTO = [
    ["toki-santiye-bilgi-yonlendirme-levhasi.webp", "saski-asfalt-calismasi-bilgi-levhasi.webp", "fatsa-ataturk-parki-modern-totem.webp",
     "asarcik-spor-salonu-cati-kutu-harf.webp", "olimpik-yuzme-havuzu-pano-tabela.webp"],
    ["sinop-devlet-hastanesi-isikli-kutu-harf.webp", "gerze-devlet-hastanesi-giris-takisi.webp", "liv-hospital-paslanmaz-kutu-harf.webp",
     "vm-medical-park-cocuk-isikli-harf.webp", "medical-park-atakum-bina-cephe-giydirme.webp", "medical-park-ordu-billboard-montaj.webp",
     "medical-park-billboard-reklam-panosu.webp", "medibafra-hastanesi-cephe-giydirme.webp", "medibafra-isikli-totem-tabela.webp",
     "medibafra-hastanesi-isikli-kutu-harf.webp", "medibafra-hastanesi-resepsiyon-yonlendirme.webp", "dunyagoz-isikli-totem-tabela.webp",
     "krom-harf-vm-fizik-tedavi.webp", "acil-giris-yonlendirme-totemi.webp", "hissedilebilir-zemin-hastane-danisma.webp",
     "yonlendirme-zemin-serit-hastane.webp", "yonlendirme-oda-kapi-levhasi.webp", "cam-folyo-hastane-kapi.webp", "hastane-ic-mekan-isikli-pano.webp"],
    ["piazza-avm-dev-totem-tabela.webp", "piazza-avm-cam-folyo-bilgilendirme.webp", "avm-cati-tabelasi-yuksek-irtifa-montaj.webp",
     "yatirim-finansman-kompozit-cephe.webp", "yonlendirme-is-bankasi-menkul-degerler.webp", "plan-yapi-isikli-kutu-harf.webp",
     "krom-harf-yasamkent.webp", "burger-king-ic-mekan-duvar-baskisi.webp", "entek-elektrik-isikli-kutu-harf.webp",
     "espa-toz-boya-kutu-harf-tabela-cephe.webp", "recepoglu-kompozit-cephe-kutu-harf.webp", "cam-giydirme-akyurek-insaat.webp", "yunus-yapi-fuar-standi.webp"],
    ["bayi-tabelasi-karaca-home.webp", "bayi-tabelasi-pedo.webp", "bayi-tabelasi-rodimood.webp", "bayi-tabelasi-husqvarna-stihl.webp",
     "ramsey-kip-magaza-cephe-giydirme.webp", "bayi-tabelasi-festival-hali.webp", "bayi-tabelasi-dilek-hali.webp", "bayi-tabelasi-gumussuyu.webp",
     "modasen-bina-giydirme.webp", "neon-efektli-tabela-daphne.webp", "tozlu-com-magaza-kutu-harf.webp", "btm-magazalari-isikli-pano-kutu-harf.webp",
     "krom-harf-jival-pirlanta.webp"],
    ["krom-harf-turan-usta-pidesi.webp", "erdem-suzen-tarim-cephe-tabelasi.webp", "ozlem-balli-kaymak-satis-standi.webp",
     "fantazi-tabela-ozlem-dondurma.webp", "neon-tabela-pinar-lokantasi.webp", "ova-pilic-market-pleksi-kutu-harf.webp",
     "krom-harf-dogan-makina.webp", "aci-okullari-cam-giydirme-folyo.webp", "comert-mobilya-arac-giydirme.webp",
     "vitrin-folyo-model-kuafor.webp"],
]

CSS = """
    <style>
        /* ===== REFERANSLAR (scripts/referans-uret.py) ===== */
        html body .ref-sayfa { max-width: 1100px; margin: 0 auto; padding: calc(var(--nav-h, 90px) + 40px) 20px 56px; color: #1d1d1f; }
        html body .ref-ust { max-width: 760px; margin: 0 0 40px; }
        html body .ref-ust .yol { font-size: 14px; color: #6e6e73; margin: 0 0 12px; }
        html body .ref-ust .yol a { color: #6e6e73; text-decoration: none; }
        html body .ref-ust h1 { font-size: clamp(2rem, 5vw, 2.8rem); font-weight: 800; letter-spacing: -.02em; line-height: 1.1; margin: 0 0 16px; color: #1d1d1f; text-transform: none; text-align: left; text-shadow: none; }
        html body .ref-ust p { font-size: 18px; line-height: 1.6; color: #3a3a3c; margin: 0; }
        html body .ref-sayilar { display: flex; flex-wrap: wrap; gap: 12px 40px; margin: 28px 0 0; padding: 0; list-style: none; }
        html body .ref-sayilar li { font-size: 15px; color: #6e6e73; }
        html body .ref-sayilar strong { display: block; font-size: 28px; font-weight: 800; color: #1d1d1f; letter-spacing: -.02em; }
        html body .ref-isler { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; margin: 0 0 24px; }
        html body .ref-isler figure { margin: 0; background: #f5f5f7; border-radius: 14px; overflow: hidden; }
        html body .ref-isler a { display: block; color: inherit; text-decoration: none; }
        html body .ref-isler img { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; display: block; }
        html body .ref-isler figcaption { padding: 12px 14px 14px; font-size: 15px; line-height: 1.35; }
        html body .ref-isler figcaption strong { display: block; color: #1d1d1f; font-weight: 700; }
        html body .ref-isler figcaption span { color: #6e6e73; font-size: 14px; }
        html body .ref-grup { border-top: 1px solid #e5e5ea; padding: 40px 0 32px; }
        html body .ref-grup .ust { margin: 0 0 18px; max-width: 700px; }
        html body .ref-grup .ust .adet { color: #6e6e73; font-weight: 400; }
        html body .ref-grup h2 { font-size: 1.3rem; font-weight: 700; color: #1d1d1f; margin: 0 0 8px; text-transform: none; letter-spacing: -.01em; border: 0; padding: 0; text-align: left; }
        html body .ref-grup .not { font-size: 15px; line-height: 1.5; color: #6e6e73; margin: 0; }
        html body .ref-grup ul { list-style: none; margin: 0; padding: 0; columns: 3; column-gap: 32px; }
        html body .ref-grup li { break-inside: avoid; padding: 7px 0; font-size: 16px; line-height: 1.4; color: #1d1d1f; border-bottom: 1px solid #f0f0f2; }
        html body .ref-grup li small { color: #6e6e73; font-size: 14px; }
        html body .ref-alt { margin: 40px 0 0; padding: 28px; background: #f5f5f7; border-radius: 14px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
        html body .ref-alt p { margin: 0; font-size: 17px; color: #1d1d1f; max-width: 620px; line-height: 1.5; }
        html body .ref-alt a.wa { display: inline-flex; align-items: center; gap: 9px; height: 46px; padding: 0 22px; border-radius: 999px; background: #ccff00; color: #000; font-weight: 600; text-decoration: none; }
        html body .ref-dipnot { font-size: 13px; color: #8e8e93; margin: 20px 0 0; }
        @media (max-width: 768px) {
            html body .ref-sayfa { padding-top: calc(var(--nav-h, 70px) + 24px); }
            html body .ref-ust p { font-size: 16px; }
            html body .ref-isler { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 10px; margin: 0 -20px 20px; padding: 0 20px 4px; scrollbar-width: none; }
            html body .ref-isler::-webkit-scrollbar { display: none; }
            html body .ref-isler figure { flex: 0 0 72%; scroll-snap-align: start; }
            html body .ref-isler figcaption { padding: 10px; font-size: 14px; }
            html body .ref-isler figcaption span { font-size: 13px; }
            html body .ref-grup { padding: 32px 0 24px; }
            html body .ref-grup ul { columns: 1; }
        }
    </style>"""


def e(t):
    return html.escape(t, quote=False)


def isim_li(s):
    if " — " in s:
        ad, not_ = s.split(" — ", 1)
        return f"<li>{e(ad)} <small>· {e(not_)}</small></li>"
    return f"<li>{e(s)}</li>"


def sayfa_yaz(dosya, baslik, aciklama, sema, icerik, kisa_baslik, css_ek="", ust_gorsel=True):
    """index.html sablonuyla (head stili, menu, iletisim blogu, WhatsApp) bir alt sayfa yazar.
    Diger uretec scriptleri de kullanir (scripts/kurumsal-sayfalar.py)."""
    assert '"' not in aciklama and len(aciklama) <= 160 and len(baslik) <= 60, (baslik, len(aciklama))
    url = SITE + dosya
    # mobil hiz: ilk ekrandaki iki gorsel tembel yuklenmesin (Lighthouse LCP ogesi bunlar)
    if ust_gorsel:
        icerik = icerik.replace(' loading="lazy" decoding="async"', ' decoding="async" fetchpriority="high"', 1)
        icerik = icerik.replace(' loading="lazy" decoding="async"', ' decoding="async"', 1)
    # Kalan gorseller: tarayicinin yerlesik "lazy"si yana kaydirilan seritlerdeki gorselleri de hemen indiriyor
    # (mobilde ilk boyamayi geciktiriyordu). data-src + IntersectionObserver ile ekrana yaklasinca iner;
    # <noscript> kopyasi JS calistirmayan tarayici ve botlar icin.
    def _ertele(m):
        tam = m.group(0)
        return (tam.replace(' src="', ' src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" data-src="', 1)
                + "<noscript>" + tam + "</noscript>")
    icerik = re.sub(r'<img src="galeri/k/[^"]+"[^>]*loading="lazy"[^>]*>', _ertele, icerik)
    icerik += """<script>
(function () {
  var g = document.querySelectorAll('img[data-src]');
  if (!('IntersectionObserver' in window)) { g.forEach(function (i) { i.src = i.dataset.src; }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.src = e.target.dataset.src; e.target.removeAttribute('data-src'); io.unobserve(e.target); } });
  }, { rootMargin: '300px 300px' });
  g.forEach(function (i) { io.observe(i); });
})();
</script>
"""
    idx = io.open(os.path.join(KOK, "index.html"), encoding="utf-8").read()
    head = idx[: idx.index("</head>")]
    head = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", head, flags=re.S)
    head = re.sub(r'\s*<!-- ISLETME-SEMA:BASLA.*?ISLETME-SEMA:BITIR -->', "", head, flags=re.S)
    head = re.sub(r"<title>.*?</title>", f"<title>{e(baslik)}</title>", head, count=1)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{aciklama}">', head, count=1)
    head = re.sub(r'\s*<meta name="keywords"[^>]*>', "", head, count=1)
    head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', head, count=1)
    head = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{url}">', head, count=1)
    for k in ("og:title", "twitter:title"):
        attr = "property" if k.startswith("og") else "name"
        head = re.sub(rf'<meta {attr}="{k}" content="[^"]*">', f'<meta {attr}="{k}" content="{kisa_baslik} | Uzman Reklam">', head, count=1)
    for k in ("og:description", "twitter:description"):
        attr = "property" if k.startswith("og") else "name"
        head = re.sub(rf'<meta {attr}="{k}" content="[^"]*">', f'<meta {attr}="{k}" content="{aciklama}">', head, count=1)
    head = re.sub(r'\s*<link rel="preload" as="image" href="hero-[^"]*"[^>]*>', "", head)
    head += ("\n    <script type=\"application/ld+json\">\n" + json.dumps(sema, ensure_ascii=False, indent=2) + "\n    </script>\n" + CSS + css_ek + "\n")
    b0 = idx.index("<nav>"); b1 = idx.index('<section class="hero">')
    menu = idx[b0:b1].replace('href="#', 'href="/#')
    i0 = idx.index("<!-- ILETISIM:BASLA"); i1 = idx.index("<!-- ILETISIM:BITIR -->") + len("<!-- ILETISIM:BITIR -->")
    iletisim = idx[i0:i1]
    alt = ('<div class="footer-bottom"><p>© 2026 Uzman Reklam. Tüm Hakları Saklıdır.</p><div class="footer-bottom-links">'
           '<a href="/">Ana sayfa</a><a href="hakkimizda.html">Hakkımızda</a><a href="referanslar.html">Referanslar</a><a href="baski.html">Dijital baskı</a>'
           '<a href="https://www.instagram.com/uzman.reklamm/" target="_blank" rel="noopener">Instagram</a></div></div>')
    js = """<script>
    function toggleMobileMenu() {
        document.getElementById('mobileMenu').classList.toggle('open');
        document.querySelector('.hamburger').classList.toggle('active');
    }
    function navYuksekligiOlc() {
        var n = document.querySelector('nav');
        if (n) document.documentElement.style.setProperty('--nav-h', n.offsetHeight + 'px');
    }
    navYuksekligiOlc();
    window.addEventListener('resize', navYuksekligiOlc);
</script>"""
    w0 = idx.index('<div class="wp-float">'); w1 = idx.index("</div>", w0) + len("</div>")
    sayfa = f"{head}</head>\n<body>\n\n{menu}{icerik}\n{iletisim}\n{alt}\n\n{js}\n\n{idx[w0:w1]}\n\n</body>\n</html>\n"
    io.open(os.path.join(KOK, dosya), "w", encoding="utf-8", newline="\n").write(sayfa)


def galeri_oku():
    return {f["dosya"]: f for f in json.load(io.open(os.path.join(KOK, "galeri.json"), encoding="utf-8"))["fotolar"]}


def kart(galeri, dosya):
    g = galeri.get(dosya)
    if not g:
        raise SystemExit(f"galeride yok: {dosya}")
    return (f'<figure><img src="galeri/k/{dosya}" alt="{html.escape(g["alt"])}" '
            f'width="640" height="480" loading="lazy" decoding="async"><figcaption><strong>{e(g["baslik"])}</strong>'
            f'<span>{e(g["altyazi"])}</span></figcaption></figure>')


def isletme_ref():
    return {"@id": SITE + "#isletme", "@type": "LocalBusiness", "name": "Uzman Reklam", "url": SITE, "telephone": "+905322204649",
            "foundingDate": "1973",
            "address": {"@type": "PostalAddress", "streetAddress": "Emirefendi Mh. Çizmeli 2. Sk. No:33",
                        "addressLocality": "Bafra", "addressRegion": "Samsun", "postalCode": "55400", "addressCountry": "TR"}}


def main():
    galeri = galeri_oku()
    tum = [ad.split(" — ")[0] for _, _, liste in GRUPLAR for ad in liste]
    sema = {
        "@context": "https://schema.org",
        "@graph": [
            {"@type": "CollectionPage", "@id": URL, "url": URL, "name": "Referanslarımız", "description": ACIKLAMA,
             "inLanguage": "tr", "isPartOf": {"@id": SITE + "#site", "@type": "WebSite", "name": "Uzman Reklam", "url": SITE},
             "about": isletme_ref(),
             "mainEntity": {"@type": "ItemList", "name": "Tabela yaptığımız kurum ve markalar", "numberOfItems": len(tum),
                            "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": ad} for i, ad in enumerate(tum)]}},
            {"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Ana sayfa", "item": SITE},
                {"@type": "ListItem", "position": 2, "name": "Referanslarımız", "item": URL}]},
        ],
    }
    assert len(GRUP_FOTO) == len(GRUPLAR)
    foto_say = sum(len(x) for x in GRUP_FOTO)
    gruplar = "\n".join(
        f'<section class="ref-grup" aria-labelledby="g{i}"><div class="ust"><h2 id="g{i}">{e(b)} <span class="adet" aria-hidden="true">· {len(liste)}</span></h2><p class="not">{e(n)}</p></div>'
        f'<div class="ref-isler">{"".join(kart(galeri, d) for d in GRUP_FOTO[i])}</div>'
        f'<ul>{"".join(isim_li(x) for x in liste)}</ul></section>'
        for i, (b, n, liste) in ((k, GRUPLAR[k]) for k in SIRA))
    hastane = len(GRUPLAR[1][2])
    icerik = f"""<main class="ref-sayfa">
  <header class="ref-ust">
    <p class="yol"><a href="/">Ana sayfa</a> › Referanslarımız</p>
    <h1>Referanslarımız</h1>
    <p>1973'te Remzi Toraman'ın kurduğu, bugün ikinci kuşaktan Abdurrahman Toraman'ın yönettiği Bafra'daki atölyemizde üretip kendi ekibimizle monte ettiğimiz işlerden, tabela yaptığımız kurum ve markaların bir kısmı: devlet ve özel hastaneler, kamu kurumları, AVM'ler, ulusal markaların bayileri ve Karadeniz'in esnafı.</p>
    <ul class="ref-sayilar">
      <li><strong>1973</strong>Kuruluş, Bafra</li>
      <li><strong>{len(tum)}+</strong>Kurum ve marka</li>
      <li><strong>{hastane}</strong>Hastane ve sağlık kurumu</li>
      <li><strong>{len(galeri)}</strong>İş fotoğrafı</li>
    </ul>
  </header>


{gruplar}

  <div class="ref-alt">
    <p>Kurumunuz ya da markanız için tabela, totem, yönlendirme veya bayi tabelası mı gerekiyor? Proje dosyanızı ya da fotoğrafı gönderin, keşif ve teklifle dönelim.</p>
    <a class="wa" href="https://wa.me/905079605049" target="_blank" rel="noopener" onclick="gtag('event','whatsapp_tiklama',{{'sayfa':'referanslar'}});"><i class="fab fa-whatsapp" aria-hidden="true"></i>WhatsApp'tan yazın</a>
  </div>
  <p class="ref-dipnot">Adı geçen kurum ve marka adları ile logolar sahiplerine aittir; yalnızca yaptığımız işleri belirtmek için kullanılmıştır. Fotoğrafların tamamı: <a href="/#projeler">ana sayfa galerisi</a>.</p>
</main>
"""
    sayfa_yaz("referanslar.html", BASLIK, ACIKLAMA, sema, icerik, "Referanslarımız")
    print("referanslar.html:", len(tum), "kurum/marka,", foto_say, "foto")


if __name__ == "__main__":
    main()
