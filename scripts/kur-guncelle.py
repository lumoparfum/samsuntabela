"""TCMB dolar/euro doviz satis kurunu alir; kur.js'teki kurdan %1'den fazla farkliysa kur.js'i gunceller.

.github/workflows/kur.yml her hafta ici calistirir. Elle: python scripts/kur-guncelle.py
GitHub Actions icinde 'degisti=yes/no' cikisini yazar.
Sacma deger (eskisinin %15 altina dusme ya da %60 ustune cikma) gelirse dokunmaz.
"""
import os, re, sys, io, urllib.request

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOSYA = os.path.join(KOK, "kur.js")
ESIK = 0.01


def cikis(deger):
    yol = os.environ.get("GITHUB_OUTPUT")
    if yol:
        with open(yol, "a") as f:
            f.write(f"degisti={deger}\n")


def main():
    xml = urllib.request.urlopen("https://www.tcmb.gov.tr/kurlar/today.xml", timeout=30).read().decode("utf-8", "replace")
    tarih = re.search(r'Tarih="([^"]+)"', xml).group(1)
    yeni = {}
    for kod in ("USD", "EUR"):
        m = re.search(r'Kod="' + kod + r'".*?<ForexSelling>([\d.]+)</ForexSelling>', xml, re.S)
        yeni[kod] = float(m.group(1))

    s = io.open(DOSYA, encoding="utf-8").read()
    eski = {k: float(re.search(k + r": ([\d.]+), // KUR-" + k, s).group(1)) for k in ("USD", "EUR")}
    for k in yeni:
        if not (eski[k] * 0.85 < yeni[k] < eski[k] * 1.6):
            print(f"{k} sacma: {yeni[k]} (eski {eski[k]}), dokunulmadi"); cikis("no"); return
    fark = max(abs(yeni[k] / eski[k] - 1) for k in yeni)
    print(f"TCMB {tarih}: USD {yeni['USD']} EUR {yeni['EUR']} | kur.js USD {eski['USD']} EUR {eski['EUR']} | fark %{fark*100:.2f}")
    if fark < ESIK:
        cikis("no"); return
    for k in yeni:
        s = re.sub(k + r": [\d.]+, // KUR-" + k, f"{k}: {yeni[k]:.4f}, // KUR-{k}", s)
    s = re.sub(r"tarih: '[^']*' // KUR-TARIH", f"tarih: '{tarih}' // KUR-TARIH", s)
    io.open(DOSYA, "w", encoding="utf-8", newline="\n").write(s)
    print("kur.js guncellendi"); cikis("yes")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:  # TCMB kapaliysa (tatil vb.) sessizce gec
        print("TCMB okunamadi:", e); cikis("no"); sys.exit(0)
