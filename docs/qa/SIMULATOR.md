# iOS simülatör doğrulaması

## Hedef

Device Hub içindeki iPhone 17 Pro, iOS 26.3.1 simülatörü. Uygulama kimliği `com.erditaskin.katlapatla.balloons`. Gerçek telefona kurulum yapılmaz.

## Otomatik kanıtlar

- 14 motor ve ekonomi testi geçti. 250 başlangıç tahtası ve 100 tohum üzerinde çok hamleli tahta tutarlılığı kontrol edildi.
- TypeScript strict ve Expo lint geçti.
- Expo Doctor: 20/20 kontrol geçti.
- Runtime varlıklarının alfa, boyut ve SHA-256 kayıtları runtime-assets.json içindedir.
- engine-benchmark.json masaüstü Node ölçümüdür; simülatör FPS’i değildir.
- level-audit.json her bölüm için tek tohumlu greedy bot denemesidir. 44/50 kazanım, insan denge testi veya yayın onayı değildir.

## Etkileşim kontrol listesi

Aşağıdaki maddeler henüz bu dosyanın ilk yazıldığı anda tamamlanmadı; gözlemlenen sonuçlar sonradan eklenir:

- Soğuk açılış ve harita.
- Mağaza, altınla yardımcı, dolu can koruması.
- Bölüm başlangıcı ve öğretici.
- Geçersiz ve geçerli takas; dokunma ve kaydırma.
- Hedef ve hamle güncellemesi, patlama ve kombo.
- Yardımcı kullanımı.
- Arka plana alma ve yeniden başlatınca aynı tahta.
- Çıkış onayında tek can kesintisi.
- Başarı/yenilgi sonuçları.
- Üst/alt güvenli alan ve küçük ekran.

Piksel eşleşmesi, profesyonel ses kalitesi ve cihaz FPS ölçümü henüz onaylanmış değildir.

## Gözlenen sonuçlar — 14 Kasım 2026

Device Hub üzerinden iPhone 17 Pro iOS 26.3.1 üzerinde:

- Harita açıldı; 50 bölüm düğümü görüldü, yalnızca açılan bölümler etkin.
- Bölüm 1 ve öğretici açıldı; 64 hücre erişilebilirlik ağacında doğrulandı.
- Geçersiz 0–1 takasında 24 hamle ve sıfır puan korundu.
- Geçerli 10–11 takasında 23 hamle ve 180 puan görüldü.
- 32–40 kaydırmasında 22 hamle, Tüy hedefinde 12’den 9’a ilerleme ve 1.980 puan görüldü.
- İğne kullanımı Güneş hedefini 12’den 11’e düşürdü, 2.040 puan ve 22 hamle korundu; iğne stoku 3’ten 2’ye indi.
- Normal Release yeniden kurulumundan sonra before-restart.json ile after-restart.json aynı çıktı. Tahta SHA-256, bölüm kimliği, hamle, puan, hedefler, altın, can ve yardımcı stokları korundu.
- Özel balon oluştu ve komşusuyla takasta alan temizledi. Bölüm 1 gerçek hamlelerle 8.220 puan ve 15 hamleyle tamamlandı. Üç yıldız, 100 altın ve bölüm 2 kilit açılımı görüldü; bakiye 1.350 oldu.
- Çıkış onayından vazgeçmek can tüketmedi. Bölüm 2’den açık onayla çıkışta can 5’ten 4’e indi.
- Mağazada iğne alımı 100 altın harcadı ve stok 2’den 3’e çıktı. Can dolumu 300 altın harcadı, 5/5 oldu; dolum düğmesi devre dışı kaldı. Bakiye 950 oldu.
- Azaltılmış hareket anahtarı 0–1–0 değişti; diğer ses/müzik/titreşim anahtarları erişilebilir ve etkindir. İşitilerek foley kalite değerlendirmesi yapılmış sayılmaz.

Küçük KatlaPatla-Compact-QA simülatöründe aynı Release paketi açıldı. Harita, bölüm başlangıcı, öğretici, 8×8 tahta ve üç yardımcı görüldü. Son alt pay düzeltmesiyle güvenli alan ayrıca kontrol edilir.

İlk çerçeve sürümü kaynak boyutuyla taştı. Resimlerin intrinsic ölçüsü açıkça kaldırıldı; 1x/2x/3x çerçeve dosyaları ve capInsets ölçekleri düzeltildi. Son gözlenen büyük ekran yerleşiminde bu taşma yoktur. Üretim resmi ile raster piksel farkı sıfır ölçülmüş değildir.

Hamle bitimindeki ek hamle/yenilgi ekranları motor ve ekonomi testleriyle doğrulandı; simülatörde hamleleri tüketerek ayrıca uçtan uca denenmedi. 30 dakika gerçek süre beklenmedi; yenileme sınırları enjekte edilen zamanla test edildi. Android, gerçek telefon, gerçek reklam ve gerçek IAP bu doğrulamada yoktur.


Son küçük ekran kontrolünde alt pay düzeltmesi doğrulandı: 64 hücre, puan ve üç yardımcının çerçeveleri ekran içinde kaldı. compact-gameplay.png ve iphone-17pro-gameplay.png son Release/Hermes paketinden ham simülatör ekran görüntüleridir. İnceleme için iPhone 17 Pro üzerinde Bölüm 2, 25 hamleyle açık bırakıldı.


## Son tam ekran isteği

Native Stack statusBarHidden ve Expo StatusBar hidden birlikte ayarlandı. Device Hub’da son iPhone 17 Pro görüntüsünde saat ve sistem simgelerinin kalktığı doğrulandı; arka plan üst/alt kenara kadar boyanıyor. iphone-17pro-gameplay.png bu son görünümü gösterir. Compact ekran görüntüsü son saat çubuğu gizleme değişikliğinden önceki yerleşim kanıtıdır. Son paket iki simülatöre kuruldu; son tam ekran görsel kontrolü büyük simülatörde yapıldı.
