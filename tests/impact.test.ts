import { test } from "node:test";
import assert from "node:assert/strict";
import { impactForWave, goalProgress, spreadEmitters } from "../src/ui/impact";
test("ordinary matches remain gentle; special and large cascades have bounded impact", () => {
  assert.equal(impactForWave(3, 1, false).tier, "small");
  assert.ok(impactForWave(3, 1, false).amplitude <= 4);
  assert.equal(impactForWave(3, 1, true).tier, "large");
  assert.equal(impactForWave(12, 1, false).tier, "large");
  assert.equal(impactForWave(3, 4, false).tier, "large");
  assert.ok(impactForWave(64, 100, true).amplitude <= 18);
});
test("particle budget samples whole board without duplicate emitters", () => {
  const all = Array.from({ length: 64 }, (_, i) => i);
  const sample = spreadEmitters(all);
  assert.equal(sample.length, 14);
  assert.equal(new Set(sample).size, 14);
  assert.ok(sample[sample.length - 1]! > 58);
  assert.deepEqual(spreadEmitters([1, 5, 9]), [1, 5, 9]);
});
test("meter reflects goals, independent of score and clamped to valid progress", () => {
  assert.equal(goalProgress(24, 24), 0);
  assert.equal(goalProgress(24, 12), 0.5);
  assert.equal(goalProgress(24, 0), 1);
  assert.equal(goalProgress(0, 10), 0);
  assert.equal(goalProgress(24, 30), 0);
});
