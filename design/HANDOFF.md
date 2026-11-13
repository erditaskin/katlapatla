# Tasarım teslimi ve üretim sınırları

## Onaylanan ekranlar

03 kartela, 04 oyun ekranı ve 05 harita/mağaza/başarı ekranları kullanıcı tarafından onaylandı. 06 oyun popup’ları ve 07 sistem ekranları yeni adaylardır. Uygulama koduna başlanmadı.

## Ekran ve durum kapsamı

Bölüm başlangıcı, ek hamle teklifi, can yok, duraklatma, çıkış onayı, yenilgi; yükleme, ayarlar, öğretici, yardımcı onayı, bağlantı hatası, işlem bekliyor/başarılı/başarısız durumları çizildi. İşlem durumu kartelasındaki üç satır uygulamada aynı anda gösterilmez. Reklam iptali ödül vermez; ödeme iptali hata gibi sunulmaz. Yetersiz altın, reklam hazır değil, işlem beklemede ve dolu can durumları ortak panel sistemiyle ayrıca durumlandırılmalıdır. Gizlilik/koşullar metinleri ve mağaza sistem ödeme ekranı özgün oyun görseli değildir.

## Birebir kesimler

reference-cuts klasöründeki 12 PNG kaynak karteladan ölçekleme yapılmadan kesilmiştir. manifest.json tam sayı kaynak koordinatlarını ve ölçülerini tutar. Bu dosyalar yazı ve arka plan içerir; karşılaştırma referansıdır, etkileşimli popup yerine kullanılmaz. 08 şeffaf balon master denemesinde nesneler arası boşluk yetersizdir; nihai sprite değildir.

## Üretim sırası

1. Popup onaylarını al; görünüm ve kullanıcı metinlerini sabitle.
2. Her ekranı 390×844 mantıksal noktada yeniden ölçülendir. Kartela panel oranları telefon ölçüsü sayılmaz.
3. Lisanslı gerçek başlık/gövde fontlarını seç ve Türkçe karakterleri kontrol et. Raster yazıların aynı font olduğu varsayılmaz.
4. Arka planları, yazısız panelleri, düğme durumlarını ve ikonları ayrı üret. Altın çerçevelerde köşeleri sabit tutan dokuz parçalı ölçekleme bölgelerini tanımla.
5. Altı normal balonu ayrı şeffaf dosyada üret; yönlü kalpler, hediye ve basınç balonu için ayrı masterlar hazırla. Renkli su efektlerini kare dizileriyle tasarla.
6. Her varlık için kaynak boyutu, alfa sınırı, iç boşluk ve hedef boyut kaydet. 48 px görünümü ve koyu/açık zemin kenarlarını incele.
7. Ancak sonrasında uygulama; aynı cihaz ve çözünürlükte referans karşılaştırması, font/konum/renk farkı incelemesi.

Fiyatlar, ek hamle miktarı ve ödüller tasarım örnekleridir. Piksel eşleşmesi henüz doğrulanmadı. Yeni PNG üretimi referansın birebir piksellerini korumaz; yalnızca kayıpsız kesimler korur.
