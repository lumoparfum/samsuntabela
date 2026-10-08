// baski/ alt sitesi: 7 sayfa x 2 ekran, kirik gorsel/JS/istek/tasma. Kullanim: node baski-gorsel.mjs https://samsuntabela.tr/
import { chromium, devices } from 'playwright';
const BASE = process.argv[2];
const PAGES = ['baski/index.html', 'baski/fason-baski.html', 'baski/hediyelik.html', 'baski/okul-kurum.html', 'baski/ozel-gun.html', 'baski/taraftar.html', 'baski/vitrin.html'];
const b = await chromium.launch(); let bad = 0, imgTotal = 0, bytes = 0;
for (const [dev, opts] of [['mobil', devices['iPhone 14']], ['pc', { viewport: { width: 1440, height: 900 } }]]) {
  const p = await (await b.newContext({ ...opts, locale: 'tr-TR' })).newPage();
  for (const pg of PAGES) {
    const js = [], fail = []; let sz = 0;
    p.removeAllListeners('pageerror'); p.removeAllListeners('response');
    p.on('pageerror', e => js.push(e.message));
    p.on('response', async r => { if (r.status() >= 400) fail.push(r.status() + ' ' + r.url().replace(BASE, '/')); const h = r.headers()['content-length']; if (h && /\.(jpg|png|webp)/.test(r.url())) sz += +h; });
    await p.goto(BASE + pg + '?t=' + Date.now(), { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => ({ n: document.images.length, kirik: [...document.images].filter(i => i.src && !i.src.startsWith('data:') && i.complete && i.naturalWidth === 0 && getComputedStyle(i).display !== 'none').map(i => i.getAttribute('src')), yatay: document.documentElement.scrollWidth - innerWidth }));
    imgTotal += r.n; bytes += sz;
    const s = []; if (js.length) s.push('JS:' + js); if (fail.length) s.push('istek:' + fail); if (r.kirik.length) s.push('kirik:' + r.kirik); if (r.yatay > 1) s.push('tasma:' + r.yatay);
    if (s.length) { bad++; console.log(`⚠ ${dev} ${pg}`, s.join(' || ')); }
  }
}
console.log(bad ? `SORUNLU ${bad}` : `baski/ 7 sayfa x 2 ekran TEMIZ (${imgTotal} img elemani)`);
await b.close();
