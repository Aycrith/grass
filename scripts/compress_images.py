from PIL import Image
import os

base = r'C:\Users\camer\DEVNEW\GRASS\apps\web\public'

final = [
    ('services/mulching-new.webp', 'services/mulching-new-optim.webp', 1000, 562, 60),
    ('services/seasonal-cleanup-new.webp', 'services/seasonal-cleanup-new-optim.webp', 1000, 562, 60),
    ('services/hedge-trimming-new.webp', 'services/hedge-trimming-new-optim.webp', 1000, 562, 60),
]

for src, dst, tw, th, q in final:
    img = Image.open(os.path.join(base, src)).convert('RGB')
    img.thumbnail((tw, th), Image.LANCZOS)
    img.save(os.path.join(base, dst), 'WEBP', quality=q, method=6, optimize=True)
    sz = os.path.getsize(os.path.join(base, dst))
    print(f'{src.split("/")[-1]}: {sz//1024}KB')
