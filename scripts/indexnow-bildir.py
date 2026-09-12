"""Degisen sayfalari IndexNow ile Bing + Yandex'e bildirir.
Kullanim: python scripts/indexnow-bildir.py index.html ordu-reklamci-ve-tabelaci.html ...
"""
import sys, json, urllib.request

SITE = "https://samsuntabela.tr/"
KEY = "52e48e51d331419186e9cbe77974ab26"

def main(paths):
    urls = [SITE if p == "index.html" else SITE + p for p in paths if p.strip()]
    urls.append(SITE + "sitemap.xml")
    body = json.dumps({"host": "samsuntabela.tr", "key": KEY,
                       "keyLocation": f"{SITE}{KEY}.txt", "urlList": urls}).encode()
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body,
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print("IndexNow HTTP", r.status)
    except urllib.error.HTTPError as e:
        print("IndexNow HTTP", e.code, e.read().decode(errors="replace"))
    for u in urls: print("  ", u)

if __name__ == "__main__":
    main(sys.argv[1:])
