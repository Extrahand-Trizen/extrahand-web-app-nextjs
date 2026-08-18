import re
path = r"E:/Trizent/Content-admin/extrahand-web-app-nextjs/out/services/cleaning-services/index.html"
with open(path, encoding="utf-8", errors="replace") as f:
    html = f.read()
m = re.search(r'<link[^>]*canonical[^>]*>', html, re.IGNORECASE)
if m:
    print("TAG:", m.group(0)[:300])
else:
    idx = html.lower().find("canonical")
    if idx >= 0:
        print("CTX:", html[max(0,idx-30):idx+200])
    else:
        print("NOT FOUND")
