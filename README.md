# samsuntabela.tr — Teknik Not

Uzman Reklam'ın web sitesi. GitHub Pages ile yayınlanır (`CNAME` → `samsuntabela.tr`), sunucu yoktur.
Repo: `lumoparfum/samsuntabela`, dal: `main`. `main`'e push = canlıya çıkar (1–2 dk).

> Bu dosya yalnızca **teknik yapıyı** anlatır. İş kararları, SEO durumu, bekleyen işler ve geçmiş
> `veriler/` klasöründedir (yalnızca yazarın bilgisayarında, git'e girmez): önce `veriler/BURADAN-BASLA.md`.

## Sayfalar

| Dosya | Ne |
|---|---|
| `index.html` | Ana sayfa (galeri, hizmetler, SSS, iletişim) |
| `samsun-`, `atakum-`, `bafra-`, `sinop-`, `ordu-`, `trabzon-reklamci-ve-tabelaci.html` | İlçe/bölge sayfaları (SEO) |
| `baski.html` | Fason dijital baskı: fiyat hesaplayıcı + ürünler |
| `baski/` | Ayrı alt site ("Türkiye'nin baskı fabrikası"): `index`, `fason-baski`, `hediyelik`, `okul-kurum`, `ozel-gun`, `taraftar`, `vitrin` + `css/`, `js/` (`data.js` = iletişim bilgisi), `images/` (JPG). Ana siteden bağlantı yok, `sitemap.xml`'de yok; doğrudan adresle paylaşılır. |
| `panel/` | Galeri yönetim paneli (`/panel/`, gizli, `noindex`) |
| `mucahitkasa.html`, `teegarlife.html`, `uzmankasa.html` | Bu siteyle ilgisi olmayan eski sayfalar. Sitemap'te ve menüde yok. Dokunulmadı. |

## Galeri (ana sayfa) — tek veri kaynağı `galeri.json`

- `index.html` içindeki `<!-- GALERI-FILTRE:BASLA/BITIR -->` ve `<!-- GALERI:BASLA/BITIR -->` blokları ile
  `sitemap.xml` içindeki `<!-- GALERI-GORSEL:BASLA/BITIR -->` bloğu **otomatik üretilir. Elle düzenlenmez.**
- Değiştirmek için: `galeri.json`'u düzenle (ya da `/panel/` kullan) → `python scripts/galeri-uret.py`.
  `--kontrol` bayrağı sadece doğrular, dosya yazmaz.
- Yeni foto: `galeri/kaynak/<ad>.jpg` konur, üretici bunu kökte `<ad>.webp`'ye çevirir
  (uzun kenar 1200 px, hedef ≤160 KB, kalite ≥60). Dosya adı: küçük harf, tire, `.webp`.
- Galeriden çıkarılıp sitede hiçbir yerde kullanılmayan `.webp` (ve kaynak jpg'si) üretici tarafından silinir.

## Panel (`/panel/`)

Tek sayfa, sunucusuz. GitHub fine-grained token ile (yalnızca bu repo: Contents RW, Actions R, Pages R)
Git Data API üzerinden tek commit atar; token cihazın `localStorage`'ında durur, repoda hiçbir yerde yoktur.
`/panel/#token=...` bağlantısı tokeni kaydedip adres çubuğundan siler. Ayrıntı: `panel/README.md`.

## Otomasyon (`.github/workflows/`)

| Workflow | Ne zaman | Ne yapar |
|---|---|---|
| `indexnow.yml` ("SEO bildirim") | Her push, ya da elle | Değişen **kök** `.html` sayfaları için `sitemap.xml` `lastmod` günceller (geri commit, `[skip ci]`), Bing + Yandex'e IndexNow gönderir, Pages'i yeniden yayınlatır. `baski/` ve ilgisiz 3 sayfa hariç. |
| `galeri.yml` ("Galeri uret") | `galeri.json` veya `galeri/kaynak/**` değişince | `galeri-uret.py` çalıştırır, WebP üretir, commit, IndexNow, Pages. |

Workflow'lar geri commit attığı için push sonrası yerel kopya geride kalır: işe başlamadan
`git pull --rebase --autostash origin main`.
IndexNow anahtar dosyası köktedir (`<anahtar>.txt`); herkese açık olması tasarım gereğidir. Google IndexNow'u desteklemez, sitemap'ten öğrenir.

## Kurallar (tekrar hata yapmamak için)

1. **Tek iletişim numarası: 0532 220 46 49** (`wa.me/905322204649`, `tel:05322204649`). `baski/js/data.js` içindeki `ILETISIM` baski/ alt sitesinin kaynağıdır; kök sayfalarda numara HTML içinde sabittir.
2. Vergi no olarak **VKN 8560266150** gösterilir, TC kimlik numarası asla.
3. Başlık (`<title>`) ≤ 60, `meta description` ≤ 160 karakter. Site adı: **Samsun Tabela** (`WebSite` şeması + `og:site_name`).
4. Commit'te `git add -A -- '*.html'` **kullanma**: `baski/` ve diğer alt klasörleri de alır, bekleyen işi yanlışlıkla yayına sokar. Açık dosya listesi ver, önce `git status` bak.
5. HTML/CSS/JS değişikliğinden sonra **canlı** sayfada kontrol: `scripts/qa/` altındaki senaryoları çalıştır (JS hatası, kırık görsel, yatay taşma, lightbox/menü/filtre,
   telefon ve PC boyutu; kullanım `scripts/qa/README.md`) ve W3C validator 0 hata. Yapısal taşımada değişikliği kendisiyle değil **orijinal commit** ile kıyasla (`git show <commit>:dosya`).
6. Dosya/URL adlarını taşıma ya da yeniden adlandırma: Google'ın öğrendiği adresler bozulur (kökteki görseller bu yüzden tek klasörde duruyor).
