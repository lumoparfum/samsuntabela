// Her sayfada wa.me baglantilari yalniz 905079605049 (WhatsApp, 11 Kas 2026) mi; telefon 0532 220 46 49, eski numara gorunuyor mu. Kullanim: node numara.mjs https://samsuntabela.tr/
import { chromium, devices } from 'playwright';
const BASE = process.argv[2];
const PAGES = ['', 'samsun-reklamci-ve-tabelaci.html', 'atakum-reklamci-ve-tabelaci.html', 'bafra-reklamci-ve-tabelaci.html', 'sinop-reklamci-ve-tabelaci.html', 'ordu-reklamci-ve-tabelaci.html', 'trabzon-reklamci-ve-tabelaci.html', 'referanslar.html', 'hakkimizda.html', 'hastane-tabela-ve-yonlendirme.html', 'kutu-harf-tabela.html', 'totem-tabela.html', 'bayi-tabelasi.html', 'kamu-kurumu-tabela.html', 'baski.html', 'baski/index.html', 'baski/fason-baski.html', 'baski/hediyelik.html', 'baski/okul-kurum.html', 'baski/ozel-gun.html', 'baski/taraftar.html', 'baski/vitrin.html'];
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
    return { waSayisi: wa.length, waFarkli: [...new Set(wa)], tel: [...new Set(tel)], eskiGorunuyor: [...(document.documentElement.innerHTML.match(/0?\s?5\d\d[\s.]?\d{3}[\s.]?\d{2}[\s.]?\d{2}|90\s?5\d{9}/g) || [])].some(n => !/^(0?\s?532[\s.]?220[\s.]?46[\s.]?49|90\s?5322204649|0?\s?507[\s.]?960[\s.]?50[\s.]?49|90\s?5079605049)$/.test(n.trim())) };
  });
  const bad = r.waFarkli.some(x => x !== '905079605049') || r.eskiGorunuyor || errs.length || fails.some(f => !/google|gtag|analytics|mp4/.test(f));
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
