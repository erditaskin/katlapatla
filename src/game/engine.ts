export const SIZE = 8;
export const COLORS = [
  "sun",
  "ankh",
  "feather",
  "lotus",
  "waves",
  "pillar",
] as const;
export type Color = (typeof COLORS)[number];
export type Power = "horizontal" | "vertical" | "gift" | "pressure";
export type Tile = { id: number; color: Color; power?: Power };
export type Board = Tile[];
export type Goal = { color: Color; count: number };
export type Game = {
  id: string;
  level: number;
  board: Board;
  moves: number;
  score: number;
  goals: Goal[];
  seed: number;
  nextId: number;
  phase: "playing" | "offer" | "won" | "lost";
  continued: boolean;
  settled: boolean;
};
export type Wave = {
  board: Board;
  removed: number[];
  colors: Color[];
  combo: number;
};
export type Outcome = { game: Game; waves: Wave[]; valid: boolean };
export function random(seed: number): [number, number] {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}
export function adjacent(a: number, b: number) {
  return (
    a >= 0 &&
    b >= 0 &&
    a < 64 &&
    b < 64 &&
    (Math.abs(a - b) === 8 ||
      (Math.floor(a / 8) === Math.floor(b / 8) && Math.abs(a - b) === 1))
  );
}
export function matches(board: Board): number[][] {
  const groups: number[][] = [];
  for (let axis = 0; axis < 2; axis++)
    for (let line = 0; line < SIZE; line++) {
      let run: number[] = [];
      for (let j = 0; j <= SIZE; j++) {
        const index = axis === 0 ? line * SIZE + j : j * SIZE + line;
        const previous = run[run.length - 1];
        if (
          j < SIZE &&
          (previous === undefined ||
            board[index]!.color === board[previous]!.color)
        )
          run.push(index);
        else {
          if (run.length >= 3) groups.push(run);
          run = j < SIZE ? [index] : [];
        }
      }
    }
  return groups;
}
function swap(board: Board, a: number, b: number) {
  const next = [...board];
  [next[a], next[b]] = [next[b]!, next[a]!];
  return next;
}
export function legalMoves(board: Board): [number, number][] {
  const moves: [number, number][] = [];
  for (let a = 0; a < 64; a++)
    for (const b of [a + 1, a + 8]) {
      if (!adjacent(a, b)) continue;
      if (
        board[a]!.power ||
        board[b]!.power ||
        matches(swap(board, a, b)).length
      )
        moves.push([a, b]);
    }
  return moves;
}
function nextTile(g: Game): Tile {
  const [v, seed] = random(g.seed);
  g.seed = seed;
  return { id: g.nextId++, color: COLORS[Math.floor(v * COLORS.length)]! };
}
export function createGame(
  level: number,
  moves: number,
  goals: Goal[],
  seed: number,
  id: string,
): Game {
  const g: Game = {
    id,
    level,
    board: [],
    moves,
    goals: goals.map((x) => ({ ...x })),
    score: 0,
    seed: seed >>> 0,
    nextId: 1,
    phase: "playing",
    continued: false,
    settled: false,
  };
  for (let i = 0; i < 64; i++) {
    let t = nextTile(g);
    while (
      (i % 8 >= 2 &&
        g.board[i - 1]!.color === t.color &&
        g.board[i - 2]!.color === t.color) ||
      (i >= 16 &&
        g.board[i - 8]!.color === t.color &&
        g.board[i - 16]!.color === t.color)
    )
      t = nextTile(g);
    g.board.push(t);
  }
  if (!legalMoves(g.board).length)
    return createGame(level, moves, goals, g.seed + 1, id);
  return g;
}
export function shuffleGame(game: Game): Game {
  const next = {
    ...game,
    board: [...game.board],
    goals: game.goals.map((x) => ({ ...x })),
  };
  // Retain every tile, including earned powers. Find a settled, playable permutation.
  for (let attempt = 0; attempt < 200; attempt++) {
    for (let i = 63; i > 0; i--) {
      const [v, seed] = random(next.seed);
      next.seed = seed;
      const j = Math.floor(v * (i + 1));
      [next.board[i], next.board[j]] = [next.board[j]!, next.board[i]!];
    }
    if (!matches(next.board).length && legalMoves(next.board).length)
      return next;
  }
  return game;
}
function resolve(
  g: Game,
  groups: number[][],
  initial: number[],
  preferred?: number,
  giftColor?: Color,
): Outcome {
  const waves: Wave[] = [];
  let trigger = initial;
  for (
    let combo = 1;
    (groups.length || trigger.length) && combo <= 100;
    combo++
  ) {
    const clear = new Set(groups.flat().concat(trigger));
    const created = new Map<number, Power>();
    // Merge intersecting runs so T/L shapes create one pressure power.
    const merged: number[][] = [];
    for (const group of groups) {
      const intersects = merged.filter((x) => x.some((i) => group.includes(i)));
      const all = [...new Set(group.concat(...intersects))];
      for (const x of intersects) merged.splice(merged.indexOf(x), 1);
      merged.push(all);
    }
    for (const group of merged) {
      if (group.length < 4) continue;
      const straight =
        group.every((i) => Math.floor(i / 8) === Math.floor(group[0]! / 8)) ||
        group.every((i) => i % 8 === group[0]! % 8);
      const index =
        preferred !== undefined && group.includes(preferred)
          ? preferred
          : group[Math.floor(group.length / 2)]!;
      if (!g.board[index]!.power)
        created.set(
          index,
          !straight
            ? "pressure"
            : group.length >= 5
              ? "gift"
              : Math.floor(group[0]! / 8) === Math.floor(group[1]! / 8)
                ? "horizontal"
                : "vertical",
        );
    }
    const processed = new Set<number>();
    for (const index of clear) {
      if (processed.has(index)) continue;
      processed.add(index);
      const tile = g.board[index]!;
      if (!tile.power) continue;
      created.delete(index);
      for (let j = 0; j < 64; j++) {
        const hit =
          tile.power === "gift"
            ? g.board[j]!.color === (giftColor ?? tile.color)
            : tile.power === "horizontal"
              ? Math.floor(j / 8) === Math.floor(index / 8)
              : tile.power === "vertical"
                ? j % 8 === index % 8
                : Math.abs((j % 8) - (index % 8)) <= 1 &&
                  Math.abs(Math.floor(j / 8) - Math.floor(index / 8)) <= 1;
        if (hit) clear.add(j);
      }
    }
    for (const index of created.keys()) clear.delete(index);
    const removed = [...clear];
    const colors = removed.map((i) => g.board[i]!.color);
    for (const goal of g.goals)
      goal.count = Math.max(
        0,
        goal.count - colors.filter((c) => c === goal.color).length,
      );
    g.score += removed.length * 60 * Math.min(combo, 8);
    waves.push({ board: [...g.board], removed, colors, combo });
    const old = [...g.board];
    for (const [i, power] of created) old[i] = { ...old[i]!, power };
    for (let col = 0; col < 8; col++) {
      const survivors = Array.from({ length: 8 }, (_, row) => row * 8 + col)
        .filter((i) => !clear.has(i))
        .map((i) => old[i]!);
      for (let row = 7; row >= 0; row--)
        g.board[row * 8 + col] = survivors.pop() ?? nextTile(g);
    }
    groups = matches(g.board);
    trigger = [];
    preferred = undefined;
    giftColor = undefined;
  }
  if (matches(g.board).length) throw new Error("Cascade safety limit reached");
  g.phase = g.goals.every((x) => x.count === 0)
    ? "won"
    : g.moves === 0
      ? "offer"
      : "playing";
  if (g.phase === "playing" && !legalMoves(g.board).length) g = shuffleGame(g);
  return { game: g, waves, valid: true };
}
export function move(game: Game, a: number, b: number): Outcome {
  if (game.phase !== "playing" || !adjacent(a, b))
    return { game, waves: [], valid: false };
  const board = swap(game.board, a, b);
  const groups = matches(board);
  const powers = [a, b].filter((i) => !!board[i]!.power);
  if (!groups.length && !powers.length)
    return { game, waves: [], valid: false };
  const g = {
    ...game,
    board,
    goals: game.goals.map((x) => ({ ...x })),
    moves: game.moves - 1,
  };
  // Two gifts clear the entire board; gift + normal selects the neighbor color.
  const bothGifts = board[a]!.power === "gift" && board[b]!.power === "gift";
  const giftColor =
    board[a]!.power === "gift"
      ? board[b]!.color
      : board[b]!.power === "gift"
        ? board[a]!.color
        : undefined;
  return resolve(
    g,
    groups,
    bothGifts ? Array.from({ length: 64 }, (_, i) => i) : powers,
    b,
    giftColor,
  );
}
export function needle(game: Game, index: number): Outcome {
  if (game.phase !== "playing" || index < 0 || index >= 64)
    return { game, waves: [], valid: false };
  return resolve(
    {
      ...game,
      board: [...game.board],
      goals: game.goals.map((x) => ({ ...x })),
    },
    [],
    [index],
  );
}
export function addHeart(game: Game, index: number): Game {
  if (
    game.phase !== "playing" ||
    index < 0 ||
    index >= 64 ||
    game.board[index]!.power
  )
    return game;
  const board = [...game.board];
  board[index] = { ...board[index]!, power: "horizontal" };
  return { ...game, board };
}
