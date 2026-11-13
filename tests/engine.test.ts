import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createGame,
  matches,
  legalMoves,
  move,
  needle,
  shuffleGame,
  adjacent,
  COLORS,
  type Game,
} from "../src/game/engine";
import { levels } from "../src/game/levels";
function fixture(seed = 23): Game {
  return createGame(
    1,
    24,
    [
      { color: "sun", count: 80 },
      { color: "ankh", count: 80 },
    ],
    seed,
    "test",
  );
}
test("50 levels have settled playable boards, unique IDs and repeatable seeds", () => {
  assert.equal(levels.length, 50);
  for (const l of levels) {
    for (let seed = 1; seed <= 5; seed++) {
      const g = createGame(l.id, l.moves, l.goals, seed, "x");
      assert.equal(g.board.length, 64);
      assert.equal(new Set(g.board.map((t) => t.id)).size, 64);
      assert.equal(matches(g.board).length, 0);
      assert.ok(legalMoves(g.board).length);
      assert.deepEqual(g, createGame(l.id, l.moves, l.goals, seed, "x"));
    }
  }
});
test("invalid swap preserves board, seed, score and moves; no row wrapping", () => {
  const g = fixture();
  assert.equal(adjacent(7, 8), false);
  assert.equal(move(g, 7, 8).valid, false);
  const valid = legalMoves(g.board);
  let invalid: [number, number] | undefined;
  for (let i = 0; i < 63; i++)
    if (adjacent(i, i + 1) && !valid.some(([a, b]) => a === i && b === i + 1)) {
      invalid = [i, i + 1];
      break;
    }
  assert.ok(invalid);
  assert.equal(move(g, ...invalid).game, g);
});
test("successful swap consumes one move regardless of cascade; source immutable", () => {
  const g = fixture();
  const before = JSON.stringify(g);
  const [a, b] = legalMoves(g.board)[0]!;
  const out = move(g, a, b);
  assert.ok(out.valid);
  assert.equal(out.game.moves, 23);
  assert.ok(out.waves.length);
  assert.equal(matches(out.game.board).length, 0);
  assert.equal(JSON.stringify(g), before);
  assert.equal(new Set(out.game.board.map((t) => t.id)).size, 64);
});
test("4 creates heart, 5 creates gift, intersection creates pressure", () => {
  for (const [length, power] of [
    [4, "horizontal"],
    [5, "gift"],
  ] as const) {
    const g = fixture(89);
    for (let i = 0; i < length; i++)
      g.board[i] = { ...g.board[i]!, color: "sun" };
    g.board[8] = { ...g.board[8]!, color: "sun" };
    g.board[0] = { ...g.board[0]!, color: "ankh" };
    const out = move(g, 0, 8);
    assert.ok(out.valid);
    assert.ok(
      out.game.board.some((t) => t.power === power),
      power,
    );
  }
  const g = fixture(65);
  for (const i of [2, 10, 18, 17, 19])
    g.board[i] = { ...g.board[i]!, color: "sun" };
  g.board[2] = { ...g.board[2]!, color: "ankh" };
  g.board[3] = { ...g.board[3]!, color: "sun" };
  assert.ok(move(g, 2, 3).game.board.some((t) => t.power === "pressure"));
});
test("gift with neighbor clears chosen color and propagates special effects", () => {
  const g = fixture();
  g.board[0] = { ...g.board[0]!, power: "gift" };
  const color = g.board[1]!.color;
  const expected = g.board.filter((t) => t.color === color).length;
  const out = move(g, 0, 1);
  assert.ok(out.waves[0]!.removed.length >= expected);
});
test("two gifts clear 64 cells; needle never costs a move", () => {
  const g = fixture();
  g.board[0] = { ...g.board[0]!, power: "gift" };
  g.board[1] = { ...g.board[1]!, power: "gift" };
  assert.equal(move(g, 0, 1).waves[0]!.removed.length, 64);
  assert.equal(needle(fixture(), 10).game.moves, 24);
});
test("shuffle preserves tile identities and powers without awarding score", () => {
  const g = fixture();
  g.board[4] = { ...g.board[4]!, power: "gift" };
  const s = shuffleGame(g);
  assert.deepEqual(
    s.board.map((t) => t.id).sort((a, b) => a - b),
    g.board.map((t) => t.id).sort((a, b) => a - b),
  );
  assert.equal(s.board.find((t) => t.id === g.board[4]!.id)!.power, "gift");
  assert.equal(s.score, g.score);
  assert.equal(matches(s.board).length, 0);
});
test("100 seeded rounds maintain settled board and nonnegative goals", () => {
  for (let seed = 1; seed <= 100; seed++) {
    let g = fixture(seed);
    for (let i = 0; i < 12 && g.phase === "playing"; i++) {
      const [a, b] = legalMoves(g.board)[0]!;
      g = move(g, a, b).game;
      assert.equal(matches(g.board).length, 0);
      assert.ok(g.goals.every((x) => x.count >= 0));
      assert.ok(g.board.every((t) => COLORS.includes(t.color)));
    }
  }
});
