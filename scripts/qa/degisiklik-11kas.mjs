// 11 Kas 2026 degisikliklerinin testi: galeri sirasi/kucuk kopya/lightbox, Ara dugmesi, tel:, 769-1024px logo-menu, baski videosu.
// Kullanim: node degisiklik-11kas.mjs https://samsuntabela.tr/
import { chromium, devices } from 'playwright';
const BASE = process.argv[2] || 'http://127.0.0.1:8765/';
const PAGES = ['', 'samsun-reklamci-ve-tabelaci.html', 'atakum-reklamci-ve-tabelaci.html', 'bafra-reklamci-ve-tabelaci.html', 'sinop-reklamci-ve-tabelaci.html', 'ordu-reklamci-ve-tabelaci.html', 'trabzon-reklamci-ve-tabelaci.html'];
const b = await chromium.launch(); let hata = 0;
const k = (ad, ok, ek = '') => { if (!ok) hata++; console.log((ok ? '✓ ' : '⚠ ') + ad + (ek !== '' ? '  ' + ek : '')); };
// 1) Ana sayfa mobil + PC: galeri sirasi, kucuk kopya, lightbox asil foto, kart sayisi
for (const [dev, opts, beklenen] of [['mobil', devices['iPhone 14'], 8], ['pc', { viewport: { width: 1440, height: 900 } }, 12]]) {
  const p = await (await b.newContext({ ...opts, locale: 'tr-TR' })).newPage();
  const js = []; p.on('pageerror', e => js.push(e.message));
  let galeriBayt = 0; p.on('response', async r => { if (/\.webp/.test(r.url()) && /galeri\/k\/|\/[a-z0-9-]+\.webp/.test(r.url())) { const h = r.headers()['content-length']; if (h) galeriBayt += +h; } });
  await p.goto(BASE + '?t=' + Date.now(), { waitUntil: 'networkidle' });
  const vh = await p.evaluate(() => innerHeight);
  const r = await p.evaluate(() => {
    const y = s => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY);
    return { hakkimizda: y('#hakkimizda'), galeri: y('#projeler'), ilkFoto: y('.work-card'), hizmetler: y('#hizmetler'), yorum: y('.reviews-section'), gorunen: [...document.querySelectorAll('.work-card')].filter(c => getComputedStyle(c).display !== 'none').length, src: document.querySelector('.work-card img').getAttribute('src') };
  });
  k(`${dev}: sira Galeri < Hakkimizda < Hizmetler < Yorumlar (11 Kas: galeri hero'nun hemen alti)`, r.galeri < r.hakkimizda && r.hakkimizda < r.hizmetler && r.hizmetler < r.yorum, `ilk foto ${(r.ilkFoto / vh).toFixed(2)}. ekranda`);
  k(`${dev}: ilk acik kart sayisi ${beklenen}`, r.gorunen === beklenen, r.gorunen);
  k(`${dev}: kartta kucuk kopya`, r.src.startsWith('galeri/k/'), r.src);
  await p.locator('.work-card:visible').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
  const yuklenen = await p.evaluate(() => [...document.querySelectorAll('.work-card:not(.sayfa-disi) img')].filter(i => i.complete && i.naturalWidth > 0).length);
  k(`${dev}: acik kartlarin resimleri yuklendi`, yuklenen >= beklenen - 2, `${yuklenen}/${beklenen}`);
  await p.locator('.work-card:visible').nth(1).click(); await p.waitForTimeout(700);
  const lb = await p.evaluate(() => { const i = document.getElementById('lb-img'); return { src: i.getAttribute('src'), w: i.naturalWidth }; });
  k(`${dev}: lightbox ASIL fotoyu aciyor`, !lb.src.includes('galeri/k/') && lb.w >= 900, `${lb.src.split('/').pop()} ${lb.w}px`);
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(500);
  const lb2 = await p.evaluate(() => document.getElementById('lb-img').getAttribute('src'));
  k(`${dev}: lightbox ileri asil foto`, !lb2.includes('galeri/k/') && lb2 !== lb.src);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  await p.locator('.service-box').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
  k(`${dev}: hizmet kutusu klavyeyle aciliyor`, (await p.locator('.sub-page-overlay.active').count()) === 1);
  k(`${dev}: galeri gorsel indirmesi`, true, `${Math.round(galeriBayt / 1024)} KB`);
  k(`${dev}: JS hatasi yok`, js.length === 0, js.join('|'));
}
// 2) 7 sayfa (11 Kas hafif duzen sonrasi): yuzen Ara/Instagram yok, yalniz WhatsApp; tel 0532, WhatsApp 0507
for (const [dev, opts] of [['mobil', devices['iPhone 14']], ['pc', { viewport: { width: 1440, height: 900 } }]]) {
  const p = await (await b.newContext({ ...opts, locale: 'tr-TR' })).newPage();
  for (const pg of PAGES) {
    await p.goto(BASE + pg + '?t=' + Date.now(), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(300);
    const r = await p.evaluate(() => ({ yuzenFazla: !!document.querySelector('.wp-ara, .wp-insta'), tel: document.querySelectorAll('a[href="tel:+905322204649"]').length, wa: [...new Set([...document.querySelectorAll('a[href*="wa.me/"]')].map(a => a.href.match(/wa\.me\/(\d+)/)[1]))] }));
    k(`${dev} ${(pg || 'index').slice(0, 10)}: tek WhatsApp dugmesi, tel 0532, wa 0507`, !r.yuzenFazla && r.tel >= 1 && r.wa.length === 1 && r.wa[0] === '905079605049', JSON.stringify(r));
  }
}
// 3) iPad / kucuk laptop: logo menunun altinda kalmasin
for (const w of [769, 810, 900, 1000, 1024]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 800 } })).newPage();
  for (const pg of PAGES) {
    await p.goto(BASE + pg + '?t=' + Date.now(), { waitUntil: 'load' }); await p.waitForTimeout(200);
    const r = await p.evaluate(() => { const l = document.querySelector('.logo a') || document.querySelector('.logo'); const n = document.querySelector('.nav-links'); if (!l || !n || getComputedStyle(n).display === 'none') return { ok: true, not: 'menu gizli' }; const lr = l.getBoundingClientRect().right, nl = [...n.children].filter(c => c.getBoundingClientRect().width > 0)[0].getBoundingClientRect().left; return { ok: lr <= nl - 4, lr: Math.round(lr), nl: Math.round(nl), tasma: document.documentElement.scrollWidth - innerWidth }; });
    if (!r.ok || r.tasma > 1) k(`${w}px ${(pg || 'index').slice(0, 10)}: logo/menu cakismasi`, false, JSON.stringify(r));
  }
  await p.close();
}
console.log('(logo/menu: yukarida uyari yoksa 769-1024px x 7 sayfa temiz)');
// 4) baski.html: telefonda video inmesin, PC'de insin ve oynasin
for (const [dev, opts] of [['mobil', devices['iPhone 14']], ['pc', { viewport: { width: 1440, height: 900 } }]]) {
  const p = await (await b.newContext({ ...opts })).newPage(); let mp4 = 0;
  p.on('request', r => { if (r.url().includes('hero-fason.mp4')) mp4++; });
  await p.goto(BASE + 'baski.html?t=' + Date.now(), { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  const v = await p.$eval('video.hero-video', v => ({ oynuyor: !v.paused && v.currentTime > 0, poster: !!v.poster }));
  k(`${dev}: baski video`, dev === 'mobil' ? (mp4 === 0 && v.poster) : (mp4 > 0 && v.oynuyor), JSON.stringify({ mp4istek: mp4, ...v }));
}
console.log(hata ? `SORUNLU: ${hata}` : 'YENI DEGISIKLIKLER TEMIZ');
await b.close();
