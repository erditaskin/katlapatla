import type { Helper } from "../state/model";
export const coachTips = {
  needle: "Miyav! Son hedefin kaldıysa iğneyle tek balonu del. Hamle harcamaz.",
  heart:
    "Kalp, seçtiğin balonu özel balona çevirir. Komşusuyla değiştir; bütün sırayı patlat!",
  shuffle:
    "Tahta sıkıştı mı? Karıştır, balonların yerini hamle harcamadan değiştirir.",
  lives:
    "Canlarını sol üstten gör. Kaybedince 1 can gider; her 30 dakikada 1 can yenilenir.",
  gold: "Bölüm kazan, altın biriktir! Üstteki altına dokun; mağazadan yardımcı veya can al.",
} as const;
export type CoachTopic = keyof typeof coachTips;
export function nextCoachTopic(
  seen: ReadonlySet<string>,
  helpers: Record<Helper, number>,
): CoachTopic | null {
  for (const topic of [
    "needle",
    "heart",
    "shuffle",
    "lives",
    "gold",
  ] as const) {
    if (seen.has(topic)) continue;
    if (
      (topic === "needle" || topic === "heart" || topic === "shuffle") &&
      helpers[topic] < 1
    )
      continue;
    return topic;
  }
  return null;
}
