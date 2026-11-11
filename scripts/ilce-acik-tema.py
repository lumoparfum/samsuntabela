"""Ilce sayfalarini (koyu tasarim) ana sayfanin acik temasina cevirir.

Ne yapar:
  - Sayfanin <style> bloklarindaki renk iceren kurallari okur, koyu renkleri ana sayfanin acik
    paletine esler ve sonuna "ACIK TEMA" blogu olarak ekler (orijinal kurallara dokunmaz).
  - Satir ici style="" icindeki koyu renkleri ayni eslemeyle degistirir.
  - Hero (.seo-hero), lightbox, urun rozetleri, ana dugme ve WhatsApp dugmesi koyu/marka renginde kalir.
Iki kez calistirilirsa ikinci seferde hicbir sey yapmaz (isaretten anlar).

Kullanim: python scripts/ilce-acik-tema.py   (6 ilce sayfasi)
"""
import io, re, glob, os

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ISARET = "/* ===== ACIK TEMA (scripts/ilce-acik-tema.py) ===== */"

# Notr iOS paleti (11 Kas 2026: yesilimsi krem tonlar "bogucu" bulundu)
INK, INK2, MUTED, MUTED2 = "#1d1d1f", "#3a3a3c", "#6e6e73", "#8e8e93"
LINE, LINE2 = "#e5e5ea", "#ececf0"
BG, BG2, CARD = "#ffffff", "#f5f5f7", "#f5f5f7"
YESIL_YAZI, YESIL_CIZGI = "#3d5400", "#9fc400"

KOYU_ZEMIN = r"#000(?:000)?\b|#030303|#050505|#080808|#0a0a0a|#0f0f0f|#111(?:111)?\b|#141414|#1a1a1a|var\(--koyu-bg\)|var\(--card-bg\)|var\(--dark\)|var\(--dark-card\)"
KOYU_CIZGI = r"#111(?:111)?\b|#1a1a1a|#222(?:222)?\b|#26262a|#2a2a2a|#333(?:333)?\b|#444\b|var\(--dark-border\)|rgba\(255,\s*255,\s*255,\s*0?\.\d+\)"
NEON = r"var\(--neon-sari(?:,[^)]*\))?\)|var\(--neon\)|#ccff00"

ATLA = (".seo-hero", ".logo span", "#lightbox", "#lb-", ".product-badge", ".btn-main", ".wp-btn", "data-theme", "::-webkit-scrollbar-thumb:hover")
ANIM = re.compile(r"^(@|from\b|to\b|\d+%)")


def yazi_rengi(v):
    v = v.strip().lower()
    if re.fullmatch(r"#fff(fff)?|#f2f2f2|#f0f0f0|#eee|#ddd(ddd)?|white", v): return INK
    if re.fullmatch(r"#ccc(ccc)?|#bbb(bbb)?", v): return INK2
    if re.fullmatch(r"#aaa(aaa)?|#999(999)?|#949494|#8a8a8a|#888(888)?", v): return MUTED
    if re.fullmatch(r"#777|#666(666)?|#555(555)?", v): return MUTED2
    if re.fullmatch(NEON, v): return YESIL_YAZI
    return None


def bildirim_esle(ad, deger):
    """Tek bir CSS bildirimini acik temaya esler; degismiyorsa None."""
    ad = ad.strip().lower(); d = deger
    if ad == "color":
        return yazi_rengi(deger.replace("!important", "")) and (yazi_rengi(deger.replace("!important", "")) + (" !important" if "!important" in deger else ""))
    if ad in ("background", "background-color"):
        if "url(" in d or "gradient" in d: return None
        if re.search(r"rgba\(0,\s*0,\s*0,\s*0?\.(9\d?|8\d?)\)|rgba\(5,\s*5,\s*5,\s*0?\.(9\d?|8\d?)\)", d): return "rgba(255,255,255,0.96)"
        if re.search(KOYU_ZEMIN, d, re.I):
            return re.sub(KOYU_ZEMIN, CARD, d, flags=re.I)
        if re.fullmatch(r"\s*#fff(fff)?\s*", d) : return None
        return None
    if ad.startswith("border"):
        yeni = re.sub(KOYU_CIZGI, LINE, d, flags=re.I)
        yeni = re.sub(NEON, YESIL_CIZGI, yeni, flags=re.I)
        return yeni if yeni != d else None
    if ad == "scrollbar-color":
        return "#c3c9b6 #eef0e8"
    return None


def css_ac(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    cikti = []
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        sec = " ".join(m.group(1).split())
        if not sec or ANIM.match(sec) or any(a in sec for a in ATLA):
            continue
        yeni = []
        for bild in m.group(2).split(";"):
            if ":" not in bild: continue
            ad, deger = bild.split(":", 1)
            e = bildirim_esle(ad, deger)
            if e: yeni.append(f"{ad.strip()}:{e}")
        if yeni:
            secler = ", ".join(("html body " + s.strip()) if not s.strip().startswith(("html", "body", ":root")) else s.strip() for s in sec.split(","))
            cikti.append(f"{secler}{{{';'.join(yeni)}}}")
    return cikti


def satir_ici(html):
    def degis(m):
        st = m.group(1); o = st
        parcalar = []
        for b in st.split(";"):
            if ":" in b:
                ad, deger = b.split(":", 1)
                e = bildirim_esle(ad, deger)
                parcalar.append(f"{ad}:{e}" if e else b)
            else:
                parcalar.append(b)
        st = ";".join(parcalar)
        return f'style="{st}"'
    return re.sub(r'style="([^"]*)"', degis, html)


def sayfa(yol):
    s = io.open(yol, encoding="utf-8").read()
    if ISARET in s:
        return "zaten acik"
    css = "\n".join(re.findall(r"<style[^>]*>(.*?)</style>", s, re.S))
    kurallar = css_ac(css)
    ek = f"""
        {ISARET}
        html body {{ background-color: {BG}; color: {INK}; }}
        html body .seo-content-section, html body .map-section {{ background: transparent; }}
        html body h2, html body h3, html body h4 {{ border-color: {LINE}; }}
        html body hr {{ border-color: {LINE} !important; }}
        html body .seo-hero, html body .seo-hero h1, html body .seo-hero p {{ color: #fff; }}
        html body .hamburger span {{ background: {INK}; }}
        html body .logo a {{ color: {INK}; }}
        html body .logo span {{ color: #7aa300; }}
        """ + "\n        ".join(kurallar) + "\n    </style>"
    i = s.rindex("    </style>")
    s = s[:i] + ek + s[i + len("    </style>"):]
    # satir ici stiller: yalniz <body> icinde, hero haric
    b0 = s.index("<body")
    govde = s[b0:]
    h0 = govde.find('class="seo-hero"')
    if h0 != -1:
        h1 = govde.find("</section>", h0)
        govde = satir_ici(govde[:h0]) + govde[h0:h1] + satir_ici(govde[h1:])
    else:
        govde = satir_ici(govde)
    s = s[:b0] + govde
    s = re.sub(r'<meta name="theme-color" content="[^"]*"', '<meta name="theme-color" content="#ffffff"', s)
    io.open(yol, "w", encoding="utf-8", newline="").write(s)
    return f"{len(kurallar)} kural"


if __name__ == "__main__":
    for y in sorted(glob.glob(os.path.join(KOK, "*-reklamci-ve-tabelaci.html"))):
        print(os.path.basename(y), sayfa(y))
