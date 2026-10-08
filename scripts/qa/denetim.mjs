// Tum sayfalar x 3 ekran (iPhone 14, iPhone SE, PC): JS hatasi, 4xx istek, kirik gorsel, yatay tasma, h1, eski numara, TC kimlik.
import { chromium, devices } from 'playwright';
const BASE = process.argv[2] || 'https://samsuntabela.tr/';   // yerelde: node denetim.mjs http://127.0.0.1:8765/
const PAGES = ['', 'samsun-reklamci-ve-tabelaci.html', 'atakum-reklamci-ve-tabelaci.html', 'bafra-reklamci-ve-tabelaci.html', 'sinop-reklamci-ve-tabelaci.html', 'ordu-reklamci-ve-tabelaci.html', 'trabzon-reklamci-ve-tabelaci.html', 'baski.html', 'baski/index.html', 'baski/fason-baski.html', 'baski/hediyelik.html', 'baski/okul-kurum.html', 'baski/ozel-gun.html', 'baski/taraftar.html', 'baski/vitrin.html'];
const b = await chromium.launch(); let toplam = 0;
for (const [dev, opts] of [['mobil', devices['iPhone 14']], ['se', devices['iPhone SE']], ['pc', { viewport: { width: 1440, height: 900 } }]]) {
  const page = await (await b.newContext({ ...opts, locale: 'tr-TR' })).newPage();
  for (const pg of PAGES) {
    const js = [], fail = [];
    page.removeAllListeners('pageerror'); page.removeAllListeners('response'); page.removeAllListeners('requestfailed');
    page.on('pageerror', e => js.push(e.message));
    page.on('response', r => { if (r.status() >= 400) fail.push(r.status() + ' ' + r.url().replace(BASE, '/')); });
    await page.goto(BASE + pg + '?qa=' + Date.now(), { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 90)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
      kirikImg: [...document.images].filter(i => i.src && !i.src.startsWith('data:') && i.complete && i.naturalWidth === 0 && getComputedStyle(i).display !== 'none').map(i => i.getAttribute('src')),
      yatay: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll('h1').length,
      eski: /0507|507 960|0501 667/.test(document.documentElement.innerHTML),
      tcKimlik: /214\s?7659\s?4794/.test(document.documentElement.innerHTML),
    }));
    const sorun = [];
    if (js.length) sorun.push('JS:' + js.join('|'));
    if (fail.length) sorun.push('istek:' + fail.join(','));
    if (r.kirikImg.length) sorun.push('kirikImg:' + r.kirikImg.join(','));
    if (r.yatay > 1) sorun.push('yatayTasma:' + r.yatay);
    if (r.h1 < 1) sorun.push('h1 yok');
    if (r.eski) sorun.push('ESKI NUMARA');
    if (r.tcKimlik) sorun.push('TC KIMLIK GORUNUYOR');
    if (sorun.length) { toplam++; console.log(`⚠ ${dev.padEnd(6)} ${(pg || 'index').padEnd(30)} ${sorun.join(' || ')}`); }
  }
}
console.log(toplam ? `SORUNLU: ${toplam}` : `45 sayfa/ekran kombinasyonu TEMIZ (15 sayfa × 3 ekran)`);
await b.close();
