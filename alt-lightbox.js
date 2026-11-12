/* Alt sayfalardaki fotograflar icin buyutme penceresi (12 Kas 2026).
 * Referanslar, Hakkimizda, hastane sayfasi ve ilce sayfalarindaki ".ref-isler" / ".ilce-isler" fotograflari.
 * Kucuk kopyadan asil fotografi bulur: galeri/k/AD.webp -> AD.webp, images/atolye/AD-k.webp -> images/atolye/AD.webp
 * Tek parmakla sag/sol: onceki/sonraki, asagi: kapat. Iki parmakla yakinlastirma serbest; yakinlastirilmisken kaydirma foto degistirmez.
 */
(function () {
  var css = '#alb{position:fixed;inset:0;z-index:10000;background:#000;display:none;align-items:center;justify-content:center;flex-direction:column;touch-action:pan-y pinch-zoom}' +
    '#alb.acik{display:flex}#alb img{max-width:94vw;max-height:78vh;border-radius:8px;user-select:none;-webkit-user-select:none}' +
    '#alb p{color:#f5f5f7;font:15px/1.4 Inter,system-ui,sans-serif;margin:14px 20px 0;text-align:center;max-width:680px}#alb p small{display:block;color:#a1a1a6;font-size:13px;margin-top:2px}' +
    '#alb button{position:absolute;border:0;background:rgba(255,255,255,.14);color:#fff;width:48px;height:48px;border-radius:50%;font-size:26px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}' +
    '#alb .kapat{top:calc(16px + env(safe-area-inset-top,0px));right:16px}#alb .geri{left:16px;top:50%;transform:translateY(-50%)}#alb .ileri{right:16px;top:50%;transform:translateY(-50%)}' +
    '#alb .sayac{position:absolute;top:calc(28px + env(safe-area-inset-top,0px));left:20px;color:#a1a1a6;font:13px Inter,system-ui,sans-serif}' +
    '.ref-isler figure,.ilce-isler figure{cursor:zoom-in}' +
    '@media (max-width:768px){#alb .geri,#alb .ileri{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var kap = document.createElement('div'); kap.id = 'alb'; kap.setAttribute('role', 'dialog'); kap.setAttribute('aria-modal', 'true'); kap.setAttribute('aria-label', 'Fotoğraf');
  kap.innerHTML = '<span class="sayac"></span><button type="button" class="kapat" aria-label="Kapat">×</button>' +
    '<button type="button" class="geri" aria-label="Önceki">‹</button><button type="button" class="ileri" aria-label="Sonraki">›</button><img alt=""><p></p>';
  document.body.appendChild(kap);
  var img = kap.querySelector('img'), yazi = kap.querySelector('p'), sayac = kap.querySelector('.sayac');
  var liste = [], i = 0, y0 = 0;

  function asil(el) {
    var s = el.getAttribute('data-src') || el.getAttribute('src');
    return s.replace('galeri/k/', '').replace(/-k\.webp$/, '.webp');
  }
  function goster() {
    var f = liste[i], k = f.querySelector('img'), c = f.querySelector('figcaption');
    img.src = asil(k); img.alt = k.alt;
    yazi.textContent = '';
    if (c) {
      var b = c.querySelector('strong'), a = c.querySelector('span');
      if (b) yazi.appendChild(document.createTextNode(b.textContent));
      if (a) { var sm = document.createElement('small'); sm.textContent = a.textContent; yazi.appendChild(sm); }
    }
    sayac.textContent = liste.length > 1 ? (i + 1) + ' / ' + liste.length : '';
  }
  function ac(f) {
    liste = Array.prototype.slice.call(f.parentNode.querySelectorAll('figure')); i = liste.indexOf(f);
    goster(); y0 = window.scrollY; kap.classList.add('acik');
    document.body.style.overflow = 'hidden'; kap.querySelector('.kapat').focus();
  }
  function kapat() { kap.classList.remove('acik'); document.body.style.overflow = ''; img.src = ''; window.scrollTo(0, y0); }
  function git(d) { i = (i + d + liste.length) % liste.length; goster(); }

  document.querySelectorAll('.ref-isler figure, .ilce-isler figure').forEach(function (f) {
    f.setAttribute('tabindex', '0'); f.setAttribute('role', 'button');
    f.addEventListener('click', function () { ac(f); });
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(f); } });
  });
  kap.querySelector('.kapat').addEventListener('click', kapat);
  kap.querySelector('.geri').addEventListener('click', function () { git(-1); });
  kap.querySelector('.ileri').addEventListener('click', function () { git(1); });
  kap.addEventListener('click', function (e) { if (e.target === kap) kapat(); });
  document.addEventListener('keydown', function (e) {
    if (!kap.classList.contains('acik')) return;
    if (e.key === 'Escape') kapat(); else if (e.key === 'ArrowLeft') git(-1); else if (e.key === 'ArrowRight') git(1);
  });
  var tx = 0, ty = 0, cok = false;
  kap.addEventListener('touchstart', function (e) {
    if (e.touches.length > 1) { cok = true; return; }
    cok = false; tx = e.changedTouches[0].screenX; ty = e.changedTouches[0].screenY;
  }, { passive: true });
  kap.addEventListener('touchend', function (e) {
    if (cok || e.touches.length > 0) return;
    if (window.visualViewport && window.visualViewport.scale > 1.05) return;
    var dx = e.changedTouches[0].screenX - tx, dy = e.changedTouches[0].screenY - ty;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) git(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) kapat();
  }, { passive: true });
})();
