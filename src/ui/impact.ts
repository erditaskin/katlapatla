/** Presentation only. None of these values influence matches, rewards or moves. */
export function impactForWave(count: number, combo: number, special: boolean) {
  const tier =
    special || count >= 12 || combo >= 4
      ? "large"
      : count >= 6 || combo >= 2
        ? "medium"
        : "small";
  return {
    tier,
    amplitude: tier === "large" ? 14 : tier === "medium" ? 6 : 1.8,
    popMs: 410,
    fallMs: 230,
    emitters: Math.min(count, 14),
  } as const;
}
export function goalProgress(initial: number, remaining: number) {
  return initial > 0
    ? Math.max(0, Math.min(1, (initial - remaining) / initial))
    : 0;
}
export function spreadEmitters(indices: number[], max = 14) {
  return indices.length <= max
    ? indices
    : Array.from(
        { length: max },
        (_, i) => indices[Math.floor((i * indices.length) / max)]!,
      );
}
