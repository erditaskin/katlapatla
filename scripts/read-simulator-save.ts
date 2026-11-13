// Read-only QA helper. It never injects state or executes simulator gestures.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { legalMoves, move } from "../src/game/engine";
import { decodeSave } from "../src/state/model";
const key = "@katlapatla-balloons/save/v1";
const container = process.argv[2]
  ? null
  : execFileSync(
      "xcrun",
      [
        "simctl",
        "get_app_container",
        process.env.SIMULATOR_UDID ?? "booted",
        "com.erditaskin.katlapatla.balloons",
        "data",
      ],
      { encoding: "utf8" },
    ).trim();
const dir =
  process.argv[2] ??
  resolve(
    container!,
    "Library/Application Support/com.erditaskin.katlapatla.balloons/RCTAsyncLocalStorage_V1",
  );
const manifest = JSON.parse(
  readFileSync(resolve(dir, "manifest.json"), "utf8"),
) as Record<string, string | null>;
const raw =
  manifest[key] ??
  readFileSync(
    resolve(dir, createHash("md5").update(key).digest("hex")),
    "utf8",
  );
const s = decodeSave(raw);
const g = s.game;
let best: unknown = null;
if (g && g.phase === "playing") {
  const options = legalMoves(g.board).map((pair) => ({
    pair,
    out: move(g, ...pair),
  }));
  options.sort(
    (a, b) =>
      a.out.game.goals.reduce((n, x) => n + x.count, 0) -
        b.out.game.goals.reduce((n, x) => n + x.count, 0) ||
      b.out.game.score - a.out.game.score,
  );
  const next = options[0];
  if (next)
    best = {
      pair: next.pair,
      remaining: next.out.game.goals,
      moves: next.out.game.moves,
    };
}
console.log(
  JSON.stringify(
    {
      gold: s.gold,
      lives: s.lives,
      unlocked: s.unlocked,
      helpers: s.helpers,
      game: g
        ? {
            id: g.id,
            phase: g.phase,
            moves: g.moves,
            score: g.score,
            goals: g.goals,
            boardHash: createHash("sha256")
              .update(JSON.stringify(g.board))
              .digest("hex"),
          }
        : null,
      best,
    },
    null,
    2,
  ),
);
