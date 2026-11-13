# Katla Patla

Antik Mısır temalı, su balonlarıyla oynanan çevrimdışı match-3 iOS oyunu. Ultimatum’dan bağımsız projedir.

## Çalıştırma

Node 22.13 veya daha yeni LTS kullanın.

```sh
npm ci
npm start
npm run ios
```

Standalone simülatör sürümü:

```sh
npx expo run:ios --configuration Release --device
```

## Kontroller

Komşu iki balonu kaydırın veya sırayla dokunun. Hedefleri hamleler bitmeden toplayın. Dörtlü kalp, düz beşli hediye, kesişen beşli basınç gücü üretir. Yardımcılar hamle tüketmez. Arka plana alınan bölüm kayıttan devam eder.

## Doğrulama

```sh
npm run typecheck
npm run lint
npm test
npx expo-doctor
node --import tsx scripts/benchmark.ts
python3 scripts/validate-assets.py
```

Kararlar ve sınırlar: [Uygulama sözleşmesi](docs/IMPLEMENTATION.md), [ürün kararları](docs/DECISIONS.md), [görsel sözleşme](docs/VISUAL_SPEC.md). Konseptler `design/`, kullanılan varlıklar `assets/` altındadır.

Bu inceleme sürümünde altınla mağaza aktiftir. Gerçek reklam ve uygulama içi satın alma hizmetleri bağlı değildir. Sahte ödeme veya reklam ödülü verilmez. Gerçek para harcanmaz.
