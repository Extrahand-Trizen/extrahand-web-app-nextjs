"""Extract and display canonical tags from built HTML files."""
import os, re

# Check these specific pages from the Excel
CHECK_PAGES = [
    # services - should have NO trailing slash
    r"out\services\cleaning-services\index.html",
    r"out\services\appliances-services\index.html",
    r"out\services\pest-control-services\index.html",
    # jobs - check _/ placeholder  
    r"out\jobs\index.html",
    r"out\jobs\_\index.html",
    # task
    r"out\task\index.html",
]

CANONICAL_RE = re.compile(r'<link[^>]*rel=["\']canonical["\'][^>]*>', re.IGNORECASE)
HREF_RE      = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)

print("=== CANONICAL TAG AUDIT ===\n")
for rel_path in CHECK_PAGES:
    abs_path = os.path.join(r'E:\Trizent\Content-admin\extrahand-web-app-nextjs', rel_path)
    if not os.path.exists(abs_path):
        print(f"FILE NOT FOUND: {rel_path}")
        continue
    with open(abs_path, encoding='utf-8', errors='replace') as f:
        html = f.read()
    tags = CANONICAL_RE.findall(html)
    if tags:
        for tag in tags:
            href = HREF_RE.search(tag)
            val = href.group(1) if href else "(no href)"
            has_slash = val.endswith('/')
            expected_no_slash = 'services' in rel_path or 'jobs' in rel_path or 'task' in rel_path
            status = "OK " if (not has_slash and expected_no_slash) or (has_slash and not expected_no_slash) else "BAD"
            print(f"[{status}] {rel_path}")
            print(f"      canonical = {val}")
    else:
        print(f"[???] {rel_path} -> NO canonical tag found in HTML")
    print()

# Also scan all services HTML files
print("=== ALL SERVICES HTML FILES - CANONICALS ===\n")
svc_dir = r'E:\Trizent\Content-admin\extrahand-web-app-nextjs\out\services'
bad = []
for root, dirs, files in os.walk(svc_dir):
    for fname in files:
        if fname.endswith('.html'):
            fpath = os.path.join(root, fname)
            with open(fpath, encoding='utf-8', errors='replace') as f:
                html = f.read()
            tags = CANONICAL_RE.findall(html)
            for tag in tags:
                href = HREF_RE.search(tag)
                val = href.group(1) if href else ""
                rel = fpath.replace(r'E:\Trizent\Content-admin\extrahand-web-app-nextjs\out', '')
                if val.endswith('/') and '/services/' in val:
                    bad.append((rel, val))
                    print(f"[TRAILING SLASH] {rel} -> {val}")
                else:
                    print(f"[OK] {rel} -> {val}")

print()
if bad:
    print(f"PROBLEM: {len(bad)} services pages have trailing slash in canonical!")
else:
    print("All services pages verified: canonical has NO trailing slash.")
