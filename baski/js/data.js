/* ============================================================
   ÜRÜN & FİYAT VERİLERİ — TEK DOSYADAN YÖNETİM
   ------------------------------------------------------------
   !!! ÖNEMLİ: Yeni ürünlerin fiyatları ÖRNEK/TASLAK değerlerdir.
   Kendi maliyetine göre bu dosyadan güncelle. Her ürünün
   "fiyatlar" listesindeki rakamları değiştirmen yeterli —
   site ve WhatsApp mesajları otomatik güncellenir.
   ============================================================ */

// ---------- İLETİŞİM ----------
const ILETISIM = {
    wa: "905079605049",
    tel: "05322204649",
    telHref: "tel:05322204649",
    instagram: "https://www.instagram.com/uzman.reklamm/",
    adres: "Emirefendi Mh. Çizmeli 2.Sk. No:33, Bafra/Samsun"
};

// ---------- DÖVİZ KURLARI (fason hesaplayıcı için) ----------
// Kurlar değiştikçe buradan güncelle
const KUR_USD = 46.98;
const KUR_EUR = 53.72;

// ---------- FASON MALZEME FİYATLARI (m² bazlı) ----------
const fasonMalzemeler = {
    ince_vinil:         { ad: 'İnce Vinil',           fiyat: 1.80,  birim: 'USD', desc: 'İnce vinil, Konica Solvent baskı teknolojisi ile üretilir. Dış mekan reklamlarında, araç giydirmede ve mağaza vitrinlerinde sıklıkla kullanılır. Esnek yapısı sayesinde düz olmayan yüzeylere kolayca uygulanır. Ekonomik fiyatıyla bütçe dostudur, 2-3 yıl dayanıklılık sunar.' },
    normal_vinil:       { ad: 'Normal Vinil',         fiyat: 2.35,  birim: 'USD', desc: 'Normal vinil, günlük kullanım için ideal bir dış mekan malzemesidir. Konica Solvent baskı ile canlı renkler elde edilir. Tabelalar, araç giydirme ve duvar reklamlarında tercih edilir. 3-4 yıl boyunca ilk günkü parlaklığını korur.' },
    avrupa_vinil:       { ad: 'Avrupa Vinil',         fiyat: 2.70,  birim: 'USD', desc: 'Avrupa vinili, yüksek kaliteli hammaddeden üretilir. UV ışınlarına karşı üstün direnç gösterir, renk solması minimum seviyededir. Uzun ömürlü projeler (4-5 yıl) için idealdir.' },
    arkasi_siyah_vinil: { ad: 'Arkası Siyah Vinil',   fiyat: 2.95,  birim: 'USD', desc: 'Arkası siyah vinil, opak görünümlü ve ışık geçirmez özelliğe sahiptir. Arkadan aydınlatmalı tabelalarda ve ışık sızmasının istenmediği projelerde kullanılır.' },
    mesh_vinil:         { ad: 'Mesh Vinil',           fiyat: 3.15,  birim: 'USD', desc: 'Mesh vinil, delikli yapısı sayesinde rüzgarı geçirir; bina cepheleri ve iskele üzeri uygulamalarda güvenle kullanılır. Tek yönlü görüş özelliği ile cam giydirmede de tercih edilir.' },
    isikli_vinil:       { ad: 'Işıklı Vinil',         fiyat: 4.75,  birim: 'USD', desc: 'Işıklı vinil, arkadan aydınlatmalı tabelalar için özel üretilir. Işığı homojen dağıtır; gece-gündüz etkileyici görünüm sağlar.' },
    frimpeks_folyo:     { ad: 'Frimpeks Folyo',       fiyat: 2.75,  birim: 'EUR', desc: 'Frimpeks folyo, solvent bazlı baskı ile üretilir. Araç giydirme, iç mekan duvar kaplama ve vitrin dekorasyonunda kullanılır. Renk canlılığı ve yapışma gücü yüksektir.' },
    frimpeks_gri_folyo: { ad: 'Frimpeks Arkası Gri',  fiyat: 2.80,  birim: 'EUR', desc: 'Arkası gri opak katman sayesinde ışık sızması engellenir. Ofis içi yönlendirme ve kurumsal kimlik çalışmalarında idealdir.' },
    unifol_folyo:       { ad: 'Unifol Folyo',         fiyat: 3.30,  birim: 'EUR', desc: 'Unifol folyo, yüksek parlaklık ve renk doygunluğu sunar. Araç giydirme, mağaza vitrini ve fuar standlarında tercih edilir. 3-4 yıl dayanıklıdır.' },
    unifol_gri_folyo:   { ad: 'Unifol Arkası Gri',    fiyat: 3.35,  birim: 'EUR', desc: 'Işığı tamamen engeller. Reklam panoları, ışıklı kutular ve opak uygulamalar için uygundur. Yapışkan gücü yüksektir.' },
    one_way_vision:     { ad: 'One Way Vision',       fiyat: 4.00,  birim: 'USD', desc: 'Delikli cam folyosu: içeriden dışarıyı net görürsünüz, dışarıdan reklam görünür. Mağaza vitrinleri, araç ve ofis camları için idealdir. 🎨 Ücretsiz tasarım desteği.' },
    reflektif_folyo:    { ad: 'Reflektif Folyo',      fiyat: 12.50, birim: 'USD', desc: 'Gece ışıldayan özel yapı: far veya sokak lambası ışığını yansıtır. Yol işaretleri, acil durum tabelaları ve gece reklamları için zorunlu malzeme.' },
    kumlu_folyo:        { ad: 'Kumlu Folyo',          fiyat: 4.00,  birim: 'USD', desc: 'Dekoratif kum efekti ile iç mekan cam ve duvar kaplamalarında kullanılır. Ofis, restoran ve mağaza dekorasyonunda tercih edilir.' },
    canvas:             { ad: 'Canvas Baskı',         fiyat: 9.50,  birim: 'USD', desc: 'Tuval görünümlü pamuklu kumaş üzerine dekoratif baskı. Resim, fotoğraf ve sanat çalışmaları için idealdir.' },
    magnet:             { ad: 'Magnet Baskı',         fiyat: 13.00, birim: 'USD', desc: 'Manyetik folyo üzerine baskı. Buzdolabı magneti, promosyon ürünleri olarak kullanılır. 🎨 Ücretsiz tasarım desteği.' },
    kagit_baski:        { ad: 'Kağıt Baskı',          fiyat: 1.50,  birim: 'USD', desc: 'İç mekan afiş, poster, broşür ve el ilanları için idealdir. 115-300 gr/m² kağıt, mat veya parlak yüzey seçeneği.' },
    rollup_banner:      { ad: 'Roll-Up Banner (85x200 cm)', fiyat: 1350, birim: 'TL', desc: 'Hazır kurulumlu roll-up banner. Alüminyum ayak ve taşıma çantası dahil, 30 saniyede kurulur. Fuar, etkinlik ve mağaza girişleri için.' }
};

/* ============================================================
   ÜRÜN KATALOĞU
   Her ürün: id, kategori, ad, img, badge, kisaDesc, uzunDesc,
   fiyatlar[{etiket, fiyat}], notlar, waEk (WhatsApp mesajına eklenecek soru)
   FİYATLAR TASLAKTIR -> GÜNCELLE!
   ============================================================ */

const urunler = {

    /* ---------- ÖZEL GÜN & KUTLAMA ---------- */

    dogum_gunu_afisi: {
        kategori: 'ozelgun',
        ad: 'Doğum Günü Afişi',
        img: 'images/dogum-gunu.svg',
        badge: 'Çok Satan',
        badgeColor: '#ff3b30',
        kisaDesc: 'Fotoğraflı & isimli · Branda veya Poster',
        uzunDesc: 'Çocuğunuzun adı, yaşı ve fotoğrafıyla tamamen kişiye özel doğum günü afişi. Parti köşesinin, pasta masasının arkasının veya fotoğraf çekim alanının yıldızı. Yüksek çözünürlüklü dijital baskı; dış mekan için yırtılmaz branda, iç mekan için canlı renkli poster seçeneği. Dilerseniz köşelerine kuşgözü çakılır, asma ipi hediye gönderilir.',
        fiyatlar: [
            { etiket: 'Poster 50×70 cm', fiyat: 250 },
            { etiket: 'Branda 100×70 cm', fiyat: 450 },
            { etiket: 'Branda 150×100 cm (Fotoğraf Köşesi)', fiyat: 750 },
            { etiket: 'Branda 200×150 cm (Büyük Arka Fon)', fiyat: 1150 }
        ],
        notlar: 'Fotoğraf ve isim/yaş bilgilerini sipariş sonrası WhatsApp\'tan gönderin. Baskı öncesi tasarım onayınız alınır — onaysız baskıya geçilmez.',
        waEk: 'Etkinlik tarihim: ___ (lütfen belirtin)'
    },

    evlilik_teklifi: {
        kategori: 'ozelgun',
        ad: 'Evlilik Teklifi Pankartı',
        img: 'images/evlilik-teklifi.svg',
        badge: 'Benimle Evlenir misin?',
        badgeColor: '#ec008c',
        kisaDesc: 'Fotoğraflı & isimli · Kuşgözü + ip dahil',
        uzunDesc: '"Benimle Evlenir misin?" anını unutulmaz kılın. Fotoğraflı veya sade, isimli, dilediğiniz sözle hazırlanan yırtılmaz branda pankart. Dört köşesine kuşgözü çakılır, asma ipi hediye gönderilir — balkona asın ya da arkadaşlarınız tutsun. Tasarım onayınız alınmadan baskıya geçilmez.',
        fiyatlar: [
            { etiket: '100×50 cm', fiyat: 450 },
            { etiket: '150×75 cm', fiyat: 650 },
            { etiket: '200×100 cm', fiyat: 950 },
            { etiket: '300×150 cm (Dev Boy)', fiyat: 1650 }
        ],
        notlar: 'Yazılacak sözü ve varsa fotoğrafınızı WhatsApp\'tan gönderin. Söz bulmakta zorlanıyorsanız hazır söz önerilerimizi isteyin. Teklif tarihinizi mutlaka belirtin — üretimi tarihinize göre önceliklendirelim.',
        waEk: 'Teklif tarihim: ___ (lütfen belirtin)'
    },

    hosgeldin_bebek: {
        kategori: 'ozelgun',
        ad: 'Hoşgeldin Bebek / Hastane Odası Afişi',
        img: 'images/hosgeldin-bebek.svg',
        badge: 'Yeni',
        badgeColor: '#00aeef',
        kisaDesc: 'İsimli · Kız/Erkek temalı · Hastane odası boyu',
        uzunDesc: 'Bebeğinizin ismiyle hazırlanan hoşgeldin afişi — hastane odası kapısında, evde karşılama duvarında veya baby shower partisinde. Fil, ayıcık, bulut, yıldız gibi temalar; kız/erkek renk seçenekleri. Fotoğraf eklemek isterseniz doğum sonrası fotoğrafla güncellenmiş ikinci baskı da sipariş edebilirsiniz.',
        fiyatlar: [
            { etiket: 'Hastane Odası 32×45 cm', fiyat: 200 },
            { etiket: 'Karşılama 50×70 cm', fiyat: 300 },
            { etiket: 'Parti Boyu 100×70 cm', fiyat: 450 }
        ],
        notlar: 'Bebeğin ismini, tema tercihini (fil/ayıcık/bulut vs.) ve renk tercihini WhatsApp\'tan iletin.',
        waEk: 'Tema tercihim: ___'
    },

    karsilama_panosu: {
        kategori: 'ozelgun',
        ad: 'Düğün / Nişan / Kına Karşılama Panosu',
        img: 'images/karsilama-panosu.svg',
        badge: 'Sezon',
        badgeColor: '#c2185b',
        kisaDesc: 'İsme özel · Dekota sıvama · Ayaklı seçenek',
        uzunDesc: 'Misafirlerinizi isminize özel hazırlanan şık bir pano ile karşılayın. Düğün, nişan, söz, kına, sünnet ve mevlüt için farklı konseptler. 3mm dekota (PVC levha) üzerine fotoğraf kalitesinde folyo sıvama; dilerseniz ayaklı stand ile teslim edilir — herhangi bir yere dayamadan ayakta durur.',
        fiyatlar: [
            { etiket: '50×70 cm (Duvar/Şövale tipi)', fiyat: 550 },
            { etiket: '70×100 cm', fiyat: 800 },
            { etiket: '70×100 cm Ayaklı', fiyat: 950 },
            { etiket: '100×150 cm Ayaklı', fiyat: 1450 }
        ],
        notlar: 'İsimleri, etkinlik türünü (düğün/nişan/kına/söz/sünnet) ve tarih bilgisini WhatsApp\'tan iletin. Konsept örneklerimizi görmek için yazmanız yeterli.',
        waEk: 'Etkinlik türü ve tarihi: ___'
    },

    mezuniyet: {
        kategori: 'ozelgun',
        ad: 'Mezuniyet Pankartı',
        img: 'images/mezuniyet.svg',
        badge: 'Mayıs-Haziran',
        badgeColor: '#7b1fa2',
        kisaDesc: 'Fotoğraflı & isimli · Okul/bölüm yazılı',
        uzunDesc: 'Mezunun fotoğrafı, adı, okulu ve bölümüyle hazırlanan kişiye özel mezuniyet pankartı. Tören alanında, ev önünde veya kutlama mekanında asılmak için kuşgözlü yırtılmaz branda. Sınıf/grup pankartları için toplu sipariş indirimi uygulanır.',
        fiyatlar: [
            { etiket: '100×70 cm', fiyat: 450 },
            { etiket: '150×100 cm', fiyat: 750 },
            { etiket: '300×75 cm (Uzun Bant)', fiyat: 900 }
        ],
        notlar: 'Fotoğraf, isim ve okul/bölüm bilgisini WhatsApp\'tan gönderin. Tören tarihinizi belirtin.',
        waEk: 'Tören tarihim: ___'
    },

    asker_ugurlama: {
        kategori: 'ozelgun',
        ad: 'Asker Uğurlama Pankartı',
        img: 'images/asker-ugurlama.svg',
        badge: 'Her Celp Dönemi',
        badgeColor: '#33691e',
        kisaDesc: 'Fotoğraflı & isimli · "En Büyük Asker Bizim Asker"',
        uzurDesc: '',
        uzunDesc: 'Askere uğurlama töreninin vazgeçilmezi: fotoğraflı, isimli, dilediğiniz sloganla hazırlanan pankart. Ev önüne, sokağa veya kutlama alanına asılmaya uygun kuşgözlü branda. Konvoy araç magnetiyle birlikte set olarak da sipariş edebilirsiniz.',
        fiyatlar: [
            { etiket: '100×70 cm', fiyat: 450 },
            { etiket: '150×100 cm', fiyat: 750 },
            { etiket: '200×100 cm', fiyat: 950 }
        ],
        notlar: 'Fotoğraf, isim ve uğurlama tarihini WhatsApp\'tan iletin.',
        waEk: 'Uğurlama tarihim: ___'
    },

    foto_arka_fon: {
        kategori: 'ozelgun',
        ad: 'Fotoğraf Köşesi Arka Fonu (Backdrop)',
        img: 'images/backdrop.svg',
        badge: 'Etkinlik',
        badgeColor: '#f7941d',
        kisaDesc: 'Parti & organizasyon · Büyük boy branda',
        uzunDesc: 'Doğum günü, nişan, açılış ve kurumsal etkinlikler için fotoğraf çekim köşesi arka fonu. Konseptinize uygun tasarım, yüksek çözünürlüklü büyük boy baskı. Kuşgözlü teslim edilir; standlı kullanım için ölçü uyumu WhatsApp\'tan teyit edilir.',
        fiyatlar: [
            { etiket: '200×150 cm', fiyat: 1150 },
            { etiket: '250×200 cm', fiyat: 1750 },
            { etiket: '300×250 cm', fiyat: 2450 }
        ],
        notlar: 'Konsept/tema ve etkinlik tarihinizi WhatsApp\'tan iletin.',
        waEk: 'Etkinlik türü ve tarihi: ___'
    },

    /* ---------- HEDİYELİK & KİŞİYE ÖZEL ---------- */

    foto_maket: {
        kategori: 'hediye',
        ad: 'Kişiye Özel Fotoğraf Maketi',
        img: 'images/foto-maket.svg',
        badge: 'Kendi Maketin',
        badgeColor: '#00aeef',
        kisaDesc: 'Kendi fotoğrafından ayaklı maket · 40-175 cm',
        uzunDesc: 'Kendi fotoğrafınızdan gerçek boy (veya masaüstü boy) ayaklı maket! Doğum günü sürprizi, asker uğurlama, mezuniyet, sevgiliye hediye veya düğün için birebir. 3mm Dekota üzerine yüksek çözünürlüklü UV baskı, özel kesim ve ayaklı stand. Ayakta, el ve ayakların tam göründüğü 1-2 fotoğraf alternatifi göndermeniz yeterli — gerisini biz hallederiz.',
        fiyatlar: [
            { etiket: '40 cm (Masaüstü)', fiyat: 449 },
            { etiket: '70 cm', fiyat: 749 },
            { etiket: '100 cm', fiyat: 1199 },
            { etiket: '175 cm (Gerçek Boy)', fiyat: 2899 }
        ],
        notlar: 'Fotoğrafınızı WhatsApp\'tan gönderin; kesime uygunluğunu ücretsiz kontrol edip onayınızı alırız. Kişiye özel üretim olduğu için iade edilemez — bu yüzden baskı öncesi onayınız mutlaka alınır.',
        waEk: ''
    },

    kanvas_tablo: {
        kategori: 'hediye',
        ad: 'Fotoğraflı Kanvas Tablo',
        img: 'images/kanvas-tablo.svg',
        badge: 'Hediyelik',
        badgeColor: '#8e24aa',
        kisaDesc: 'Kendi fotoğrafın tuvalde · Şaseli teslim',
        uzunDesc: 'En sevdiğiniz fotoğraf, tuval dokulu kanvas kumaşa yüksek çözünürlükte basılır ve ahşap şaseye gerilerek asılmaya hazır teslim edilir. Doğum günü, yıldönümü, anneler/babalar günü için en çok tercih edilen kişiye özel hediye. Tek parça veya çoklu (3\'lü set) seçenekleri mevcuttur.',
        fiyatlar: [
            { etiket: '30×40 cm', fiyat: 450 },
            { etiket: '50×70 cm', fiyat: 750 },
            { etiket: '70×100 cm', fiyat: 1250 }
        ],
        notlar: 'Fotoğrafınızı WhatsApp\'tan gönderin; çözünürlük kontrolü ücretsiz yapılır.',
        waEk: ''
    },

    duvar_tablosu: {
        kategori: 'hediye',
        ad: 'Duvar Tablosu 50×70',
        img: 'images/duvar-tablosu.jpg',
        badge: 'Hazır Ürün',
        badgeColor: '#6f8f00',
        kisaDesc: 'Folyo kaplı 3mm MDF · Bantla asılır',
        uzunDesc: 'Folyo kaplı 3mm MDF, çift taraflı bant ile kolayca asılır. Hazır boyut, hemen kullanıma hazır. Ofis, mağaza ve ev dekorasyonu için ideal. 3 farklı hazır tasarım seçeneği ile duvarlarınıza renk katın.',
        fiyatlar: [
            { etiket: '50×70 cm', fiyat: 700 }
        ],
        notlar: 'Tasarım seçeneklerini görmek için WhatsApp\'tan yazın.',
        waEk: ''
    },

    ataturk_maketi: {
        kategori: 'hediye',
        ad: 'Atatürk Maketi & Köşesi',
        img: 'images/ataturk-maket.jpg',
        badge: '10 Kasım · 23 Nisan',
        badgeColor: '#d42a1a',
        kisaDesc: 'Ayaklı maket & pano · Ev, ofis, okul',
        uzunDesc: 'Ulu Önder Atatürk\'ün ayaklı maketleri ve köşe panoları — ev, ofis, işyeri ve okullar için. 3mm Dekota üzerine yüksek çözünürlüklü UV baskı, ayaklı stand ile herhangi bir yere dayamadan ayakta durur. Okullar için Gençliğe Hitabe + İstiklal Marşı + portre standart setleri de hazırlanır; toplu sipariş indirimi uygulanır.',
        fiyatlar: [
            { etiket: '70 cm Maket', fiyat: 749 },
            { etiket: '100 cm Maket', fiyat: 1199 },
            { etiket: '175 cm Maket (Gerçek Boy)', fiyat: 2899 },
            { etiket: 'Okul Köşe Seti — Teklif Alın', fiyat: 0 }
        ],
        notlar: 'Model seçeneklerini görmek ve okul/kurum toplu fiyatı almak için WhatsApp\'tan yazın.',
        waEk: ''
    },

    /* ---------- MEVSİMSEL ---------- */

    yilbasi_set: {
        kategori: 'hediye',
        ad: 'Yılbaşı Maket Seti',
        img: 'images/yilbasi.svg',
        badge: 'Aralık',
        badgeColor: '#c62828',
        kisaDesc: 'Noel baba + ağaç + yıl yazısı · Vitrin & ev',
        uzunDesc: 'Yılbaşı dekorasyonu için ayaklı maket seti: Noel baba, çam ağacı ve yeni yıl yazısı. Ev, ofis ve özellikle mağaza vitrinleri için. Masaüstü boydan vitrin boyuna seçenekler. İşyerleri için logolu/isimli özel versiyon hazırlanır.',
        fiyatlar: [
            { etiket: 'Masaüstü Set (50cm + 30cm + yazı)', fiyat: 649 },
            { etiket: 'Vitrin Seti (100cm + 70cm + yazı)', fiyat: 1449 }
        ],
        notlar: 'Kasım ayından itibaren sipariş alınır; erken sipariş verin, yılbaşı yoğunluğuna kalmayın.',
        waEk: ''
    },

    /* ---------- ÖZEL GÜN — PARTİ ---------- */
    rakam_pano: {
        kategori: 'ozelgun',
        ad: 'Ayaklı Rakam Pano (Yaş Panosu)',
        img: 'images/karsilama-panosu.svg',
        badge: 'Parti',
        badgeColor: '#ff9800',
        kisaDesc: 'Doğum günü yaş panosu · Dekota ayaklı',
        uzunDesc: 'Doğum gününde yaş panosu: sevdiğiniz rakamı büyük boy ayaklı pano olarak bastırın. 3mm Dekota, UV baskı, ayaklı stand. Fotoğraf çekim köşesinin gözdesi. İsim eklenebilir.',
        fiyatlar: [
            { etiket: '30×40 cm Rakam', fiyat: 149 },
            { etiket: '50×70 cm Rakam', fiyat: 299 },
            { etiket: '70×100 cm Rakam + isim yazılı', fiyat: 499 }
        ],
        notlar: 'İstediğiniz rakam ve ismi WhatsApp\'tan iletin.',
        waEk: 'Rakam: ___'
    },
    parti_seti: {
        kategori: 'ozelgun',
        ad: 'Komple Parti Seti',
        img: 'images/dogum-gunu.svg',
        badge: 'Set',
        badgeColor: '#e91e63',
        kisaDesc: 'Afiş + rakam pano + harf flama · 3\'lü set',
        uzunDesc: 'Parti organizasyonunun tamamı tek siparişte: kişiye özel doğum günü afişi, ayaklı rakam pano ve isim harf flaması bir arada. Ayrı ayrı siparişe göre daha avantajlı fiyat.',
        fiyatlar: [
            { etiket: 'Küçük Set (50×70 afiş + 30cm rakam)', fiyat: 499 },
            { etiket: 'Orta Set (70×100 afiş + 50cm rakam + flama)', fiyat: 899 },
            { etiket: 'Büyük Set (100×70 afiş + 70cm rakam + flama)', fiyat: 1399 }
        ],
        notlar: 'Parti konseptinizi ve isim/yaş bilgilerini WhatsApp\'tan iletin.',
        waEk: ''
    },
    harf_flama: {
        kategori: 'ozelgun',
        ad: 'İsim Harf Flaması',
        img: 'images/dogum-gunu.svg',
        badge: 'Flama',
        badgeColor: '#9c27b0',
        kisaDesc: 'Tek tek harfler · İp üzerinde · Parti dekoru',
        uzunDesc: 'İsim veya mesaj yazmak için tek tek harf flamaları. İp üzerinde dizili, duvara veya panele asılır. Doğum günü, baby shower ve parti dekorasyonu için renkli bir alternatif.',
        fiyatlar: [
            { etiket: 'Küçük Harf (10cm / harf başı)', fiyat: 199 },
            { etiket: 'Büyük Harf (20cm / harf başı)', fiyat: 349 },
            { etiket: '8 Harfe Kadar Set', fiyat: 549 }
        ],
        notlar: 'Yazılmasını istediğiniz isim/mesajı WhatsApp\'tan iletin.',
        waEk: 'Yazılacak mesaj: ___'
    },
    kisiye_magnet: {
        kategori: 'ozelgun',
        ad: 'Kişiye Özel Magnet',
        img: 'images/foto-maket.svg',
        badge: 'Hediye',
        badgeColor: '#00bcd4',
        kisaDesc: 'Fotoğraflı magnet · Kişiye özel',
        uzunDesc: 'Sevdiklerinizin fotoğrafından kişiye özel magnetler. Buzdolabı, pano veya hediye olarak kullanılır. Tekli veya set halinde sipariş edilebilir.',
        fiyatlar: [
            { etiket: '10×15 cm (Tekli)', fiyat: 99 },
            { etiket: '15×20 cm (Tekli)', fiyat: 149 },
            { etiket: '5\'li Set 10×15 cm', fiyat: 349 }
        ],
        notlar: 'Fotoğrafı WhatsApp\'tan gönderin.',
        waEk: ''
    },

    /* ---------- ÖZEL GÜN — AŞK ---------- */
    sevgiliye_pankart: {
        kategori: 'ozelgun',
        ad: 'Sevgiliye Sürpriz Pankart',
        img: 'images/evlilik-teklifi.svg',
        badge: '14 Şubat · Sevgililer',
        badgeColor: '#e91e63',
        kisaDesc: 'İsimli sevgi sözleri · Branda / Poster',
        uzunDesc: 'Sevgilinize sürpriz yapmak için kişiye özel pankart. İsminiz, fotoğrafınız ve dilediğiniz mesajla hazırlanır. Doğum günü, yıldönümü veya 14 Şubat için ideal.',
        fiyatlar: [
            { etiket: '100×50 cm', fiyat: 350 },
            { etiket: '150×100 cm', fiyat: 650 },
            { etiket: '200×100 cm (Balkon Asmalık)', fiyat: 950 }
        ],
        notlar: 'Mesajınızı ve varsa fotoğrafınızı WhatsApp\'tan iletin.',
        waEk: 'Özel gün tarihi: ___'
    },

    /* ---------- ÖZEL GÜN — BEBEK ---------- */
    cinsiyet_partisi: {
        kategori: 'ozelgun',
        ad: 'Cinsiyet Partisi Arka Fonu',
        img: 'images/hosgeldin-bebek.svg',
        badge: 'Baby Reveal',
        badgeColor: '#ff80ab',
        kisaDesc: 'Pembe/mavi temalı · Branda',
        uzunDesc: 'Cinsiyet partisi (gender reveal) için özel arka fon. Pembe veya mavi temalı, isim ve tarih eklenebilir. Fotoğraf çekim köşesi için büyük boy branda.',
        fiyatlar: [
            { etiket: '100×70 cm Branda', fiyat: 350 },
            { etiket: '150×100 cm Branda', fiyat: 650 },
            { etiket: '200×150 cm Dev Branda', fiyat: 1100 }
        ],
        notlar: 'Tema rengi (pembe/mavi), isim ve tarihi WhatsApp\'tan iletin.',
        waEk: 'Tema / Renk: ___'
    },
    bebek_parti: {
        kategori: 'ozelgun',
        ad: 'Baby Shower / Bebek Parti Seti',
        img: 'images/hosgeldin-bebek.svg',
        badge: 'Baby Shower',
        badgeColor: '#81d4fa',
        kisaDesc: 'Tema bütünleme · Afiş + aksesuar',
        uzunDesc: 'Baby shower organizasyonunuz için özel set. Temalı afiş, flama ve magnet bir arada. Fil, ayıcık, bulut, flamingo ve galaksi temaları mevcut.',
        fiyatlar: [
            { etiket: 'Temalı Afiş 50×70 cm', fiyat: 299 },
            { etiket: 'Afiş + Balon Örgüsü Seti', fiyat: 549 },
            { etiket: 'Parti Seti (Afiş + flama + magnet)', fiyat: 799 }
        ],
        notlar: 'Tema tercihinizi WhatsApp\'tan iletin.',
        waEk: 'Tema: ___'
    },

    /* ---------- ÖZEL GÜN — DÜĞÜN ---------- */
    sunnet_panosu: {
        kategori: 'ozelgun',
        ad: 'Sünnet Panosu',
        img: 'images/karsilama-panosu.svg',
        badge: 'Sünnet',
        badgeColor: '#1565c0',
        kisaDesc: 'İsimli · Dekota sıvama · Ayaklı',
        uzunDesc: 'Sünnet töreni için kişiye özel karşılama panosu. Çocuğun ismi ve fotoğrafıyla hazırlanır, ayaklı veya duvar tipi seçenekler mevcut.',
        fiyatlar: [
            { etiket: '50×70 cm (Duvar/Şövale)', fiyat: 500 },
            { etiket: '70×100 cm Ayaklı', fiyat: 900 },
            { etiket: '100×150 cm Ayaklı', fiyat: 1400 }
        ],
        notlar: 'İsim ve fotoğrafı WhatsApp\'tan iletin.',
        waEk: 'Tören tarihi: ___'
    },
    hatira_cercevesi: {
        kategori: 'ozelgun',
        ad: 'Hatıra Çerçevesi / Fotoğraf Duvarı',
        img: 'images/foto-maket.svg',
        badge: 'Düğün · Nişan',
        badgeColor: '#ad1457',
        kisaDesc: 'Fotoğraflı çerçeve · İmza alanı',
        uzunDesc: 'Düğün, nişan veya kına gecesi için hatıra çerçevesi. Misafirlerin fotoğraf çektirebileceği, imza bırakabileceği dev bir çerçeve. Dekota malzeme, ayaklı veya duvar tipi.',
        fiyatlar: [
            { etiket: '50×70 cm', fiyat: 450 },
            { etiket: '70×100 cm', fiyat: 750 },
            { etiket: '100×150 cm (İmza + çerçeve)', fiyat: 1200 }
        ],
        notlar: 'İsimler ve etkinlik türünü WhatsApp\'tan iletin.',
        waEk: 'Etkinlik türü: ___'
    },

    /* ---------- HEDİYE — MAKET ---------- */
    cift_maket: {
        kategori: 'hediye',
        ad: 'Çift / Düğün Maketi',
        img: 'images/foto-maket.svg',
        badge: 'Çift',
        badgeColor: '#ec008c',
        kisaDesc: 'Gelin + damat · Ayaklı · Dekota',
        uzunDesc: 'Gelin ve damadın aynı makette buluştuğu çift maketi. Düğün girişi, fotoğraf köşesi veya hatıra olarak. 3mm Dekota UV baskı, ayaklı stand.',
        fiyatlar: [
            { etiket: '70 cm Çift Maket', fiyat: 1199 },
            { etiket: '100 cm Çift Maket', fiyat: 1899 },
            { etiket: '175 cm Gerçek Boy Çift', fiyat: 4499 }
        ],
        notlar: 'Gelin ve damadın fotoğraflarını WhatsApp\'tan gönderin.',
        waEk: ''
    },
    evcil_maket: {
        kategori: 'hediye',
        ad: 'Evcil Hayvan Maketi',
        img: 'images/foto-maket.svg',
        badge: 'Patili Dost',
        badgeColor: '#795548',
        kisaDesc: 'Kedi/köpek maketi · Ayaklı',
        uzunDesc: 'Patili dostunuzun fotoğrafından gerçek boy (veya masaüstü) maket. Kedi, köpek, kuş — tüm evcil hayvanlar için. 3mm Dekota UV baskı, ayaklı stand.',
        fiyatlar: [
            { etiket: '30×40 cm (Masaüstü)', fiyat: 349 },
            { etiket: '50×70 cm', fiyat: 649 },
            { etiket: '100 cm (Gerçek Boy)', fiyat: 1499 }
        ],
        notlar: 'Net bir fotoğrafını WhatsApp\'tan gönderin.',
        waEk: ''
    },

    /* ---------- HEDİYE — POSTER ---------- */
    yildiz_haritasi: {
        kategori: 'hediye',
        ad: 'Yıldız Haritası Posteri',
        img: 'images/kanvas-tablo.svg',
        badge: 'Romantik',
        badgeColor: '#4a148c',
        kisaDesc: 'O gecenin gökyüzü · Özel tarih · Poster',
        uzunDesc: 'Seçtiğiniz tarih ve şehirde gökyüzünün o geceki görüntüsü. Tanışma yıldönümü, doğum günü veya düğün gecesi için romantik bir hediye. Poster veya kanvas tablo seçeneği.',
        fiyatlar: [
            { etiket: '30×40 cm Poster', fiyat: 249 },
            { etiket: '50×70 cm Poster', fiyat: 399 },
            { etiket: '50×70 cm Kanvas Tablo', fiyat: 699 }
        ],
        notlar: 'Tarih, şehir ve varsa özel mesajı WhatsApp\'tan iletin.',
        waEk: 'Tarih / Şehir: ___'
    },
    ses_dalgasi: {
        kategori: 'hediye',
        ad: 'Ses Dalgası Posteri',
        img: 'images/kanvas-tablo.svg',
        badge: 'Anlamlı Hediye',
        badgeColor: '#00838f',
        kisaDesc: 'Ses kaydının dalga formu · Özel mesaj',
        uzunDesc: '"Seni seviyorum", bebeğinizin ilk kelimesi veya özel bir ses kaydının dalga formunu görsel sanata dönüştürüyoruz. WhatsApp sesli mesajı olarak göndermeniz yeterli.',
        fiyatlar: [
            { etiket: '30×40 cm Poster', fiyat: 249 },
            { etiket: '50×70 cm Poster', fiyat: 399 },
            { etiket: '50×70 cm Kanvas Tablo', fiyat: 699 }
        ],
        notlar: 'Ses kaydını WhatsApp sesli mesajı olarak iletin.',
        waEk: ''
    },
    bebek_poster: {
        kategori: 'hediye',
        ad: 'Bebek Ay/Doğum Posteri',
        img: 'images/hosgeldin-bebek.svg',
        badge: 'Bebek',
        badgeColor: '#4fc3f7',
        kisaDesc: 'Aylık/yıllık hatıra posteri · İsimli',
        uzunDesc: 'Bebeğinizin her ayını veya doğum bilgilerini gösteren özel poster. İsmi, doğum tarihi, kilosu, boyuyla kişiye özel. İlerde harika bir hatıra.',
        fiyatlar: [
            { etiket: '30×40 cm Poster', fiyat: 199 },
            { etiket: '50×70 cm Poster', fiyat: 349 },
            { etiket: '12 Aylık Kolaj Seti (50×70)', fiyat: 599 }
        ],
        notlar: 'Bebek bilgilerini (isim, doğum tarihi, kilo, boy) WhatsApp\'tan iletin.',
        waEk: ''
    },
    kolaj_poster: {
        kategori: 'hediye',
        ad: 'Kolaj Poster / Çoklu Fotoğraf',
        img: 'images/kanvas-tablo.svg',
        badge: 'Kolaj',
        badgeColor: '#e65100',
        kisaDesc: 'Birden çok fotoğraf · Aynı posterde',
        uzunDesc: 'Birden fazla fotoğrafı aynı posterde birleştiriyoruz. Yıllık aile albümü, tatil kolajı, bebek büyüme serisi — dilediğiniz konseptte.',
        fiyatlar: [
            { etiket: '40×50 cm (6-10 fotoğraf)', fiyat: 349 },
            { etiket: '50×70 cm (10-15 fotoğraf)', fiyat: 549 },
            { etiket: '70×100 cm (20+ fotoğraf)', fiyat: 899 }
        ],
        notlar: 'Fotoğrafları WhatsApp\'tan gönderin, yerleşim taslağını onayınıza sunarız.',
        waEk: ''
    },

    /* ---------- VİTRİN ---------- */
    arac_magnet: {
        kategori: 'vitrin',
        ad: 'Araç Kapı / Servis Magneti',
        img: 'images/vitrin.svg',
        badge: 'Araç',
        badgeColor: '#1565c0',
        kisaDesc: 'Mobil reklam · Tak-çıkar',
        uzunDesc: 'Servis aracınızı boyamadan mobil reklam panosuna çevirin. Manyetik folyo, tak-çıkar kullanım. Araç kapısına uygulanır, iz bırakmaz.',
        fiyatlar: [
            { etiket: '30×30 cm Magnet', fiyat: 300 },
            { etiket: '50×50 cm Magnet', fiyat: 500 },
            { etiket: '50×100 cm Magnet', fiyat: 800 }
        ],
        notlar: 'Tasarımınızı veya logonuzu WhatsApp\'tan gönderin.',
        waEk: ''
    },
    menu_baski: {
        kategori: 'vitrin',
        ad: 'Laminasyonlu Menü Baskısı',
        img: 'images/vitrin.svg',
        badge: 'Menü',
        badgeColor: '#2e7d32',
        kisaDesc: 'Silinebilir · Su geçirmez · Kafe/restoran',
        uzunDesc: 'Kafe ve restoranlar için silinebilir laminasyonlu menü baskısı. Su geçirmez, leke tutmaz, günlük yoğunluğa dayanıklı. Adet veya set halinde sipariş.',
        fiyatlar: [
            { etiket: 'A4 (21×29,7 cm) Adet', fiyat: 150 },
            { etiket: 'A3 (29,7×42 cm) Adet', fiyat: 250 },
            { etiket: 'Set Halinde (50 adet A4)', fiyat: 3500 }
        ],
        notlar: 'Menü tasarımınızı veya PDF dosyanızı WhatsApp\'tan gönderin.',
        waEk: ''
    },

    /* ---------- OKUL & KURUM ---------- */

    kapi_giydirme: {
        kategori: 'okul',
        ad: 'Sınıf Kapı Giydirme',
        img: 'images/okul-kurum.svg',
        badge: 'Laminasyonlu',
        badgeColor: '#e65100',
        kisaDesc: 'Sınıf kapıları · Silinebilir laminasyon',
        uzunDesc: 'Okullar için sınıf kapılarınıza özel tasarımlı giydirme folyo. Silinebilir laminasyon sayesinde yıllarca kullanılır, sınıf isimleri ve derslik etiketleriyle kişiselleştirilir. Suya dayanıklı, leke tutmaz, günlük temizliğe uygun.',
        fiyatlar: [
            { etiket: 'Standart Sınıf Kapısı — Teklif Alın', fiyat: 0 },
            { etiket: 'Toplu (5+ Kapı) — Teklif Alın', fiyat: 0 }
        ],
        notlar: 'Kapı adedi, ölçüleri ve tasarım tercihinizi WhatsApp\'tan iletin.',
        waEk: 'Kapı adedi: ___, Boyut: ___'
    },
    koridor_tablolari: {
        kategori: 'okul',
        ad: 'Koridor Tabloları Serisi',
        img: 'images/okul-kurum.svg',
        badge: 'Seri Halinde',
        badgeColor: '#00695c',
        kisaDesc: 'Atatürk sözleri · Motivasyon · Bilim serileri',
        uzunDesc: 'Okul koridorları için temalı tablo serileri. Atatürk\'ün veciz sözleri, motivasyonel mesajlar, bilim insanları ve Çanakkale gibi kategoriler halinde hazırlanır. Dekota üzeri UV baskı, hazır çerçeve veya çerçevesiz seçenek. Tüm seri tek renk şablonla görsel bütünlük sağlar.',
        fiyatlar: [
            { etiket: 'Standart (30×40 cm) — Adet', fiyat: 0 },
            { etiket: 'Büyük (50×70 cm) — Adet', fiyat: 0 },
            { etiket: 'Okul Seti (20+ Tablo) — Teklif Alın', fiyat: 0 }
        ],
        notlar: 'Seri seçimi (Atatürk sözleri/motivasyon/bilim/Çanakkale), adet ve ölçüyü WhatsApp\'tan iletin.',
        waEk: 'Seri: ___, Adet: ___, Ölçü: ___'
    },
    tabela_yonlendirme: {
        kategori: 'okul',
        ad: 'Sınıf Tabelası & Yönlendirme Levhası',
        img: 'images/okul-kurum.svg',
        badge: 'Pleksi & Alüminyum',
        badgeColor: '#37474f',
        kisaDesc: 'Kapı isimliği · Kat/yön levhaları',
        uzunDesc: 'Okul ve kurumlar için sınıf isimlikleri, kat ve yönlendirme levhaları. Pleksi, alüminyum veya Dekota malzeme seçenekleriyle, lazer kesim veya UV baskılı üretim. İç mekan ve dış mekan kullanımına uygun modeller.',
        fiyatlar: [
            { etiket: 'Standart Kapı İsimliği — Adet', fiyat: 0 },
            { etiket: 'Kat Yönlendirme Levhası — Adet', fiyat: 0 },
            { etiket: 'Toplu Set (Okul Paketi) — Teklif Alın', fiyat: 0 }
        ],
        notlar: 'Malzeme, adet ve ölçüleri WhatsApp\'tan iletin.',
        waEk: 'Malzeme: ___, Adet: ___, Ölçü: ___'
    },
    okul_panolari: {
        kategori: 'okul',
        ad: 'Okul Panoları',
        img: 'images/okul-kurum.svg',
        badge: 'İlan & Etkinlik',
        badgeColor: '#4e342e',
        kisaDesc: 'İlan, etkinlik ve tören panoları',
        uzunDesc: 'Okullar ve kurumlar için ilan panoları, etkinlik duyuru alanları, tören panoları. Mantar pano, manyetik pano veya baskılı Dekota seçenekleriyle. Ölçü ve tasarıma göre özel üretim.',
        fiyatlar: [
            { etiket: 'Standart Pano (70×100 cm) — Adet', fiyat: 0 },
            { etiket: 'Büyük Pano (100×150 cm) — Adet', fiyat: 0 },
            { etiket: 'Toplu Sipariş — Teklif Alın', fiyat: 0 }
        ],
        notlar: 'Pano türü, ölçü ve adedi WhatsApp\'tan iletin.',
        waEk: 'Pano türü: ___, Ölçü: ___, Adet: ___'
    },
    is_guvenligi_panolari: {
        kategori: 'okul',
        ad: 'İş Güvenliği Panoları',
        img: 'images/okul-kurum.svg',
        badge: 'Fabrika & Şantiye',
        badgeColor: '#e65100',
        kisaDesc: 'Uyarı ve yönlendirme levhaları',
        uzunDesc: 'Fabrika, şantiye ve işletmeler için iş güvenliği panoları, uyarı levhaları ve yönlendirme tabelaları. Standart sembollerle veya kurumsal tasarıma uygun özel baskı. Dayanıklı malzeme, dış mekan UV korumalı.',
        fiyatlar: [
            { etiket: 'Standart Levha (30×40 cm) — Adet', fiyat: 0 },
            { etiket: 'Büyük Pano (50×70 cm) — Adet', fiyat: 0 },
            { etiket: 'Toplu (Fabrika Seti) — Teklif Alın', fiyat: 0 }
        ],
        notlar: 'Levha türü, adet ve ölçüleri WhatsApp\'tan iletin.',
        waEk: 'Levha türü: ___, Adet: ___, Ölçü: ___'
    }
};

/* ---------- TARAFTAR MAKETLERİ ---------- */
const takimMaketleri = {
    samsunspor_yetiskin: { takim: 'Samsunspor', tip: 'Yetişkin Maketi', boy: '175 cm', fiyat: 2899, renk: '#e30613',
        img: 'images/taraftar-maketi.svg',
        desc: "Samsunspor taraftarı olmanın gururunu evine taşı! 175 cm'lik gerçek boy maket, kırmızı-beyaz formasıyla odanın en dikkat çeken parçası olacak. Yüksek çözünürlüklü UV baskı, 3mm Dekota malzeme ve ayaklı stand ile kolay kurulum." },
    samsunspor_cocuk: { takim: 'Samsunspor', tip: 'Çocuk Maketi', boy: '140 cm', fiyat: 2899, renk: '#e30613',
        img: 'images/taraftar-maketi.svg',
        desc: "Küçük Samsunsporlu'nun odasına dev bir neşe! 140 cm'lik bu özel maket, doğum günü sürprizleri, çocuk odası dekorasyonu ve fotoğraf çekimleri için mükemmel." },
    trabzonspor_yetiskin: { takim: 'Trabzonspor', tip: 'Yetişkin Maketi', boy: '175 cm', fiyat: 2899, renk: '#7a1f3d',
        img: 'images/taraftar-maketi.svg',
        desc: "Trabzonspor taraftarı olmanın gururunu evine taşı! 175 cm'lik gerçek boy maket, bordo-mavi formasıyla odanın en dikkat çeken parçası olacak." },
    trabzonspor_cocuk: { takim: 'Trabzonspor', tip: 'Çocuk Maketi', boy: '140 cm', fiyat: 2899, renk: '#7a1f3d',
        img: 'images/taraftar-maketi.svg',
        desc: "Küçük Trabzonsporlu'nun odasına dev bir neşe! Doğum günü sürprizleri ve çocuk odası dekorasyonu için mükemmel." },
    galatasaray_yetiskin: { takim: 'Galatasaray', tip: 'Yetişkin Maketi', boy: '175 cm', fiyat: 2899, renk: '#a90432',
        img: 'images/taraftar-maketi.svg',
        desc: "Galatasaray taraftarı olmanın gururunu evine taşı! 175 cm'lik gerçek boy maket, sarı-kırmızı formasıyla odanın en dikkat çeken parçası olacak." },
    galatasaray_cocuk: { takim: 'Galatasaray', tip: 'Çocuk Maketi', boy: '140 cm', fiyat: 2899, renk: '#a90432',
        img: 'images/taraftar-maketi.svg',
        desc: "Küçük Galatasaraylı'nın odasına dev bir neşe! Doğum günü sürprizleri ve çocuk odası dekorasyonu için mükemmel." },
    fenerbahce_yetiskin: { takim: 'Fenerbahçe', tip: 'Yetişkin Maketi', boy: '175 cm', fiyat: 2899, renk: '#0a3c73',
        img: 'images/taraftar-maketi.svg',
        desc: "Fenerbahçe taraftarı olmanın gururunu evine taşı! 175 cm'lik gerçek boy maket, sarı-lacivert formasıyla odanın en dikkat çeken parçası olacak." },
    fenerbahce_cocuk: { takim: 'Fenerbahçe', tip: 'Çocuk Maketi', boy: '140 cm', fiyat: 2899, renk: '#0a3c73',
        img: 'images/taraftar-maketi.svg',
        desc: "Küçük Fenerbahçeli'nin odasına dev bir neşe! Doğum günü sürprizleri ve çocuk odası dekorasyonu için mükemmel." },
    besiktas_yetiskin: { takim: 'Beşiktaş', tip: 'Yetişkin Maketi', boy: '175 cm', fiyat: 2899, renk: '#000000',
        img: 'images/taraftar-maketi.svg',
        desc: "Beşiktaş taraftarı olmanın gururunu evine taşı! 175 cm'lik gerçek boy maket, siyah-beyaz formasıyla odanın en dikkat çeken parçası olacak." },
    besiktas_cocuk: { takim: 'Beşiktaş', tip: 'Çocuk Maketi', boy: '140 cm', fiyat: 2899, renk: '#000000',
        img: 'images/taraftar-maketi.svg',
        desc: "Küçük Beşiktaşlı'nın odasına dev bir neşe! Doğum günü sürprizleri ve çocuk odası dekorasyonu için mükemmel." }
};
