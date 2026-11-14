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
    amplitude: tier === "large" ? 18 : tier === "medium" ? 9 : 3.5,
    popMs: 410,
    fallMs: 230,
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

export function celebrationForWave(
  count: number,
  combo: number,
  special: boolean,
  points: number,
) {
  if (combo >= 3 || points >= 1500 || count >= 16) return "KATLA PATLA!";
  if (special || count >= 8) return "KATLA PATLA!";
  if (combo >= 2) return `KATLA +${combo}`;
  return null;
}
