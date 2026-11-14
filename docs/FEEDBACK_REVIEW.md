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

## Follow-up correction after user review

The prior checks did not establish usability across the whole visible helper card. Coordinate testing reproduced the defect: tapping the needle illustration did nothing because only its text was a Pressable. Each full card is now one accessible animated button, with decorative children excluded from touch handling. Header, modal actions and helper icon areas must be checked with screen coordinates rather than relying only on accessibility activation.

The background image remains unchanged at the user's explicit request. The rejected water ambience is removed. PolygonDan's CC0 “Desert Mystic” now plays from one app-level player, continues across screens and pauses in background. The setting is named “Müzik”.

The old 5.5-point maximum shake was too subtle. Impact amplitudes are now 1.8 / 6 / 14 points, with a 306 ms decaying sequence. Reduced motion still disables displacement. These are tuning choices requiring user perceptual approval, not proof of visual quality.

### Follow-up validation evidence

- Reproduced the original helper defect by clicking the needle illustration at Device Hub coordinates (1150, 1310): no action. After the fix, the same coordinate opens its confirmation dialog. The Karıştır and Kalp illustrations also open their dialogs. These are coordinate clicks, not accessibility activation.
- Coordinate clicks also exercised Settings, modal close, modal primary action, Resume, the gold counter and a store purchase (200 game gold; heart stock 0 → 1). No real payment was involved.
- Activated that heart through real board coordinate clicks. Score changed from 4,020 to 4,500, moves from 13 to 12. Interaction returned after the effect.
- `impact-v3-silent.mp4` is the actual simulator recording, without an audio track. `impact-v3-measurement.json` estimates logo displacement from that recording: peak horizontal shift 44 physical pixels on the 3× simulator image (about 14.7 points, with four-pixel measurement quantization). This establishes rendered displacement, not subjective quality or frame-rate performance.
- Music setting is enabled in the installed app. The source is a 40-second musical composition, not a water ambience loop. Human listening approval remains outstanding.
- TypeScript, Expo lint and all 17 tests pass after these changes.
