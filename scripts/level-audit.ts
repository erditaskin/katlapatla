import { createGame, legalMoves, move } from "../src/game/engine";
import { levels } from "../src/game/levels";
const results = [];
for (const l of levels) {
  let g = createGame(l.id, l.moves, l.goals, 731 + l.id, "audit");
  let moves = 0;
  while (g.phase === "playing" && moves < 45) {
    const candidates = legalMoves(g.board).map((pair) => move(g, ...pair));
    candidates.sort((a, b) => {
      const av = a.game.goals.reduce((n, x) => n + x.count, 0);
      const bv = b.game.goals.reduce((n, x) => n + x.count, 0);
      return av - bv || b.game.score - a.game.score;
    });
    g = candidates[0]!.game;
    moves++;
  }
  results.push({
    level: l.id,
    status: g.phase,
    moves,
    remaining: g.goals.map((x) => x.count),
  });
}
console.log(
  JSON.stringify(
    {
      method:
        "One seeded greedy simulation per level; not human balance validation",
      won: results.filter((x) => x.status === "won").length,
      results,
    },
    null,
    2,
  ),
);
