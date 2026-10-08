// Her sayfada wa.me baglantilari yalniz 905322204649 mi, eski numara gorunuyor mu. Kullanim: node numara.mjs https://samsuntabela.tr/
import { chromium, devices } from 'playwright';
const BASE = process.argv[2];
const PAGES = ['', 'samsun-reklamci-ve-tabelaci.html', 'atakum-reklamci-ve-tabelaci.html', 'bafra-reklamci-ve-tabelaci.html', 'sinop-reklamci-ve-tabelaci.html', 'ordu-reklamci-ve-tabelaci.html', 'trabzon-reklamci-ve-tabelaci.html', 'baski.html', 'baski/index.html', 'baski/fason-baski.html', 'baski/hediyelik.html', 'baski/okul-kurum.html', 'baski/ozel-gun.html', 'baski/taraftar.html', 'baski/vitrin.html'];
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices['iPhone 14'], locale: 'tr-TR' })).newPage();
let sorun = 0;
for (const pg of PAGES) {
  const errs = [], fails = [];
  p.removeAllListeners('pageerror'); p.removeAllListeners('response');
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url().replace(BASE, '/')); });
  await p.goto(BASE + pg + '?t=' + Date.now(), { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map(a => a.href.match(/wa\.me\/(\d*)/)[1]);
    const tel = [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href'));
    const txt = document.body.innerText;
    return { waSayisi: wa.length, waFarkli: [...new Set(wa)], tel: [...new Set(tel)], eskiGorunuyor: /0507|507 960|0501 667/.test(txt) };
  });
  const bad = r.waFarkli.some(x => x !== '905322204649') || r.eskiGorunuyor || errs.length || fails.some(f => !/google|gtag|analytics|mp4/.test(f));
  if (bad) sorun++;
  console.log((bad ? '⚠ ' : '✓ ') + (pg || 'index').padEnd(34), JSON.stringify(r), errs.length ? 'JS:' + errs : '', fails.length ? 'FAIL:' + fails.join(',') : '');
}
// baski/ modali + hesaplayici: dinamik WhatsApp linkleri
await p.goto(BASE + 'baski.html?t=' + Date.now(), { waitUntil: 'networkidle' });
await p.locator('.product-card').first().click(); await p.waitForTimeout(500);
console.log('baski.html modal wa:', await p.evaluate(() => { const a = document.getElementById('modalWaBtn'); return a ? a.href.slice(0, 40) : 'yok'; }));
await p.goto(BASE + 'baski/index.html?t=' + Date.now(), { waitUntil: 'networkidle' });
const dyn = await p.evaluate(() => typeof ILETISIM !== 'undefined' ? ILETISIM.wa : 'ILETISIM yok');
console.log('baski/ ILETISIM.wa =', dyn);
console.log(sorun ? `SORUNLU SAYFA: ${sorun}` : 'HEPSI TEMIZ');
await b.close();
