"""Original deterministic water-like synthesis; no sampled third-party audio."""
import wave,struct,math,random
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'assets/audio';out.mkdir(exist_ok=True)
rate=24000
for name,duration,pitch in [('pop',.22,380),('cascade',.38,520),('burst',.6,240),('invalid',.1,180)]:
 rng=random.Random(71);data=[];last=0
 for i in range(int(rate*duration)):
  t=i/rate;u=t/duration;env=(1-u)**2*min(1,t*180);last=.68*last+.32*rng.uniform(-1,1)
  bubble=math.sin(2*math.pi*(pitch*t+190*t*t))*math.exp(-t*15)
  droplets=math.sin(2*math.pi*(950*t-350*t*t))*math.exp(-t*8)
  val=(.43*last+.3*bubble+.14*droplets)*env;data.append(int(max(-.9,min(.9,val))*32767))
 with wave.open(str(out/(name+'.wav')),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(struct.pack('<'+'h'*len(data),*data))
# Quiet loop with pentatonic tones and tapered notes; no bass spikes or clipped samples.
data=[];notes=[220,261.63,293.66,329.63,392,329.63,293.66,261.63]
for i in range(rate*16):
 t=i/rate;note=notes[int(t/2)%8];a=t%2;env=math.sin(math.pi*a/2)**2;value=.08*math.sin(2*math.pi*note*t)*env+.025*math.sin(2*math.pi*note*1.5*t)*env;data.append(int(value*32767))
with wave.open(str(out/'temple.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(struct.pack('<'+'h'*len(data),*data))
