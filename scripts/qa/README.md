# Kalite kontrol senaryoları (Playwright)

HTML/CSS/JS değiştirdikten sonra, **canlıya çıkınca** çalıştır (yerelde denemek için `python -m http.server 8765` ve adres olarak `http://127.0.0.1:8765/`).

```
cd scripts/qa
npm install            # bir kez
npx playwright install chromium-headless-shell   # bir kez
node denetim.mjs               # 15 sayfa x 3 ekran: JS, 4xx, kırık görsel, taşma, eski numara
node etkilesim.mjs             # galeri filtre/arama/lightbox, pencereler, panel
node numara.mjs                # her sayfada yalnız 905322204649
node baski-gorsel.mjs          # baski/ alt sitesi
node ekran-goruntusu.mjs <url> <etiket>
```
Ek olarak W3C: `curl -s -H "Content-Type: text/html; charset=utf-8" --data-binary @index.html "https://validator.w3.org/nu/?out=json"` → `error` sayısı 0 olmalı.
Beklenen çıktı: `... TEMIZ`. GA (google-analytics) istekleri headless'ta iptal olur, hata sayılmaz.
