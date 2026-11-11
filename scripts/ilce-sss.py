"""Ilce sayfalarina kisa "Sik sorulan sorular" bolumu + FAQPage semasi ekler (Google ve yapay zeka aramalari icin).

- Bolum, "merkez-bag" bolumunun hemen ustune <!-- SSS:BASLA --> ... <!-- SSS:BITIR --> arasina konur.
- Ayni metin <head> icine FAQPage JSON-LD olarak <!-- SSS-SEMA:BASLA --> ... <!-- SSS-SEMA:BITIR --> arasina yazilir
  (Google, semadaki metnin sayfada gorunmesini ister; ikisi ayni kaynaktan uretilir).
- Yalniz sitede zaten yazan bilgiler kullanilir (fiyat etkenleri, 5-7 is gunu, kendi atolye + kendi montaj ekibi, ucretsiz kesif).
- Stil, sema ile ayni isaretler arasinda kendi <style> etiketindedir (diger scriptlerin bloklarina karismaz).
- Tekrar calistirilinca isaretler arasini yeniler (idempotent).
"""
import io, os, re, json, html

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAS, BIT = "<!-- SSS:BASLA (scripts/ilce-sss.py) -->", "<!-- SSS:BITIR -->"
SBAS, SBIT = "<!-- SSS-SEMA:BASLA (scripts/ilce-sss.py) -->", "<!-- SSS-SEMA:BITIR -->"
CSS_ISARET = "/* ===== SSS (scripts/ilce-sss.py) ===== */"

# dosya: (ad, -da/-de, -a/-e, ilceler)
ILLER = {
    "samsun-reklamci-ve-tabelaci.html": ("Samsun", "Samsun'da", "Samsun'a", "Atakum, İlkadım, Canik, Çarşamba"),
    "atakum-reklamci-ve-tabelaci.html": ("Atakum", "Atakum'da", "Atakum'a", "Körfez, Atakent, Denizevleri, Güzelyalı"),
    "bafra-reklamci-ve-tabelaci.html": ("Bafra", "Bafra'da", "Bafra'ya", "Bafra merkez ve köyleri"),
    "ordu-reklamci-ve-tabelaci.html": ("Ordu", "Ordu'da", "Ordu'ya", "Altınordu, Fatsa, Ünye"),
    "sinop-reklamci-ve-tabelaci.html": ("Sinop", "Sinop'ta", "Sinop'a", "Sinop merkez, Gerze, Boyabat, Ayancık"),
    "trabzon-reklamci-ve-tabelaci.html": ("Trabzon", "Trabzon'da", "Trabzon'a", "Ortahisar, Akçaabat, Yomra, Of"),
}


CSS = f"""
        {CSS_ISARET}
        html body .sss-bolum {{ background: #ffffff; padding: 64px 20px; border-top: 1px solid #e5e5ea; }}
        html body .sss-ic {{ max-width: 760px; margin: 0 auto; }}
        html body .sss-bolum h2 {{ color: #1d1d1f; font-size: 1.6rem; font-weight: 800; letter-spacing: -.01em; margin: 0 0 20px; text-transform: none; border: 0; padding: 0; text-align: left; }}
        html body .sss-madde {{ border-bottom: 1px solid #e5e5ea; }}
        html body .sss-madde summary {{ list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 18px 0; color: #1d1d1f; font-weight: 600; font-size: 17px; line-height: 1.4; }}
        html body .sss-madde summary::-webkit-details-marker {{ display: none; }}
        html body .sss-madde summary::after {{ content: "+"; color: #6e6e73; font-weight: 400; font-size: 22px; line-height: 1; flex: 0 0 auto; transition: transform .2s; }}
        html body .sss-madde[open] summary::after {{ transform: rotate(45deg); }}
        html body .sss-madde p {{ color: #3a3a3c; font-size: 16px; line-height: 1.65; margin: 0 0 18px; max-width: 65ch; }}
        @media (max-width: 768px) {{ html body .sss-bolum {{ padding: 44px 20px; }} html body .sss-bolum h2 {{ font-size: 1.35rem; }} html body .sss-madde summary {{ font-size: 16px; }} }}
    </style>"""


def sorular(ad, de, a, ilceler):
    if ad == "Bafra":
        montaj = ("Atölyemiz Bafra'da mı?",
                  "Evet. Fabrikamız ve atölyemiz Bafra Merkez'de, Emirefendi Mahallesi Çizmeli 2. Sokak No:33'te. "
                  "Tabelayı burada kendimiz üretiyor, montajını da kendi ekibimizle yapıyoruz; arada aracı yok.")
    else:
        montaj = (f"{ad} için tabelayı kim üretiyor, montajı kim yapıyor?",
                  f"Tabelanın tamamı Bafra'daki kendi atölyemizde üretilir. Montajı da kendi ekibimiz {de} yerinde yapar; "
                  f"{ilceler} dahil {ad} geneline hizmet veriyoruz. Arada aracı firma yok.")
    return [
        (f"{de} tabela fiyatı neye göre değişir?",
         "Fiyat; malzemeye, harf ve tabela ölçüsüne, ışıklı ya da ışıksız olmasına göre değişir. Işıklı kutu harf ile ışıksız pano "
         "arasında ciddi fark vardır. En doğru fiyat için cephenizin fotoğrafını ve yaklaşık ölçüsünü WhatsApp'tan 0507 960 50 49'a gönderin."),
        montaj,
        (f"{a} keşif için geliyor musunuz?",
         f"Evet, {ad} için ücretsiz keşif yapıyoruz. Önce WhatsApp'tan fotoğraf ve ölçü gönderirseniz keşif günü teklif hazır olur."),
        ("Tabela kaç günde teslim edilir?",
         "Standart tabelalarda 5-7 iş günü sürer. Totem, cephe giydirme gibi büyük projelerde süre işin büyüklüğüne göre planlanır."),
        ("Hangi tabela çeşitlerini yapıyorsunuz?",
         "Işıklı kutu harf, krom harf, totem, ışıklı pano, bayi tabelaları, yönlendirme levhaları, cephe giydirme, "
         "araç giydirme, cam yazısı ve dijital baskı."),
    ]


def bolum(ad, liste):
    maddeler = "\n".join(
        f'    <details class="sss-madde"><summary>{html.escape(s, quote=False)}</summary><p>{html.escape(c, quote=False)}</p></details>'
        for s, c in liste)
    return f"""{BAS}
<section class="sss-bolum" id="sss" aria-labelledby="sss-baslik">
  <div class="sss-ic">
    <h2 id="sss-baslik">{ad} tabela: sık sorulan sorular</h2>
{maddeler}
  </div>
</section>
{BIT}
"""


def sema(liste):
    veri = {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": s, "acceptedAnswer": {"@type": "Answer", "text": c}} for s, c in liste]}
    return (f'{SBAS}\n    <script type="application/ld+json">\n{json.dumps(veri, ensure_ascii=False, indent=2)}\n    </script>\n'
            f'    <style>{CSS}\n    {SBIT}')



def isle(dosya, bilgi):
    yol = os.path.join(KOK, dosya)
    s = io.open(yol, encoding="utf-8").read()
    liste = sorular(*bilgi)
    # gorunen bolum
    if BAS in s:
        i = s.index(BAS); j = s.index(BIT, i) + len(BIT) + 1
        s = s[:i] + bolum(bilgi[0], liste) + s[j:]
    else:
        i = s.index('<section class="seo-content-section" id="merkez-bag">')
        s = s[:i] + bolum(bilgi[0], liste) + "\n" + s[i:]
    # sema
    if SBAS in s:
        i = s.index(SBAS); j = s.index(SBIT, i) + len(SBIT)
        s = s[:i] + sema(liste) + s[j:]
    else:
        i = s.index("</head>")
        s = s[:i] + "    " + sema(liste) + "\n" + s[i:]
    io.open(yol, "w", encoding="utf-8", newline="").write(s)


if __name__ == "__main__":
    for d, b in ILLER.items():
        isle(d, b); print("ok", d)
