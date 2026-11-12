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
| `referanslar.html` | Referanslarımız: kurum ve marka listesi (yazı olarak, Google ve yapay zekâ okusun) + seçili iş fotoğrafları. **`scripts/referans-uret.py` üretir, elle düzenlenmez**; liste ve fotoğraflar script'in içinde. `index.html` stili, menüsü ve iletişim bloğu kullanılır: index ya da iletişim bloğu değişince script'i yeniden çalıştır. |
| `hakkimizda.html`, `hastane-tabela-ve-yonlendirme.html` | Hakkımızda (tarihçe, atölye, künye) ve hastane hizmet sayfası (işler, hastaneler, SSS + FAQPage/Service şeması). **`scripts/kurumsal-sayfalar.py` üretir**, şablonu `referans-uret.py`'deki `sayfa_yaz()`'dan alır. |
| `alt-lightbox.js` | Alt sayfalardaki (referanslar, hakkımızda, hastane, ilçe "yaptığımız işler") fotoğrafları dokununca büyütür; küçük kopyadan asıl fotoğrafı bulur. `referans-uret.py` ve `ilce-sss.py` sayfaya ekler. |
| `kur.js` | Döviz kuru (TCMB). Baskı m² fiyatları dolar/euro × bu kur; `data-m2="1.80 USD"` taşıyan her fiyat ve hesaplayıcı buradan okur (`baski.html`, Sinop sayfası, `baski/`). |
| `llms.txt` | Yapay zekâ arama botları için firma özeti (adres, numaralar, hizmetler, sayfalar). |
| `baski/` | Ayrı alt site ("Türkiye'nin baskı fabrikası"): `index`, `fason-baski`, `hediyelik`, `okul-kurum`, `ozel-gun`, `taraftar`, `vitrin` + `css/`, `js/` (`data.js` = iletişim bilgisi), `images/` (JPG). Ana siteden bağlantı yok, `sitemap.xml`'de yok; doğrudan adresle paylaşılır. |
| `panel/` | Galeri yönetim paneli (`/panel/`, gizli, `noindex`) |

## Galeri (ana sayfa) — tek veri kaynağı `galeri.json`

- `index.html` içindeki `<!-- GALERI-FILTRE:BASLA/BITIR -->` ve `<!-- GALERI:BASLA/BITIR -->` blokları ile
  `sitemap.xml` içindeki `<!-- GALERI-GORSEL:BASLA/BITIR -->` bloğu **otomatik üretilir. Elle düzenlenmez.**
- Değiştirmek için: `galeri.json`'u düzenle (ya da `/panel/` kullan) → `python scripts/galeri-uret.py`.
  `--kontrol` bayrağı sadece doğrular, dosya yazmaz.
- Kartlarda `galeri/k/<ad>.webp` hafif kopyası gösterilir (`data-full` = asıl foto, lightbox'ta açılır); üretici eksikleri yaratır, galeriden çıkanları siler.
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
| `indexnow.yml` ("SEO bildirim") | Her push, ya da elle | Değişen **kök** `.html` sayfaları için `sitemap.xml` `lastmod` günceller (geri commit, `[skip ci]`), Bing + Yandex'e IndexNow gönderir, Pages'i yeniden yayınlatır. `baski/` hariç. |
| `galeri.yml` ("Galeri uret") | `galeri.json` veya `galeri/kaynak/**` değişince | `galeri-uret.py` çalıştırır, WebP üretir, commit, IndexNow, Pages. |
| `kur.yml` ("Kur guncelle") | Hafta içi 16:30, ya da elle | `scripts/kur-guncelle.py`: TCMB döviz satış kuru `kur.js`'ten %1'den fazla farklıysa `kur.js`'i günceller, commit (`[skip ci]`), Pages. Az oynadıysa hiçbir şey yapmaz. |

## Ortak bloklar (scripts ile üretilir, elle düzenlenmez)

| Blok | Üreten | Nerede |
|---|---|---|
| İletişim bölümü + "Hizmet ağımız" şeridi + stili (`ILETISIM:BASLA/BITIR`) | `scripts/iletisim-ortak.py` | `index.html` + 6 ilçe |
| "Referanslarımız" bağlantısı iletişim bloğunda (Kurumsal Bilgiler altı) | `scripts/iletisim-ortak.py` | 7 sayfa + referanslar |
| İşletme kimliği (schema.org): ana sayfada LocalBusiness `@id https://samsuntabela.tr/#isletme` (ad, Google İşletme adı, adres, koordinat, saat, kurucu, iller); ilçe sayfaları ve baski.html'de ona bağlı Service (`ISLETME-SEMA:BASLA/BITIR`) | `scripts/isletme-sema.py` | index + 6 ilçe + baski.html |
| İlçe "bu bölgede yaptığımız işler" fotoğrafları (Trabzon'da iş yok, çıkmaz) | `scripts/ilce-sss.py` (`ISLER`) | 5 ilçe |
| İlçe "sık sorulan sorular" + FAQPage şeması (`SSS:BASLA/BITIR`, `SSS-SEMA:BASLA/BITIR`) | `scripts/ilce-sss.py` | 6 ilçe |

Adres, numara, banka bilgisi ya da SSS metni değişecekse script'teki metni değiştir, script'i çalıştır (tekrar çalıştırmak güvenli).
Tek seferlik dönüşüm script'leri (11 Kas 2026, tekrar çalıştırılınca bir şey yapmaz): `ilce-acik-tema.py` (ilçe sayfaları açık tema), `notr-palet.py` (yeşilimsi krem → nötr beyaz/gri).

Workflow'lar geri commit attığı için push sonrası yerel kopya geride kalır: işe başlamadan
`git pull --rebase --autostash origin main`.
IndexNow anahtar dosyası köktedir (`<anahtar>.txt`); herkese açık olması tasarım gereğidir. Google IndexNow'u desteklemez, sitemap'ten öğrenir.

## Kurallar (tekrar hata yapmamak için)

1. **WhatsApp 0507 960 50 49** (`wa.me/905079605049`), **telefonla arama 0532 220 46 49** (`tel:+905322204649`, şemadaki `telephone`). İletişim bölümünde ikisi ayrı satır (11 Kas 2026). `baski/js/data.js` içindeki `ILETISIM` baski/ alt sitesinin kaynağıdır; kök sayfalarda numara HTML içinde sabittir.
2. Bütün site yalnız açık tema, nötr palet (yazı #1d1d1f, gri #6e6e73, zemin #fff/#f5f5f7, çizgi #e5e5ea; marka yeşili yalnız logo #7aa300 ve düğmeler #ccff00). Metinde şapkalı harf (â, î, û) kullanılmaz. Vergi no olarak **VKN 8560266150** gösterilir, TC kimlik numarası asla.
3. Başlık (`<title>`) ≤ 60, `meta description` ≤ 160 karakter. Site adı: **Uzman Reklam** (`WebSite` şeması + `og:site_name`; 11 Kas 2026). Şemada uydurma şube adı yok ("Sinop Şubesi" gibi), hepsi "Uzman Reklam" + `areaServed`.
4. Commit'te `git add -A -- '*.html'` **kullanma**: `baski/` ve diğer alt klasörleri de alır, bekleyen işi yanlışlıkla yayına sokar. Açık dosya listesi ver, önce `git status` bak.
5. HTML/CSS/JS değişikliğinden sonra **canlı** sayfada kontrol: `scripts/qa/` altındaki senaryoları çalıştır (JS hatası, kırık görsel, yatay taşma, lightbox/menü/filtre,
   telefon ve PC boyutu; kullanım `scripts/qa/README.md`) ve W3C validator 0 hata. Yapısal taşımada değişikliği kendisiyle değil **orijinal commit** ile kıyasla (`git show <commit>:dosya`).
6. Dosya/URL adlarını taşıma ya da yeniden adlandırma: Google'ın öğrendiği adresler bozulur (kökteki görseller bu yüzden tek klasörde duruyor).
