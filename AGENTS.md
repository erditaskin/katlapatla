# Katla Patla project instructions

This is a new water-balloon match-3 game, separate from Ultimatum. Work on `main`; the target repository is `https://github.com/erditaskin/katlapatla.git`.

## Current phase

The project is in product and visual design. Read `docs/DECISIONS.md` and `docs/VISUAL_SPEC.md` first. Distinguish confirmed user decisions from proposed mechanics and design candidates. Do not start application implementation before the user authorizes it. Later explicit user authorization takes precedence over this phase note.

## Visual production

- Keep concept images in `design/`; production assets and reference art are different deliverables.
- Fix real fonts, color tokens, layout measurements and component states before claiming visual parity.
- Review actual phone-size sprites as well as enlarged artwork. A small image inside a generated sheet is not proof of a real 48-pixel asset.
- Use original, versioned transparent runtime assets. Never substitute a complete screen image for interactive native UI.
- If using atlases, clip to the sprite rectangle before centering it in a differently shaped target box. Letterboxing must not expose neighboring atlas pixels.
- Validate PNG dimensions, integer crop coordinates, source bounds and required item coverage.
- Generated mockup text, values and grid mistakes do not silently become product rules.

## Application architecture

- iOS-first Expo and TypeScript are the proposed stack. Check the installed Expo SDK and its matching official docs before using Expo/React Native APIs.
- Use Expo-compatible installation commands for native dependencies and a committed lockfile. Prefer maintained, proven libraries over custom infrastructure.
- Keep routes in `src/app/` and non-route code outside it when Expo Router is adopted.
- Do not edit generated native directories by hand; use app configuration and config plugins.
- Keep matching, gravity, cascades, special combinations, scoring, level results and life accounting in deterministic pure rules. Inject random sources and time.
- One player move consumes one move count. Animations and audio never grant resources or decide a level result.
- Save state transitions consistently. A lost or abandoned level must charge life at most once. Backgrounding must preserve the board.
- Verify ad completion and purchase transactions before granting rewards. Design recovery and identity explicitly; do not claim a local flag is payment validation.

## Validation and communication

- Run typecheck and lint before declaring code work complete. Test meaningful game invariants and regressions rather than mirroring trivial implementation details.
- Test actual Release gameplay on iOS simulator; physical-device validation follows user authorization.
- Keep drag and particle animation off per-frame React state. Bound simultaneous sound and visual effects. Honor reduced motion, sound and haptic preferences.
- Desktop engine benchmarks are not device FPS measurements. State which environment and build were measured.
- Send concise Turkish progress updates during sustained work. Never claim pixel-perfect parity or testing that was not actually verified.
- Preserve normal prose in code, docs and commits.
