/** Static cell hit targets must not inherit animated tile positions. */
export function swipeTarget(index: number, dx: number, dy: number) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 14) return null;
  const horizontal = Math.abs(dx) > Math.abs(dy);
  const target = index + (horizontal ? (dx > 0 ? 1 : -1) : dy > 0 ? 8 : -8);
  if (target < 0 || target >= 64) return null;
  if (horizontal && Math.floor(index / 8) !== Math.floor(target / 8))
    return null;
  return target;
}
