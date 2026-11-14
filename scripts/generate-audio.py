"""Reproduce the bundled CC0 recordings with FFmpeg; no runtime audio synthesis."""
from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets/audio"
SOURCE = OUT / "source"
CLIPS = [
    ("pop", "splash_09", .46, -19, True),
    ("pop-2", "splash_10", .42, -19, True),
    ("pop-3", "splash_06", .50, -19, True),
    ("cascade", "splash_03", .82, -18, True),
    ("burst", "splash_01", 1.25, -17, True),
    ("ui-click", "bubble_02", .085, -25, False),
    ("invalid", "bubble_03", .14, -25, False),
]


def run(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *map(str, args)], check=True)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


records = []
for name, source, duration, lufs, layered in CLIPS:
    destination = OUT / (name + ".wav")
    finish = (f"atrim=duration={duration},afade=t=in:d=0.003,"
              f"afade=t=out:st={duration-.065}:d=0.065,"
              f"loudnorm=I={lufs}:TP=-2:LRA=7")
    if layered:
        # A crisp water transient and a separate liquid body, mixed offline.
        graph = (f"[0:a]silenceremove=start_periods=1:start_threshold=-45dB,"
                 f"highpass=f=65,equalizer=f=180:t=q:w=1:g=3[body];"
                 f"[1:a]silenceremove=start_periods=1:start_threshold=-45dB,"
                 f"atrim=duration=0.10,afade=t=out:st=0.04:d=0.06,volume=0.65[attack];"
                 f"[body][attack]amix=inputs=2:normalize=0,{finish}[mix]")
        run("-i", SOURCE / (source + ".ogg"), "-i", SOURCE / "splash_10.ogg",
            "-filter_complex", graph, "-map", "[mix]", "-ar", "44100", "-ac", "1",
            "-c:a", "pcm_s16le", destination)
    else:
        run("-i", SOURCE / (source + ".ogg"), "-af",
            "silenceremove=start_periods=1:start_threshold=-45dB," + finish,
            "-ar", "44100", "-ac", "1", "-c:a", "pcm_s16le", destination)
    records.append({"file": destination.name, "source": source + ".ogg",
                    "waterTransientLayer": layered, "duration": duration,
                    "targetLUFS": lufs, "sha256": digest(destination)})

run("-i", SOURCE / "desert-mystic.mp3", "-af",
    "loudnorm=I=-22:TP=-3:LRA=7,afade=t=in:d=1,afade=t=out:st=38:d=2",
    "-ar", "44100", "-ac", "2", "-c:a", "aac", "-b:a", "128k", OUT / "desert-mystic.m4a")
run("-i", SOURCE / "cat-meow-long.wav", "-af",
    "silenceremove=start_periods=1:start_threshold=-45dB,highpass=f=140,"
    "asetrate=50400,aresample=44100,atempo=0.93,afade=t=in:d=0.02,loudnorm=I=-24:TP=-4:LRA=7",
    "-ar", "44100", "-ac", "1", OUT / "cat-meow.wav")
manifest = {
    "author": "rubberduck", "license": "CC0 1.0",
    "source": "https://opengameart.org/content/40-cc0-water-splash-slime-sfx",
    "clips": records,
    "music": {"file": "desert-mystic.m4a", "author": "PolygonDan", "license": "CC0 1.0",
              "page": "https://opengameart.org/content/desertmystic-dynastic-egyptian-theme-cc0",
              "sha256": digest(OUT / "desert-mystic.m4a")},
    "cat": {"file": "cat-meow.wav", "author": "Joseph SARDIN", "license": "CC0 1.0",
            "page": "https://bigsoundbank.com/meow-cat-6-s1894.html",
            "sha256": digest(OUT / "cat-meow.wav")},
}
(OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
