"""Isletme kimligi (schema.org) tek kaynaktan: ana sayfa LocalBusiness + ilce sayfalari ve baski.html icin Service.

Neden: Google'da ve yapay zekalarda ayni adli baska firmalarla (Ilkadim, Ordu) karismamak icin her sayfa ayni
isletmeye (@id https://samsuntabela.tr/#isletme) baglanir. Ad, adres, telefon, saat, koordinat Google Isletme
Profili ile ayni tutulur (12 Kas 2026: "Uzman Reklam Tabela", Pzt-Cuma 09-19, Cmt 09-15, Pazar kapali).
Bilgi degisirse BURADA degistir, sonra calistir:  python scripts/isletme-sema.py   (tekrar calistirmak guvenli)
Isaretler: <!-- ISLETME-SEMA:BASLA --> ... <!-- ISLETME-SEMA:BITIR -->
"""
import io, os, re, json

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://samsuntabela.tr/"
ID = SITE + "#isletme"
BAS, BIT = "<!-- ISLETME-SEMA:BASLA (scripts/isletme-sema.py) -->", "<!-- ISLETME-SEMA:BITIR -->"

ISLETME = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": ID,
    "name": "Uzman Reklam",
    "alternateName": ["Uzman Reklam Tabela", "Uzman Reklam ve Tabela", "Uzman Tabela"],
    "description": "1973'ten beri Bafra'daki kendi atölyesinde kutu harf, krom harf, totem, cephe giydirme, yönlendirme, bayi tabelası, araç giydirme ve dijital baskı üreten, Samsun ve Karadeniz geneline kendi ekibiyle monte eden tabela imalatçısı.",
    "url": SITE,
    "logo": SITE + "web-app-manifest-512x512.png",
    "image": {"@type": "ImageObject", "url": SITE + "og-kapak.jpg", "width": 1200, "height": 630},
    "telephone": "+905322204649",
    "email": "uzmandosya@hotmail.com",
    "foundingDate": "1973",
    "founder": {"@type": "Person", "name": "Remzi Toraman"},
    "employee": {"@type": "Person", "name": "Abdurrahman Toraman", "jobTitle": "Firma sahibi"},
    "address": {"@type": "PostalAddress", "streetAddress": "Emirefendi Mh. Çizmeli 2. Sk. No:33", "addressLocality": "Bafra",
                "addressRegion": "Samsun", "postalCode": "55400", "addressCountry": "TR"},
    "geo": {"@type": "GeoCoordinates", "latitude": 41.557627, "longitude": 35.913343},
    "hasMap": "https://www.google.com/maps?cid=13802073426054192221",
    "openingHoursSpecification": [
        {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "09:00", "closes": "19:00"},
        {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "15:00"},
    ],
    "areaServed": [{"@type": "City", "name": n} for n in ("Samsun", "Bafra", "Atakum", "İlkadım", "Canik", "Çarşamba", "Sinop", "Ordu", "Trabzon")]
                  + [{"@type": "AdministrativeArea", "name": "Karadeniz Bölgesi"}],
    "sameAs": ["https://www.instagram.com/uzman.reklamm/", "https://www.google.com/maps?cid=13802073426054192221"],
    "priceRange": "$$",
    "contactPoint": [
        {"@type": "ContactPoint", "contactType": "customer service", "telephone": "+905322204649", "availableLanguage": "Turkish"},
        {"@type": "ContactPoint", "contactType": "sales", "telephone": "+905079605049", "description": "WhatsApp: fotoğraf, ölçü ve teklif", "availableLanguage": "Turkish"},
    ],
    "knowsAbout": ["Kutu harf tabela", "Krom harf tabela", "Totem tabela", "Kompozit cephe giydirme", "Hastane yönlendirme sistemleri",
                   "Bayi tabelaları", "Araç giydirme", "Dijital baskı", "CNC ve lazer kesim", "Hissedilebilir yüzey ve Braille levha"],
    "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Tabela Hizmetleri", "itemListElement": [
        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n}} for n in (
            "Kutu Harf Tabela", "Krom Harf Tabela", "Totem Tabela", "Bayi Tabelaları", "Yönlendirme Sistemleri", "Cephe Giydirme",
            "Araç Giydirme", "Işıklı Pano Tabela", "Dijital Baskı ve Branda", "Cam Yazısı ve Folyo Uygulamaları", "CNC ve Lazer Kesim",
            "Fuar Standı ve İç Mekan Reklam", "Görme Engelli Ürünleri ve Hissedilebilir Zemin")]},
}

ILCE = {  # dosya: (il/ilce adi, hizmet adi)
    "samsun-reklamci-ve-tabelaci.html": ("Samsun", "Samsun tabela ve reklam hizmetleri"),
    "atakum-reklamci-ve-tabelaci.html": ("Atakum", "Atakum tabela ve reklam hizmetleri"),
    "bafra-reklamci-ve-tabelaci.html": ("Bafra", "Bafra tabela ve reklam hizmetleri"),
    "sinop-reklamci-ve-tabelaci.html": ("Sinop", "Sinop tabela ve reklam hizmetleri"),
    "ordu-reklamci-ve-tabelaci.html": ("Ordu", "Ordu tabela ve reklam hizmetleri"),
    "trabzon-reklamci-ve-tabelaci.html": ("Trabzon", "Trabzon tabela ve reklam hizmetleri"),
}


def blok(veri):
    return f'{BAS}\n    <script type="application/ld+json">\n{json.dumps(veri, ensure_ascii=False, indent=2)}\n    </script>\n    {BIT}'


def hizmet(ad, url, alan, aciklama=None):
    v = {"@context": "https://schema.org", "@type": "Service", "name": ad, "url": url,
         "provider": {"@id": ID, "@type": "LocalBusiness", "name": "Uzman Reklam", "telephone": "+905322204649"},
         "areaServed": {"@type": "City", "name": alan} if alan else {"@type": "Country", "name": "Türkiye"},
         "serviceType": "Tabela imalatı ve montajı"}
    if aciklama:
        v["description"] = aciklama
    return v


def yerlestir(dosya, veri, eski_desen):
    yol = os.path.join(KOK, dosya)
    s = io.open(yol, encoding="utf-8").read()
    if BAS in s:
        i = s.index(BAS); j = s.index(BIT, i) + len(BIT)
        s = s[:i] + blok(veri) + s[j:]
    else:
        m = re.search(eski_desen, s, re.S)
        if not m:
            raise SystemExit(f"{dosya}: eski sema bulunamadi")
        s = s[:m.start()] + blok(veri) + s[m.end():]
    io.open(yol, "w", encoding="utf-8", newline="").write(s)
    print("ok", dosya)


if __name__ == "__main__":
    yerlestir("index.html", ISLETME, r'<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@type": "LocalBusiness",.*?</script>')
    for d, (alan, ad) in ILCE.items():
        yerlestir(d, hizmet(ad, SITE + d, alan), r'<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@type": "LocalBusiness",.*?</script>')
    yerlestir("baski.html", hizmet("Fason dijital baskı", SITE + "baski.html", None,
                                   "Türkiye geneline kargo ile folyo, vinil, mesh, canvas, one-way vision baskı ve maketler."),
              r'<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@type": "LocalBusiness",.*?</script>')
