import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialSave,
  startLevel,
  settle,
  abandon,
  replenish,
  LIFE_MS,
  buy,
  continueGame,
  decodeSave,
} from "../src/state/model";
test("five lives, 30 minute regeneration, cap and backward time", () => {
  const s = { ...initialSave(1000), lives: 3 };
  assert.equal(replenish(s, 1000 + LIFE_MS - 1).lives, 3);
  assert.equal(replenish(s, 1000 + LIFE_MS).lives, 4);
  assert.equal(replenish(s, 1000 + 10 * LIFE_MS).lives, 5);
  assert.equal(replenish(s, 0).lives, 3);
});
test("win rewards once, loss charges once, abandoned settled game cannot double charge", () => {
  let s = startLevel(initialSave(0), 1, 1000);
  s = settle(s, { ...s.game!, phase: "won" }, 2000);
  assert.equal(s.gold, 1350);
  assert.equal(s.lives, 5);
  assert.equal(s.unlocked, 2);
  assert.equal(settle(s, s.game!, 2001), s);
  assert.equal(abandon(s, 2002).lives, 5);
  let l = startLevel(initialSave(0), 1, 1000);
  l = settle(l, { ...l.game!, phase: "lost" }, 2000);
  assert.equal(l.lives, 4);
  assert.equal(settle(l, l.game!, 3000).lives, 4);
  assert.equal(abandon(l, 3000).lives, 4);
});
test("background save roundtrip keeps board and moves; corruption is rejected", () => {
  const s = startLevel(initialSave(0), 1, 1000);
  assert.deepEqual(decodeSave(JSON.stringify(s)), s);
  assert.throws(() => decodeSave("{"));
  assert.throws(() => decodeSave(JSON.stringify({ ...s, lives: -1 })));
  const bad = structuredClone(s);
  bad.game!.board[1] = bad.game!.board[0]!;
  assert.throws(() => decodeSave(JSON.stringify(bad)));
});
test("active run cannot be replaced, zero lives block start and locked levels stay locked", () => {
  const s = startLevel(initialSave(0), 1, 1000);
  assert.equal(startLevel(s, 1, 2000).game!.id, s.game!.id);
  assert.equal(startLevel(initialSave(0), 2, 1000).game, null);
  assert.equal(startLevel({ ...initialSave(0), lives: 0 }, 1, 1000).game, null);
});
test("continue offer once only, insufficient funds never go negative", () => {
  let s = startLevel(initialSave(0), 1, 1000);
  s = { ...s, game: { ...s.game!, phase: "offer", moves: 0 } };
  const c = continueGame(s);
  assert.equal(c.gold, 1050);
  assert.equal(c.game!.moves, 5);
  assert.equal(continueGame(c), c);
  assert.equal(continueGame({ ...s, gold: 0 }).gold, 0);
});
test("store never charges full lives or insufficient funds; helper purchase atomic", () => {
  const s = initialSave(0);
  assert.equal(buy(s, "lives", 1), s);
  assert.equal(buy({ ...s, gold: 0 }, "needle", 1).helpers.needle, 3);
  const n = buy(s, "needle", 1);
  assert.equal(n.gold, 1150);
  assert.equal(n.helpers.needle, 4);
  const l = buy({ ...s, lives: 2 }, "lives", 1);
  assert.equal(l.gold, 950);
  assert.equal(l.lives, 5);
});
