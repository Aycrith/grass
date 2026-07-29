"""Swap old service images for new-optim versions, old files backed up as *-old.webp"""
import shutil, os

base = r'C:\Users\camer\DEVNEW\GRASS\apps\web\public'

swaps = [
    # services
    ('services/mowing.webp',         'services/mowing-new-optim.webp'),
    ('services/edging.webp',          'services/edging-new-optim.webp'),
    ('services/mulching.webp',       'services/mulching-new-optim.webp'),
    ('services/hedge-trimming.webp',  'services/hedge-trimming-new-optim.webp'),
    ('services/hurricane-prep.webp', 'services/hurricane-prep-new-optim.webp'),
    ('services/seasonal-cleanup.webp','services/seasonal-cleanup-new-optim.webp'),
    # operator
    ('operator/portrait.webp',       'operator/portrait-new-optim.webp'),
]

for old, new in swaps:
    old_path = os.path.join(base, old)
    new_path = os.path.join(base, new)
    if os.path.exists(new_path):
        if os.path.exists(old_path):
            os.rename(old_path, old_path.replace('.webp', '-old.webp'))
            print(f'backed up: {old}')
        shutil.move(new_path, old_path)
        sz = os.path.getsize(old_path)
        print(f'swapped {old}: {sz//1024}KB')
    else:
        print(f'MISSING: {new_path}')
