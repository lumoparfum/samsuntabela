/* Doviz kuru (TCMB doviz satis). Dijital baski m2 fiyatlari dolar/euro uzerinden hesaplanir.
 * Bu dosyayi .github/workflows/kur.yml her gun TCMB'den kontrol eder; kur %1'den fazla
 * degistiyse asagidaki iki satiri gunceller ve siteyi yeniden yayinlar. Elle duzenlemeye gerek yok.
 * Fiyat gosteren her ogede data-m2="1.80 USD" bulunur; ilk metni "~90 TL " olarak yenilenir.
 * Hesaplayici ve urun pencereleri window.KUR.USD / window.KUR.EUR okur.
 */
window.KUR = {
  USD: 50.2282, // KUR-USD
  EUR: 55.9810, // KUR-EUR
  tarih: '11.11.2026' // KUR-TARIH
};
(function () {
  function uygula() {
    var el = document.querySelectorAll('[data-m2]');
    for (var i = 0; i < el.length; i++) {
      var p = el[i].getAttribute('data-m2').split(' ');
      var kur = window.KUR[p[1]], t = el[i].firstChild;
      if (kur && t && t.nodeType === 3) t.nodeValue = '~' + Math.round(parseFloat(p[0]) * kur) + ' TL ';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', uygula); else uygula();
})();
