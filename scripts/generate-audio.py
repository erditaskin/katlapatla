"""Prepare CC0 water recordings by rubberduck. No synthetic beep or tone layers."""
from pathlib import Path
import subprocess,json,hashlib
root=Path(__file__).resolve().parents[1];out=root/'assets/audio';src=out/'source'
clips=[('pop','splash_09',.34,-21),('pop-2','splash_10',.30,-21),('pop-3','splash_06',.42,-21),('cascade','splash_03',.68,-20),('burst','splash_01',1.12,-19),('ui-click','bubble_02',.085,-25),('invalid','bubble_03',.14,-25)]
records=[]
for name,source,duration,lufs in clips:
 filters=f'silenceremove=start_periods=1:start_threshold=-45dB,atrim=duration={duration},afade=t=in:d=0.004,afade=t=out:st={duration-.045}:d=0.045,loudnorm=I={lufs}:TP=-2:LRA=7'
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(src/(source+'.ogg')),'-af',filters,'-ar','44100','-ac','1','-c:a','pcm_s16le',str(out/(name+'.wav'))],check=True)
 records.append({'file':name+'.wav','source':source+'.ogg','duration':duration,'targetLUFS':lufs,'sha256':hashlib.sha256((out/(name+'.wav')).read_bytes()).hexdigest()})
subprocess.run(['ffmpeg','-v','error','-y','-i',str(src/'loop_water_01.ogg'),'-af','lowpass=f=1800,loudnorm=I=-32:TP=-8:LRA=5','-ar','44100','-ac','1','-c:a','pcm_s16le',str(out/'temple.wav')],check=True)
(out/'manifest.json').write_text(json.dumps({'author':'rubberduck','license':'CC0 1.0','source':'https://opengameart.org/content/40-cc0-water-splash-slime-sfx','clips':records},indent=2)+'\n')
