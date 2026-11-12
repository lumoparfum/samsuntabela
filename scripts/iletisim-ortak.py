"""Iletisim bolumunu (fabrika, kurumsal bilgiler, banka, Toraman Matbaa, hizmet agi) 7 sayfada TEK ve AYNI hale getirir.

- index.html ve 6 ilce sayfasinda <section class="footer-grid" id="iletisim"> ... + "hizmet agi" seridi
  <!-- ILETISIM:BASLA --> ... <!-- ILETISIM:BITIR --> arasina alinir ve asagidaki ortak HTML ile degistirilir.
- Ortak stil <style> sonuna "ILETISIM ORTAK" blogu olarak eklenir (iOS olcusu: beyaz zemin, notr gri, kutu yok).
- Tekrar calistirilinca isaretler arasini yeniler (idempotent).
Icerik (adres, telefon, VKN, IBAN, Toraman Matbaa) degistirilecekse BURADA degistir, sonra calistir.
"""
import io, os, re, glob

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAS, BIT = "<!-- ILETISIM:BASLA (scripts/iletisim-ortak.py) -->", "<!-- ILETISIM:BITIR -->"
CSS_ISARET = "/* ===== ILETISIM ORTAK (scripts/iletisim-ortak.py) ===== */"
HARITA = "https://maps.google.com/maps?q=Uzman%20Reklam%20Bafra&t=&z=15&ie=UTF8&iwloc=&output=embed"
TARIF = "https://www.google.com/maps/dir//Uzman+Reklam,+Emirefendi,+%C3%87izmeli+2.+Sk.+No:33,+55400+Bafra%2FSamsun/"
ILLER = [("samsun-reklamci-ve-tabelaci.html", "Samsun"), ("bafra-reklamci-ve-tabelaci.html", "Bafra"),
         ("atakum-reklamci-ve-tabelaci.html", "Atakum"), ("ordu-reklamci-ve-tabelaci.html", "Ordu"),
         ("sinop-reklamci-ve-tabelaci.html", "Sinop"), ("trabzon-reklamci-ve-tabelaci.html", "Trabzon")]

HTML = f"""{BAS}
<section class="footer-grid iletisim-ortak" id="iletisim">
  <div class="footer-box">
    <h3>Fabrika &amp; Atölye</h3>
    <ul class="contact-info-list">
      <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><div><strong>Bafra Merkez</strong><span>Emirefendi Mh. Çizmeli 2.Sk. No:33, Bafra / Samsun</span></div></li>
      <li><i class="fas fa-phone-alt" aria-hidden="true"></i><div><strong>Telefon</strong><a href="tel:+905322204649" onclick="gtag('event','telefon_tiklama',{{'sayfa':'footer'}});">0532 220 46 49</a></div></li>
      <li><i class="fab fa-whatsapp" aria-hidden="true"></i><div><strong>WhatsApp</strong><a href="https://wa.me/905079605049" target="_blank" rel="noopener" onclick="gtag('event','whatsapp_tiklama',{{'sayfa':'footer'}});">0507 960 50 49</a></div></li>
      <li><i class="fas fa-envelope" aria-hidden="true"></i><div><strong>E-posta</strong><a href="mailto:uzmandosya@hotmail.com">uzmandosya@hotmail.com</a><a href="mailto:rmtoraman@icloud.com">rmtoraman@icloud.com</a></div></li>
    </ul>
    <div class="map-container"><iframe title="Uzman Reklam Bafra konumu" src="{HARITA}" loading="lazy" allowfullscreen=""></iframe></div>
    <a class="yol-tarifi" href="{TARIF}" target="_blank" rel="noopener">Yol tarifi al</a>
  </div>
  <div class="footer-box">
    <h3>Kurumsal Bilgiler</h3>
    <dl class="kunye">
      <div><dt>Firma sahibi</dt><dd>Abdurrahman Toraman</dd></div>
      <div><dt>Vergi dairesi</dt><dd>Bafra V.D.</dd></div>
      <div><dt>Vergi no</dt><dd class="rakam">8560266150</dd></div>
      <div><dt>Banka</dt><dd>Garanti Bankası · Şube 520</dd></div>
      <div><dt>Hesap no</dt><dd class="rakam">6297473</dd></div>
      <div><dt>IBAN</dt><dd class="rakam">TR12 0006 2000 5200 0006 2974 73</dd></div>
    </dl>
    <a class="yol-tarifi ref-link" href="referanslar.html">Referanslarımız</a>
    <h3 class="ikinci">Toraman Matbaa · İstanbul</h3>
    <ul class="contact-info-list">
      <li><i class="fas fa-map-marker-alt" aria-hidden="true"></i><div><span>Topkapı 2. Matbaacılar Sitesi 5. Kat E Blok 3NE19, Topkapı / İstanbul</span></div></li>
      <li><i class="fas fa-phone-alt" aria-hidden="true"></i><div><a href="tel:4445340">444 5 340</a></div></li>
      <li><i class="fas fa-globe" aria-hidden="true"></i><div><a href="https://toramanmatbaa.com" target="_blank" rel="noopener">toramanmatbaa.com</a></div></li>
    </ul>
  </div>
</section>
<div class="hizmet-agi" role="navigation" aria-label="Hizmet ağımız"><span>Hizmet ağımız</span>{''.join(f'<a href="{h}">{a}</a>' for h, a in ILLER)}</div>
{BIT}"""

CSS = f"""
        {CSS_ISARET}
        html body #iletisim.iletisim-ortak {{ background: #ffffff !important; border-top: 1px solid #e5e5ea !important; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; max-width: 1200px; margin: 0 auto; padding: 72px 40px 64px; }}
        html body #iletisim .footer-box {{ background: none !important; border: 0 !important; padding: 0 !important; box-shadow: none !important; text-align: left !important; }}
        html body #iletisim h3 {{ color: #1d1d1f !important; font-size: 1.25rem !important; font-weight: 700 !important; text-transform: none !important; letter-spacing: -.01em; margin: 0 0 16px !important; }}
        html body #iletisim h3.ikinci {{ margin-top: 40px !important; font-size: 1.05rem !important; }}
        html body #iletisim .contact-info-list {{ list-style: none; padding: 0; margin: 0; }}
        html body #iletisim .contact-info-list li {{ display: flex; align-items: flex-start; gap: 14px; padding: 14px 0 !important; border-bottom: 1px solid #e5e5ea !important; color: #1d1d1f !important; font-size: 16px !important; line-height: 1.45; }}
        html body #iletisim .contact-info-list li:last-child {{ border-bottom: 0 !important; }}
        html body #iletisim .contact-info-list i {{ color: #6e6e73 !important; width: 18px; text-align: center; margin-top: 3px; font-size: 15px; }}
        html body #iletisim .contact-info-list li div {{ display: flex; flex-direction: column; gap: 2px; color: #1d1d1f !important; }}
        html body #iletisim .contact-info-list strong {{ font-weight: 600; font-size: 13px; color: #6e6e73 !important; }}
        html body #iletisim .contact-info-list a {{ color: #1d1d1f !important; text-decoration: none; border: 0 !important; }}
        html body #iletisim .contact-info-list a[href^="tel:"], html body #iletisim .contact-info-list a[href^="https://wa.me"] {{ font-weight: 600; font-variant-numeric: tabular-nums; }}
        html body #iletisim .contact-info-list a:hover {{ color: #4f6b00 !important; }}
        html body #iletisim .map-container {{ margin-top: 20px; height: 240px; border-radius: 14px; overflow: hidden; border: 1px solid #e5e5ea !important; background: #f5f5f7; }}
        html body #iletisim .map-container iframe {{ width: 100%; height: 100%; border: 0; display: block; }}
        html body #iletisim .yol-tarifi {{ display: inline-flex; align-items: center; height: 44px; padding: 0 20px; margin-top: 16px; border-radius: 999px; border: 1px solid #d2d2d7; color: #1d1d1f; font-weight: 600; font-size: 15px; text-decoration: none; transition: background .15s; }}
        html body #iletisim .yol-tarifi::after {{ content: " ›"; margin-left: 4px; }}
        html body #iletisim .yol-tarifi:hover {{ background: #f5f5f7; }}
        html body #iletisim .ref-link {{ margin-top: 20px; }}
        html body #iletisim dl.kunye {{ margin: 0; }}
        html body #iletisim dl.kunye div {{ display: grid; grid-template-columns: 120px 1fr; gap: 12px; padding: 12px 0; border-bottom: 1px solid #e5e5ea; }}
        html body #iletisim dl.kunye dt {{ color: #6e6e73; font-size: 14px; }}
        html body #iletisim dl.kunye dd {{ margin: 0; color: #1d1d1f; font-size: 15px; }}
        html body #iletisim dl.kunye dd.rakam {{ font-variant-numeric: tabular-nums slashed-zero; letter-spacing: .01em; }}
        html body .hizmet-agi {{ display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px 24px; padding: 22px 20px; background: #f5f5f7; border-top: 1px solid #e5e5ea; }}
        html body .hizmet-agi span {{ color: #6e6e73; font-size: 13px; font-weight: 600; }}
        html body .hizmet-agi a {{ color: #1d1d1f; font-weight: 600; font-size: 15px; text-decoration: none; padding: 6px 0; }}
        html body .hizmet-agi a:hover {{ color: #4f6b00; }}
        html body .footer-bottom {{ background: #f5f5f7 !important; border-top: 1px solid #e5e5ea !important; }}
        html body .footer-bottom p, html body .footer-bottom a, html body .footer-bottom-links a {{ color: #6e6e73 !important; }}
        @media (max-width: 768px) {{
            html body #iletisim.iletisim-ortak {{ grid-template-columns: 1fr; gap: 40px; padding: 48px 20px 40px; }}
            html body #iletisim .map-container {{ height: 200px; }}
            html body #iletisim dl.kunye div {{ grid-template-columns: 1fr; gap: 2px; }}
            html body #iletisim dl.kunye dt {{ font-size: 13px; }}
            html body #iletisim dl.kunye dd {{ font-size: 16px; }}
            html body .footer-bottom {{ padding-bottom: 96px !important; }}
        }}
    </style>"""


def isle(yol, ilce):
    s = io.open(yol, encoding="utf-8").read()
    if BAS in s:
        a = s.index(BAS); b = s.index(BIT) + len(BIT)
    else:
        a = s.index('<section class="footer-grid"')
        b = s.index("</section>", a) + len("</section>")
        # hemen arkasindaki hizmet agi / il baglantilari seridi
        kalan = s[b:]
        m = re.match(r'\s*(?:<!--.*?-->\s*)*<div class="(?:city-links|region-links)"[^>]*>.*?</div>', kalan, re.S)
        if not m:
            raise SystemExit(f"{yol}: hizmet agi seridi bulunamadi")
        b += m.end()
    s = s[:a] + HTML + s[b:]
    if CSS_ISARET in s:
        i = s.index(CSS_ISARET); j = s.index("</style>", i) + len("</style>")
        s = s[:i].rstrip() + "\n" + CSS.lstrip("\n").replace("        " + CSS_ISARET, CSS_ISARET, 1) + s[j:]
    else:
        i = s.rindex("    </style>")
        s = s[:i] + CSS.lstrip("\n") + s[i + len("    </style>"):]
    io.open(yol, "w", encoding="utf-8", newline="").write(s)


if __name__ == "__main__":
    for y in [os.path.join(KOK, "index.html")] + sorted(glob.glob(os.path.join(KOK, "*-reklamci-ve-tabelaci.html"))):
        isle(y, "index" not in y); print("ok", os.path.basename(y))
