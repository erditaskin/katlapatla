import { createGame, type Game, COLORS } from "../game/engine";
import { levels } from "../game/levels";
export const LIFE_MS = 30 * 60 * 1000;
export type Helper = "needle" | "shuffle" | "heart";
export type Settings = {
  sound: boolean;
  music: boolean;
  haptics: boolean;
  reducedMotion: boolean;
};
export type Save = {
  version: 1;
  gold: number;
  lives: number;
  lifeAt: number;
  unlocked: number;
  stars: Record<string, number>;
  helpers: Record<Helper, number>;
  settings: Settings;
  game: Game | null;
  tutorial: boolean;
  run: number;
};
export function initialSave(now: number): Save {
  return {
    version: 1,
    gold: 1250,
    lives: 5,
    lifeAt: now,
    unlocked: 1,
    stars: {},
    helpers: { needle: 3, shuffle: 2, heart: 1 },
    settings: { sound: true, music: true, haptics: true, reducedMotion: false },
    game: null,
    tutorial: false,
    run: 0,
  };
}
export function replenish(s: Save, now: number): Save {
  if (s.lives >= 5) return s;
  // Ignore backward clock jumps. No negative regeneration or overflow.
  const ticks = Math.floor(Math.max(0, now - s.lifeAt) / LIFE_MS);
  if (!ticks) return s;
  const lives = Math.min(5, s.lives + ticks);
  return {
    ...s,
    lives,
    lifeAt: lives === 5 ? now : s.lifeAt + ticks * LIFE_MS,
  };
}
export function loseLife(s: Save, now: number): Save {
  return {
    ...s,
    lives: Math.max(0, s.lives - 1),
    lifeAt: s.lives === 5 ? now : s.lifeAt,
  };
}
export function settle(s: Save, game: Game, now: number): Save {
  if (s.game?.id !== game.id || s.game.settled) return s;
  if (game.phase === "won") {
    const star = game.moves >= 8 ? 3 : game.moves >= 3 ? 2 : 1;
    const first = !s.stars[String(game.level)];
    return {
      ...s,
      game: { ...game, settled: true },
      gold: s.gold + (first ? 100 : 25),
      unlocked: Math.min(50, Math.max(s.unlocked, game.level + 1)),
      stars: {
        ...s.stars,
        [game.level]: Math.max(star, s.stars[String(game.level)] ?? 0),
      },
    };
  }
  if (game.phase === "lost")
    return { ...loseLife(s, now), game: { ...game, settled: true } };
  return { ...s, game };
}
export function startLevel(s: Save, level: number, now: number): Save {
  s = replenish(s, now);
  if (s.lives <= 0 || level < 1 || level > s.unlocked) return s;
  if (s.game && !s.game.settled) return s;
  const def = levels[level - 1]!;
  const run = s.run + 1;
  return {
    ...s,
    run,
    game: createGame(
      level,
      def.moves,
      def.goals,
      (now + run * 7919) >>> 0,
      `${now}-${run}`,
    ),
  };
}
export function abandon(s: Save, now: number): Save {
  if (!s.game || s.game.settled) return { ...s, game: null };
  const lost = settle(s, { ...s.game, phase: "lost" }, now);
  return { ...lost, game: null };
}
export function continueGame(s: Save): Save {
  if (!s.game || s.game.phase !== "offer" || s.game.continued || s.gold < 200)
    return s;
  return {
    ...s,
    gold: s.gold - 200,
    game: { ...s.game, moves: 5, continued: true, phase: "playing" },
  };
}
export function buy(s: Save, item: Helper | "lives", now: number): Save {
  s = replenish(s, now);
  const price = { needle: 100, shuffle: 150, heart: 200, lives: 300 }[item];
  if (s.gold < price || (item === "lives" && s.lives === 5)) return s;
  return item === "lives"
    ? { ...s, gold: s.gold - price, lives: 5, lifeAt: now }
    : {
        ...s,
        gold: s.gold - price,
        helpers: { ...s.helpers, [item]: s.helpers[item] + 1 },
      };
}
const integer = (x: unknown, min: number, max: number): x is number =>
  Number.isInteger(x) && (x as number) >= min && (x as number) <= max;
export function decodeSave(raw: string): Save {
  const s = JSON.parse(raw) as Save;
  if (
    s.version !== 1 ||
    !integer(s.gold, 0, 100000000) ||
    !integer(s.lives, 0, 5) ||
    !Number.isFinite(s.lifeAt) ||
    !integer(s.unlocked, 1, 50) ||
    !integer(s.run, 0, 1e9) ||
    typeof s.tutorial !== "boolean"
  )
    throw new Error("Geçersiz kayıt");
  if (
    !s.settings ||
    !["sound", "music", "haptics", "reducedMotion"].every(
      (k) => typeof s.settings[k as keyof Settings] === "boolean",
    )
  )
    throw new Error("Geçersiz ayarlar");
  if (
    !s.helpers ||
    !["needle", "shuffle", "heart"].every((k) =>
      integer(s.helpers[k as Helper], 0, 1e6),
    )
  )
    throw new Error("Geçersiz yardımcı");
  if (
    !s.stars ||
    typeof s.stars !== "object" ||
    !Object.entries(s.stars).every(
      ([k, v]) => integer(Number(k), 1, 50) && integer(v, 1, 3),
    )
  )
    throw new Error("Geçersiz yıldız");
  if (s.game) {
    const g = s.game;
    if (
      !g.id ||
      !integer(g.level, 1, 50) ||
      !integer(g.moves, 0, 100) ||
      !integer(g.score, 0, 1e9) ||
      !integer(g.seed, 0, 4294967295) ||
      !integer(g.nextId, 1, 1e8) ||
      !["playing", "offer", "won", "lost"].includes(g.phase) ||
      typeof g.settled !== "boolean" ||
      typeof g.continued !== "boolean"
    )
      throw new Error("Geçersiz bölüm");
    if (
      !Array.isArray(g.board) ||
      g.board.length !== 64 ||
      !g.board.every(
        (t) =>
          integer(t.id, 1, g.nextId - 1) &&
          COLORS.includes(t.color) &&
          (!t.power ||
            ["horizontal", "vertical", "gift", "pressure"].includes(t.power)),
      ) ||
      new Set(g.board.map((t) => t.id)).size !== 64
    )
      throw new Error("Geçersiz tahta");
    if (
      !Array.isArray(g.goals) ||
      g.goals.length !== 2 ||
      !g.goals.every(
        (t) => COLORS.includes(t.color) && integer(t.count, 0, 100),
      )
    )
      throw new Error("Geçersiz hedef");
  }
  return s;
}
