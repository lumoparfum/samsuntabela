// Ana sayfa + ilce sayfasi etkilesimleri (telefon ve PC): galeri filtre/arama/"daha fazla", lightbox ileri/Esc/kapanma,
// mobil menu, SSS, gizlilik/KVKK penceresi, Sinop lightbox, panel acilisi.  Kullanim: node etkilesim.mjs https://samsuntabela.tr/
import { chromium, devices } from 'playwright';
const BASE = process.argv[2] || 'https://samsuntabela.tr/';
const b = await chromium.launch(); let hata = 0;
const kontrol = (ad, ok, ek = '') => { if (!ok) hata++; console.log((ok ? '✓ ' : '⚠ ') + ad + (ek ? '  ' + ek : '')); };
for (const [dev, opts] of [['mobil', devices['iPhone 14']], ['pc', { viewport: { width: 1440, height: 900 } }]]) {
  const p = await (await b.newContext({ ...opts, locale: 'tr-TR' })).newPage();
  const js = []; p.on('pageerror', e => js.push(e.message));
  await p.goto(BASE + '?t=' + Date.now(), { waitUntil: 'networkidle' });
  const toplam = await p.locator('.work-card').count();
  await p.click('.filter-btn[data-cat="totem"]'); await p.waitForTimeout(300);
  const totem = await p.locator('.work-card:visible').count();
  kontrol(`${dev}: galeri filtre (totem)`, totem > 0 && totem < toplam, `${totem}/${toplam}`);
  await p.click('.filter-btn[data-cat="all"]');
  await p.fill('#gallerySearch', 'medibafra'); await p.waitForTimeout(400);
  kontrol(`${dev}: arama "medibafra"`, (await p.locator('.work-card:visible').count()) > 0);
  await p.fill('#gallerySearch', 'zzzzqq'); await p.waitForTimeout(400);
  kontrol(`${dev}: sonuc yok mesaji`, (await p.locator('#noResults:visible').count()) === 1);
  await p.fill('#gallerySearch', ''); await p.waitForTimeout(400);
  const once = await p.locator('.work-card:visible').count(); await p.click('#dahaFazlaBtn'); await p.waitForTimeout(400);
  kontrol(`${dev}: "Daha fazla goster"`, (await p.locator('.work-card:visible').count()) > once);
  await p.locator('.work-card:visible').nth(2).click(); await p.waitForTimeout(400);
  const s1 = await p.$eval('#lb-img', e => e.src); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  const s2 = await p.$eval('#lb-img', e => e.src);
  kontrol(`${dev}: lightbox ileri`, s1 !== s2);
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  kontrol(`${dev}: lightbox kapanir`, await p.$eval('#lightbox', e => getComputedStyle(e).display === 'none') && await p.evaluate(() => document.body.style.position === ''));
  await p.evaluate(() => openSubPage('modal-gizlilik')); await p.waitForTimeout(300);
  kontrol(`${dev}: gizlilik penceresi`, (await p.locator('#modal-gizlilik.active').count()) === 1);
  await p.evaluate(() => { document.getElementById('modal-gizlilik').classList.remove('active'); document.body.style.position = ''; });
  await p.goto(BASE + 'sinop-reklamci-ve-tabelaci.html?t=' + Date.now(), { waitUntil: 'networkidle' });
  await p.locator('.ref-item').first().click(); await p.waitForTimeout(400);
  kontrol(`${dev}: Sinop lightbox`, await p.evaluate(() => { const l = document.getElementById('lightbox'), i = document.getElementById('lb-img'); return getComputedStyle(l).display !== 'none' && i.naturalWidth > 0; }));
  await p.goto(BASE + 'panel/?t=' + Date.now(), { waitUntil: 'networkidle' });
  kontrol(`${dev}: panel acilir`, (await p.locator('#tokenInput').isVisible()) || (await p.locator('.card').count()) > 0);
  kontrol(`${dev}: JS hatasi yok`, js.length === 0, js.join(' | '));
}
console.log(hata ? `SORUNLU: ${hata}` : 'ETKILESIMLER TEMIZ');
await b.close();
