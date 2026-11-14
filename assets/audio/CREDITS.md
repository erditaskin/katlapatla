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

## Cat guide cue

“Meow cat #6” — Joseph SARDIN / BigSoundBank, CC0 (public domain).
Source/license: https://bigsoundbank.com/meow-cat-6-s1894.html
Original file: https://bigsoundbank.com/UPLOAD/bwf-en/1894.wav

The approximately two-second cue replaces the rejected short Kerzoven recording. The original is preserved as `source/cat-meow-long.wav`. Light pitch raising, filtering and loudness normalization are reproduced by `scripts/generate-audio.py`. The cat's biological sex is not documented by the source. Playback follows the Music setting and is limited by the guide cooldown.
