# Katla Patla — ürün kararları

## Kullanıcı tarafından onaylananlar

- Yeni proje, Ultimatum’dan bağımsızdır. Yerel klasör `katlapatla`, hedef depo `erditaskin/katlapatla` olur.
- Klasik kaydırarak üçlü eşleştirme mekanizması ve su dolu balonlar kullanılır.
- Dünya antik Mısır ağırlıklı, karanlık, rustik ve premiumdur. Keskin mimari hatlar, aşınmış taş ve eskitilmiş metal kullanılır. Balonlar yüzsüz, metalik yansımalı, esnek, kısmen yarı saydam ve su dolu görünür.
- Görsel dil yetişkinlere hitap eder; ürün çocuklara özel konumlandırılmaz. Mağaza yaş derecelendirmesi bu sanat kararıyla otomatik belirlenmiş sayılmaz.
- İlk sürüm bölüm haritası, mağaza, ödüllü reklam ve uygulama içi satın alma içerir.
- Tek harcanabilir para birimi altındır. Altın oynayarak kazanılabilir ve satın alınabilir. Yıldızlar yalnızca bölüm başarısını gösterir.
- İlk yayın hedefi 50 tasarlanmış bölümdür. İlk 10 bölüm mekanik, sanat, ses ve denge doğrulamasında kullanılır.
- Can sistemi ilk prototipten itibaren vardır: kapasite 5; her 30 dakikada 1 can yenilenir.
- Kaybetmek veya bölümü açıkça terk etmek 1 can tüketir. Uygulamayı arka plana almak terk sayılmaz; kayıtlı tahtadan devam edilir.

## Kullanıcının değerlendirilmesini istediği görsel fikir

4’lü eşleşmede kalp, 5’lide hediye paketi biçimi kullanılması. İlk kartelada bu fikirler görünür tasarım adayları olarak sunulur; nihai sanat onayı henüz alınmamıştır.

## Önerilen ilk oynanış sözleşmesi

- Komşu iki balon yer değiştirir. Geçerli eşleşme üretmeyen normal hamle geri alınır ve hamle sayısını tüketmez.
- En az üç aynı renk balon eşleşir. Boşluklara üsttekiler düşer; üstten yeni balon gelir. Yeni eşleşmeler zinciri devam ettirir.
- Düz sırada 4 aynı renk, satır/sütun temizleyen kalp su balonu üretir. Yön, görünür yatay/dikey su bandıyla ayrılır.
- Düz sırada 5 aynı renk, seçilen rengi temizleyen hediye su balonu üretir. Hediye bir tahta gücüdür; rastgele ödül kutusu değildir.
- T/L şeklinde 5 aynı renk, çevresini temizleyen basınç balonu üretir.
- Başlangıçta renk toplama hedefleri; daha sonra köpük temizleme önerilir.
- Zincir puan çarpanını artırır. Görev ilerlemesi gerçekten patlayan balonlarla hesaplanır.
- İlk tahta önerisi 8×8’dir. Bu boyut gerçek cihaz yerleşimi ve parmak hedefleriyle doğrulanacaktır.
- Ana oyun çevrimdışı çalışır; reklam ve ödeme akışları bağlantı gerektirir. Ağ hatası oyuncuya ödül verilmiş gibi gösterilmez.

## Uygulama öncesinde kesinleştirilecekler

- Altın ödülleri, can dolumu/yardımcı/ek hamle fiyatları ve reklam kullanım sınırları.
- Özel balon birleşim matrisi; birden fazla eşleşme, güç oluşum yeri ve zincir çözüm sırası.
- Bölüm bitiminde ek hamle sonrası can kesintisinin tek kez yapılması; kayıtlı bölüm ve sonuç ekranı yaşam döngüsü.
- İlk 10 bölümün hamle sayısı, hedefleri ve zorluk eğrisi; sonraki 40 bölümün dağılımı.
- Satın alma doğrulaması, iade, yeniden kurulum ve cihaz değişiminde satın alınmış hakların korunması.
- Reklam ve satın alma sağlayıcıları, hesap/anonim kimlik yaklaşımı, gerekli mağaza yapılandırması.
- İlk iOS sürümü ve Expo/TypeScript mimarisi başlangıç önerisidir. SDK sürümü uygulama kurulurken güncel resmî belgelerle seçilir.

## Çalışma sırası

1. Renk ve normal/özel balon kartelası.
2. Aynı dilde gerçek telefon oranında ana oyun ekranı.
3. Kullanıcı görsel onayı; gerçek font dosyası, renkler, ölçüler ve ikon sözleşmesi.
4. Harita, mağaza, bölüm başı/sonu, can ve ayar ekranları.
5. Saf oyun kuralları, tekrar üretilebilir testler ve tek oynanabilir bölüm.
6. İlk 10 bölüm; gerçek iOS simülatöründe görsel/ses/etkileşim doğrulaması.
7. Mağaza/reklam sandbox entegrasyonları ve kalan bölümler.

Bu tasarım aşamasında uygulama kodu, gerçek para işlemi veya reklam SDK’sı yoktur. Denge ve gelir performansı doğrulanmış kabul edilmez.

## Görsel yön değişikliği — 13 Kasım 2026

İlk pastel/fantastik kartela ve ekran kullanıcı tarafından fazla çocuk oyunu hissinde bulundu. Kullanıcı antik Mısır ağırlıklı, karanlık ve premium yönü seçti. Önceki iki çizim ve promptları `design/archive/pastel-v1/` altında tarihsel aday olarak korunur; yeni uygulamanın görsel hedefi değildir. Oynanış, 50 bölüm, can, altın ve gelir modeli kararları değişmedi. Kullanıcı yeni kartelanın malzeme ve renk dilini onayladı; ana ekran bu doğrultuda hazırlanır. Uygulama koduna başlanmaz.

## Kartela onayı

Kullanıcı `03-egypt-premium-palette-v1.png` çizgisinde ana ekranın hazırlanmasını onayladı. Bu onay sanat yönü içindir; ekran düzeni, kesin font/ölçüler ve uygulamaya başlama ayrı aşamalardır.
