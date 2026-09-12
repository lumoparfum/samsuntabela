"""Degisen HTML dosyalarinin sitemap.xml'deki lastmod tarihini bugune ceker.
Kullanim: python scripts/sitemap-guncelle.py index.html ordu-reklamci-ve-tabelaci.html ...
"""
import re, sys, datetime, io

BUGUN = datetime.date.today().isoformat()
SITE = "https://samsuntabela.tr/"

def url_of(path):
    return SITE if path == "index.html" else SITE + path

def main(paths):
    s = io.open("sitemap.xml", encoding="utf-8").read()
    degisen = 0
    for p in paths:
        loc = url_of(p)
        yeni, n = re.subn(
            r"(<loc>" + re.escape(loc) + r"</loc>\s*<lastmod>)\d{4}-\d{2}-\d{2}(</lastmod>)",
            r"\g<1>" + BUGUN + r"\2", s, count=1)
        if n:
            s = yeni; degisen += n
            print("lastmod ->", BUGUN, loc)
    if degisen:
        io.open("sitemap.xml", "w", encoding="utf-8", newline="").write(s)
    print("guncellenen:", degisen)

if __name__ == "__main__":
    main(sys.argv[1:])
