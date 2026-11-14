# Audio sources

Water, splash and bubble recordings: **rubberduck**, “40 CC0 water / splash / slime SFX”, 29 July 2018.

- Original page and license declaration: https://opengameart.org/content/40-cc0-water-splash-slime-sfx
- Original download: https://opengameart.org/sites/default/files/water-splash-slime-sfx.zip
- License: CC0 1.0 — https://creativecommons.org/publicdomain/zero/1.0/

Selected original OGG files are preserved in source/. WAV outputs use onset trimming, short fades and loudness normalization. The rejected water ambience has been removed; background music is credited below. scripts/generate-audio.py reproduces the edits with FFmpeg. No synthetic oscillator layers remain. Perceptual approval remains the user's judgment; peak/loudness checks alone cannot certify good sound design.

## Background music (replaces the water loop)

“Desert Mystic” — PolygonDan, 31 October 2017. CC0 1.0.

Source and license declaration: https://opengameart.org/content/desertmystic-dynastic-egyptian-theme-cc0

Original: https://opengameart.org/sites/default/files/Desert%20Mystic.mp3

The original is preserved as `source/desert-mystic.mp3`. The bundled M4A is loudness-normalized to -22 LUFS with short entry/exit fades and AAC encoding. This is a modern Egyptian-inspired composition, not a historical reconstruction. The previous water ambience is no longer used.
