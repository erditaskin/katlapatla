# First visual review

Status: design candidates, awaiting user approval. These files are generated with built-in Imagegen; full prompts are in `PROMPTS.md`.

## Palette and balloon sheet

`references/01-balloon-palette-v1.png` shows six normal colors with supporting identity motifs, a heart jet, a gift color-clear power and a pressure balloon. The initial extra upper knots were removed. Normal balloons use a smooth closed top and one bottom tie.

The heart and gift implement the user's visual suggestion as candidates. A line through the heart communicates jet direction. Gift contents are decorative water bubbles, not random rewards.

## Gameplay concept

`references/02-gameplay-v1.png` places the palette in a portrait phone composition: life/gold/settings, level goals and moves, an 8×8 board, score and three helper controls. Screen numbers are illustrative, not economy decisions. The final board should contain 64 balloons; an initially missing bottom-right balloon is corrected before saving the selected reference.

## What this review does not establish

- No React Native code or simulator build exists yet.
- No runtime transparent sprites, exact 48-pixel exports, actual fonts or audio samples have been delivered.
- The concepts are not a measured pixel-perfect implementation contract. Fonts, safe areas, dimensions and responsive behavior must be specified and tested after direction approval.
- Prices, rewards and the combination matrix remain separate product decisions.

Review priorities: material should read as a flexible water balloon rather than glass; six colors and motifs should remain distinct; heart and gift should be recognizable at board size; background and HUD should support the board rather than overwhelm it.
