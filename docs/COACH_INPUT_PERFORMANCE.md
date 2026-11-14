# Input, impact and guide review — 14 November 2026

## Input correction

Previously, the hit targets moved with tile identity animations. The board now has 64 stationary input cells, keyed by cell index. Animated balloons, splashes, celebrations and guide artwork cannot intercept input. Gesture state belongs to each input cell and is cleared on cancellation. Tap and swipe boundaries share the game engine's adjacency rule; crossing a row edge does not swallow a new selection.

Presentation uses a sequence token and `finally` cleanup. Suspension cancels decoration and unlocks the already-persisted board. A canceled presentation cannot overwrite the next one. The short intentional input lock during gravity is labeled “Balonlar yerleşiyor…”. Domain rewards still settle once before animation.

The intermittent hundred-tap failure was not reliably reproduced in the initial live session. This is a structural correction of the input risks, followed by repeated coordinate testing; it is not a claim that every possible device input issue is eliminated.

## Feedback

- Ordinary matches: 3.5-point decaying shake.
- Medium cascade: 9-point shake and “KATLA +2” style feedback.
- Special or large impact: up to 18 points and “KATLA PATLA!”.
- Meaningful point gains appear beside the celebration. Overlay lifetime is bounded to 750 ms and never captures touches.
- OS/user reduced motion disables positional effects and the guide's grow animation.
- Splash audio is mixed offline from a sharp water transient plus a liquid body, with three short variants, separate cascade/burst recordings and bounded two-voice overlap. Files are peak limited; this does not establish subjective quality.

## Black cat guide

A transparent masked Egyptian cat enters from the right with short contextual text. Topics explain needle, heart, shuffle, lives and gold. Unavailable or already-used helpers are skipped. Each topic appears at most once per app session, at least 45 seconds apart, for seven seconds. The scheduler stops when there are no eligible topics.

The indicated helper card or header counter grows by 8%, three times, then stops. The overlay does not block the board. The approximately two-second higher-pitched meow follows the **Music** setting; it does not use the general sound-effects switch. The recording's biological sex is unknown. Source/license and reproducible processing are in `assets/audio/CREDITS.md` and `scripts/generate-audio.py`.

## Performance review

- Both balloon art and stationary input cells are memoized. Stable event callbacks read the latest handlers after layout. Selection changes do not need to render unrelated cells.
- Navigation is memoized independently from save changes; a match no longer recreates the Stack configuration.
- Removed obsolete combo state, unused React imports, an unused pressed-state argument and duplicated adjacency logic. No explicit `any` occurs in `src/`. TypeScript now enforces `noUnusedLocals` and `noUnusedParameters` permanently.
- Animations use native transforms/opacity. There is no JavaScript animation-frame loop or continuous decorative loop.
- Particle budget remains at most 14 emitters / 70 droplets per wave. Game-effect overlap is at most two voices; there is one music player.
- Grow feedback runs three times only. Guide timers are cleaned up and stop after all eligible tips. Lives do not run a one-second timer while full.
- The engine benchmark covers 1,000 seeded moves: p50 0.273 ms, p95 0.380 ms, maximum 1.439 ms on desktop Node. This is not an iPhone frame-time measurement.
- Six idle simulator host-process samples reported 0–1.6% CPU and about 75 MB. See `docs/qa/coach-simulator-idle.json`. These are short host observations, not physical-device thermal measurements or a memory-leak certification.

Physical iPhone temperature, sustained battery use and hardware haptics still require the separately planned real-device pass. No “will not heat” guarantee is inferred from a simulator.

## Verification status

TypeScript, Expo lint and 20 tests cover engine invariants, economy, swipe boundaries, impact hierarchy, celebration thresholds and guide eligibility. Water WAVs are below PCM clipping. The generated cat PNG contains alpha.

In the earlier candidate build, 15 individually observed coordinate selections passed before/after a four-match and a subsequent special-balloon cascade. The recording shows both PATLA and KATLA PATLA feedback; the final copy replaces KOMBO with KATLA. The current saved game was level 3 by this point; level 2 was inspected before that. Do not describe this as a final level-2 soak test.

Final-build UI confirmation is pending recovery of Device Hub's ScreenCaptureKit -3811 capture failure. The build is installed; this limitation must remain explicit until live verification resumes.

The final Release bundle also passes a native launch screenshot check (`coach-final-launch.png`): map, saved balances and unlocked level 3 render without a runtime error. This does not replace the pending live input/grow/audio checks.
