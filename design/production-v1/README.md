# Şeffaf görsel parçalar — v1

Kullanıcının 14 Kasım 2026 tarihinde tekrar paylaştığı antik Mısır kartelası ana sanat referansıdır. Built-in Imagegen ile altı normal balon, dört özel balon, iki yardımcı, altı yazısız kontrol, on iki ikon ve altı su efekti üretildi. Bunlar görsel inceleme adaylarıdır; kullanıcı henüz bu varlıkları onaylamadı.

## Dosyalar

masters özgün RGBA çıktılarıdır. sprites bağımsız kayıpsız kırpımları ve 1x/2x/3x önizleme dosyalarını içerir. manifest.json kaynak dikdörtgeni, boyut, alfa aralığı, hedef kutusu ve SHA-256 kaydeder. Dikdörtgenler kaynak sınırlarında doğrulandı. Orijinal RGB ve alfa korunur; arka plan silme veya keyfi renk değiştirme uygulanmadı.

## Gerçek boyut

../previews/assets-390px-v1.png tam 390×1250 pikseldir. ../previews/actual-size-v1.html tarayıcı %100 yakınlaştırmada 390 CSS px genişliğinde gösterir. Balonlar 48×48 kutuya, ikonlar 28×28 kutuya, efektler 96×96 kutuya oran korunarak sığdırıldı. Kutunun tamamının nesneyle dolu olduğu iddia edilmez. Butonlar 280×56 hedef kutusunda oran korunarak gösterilir; görünen buton genişliği bu nedenle 280 px’den küçüktür. Panel de 340×220 kutuda oranını korur. Nihai buton ölçüsü ayrıca sabitlenecektir. iOS mantıksal noktası, ekran fiziksel pikseli ve tarayıcı CSS pikseli farklı kavramlardır.

## İnceleme

Koyu zemindeki gerçek boyut kartelası görsel olarak incelendi. Altı normal renk ve sembol, yatay/dikey kalp, hediye ve yardımcılar ayrılıyor. Basınç balonunda istenen konsantrik halkalar yerine dalga motifi oluştu; bakır balonun dalgasıyla karışabileceği için nihai kabul öncesi değiştirilmelidir. Yıldızın ek ışınları ana ekran yıldızından farklıdır; sadeleştirme adayıdır. Yeni üretimler referans piksellerinin aynısı değildir; malzeme ve form benzerliği sağlanmıştır.

## Eksik teslimler

Bu set tüm uygulama varlıklarının tamamlandığı anlamına gelmez. Yazısız ekran arka planları, logo masterı, uzun popup çerçevesi, sayaç ve ilerleme parçaları, seçili tahta köşeleri, açık/kapalı toggle parçaları, harita düğümleri ve mağaza paketleri henüz bağımsız değildir. Dokuz parçalı çerçeve ölçekleme ve farklı telefon oranları doğrulanmadı. Gerçek fontlar seçilmedi. Efektler statik tepe kareleridir; patlama, su jeti ve kombo animasyon kare dizileri ile ses dosyaları henüz yoktur. Uygulama koduna geçilmedi.

## Ek UI parçaları

Dokuz ek parça üretildi: uzun popup çerçevesi, kaynak sayacı, ilerleme kanalı/dolumu, seçim köşeleri, iki toggle, harita düğümü ve sayı rozeti. ui-parts-390px-v1.png gerçek hedef kutularında gösterir. Uzun panelde referanstan gelen lotus süsü vardır; ayrı katman değildir. Bağımsız ekran arka planları, logo ve mağaza paketleri hâlâ üretim dışındadır. Toplam 45 bağımsız RGBA parça vardır.
