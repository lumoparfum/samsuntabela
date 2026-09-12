# Galeri Paneli — teknik not

`https://samsuntabela.tr/panel/` — ana sayfa galerisini (galeri.json) yöneten tek sayfalık, sunucusuz uygulama.

## Akış
1. Kullanıcı GitHub fine-grained token ile giriş yapar (localStorage'da saklanır; repo: `lumoparfum/samsuntabela`,
   izinler: Contents RW, Actions R, Pages R).
2. Foto seçilir → tarayıcıda ≤1600 px JPEG'e küçültülür (canvas). Başlık/alt yazı/kategori/alt/etiket girilir.
3. **Yayınla** → Git Data API ile tek commit: `galeri/kaynak/<slug>.jpg` blob'ları + `galeri.json`.
   Yayından önce galeri.json SHA'sı kontrol edilir (başka yerden değiştiyse durur).
4. `.github/workflows/galeri.yml` tetiklenir → `scripts/galeri-uret.py`: WebP üretir (≤160 KB, kalite ≥60, 1200 px),
   `index.html` GALERI bloklarını ve `sitemap.xml` görsellerini yazar, yetim WebP'leri siler, commit `[skip ci]`,
   IndexNow, Pages build.
5. Panel Actions + Pages durumunu izler ve "Yayında" der.

## Kurallar
- `galeri.json` tek veri kaynağı. `index.html`/`sitemap.xml` içindeki `GALERI...:BASLA/BITIR` blokları elle düzenlenmez.
- Silme yalnızca galeri kaydını kaldırır; dosya başka sayfada kullanılmıyorsa üretici temizler.
- Yerel çalışmada: galeri.json düzenle → `python scripts/galeri-uret.py` → commit. Push sonrası `git pull --rebase --autostash`.
- Test: `veriler/`'de Playwright senaryoları not edildi (iPhone görünümü, gerçek yayın).
