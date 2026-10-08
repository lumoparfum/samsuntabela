// Tek sayfanin telefon + PC ekran goruntusu: node ekran-goruntusu.mjs <url> <etiket>  (cikti: audit/<etiket>-mobil|pc.png)
import { mkdirSync } from 'node:fs'; mkdirSync('audit', { recursive: true });
import { chromium, devices } from 'playwright';
const url = process.argv[2], tag = process.argv[3];
const b = await chromium.launch();
for (const [n, o] of [['mobil', devices['iPhone 14']], ['pc', { viewport: { width: 1440, height: 900 } }]]) {
  const p = await (await b.newContext({ ...o, locale: 'tr-TR' })).newPage();
  const fails = []; p.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url().replace('https://samsuntabela.tr', '')); });
  await p.goto(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.screenshot({ path: `audit/${tag}-${n}.png` });
  console.log(n, 'kirik istekler:', fails);
}
await b.close();
