import { test } from "node:test";
import assert from "node:assert/strict";
import { swipeTarget } from "../src/ui/boardInput";
import { celebrationForWave, impactForWave } from "../src/ui/impact";
import { nextCoachTopic } from "../src/ui/coachRules";
test("swipe ignores jitter and refuses all board boundaries", () => {
  assert.equal(swipeTarget(0, 13, 3), null);
  assert.equal(swipeTarget(7, 40, 0), null);
  assert.equal(swipeTarget(8, -40, 0), null);
  assert.equal(swipeTarget(0, 0, -40), null);
  assert.equal(swipeTarget(63, 0, 40), null);
  assert.equal(swipeTarget(18, 40, 2), 19);
  assert.equal(swipeTarget(18, 2, 40), 26);
});
test("celebrations reward meaningful waves; ordinary triple stays quiet", () => {
  assert.equal(celebrationForWave(3, 1, false, 180), null);
  assert.equal(celebrationForWave(8, 1, true, 480), "KATLA PATLA!");
  assert.equal(celebrationForWave(3, 2, false, 360), "KATLA +2");
  assert.equal(celebrationForWave(3, 3, false, 540), "KATLA PATLA!");
  assert.ok(impactForWave(3, 1, false).amplitude > 0);
  assert.ok(
    impactForWave(8, 1, true).amplitude >
      impactForWave(3, 1, false).amplitude * 4,
  );
});
test("coach skips used, seen and unavailable helpers; economy topics remain available", () => {
  const helpers = { needle: 0, heart: 0, shuffle: 2 };
  assert.equal(nextCoachTopic(new Set(), helpers), "shuffle");
  assert.equal(nextCoachTopic(new Set(["shuffle"]), helpers), "lives");
  assert.equal(nextCoachTopic(new Set(["shuffle", "lives"]), helpers), "gold");
  assert.equal(
    nextCoachTopic(new Set(["shuffle", "lives", "gold"]), helpers),
    null,
  );
});
