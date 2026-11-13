# Görsel uygulama sözleşmesi — taslak

## Dünya ve kontrast

Fantastik açık gökyüzü, pastel bulutlar, yüzen adacıklar ve su şelaleleri. Arka plan sakin; oynanabilir balonlar daha güçlü renk ve net siluet taşır. Madencilik, kuyumcu, KP taş logosu veya Ultimatum varlıkları kullanılmaz.

Normal renk adayları: mercan `#F46D83`, mandalina `#FFA45B`, güneş sarısı `#F7D65A`, yeşil `#8ED783`, turkuaz `#57C9DE`, mor `#AA8DDD`. Bunlar kartela adaylarıdır; son renkler kullanıcı görsel onayıyla sabitlenir. Renk tek ayırt etme aracı olmaz; küçük, sade motifler denenir.

Balonlar gerçek su balonu gibi hafif sarkar, görünür bağ taşır; yüz, göz veya ağız içermez. Patlama su tacı, ince su tabakası ve damlacık üretir. Duman veya ateş ana efekt değildir.

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
