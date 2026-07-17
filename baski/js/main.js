(() => {
    'use strict';

    /* ================================================================
       PAGE MAP — her ürünün hangi sayfada olduğu
       ================================================================ */
    const PAGE_MAP = {
        ozelgun:  'ozel-gun.html',
        hediye:   'hediyelik.html',
        vitrin:   'vitrin.html',
        okul:     'okul-kurum.html',
        fason:    'fason-baski.html',
        taraftar: 'taraftar.html'
    };

    /* ================================================================
       EVRENSEL ÜRÜN KATALOĞU — tüm ürünler tek bir dizide
       ================================================================ */
    let urunKatalogu = [];

    function kataloguOlustur() {
        urunKatalogu = [];

        // 1) urunler (ana ürünler)
        if (typeof urunler !== 'undefined') {
            Object.entries(urunler).forEach(([key, val]) => {
                const sayfa = PAGE_MAP[val.kategori] || 'index.html';
                const tumFiyatlar = val.fiyatlar ? val.fiyatlar.filter(f => f.fiyat > 0).map(f => f.fiyat) : [];
                const minFiyat = tumFiyatlar.length ? Math.min(...tumFiyatlar) : 0;
                // zengin arama metni: ad + kisaDesc + uzunDesc + badge + key + etiketler
                const etiketler = val.fiyatlar ? val.fiyatlar.map(f => f.etiket).join(' ') : '';
                const aramaMetni = [
                    val.ad, val.kisaDesc || '', val.uzunDesc || '', val.uzurDesc || '',
                    val.badge || '', key, etiketler,
                    // malzeme adları geçiyorsa
                    'Dekota', 'PVC', 'UV baskı', 'branda', 'poster', 'kanvas',
                    'folyo', 'vinil', 'maket', 'pano', 'afiş', 'pankart',
                    val.kategori || ''
                ].join(' ').toLowerCase().replace(/\s+/g, ' ');
                urunKatalogu.push({
                    key, type: 'urun', sayfa,
                    ad: val.ad, desc: val.kisaDesc || '',
                    img: val.img, badge: val.badge || '',
                    badgeColor: val.badgeColor || '',
                    fiyat: minFiyat,
                    etiket: val.fiyatlar && val.fiyatlar.length ? val.fiyatlar[0].etiket : '',
                    kategoriler: [val.kategori],
                    text: aramaMetni
                });
            });
        }

        // 2) takimMaketleri
        if (typeof takimMaketleri !== 'undefined') {
            Object.entries(takimMaketleri).forEach(([key, val]) => {
                const ek = ['Dekota', 'PVC', 'UV baskı', 'ayaklı', 'maket', 'taraftar', 'takım'];
                const txt = [val.takim, val.tip, val.boy, val.renk || '', key, (val.desc || '').slice(0, 200), ...ek]
                    .join(' ').toLowerCase().replace(/\s+/g, ' ');
                urunKatalogu.push({
                    key, type: 'takim', sayfa: 'taraftar.html',
                    ad: val.takim + ' ' + val.tip,
                    desc: val.boy + ' · ' + (val.desc || '').slice(0, 80),
                    img: val.img, badge: val.takim,
                    badgeColor: val.renk || '#c97700',
                    fiyat: val.fiyat || 0, etiket: val.boy,
                    kategoriler: ['taraftar'], text: txt
                });
            });
        }

        // 3) fasonMalzemeler (Işıklı Vinil, Dekota, Folyo vb.)
        if (typeof fasonMalzemeler !== 'undefined') {
            Object.entries(fasonMalzemeler).forEach(([key, val]) => {
                const birimFiyat = val.fiyat || 0;
                const birimAdi = val.birim === 'EUR' ? 'EUR' : val.birim === 'USD' ? 'USD' : 'TL';
                const txt = [
                    val.ad, key, birimAdi, val.birim || '',
                    val.desc || '', (val.desc || '').slice(0, 300),
                    'fason', 'baskı', 'toptan', 'm²', 'metrekare',
                    'Dekota', 'PVC', 'vinil', 'folyo', 'branda', 'mesh',
                    'UV baskı', 'solvent', 'CNC', 'kesim'
                ].join(' ').toLowerCase().replace(/\s+/g, ' ');
                urunKatalogu.push({
                    key, type: 'fason', sayfa: 'fason-baski.html',
                    ad: val.ad,
                    desc: (val.desc || '').slice(0, 100),
                    img: 'images/fason-baski.svg',
                    badge: 'Fason',
                    badgeColor: '#a85d00',
                    fiyat: birimFiyat,
                    etiket: birimFiyat > 0 ? birimFiyat.toFixed(2) + ' ' + birimAdi + '/m²' : '',
                    kategoriler: ['fason'],
                    text: txt
                });
            });
        }
    }

    /* ================================================================
       MOBİL MENÜ
       ================================================================ */
    const navLinks = document.getElementById('navLinks');
    const navToggle = document.querySelector('.nav-toggle');
    window.toggleNav = function() {
        navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    };
    if (navToggle) {
        navToggle.addEventListener('click', window.toggleNav);
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ================================================================
       EVRENSEL ARAMA SİSTEMİ
       ================================================================ */
    (function() {
        let activeIndex = -1;
        let results = [];

        // overlay HTML
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-overlay-backdrop"></div>
            <div class="search-panel" role="dialog" aria-label="Ürün ara">
                <div class="search-header">
                    <i class="fas fa-search search-panel-icon"></i>
                    <input type="text" id="globalSearchInput" class="search-input"
                           placeholder="Ürün, kategori veya anahtar kelime ara..."
                           autocomplete="off" aria-label="Arama" autofocus>
                    <button class="search-close" id="searchClose" aria-label="Kapat">&times;</button>
                </div>
                <div class="search-results" id="searchResults">
                    <div class="search-hint">🔍 En az 2 karakter yazarak aramaya başla</div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        const backdrop = overlay.querySelector('.search-overlay-backdrop');
        const panel = overlay.querySelector('.search-panel');
        const input = document.getElementById('globalSearchInput');
        const resultsEl = document.getElementById('searchResults');
        const closeBtn = document.getElementById('searchClose');

        // ----- arama butonlarını nav'a ekle -----
        function aramaButonuEkle() {
            const navContainer = document.querySelector('.nav-container');
            if (!navContainer) return;
            if (navContainer.querySelector('.nav-search-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'nav-search-btn';
            btn.setAttribute('aria-label', 'Ara');
            btn.innerHTML = '<i class="fas fa-search"></i>';
            btn.addEventListener('click', (e) => { e.stopPropagation(); ac(); });
            // sipariş butonundan önce ekle
            const wa = navContainer.querySelector('.nav-wa');
            if (wa) wa.parentNode.insertBefore(btn, wa);
            else navContainer.querySelector('.nav-links')?.appendChild(btn);
        }
        aramaButonuEkle();

        // mobil alt bara ara butonu ekle
        try {
            const mb = document.querySelector('.mobile-bar');
            if (mb && !mb.querySelector('.mb-search')) {
                const mBtn = document.createElement('a');
                mBtn.className = 'mb-search';
                mBtn.href = '#';
                mBtn.innerHTML = '<i class="fas fa-search"></i> Ara';
                mBtn.addEventListener('click', (e) => { e.preventDefault(); ac(); });
                mb.insertBefore(mBtn, mb.firstChild);
            }
        } catch(_) {}

        // ----- aramayı aç/kapat -----
        function ac() {
            kataloguOlustur();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => input.focus(), 100);
            activeIndex = -1;
        }
        function kapat() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            input.blur();
        }

        closeBtn.addEventListener('click', kapat);
        backdrop.addEventListener('click', kapat);

        // ----- arama mantığı -----
        function ara(term) {
            const q = term.toLowerCase().trim();
            if (q.length < 2) {
                resultsEl.innerHTML = '<div class="search-hint">🔍 En az 2 karakter yazarak aramaya başla</div>';
                results = [];
                activeIndex = -1;
                return;
            }
            results = urunKatalogu.filter(u => u.text.includes(q)).slice(0, 12);
            activeIndex = -1;
            if (results.length === 0) {
                resultsEl.innerHTML = `
                    <div class="search-no-result">
                        <i class="fas fa-search"></i>
                        <strong>"${q}" için sonuç bulunamadı</strong>
                        <span><a href="https://wa.me/${typeof ILETISIM !== 'undefined' ? ILETISIM.wa : '905079605049'}?text=${encodeURIComponent('Merhaba, "' + q + '" ile ilgili bir ürün arıyorum.')}" target="_blank" class="search-wa-link"><i class="fab fa-whatsapp"></i> WhatsApp'tan sor</a></span>
                    </div>`;
                return;
            }
            resultsEl.innerHTML = results.map((u, i) => {
                const fiyatStr = u.fiyat > 0 ? u.fiyat.toLocaleString('tr-TR') + ' TL' : '';
                const aktif = i === 0 ? ' search-result-active' : '';
                return `<div class="search-result${aktif}" data-index="${i}" tabindex="-1">
                    <img class="search-result-img" src="${u.img}" alt="${u.ad}" loading="lazy">
                    <div class="search-result-body">
                        <strong>${u.ad}</strong>
                        <span class="search-result-desc">${u.desc}</span>
                        <span class="search-result-meta">
                            ${fiyatStr ? '<b>' + fiyatStr + '</b> · ' : ''}
                            <span class="search-result-page">${u.sayfa.replace('.html','')}</span>
                        </span>
                    </div>
                </div>`;
            }).join('');
            // ilkini seç
            const first = resultsEl.querySelector('.search-result');
            if (first) first.classList.add('search-result-active');
        }

        // ----- sonuca tıkla -----
        function sonucaGit(idx) {
            if (idx < 0 || idx >= results.length) return;
            const u = results[idx];
            kapat();
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (u.type === 'takim' && typeof window.takimModalAc === 'function') {
                window.takimModalAc(u.key);
            } else if (u.type === 'urun' && typeof window.urunModalAc === 'function') {
                if (currentPage === u.sayfa || (currentPage === 'index.html' && u.sayfa === 'index.html')) {
                    window.urunModalAc(u.key);
                } else {
                    window.location.href = u.sayfa + '?urun=' + u.key;
                }
            } else if (u.type === 'fason') {
                if (currentPage === 'fason-baski.html') {
                    document.getElementById('hesapla')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = 'fason-baski.html#hesapla';
                }
            }
        }

        // ----- event'ler -----
        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => ara(input.value), 150);
        });

        input.addEventListener('keydown', (e) => {
            const items = resultsEl.querySelectorAll('.search-result');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = Math.min(activeIndex + 1, items.length - 1);
                items.forEach((el, i) => el.classList.toggle('search-result-active', i === activeIndex));
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = Math.max(activeIndex - 1, 0);
                items.forEach((el, i) => el.classList.toggle('search-result-active', i === activeIndex));
                items[activeIndex]?.scrollIntoView({ block: 'nearest' });
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0) sonucaGit(activeIndex);
                else sonucaGit(0);
            } else if (e.key === 'Escape') {
                kapat();
            }
        });

        // click delegation on results
        resultsEl.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result');
            if (item) {
                const idx = parseInt(item.dataset.index);
                sonucaGit(idx);
            }
        });

        // CTRL+K / CMD+K ile aç
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (overlay.classList.contains('active')) kapat();
                else ac();
            }
            // herhangi bir tuşa basınca (input focus değilse) aramayı aç
            if (!overlay.classList.contains('active') && !e.ctrlKey && !e.metaKey && !e.altKey
                && e.key.length === 1 && !e.target.closest('input, textarea, select, [contenteditable]')) {
                ac();
                // karakteri input'a yaz
                setTimeout(() => { input.value = e.key; ara(e.key); }, 50);
            }
        });

        // sayfa loader'ı hazır olunca katalog oluştur
        if (document.readyState === 'complete') kataloguOlustur();
        else window.addEventListener('load', kataloguOlustur);

        // data.js yüklendikten sonra da dene
        let katalogRetry = 0;
        const katalogInterval = setInterval(() => {
            if (urunKatalogu.length > 0 || katalogRetry > 20) { clearInterval(katalogInterval); return; }
            kataloguOlustur();
            katalogRetry++;
        }, 300);
    })();

    /* ================================================================
       SSS
       ================================================================ */
    window.toggleFaqSection = function(el) {
        const section = el.parentElement;
        const body = section.querySelector('.faq-body');
        const isOpen = body.classList.contains('open');
        body.classList.toggle('open');
        section.classList.toggle('active');
        el.querySelector('.faq-title-icon')?.setAttribute('aria-expanded', !isOpen);
    };
    window.toggleFaq = function(el) {
        const answer = el.querySelector('.faq-answer');
        const isOpen = answer.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('open');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
            answer.classList.add('open');
            el.classList.add('active');
            el.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    };

    /* ================================================================
       MODAL SİSTEMİ
       ================================================================ */
    let aktifUrunKey = null;
    window.urunModalAc = function(key) {
        if (typeof urunler === 'undefined' || !urunler[key]) return;
        const u = urunler[key];
        aktifUrunKey = key;
        document.getElementById('umTitle').textContent = u.ad;
        document.getElementById('umDesc').textContent = u.uzunDesc;
        document.getElementById('umImg').src = u.img;
        document.getElementById('umImg').alt = u.ad;
        document.getElementById('umNot').textContent = u.notlar || '';
        const sel = document.getElementById('umSize');
        sel.innerHTML = u.fiyatlar.map((f, i) =>
            `<option value="${i}">${f.etiket}${f.fiyat > 0 ? ' — ' + f.fiyat.toLocaleString('tr-TR') + ' TL' : ''}</option>`
        ).join('');
        umFiyatGuncelle();
        document.getElementById('urunModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        const url = new URL(window.location);
        url.searchParams.set('urun', key);
        window.history.pushState({}, '', url);
        if (window.__analytics) window.__analytics('view_item', { item: key, name: u.ad });
    };
    window.umFiyatGuncelle = function() {
        const u = urunler[aktifUrunKey];
        if (!u) return;
        const idx = parseInt(document.getElementById('umSize').value) || 0;
        const f = u.fiyatlar[idx];
        document.getElementById('umPrice').textContent = f.fiyat > 0
            ? f.fiyat.toLocaleString('tr-TR') + ' TL (KDV Dahil)'
            : 'Fiyat için teklif alın';
        let msg = 'Merhaba Uzman Reklam 👋\n\nSipariş vermek istiyorum:\n\n'
            + '📦 Ürün: ' + u.ad + '\n'
            + '📐 Seçenek: ' + f.etiket + '\n'
            + (f.fiyat > 0 ? '💰 Fiyat: ' + f.fiyat.toLocaleString('tr-TR') + ' TL\n' : '')
            + (u.waEk ? '\n📅 ' + u.waEk + '\n' : '')
            + '\nFotoğraf ve bilgileri bu mesajın ardından gönderiyorum.';
        document.getElementById('umWaBtn').href = 'https://wa.me/' + ILETISIM.wa + '?text=' + encodeURIComponent(msg);
    };
    window.urunModalKapat = function() {
        document.getElementById('urunModal').classList.remove('active');
        document.body.style.overflow = '';
        const url = new URL(window.location);
        url.searchParams.delete('urun');
        window.history.pushState({}, '', url);
    };

    // ---------- TARAFTAR MODALI ----------
    let aktifTakimKey = null;
    window.takimModalAc = function(key) {
        if (typeof takimMaketleri === 'undefined' || !takimMaketleri[key]) return;
        const u = takimMaketleri[key];
        aktifTakimKey = key;
        document.getElementById('tmTitle').textContent = u.takim + ' ' + u.tip;
        document.getElementById('tmDesc').textContent = u.desc;
        document.getElementById('tmPrice').textContent = u.fiyat.toLocaleString('tr-TR') + ' TL (KDV Dahil)';
        document.getElementById('tmImg').src = u.img;
        document.getElementById('tmImg').alt = u.takim + ' ' + u.tip + ' ' + u.boy;
        const msg = 'Merhaba Uzman Reklam 👋\n\n' + u.takim + ' ' + u.tip + ' (' + u.boy + ') sipariş etmek istiyorum.\n💰 Fiyat: ' + u.fiyat.toLocaleString('tr-TR') + ' TL';
        document.getElementById('tmWaBtn').href = 'https://wa.me/' + ILETISIM.wa + '?text=' + encodeURIComponent(msg);
        document.getElementById('takimModal').classList.add('active');
        document.body.style.overflow = 'hidden';
        const url = new URL(window.location);
        url.searchParams.set('urun', key);
        window.history.pushState({}, '', url);
        if (window.__analytics) window.__analytics('view_item', { item: key, name: u.takim + ' ' + u.tip });
    };
    window.takimModalKapat = function() {
        document.getElementById('takimModal').classList.remove('active');
        document.body.style.overflow = '';
        const url = new URL(window.location);
        url.searchParams.delete('urun');
        window.history.pushState({}, '', url);
    };

    /* ================================================================
       EVRENSEL KLAVYE / MODAL KONTROLLERİ
       ================================================================ */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(m => {
                m.querySelector('.modal-close')?.click();
            });
        }
    });
    document.querySelectorAll('.modal-overlay').forEach(m => {
        m.addEventListener('click', (e) => { if (e.target === m) m.querySelector('.modal-close')?.click(); });
    });

    /* ================================================================
       SWIPE-DOWN GESTURE
       ================================================================ */
    (function() {
        let startY, startScroll;
        document.addEventListener('touchstart', (e) => {
            const modal = e.target.closest('.modal-overlay.active');
            if (!modal) { startY = null; return; }
            const box = modal.querySelector('.modal-box');
            if (!box) { startY = null; return; }
            startScroll = box.scrollTop;
            if (startScroll > 0) { startY = null; return; }
            startY = e.touches[0].clientY;
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (startY === null) return;
            if (e.touches[0].clientY - startY > 80) {
                document.querySelectorAll('.modal-overlay.active').forEach(m => {
                    m.querySelector('.modal-close')?.click();
                });
                startY = null;
            }
        }, { passive: true });
        document.addEventListener('touchend', () => { startY = null; }, { passive: true });
    })();

    /* ================================================================
       SCROLL TO TOP
       ================================================================ */
    (function() {
        const btn = document.createElement('button');
        btn.className = 'scroll-top';
        btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        btn.setAttribute('aria-label', 'Yukarı çık');
        document.body.appendChild(btn);
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => { btn.classList.toggle('visible', window.scrollY > 400); ticking = false; });
                ticking = true;
            }
        }, { passive: true });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    })();

    /* ================================================================
       SMOOTH SCROLL (anchor)
       ================================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop) || 80;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
            }
        });
    });

    /* ================================================================
       URL'DEN MODAL AÇMA
       ================================================================ */
    window.addEventListener('load', () => {
        const params = new URLSearchParams(window.location.search);
        const key = params.get('urun');
        if (key) {
            setTimeout(() => {
                if (typeof urunler !== 'undefined' && urunler[key]) window.urunModalAc(key);
                else if (typeof takimMaketleri !== 'undefined' && takimMaketleri[key]) window.takimModalAc(key);
            }, 400);
        }
        // entrance
        document.querySelectorAll('.step-box, .product-card, .gate, .faq-item').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(18px)';
            el.style.transition = `all 0.5s ease ${Math.min(i * 0.05, 0.6)}s`;
            setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 100 + Math.min(i * 45, 500));
        });
    });

    /* ================================================================
       KLAVYE ERİŞİLEBİLİRLİK
       ================================================================ */
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.product-card, .faq-item').forEach(el => {
            if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
            if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const target = e.target.closest('.product-card, .faq-item');
        if (!target) return;
        e.preventDefault();
        target.click();
    });

    /* ================================================================
       FASON HESAPLAYICI
       ================================================================ */
    window.hesaplayiciKur = function() {
        const malzemeSel = document.getElementById('malzeme');
        if (!malzemeSel || typeof fasonMalzemeler === 'undefined') return;
        malzemeSel.innerHTML = Object.entries(fasonMalzemeler)
            .filter(([k, v]) => v.birim !== 'TL')
            .map(([k, v]) => `<option value="${k}">${v.ad}</option>`).join('');
        document.querySelectorAll('.quick-size-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.getElementById('en').value = this.dataset.en;
                document.getElementById('boy').value = this.dataset.boy;
                document.querySelectorAll('.quick-size-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                onizlemeGuncelle(); fiyatHesapla();
            });
        });
        ['en','boy'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => { onizlemeGuncelle(); fiyatHesapla(); });
        });
        malzemeSel.addEventListener('change', fiyatHesapla);
        onizlemeGuncelle(); fiyatHesapla();
    };
    window.onizlemeGuncelle = function() {
        const en = parseFloat(document.getElementById('en').value) || 0;
        const boy = parseFloat(document.getElementById('boy').value) || 0;
        const kutu = document.getElementById('onizleme');
        const dimText = document.getElementById('previewDimensions');
        if (en <= 0 || boy <= 0) {
            kutu.style.width = '20px'; kutu.style.height = '14px';
            kutu.textContent = ''; dimText.textContent = '0.00 m²';
            return;
        }
        const m2 = (en * boy) / 10000;
        dimText.textContent = m2.toFixed(2) + ' m²';
        const maxG = 220, maxY = 90, oran = en / boy;
        let w = oran >= maxG / maxY ? maxG : maxY * oran;
        let h = oran >= maxG / maxY ? maxG / oran : maxY;
        kutu.style.width = Math.max(w, 24) + 'px';
        kutu.style.height = Math.max(h, 16) + 'px';
        kutu.textContent = en + '×' + boy;
    };
    window.fiyatHesapla = function() {
        if (typeof fasonMalzemeler === 'undefined' || typeof KUR_USD === 'undefined') return;
        const key = document.getElementById('malzeme').value;
        const en = parseFloat(document.getElementById('en').value);
        const boy = parseFloat(document.getElementById('boy').value);
        const urun = fasonMalzemeler[key];
        const sonuc = document.getElementById('sonuc');
        if (!en || !boy || en <= 0 || boy <= 0) {
            sonuc.innerHTML = '<div class="price" style="color:#ff6b6b;">—</div><div class="detail">Lütfen geçerli en ve boy girin.</div><div class="calc-note">* KDV hariç</div>';
            return;
        }
        const m2 = (en * boy) / 10000;
        const kur = urun.birim === 'EUR' ? KUR_EUR : KUR_USD;
        let toplamTL = urun.fiyat * kur * m2;
        if (toplamTL < 50) toplamTL = 50;
        const waMsg = encodeURIComponent('Merhaba Uzman Reklam 👋\n\nFason baskı siparişi vermek istiyorum:\n\n📦 Ürün: ' + urun.ad + '\n📐 Ölçü: ' + en + '×' + boy + ' cm\n📊 Alan: ' + m2.toFixed(2) + ' m²\n💰 Tahmini: ' + toplamTL.toFixed(0) + ' TL (KDV hariç)\n\nTasarım dosyam hazır, WhatsApp\'tan gönderiyorum.');
        sonuc.innerHTML = '<div class="price">' + toplamTL.toFixed(0) + ' <small>TL</small></div><div class="detail">📐 ' + m2.toFixed(2) + ' m² · ' + urun.ad + ' · ' + en + '×' + boy + ' cm</div><a href="https://wa.me/' + ILETISIM.wa + '?text=' + waMsg + '" target="_blank" rel="noopener" class="btn-wa"><i class="fab fa-whatsapp"></i> WhatsApp ile Sipariş Ver</a><div class="calc-note">* KDV hariç tahmini fiyattır; kesin tutar WhatsApp\'ta teyit edilir. Kargo ücreti ölçü ve şehre göre siparişte netleşir.</div>';
    };
    window.malzemeModalAc = function(key) {
        if (typeof fasonMalzemeler === 'undefined' || !fasonMalzemeler[key]) return;
        const u = fasonMalzemeler[key];
        let fiyatGoster;
        if (u.birim === 'TL') fiyatGoster = u.fiyat.toLocaleString('tr-TR') + ' TL (KDV Dahil)';
        else { const kur = u.birim === 'EUR' ? KUR_EUR : KUR_USD; fiyatGoster = '~' + (u.fiyat * kur).toFixed(0) + ' TL /m² (KDV Hariç)'; }
        document.getElementById('mmTitle').textContent = u.ad;
        document.getElementById('mmDesc').textContent = u.desc;
        document.getElementById('mmPrice').textContent = fiyatGoster;
        const msg = 'Merhaba Uzman Reklam 👋\n\nFason baskı siparişi vermek istiyorum:\n\n📦 Ürün: ' + u.ad + '\n📐 Ölçü: Belirtilecek\n💰 Fiyat: ' + fiyatGoster + '\n\nTasarım dosyam hazır, gönderebilirim.';
        document.getElementById('mmWaBtn').href = 'https://wa.me/' + ILETISIM.wa + '?text=' + encodeURIComponent(msg);
        document.getElementById('malzemeModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    window.malzemeModalKapat = function() { document.getElementById('malzemeModal').classList.remove('active'); document.body.style.overflow = ''; };

    /* ================================================================
       TOAST
       ================================================================ */
    window.gosterToast = function(msg, icon) {
        let t = document.getElementById('toast');
        if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
        t.innerHTML = (icon || '📋') + ' ' + msg;
        t.classList.add('show');
        clearTimeout(t._timer);
        t._timer = setTimeout(() => t.classList.remove('show'), 2500);
    };

    /* ================================================================
       PAYLAŞ
       ================================================================ */
    window.urunPaylas = function(key, tip) {
        let u, ad, fiyatStr;
        if (tip === 'takim') {
            u = takimMaketleri[key];
            ad = u.takim + ' ' + u.tip;
            fiyatStr = u.fiyat.toLocaleString('tr-TR') + ' TL';
        } else {
            u = urunler[key]; if (!u) return;
            ad = u.ad;
            const fx = u.fiyatlar.filter(f => f.fiyat > 0);
            fiyatStr = fx.length ? Math.min(...fx.map(f => f.fiyat)).toLocaleString('tr-TR') + ' TL' + (fx.length > 1 ? "'den başlayan" : '') : 'Teklif Alın';
        }
        const url = window.location.origin + window.location.pathname + '?urun=' + key;
        const msg = ad + '\n' + fiyatStr + '\n🔗 ' + url;
        if (navigator.share) navigator.share({ title: ad, text: msg, url }).catch(() => {});
        else navigator.clipboard.writeText(msg).then(() => gosterToast('Ürün bilgisi kopyalandı!')).catch(() => {});
    };

    /* ================================================================
       REVEAL ANIMATION
       ================================================================ */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

    /* ================================================================
       COOKIE CONSENT
       ================================================================ */
    (function() {
        if (localStorage.getItem('cookieConsent')) return;
        const div = document.createElement('div');
        div.className = 'cookie-consent';
        div.innerHTML = '<div class="cookie-inner"><p><i class="fas fa-cookie-bite" style="color:var(--primary);margin-right:6px"></i> Sitemizde en iyi deneyimi sunmak için çerezler kullanıyoruz. Devam ederek çerez kullanımını kabul etmiş olursunuz.</p><button class="btn-cookie" id="cookieAccept">Kabul Et</button></div>';
        document.body.appendChild(div);
        requestAnimationFrame(() => div.classList.add('show'));
        document.getElementById('cookieAccept').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            div.classList.remove('show');
            setTimeout(() => div.remove(), 400);
        });
    })();

    /* ================================================================
       ANALYTICS + PERFORMANCE (Trendyol Mergen benzeri)
       ================================================================ */
    (function() {
        // Analytics
        const events = [];
        window.__analytics = function(action, data) {
            events.push({ action, data, time: Date.now() });
            console.log('[📊 Analytics]', action, data);
            // navigator.sendBeacon('/api/analytics', JSON.stringify({ action, data }));
        };
        window.__analytics('page_view', { path: window.location.pathname, title: document.title });

        document.addEventListener('click', (e) => {
            const wa = e.target.closest('[href*="wa.me"]');
            if (wa) { window.__analytics('whatsapp_click', { text: wa.textContent.trim().slice(0, 50) }); return; }
            const product = e.target.closest('.product-card');
            if (product) window.__analytics('product_click', { name: product.querySelector('h3')?.textContent?.trim() || 'unknown' });
        }, { passive: true });

        // ---------- Web Vitals (LCP, CLS, FID) ----------
        try {
            if ('PerformanceObserver' in window) {
                // LCP
                const lcpObs = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const last = entries[entries.length - 1];
                    window.__analytics('web_vital', { metric: 'LCP', value: last.startTime.toFixed(0) + 'ms' });
                });
                lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });

                // CLS
                let clsValue = 0;
                const clsObs = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) clsValue += entry.value;
                    }
                    window.__analytics('web_vital', { metric: 'CLS', value: clsValue.toFixed(3) });
                });
                clsObs.observe({ type: 'layout-shift', buffered: true });

                // FID
                const fidObs = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        window.__analytics('web_vital', { metric: 'FID', value: entry.processingStart.toFixed(0) + 'ms' });
                    }
                });
                fidObs.observe({ type: 'first-input', buffered: true });
            }

            // Navigation Timing
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perf = performance.getEntriesByType('navigation')[0];
                    if (perf) {
                        window.__analytics('perf', {
                            ttfb: (perf.responseStart - perf.requestStart).toFixed(0) + 'ms',
                            domLoaded: (perf.domContentLoadedEventEnd - perf.fetchStart).toFixed(0) + 'ms',
                            loadTime: (perf.loadEventEnd - perf.fetchStart).toFixed(0) + 'ms'
                        });
                    }
                }, 0);
            });
        } catch (e) { console.warn('[Perf]', e.message); }

        // ---------- Error Tracking (Trendyol Mergen error wrapping) ----------
        window.addEventListener('error', (e) => {
            window.__analytics('error', { message: e.message, filename: e.filename?.split('/').pop(), lineno: e.lineno });
        });
        window.addEventListener('unhandledrejection', (e) => {
            window.__analytics('error', { message: 'Unhandled: ' + (e.reason?.message || e.reason) });
        });

        // ---------- A/B Test Framework (basit cookie-based) ----------
        window.__abTest = function(name, variants) {
            const key = '_ab_' + name;
            let selected = localStorage.getItem(key);
            if (!selected || !variants.includes(selected)) {
                selected = variants[Math.floor(Math.random() * variants.length)];
                localStorage.setItem(key, selected);
            }
            document.documentElement.setAttribute('data-ab-' + name, selected);
            window.__analytics('ab_test', { name, variant: selected });
            return selected;
        };
        // Örnek: window.__abTest('hero_layout', ['v1', 'v2']);
    })();

})();
