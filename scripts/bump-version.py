"""
bump-version.py
Auto-bumps patch version and sets today's date in src/lib/version.ts
Usage: python scripts/bump-version.py
"""
import re, subprocess
from datetime import date
from pathlib import Path

VERSION_FILE = Path(__file__).parent.parent / 'apps' / 'web' / 'src' / 'lib' / 'version.ts'

txt = VERSION_FILE.read_text(encoding='utf-8')

# Extract current version
m = re.search(r"APP_VERSION = '(\d+)\.(\d+)\.(\d+)'", txt)
if not m:
    raise SystemExit('ERROR: Cannot find APP_VERSION in version.ts')

major, minor, patch = int(m.group(1)), int(m.group(2)), int(m.group(3))
patch += 1
new_version = f'{major}.{minor}.{patch}'
today = date.today().strftime('%Y-%m-%d')

txt = re.sub(r"APP_VERSION = '\d+\.\d+\.\d+'", f"APP_VERSION = '{new_version}'", txt)
txt = re.sub(r"APP_UPDATED = '\d{4}-\d{2}-\d{2}'", f"APP_UPDATED = '{today}'", txt)

VERSION_FILE.write_text(txt, encoding='utf-8')
print(f'Bumped to v{new_version} ({today})')
