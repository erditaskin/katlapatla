# Motion and audio review — 14 November 2026

## Findings and changes

The previous board replaced cells in place, so gravity appeared as teleportation. A still splash briefly covered each matched cell. The fixed score threshold did not describe level completion. The synthetic sound effects lacked a water transient and body.

Balloon identity now survives position changes. Swaps and gravity use native-driven translations; popping uses a short squash followed by collapse. New balloons enter above the board. Invalid adjacent swaps visibly return without changing the domain state. Input is locked during resolution.

Water effects combine a color-specific splash, expanding ripple and five droplets per emitter. Each wave lasts 410 ms before a 230 ms gravity interval. A wave emits at most 14 splashes and 70 droplets, sampled across the removed cells. Animations update native transforms and opacity, not React state every frame.

Ordinary matches move the scene by at most 0.65 points; medium impacts use 2.4 points. Special balloons, twelve-cell bursts or fourth-and-later cascades use 5.5 points. A decaying seven-step shake returns to zero. These values affect presentation only.

Buttons, header counters, level nodes and text actions share a damped native spring with press feedback. Dialogs fade and settle into place. User and OS reduced-motion preferences disable shake and translations; goal and score feedback remains available.

The score panel separates points from goal completion. Its water meter represents collected targets divided by initial targets. Score and target counters advance with each displayed cascade, while the settled domain result is persisted before decoration. This preserves the existing protection against duplicate rewards after suspension.

## Sound pipeline

Real CC0 water recordings replace generated tones. Three short pop variants alternate; medium and large impacts use separate longer recordings. Playback supports at most two concurrent game-effect voices, preserves tails within that budget, and modestly raises pitch across cascades. UI actions use a quiet bubble transient. Ambient audio uses a quiet filtered water loop.

`assets/audio/CREDITS.md` records the source and license. Source Ogg files are retained. `scripts/generate-audio.py` creates mono 44.1 kHz PCM assets through FFmpeg, trims onset silence, adds short fades and normalizes loudness. `assets/audio/manifest.json` records source hashes and processing targets.

The simulator does not establish subjective audio quality or hardware haptic feel. Those require human listening and later physical-device review. No measured frame-rate claim is made.

## Verification

- TypeScript, Expo lint and 17 tests pass. Added tests cover impact bounds, particle sampling and goal progress.
- iPhone 17 Pro / iOS 26.3.1 through Device Hub: invalid swap preserved 20 moves and 1,800 points; a four-match created a special balloon and advanced to 19 moves / 1,980 points.
- Activating that special balloon advanced to 18 moves / 2,820 points and 64% target completion. Recorded frames show squash, splash expansion, falling survivors and restored board positions.
- Reduced motion was enabled through settings. Another valid match advanced to 17 moves / 3,000 points / 75% target completion. Normal motion was restored afterward.
- Compact 375 × 667 simulator: all 64 cells, score meter and three helpers fit. A valid match advanced from 24 to 23 moves, awarded 180 points and displayed 13% target completion.
- No physical phone test was performed. Existing native Release binary was rebundled with Expo's iOS bytecode export, signed and reinstalled; no native dependency changed.

The iPhone 17 Pro remains open on level 2 for review. Audio playback success is exercised by the app, but no loopback recording or subjective listening certification is claimed.
