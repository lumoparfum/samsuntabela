"""galeri.json -> index.html (filtre butonlari + galeri kartlari) + sitemap.xml (gorsel girisleri)
+ galeri/kaynak/*.jpg -> kok dizinde *.webp (hedef <=160 KB, kalite en az 60, uzun kenar 1200 px).

Kullanim:  python scripts/galeri-uret.py            # uret
           python scripts/galeri-uret.py --kontrol  # sadece dogrula, dosya yazma (CI icin)

Tek veri kaynagi galeri.json'dur. index.html ve sitemap.xml icindeki
GALERI... isaretleri arasindaki bloklar bu script tarafindan yazilir; elle duzenleme
bir sonraki uretimde ezilir.
"""
import io, json, os, re, sys, html

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://samsuntabela.tr/"
KAYNAK_DIZIN = os.path.join(KOK, "galeri", "kaynak")
WEBP_MAX_KB = 160      # mevcut galeri fotolari 60-160 KB araliginda
WEBP_MIN_KALITE = 60   # boyut icin kaliteden bunun altina inilmez
WEBP_UZUN_KENAR = 1200
DOSYA_ADI = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.webp$")


def oku_json():
    with io.open(os.path.join(KOK, "galeri.json"), encoding="utf-8") as f:
        return json.load(f)


def dogrula(veri):
    """Veri butunlugu: hatali kayit varsa uretimi durdur."""
    hatalar = []
    kat_idler = [k["id"] for k in veri["kategoriler"]]
    if len(set(kat_idler)) != len(kat_idler):
        hatalar.append("Tekrarlanan kategori id'si var")
    for k in veri["kategoriler"]:
        for alan in ("id", "ad", "kisa"):
            if not k.get(alan, "").strip():
                hatalar.append(f"Kategori '{k.get('id')}' icin '{alan}' bos")
        if not re.fullmatch(r"[a-z0-9-]+", k["id"]):
            hatalar.append(f"Kategori id gecersiz: {k['id']}")
    dosyalar = set()
    for i, f in enumerate(veri["fotolar"], 1):
        etiket = f"Foto #{i} ({f.get('dosya', '?')})"
        for alan in ("dosya", "baslik", "altyazi", "alt", "etiketler"):
            if not str(f.get(alan, "")).strip():
                hatalar.append(f"{etiket}: '{alan}' bos")
        if not DOSYA_ADI.match(f.get("dosya", "")):
            hatalar.append(f"{etiket}: dosya adi kurala uymuyor (kucuk harf, tire, .webp)")
        if f["dosya"] in dosyalar:
            hatalar.append(f"{etiket}: ayni dosya iki kez listelenmis")
        dosyalar.add(f["dosya"])
        if not f.get("kategoriler"):
            hatalar.append(f"{etiket}: en az bir kategori gerekli")
        for k in f.get("kategoriler", []):
            if k not in kat_idler:
                hatalar.append(f"{etiket}: bilinmeyen kategori '{k}'")
        for alan in ("baslik", "altyazi", "alt"):
            if any(c in f.get(alan, "") for c in "<>\""):
                hatalar.append(f"{etiket}: '{alan}' icinde < > \" olamaz")
    return hatalar


def webp_uret(veri, kontrol):
    """galeri/kaynak/<ad>.jpg varsa ve kokte <ad>.webp yoksa WebP uret."""
    uretilen, eksik = [], []
    for f in veri["fotolar"]:
        hedef = os.path.join(KOK, f["dosya"])
        if os.path.exists(hedef):
            continue
        govde = f["dosya"][:-5]
        kaynak = None
        for uz in (".jpg", ".jpeg", ".png"):
            aday = os.path.join(KAYNAK_DIZIN, govde + uz)
            if os.path.exists(aday):
                kaynak = aday
                break
        if not kaynak:
            eksik.append(f["dosya"])
            continue
        if kontrol:
            uretilen.append(f["dosya"])
            continue
        from PIL import Image, ImageOps
        im = Image.open(kaynak)
        im = ImageOps.exif_transpose(im).convert("RGB")
        im.thumbnail((WEBP_UZUN_KENAR, WEBP_UZUN_KENAR), Image.LANCZOS)
        for q in range(85, WEBP_MIN_KALITE - 1, -5):
            im.save(hedef, "WEBP", quality=q, method=6)
            if os.path.getsize(hedef) <= WEBP_MAX_KB * 1024:
                break
        uretilen.append(f"{f['dosya']} ({im.size[0]}x{im.size[1]}, {os.path.getsize(hedef)//1024} KB, q{q})")
    return uretilen, eksik


def filtre_html(veri):
    satirlar = ['<div class="gallery-filters" id="galleryFilters">',
                '    <button class="filter-btn active" data-cat="all" onclick="filterGallery(\'all\', this)">Tümü <span class="cnt"></span></button>']
    for k in veri["kategoriler"]:
        satirlar.append(f'    <button class="filter-btn" data-cat="{k["id"]}" onclick="filterGallery(\'{k["id"]}\', this)">{html.escape(k["ad"], quote=False)} <span class="cnt"></span></button>')
    satirlar.append('</div>')
    return "\n".join(satirlar)


def kart_html(veri):
    kisa = {k["id"]: k["kisa"] for k in veri["kategoriler"]}
    satirlar = []
    for f in veri["fotolar"]:
        rozet = kisa[f["kategoriler"][0]]
        satirlar.append(
            f'    <div class="work-card {" ".join(f["kategoriler"])}" data-tags="{html.escape(f["etiketler"], quote=True)}" onclick="openLightbox(this)">'
            f'<span class="cat-badge">{html.escape(rozet, quote=False)}</span>'
            f'<img src="{f["dosya"]}" alt="{html.escape(f["alt"], quote=True)}" loading="lazy" decoding="async" width="400" height="250">'
            f'<div class="work-info"><h3>{html.escape(f["baslik"], quote=False)}</h3><p>{html.escape(f["altyazi"], quote=False)}</p></div></div>')
    return "\n".join(satirlar) + "\n"


def sitemap_xml(veri):
    satirlar = []
    for f in veri["fotolar"]:
        satirlar.append("    <image:image>\n"
                        f"      <image:loc>{SITE}{f['dosya']}</image:loc>\n"
                        f"      <image:title>{html.escape(f['alt'], quote=False)}</image:title>\n"
                        "    </image:image>")
    return "\n".join(satirlar)


def blok_degistir(metin, bas_isaret, bit_isaret, yeni, dosya_adi):
    bas_re = re.compile(re.escape(bas_isaret) + r"[^\n]*\n")
    m1 = bas_re.search(metin)
    i2 = metin.find(bit_isaret)
    if not m1 or i2 < 0 or i2 < m1.end():
        raise SystemExit(f"{dosya_adi}: {bas_isaret} / {bit_isaret} isaretleri bulunamadi")
    return metin[:m1.end()] + yeni + metin[i2:]


def main():
    kontrol = "--kontrol" in sys.argv
    veri = oku_json()
    hatalar = dogrula(veri)
    if hatalar:
        print("galeri.json HATALI:")
        for h in hatalar:
            print("  -", h)
        sys.exit(1)

    uretilen, eksik = webp_uret(veri, kontrol)
    for u in uretilen:
        print("webp:", u)
    if eksik:
        print("HATA: su fotolarin ne webp'si ne kaynagi var:", ", ".join(eksik))
        sys.exit(1)

    index_yolu = os.path.join(KOK, "index.html")
    sitemap_yolu = os.path.join(KOK, "sitemap.xml")
    index_eski = io.open(index_yolu, encoding="utf-8").read()
    sitemap_eski = io.open(sitemap_yolu, encoding="utf-8").read()

    index_yeni = blok_degistir(index_eski, "<!-- GALERI-FILTRE:BASLA", "<!-- GALERI-FILTRE:BITIR -->", filtre_html(veri) + "\n", "index.html")
    index_yeni = blok_degistir(index_yeni, "<!-- GALERI:BASLA", "<!-- GALERI:BITIR -->", kart_html(veri), "index.html")
    sitemap_yeni = blok_degistir(sitemap_eski, "<!-- GALERI-GORSEL:BASLA", "<!-- GALERI-GORSEL:BITIR -->", sitemap_xml(veri) + "\n    ", "sitemap.xml")

    degisenler = [ad for ad, e, y in (("index.html", index_eski, index_yeni), ("sitemap.xml", sitemap_eski, sitemap_yeni)) if e != y]
    if kontrol:
        print("kontrol: degisecek dosyalar:", degisenler or "yok")
        return
    if "index.html" in degisenler:
        io.open(index_yolu, "w", encoding="utf-8", newline="").write(index_yeni)
    if "sitemap.xml" in degisenler:
        io.open(sitemap_yolu, "w", encoding="utf-8", newline="").write(sitemap_yeni)
    print(f"foto: {len(veri['fotolar'])}, kategori: {len(veri['kategoriler'])}, guncellenen:", degisenler or "yok")


if __name__ == "__main__":
    main()
