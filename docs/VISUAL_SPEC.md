# Görsel uygulama sözleşmesi — taslak

## Dünya ve kontrast

Antik Mısır ağırlıklı, yetişkinlere hitap eden karanlık ve premium dünya. Keskin geometrili bazalt ve kumtaşı mimarisi, aşınmış yüzeyler, oyma paneller ve kontrollü eskitilmiş altın detaylar kullanılır. Gotik etki ana tema değildir. Önceki pastel bulut ve oyuncak çizimler güncel hedef değildir; arşivde korunur.

Renk adayları: eskitilmiş altın `#C6A15B`, lapis `#28538A`, oksitli teal `#368F87`, koyu bordo `#9B3E58`, kızıl bakır `#B87546`, eskitilmiş gümüş/fildişi `#C8C6B8`. Zemin kömür/bazalt `#202321`, açık yazı `#EFE7D7`. Bunlar ilk kartela adaylarıdır; son tokenlar görsel onayla sabitlenir. Balon ve zemin yalnızca koyulukla değil ton ve sembolle de ayrılır.

Mısır esinli sade sembol adayları: güneş diski, ankh, tüy, lotus, su çizgisi ve geometrik sütun. Bunlar stilize sanat motifleridir; tarihsel doğruluk iddiası yoktur. Her balonda tek büyük işaret kullanılır; küçük ekranda okunmayan sık yazı ve süslerden kaçınılır.

Çevre keskin hatlı olabilir; su balonunun gövdesi esnek kalmalıdır. İnce metalize zar, alt bağ çevresinde hafif kırışıklık, yumuşak deformasyon ve kısmen görünür su çizgisi önerilir. Balon sert zırh, taş, mücevher, metal küre veya iksir şişesi gibi okunmamalıdır. Sıvı metal değil sudur.

4’lü kalp ve 5’li hediye fikri korunur. Kalpte su bandı yönü, hediyede esnek metalik kurdele adaydır. Patlama ateş, metal şarapneli veya para saçılması değil renkli su, sıvı tabakası ve damlalar üretir.

Başlıklarda kontrollü oyma/antik karakter; küçük metinlerde sade ve yüksek okunabilirlik hedeflenir. Gerçek font dosyası henüz seçilmemiştir. Görseldeki wordmark da nihai logo olarak onaylanmış sayılmaz.

## Ekran önerisi

Ana referans tuvali 390×844 mantıksal iOS noktasıdır. Sistem güvenli alanı cihazdan alınır; arka plan ekranı doldurur. Tahta 8×8 adayıdır. Hücre oranları, simgelerin gerçek boyutu ve dokunma alanları cihazda ölçülür.

Üstte can, altın ve ayarlar; ardından bölüm, hedefler ve kalan hamle. Ortada tahta, altta üç anlaşılır yardımcı yer alır. Harita erişimi oyun ekranını gereksiz menülerle daraltmaz.

## Önceki projeden uygulanan dersler

- AI raster konsepti tek başına piksel ölçüsü veya gerçek font dosyası sayılmaz. Koddan önce font, ölçü, renk ve durumlar ayrıca sabitlenir.
- Büyük çizim yanında gerçek hücre boyutunda normal, seçili, özel ve patlayan durumlar kontrol edilir.
- Runtime varlıkları ayrı, sürümlü ve şeffaf PNG olarak hazırlanır. Tam ekran çizim etkileşimli uygulama yerine kullanılmaz.
- Atlas kullanılırsa önce gerçek sprite sınırları kırpılır; sonra hedef kutuya ortalanır. Kenar boşluğu komşu atlas nesnesini gösteremez.
- Kaynak boyutları, tam sayı kırpma koordinatları ve dosya bütünlüğü otomatik doğrulanır.
- Gerçek cihaz ekranıyla onaylı referans karşılaştırılır. Yapılmamış görsel karşılaştırma için pixel-perfect iddiasında bulunulmaz.

## Ses ve hareket yönü

Kısa, tok, ıslak normal patlama; daha geniş su jeti; büyük su boşalması. Zincirlerde perde ve ritim kademeli artar; aynı anda çalan ses sayısı ve toplam ses seviyesi sınırlanır. Azaltılmış hareket, ses, müzik ve titreşim ayrı kontrol edilir. Bunlar şu anda ses tasarım notudur; ses dosyaları henüz üretilmemiştir.


## 14 Kasım uygulama durumu

Kullanıcı balon v2 ve popup tasarımlarını onayladı; uygulama ve simülatör testlerini yetkilendirdi. Güncel kurallar, gerçek fontlar, yerleşim ve yayın sınırları docs/IMPLEMENTATION.md içindedir. Önceki taslak notlar tarihsel karar sürecidir. Uygulanan başlangıç ekonomi değerleri kullanıcı testine açıktır.
