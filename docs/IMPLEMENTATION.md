# Katla Patla — uygulama sözleşmesi

## Yetki ve sürüm

14 Kasım 2026 tarihinde kullanıcı balon v2 biçimini onayladı ve uygulama ile simülatör testlerini başlatmamızı istedi. Önceki tasarım aşaması kısıtı bu açık yetkiyle aşılmıştır. Ultimatum değiştirilmez. Yeni bundle kimliği `com.erditaskin.katlapatla.balloons`, kayıt anahtarı `@katlapatla-balloons/save/v1` olur.

## Yapı

Expo 58, React Native 0.88, React 19, TypeScript strict ve Expo Router kullanılır. `src/app` yalnızca rotaları; `src/game` deterministik kuralları; `src/state` ekonomi ve kayıt işlemlerini; `src/ui` görsel ve ses bileşenlerini içerir. React Context tek yerel kayıt için yeterlidir; bu aşamada sunucu, hesap veya gereksiz veri katmanı eklenmez. Native dosyalar Expo prebuild çıktısıdır ve Git dışında kalır.

Motor PRNG durumunu kayıtla birlikte taşır. Takas geçersizse tahta ve hamle sayısı değişmez. Geçerli hamle yalnızca bir hamle tüketir; tüm zincirler aynı işlem içinde çözülür. Yatay/dikey dört kalp; düz beş hediye; kesişen T/L basınç gücü üretir. Özel güçle komşu takası gücü tetikler. İki hediye tüm tahtayı temizler; diğer güç çiftleri kendi alanlarının birleşimini ve dokundukları güçleri tetikler. Bu sade matris ilk uygulama kararıdır. Yeni güç tercih edilen takas konumunda, uygun değilse grubun ortasında oluşur. Hedefler gerçekten temizlenen parçalarla azalır. Puan çarpanı en çok sekizdir. Tahta dolduktan sonra yeni eşleşme kalmaz; hamlesiz tahta karıştırılır.

## Ekonomi ve yaşam döngüsü

Başlangıç 1.250 altın, 5 can ve 3 iğne/2 karıştır/1 kalptir. İlk bölüm ödülü 100, tekrar kazanma ödülü 25 altındır. Yıldızlar kalan hamleye göre 1–3 arasında verilir ve önceki en iyi değer korunur. Can dolumu 300; iğne 100; karıştır 150; kalp 200 altındır. Bölümde tek ek hamle teklifi 200 altına beş hamledir. Bunlar kullanıcı testine açık başlangıç değerleridir; gelir optimizasyonu doğrulanmamıştır.

Can yalnızca kayıp kesinleşince veya açık çıkış onayında kesilir. Tam candan ilk kesintide yenileme saati başlar. Yenileme 30 dakikada birdir ve beşte durur. Cihaz saati geri alınırsa negatif yenileme oluşmaz. Yerel saat ve yerel altın kaydı hileye dayanıklı sunucu ekonomisi değildir.

Bölüm sonucu görsel efektlerden önce tek kayıt değişiminde kesinleşir. `settled` aynı bölümün ödülünü veya cezasını tekrar yazmayı engeller. Arka plana geçiş terk değildir. Kayıt, çözülmüş tahta ve PRNG ile devam eder; yarım efekt tekrar ödül üretmez. AsyncStorage yazıları sırayla yürür. Kayıt hatası görünür ve yeniden deneme sunulur; bozuk kayıt sessizce silinmez.

## Grafik, hareket ve ses

Altı normal balonda onaylanan v2 kullanılır. Çerçeve, ikon, buton, logo ve arka planlar ayrı resimlerdir; metin ve kontroller gerçek native bileşendir. Tam ekran mockup uygulamanın yerine kullanılmaz. Referans tuvali 390×844 noktadır; güvenli alan ve ekran ölçüsü cihazdan alınır. Tahta satır/sütunları 8×8 kalır. Georgia küçük metinde, OFL lisanslı Cinzel başlıklarda kullanılır. AI raster yazısının birebir font karşılığı olduğu iddia edilmez.

Patlama ölçeği native Animated sürücüsünde çalışır; React state her karede yazılmaz. Aynı anda en fazla bir su efekti sesi çalışır. Zincirde ses perdesi sınırlı yükselir; müzik düşük seviyededir. Sesler orijinal deterministik sentezdir; profesyonel kayıtlı su foley sesi değildir. Azaltılmış hareket, ses, müzik ve titreşim ayarları ayrı saklanır. Arka planda ses durur.

## Yayın sınırı

50 bölüm veri tanımı vardır. Her bölüm için başlangıç tahtası ve bot denemesi yapılır; 50 bölümün insanlarla özenli denge testi yapılmış değildir. İlk on bölüm kullanıcı doğrulaması hedefidir.

Gerçek reklam ve IAP hesabı/ürün kimlikleri verilmedi. Bu nedenle reklam ödülü veya para satın alımı taklit edilmez; hazır değil/yakında durumu görünür. Altınla yerel mağaza aktiftir. Üretim yayını için sağlayıcı seçimi, mağaza ürünleri, imzalı işlem doğrulaması, iade ve kimlik/geri yükleme stratejisi, gizlilik metinleri ve sandbox kanıtı hâlâ gereklidir. Bu simülatör inceleme sürümüdür; App Store’a hazır olduğu iddia edilmez.

## Doğrulama

`npm run test`, `npm run typecheck`, `npm run lint`, `npx expo-doctor`; varlık alfa/boyut kontrolü ve masaüstü motor benchmarkı uygulanır. Motor benchmarkı cihaz FPS ölçümü değildir. Gerçek iOS Release simülatör etkileşimleri ve ekran görüntüleri QA belgesine yazılır. Gerçek telefon bu aşamanın kapsamı değildir.

Resmî kaynaklar: https://docs.expo.dev/versions/v58.0.0/ , https://docs.expo.dev/versions/v58.0.0/sdk/audio/ , https://docs.expo.dev/versions/v58.0.0/sdk/font/ , https://docs.expo.dev/router/basics/notation/ .

## Bu Mac’te yerel derleme notu

Documents altındaki node_modules dosyalarında Node’un eşzamanlı okuması takıldı; paketler kilit dosyasıyla `/private/tmp/katlapatla-native-deps` içine yeniden kuruldu ve node_modules buraya bağlandı. Önceki klasör `.node_modules-cloud-backup` adıyla silinmeden korundu ve Git dışında tutuldu. Bu makineye özgü çalışma düzenidir; depoda standart npm ci kurulumu ve package-lock.json korunur. İlk native derleme paket okuma hatasıyla başarısız oldu; QA sonucu yalnızca başarılı son derleme üzerinden raporlanır.

Üretim bağımlılık audit çıktısı üç moderate bulgu bildirir: Expo fingerprint zincirindeki minimatch ve onu taşıyan paketler. Otomatik kırıcı yükseltme yapılmadı. Yayın öncesi uyumlu Expo yamalarıyla yeniden değerlendirilmelidir.


## Kalıcı yerel proje konumu

Tekrarlayan bulut dosya okuma takılmaları nedeniyle fiziksel proje `/Users/erdi/Developer/katlapatla` dizinine alındı. `/Users/erdi/Documents/ChatGPT/katlapatla` yolu bu dizine bağlantı olarak korunur. Eski klasör `katlapatla-cloud-backup-20261114` adıyla silinmeden tutuldu. Git nesneleri `/Users/erdi/.local/share/katlapatla/git` içindedir; çalışma ağacındaki `.git` dosyası burayı gösterir. Değişmemiş tasarım dosyaları GitHub’dan doğrulanmış nesneler üzerinden geri alındı; yeni kaynaklar, testler, varlıklar ve karar belgeleri korundu. Yeni bir makinede standart Git clone ve npm ci yeterlidir; bu yerel yollar projeye bağımlılık değildir.

## Son paketleme

Native Release derlemesi 0 hata ve iki SDK uyarısıyla tamamlandı. Son JavaScript düzeltmeleri aynı native bağımlılık seti üzerinde Expo’nun native build betiğinde kullandığı `export:embed --platform ios --dev false --bytecode` komutuyla Hermes olarak paketlendi. Kopya simülatör `.app` yeniden ad-hoc imzalanıp iki simülatöre kuruldu. Kaynak koddan temiz native build komutu README içinde korunur. Zincirde `shouldCorrectPitch=false` kullanılır; hız artışı ses perdesini de artırır. Bu ayar profesyonel ses foley kalite onayı değildir.


Bağımlılıklar son olarak `/Users/erdi/.local/share/katlapatla/dependencies` altına kalıcı taşındı; projenin node_modules bağlantısı burayı gösterir. Eski geçici yol uyumluluk bağlantısıyla korundu. Kayıt silinmedi; ana simülatörde test sonrası bölüm 2 açıldı.


## Tam ekran kararı

Kullanıcının son isteğiyle sistem durum çubuğu gizlenir. Arka plan ekranın tümünü, üst çentik ve alt home alanının arkasını da kaplar. Etkileşimli kontroller cihazın güvenli alanında tutulur; uygulama içinde letterbox veya sabit üst/alt boş bant kullanılmaz. Simülatörün fiziksel cihaz çerçevesi uygulamanın çizim alanı değildir.
