import os, re

src = r'd:\Dropbox\DB.mr.Krich\PARA\3_Projects\0_Dev\Hyperlocal_community_marketplace\apps\web\src\app'
import_line = "import { AppFooter } from '@/components/app-footer'\n"

changed = []
for root, dirs, files in os.walk(src):
    for f in files:
        if not f.endswith('.tsx'):
            continue
        path = os.path.join(root, f)
        txt = open(path, encoding='utf-8').read()
        if '<AppFooter />' not in txt:
            continue
        if "from '@/components/app-footer'" in txt:
            print('ALREADY IMPORTED:', f)
            continue
        # Insert import after the very first import line
        new = re.sub(r'(import [^\n]+\n)', r'\g<1>' + import_line, txt, count=1)
        if new != txt:
            open(path, 'w', encoding='utf-8').write(new)
            changed.append(f)
            print('ADDED IMPORT:', f)
        else:
            print('FAILED:', f)

print(f'\nTotal: {len(changed)} files updated')
