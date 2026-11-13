from PIL import Image
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[1]; records=[]
for p in sorted((root/'assets/art').glob('*.png')):
 im=Image.open(p)
 assert im.width>0 and im.height>0
 if p.stem not in ['temple','nile']:
  assert im.mode=='RGBA',p
  assert im.getchannel('A').getextrema()[0]==0,p
 records.append({'file':str(p.relative_to(root)),'size':list(im.size),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(root/'docs/qa/runtime-assets.json').write_text(json.dumps(records,indent=2)+'\n')
print(f'{len(records)} runtime PNG files validated.')
