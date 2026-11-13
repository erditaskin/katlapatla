import { performance } from "node:perf_hooks";
import { createGame, legalMoves, move } from "../src/game/engine";
const times: number[] = [];
let waves = 0;
for (let seed = 1; seed <= 100; seed++) {
  let g = createGame(
    1,
    20,
    [
      { color: "sun", count: 100 },
      { color: "ankh", count: 100 },
    ],
    seed,
    "bench",
  );
  for (let i = 0; i < 10 && g.phase === "playing"; i++) {
    const pair = legalMoves(g.board)[0]!;
    const start = performance.now();
    const out = move(g, ...pair);
    times.push(performance.now() - start);
    waves += out.waves.length;
    g = out.game;
  }
}
times.sort((a, b) => a - b);
console.log(
  JSON.stringify(
    {
      environment: "desktop Node; not device FPS",
      moves: times.length,
      waves,
      p50_ms: times[Math.floor(times.length * 0.5)],
      p95_ms: times[Math.floor(times.length * 0.95)],
      max_ms: times[times.length - 1],
    },
    null,
    2,
  ),
);
