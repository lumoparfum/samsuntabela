<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Samsun Tabela | Toraman Reklam & Tabela</title>
    <style>
        body { margin: 0; padding: 0; background-color: #000; color: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; overflow-x: hidden; }
        /* Arka Plan Karartma Efekti */
        .bg-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #111 0%, #000 100%); z-index: -1; }
        nav { display: flex; justify-content: space-between; align-items: center; padding: 20px 5%; background: rgba(0,0,0,0.9); position: fixed; width: 90%; top: 0; z-index: 100; border-bottom: 1px solid #222; }
        .hero { height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 0 10%; }
        h1 { font-size: 3.5rem; margin-bottom: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px; }
        h1 span { color: #ccff00; text-shadow: 0 0 15px rgba(204, 255, 0, 0.3); }
        p { font-size: 1.2rem; color: #888; max-width: 600px; margin-bottom: 30px; }
        .btn { padding: 18px 35px; background: #ccff00; color: #000; text-decoration: none; font-weight: 800; border-radius: 50px; transition: 0.3s; text-transform: uppercase; font-size: 0.9rem; }
        .btn:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(204, 255, 0, 0.5); }
        .gallery { padding: 100px 5%; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 20px; overflow: hidden; transition: 0.4s; position: relative; }
        .card:hover { border-color: #ccff00; transform: translateY(-10px); }
        .card img { width: 100%; height: 300px; object-fit: cover; filter: grayscale(50%); transition: 0.4s; }
        .card:hover img { filter: grayscale(0%); }
        .whatsapp-float { position: fixed; bottom: 30px; right: 30px; background: #25d366; color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 20px rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; gap: 10px; }
        footer { padding: 50px; text-align: center; color: #333; font-size: 0.8rem; border-top: 1px solid #111; }
    </style>
</head>
<body>
    <div class="bg-overlay"></div>
    <nav>
        <div style="font-weight:900; font-size:24px; letter-spacing:1px;">SAM<span style="color:#ccff00">TABELA</span></div>
        <div style="color: #666; font-size: 0.8rem; font-weight: 600;">SAMSUN / 2026</div>
    </nav>

    <section class="hero">
        <h1>Samsun'un En <span>Jilet</span><br>Tabelalarını Yapıyoruz.</h1>
        <p>15 yıllık tecrübe ile ışıklı kutu harf, totem ve kurumsal reklam projelerinde markanızı zirveye taşıyoruz.</p>
        <a href="https://wa.me/905XXXXXXXXX" class="btn">PROJE GÖNDER / FİYAT AL</a>
    </section>

    <div class="gallery">
        <div class="card">
            <img src="https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&q=80&w=400" alt="Işıklı Tabela">
            <div style="padding:20px;"><h3>Işıklı Kutu Harf</h3><p style="font-size:0.9rem;">Gece parlayan prestijli çözümler.</p></div>
        </div>
        <div class="card">
            <img src="https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400" alt="Dijital Baskı">
            <div style="padding:20px;"><h3>Kurumsal Reklam</h3><p style="font-size:0.9rem;">Cephe giydirme ve totem sistemleri.</p></div>
        </div>
    </div>

    <footer>
        &copy; 2026 Toraman Reklam Tabela. Tüm Hakları Saklıdır.
    </footer>

    <a href="https://wa.me/905XXXXXXXXX" class="whatsapp-float">
        <span>WhatsApp Destek</span>
    </a>
</body>
</html>